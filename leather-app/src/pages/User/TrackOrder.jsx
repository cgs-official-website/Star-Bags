import React, { useState } from "react";
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

// ─── Mock Data ────────────────────────────────────────────────────────────────
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
  {
    id: 5,
    image: "../src/assets/images/leather1.png",
    name: "Leather Wallet",
    rating: 4.2,
    count: 44,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
  {
    id: 6,
    image: "../src/assets/images/bag.png",
    name: "Leather Wallet",
    rating: 4.2,
    count: 33,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
  {
    id: 7,
    image: "../src/assets/images/product.png",
    name: "Leather Wallet",
    rating: 4.2,
    count: 52,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
  {
    id: 8,
    image: "../src/assets/images/wallet.png",
    name: "Leather Wallet",
    rating: 4.2,
    count: 19,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
];

// ─── Inline Star Display (read-only, for the rating card on the page) ─────────
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

// ─── Suggested Product Card ───────────────────────────────────────────────────
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

// ─── Main Page ────────────────────────────────────────────────────────────────
function TrackOrder() {
  const [otp, setOtp] = useState("");
  const [userRating, setUserRating] = useState(4);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRating, setModalRating] = useState(4);
  const [submittedReview, setSubmittedReview] = useState(null);

  const handleReviewSubmit = (rating, text) => {
    setUserRating(rating);
    setSubmittedReview({ rating, text });
  };

  return (
    <>
      <Navbar />

      <div className="container to-page py-4">
        <h4 className="to-page-title">Track your order</h4>

        {/* ═══ Main two-column layout ══════════════════════════════════════ */}
        <div className="to-main-grid">
          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div className="to-left">
            {/* Product Mini Card */}
            <div className="to-card to-product-card">
              <div className="to-product-info">
                <img
                  src="../src/assets/images/leather1.png"
                  alt="Leather Bag"
                  className="to-product-img"
                />
                <div className="to-product-details">
                  <h6 className="to-product-name">Leather Bag</h6>
                  <p className="to-product-sub">Leather briefcase</p>
                  <div className="to-product-price-row">
                    <span className="to-product-price">₹1,200</span>
                    <del className="to-product-real">₹1,600</del>
                  </div>
                  <p className="to-product-qty">
                    Qty: 1 &nbsp;|&nbsp; Colour: Happy to come
                  </p>
                  <span className="to-cod-badge">
                    <MdCreditCard className="me-1" />
                    Cash on delivery available
                  </span>
                </div>
                <div className="to-product-rating-badge">
                  <FaStar className="to-badge-star" /> 4.2
                </div>
              </div>
            </div>

            {/* Order Tracking Timeline */}
            <div className="to-card">
              <h6 className="to-section-title">Order tracking</h6>
              <div className="to-timeline">
                {orderSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`to-step ${step.done ? "done" : "pending"}`}
                  >
                    {/* Connector line above (skip for first) */}
                    <div className="to-step-left">
                      <div
                        className={`to-step-dot ${step.done ? "dot-done" : "dot-pending"}`}
                      >
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
                        {step.date && (
                          <span className="to-step-date">
                            &nbsp;— {step.date}
                          </span>
                        )}
                      </div>
                      <p className="to-step-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OTP Section */}
            <div className="to-card">
              <h6 className="to-section-title">Get your product OTP</h6>
              <p className="to-otp-hint">
                This OTP will be shown and the process of delivery person to the
                delivery agent on after receiving your product. Please remain
                patient until delivery.
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
            </div>

            {/* Rating — click to open modal */}
            <div
              className="to-card to-rating-card to-rating-clickable"
              onClick={() => {
                setModalRating(userRating);
                setModalOpen(true);
              }}
              title="Click to write a review"
            >
              <div>
                <p className="to-rating-prompt">Give Us to your rating</p>
                {submittedReview && (
                  <p className="to-rating-submitted-text">
                    "{submittedReview.text}"
                  </p>
                )}
              </div>
              <StarDisplay value={userRating} />
            </div>

            {/* Review Modal */}
            <ReviewModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onSubmit={handleReviewSubmit}
              rating={modalRating}
              setRating={setModalRating}
            />
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────────── */}
          <div className="to-right">
            {/* Delivery Address */}
            <div className="to-card">
              <h6 className="to-section-title">Address Customer</h6>

              <div className="to-address-block">
                <p className="to-address-sub-title">
                  <TbTruckDelivery className="to-addr-icon" /> Delivery Address
                </p>
                <p className="to-addr-name">
                  Rahul Sharma · Flat No. 302, Sai Residency
                </p>
                <p className="to-addr-line">Mumbai, Maharashtra – 400058</p>
                <p className="to-addr-line">Mobile: 9876543210</p>
                <div className="to-delivery-meta">
                  <span className="to-meta-badge">
                    <MdCreditCard className="me-1" /> Cash on way
                  </span>
                  <span className="to-meta-badge">
                    <FaTruck className="me-1" /> Delivery time 5 to 5 days
                  </span>
                </div>
              </div>

              <hr className="to-divider" />

              <div className="to-address-block">
                <p className="to-address-sub-title">
                  <MdStorefront className="to-addr-icon" /> Store Address
                </p>
                <p className="to-addr-name">
                  Store Name : Address Halls & 5h 1000
                </p>
                <p className="to-addr-line">Address No. 16, Opp. Terminal</p>
                <p className="to-addr-line">Egg Street Street</p>
                <p className="to-addr-line">Coimbatore – 641001</p>
                <p className="to-addr-line">
                  <FaPhoneAlt
                    className="me-1"
                    style={{ fontSize: "0.75rem" }}
                  />
                  Phone No: 97999 02475
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="to-card">
              <h6 className="to-section-title">Order Summary</h6>
              <div className="to-summary-table">
                <div className="to-summary-row">
                  <span>Items(4)</span>
                  <span>₹1500.00</span>
                </div>
                <div className="to-summary-row discount">
                  <span>Discount</span>
                  <span>−₹500.00</span>
                </div>
                <div className="to-summary-row">
                  <span>Sub total</span>
                  <span>₹1000.00</span>
                </div>
                <div className="to-summary-row">
                  <span>GST Includes (5%)</span>
                  <span>₹240</span>
                </div>
                <hr className="to-divider" />
                <div className="to-summary-row total">
                  <span>Total</span>
                  <span>₹1000.00</span>
                </div>
              </div>
              <button className="to-invoice-btn">
                <IoReceiptOutline className="me-2" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>

        {/* ═══ You May Also Like ════════════════════════════════════════════ */}
        <section className="to-suggestions">
          <h5 className="to-sug-heading">YOU MAY ALSO LIKE PRODUCTS</h5>
          <p className="to-sug-subheading">
            Premium leather furniture Crafted For Comfort, Durability, And
            Timeless Style Designed To Elevate Every Space
          </p>
          <div className="to-sug-grid">
            {suggestedProducts.map((item) => (
              <SuggestedCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default TrackOrder;
