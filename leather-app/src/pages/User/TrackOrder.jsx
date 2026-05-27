import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // IMPORTED
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import "../../assets/styles/TrackOrder.css";
import {
  FaStar,
  FaRegStar,
  FaHeart,
  FaRegHeart,
  FaCheckCircle,
  FaTruck,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaDownload,
} from "react-icons/fa";
import {
  MdOutlineShoppingCart,
  MdStorefront,
  MdCreditCard,
} from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { IoReceiptOutline } from "react-icons/io5";
import ReviewModal from "../../components/User/ReviewModal";
import RecentProduct from "../../components/User/RecentProduct";

const orderSteps = [
  {
    id: 1,
    label: "Order placed",
    date: "Tuesday, 28 Apr 13",
    desc: "Your order has been placed. \nItems from : leather M",
    done: true,
  },
  {
    id: 2,
    label: "Order shipped",
    date: "",
    desc: "Your order has been placed.\nPin receipt : 24m",
    done: true,
  },
  {
    id: 3,
    label: "Out for delivery",
    date: "",
    desc: "Your order has been placed.\nPin receipt : 24m",
    done: true,
  },
  {
    id: 4,
    label: "Delivered",
    date: "",
    desc: "Your order has been placed.\nPin receipt : 24m",
    done: false,
  },
];

const suggestedProducts = [
  {
    id: 1,
    image: "../src/assets/images/leather1.png",
    name: "Leather Wallet",
    rating: 4.2,
    count: 120,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
  {
    id: 2,
    image: "../src/assets/images/bag.png",
    name: "Leather Wallet",
    rating: 4.2,
    count: 98,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
  {
    id: 3,
    image: "../src/assets/images/product.png",
    name: "Leather Wallet",
    rating: 4.2,
    count: 75,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
  {
    id: 4,
    image: "../src/assets/images/wallet.png",
    name: "Leather Wallet",
    rating: 4.2,
    count: 60,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
];

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

function SuggestedCard({ item }) {
  const [wished, setWished] = useState(false);
  return (
    <div className="to-sug-card">
      <button
        className="to-sug-heart"
        onClick={() => setWished((w) => !w)}
        aria-label="Wishlist"
      >
        {wished ? (
          <FaHeart className="text-danger" />
        ) : (
          <FaRegHeart className="text-danger" />
        )}
      </button>
      <div className="to-sug-img-wrap">
        <img src={item.image} alt={item.name} className="to-sug-img" />
      </div>
      <div className="to-sug-body">
        <div className="to-sug-title-row">
          <span className="to-sug-name">{item.name}</span>
          <span className="to-sug-rating">
            <FaStar className="to-sug-star" /> {item.rating}
            <span className="to-sug-count">({item.count})</span>
          </span>
        </div>
        <div className="to-sug-price-row">
          <span className="to-sug-price">₹{item.price}</span>
          <del className="to-sug-real">₹{item.realPrice}</del>
          <span className="to-sug-offer">{item.offer} off</span>
        </div>
        <div className="to-sug-actions">
          <button className="to-sug-buy">Buy now</button>
          <button className="to-sug-cart" aria-label="Add to cart">
            <MdOutlineShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}

function TrackOrder() {
  const location = useLocation();
  const navigate = useNavigate();

  // ─── STAGE 1: EXTRACT REAL-TIME ROUTING ORDER DATA FROM STATE ───
  const { order } = location.state || {};

  // If page is accessed directly without passing state context, route back safely
  useEffect(() => {
    if (!order) {
      navigate("/orders");
    }
    window.scrollTo(0, 0);
  }, [order, navigate]);

  const [otp, setOtp] = useState("");
  const [userRating, setUserRating] = useState(4);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRating, setModalRating] = useState(4);
  const [submittedReview, setSubmittedReview] = useState(null);

  if (!order) return null; // Safe fallback container execution blocker

  const handleReviewSubmit = (rating, text) => {
    setUserRating(rating);
    setSubmittedReview({ rating, text });
  };

  // Pricing math calculation variables mapping from current object reference safely
  const itemsPrice =
    Number(order.originalPrice) || Number(order.discountedPrice) || 0;
  const finalPrice = Number(order.discountedPrice) || 0;
  const savings = itemsPrice > finalPrice ? itemsPrice - finalPrice : 0;

  return (
    <>
      <Navbar />

      <div className="container to-page py-4">
        {/* Dynamic header title displaying real unique serial target path token */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="to-page-title m-0">
            Track Order ID: <span style={{ color: "#8b5cf6" }}>{order.id}</span>
          </h4>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigate("/orders")}
          >
            ← Back to List
          </button>
        </div>

        <div className="to-main-grid">
          <div className="to-left">
            {/* ─── DYNAMIC CORE PRODUCT CARD RENDERING ─── */}
            <div className="to-card to-product-card">
              <div className="to-product-info">
                <img
                  src={order.image || "../src/assets/images/leather1.png"}
                  alt={order.product}
                  className="to-product-img"
                />
                <div className="to-product-details">
                  <h6 className="to-product-name">{order.product}</h6>
                  <p className="to-product-sub">Premium Crafted Edition</p>
                  <div className="to-product-price-row">
                    <span className="to-product-price">₹{finalPrice}</span>
                    {itemsPrice > finalPrice && (
                      <del className="to-product-real">₹{itemsPrice}</del>
                    )}
                  </div>
                  <p className="to-product-qty">
                    Qty: {order.quantity || 1} &nbsp;|&nbsp; Date: {order.time}
                  </p>
                  <span className="to-cod-badge">
                    <MdCreditCard className="me-1" />
                    Transaction Secured (COD/Prepaid)
                  </span>
                </div>
                <div className="to-product-rating-badge">
                  <FaStar className="to-badge-star" /> {order.rating || "4.5"}
                </div>
              </div>
            </div>

            {/* ORDER TRACKING TIMELINE ELEMENT */}
            <div className="to-card">
              <h6 className="to-section-title">Order tracking status</h6>
              <div className="to-timeline">
                {orderSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`to-step ${step.done ? "done" : "pending"}`}
                  >
                    <div className="to-step-left">
                      <div className="to-step-dot ${step.done ? 'dot-done' : 'dot-pending'}">
                        {step.done ? (
                          <FaCheckCircle />
                        ) : (
                          <span className="dot-circle" />
                        )}
                      </div>
                      {idx < orderSteps.length - 1 && (
                        <div
                          className={`to-step-line ${step.done ? "line-done" : "line-pending"}`}
                        />
                      )}
                    </div>
                    <div className="to-step-content">
                      <div className="to-step-label">
                        {step.label}
                        {idx === 0 && (
                          <span className="to-step-date">
                            &nbsp;— {order.time}
                          </span>
                        )}
                      </div>
                      <p className="to-step-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PRODUCT DELIVERY OTP CONTAINER */}
            {/* <div className="to-card">
              <h6 className="to-section-title">Get your product OTP</h6>
              <p className="to-otp-hint">
                This OTP will be shown and processed by the delivery agent after
                receiving your product. Please remain patient until delivery.
              </p>
              <label className="to-otp-label">Product OTP</label>
              <div className="to-otp-row">
                <input
                  type="text"
                  className="to-otp-input"
                  placeholder="••••••••"
                  maxLength={8}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button className="to-otp-btn">Re-Send →</button>
              </div>
            </div> */}

            {/* RATINGS CAPTURE SYSTEM BOX */}
            <div
              className="to-card to-rating-card to-rating-clickable"
              onClick={() => {
                setModalRating(userRating);
                setModalOpen(true);
              }}
              title="Click to write a review"
            >
              <div>
                <p className="to-rating-prompt">Give Us your rating</p>
                {submittedReview && (
                  <p className="to-rating-submitted-text">
                    "{submittedReview.text}"
                  </p>
                )}
              </div>
              <StarDisplay value={userRating} />
            </div>

            <ReviewModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onSubmit={handleReviewSubmit}
              rating={modalRating}
              setRating={setModalRating}
            />
          </div>

          <div className="to-right">
            {/* DELIVERY METADATA LABELS BLOCKS */}
            <div className="to-card">
              <h6 className="to-section-title">Address Profile Customer</h6>
              <div className="to-address-block">
                <p className="to-address-sub-title">
                  <TbTruckDelivery className="to-addr-icon" /> Delivery
                  Destination
                </p>
                <p className="to-addr-name">Verified Active Secure Address</p>
                <p className="to-addr-line">
                  Shipping details stored on order profile baseline accounts
                </p>
                <div className="to-delivery-meta mt-3">
                  <span className="to-meta-badge">
                    <MdCreditCard className="me-1" /> Active Status:{" "}
                    {order.status}
                  </span>
                  <span className="to-meta-badge">
                    <FaTruck className="me-1" /> {order.deliveryDate}
                  </span>
                </div>
              </div>

              <hr className="to-divider" />

              <div className="to-address-block">
                <p className="to-address-sub-title">
                  <MdStorefront className="to-addr-icon" /> Store Merchant
                  Address
                </p>
                <p className="to-addr-name">Krish Leather Factory Factory</p>
                <p className="to-addr-line">
                  Address No. 16, Opp. Terminal, Egg Street, Coimbatore – 641001
                </p>
                <p className="to-addr-line">
                  <FaPhoneAlt
                    className="me-1"
                    style={{ fontSize: "0.75rem" }}
                  />{" "}
                  Support Phone: 97999 02475
                </p>
              </div>
            </div>

            {/* DYNAMIC PRICE SUMMARY CALCULATOR FOR SELECTED ITEM */}
            <div className="to-card">
              <h6 className="to-section-title">
                Order Pricing Invoice Summary
              </h6>
              <div className="to-summary-table">
                <div className="to-summary-row">
                  <span>Items Base Total ({order.quantity || 1})</span>
                  <span>₹{itemsPrice}</span>
                </div>
                {savings > 0 && (
                  <div className="to-summary-row discount">
                    <span>Discount Coupon/Offer Deductions</span>
                    <span>−₹{savings}</span>
                  </div>
                )}
                <div className="to-summary-row">
                  <span>Sub total valuation</span>
                  <span>₹{finalPrice}</span>
                </div>
                <div className="to-summary-row">
                  <span>GST Taxes breakdown (Included 5%)</span>
                  <span>₹{Math.round(finalPrice * 0.05)}</span>
                </div>
                <hr className="to-divider" />
                <div className="to-summary-row total">
                  <span>Net Amount Paid</span>
                  <span>₹{finalPrice}</span>
                </div>
              </div>
              <button
                className="to-invoice-btn"
                onClick={() =>
                  alert(
                    "Downloading purchase transaction ledger invoice data...",
                  )
                }
              >
                <IoReceiptOutline className="me-2" /> Download Invoice
              </button>
            </div>
          </div>
        </div>

        <section className="to-suggestions">
         <RecentProduct/>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default TrackOrder;
