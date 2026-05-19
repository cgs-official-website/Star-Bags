import { useState, } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { BiEditAlt } from "react-icons/bi";
import CartItem from "../components/User/YourCart";
import OrderSummary from "../components/User/OrderSummary";
import CouponCard from "../components/User/CouponCard";
import Navbar from "../components/User/Navbar";
import Footer from "../components/User/Footer";
import "../assets/styles/Cart.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Cleaned up destructured object to clear unused appliedCouponDiscount variable warning
  const { 
    allCartItems = [], 
    cartItems: initialSelected = [], 
    couponPercentageLabel = "" 
  } = location.state || {};

  const [checkoutItems, setCheckoutItems] = useState(initialSelected);
  const [masterCartList, setMasterCartList] = useState(allCartItems);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponPercentLabel, setCouponPercentLabel] = useState(couponPercentageLabel);

  // Core Math Calculations Engine
  const totalItemsCount = checkoutItems.reduce((acc, item) => acc + item.qty, 0);
  const rawTotal = checkoutItems.reduce((acc, item) => acc + item.oldPrice * item.qty, 0);
  
  const baseSubTotal = checkoutItems.reduce((acc, item) => {
    const disc = parseInt(item.discount) || 0;
    return acc + (item.oldPrice - (item.oldPrice * disc) / 100) * item.qty;
  }, 0);

  const discountTotal = rawTotal - baseSubTotal;

  // Category specific subtotal collectors
  const getCategorySubtotal = (keyword) => {
    return checkoutItems
      .filter(item => item.name.toLowerCase().includes(keyword.toLowerCase()))
      .reduce((acc, item) => {
        const disc = parseInt(item.discount) || 0;
        return acc + (item.oldPrice - (item.oldPrice * disc) / 100) * item.qty;
      }, 0);
  };

  const bagSubtotal = getCategorySubtotal("Bag");
  const walletSubtotal = getCategorySubtotal("Wallet");
  const beltSubtotal = getCategorySubtotal("Belt");

  // Dynamic Coupon Discount Engine (Removed unused 'rate' variable warning)
  let calculatedCouponDiscount = 0;
  if (couponPercentLabel) {
    if (couponInput.toUpperCase() === "BAG15" || couponPercentLabel === "15%") {
      calculatedCouponDiscount = bagSubtotal * 0.15;
    } else if (couponInput.toUpperCase() === "BAG30" || couponPercentLabel === "30%") {
      calculatedCouponDiscount = bagSubtotal * 0.30;
    } else if (couponInput.toUpperCase() === "WAL10" || couponPercentLabel === "10%") {
      calculatedCouponDiscount = walletSubtotal * 0.10;
    } else if (couponInput.toUpperCase() === "BELT10" || couponPercentLabel === "10%") {
      calculatedCouponDiscount = beltSubtotal * 0.10;
    }
  }

  const dynamicallyAdjustedSubTotal = baseSubTotal - calculatedCouponDiscount;
  const mtGstInput = dynamicallyAdjustedSubTotal > 0 ? dynamicallyAdjustedSubTotal : 0;
  const gstTotal = Math.round(mtGstInput * 0.05);
  const finalTotal = (dynamicallyAdjustedSubTotal > 0 ? dynamicallyAdjustedSubTotal : 0) + gstTotal;

  const handleQtyIncrease = (id) => {
    setCheckoutItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)));
    setMasterCartList((prev) => prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)));
  };

  const handleQtyDecrease = (id) => {
    setCheckoutItems((prev) => prev.map((item) => (item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item)));
    setMasterCartList((prev) => prev.map((item) => (item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item)));
  };

  const handleToggleWishlist = (id) => {
    setCheckoutItems((prev) => prev.map((item) => (item.id === id ? { ...item, wishlist: !item.wishlist } : item)));
    setMasterCartList((prev) => prev.map((item) => (item.id === id ? { ...item, wishlist: !item.wishlist } : item)));
  };

  const handleGoBackToCart = () => {
    navigate("/cart", { state: { cartItems: masterCartList } });
  };

  const handleSelectCouponCode = (code) => {
    setCouponInput(code);
    setCouponError(""); 
  };

  const handleVerifyAndApply = () => {
    const sanitizedInput = couponInput.trim().toUpperCase();

    if (!sanitizedInput) {
      setCouponError("Please enter or select a coupon code");
      setCouponPercentLabel("");
      return;
    }

    const matchedCoupon = coupons.find(c => c.code === sanitizedInput);

    if (!matchedCoupon) {
      setCouponError("Invalid coupon code");
      setCouponPercentLabel("");
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
      setCouponError(`Coupon invalid: Requires minimum ₹${matchedCoupon.minThreshold} spent on ${matchedCoupon.category} items explicitly.`);
      setCouponPercentLabel("");
    }
  };

  const handleProceedToBilling = () => {
    navigate("/BillAddress", {
      state: {
        allCartItems: masterCartList,
        cartItems: checkoutItems,
        totalItemsCount,
        rawTotal,
        discountTotal,
        subTotal: dynamicallyAdjustedSubTotal,
        couponDiscount: calculatedCouponDiscount,
        couponPercentageLabel: couponPercentLabel,
        gstTotal,
        finalTotal,
      },
    });
  };

  const coupons = [
    { code: "BAG15", offer: "15%", percentage: 15, minThreshold: 1000, category: "Bag", description: "15% off on Bags - Requires ₹1000 Bag spend" },
    { code: "BAG30", offer: "30%", percentage: 30, minThreshold: 2000, category: "Bag", description: "30% off on Bags - Requires ₹2000 Bag spend" },
    { code: "WAL10", offer: "10%", percentage: 10, minThreshold: 1000, category: "Wallet", description: "10% off on Wallets - Requires ₹1000 Wallet spend" },
    { code: "BELT10", offer: "10%", percentage: 10, minThreshold: 1000, category: "Belt", description: "10% off on Belts - Requires ₹1000 Belt spend" }
  ];

  const visibleCoupons = coupons.filter(c => {
    if (baseSubTotal < 1000) return false; 

    if (c.category === "Bag") {
      if (bagSubtotal >= 2000) {
        return c.minThreshold === 2000; 
      }
      return c.minThreshold === 1000; 
    }

    return c.minThreshold === 1000;
  });

  return (
    <>
      <Navbar />
      <div className="cart-page style-page-checkout">
        <div className="checkout-header">
          <h2 className="main-title">Product Checkout</h2>
          <button className="back-navigation-btn" onClick={handleGoBackToCart}>
            <FaArrowLeft className="me-2" /> Back to Cart
          </button>
        </div>

        <div className="cart-layout-grid">
          <div className="cart-left">
            <div className="address-box mb-3">
              <div className="address-top-row">
                <h4 className="section-subtitle-heading">Address</h4>
                <button className="choose-address-btn d-flex align-items-center gap-1"><BiEditAlt /> Choose Address</button>
              </div>
              <div className="address-body-content">
                <p className="user-name-line">Rahul Sharma, Flat No. 302, Sai Residency</p>
                <p className="user-city-zip">Mumbai, Maharashtra - 400058</p>
                <p className="user-phone-line">Mobile: 9876543210</p>
              </div>
            </div>

            <div className="cart-items">
              {checkoutItems.map((item) => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onIncrease={handleQtyIncrease} 
                  onDecrease={handleQtyDecrease} 
                  onToggleWishlist={handleToggleWishlist} 
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
              discountTotal={discountTotal} 
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
                  placeholder="Enter coupon code" 
                  className="coupon-input" 
                  value={couponInput} 
                  onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }} 
                />
                <button className="apply-btn" onClick={handleVerifyAndApply}>Apply</button>
              </div>
              
              {couponError && (
                <p className="coupon-error-msg text-danger fw-bold ms-1" style={{ fontSize: "0.82rem", marginTop: "-5px", lineHeight: "1.3" }}>
                  {couponError}
                </p>
              )}

              <div className="coupon-list">
                {visibleCoupons.map((coupon, idx) => (
                  <CouponCard 
                    key={idx} 
                    coupon={coupon} 
                    onSelectCoupon={handleSelectCouponCode} 
                    currentSubTotal={coupon.category === "Bag" ? bagSubtotal : coupon.category === "Wallet" ? walletSubtotal : beltSubtotal} 
                  />
                ))}
                {visibleCoupons.length === 0 && (
                  <p className="text-muted italic style-empty ps-1" style={{ fontSize: "0.82rem" }}>
                    Spend ₹1000 or more on your cart total to unlock active product discount coupons.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;