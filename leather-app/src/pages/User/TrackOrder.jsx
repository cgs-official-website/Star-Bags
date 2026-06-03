import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import { generateInvoicePDF } from "../../utils/generateInvoicePDF";
import "../../assets/styles/TrackOrder.css";
import {
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaTruck,
  FaPhoneAlt,
} from "react-icons/fa";
import { MdStorefront, MdCreditCard } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { IoReceiptOutline } from "react-icons/io5";
import ReviewModal from "../../components/User/ReviewModal";
import RecentProduct from "../../components/User/RecentProduct";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductsContext";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";

function StarDisplay({ value, max = 5 }) {
  return (
    <div className="to-star-row">
      {Array.from({ length: max }).map((_, i) =>
        i < value ? (
          <FaStar key={i} className="to-star filled" />
        ) : (
          <FaRegStar key={i} className="to-star empty" />
        ),
      )}
    </div>
  );
}

function TrackOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { currentUser } = useAuth();

  // Extract realtime order payload variables from location router context
  const { order } = location.state || {};

  const matchedProduct = products.find(
    (p) =>
      p.name === order?.product ||
      p.id === order?.productId ||
      p.productId === order?.productId,
  );

  useEffect(() => {
    if (!order) {
      navigate("/orders");
    }
    window.scrollTo(0, 0);
  }, [order, navigate]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalRating, setModalRating] = useState(5);
  const [reviewed, setReviewed] = useState(false);

  // Check Firestore if this order was already reviewed by the user
  useEffect(() => {
    if (!currentUser || !order) return;
    const checkReviewed = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          where("customerId", "==", currentUser.uid),
          where("orderId", "==", order.id),
        );
        const snap = await getDocs(q);
        setReviewed(!snap.empty);
      } catch (err) {
        console.error("Error checking review status:", err);
      }
    };
    checkReviewed();
  }, [currentUser, order]);

  // ─── FIXED SAFE PARSING ENGINE: REMOVED LEGACY DEFAULT VALUES & LINKED PIN PREFIX ───
  const getLivePlacedBillingSpecs = () => {
    const fallbackAddress = {
      name: "",
      address: "",
      cityAndPin: "",
      mobile: "",
      method: "Cash on delivery",
    };

    if (!order) return fallbackAddress;

    const details = order.customerDetails || {};
    const methodStr =
      order.paymentMode || order.paymentMethod || "Cash on delivery";
    const formattedMethod =
      methodStr.toLowerCase().trim() === "cod"
        ? "Cash on delivery"
        : "Online payment";

    if (details.shippingAddress) {
      const addressParts = details.shippingAddress.split(",");
      const streetLine = addressParts[0]?.trim() || "";
      let cityStatePinLine = "";

      if (addressParts.length > 1) {
        // FIXED TRICK: Enforces dynamic clean spacing with dash prefix formatting for pincode bounds
        cityStatePinLine = addressParts
          .slice(1)
          .join(",")
          .trim()
          .replace(/\s*-\s*/, " - ");
      }

      return {
        name: details.name || "",
        address: streetLine,
        cityAndPin: cityStatePinLine,
        mobile: details.mobile || "",
        method: formattedMethod,
      };
    }

    if (order.selectedAddress) {
      const sa = order.selectedAddress;
      const pinSuffix = sa.pin ? ` - ${sa.pin}` : "";
      return {
        name: sa.name || "",
        address: sa.address || "",
        cityAndPin: `${sa.city || ""}${sa.state ? `, ${sa.state}` : ""}${pinSuffix}`,
        mobile: sa.mobile || sa.contact || "",
        method: formattedMethod,
      };
    }

    try {
      const rawOrders = localStorage.getItem("user_orders");
      if (rawOrders) {
        const parsedOrders = JSON.parse(rawOrders);
        const match = parsedOrders.find((o) => o.id === order.id);
        if (match) {
          const md = match.customerDetails || {};
          const msa = match.selectedAddress || {};
          const pinSuffix = msa.pin ? ` - ${msa.pin}` : "";
          return {
            name: md.name || msa.name || "",
            address: msa.address || "",
            cityAndPin: msa.city
              ? `${msa.city}${msa.state ? `, ${msa.state}` : ""}${pinSuffix}`
              : "",
            mobile: md.mobile || msa.mobile || msa.contact || "",
            method: formattedMethod,
          };
        }
      }
    } catch (e) {
      console.error(
        "Local ledger cross-reference parse crash suppressed safely:",
        e,
      );
    }

    return fallbackAddress;
  };

  const billingSpecs = getLivePlacedBillingSpecs();

  const activeOrderSteps = [
    {
      id: 1,
      label: "Order placed",
      desc: `Your order has been logged into the system schema on ${order.time || "today"}.`,
      done: true,
    },
    {
      id: 2,
      label: "Order shipped",
      desc: "Package has cleared store terminal hub and is routed in-transit.",
      done:
        order.status === "Shipped" ||
        order.status === "Out for Delivery" ||
        order.status === "Delivered",
    },
    {
      id: 3,
      label: "Out for delivery",
      desc: "The local delivery agent has captured parcel dispatch bounds.",
      done: order.status === "Out for Delivery" || order.status === "Delivered",
    },
    {
      id: 4,
      label: "Delivered",
      desc:
        order.status === "Delivered"
          ? `Successfully arrived on: ${order.deliveryDate || order.time}`
          : "Safe arrival pending destination grid verification.",
      done: order.status === "Delivered",
    },
  ];

  const handleReviewSubmit = async (rating, text) => {
    if (!currentUser || !order) return;
    try {
      let customerName = currentUser.email || "Anonymous User";
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) {
          customerName =
            snap.data().name || snap.data().displayName || customerName;
        }
      } catch (_) {}

      const realProductId =
        matchedProduct?.id ||
        order.productId ||
        order.items?.[0]?.productId ||
        order.id;

      const reviewPayload = {
        productId: realProductId,
        productName: order.product,
        image: order.image || "",
        customerId: currentUser.uid,
        customerName,
        orderId: order.id,
        text: text.trim(),
        rating: Number(rating),
        likes: [],
        dislikes: [],
        likeCount: 0,
        dislikeCount: 0,
        date: new Date(),
        isHidden: false,
      };

      await addDoc(collection(db, "reviews"), reviewPayload);
      setReviewed(true);
      setModalOpen(false);
    } catch (err) {
      console.error(
        "Error submitting product review through track engine:",
        err,
      );
      alert("Failed to submit review. Please try again.");
    }
  };

  const itemsPrice =
    Number(order.originalPrice) || Number(order.discountedPrice) || 0;
  const finalPrice = Number(order.discountedPrice) || 0;
  const savings = itemsPrice > finalPrice ? itemsPrice - finalPrice : 0;
  const billingGstAmount = Math.round(finalPrice * 0.18);
  const absoluteGrandTotal = finalPrice + billingGstAmount;

  return (
    <div
      className="track-order-application-scope-wrapper"
      style={{  minHeight: "100vh" }}
    >
      <Navbar />

      <div className="container to-page py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 to-header-row">
          <h4 className="to-page-title m-0 fw-bold">
            Track Order ID: <span style={{ color: "#8b5cf6" }}>{order.id}</span>
          </h4>
          <button
            className="btn btn-sm btn-outline-secondary fw-bold px-3 to-back-btn"
            onClick={() => navigate("/orders")}
            style={{ borderRadius: "6px" }}
          >
            ← Back to List
          </button>
        </div>

        <div className="to-main-grid">
          <div className="to-left">
            {/* PRODUCT SPEC DETAIL VIEW BLOCK */}
            <div className="to-card to-product-card border bg-white">
              <div className="to-product-info d-flex gap-3">
                <img
                  src={order.image || "../src/assets/images/leather1.png"}
                  alt={order.product}
                  className="to-product-img rounded"
                  style={{ objectFit: "cover", border: "1px solid #f1f5f9" }}
                />
                <div className="to-product-details flex-grow-1">
                  <div className="to-product-title-row">
                    <h6
                      className="to-product-name fw-bold mb-1 text-dark"
                      style={{ fontSize: "1.1rem" }}
                    >
                      {order.product}
                    </h6>
                    {matchedProduct && (
                      <div
                        className="to-product-rating-badge badge bg-light text-dark border p-2 d-flex align-items-center gap-1"
                        style={{ height: "fit-content", fontWeight: "700" }}
                      >
                        <FaStar style={{ color: "#f59e0b" }} />{" "}
                        {Number(matchedProduct.rating || 0).toFixed(1)}
                      </div>
                    )}
                  </div>
                  <p className="to-product-sub text-muted small mb-2">
                    Premium Crafted Edition
                  </p>
                  <div className="to-product-price-row d-flex align-items-baseline gap-2 mb-2">
                    <span
                      className="to-product-price fw-bold text-dark"
                      style={{ fontSize: "1.15rem" }}
                    >
                      ₹{finalPrice}
                    </span>
                    {itemsPrice > finalPrice && (
                      <del className="to-product-real text-muted small">
                        ₹{itemsPrice}
                      </del>
                    )}
                  </div>
                  <p className="to-product-qty m-0 text-secondary small">
                    Qty: {order.quantity || 1} &nbsp;|&nbsp; Date: {order.time}
                  </p>
                </div>
              </div>
            </div>

            {/* LIVE DYNAMIC TIMELINE STATUS PROGRESS CARD */}
            <div className="to-card border bg-white">
              <h6
                className="to-section-title fw-bold mb-4 text-dark"
                style={{ fontSize: "1rem" }}
              >
                Order tracking status
              </h6>
              <div className="to-timeline d-flex flex-column gap-3">
                {activeOrderSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`to-step d-flex gap-3 ${step.done ? "done" : "pending"}`}
                  >
                    <div className="to-step-left d-flex flex-column align-items-center">
                      <div
                        className="to-step-dot"
                        style={{
                          color: step.done ? "#8b5cf6" : "#9ca3af",
                          fontSize: "1.2rem",
                        }}
                      >
                        {step.done ? (
                          <FaCheckCircle />
                        ) : (
                          <span
                            className="dot-circle"
                            style={{
                              display: "block",
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: "#9ca3af",
                              marginTop: "3px",
                            }}
                          />
                        )}
                      </div>
                      {idx < activeOrderSteps.length - 1 && (
                        <div
                          className="to-step-line"
                          style={{
                            width: "2px",
                            flexGrow: 1,
                            backgroundColor:
                              step.done && activeOrderSteps[idx + 1].done
                                ? "#8b5cf6"
                                : "#9ca3af",
                            minHeight: "40px",
                            margin: "4px 0",
                          }}
                        />
                      )}
                    </div>
                    <div className="to-step-content pb-3">
                      <div
                        className="to-step-label fw-bold text-dark"
                        style={{ fontSize: "0.95rem" }}
                      >
                        {step.label}
                        {idx === 0 && (
                          <span className="to-step-date text-muted font-monospace small fw-normal">
                            &nbsp;— {order.time}
                          </span>
                        )}
                      </div>
                      <p
                        className="to-step-desc text-muted small m-0 mt-1"
                        style={{ lineHeight: "1.4" }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RATINGS CAPTURE SYSTEM BLOCK */}
            <div
              className="to-card to-rating-card border bg-white d-flex justify-content-between align-items-center"
              onClick={() =>
                order.status === "Delivered" && !reviewed && setModalOpen(true)
              }
              style={{
                cursor:
                  order.status === "Delivered" && !reviewed
                    ? "pointer"
                    : "default",
              }}
            >
              <div>
                <p
                  className="to-rating-prompt fw-bold m-0 text-dark"
                  style={{ fontSize: "0.95rem" }}
                >
                  {reviewed
                    ? "Your feedback has been verified"
                    : order.status === "Delivered"
                      ? "Give Us your rating"
                      : "Rate after delivery"}
                </p>
                {order.status !== "Delivered" && !reviewed && (
                  <p className="text-muted small m-0 mt-1">
                    You can rate this product once it is delivered.
                  </p>
                )}
                {reviewed && (
                  <p className="to-rating-submitted-text text-success small fw-semibold m-0 mt-1 d-flex align-items-center gap-1">
                    <span style={{ fontSize: "1.1rem" }}>✓</span> Review
                    Submitted Successfully
                  </p>
                )}
              </div>
              {reviewed ? (
                <span
                  className="text-success fw-bold"
                  style={{ fontSize: "1.2rem" }}
                >
                  ✓
                </span>
              ) : order.status === "Delivered" ? (
                <StarDisplay value={modalRating} />
              ) : (
                <span className="text-muted" style={{ fontSize: "1.4rem" }}>
                  🔒
                </span>
              )}
            </div>
          </div>

          <div className="to-right d-flex flex-column gap-3">
            {/* ─── DYNAMIC SHIPPING ADDRESS SUMMARY MATCHING SCREENSHOT EXACTLY ─── */}
            <div className="to-card border bg-white">
              <h6 className="to-section-title fw-bold mb-3 text-dark">
                Address Profile Customer
              </h6>
              <div className="to-address-block">
                <p className="to-address-sub-title fw-bold text-secondary small mb-2 d-flex align-items-center gap-1">
                  <TbTruckDelivery className="to-addr-icon text-purple" />{" "}
                  Shipping Address
                </p>

                <p
                  className="to-addr-name fw-bold text-dark m-0"
                  style={{ fontSize: "1.05rem" }}
                >
                  {billingSpecs?.name || ""}
                </p>
                <p
                  className="to-addr-line text-muted small mt-1 mb-0"
                  style={{ fontSize: "0.88rem" }}
                >
                  {billingSpecs?.address || ""}
                </p>
                <p
                  className="to-addr-line text-muted small m-0"
                  style={{ fontSize: "0.88rem" }}
                >
                  {billingSpecs?.cityAndPin || ""}
                </p>
                {billingSpecs?.mobile && (
                  <p
                    className="to-addr-line small m-0 mt-1 fw-semibold"
                    style={{
                      fontSize: "0.88rem",
                     // color: "#1e293b",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ fontWeight: "bold", opacity: 0.6 }}>
                      MOBILE :
                    </span>{" "}
                    {billingSpecs.mobile}
                  </p>
                )}

                <div className="to-delivery-meta d-flex flex-column gap-2 mt-3">
                  <span
                    className="to-meta-badge bg-light border rounded px-3 py-1.5 small fw-semibold text-dark"
                    style={{ textTransform: "capitalize" }}
                  >
                    <MdCreditCard className="me-1 text-purple" /> Method:{" "}
                    {billingSpecs?.method || "Cash on delivery"}
                  </span>
                  <span className="to-meta-badge bg-light border rounded px-3 py-1.5 small fw-semibold text-dark">
                    <FaTruck className="me-1 text-purple" />{" "}
                    {order.deliveryDate || "Expected inside 5 Days"}
                  </span>
                </div>
              </div>

              <hr
                className="to-divider my-3"
                style={{ borderTop: "1px dashed #e5e7eb" }}
              />

              <div className="to-address-block">
                <p className="to-address-sub-title fw-bold text-secondary small mb-2 d-flex align-items-center gap-1">
                  <MdStorefront className="to-addr-icon text-purple" /> Store
                  Merchant Address
                </p>
                <p className="to-addr-name fw-bold text-dark m-0">
                  Star Bags Premium Factory
                </p>
                <p
                  className="to-addr-line text-muted small mt-1 mb-2"
                  style={{ lineHeight: "1.4" }}
                >
                  No 554, Vannikamvalam Opposite, Old Bus Stand Road, Bhavani
                  Main Road, Perundurai-638052, Tamil Nadu
                </p>
                <p className="to-addr-line text-dark fw-semibold small m-0 d-flex align-items-center gap-1">
                  <FaPhoneAlt
                    style={{ fontSize: "0.75rem" }}
                    className="text-secondary"
                  />{" "}
                  Support Phone: 97999 02475
                </p>
              </div>
            </div>

            <div className="to-card border bg-white">
              <h6 className="to-section-title fw-bold mb-3 text-dark">
                Order Summary
              </h6>
              <div className="to-summary-table d-flex flex-column gap-2">
                <div className="to-summary-row d-flex justify-content-between text-secondary small">
                  <span>Items ({order.quantity || 1})</span>
                  <span>₹{itemsPrice}.00</span>
                </div>
                {savings > 0 && (
                  <div className="to-summary-row discount d-flex justify-content-between text-secondary  small fw-semibold">
                    <span>Discount</span>
                    <span className="text-success">−₹{savings}.00</span>
                  </div>
                )}
                <div className="to-summary-row d-flex justify-content-between text-secondary small">
                  <span>Sub total</span>
                  <span>₹{finalPrice}.00</span>
                </div>
                <div className="to-summary-row d-flex justify-content-between text-secondary small">
                  <span>GST Include (18%)</span>
                  <span>₹{billingGstAmount}.00</span>
                </div>
                <hr className="to-divider my-2" />
                <div className="to-summary-row total d-flex justify-content-between fw-bold text-dark fs-5">
                  <span>Total</span>
                  <span style={{ color: "#8b5cf6" }}>
                    ₹{absoluteGrandTotal}.00
                  </span>
                </div>
              </div>

              <button
                className="to-invoice-btn btn w-100 text-white mt-4 fw-bold d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#8b5cf6",
                  gap: "6px",
                  height: "44px",
                  borderRadius: "8px",
                }}
                onClick={() =>
                  generateInvoicePDF({
                    order,
                    userAddress: {
                      name: billingSpecs?.name || "",
                      address: `${billingSpecs?.address || ""}, ${billingSpecs?.cityAndPin || ""}`,
                      mobile: billingSpecs?.mobile || "",
                    },
                    itemsPrice,
                    savings,
                    finalPrice: absoluteGrandTotal,
                  })
                }
              >
                <IoReceiptOutline style={{ fontSize: "1.15rem" }} /> Download
                Invoice
              </button>
            </div>
          </div>
        </div>

        <section className="to-suggestions mt-5">
          <RecentProduct />
        </section>
      </div>

      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleReviewSubmit}
        rating={modalRating}
        setRating={setModalRating}
      />

      <Footer />
    </div>
  );
}

export default TrackOrder;



// import { useLocation, useNavigate } from "react-router-dom";
// import Navbar from "../../components/User/Navbar";
// import Footer from "../../components/User/Footer";
// import InvoicePopup from "../../components/User/InvoicePopup"; 
// import "../../assets/styles/TrackOrder.css";
// import {
//   FaStar,
//   FaRegStar,
//   FaCheckCircle,
//   FaTruck,
//   FaPhoneAlt,
// } from "react-icons/fa";
// import {
//   MdStorefront,
//   MdCreditCard,
// } from "react-icons/md";
// import { TbTruckDelivery } from "react-icons/tb";
// import { IoReceiptOutline } from "react-icons/io5";
// import ReviewModal from "../../components/User/ReviewModal";
// import RecentProduct from "../../components/User/RecentProduct";
// import { useAuth } from "../../context/AuthContext";
// import { useProducts } from "../../context/ProductsContext";
// import { db } from "../../firebase";
// import { collection, query, where, getDocs, addDoc, doc, getDoc } from "firebase/firestore";

// function StarDisplay({ value, max = 5 }) {
//   return (
//     <div className="to-star-row">
//       {Array.from({ length: max }).map((_, i) =>
//         i < value ? (
//           <FaStar key={i} className="to-star filled" />
//         ) : (
//           <FaRegStar key={i} className="to-star empty" />
//         )
//       )}
//     </div>
//   );
// }


// function TrackOrder() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { products } = useProducts();

//   // Extract realtime order payload variables from location router context
//   const { order } = location.state || {};

//   const matchedProduct = products.find(
//     (p) => p.name === order?.product || p.id === order?.productId || p.productId === order?.productId
//   );

//   useEffect(() => {
//     if (!order) {
//       navigate("/orders");
//     }
//     window.scrollTo(0, 0);
//   }, [order, navigate]);

//   const { currentUser } = useAuth();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalRating, setModalRating] = useState(5);
//   const [reviewed, setReviewed] = useState(false);
//   const [invoicePopupOpen, setInvoicePopupOpen] = useState(false);

//   // Check Firestore if this order was already reviewed by the user
//   useEffect(() => {
//     if (!currentUser || !order) return;
//     const checkReviewed = async () => {
//       try {
//         const q = query(
//           collection(db, "reviews"),
//           where("customerId", "==", currentUser.uid),
//           where("orderId", "==", order.id)
//         );
//         const snap = await getDocs(q);
//         setReviewed(!snap.empty);
//       } catch (err) {
//         console.error("Error checking review status:", err);
//       }
//     };
//     checkReviewed();
//   }, [currentUser, order]);

//   // ─── FIXED REAL-TIME DATABINDING FALLBACK MATRIX TRICK ───
//   // Extractor Engine: Attempts to read directly from the parent order object block context.
//   // If it's missing (e.g. state transition loose), it scans the master storage ledger to sync the exact billing values dynamically.
//   const getLivePlacedBillingSpecs = () => {
//     if (!order) return { address: null, method: "Cash on delivery" };

//     // 1. Direct validation check from the route payload
//     if (order.selectedAddress || order.addressProfile) {
//       return {
//         address: order.selectedAddress || order.addressProfile,
//         method: order.paymentMethod || order.paymentMode || "Cash on delivery"
//       };
//     }

//     // 2. Local storage ledger scanner logic match fallback rule
//     try {
//       const rawOrders = localStorage.getItem("user_orders");
//       if (rawOrders) {
//         const parsedOrders = JSON.parse(rawOrders);
//         const match = parsedOrders.find((o) => o.id === order.id);
//         if (match && (match.selectedAddress || match.address)) {
//           return {
//             address: match.selectedAddress || match.address,
//             method: match.paymentMethod || match.paymentMode || "Cash on delivery"
//           };
//         }
//       }

//       // 3. Last fallback: Capture active global addresses array instance cache profile
//       const rawAddr = localStorage.getItem("savedAddresses");
//       if (rawAddr) {
//         const parsedAddr = JSON.parse(rawAddr);
//         if (parsedAddr.length > 0) {
//           return {
//             address: parsedAddr[0],
//             method: "Cash on delivery"
//           };
//         }
//       }
//     } catch (e) { console.error("Billing tracking parser sync issue:", e); }

//     // Blueprint hardcoded display schema if profile setup parameters are blank tokens
//     return {
//       address: {
//         name: "Rahul Sharma",
//         address: "Flat No. 302, Sai Residency",
//         city: "Mumbai",
//         state: "Maharashtra",
//         pin: "400058",
//         mobile: "9876543210"
//       },
//       method: "Cash on delivery"
//     };
//   };

//   const billingSpecs = getLivePlacedBillingSpecs();
//   const placedDeliveryAddress = billingSpecs.address;
//   const placedPaymentMethod = billingSpecs.method;

//   if (!order) return null;

//   const activeOrderSteps = [
//     {
//       id: 1,
//       label: "Order placed",
//       desc: `Your order has been logged into the system schema on ${order.time || "today"}.`,
//       done: true,
//     },
//     {
//       id: 2,
//       label: "Order shipped",
//       desc: "Package has cleared store terminal hub and is routed in-transit.",
//       done: order.status === "Shipped" || order.status === "Out for Delivery" || order.status === "Delivered",
//     },
//     {
//       id: 3,
//       label: "Out for delivery",
//       desc: "The local delivery agent has captured parcel dispatch bounds.",
//       done: order.status === "Out for Delivery" || order.status === "Delivered",
//     },
//     {
//       id: 4,
//       label: "Delivered",
//       desc: order.status === "Delivered" ? `Successfully arrived on: ${order.deliveryDate || order.time}` : "Safe arrival pending destination grid verification.",
//       done: order.status === "Delivered",
//     },
//   ];

//   const handleReviewSubmit = async (rating, text) => {
//     if (!currentUser || !order) return;
//     try {
//       let customerName = currentUser.email || "Anonymous User";
//       try {
//         const snap = await getDoc(doc(db, "users", currentUser.uid));
//         if (snap.exists()) {
//           customerName = snap.data().name || snap.data().displayName || customerName;
//         }
//       } catch (_) {}

//       const matchedProduct = products.find(
//         (p) => p.name === order.product || p.id === order.productId || p.productId === order.productId
//       );
//       const realProductId = matchedProduct?.id || order.productId || order.items?.[0]?.productId || order.id;

//       const reviewPayload = {
//         productId: realProductId,
//         productName: order.product,
//         image: order.image || "",
//         customerId: currentUser.uid,
//         customerName,
//         orderId: order.id,
//         text: text.trim(),
//         rating: Number(rating),
//         likes: [],
//         dislikes: [],
//         likeCount: 0,
//         dislikeCount: 0,
//         date: new Date(),
//         isHidden: false,
//       };

//       await addDoc(collection(db, "reviews"), reviewPayload);
//       setReviewed(true);
//       setModalOpen(false);
//     } catch (err) {
//       console.error("Error submitting review:", err);
//       alert("Failed to submit review. Please try again.");
//     }
//   };

//   const itemsPrice = Number(order.originalPrice) || Number(order.discountedPrice) || 0;
//   const finalPrice = Number(order.discountedPrice) || 0;
//   const savings = itemsPrice > finalPrice ? itemsPrice - finalPrice : 0;

//   return (
//     <div className="track-order-application-scope-wrapper" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
//       <Navbar />

//       <div className="container to-page py-4">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h4 className="to-page-title m-0 fw-bold">
//             Track Order ID: <span style={{ color: "#8b5cf6" }}>{order.id}</span>
//           </h4>
//           <button
//             className="btn btn-sm btn-outline-secondary fw-bold px-3"
//             onClick={() => navigate("/orders")}
//             style={{ borderRadius: "6px" }}
//           >
//             ← Back to List
//           </button>
//         </div>

//         <div className="to-main-grid">
//           <div className="to-left">
            
//             {/* PRODUCT SPEC DETAIL VIEW BLOCK */}
//             <div className="to-card to-product-card border rounded-3 p-4 bg-white shadow-sm">
//               <div className="to-product-info d-flex align-items-center gap-3">
//                 <img
//                   src={order.image || "../src/assets/images/leather1.png"}
//                   alt={order.product}
//                   className="to-product-img rounded"
//                   style={{ width: "90px", height: "90px", objectFit: "cover", border: "1px solid #f1f5f9" }}
//                 />
//                 <div className="to-product-details flex-grow-1">
//                   <h6 className="to-product-name fw-bold mb-1 text-dark" style={{ fontSize: "1.1rem" }}>{order.product}</h6>
//                   <p className="to-product-sub text-muted small mb-2">Premium Crafted Edition</p>
//                   <div className="to-product-price-row d-flex align-items-baseline gap-2 mb-2">
//                     <span className="to-product-price fw-bold text-dark" style={{ fontSize: "1.15rem" }}>₹{finalPrice}</span>
//                     {itemsPrice > finalPrice && (
//                       <del className="to-product-real text-muted small">₹{itemsPrice}</del>
//                     )}
//                   </div>
//                   <p className="to-product-qty m-0 text-secondary small">
//                     Qty: {order.quantity || 1} &nbsp;|&nbsp; Date: {order.time}
//                   </p>
//                 </div>
//                 {matchedProduct && (
//                   <div className="to-product-rating-badge badge bg-light text-dark border p-2 d-flex align-items-center gap-1" style={{ height: "fit-content", fontWeight: "700" }}>
//                     <FaStar style={{ color: "#f59e0b" }} /> {Number(matchedProduct.rating || 0).toFixed(1)}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* LIVE DYNAMIC TIMELINE STATUS PROGRESS CARD */}
//             <div className="to-card border rounded-3 p-4 bg-white shadow-sm">
//               <h6 className="to-section-title fw-bold mb-4 text-dark" style={{ fontSize: "1rem" }}>Order tracking status</h6>
//               <div className="to-timeline d-flex flex-column gap-3">
//                 {activeOrderSteps.map((step, idx) => (
//                   <div key={step.id} className={`to-step d-flex gap-3 ${step.done ? "done" : "pending"}`}>
//                     <div className="to-step-left d-flex flex-column align-items-center">
//                       <div className="to-step-dot" style={{ color: step.done ? "#16a34a" : "#d1d5db", fontSize: "1.2rem" }}>
//                         {step.done ? <FaCheckCircle /> : <span className="dot-circle" style={{ display: "block", width: "12px", height: "12px", borderRadius: "50%", border: "2px solid #d1d5db", backgroundColor: "#fff", marginTop: "4px" }} />}
//                       </div>
//                       {idx < activeOrderSteps.length - 1 && (
//                         <div className="to-step-line" style={{ width: "2px", flexGrow: 1, backgroundColor: step.done && activeOrderSteps[idx + 1].done ? "#16a34a" : "#e5e7eb", minHeight: "40px", margin: "4px 0" }} />
//                       )}
//                     </div>
//                     <div className="to-step-content pb-3">
//                       <div className="to-step-label fw-bold text-dark" style={{ fontSize: "0.95rem" }}>
//                         {step.label}
//                         {idx === 0 && <span className="to-step-date text-muted font-monospace small fw-normal">&nbsp;— {order.time}</span>}
//                       </div>
//                       <p className="to-step-desc text-muted small m-0 mt-1" style={{ lineHeight: "1.4" }}>{step.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* RATINGS CAPTURE SYSTEM BLOCK */}
//             <div
//               className="to-card to-rating-card border rounded-3 p-4 bg-white shadow-sm d-flex justify-content-between align-items-center"
//               onClick={() => order.status === "Delivered" && !reviewed && setModalOpen(true)}
//               style={{ cursor: order.status === "Delivered" && !reviewed ? "pointer" : "default" }}
//             >
//               <div>
//                 <p className="to-rating-prompt fw-bold m-0 text-dark" style={{ fontSize: "0.95rem" }}>
//                   {reviewed
//                     ? "Your feedback has been verified"
//                     : order.status === "Delivered"
//                     ? "Give Us your rating"
//                     : "Rate after delivery"}
//                 </p>
//                 {order.status !== "Delivered" && !reviewed && (
//                   <p className="text-muted small m-0 mt-1">You can rate this product once it is delivered.</p>
//                 )}
//                 {reviewed && (
//                   <p className="to-rating-submitted-text text-success small fw-semibold m-0 mt-1 d-flex align-items-center gap-1">
//                     <span style={{ fontSize: "1.1rem" }}>✓</span> Review Submitted Successfully
//                   </p>
//                 )}
//               </div>
//               {reviewed
//                 ? <span className="text-success fw-bold" style={{ fontSize: "1.2rem" }}>✓</span>
//                 : order.status === "Delivered"
//                 ? <StarDisplay value={modalRating} />
//                 : <span className="text-muted" style={{ fontSize: "1.4rem" }}>🔒</span>
//               }
//             </div>

//             <ReviewModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleReviewSubmit} rating={modalRating} setRating={setModalRating} />

//           </div>

//           {/* RIGHT PANELS SIDE BAR COLUMNS */}
//           <div className="to-right d-flex flex-column gap-3">
            
//             {/* REAL USER DELIVERED ADDRESS CARDS HOOK MAPPING */}
//             <div className="to-card border rounded-3 p-4 bg-white shadow-sm">
//               <h6 className="to-section-title fw-bold mb-3 text-dark">Address Profile Customer</h6>
//               <div className="to-address-block">
//                 <p className="to-address-sub-title fw-bold text-secondary small mb-2 d-flex align-items-center gap-1">
//                   <TbTruckDelivery className="to-addr-icon text-purple" /> Delivery Destination
//                 </p>
//                 <p className="to-addr-name fw-bold text-dark m-0" style={{ fontSize: "0.95rem" }}>{placedDeliveryAddress.name}</p>
//                 <p className="to-addr-line text-muted small mt-1 mb-0">{placedDeliveryAddress.address}</p>
//                 <p className="to-addr-line text-muted small m-0">
//                   {placedDeliveryAddress.city}{placedDeliveryAddress.state ? `, ${placedDeliveryAddress.state}` : ""} {placedDeliveryAddress.pin ? `- ${placedDeliveryAddress.pin}` : ""}
//                 </p>
                
//                 <div className="to-delivery-meta d-flex flex-column gap-2 mt-3">
//                   <span className="to-meta-badge bg-light border rounded px-3 py-1.5 small fw-semibold text-dark" style={{ textTransform: "capitalize" }}>
//                     <MdCreditCard className="me-1 text-purple" /> Method: {placedPaymentMethod}
//                   </span>
//                   <span className="to-meta-badge bg-light border rounded px-3 py-1.5 small fw-semibold text-dark">
//                     <FaTruck className="me-1 text-purple" /> {order.deliveryDate || "Expected inside 5 Days"}
//                   </span>
//                 </div>
//               </div>

//               <hr className="to-divider my-3" style={{ borderTop: "1px dashed #e5e7eb" }} />

//               {/* MERCHANTS LOCATION CONFIGURATION SUB-PANELS */}
//               <div className="to-address-block">
//                 <p className="to-address-sub-title fw-bold text-secondary small mb-2 d-flex align-items-center gap-1">
//                   <MdStorefront className="to-addr-icon text-purple" /> Store Merchant Address
//                 </p>
//                 <p className="to-addr-name fw-bold text-dark m-0">Star Bags Premium Factory</p>
//                 <p className="to-addr-line text-muted small mt-1 mb-2" style={{ lineHeight: "1.4" }}>
//                   No 554, Vannikamvalam Opposite, Old Bus Stand Road, Bhavani Main Road, Perundurai-638052, Tamil Nadu
//                 </p>
//                 <p className="to-addr-line text-dark fw-semibold small m-0 d-flex align-items-center gap-1">
//                   <FaPhoneAlt style={{ fontSize: "0.75rem" }} className="text-secondary" /> Support Phone: 97999 02475
//                 </p>
//               </div>
//             </div>

//             {/* LIVE PRICE ANALYSIS MATRIX COMPLIANT TRADING CARD LEDGER */}
//             <div className="to-card border rounded-3 p-4 bg-white shadow-sm">
//               <h6 className="to-section-title fw-bold mb-3 text-dark">Order Pricing Invoice Summary</h6>
//               <div className="to-summary-table d-flex flex-column gap-2">
//                 <div className="to-summary-row d-flex justify-content-between text-secondary small">
//                   <span>Items Base Total ({order.quantity || 1})</span>
//                   <span>₹{itemsPrice}.00</span>
//                 </div>
//                 {savings > 0 && (
//                   <div className="to-summary-row discount d-flex justify-content-between text-success small fw-semibold">
//                     <span>Discount Coupon/Offer Deductions</span>
//                     <span>−₹{savings}.00</span>
//                   </div>
//                 )}
//                 <div className="to-summary-row d-flex justify-content-between text-secondary small">
//                   <span>Sub total valuation</span>
//                   <span>₹{finalPrice}.00</span>
//                 </div>
//                 <div className="to-summary-row d-flex justify-content-between text-secondary small">
//                   <span>GST Taxes breakdown (Included 18%)</span>
//                   <span>₹{Math.round(finalPrice * 0.18)}.00</span>
//                 </div>
//                 <hr className="to-divider my-2" />
//                 <div className="to-summary-row total d-flex justify-content-between fw-bold text-dark fs-5">
//                   <span>Net Amount Paid</span>
//                   <span>₹{finalPrice}.00</span>
//                 </div>
//               </div>
              
//               <button
//                 className="to-invoice-btn btn w-100 text-white mt-4 fw-bold d-flex align-items-center justify-content-center"
//                 style={{ backgroundColor: "#8b5cf6", gap: "6px", height: "44px", borderRadius: "8px" }}
//                 onClick={() => setInvoicePopupOpen(true)}
//               >
//                 <IoReceiptOutline style={{ fontSize: "1.15rem" }} /> Download Invoice
//               </button>
//             </div>

//           </div>
//         </div>

//         <section className="to-suggestions mt-5">
//           <RecentProduct />
//         </section>
//       </div>

//       {/* DYNAMIC PIPING INVOICE POPUP TERMINAL SCREEN */}
//       <InvoicePopup 
//         isOpen={invoicePopupOpen}
//         onClose={() => setInvoicePopupOpen(false)}
//         order={order}
//         userAddress={placedDeliveryAddress}
//         paymentMethod={placedPaymentMethod}
//         itemsPrice={itemsPrice}
//         savings={savings}
//         finalPrice={finalPrice}
//       />

//       <Footer />
//     </div>
//   );
// }

// export default TrackOrder;

