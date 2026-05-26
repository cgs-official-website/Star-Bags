import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowLeft as ArrowIcon,
  FaLock,
  FaGift,
  FaTrashAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { BiEditAlt } from "react-icons/bi";
import { MdAdd, MdClose, MdModeEdit } from "react-icons/md";
import { TiPencil } from "react-icons/ti";
import CartItem from "../../components/User/YourCart";
import OrderSummary from "../../components/User/OrderSummary";
import CouponCard from "../../components/User/CouponCard";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import { useWishlist } from "../../context/WishlistContext";
import "../../assets/styles/cart.css";
import "../../assets/styles/checkout.css";

const Checkout = () => {
  // ─── 1. CORE COMPONENT ROUTER & CONTEXT HOOKS ───
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleWishlist } = useWishlist();

  // ─── 2. ALL STATE INITIALIZATIONS ───
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const rawData = localStorage.getItem("savedAddresses");
    return rawData ? JSON.parse(rawData) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const rawData = localStorage.getItem("savedAddresses");
    const parsed = rawData ? JSON.parse(rawData) : [];
    return parsed.length > 0 ? parsed[0].id : null;
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);
  const [showAddressWarningModal, setShowAddressWarningModal] = useState(false);

  const {
    allCartItems = [],
    cartItems: initialSelected = [],
    couponPercentageLabel = "",
  } = location.state || {};

  const [checkoutItems, setCheckoutItems] = useState(initialSelected);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponPercentLabel, setCouponPercentLabel] = useState(
    couponPercentageLabel,
  );

  // ─── 3. SIDE EFFECTS MANAGEMENT ───
  useEffect(() => {
    window.scrollTo(0, 0);
    const rawData = localStorage.getItem("savedAddresses");
    if (rawData) {
      const parsed = JSON.parse(rawData);
      setSavedAddresses(parsed);
      if (parsed.length > 0 && !selectedAddressId) {
        setSelectedAddressId(parsed[0].id);
      }
    }
  }, [selectedAddressId]);

  // ─── 4. CALCULATIONS AND METRIC LEDGER PARSING ───
  const totalItemsCount = checkoutItems.reduce(
    (acc, item) => acc + (item.qty || 1),
    0,
  );
  const rawTotal = checkoutItems.reduce((acc, item) => {
    const originalPrice = Number(item.realPrice) || Number(item.price) || 0;
    return acc + originalPrice * (item.qty || 1);
  }, 0);
  const baseSubTotal = checkoutItems.reduce(
    (acc, item) => acc + Number(item.price) * (item.qty || 1),
    0,
  );
  const discountTotal = rawTotal - baseSubTotal;

  const getCategorySubtotal = (keyword) => {
    return checkoutItems
      .filter((item) => item.name.toLowerCase().includes(keyword.toLowerCase()))
      .reduce((acc, item) => acc + Number(item.price) * (item.qty || 1), 0);
  };

  const bagSubtotal = getCategorySubtotal("Bag");
  const walletSubtotal = getCategorySubtotal("Wallet");
  const beltSubtotal = getCategorySubtotal("Belt");

  // ─── RESTORED: COUPON DEFINITIONS & VISIBILITY FILTERS ───
  const coupons = [
    {
      code: "BAG15",
      offer: "15%",
      percentage: 15,
      minThreshold: 1000,
      category: "Bag",
    },
    {
      code: "BAG30",
      offer: "30%",
      percentage: 30,
      minThreshold: 2000,
      category: "Bag",
    },
    {
      code: "WAL10",
      offer: "10%",
      percentage: 10,
      minThreshold: 1000,
      category: "Wallet",
    },
    {
      code: "BELT10",
      offer: "10%",
      percentage: 10,
      minThreshold: 1000,
      category: "Belt",
    },
  ];

  const visibleCoupons = coupons.filter((c) => {
    if (baseSubTotal < 1000) return false;
    if (c.category === "Bag")
      return bagSubtotal >= 2000
        ? c.minThreshold === 2000
        : c.minThreshold === 1000;
    return c.minThreshold === 1000;
  });

  let calculatedCouponDiscount = 0;
  if (couponPercentLabel) {
    if (couponInput.toUpperCase() === "BAG15" || couponPercentLabel === "15%")
      calculatedCouponDiscount = bagSubtotal * 0.15;
    else if (
      couponInput.toUpperCase() === "BAG30" ||
      couponPercentLabel === "30%"
    )
      calculatedCouponDiscount = bagSubtotal * 0.3;
    else if (
      couponInput.toUpperCase() === "WAL10" ||
      couponPercentLabel === "10%"
    )
      calculatedCouponDiscount = walletSubtotal * 0.1;
    else if (
      couponInput.toUpperCase() === "BELT10" ||
      couponPercentLabel === "10%"
    )
      calculatedCouponDiscount = beltSubtotal * 0.1;
  }

  const dynamicallyAdjustedSubTotal = baseSubTotal - calculatedCouponDiscount;
  const mtGstInput =
    dynamicallyAdjustedSubTotal > 0 ? dynamicallyAdjustedSubTotal : 0;
  const gstTotal = Math.round(mtGstInput * 0.05);
  const finalTotal = mtGstInput + gstTotal;

  const activeSelectedAddress = savedAddresses.find(
    (addr) => addr.id === selectedAddressId,
  );

  // ─── 5. BUSINESS HANDLERS AND LOGIC MATRIX ───
  const handleQtyIncrease = (id) => {
    setCheckoutItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item,
      ),
    );
  };

  const handleQtyDecrease = (id) => {
    setCheckoutItems((prev) =>
      prev.map((item) =>
        item.id === id && (item.qty || 1) > 1
          ? { ...item, qty: (item.qty || 1) - 1 }
          : item,
      ),
    );
  };

  const handleSelectCouponCode = (code) => {
    setCouponInput(code);
    setCouponError("");
  };

  const handleVerifyAndApply = () => {
    const sanitizedInput = couponInput.trim().toUpperCase();
    if (!sanitizedInput) {
      setCouponError("Please enter or select a coupon code");
      return;
    }
    const matchedCoupon = coupons.find((c) => c.code === sanitizedInput);
    if (!matchedCoupon) {
      setCouponError("Invalid coupon code");
      return;
    }

    let targetSubtotal = 0;
    if (matchedCoupon.category === "Bag") targetSubtotal = bagSubtotal;
    if (matchedCoupon.category === "Wallet") targetSubtotal = walletSubtotal;
    if (matchedCoupon.category === "Belt") targetSubtotal = beltSubtotal;

    if (targetSubtotal >= matchedCoupon.minThreshold) {
      setCouponPercentLabel(`${matchedCoupon.percentage}%`);
      setCouponError("");
    } else {
      setCouponError(
        `Coupon invalid: Requires minimum ₹${matchedCoupon.minThreshold} spent on ${matchedCoupon.category} items.`,
      );
      setCouponPercentLabel("");
    }
  };

  const promptDeleteAddress = (e, id) => {
    e.stopPropagation();
    setTargetDeleteId(id);
    setShowDeleteModal(true);
  };

  const executeDeleteAddress = () => {
    const updated = savedAddresses.filter((addr) => addr.id !== targetDeleteId);
    setSavedAddresses(updated);
    localStorage.setItem("savedAddresses", JSON.stringify(updated));
    if (selectedAddressId === targetDeleteId) {
      setSelectedAddressId(updated.length > 0 ? updated[0].id : null);
    }
    setShowDeleteModal(false);
    setTargetDeleteId(null);
  };

  const handleProceedToBilling = () => {
    if (!activeSelectedAddress) {
      setShowAddressWarningModal(true);
      return;
    }
    navigate("/BillAddress", {
      state: {
        allCartItems,
        cartItems: checkoutItems,
        totalItemsCount,
        rawTotal,
        discountTotal: discountTotal + calculatedCouponDiscount,
        subTotal: baseSubTotal,
        couponDiscount: calculatedCouponDiscount,
        couponPercentageLabel: couponPercentLabel,
        gstTotal,
        finalTotal,
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="cart-page style-page-checkout">
        <div className="checkout-header">
          <h2 className="main-title">Product Checkout</h2>
          <button
            className="back-navigation-btn"
            onClick={() => navigate("/cart")}
          >
            <ArrowIcon className="me-2" /> Back to Cart
          </button>
        </div>

        <div className="cart-layout-grid">
          <div className="cart-left">
            <div className="address-box mb-3">
              <div className="address-top-row">
                <h4 className="section-subtitle-heading">Address</h4>
                {savedAddresses.length > 0 && (
                  <button
                    className="choose-address-btn d-flex align-items-center gap-1"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <BiEditAlt /> Choose Address
                  </button>
                )}
              </div>

              {savedAddresses.length === 0 ? (
                <div
                  className="empty-address-viewport d-flex justify-content-center align-items-center py-3 border rounded"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <button
                    type="button"
                    className="add-delivery-trigger-btn d-flex align-items-center gap-2"
                    onClick={() => navigate("/savedaddress")}
                  >
                    <TiPencil style={{ transform: "rotate(-45deg)" }} /> Add
                    your Delivery Address
                  </button>
                </div>
              ) : !activeSelectedAddress ? (
                <div className="p-3 bg-warning bg-opacity-10 border border-warning rounded text-warning fw-semibold small d-flex justify-content-between align-items-center">
                  <span>
                    ⚠️ Please select an active delivery address card to unlock
                    billing options.
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-warning fw-bold text-dark px-3"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Select Address
                  </button>
                </div>
              ) : (
                <div className="address-body-content">
                  <p className="user-name-line">
                    {activeSelectedAddress.name} ,{" "}
                    {activeSelectedAddress.address}
                  </p>
                  <p className="user-city-zip">
                    {activeSelectedAddress.city}, {activeSelectedAddress.state}{" "}
                    - {activeSelectedAddress.pin}
                  </p>
                  <p className="user-phone-line">
                    Mobile: {activeSelectedAddress.mobile}
                  </p>
                </div>
              )}
            </div>

            <div className="cart-items">
              {checkoutItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={handleQtyIncrease}
                  onDecrease={handleQtyDecrease}
                  onToggleWishlist={toggleWishlist}
                  showActions={false}
                  showCheckbox={false}
                />
              ))}
            </div>
          </div>

          <div className="cart-right">
            <OrderSummary
              totalItemsCount={totalItemsCount}
              rawTotal={rawTotal}
              discountTotal={discountTotal + calculatedCouponDiscount}
              subTotal={dynamicallyAdjustedSubTotal}
              couponDiscount={calculatedCouponDiscount}
              couponPercentageLabel={couponPercentLabel}
              gstTotal={gstTotal}
              finalTotal={finalTotal}
              isBillingPage={false}
              handleCheckout={handleProceedToBilling}
            />

            <div className="coupon-section">
              <h4 className="coupon-title">Apply coupon</h4>
              <div className="coupon-input-box">
                <input
                  type="text"
                  placeholder={
                    baseSubTotal < 1000
                      ? "⚠️ Coupons Locked"
                      : "Enter coupon code"
                  }
                  className="coupon-input"
                  value={couponInput}
                  disabled={baseSubTotal < 1000}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    setCouponError("");
                  }}
                />
                <button
                  className="apply-btn"
                  onClick={handleVerifyAndApply}
                  disabled={baseSubTotal < 1000}
                >
                  Apply
                </button>
              </div>

              {baseSubTotal < 1000 ? (
                <div
                  className="coupon-input-slogan-alert mt-3"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px",
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ color: "#ea580c" }}>
                    <FaLock />
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      color: "#4b5563",
                      fontWeight: "600",
                    }}
                  >
                    Purchase{" "}
                    <span style={{ color: "#ea580c", fontWeight: "800" }}>
                      ₹{1000 - baseSubTotal}
                    </span>{" "}
                    extra to open premium coupons!
                  </p>
                </div>
              ) : (
                <div
                  className="coupon-input-slogan-alert success-alert mt-3"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px",
                    background: "#f0fdf4",
                    border: "1px dashed #bbf7d0",
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ color: "#22c55e" }}>
                    <FaGift />
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      color: "#15803d",
                      fontWeight: "600",
                    }}
                  >
                    Premium coupons unlocked! Enter your code above.
                  </p>
                </div>
              )}

              {couponError && (
                <p className="coupon-error-msg text-danger small mt-1">
                  {couponError}
                </p>
              )}

              <div className="coupon-list">
                {visibleCoupons.map((coupon, idx) => (
                  <CouponCard
                    key={idx}
                    coupon={coupon}
                    onSelectCoupon={handleSelectCouponCode}
                    currentSubTotal={
                      coupon.category === "Bag"
                        ? bagSubtotal
                        : coupon.category === "Wallet"
                          ? walletSubtotal
                          : beltSubtotal
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── OVERLAY MODAL: POPUP SELECT DELIVERY ADDRESS ─── */}
      {isModalOpen && (
        <div
          className="address-popup-modal-overlay d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(2px)",
            zIndex: 999,
          }}
        >
          <div
            className="address-popup-modal-box shadow-lg bg-white p-4 rounded"
            style={{
              width: "92%",
              maxWidth: "625px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <h4
                className="m-0 text-dark fw-bold"
                style={{ fontSize: "1.4rem" }}
              >
                Select delivery address
              </h4>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setIsModalOpen(false)}
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5
                className="m-0 text-dark fw-semibold"
                style={{ fontSize: "1.05rem" }}
              >
                Saved Addresses
              </h5>
              <button
                type="button"
                className="popup-add-new-address-btn d-flex align-items-center gap-1"
                style={{
                  backgroundColor: "#8b5cf6",
                  color: "#fff",
                  border: "none",
                  padding: "7px 14px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "0.8rem",
                }}
                onClick={() => navigate("/savedaddress")}
              >
                <MdAdd size={16} /> Add a New Address
              </button>
            </div>

            <div
              className="popup-address-items-scroller pr-1"
              style={{ maxHeight: "365px", overflowY: "auto" }}
            >
              {savedAddresses.map((addr, index) => (
                <div
                  key={addr.id}
                  className="popup-address-item-card p-3 mb-3 border rounded position-relative"
                  onClick={() => {
                    setSelectedAddressId(addr.id);
                    setIsModalOpen(false);
                  }}
                  style={{
                    cursor: "pointer",
                    borderColor:
                      selectedAddressId === addr.id ? "#8b5cf6" : "#e5e7eb",
                    backgroundColor:
                      selectedAddressId === addr.id ? "#f5f3ff" : "#fff",
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span
                      className="fw-bold text-dark"
                      style={{ fontSize: "1rem" }}
                    >
                      Address {index + 1}
                    </span>
                    {selectedAddressId === addr.id && (
                      <span
                        className="px-2 py-0.5 rounded-pill"
                        style={{
                          backgroundColor: "#ddd6fe",
                          color: "#6d28d9",
                          fontSize: "0.72rem",
                          fontWeight: "700",
                        }}
                      >
                        Selected
                      </span>
                    )}

                    <div
                      className="popup-card-actions-tray d-flex align-items-center gap-2 ms-auto"
                      style={{
                        position: "absolute",
                        top: "14px",
                        right: "14px",
                      }}
                    >
                      <button
                        type="button"
                        className="edit-icon"
                        style={{
                          background: "transparent",
                          border: "1px solid #c4b5fd",
                          color: "#8b5cf6",
                          borderRadius: "20px",
                          padding: "3px 12px",
                          fontSize: "0.78rem",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/savedaddress");
                        }}
                      >
                        <MdModeEdit size={14} />{" "}
                        <span style={{ marginLeft: "2px" }}>Edit</span>
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#9ca3af",
                          cursor: "pointer",
                        }}
                        onClick={(e) => promptDeleteAddress(e, addr.id)}
                      >
                        <FaTrashAlt size={13} />
                      </button>
                    </div>
                  </div>

                  <p
                    className="text-dark m-0 mb-1"
                    style={{ fontSize: "0.88rem" }}
                  >
                    {addr.name} , {addr.address}
                  </p>
                  <p
                    className="text-dark m-0 mb-1"
                    style={{ fontSize: "0.88rem" }}
                  >
                    {addr.city}, {addr.state} - {addr.pin}
                  </p>
                  <p className="text-muted m-0" style={{ fontSize: "0.85rem" }}>
                    Mobile: {addr.mobile}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── CONFIRM DELETION MODAL ─── */}
      {showDeleteModal && (
        <div
          className="modal-overlay-custom"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
        >
          <div
            className="modal-box-custom shadow-lg bg-white p-4 rounded text-center"
            style={{ width: "90%", maxWidth: "400px" }}
          >
            <h5 className="fw-bold mb-2">Confirm Deletion</h5>
            <p className="text-muted small">
              Are you sure you want to delete this delivery address profile?
            </p>
            <div className="d-flex gap-3 mt-4">
              <button
                type="button"
                className="btn btn-secondary flex-fill"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger flex-fill"
                onClick={executeDeleteAddress}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADDRESS SELECTION WARNING OVERLAY ─── */}
      {showAddressWarningModal && (
        <div
          className="modal-overlay-custom"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10001,
          }}
        >
          <div
            className="modal-box-custom shadow-lg bg-white p-4 rounded text-center"
            style={{
              width: "90%",
              maxWidth: "420px",
              borderTop: "4px solid #8b5cf6",
            }}
          >
            <div className="mb-3" style={{ color: "#8b5cf6" }}>
              <FaExclamationTriangle size={42} />
            </div>
            <h5 className="fw-bold mb-2" style={{ color: "#171744" }}>
              Delivery Address Required
            </h5>
            <p
              className="text-muted"
              style={{ fontSize: "0.88rem", lineHeight: "1.4" }}
            >
              You cannot proceed to billing without specifying a destination.
              Please add or choose a valid address card to unlock payment
              options.
            </p>
            <div className="d-flex gap-3 mt-4">
              <button
                type="button"
                className="btn btn-secondary flex-fill fw-bold"
                style={{ fontSize: "0.85rem" }}
                onClick={() => setShowAddressWarningModal(false)}
              >
                Close Window
              </button>
              <button
                type="button"
                className="btn text-white flex-fill fw-bold"
                style={{ background: "#8b5cf6", fontSize: "0.85rem" }}
                onClick={() => {
                  setShowAddressWarningModal(false);
                  if (savedAddresses.length === 0) {
                    navigate("/savedaddress");
                  } else {
                    setIsModalOpen(true);
                  }
                }}
              >
                {savedAddresses.length === 0 ? "Add Address" : "Choose Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    <Footer/>
    </>
  );
};

export default Checkout;
