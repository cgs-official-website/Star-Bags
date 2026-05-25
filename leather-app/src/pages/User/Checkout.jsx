import { useState, useEffect } from "react"; // ← UPDATED: Added useEffect
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft as ArrowIcon } from "react-icons/fa";
import { BiEditAlt } from "react-icons/bi";
import CartItem from "../../components/User/YourCart";
import OrderSummary from "../../components/User/OrderSummary";
import CouponCard from "../../components/User/CouponCard";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import { useWishlist } from "../../context/WishlistContext"; // ← UPDATED: Access central wishlist controller
import "../../assets/styles/cart.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleWishlist } = useWishlist(); // ← Hook up global context action

  // ─── FIX: Force window scroll orientation straight to the top on page load ───
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { 
    allCartItems = [], 
    cartItems: initialSelected = [], 
    couponPercentageLabel = "" 
  } = location.state || {};

  const [checkoutItems, setCheckoutItems] = useState(initialSelected);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponPercentLabel, setCouponPercentLabel] = useState(couponPercentageLabel);

  const totalItemsCount = checkoutItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  const rawTotal = checkoutItems.reduce((acc, item) => {
    const originalPrice = Number(item.realPrice) || Number(item.price) || 0;
    return acc + (originalPrice * (item.qty || 1));
  }, 0);
  
  const baseSubTotal = checkoutItems.reduce((acc, item) => {
    return acc + (Number(item.price) * (item.qty || 1));
  }, 0);

  const discountTotal = rawTotal - baseSubTotal;

  const getCategorySubtotal = (keyword) => {
    return checkoutItems
      .filter(item => item.name.toLowerCase().includes(keyword.toLowerCase()))
      .reduce((acc, item) => acc + (Number(item.price) * (item.qty || 1)), 0);
  };

  const bagSubtotal = getCategorySubtotal("Bag");
  const walletSubtotal = getCategorySubtotal("Wallet");
  const beltSubtotal = getCategorySubtotal("Belt");

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
  const finalTotal = mtGstInput + gstTotal;

  const handleQtyIncrease = (id) => {
    setCheckoutItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item)));
  };

  const handleQtyDecrease = (id) => {
    setCheckoutItems((prev) => prev.map((item) => (item.id === id && (item.qty || 1) > 1 ? { ...item, qty: (item.qty || 1) - 1 } : item)));
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

    const matchedCoupon = coupons.find(c => c.code === sanitizedInput);
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
      setCouponError(`Coupon invalid: Requires minimum ₹${matchedCoupon.minThreshold} spent on ${matchedCoupon.category} items explicitly.`);
      setCouponPercentLabel("");
    }
  };

  const handleProceedToBilling = () => {
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

  const coupons = [
    { code: "BAG15", offer: "15%", percentage: 15, minThreshold: 1000, category: "Bag" },
    { code: "BAG30", offer: "30%", percentage: 30, minThreshold: 2000, category: "Bag" },
    { code: "WAL10", offer: "10%", percentage: 10, minThreshold: 1000, category: "Wallet" },
    { code: "BELT10", offer: "10%", percentage: 10, minThreshold: 1000, category: "Belt" }
  ];

  const visibleCoupons = coupons.filter(c => {
    if (baseSubTotal < 1000) return false; 
    if (c.category === "Bag") {
      return bagSubtotal >= 2000 ? c.minThreshold === 2000 : c.minThreshold === 1000;
    }
    return c.minThreshold === 1000;
  });

  return (
    <>
      <Navbar />
      <div className="cart-page style-page-checkout">
        <div className="checkout-header">
          <h2 className="main-title">Product Checkout</h2>
          <button className="back-navigation-btn" onClick={() => navigate("/cart")}>
            <ArrowIcon className="me-2" /> Back to Cart
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
                  onToggleWishlist={toggleWishlist} /* FIX: Connected correct handler pass structure */
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
                  placeholder="Enter coupon code" 
                  className="coupon-input" 
                  value={couponInput} 
                  onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }} 
                />
                <button className="apply-btn" onClick={handleVerifyAndApply}>Apply</button>
              </div>
              
              {couponError && <p className="coupon-error-msg text-danger small mt-1">{couponError}</p>}

              <div className="coupon-list">
                {visibleCoupons.map((coupon, idx) => (
                  <CouponCard 
                    key={idx} 
                    coupon={coupon} 
                    onSelectCoupon={handleSelectCouponCode} 
                    currentSubTotal={coupon.category === "Bag" ? bagSubtotal : coupon.category === "Wallet" ? walletSubtotal : beltSubtotal} 
                  />
                ))}
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