import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowLeft as ArrowIcon,
  FaExclamationTriangle,
  FaTrashAlt,
} from "react-icons/fa";
import { BiEditAlt } from "react-icons/bi";
import { MdAdd, MdClose, MdModeEdit } from "react-icons/md";
import { TiPencil } from "react-icons/ti";
import CartItem from "../../components/User/YourCart";
import OrderSummary from "../../components/User/OrderSummary";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import { useWishlist } from "../../context/WishlistContext";
import CouponCard, { couponsDataList } from "../../components/User/CouponCard";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../assets/styles/Cart.css";
import "../../assets/styles/checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { toggleWishlist } = useWishlist();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // ─── FIXED TRICK: DIRECT FIRESTORE REAL-TIME ADAPTER SYNC LAYER ───
  useEffect(() => {
    const fetchAddressesDirectly = async () => {
      if (!currentUser) return;
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.addresses && Array.isArray(data.addresses)) {
            setSavedAddresses(data.addresses);
            localStorage.setItem(
              "savedAddresses",
              JSON.stringify(data.addresses),
            );

            if (location.state?.returnedAddressId) {
              setSelectedAddressId(location.state.returnedAddressId);
            } else if (data.addresses.length > 0) {
              setSelectedAddressId(data.addresses[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Firebase Sync error inside checkout ledger:", err);
      }
    };
    fetchAddressesDirectly();
  }, [currentUser, location.state]);

  useEffect(() => {
    if (initialSelected.length === 0) {
      navigate("/cart");
    }
    window.scrollTo(0, 0);
  }, [initialSelected, navigate]);

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

  const getSubtotalFilter = (categoryName, subCategoryName = "All") => {
    return checkoutItems
      .filter((item) => {
        const matchesCategory = item.name
          .toLowerCase()
          .includes(categoryName.toLowerCase());
        if (subCategoryName === "All") return matchesCategory;
        return (
          matchesCategory &&
          item.name.toLowerCase().includes(subCategoryName.toLowerCase())
        );
      })
      .reduce((acc, item) => acc + Number(item.price) * (item.qty || 1), 0);
  };

  const walletSubtotal = getSubtotalFilter("Wallet", "All");
  const beltSubtotal = getSubtotalFilter("Belt", "All");
  const handBagSubtotal = getSubtotalFilter("Bag", "Hand Bag");
  const slingBagSubtotal = getSubtotalFilter("Bag", "Sling Bag");
  const tollyBagSubtotal = getSubtotalFilter("Bag", "Tolly Bag");
  const travelBagSubtotal = getSubtotalFilter("Bag", "Travel Bag");
  const schoolBagSubtotal = getSubtotalFilter("Bag", "School Bag");
  const officeBagSubtotal = getSubtotalFilter("Bag", "Office Bag");
  const lunchBagSubtotal = getSubtotalFilter("Bag", "Lunch Bag");
  const laptopBagSubtotal = getSubtotalFilter("Bag", "Laptop Bag");
  const totalBagSubtotal = getSubtotalFilter("Bag", "All");

  let calculatedCouponDiscount = 0;
  if (couponPercentLabel) {
    const matched = couponsDataList.find(
      (c) => c.code === couponInput.toUpperCase(),
    );
    if (matched) {
      let activeSubtotal = 0;
      if (matched.code === "SBC-WLT-001") activeSubtotal = walletSubtotal;
      else if (matched.code === "SBC-BLT-001") activeSubtotal = beltSubtotal;
      else if (matched.code === "SBC-BAG-001") activeSubtotal = handBagSubtotal;
      else if (matched.code === "SBC-BAG-002")
        activeSubtotal = slingBagSubtotal;
      else if (matched.code === "SBC-BAG-003")
        activeSubtotal = tollyBagSubtotal;
      else if (matched.code === "SBC-BAG-004")
        activeSubtotal = travelBagSubtotal;
      else if (matched.code === "SBC-BAG-005")
        activeSubtotal = schoolBagSubtotal;
      else if (matched.code === "SBC-BAG-006")
        activeSubtotal = officeBagSubtotal;
      else if (matched.code === "SBC-BAG-007")
        activeSubtotal = lunchBagSubtotal;
      else if (matched.code === "SBC-BAG-008")
        activeSubtotal = laptopBagSubtotal;

      calculatedCouponDiscount = (activeSubtotal * matched.percentage) / 100;
    }
  }

  const dynamicallyAdjustedSubTotal = baseSubTotal - calculatedCouponDiscount;
  const mtGstInput =
    dynamicallyAdjustedSubTotal > 0 ? dynamicallyAdjustedSubTotal : 0;
  const gstTotal = Math.round(mtGstInput * 0.05);
  const finalTotal = mtGstInput + gstTotal;

  const activeSelectedAddress = savedAddresses.find(
    (addr) => addr.id === selectedAddressId,
  );

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

  const promptDeleteAddress = (e, id) => {
    e.stopPropagation();
    setTargetDeleteId(id);
    setShowDeleteModal(true);
  };

  const executeDeleteAddress = async () => {
    const updated = savedAddresses.filter((addr) => addr.id !== targetDeleteId);
    setSavedAddresses(updated);
    localStorage.setItem("savedAddresses", JSON.stringify(updated));
    if (currentUser) {
      await updateDoc(doc(db, "users", currentUser.uid), {
        addresses: updated,
      });
    }
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
        allCartItems: allCartItems,
        cartItems: checkoutItems,
        totalItemsCount: totalItemsCount,
        rawTotal: rawTotal,
        discountTotal: discountTotal + calculatedCouponDiscount,
        subTotal: baseSubTotal,
        couponDiscount: calculatedCouponDiscount,
        couponPercentageLabel: couponPercentLabel,
        gstTotal: gstTotal,
        finalTotal: finalTotal,
        selectedAddress: activeSelectedAddress,
      },
    });
  };

  const visibleCoupons = couponsDataList.filter((c) => {
    if (c.category === "Bag") {
      if (c.subCategory === "Hand Bag") return handBagSubtotal > 0;
      if (c.subCategory === "Sling Bag") return slingBagSubtotal > 0;
      if (c.subCategory === "Tolly Bag") return tollyBagSubtotal > 0;
      if (c.subCategory === "Travel Bag") return travelBagSubtotal > 0;
      if (c.subCategory === "School Bag") return schoolBagSubtotal > 0;
      if (c.subCategory === "Office Bag") return officeBagSubtotal > 0;
      if (c.subCategory === "Lunch Bag") return lunchBagSubtotal > 0;
      if (c.subCategory === "Laptop Bag") return laptopBagSubtotal > 0;
      return totalBagSubtotal > 0;
    }
    if (c.category === "Wallet") return walletSubtotal > 0;
    if (c.category === "Belt") return beltSubtotal > 0;
    return false;
  });

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
                    onClick={() => navigate("/address")}
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
                    Mobile:{" "}
                    {activeSelectedAddress.mobile ||
                      activeSelectedAddress.contact}
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
              isCheckoutPage={true}
              handleCheckout={handleProceedToBilling}
            />

            <div className="coupon-section">
              <h4 className="coupon-title">Apply coupon</h4>
              <div className="coupon-input-box">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="coupon-input"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    setCouponError("");
                  }}
                />
                <button
                  className="apply-btn"
                  onClick={() => {
                    const matched = couponsDataList.find(
                      (c) => c.code === couponInput.trim().toUpperCase(),
                    );
                    if (matched) {
                      setCouponPercentLabel(`${matched.percentage}%`);
                      setCouponError("");
                    } else {
                      setCouponError("Invalid coupon code");
                    }
                  }}
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="coupon-error-msg text-danger small mt-1">
                  {couponError}
                </p>
              )}

              <div className="coupon-list" style={{ marginTop: "16px" }}>
                {visibleCoupons.map((couponItem) => {
                  let subTotalFeedValue = 0;
                  if (couponItem.code === "SBC-BAG-001")
                    subTotalFeedValue = handBagSubtotal;
                  else if (couponItem.code === "SBC-BAG-002")
                    subTotalFeedValue = slingBagSubtotal;
                  else if (couponItem.code === "SBC-BAG-003")
                    subTotalFeedValue = tollyBagSubtotal;
                  else if (couponItem.code === "SBC-BAG-004")
                    subTotalFeedValue = travelBagSubtotal;
                  else if (couponItem.code === "SBC-BAG-005")
                    subTotalFeedValue = schoolBagSubtotal;
                  else if (couponItem.code === "SBC-BAG-006")
                    subTotalFeedValue = officeBagSubtotal;
                  else if (couponItem.code === "SBC-BAG-007")
                    subTotalFeedValue = lunchBagSubtotal;
                  else if (couponItem.code === "SBC-BAG-008")
                    subTotalFeedValue = laptopBagSubtotal;
                  else if (couponItem.code === "SBC-WLT-001")
                    subTotalFeedValue = walletSubtotal;
                  else if (couponItem.code === "SBC-BLT-001")
                    subTotalFeedValue = beltSubtotal;

                  return (
                    <CouponCard
                      key={couponItem.code}
                      coupon={couponItem}
                      onSelectCoupon={(code) => {
                        setCouponInput(code);
                        setCouponPercentLabel(couponItem.offer);
                        setCouponError("");
                      }}
                      currentSubTotal={subTotalFeedValue}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

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
                onClick={() => navigate("/address")}
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
                          navigate("/address");
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
                    Mobile: {addr.mobile || addr.contact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
                    navigate("/address");
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
      <Footer />
    </>
  );
};

export default Checkout;
