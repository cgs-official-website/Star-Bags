
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft as ArrowIcon } from "react-icons/fa";
import { TbCreditCardPay } from "react-icons/tb";
import { GiMoneyStack } from "react-icons/gi";
import PaymentImage from "../../assets/images/payment-icon.png";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import CartItem from "../../components/User/YourCart";
import OrderSummary from "../../components/User/OrderSummary";
import PaymentPopup from "../../components/User/PaymentPopup";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, setDoc } from "firebase/firestore";
import "../../assets/styles/Cart.css";

const BillAddress = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, setCart } = useWishlist();
  const { currentUser } = useAuth();

  // ─── STAGE 1: UNPACK DYNAMIC STATE ROUTING MATRIX ───
  const {
    allCartItems = [],
    cartItems: initialSelected = [],
    rawTotal: passedRawTotal = 0,
    couponPercentageLabel = "",
    appliedCouponCode = "",
    appliedCouponId = "",
    selectedAddress = null,
  } = location.state || {};

  // ─── STAGE 2: PROCESS STATES ───
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cartItems, setCartItems] = useState(initialSelected);
  const [masterCartList, setMasterCartList] = useState(allCartItems);

  const [isOrderingLoader, setIsOrderingLoader] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupDetails, setPopupDetails] = useState({});

  useEffect(() => {
    if (initialSelected.length === 0) {
      navigate("/cart");
    }
    window.scrollTo(0, 0);
  }, [initialSelected, navigate]);

  // ─── STAGE 3: CALCULATIONS AND METRIC LEDGER PARSING ───
  const totalItemsCount = cartItems.reduce(
    (acc, item) => acc + (item.qty || 1),
    0,
  );

  const activeRawTotal =
    cartItems.length > 0
      ? cartItems.reduce((acc, item) => {
          const originalPrice =
            Number(item.realPrice) || Number(item.price) || 0;
          return acc + originalPrice * (item.qty || 1);
        }, 0)
      : passedRawTotal;

  const activeBaseSubTotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * (item.qty || 1),
    0,
  );
  const activeDiscountTotal =
    activeRawTotal > activeBaseSubTotal
      ? activeRawTotal - activeBaseSubTotal
      : 0;

  const couponPercentValue = parseFloat(couponPercentageLabel) || 0;
  const activeCouponDiscount = (activeBaseSubTotal * couponPercentValue) / 100;

  const activeCalculatedSubTotal = activeBaseSubTotal - activeCouponDiscount;
  const activeGstTotal = Math.round(activeCalculatedSubTotal * 0.18);
  const activeFinalTotal = activeCalculatedSubTotal + activeGstTotal;

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item,
      ),
    );
    setMasterCartList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && (item.qty || 1) > 1
          ? { ...item, qty: (item.qty || 1) - 1 }
          : item,
      ),
    );
    setMasterCartList((prev) =>
      prev.map((item) =>
        item.id === id && (item.qty || 1) > 1
          ? { ...item, qty: (item.qty || 1) - 1 }
          : item,
      ),
    );
  };

  // ─── STAGE 4: MASTER ACTION TRYS AND REAL-TIME CART PURGE LAYER ───

  const handlePlaceOrderSubmit = async () => {

    if (!selectedAddress) {
      alert(
        "Please ensure a valid shipping destination address profile is active.",
      );
      return;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const dateString = `${year}${month}${day}`;
    const displayDate = today.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const displayTime = today.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const paymentLabel = paymentMethod === "cod" ? "Cash on delivery" : "Prepaid (Online/Card Payment)";

    const newOrderPayloads = cartItems.map((item, idx) => {
      const productCategory = item.category?.toLowerCase() || "bag";

      let catToken = "BAG";
      if (productCategory === "wallet") catToken = "WLT";
      if (productCategory === "belt") catToken = "BLT";

      const randomCount = String(
        Math.floor(Math.random() * 900) + (idx + 1),
      ).padStart(3, "0");
      const uniqueOrderId = `SBO-${catToken}-${dateString}-${randomCount}`;

      return {
        id: uniqueOrderId,
        productId: item.productId || item.id,
        product: item.name,
        category: catToken,
        status: "Order Placed",
        time: displayDate,
        rating: item.rating || 4.2,
        reviews: item.reviews || 120,

        deliveryDate: "Expected in 5 Days",
        discountedPrice: Number(item.price) * (item.qty || 1),
        originalPrice:
          (Number(item.realPrice) || Number(item.price)) * (item.qty || 1),
        quantity: item.qty ,
        image: item.image ,
        brand: item.brand,
        material: item.material,
        size: item.size ,
        subCategory: item.subCategory ,
      };
    });

    // Write orders to Firestore database
    try {
      for (const orderPayload of newOrderPayloads) {
        const detectCategory = (productName) => {
          const nameLower = productName.toLowerCase();
          if (nameLower.includes("wallet")) return "Wallet";
          if (nameLower.includes("belt")) return "Belt";
          return "Bag";
        };

        const dbOrderPayload = {
          id: orderPayload.id,
          userId: currentUser ? currentUser.uid : "guest",
          productId: orderPayload.productId,
          product: orderPayload.product,
          status: "Order Placed",
          time: displayDate,
          rating: orderPayload.rating,
          reviews: orderPayload.reviews,
          deliveryDate: orderPayload.deliveryDate,
          discountedPrice: orderPayload.discountedPrice,
          originalPrice: orderPayload.originalPrice,
          quantity: orderPayload.quantity,
          image: orderPayload.image,
          brand: orderPayload.brand,
          material: orderPayload.material,
          size: orderPayload.size,
          subCategory: orderPayload.subCategory,
          
          // Schema fields for Admin / OrderManagement.jsx
          items: [
            {
              productId: orderPayload.productId,
              productName: orderPayload.product,
              img: orderPayload.image,
              price: orderPayload.discountedPrice / orderPayload.quantity,
              qty: orderPayload.quantity,
              category: detectCategory(orderPayload.product),
              brand: orderPayload.brand,
              material: orderPayload.material,
              size: orderPayload.size,
              subCategory: orderPayload.subCategory
            }
          ],
          customerDetails: {
            name: selectedAddress?.name || "Customer",
            shippingAddress: selectedAddress 
              ? `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pin}`
              : "No shipping address details",
            email: currentUser ? currentUser.email : "guest@starbags.com",
            mobile: selectedAddress?.mobile || ""
          },
          orderDate: new Date().toISOString(), // ISO String representation of order date
          paymentMode: paymentMethod === "cod" ? "COD" : "Online",
          paymentDetails: {
            itemsCount: orderPayload.quantity,
            itemsTotal: orderPayload.originalPrice,
            discount: Math.max(0, orderPayload.originalPrice - orderPayload.discountedPrice),
            subTotal: orderPayload.discountedPrice,
            gst: Math.round(orderPayload.discountedPrice * 0.18),
            shippingFee: 0,
            total: orderPayload.discountedPrice + Math.round(orderPayload.discountedPrice * 0.18)
          },
          orderType: "Direct"
        };

        await setDoc(doc(db, "orders", orderPayload.id), dbOrderPayload);
        console.log(`Successfully saved order ${orderPayload.id} to Firestore!`);
      }
    } catch (dbErr) {
      console.error("Error saving orders to database:", dbErr);
    }

    // const paymentLabel = 
    //   paymentMethod === "cod" ? "Cash On Delivery" : "Online Payment";
    // setPopupDetails({
    //   amount: `₹${activeFinalTotal.toFixed(2)}`,
    //   transactionId: newOrderPayloads[0]?.id,
    //   paymentMethod: paymentLabel,
    //   date: displayDate,
    //   time: displayTime,
    //   merchant: "Star Bags Premium Factory",
    //   selectedAddress: selectedAddress

    // });

    // Update coupon usedCount in Firestore if a coupon was successfully applied
    if (appliedCouponCode) {
      const updateCouponUsage = async () => {
        try {
          let couponDocRef = null;
          let couponSnap = null;

          if (appliedCouponId) {
            couponDocRef = doc(db, "coupons", appliedCouponId);
            couponSnap = await getDoc(couponDocRef);
          }

          if (!couponSnap || !couponSnap.exists()) {
            // Fallback: query collection for code field matching appliedCouponCode
            const q = query(
              collection(db, "coupons"),
              where("code", "==", appliedCouponCode)
            );
            const querySnap = await getDocs(q);
            if (!querySnap.empty) {
              const matchedDoc = querySnap.docs[0];
              couponDocRef = doc(db, "coupons", matchedDoc.id);
              couponSnap = matchedDoc;
            }
          }

          if (couponSnap && couponSnap.exists() && couponDocRef) {
            const currentUsedCount = Number(couponSnap.data().usedCount) || 0;
            const newUsedCount = currentUsedCount + 1;
            
            // Increment global count on the coupon itself (does not expire globally)
            await updateDoc(couponDocRef, {
              usedCount: newUsedCount
            });
            console.log(
              `Successfully incremented global coupon ${couponSnap.data().code} usedCount to ${newUsedCount}`
            );

            // Update user's personal coupon usage count in users/{uid}
            if (currentUser) {
              try {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userDocRef);
                if (userSnap.exists()) {
                  const userData = userSnap.data();
                  const usedCoupons = userData.usedCoupons || {};
                  
                  const couponKey = couponDocRef.id;
                  const currentUsage = Number(usedCoupons[couponKey]) || 0;
                  
                  const updatedUsedCoupons = {
                    ...usedCoupons,
                    [couponKey]: currentUsage + 1
                  };
                  
                  await updateDoc(userDocRef, {
                    usedCoupons: updatedUsedCoupons
                  });
                  console.log(`Successfully updated user's personal coupon usage for ${couponKey} to ${currentUsage + 1}`);
                }
              } catch (userErr) {
                console.error("Error updating user's usedCoupons map:", userErr);
              }
            }
          } else {
            console.warn(`Coupon not found in DB for code: ${appliedCouponCode} / ID: ${appliedCouponId}`);
          }
        } catch (err) {
          console.error("Error updating coupon usedCount:", err);
        }
      };
      await updateCouponUsage();
    }

    // Purge cart item dependencies out of global hooks directly
    if (setCart) {
      setCart((prevCart) => {
        const currentItems = prevCart || [];
        const updatedCartMesh = currentItems.filter(
          (item) =>
            !cartItems.some(
              (selected) =>
                selected.id === item.id || selected.name === item.name,
            ),
        );

        localStorage.setItem("user_cart", JSON.stringify(updatedCartMesh));
        localStorage.setItem("cart", JSON.stringify(updatedCartMesh));
        localStorage.setItem("cartItems", JSON.stringify(updatedCartMesh));
        return updatedCartMesh;
      });
    }

    // Loader transitions and popup controls
    if (paymentMethod === "online") {
      setIsOrderingLoader(true);
      setTimeout(() => {
        setIsOrderingLoader(false);
        setIsPopupOpen(true);
        setTimeout(() => {
          setIsPopupOpen(false);
          navigate("/orders", { state: { newOrderPayloads } });
        }, 3000);
      }, 4000); // Optimized transition load times cleanly
    } else {
      setIsPopupOpen(true);
      setTimeout(() => {
        setIsPopupOpen(false);
        navigate("/orders", { state: { newOrderPayloads } });
      }, 3000);
    }
  };

  const handleBackToCheckout = () => {
    navigate("/checkout", {
      state: {
        allCartItems: masterCartList,
        cartItems: cartItems,
        couponPercentageLabel: couponPercentageLabel,
        couponCode: appliedCouponCode,
        returnedAddressId: selectedAddress?.id,
      },
    });
  };

  return (
    <div
      className="bill-address-page-root"
      style={{ position: "relative", minHeight: "100vh" }}
    >
      <Navbar />



      {isOrderingLoader && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(5px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20000,
          }}
        >
          <div
            className="spinner-border"
            style={{
              width: "3.8rem",
              height: "3.8rem",
              color: "#8b5cf6",
              borderWidth: "4px",
            }}
            role="status"
          />
          <h4 className="fw-bold text-dark mt-4 mb-2">
            Processing Secure Online Payment...
          </h4>
        </div>
      )}


      <PaymentPopup
        isOpen={isPopupOpen}
        details={popupDetails}
        onClose={() => setIsPopupOpen(false)}
      />

      <div className="cart-page style-page-billing">
        <div className="checkout-header">
          <h2 className="main-title">Billing and Address</h2>
          <button
            className="back-navigation-btn"
            onClick={handleBackToCheckout}
          >
            <ArrowIcon className="me-2" /> Back to Checkout
          </button>
        </div>

        <div className="cart-layout-grid">
          <div className="cart-left">
            <div className="cart-items">
              {cartItems.map((item, index) => (

                <CartItem
                  key={item.id || index}
                  item={item}
                  onIncrease={increaseQty}
                  onDecrease={decreaseQty}
                  showActions={false}
                  showCheckbox={false}
                />

              ))}
            </div>
          </div>

          <div className="cart-right">
            <OrderSummary
              totalItemsCount={totalItemsCount}
              rawTotal={activeRawTotal}
              discountTotal={activeDiscountTotal + activeCouponDiscount}
              subTotal={activeCalculatedSubTotal}
              couponDiscount={activeCouponDiscount}
              couponPercentageLabel={couponPercentageLabel}
              gstTotal={activeGstTotal}
              finalTotal={activeFinalTotal}
              isBillingPage={true}
              paymentMethod={paymentMethod}
              handleCheckout={handlePlaceOrderSubmit}
            />

            <div className="address-box mt-4">
              <div className="address-top">
                <h5>Address</h5>
              </div>
              <div className="address-content">
                {selectedAddress ? (

                  <p>
                    <strong>{selectedAddress.name}</strong>
                    <br />
                    {selectedAddress.address}
                    <br />
                    {selectedAddress.city}, {selectedAddress.state} -{" "}
                    {selectedAddress.pin}
                    <br />
                    Mobile: {selectedAddress.mobile}

                  </p>
                ) : (
                  <p className="text-muted">
                    No selected destination address passed.
                  </p>
                )}
              </div>
            </div>

            <div className="payment-box mt-4">
              <h6 className="payment-title">Payment method</h6>
              <p className="payment-subtitle">Choose a payment method</p>


              <div
                className={`payment-card ${paymentMethod === "cod" ? "active-payment" : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className="payment-left">
                  <input
                    type="radio"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />

                  <div className="payment-icon">
                    <GiMoneyStack />
                  </div>

                  <div>
                    <p className="fw-bold m-0">Cash on delivery</p>
                    <p className="m-0">you pay when your order is delivered</p>
                  </div>
                </div>
              </div>


              <div
                className={`payment-card ${paymentMethod === "online" ? "active-payment" : ""}`}
                onClick={() => setPaymentMethod("online")}
              >
                <div className="payment-left">
                  <input
                    type="radio"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                  />

                  <div className="payment-icon">
                    <TbCreditCardPay />
                  </div>

                  <div>
                    <p className="fw-bold m-0">Online payment</p>
                    <p className="m-0">
                      Pay securely Using UPI, Cards, Net banking & More
                    </p>
                    <span className="payment-icons">
                      <img src={PaymentImage} alt="Payment Methods" />
                    </span>
                  </div>
                </div>
              </div>


              <button
                className="continue-payment-btn"
                onClick={handlePlaceOrderSubmit}
              >

                {paymentMethod === "cod" ? "Place Order" : "Continue Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BillAddress;

// import  { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaArrowLeft as ArrowIcon } from "react-icons/fa";
// import { TbCreditCardPay } from "react-icons/tb";
// import { GiMoneyStack } from "react-icons/gi";
// import PaymentImage from "../../assets/images/payment-icon.png";
// import Navbar from "../../components/User/Navbar";
// import Footer from "../../components/User/Footer";
// import OrderSummary from "../../components/User/OrderSummary";
// import "../../assets/styles/Cart.css";

// const BillAddress = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // ─── STAGE 1: UNPACK DYNAMIC STATE ROUTING MATRIX ───
//   const {
//     cartItems = [],
//     totalItemsCount = 0,
//     rawTotal = 0,
//     discountTotal = 0,
//     subTotal = 0,
//     couponDiscount = 0,
//     couponPercentageLabel = "",
//     gstTotal = 0,
//     finalTotal = 0,
//   } = location.state || {};

//   // ─── STAGE 2: PULL SYNCED ACTIVE ADDRESS FROM PERSISTENT DATABASE ───
//   const [activeAddress, setActiveAddress] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("cod");

//   useEffect(() => {
//     window.scrollTo(0, 0);

//     // If an address-locked verification token wasn't provided, bounce out to checkout safely
//     const rawData = localStorage.getItem("savedAddresses");
//     if (rawData) {
//       const parsed = JSON.parse(rawData);
//       // Fallback fallback: auto-select primary address index if state context is cold
//       if (parsed.length > 0) {
//         setActiveAddress(parsed[0]);
//       }
//     }
//   }, [navigate, location.state]);

//   const handlePlaceOrderSubmit = () => {
//     alert(`Order placed successfully using ${paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}!`);
//     navigate("/");
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="cart-page billing-page-container" style={{ paddingTop: "10px", paddingBottom: "10px" }}>
//         <div className="checkout-title-row mb-2">
//           <h2 className="main-title">Product Checkout</h2>
//           <button
//             className="back-navigation-btn mb-3"
//             onClick={() => navigate("/checkout", { state: { ...location.state } })}
//             type="button"
//           >
//             <ArrowIcon className="me-2" /> Back to Checkout
//           </button>
//         </div>

//         <div className="cart-layout-grid">
//           <div className="cart-left d-flex flex-column gap-2">

//             {/* ─── FIXED DYNAMIC SHIPPING PANEL (MATCHES CHECKOUT EXACTLY) ─── */}
//             <div className="billing-address-summary-box p-3 border rounded bg-light" style={{ margin: 0 }}>
//               <h6 className="section-subtitle-heading">Shipping Destination</h6>
//               {!activeAddress ? (
//                 <p className="text-muted small m-0">No target delivery address specified yet.</p>
//               ) : (
//                 <>
//                   <p className="fw-bold" style={{ fontSize: "0.85rem", margin: "0 0 2px 0" }}>
//                     {activeAddress.name}
//                   </p>
//                   <p className="text-muted" style={{ fontSize: "0.8rem", margin: "0 0 2px 0" }}>
//                     {activeAddress.address}, {activeAddress.city}, {activeAddress.state} - {activeAddress.pin}
//                   </p>
//                   <p className="text-muted" style={{ fontSize: "0.8rem", margin: 0 }}>
//                     Phone: {activeAddress.contact || activeAddress.mobile}
//                   </p>
//                 </>
//               )}
//             </div>

//             {/* REVIEW ITEMS CONTAINER */}
//             <div className="review-items-box border rounded p-3 bg-white" style={{ margin: 0 }}>
//               <h6 className="section-subtitle-heading">Review Items <span style={{ fontSize: "1rem" }}>({cartItems.length})</span></h6>
//               {cartItems.map((item, idx) => (
//                 <div key={item.id || idx} className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
//                   <div className="d-flex align-items-center gap-2">
//                     <img src={item.image} alt={item.name} style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "6px" }} />
//                     <div>
//                       <h6 className="m-0 text-truncate" style={{ maxWidth: "180px", fontSize: "0.85rem" }}>{item.name}</h6>
//                       <small className="text-muted" style={{ fontSize: "0.8rem", fontWeight: "normal" }}>Qty: {item.qty || 1}</small>
//                     </div>
//                   </div>
//                   <span className="fw-semibold" style={{ fontSize: "0.85rem", fontWeight: "bold" }}>₹{(Number(item.price) * (item.qty || 1)).toFixed(2)}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT SIDEBAR CONTROLS */}
//           <div className="cart-right d-flex flex-column gap-2">
//             <OrderSummary
//               totalItemsCount={totalItemsCount}
//               rawTotal={rawTotal}
//               discountTotal={discountTotal}
//               subTotal={subTotal - couponDiscount}
//               couponDiscount={couponDiscount}
//               couponPercentageLabel={couponPercentageLabel}
//               gstTotal={gstTotal}
//               finalTotal={finalTotal}
//               isBillingPage={true}
//               handleCheckout={handlePlaceOrderSubmit}
//             />

//             <div className="payment-box" style={{ margin: 0, padding: "12px" }}>
//               <h6 className="payment-title" style={{ fontSize: "1.1rem", margin: 0 }}>Payment method</h6>
//               <p className="payment-subtitle" style={{ fontSize: "0.75rem", margin: "2px 0 10px 0" }}>Choose a payment method</p>

//               <div
//                 className={`payment-card ${paymentMethod === "cod" ? "active-payment" : ""}`}
//                 onClick={() => setPaymentMethod("cod")}
//                 style={{ cursor: "pointer", padding: "8px", marginBottom: "8px" }}
//               >
//                 <div className="payment-left gap-2">
//                   <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} style={{ width: "14px", height: "14px" }} />
//                   <div className="payment-icon" style={{ width: "26px", height: "26px", fontSize: "0.9rem" }}><GiMoneyStack /></div>
//                   <div>
//                     <p className="fw-bold m-0" style={{ fontSize: "0.8rem" }}>Cash on delivery</p>
//                     <p className="m-0 text-muted" style={{ fontSize: "0.7rem" }}>you pay when your order is delivered</p>
//                   </div>
//                 </div>
//               </div>

//               <div
//                 className={`payment-card ${paymentMethod === "online" ? "active-payment" : ""}`}
//                 onClick={() => setPaymentMethod("online")}
//                 style={{ cursor: "pointer", padding: "8px", marginBottom: "10px" }}
//               >
//                 <div className="payment-left gap-2">
//                   <input type="radio" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} style={{ width: "14px", height: "14px" }} />
//                   <div className="payment-icon" style={{ width: "26px", height: "26px", fontSize: "0.9rem" }}><TbCreditCardPay /></div>
//                   <div>
//                     <p className="fw-bold m-0" style={{ fontSize: "0.8rem" }}>Online payment</p>
//                     <p className="m-0 text-muted" style={{ fontSize: "0.7rem", marginBottom: "2px" }}>Pay securely Using UPI, Cards, Net banking & More</p>
//                     <span className="payment-icons"><img src={PaymentImage} alt="Payment Methods" style={{ width: "65px" }} /></span>
//                   </div>
//                 </div>
//               </div>

//               <button className="continue-payment-btn" onClick={handlePlaceOrderSubmit} style={{ margin: 0, padding: "8px", fontSize: "0.85rem" }}>
//                 Place Order Now
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

