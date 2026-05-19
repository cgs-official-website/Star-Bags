import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
// import { TiPencil } from "react-icons/ti";
import { TbCreditCardPay } from "react-icons/tb";
import { GiMoneyStack } from "react-icons/gi";
import PaymentImage from "../../assets/images/payment-icon.png";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import CartItem from "../../components/User/YourCart";
import OrderSummary from "../../components/User/OrderSummary";
import "../../assets/styles/Cart.css";

const BillAddress = () => {
  const location = useLocation();

  // Extract variables passed from the previous step
  const { 
    allCartItems = [], 
    cartItems: initialSelected = [], 
    rawTotal: passedRawTotal = 0, 
    couponPercentageLabel = "" 
  } = location.state || {};

  // Component States
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cartItems, setCartItems] = useState(initialSelected);
  const [masterCartList, setMasterCartList] = useState(allCartItems);

  // Core Math Calculations Engine (Derived strictly from current state values)
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  
  // Assigned to clear ESLint no-unused-vars error
  const activeRawTotal = cartItems.length > 0 
    ? cartItems.reduce((acc, item) => acc + item.oldPrice * item.qty, 0)
    : passedRawTotal;
  
  const activeBaseSubTotal = cartItems.reduce((acc, item) => {
    const disc = parseInt(item.discount) || 0;
    return acc + (item.oldPrice - (item.oldPrice * disc) / 100) * item.qty;
  }, 0);

  const activeDiscountTotal = activeRawTotal - activeBaseSubTotal;
  
  // Calculate active coupon percentages on the fly
  const couponPercentValue = parseFloat(couponPercentageLabel) || 0;
  const activeCouponDiscount = (activeBaseSubTotal * couponPercentValue) / 100;
  
  const activeCalculatedSubTotal = activeBaseSubTotal - activeCouponDiscount;
  const activeGstTotal = Math.round(activeCalculatedSubTotal * 0.05);
  const activeFinalTotal = activeCalculatedSubTotal + activeGstTotal;

  // Handler Actions (Updates both arrays cleanly to avoid tracking side effects)
  const increaseQty = (id) => {
    setCartItems((prev) => 
      prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
    );
    setMasterCartList((prev) => 
      prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) => 
      prev.map((item) => (item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item))
    );
    setMasterCartList((prev) => 
      prev.map((item) => (item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item))
    );
  };

  const toggleWishlist = (id) => {
    setCartItems((prev) => 
      prev.map((item) => (item.id === id ? { ...item, wishlist: !item.wishlist } : item))
    );
    setMasterCartList((prev) => 
      prev.map((item) => (item.id === id ? { ...item, wishlist: !item.wishlist } : item))
    );
  };

  return (
    <>
      <Navbar />
      <div className="cart-page style-page-billing">
        <h2 className="cart-title">Billing and address</h2>
        
        {/* Back-navigation element configured to pass updated state history */}
        <NavLink 
          to="/checkout" 
          state={{ 
            allCartItems: masterCartList, 
            cartItems: cartItems, 
            appliedCouponDiscount: activeCouponDiscount, 
            couponPercentageLabel 
          }}
          className="back-btn fw-bold text-decoration-none d-inline-flex align-items-center gap-2 mb-3"
          style={{ color: "#171744" }}
        >
          <FaArrowLeft /> Back to Checkout
        </NavLink>

        <div className="cart-layout-grid">
          <div className="cart-left">
            <div className="cart-items">
              {cartItems.map((item) => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onIncrease={increaseQty} 
                  onDecrease={decreaseQty} 
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
              rawTotal={activeRawTotal} 
              discountTotal={activeDiscountTotal} 
              subTotal={activeCalculatedSubTotal} 
              couponDiscount={activeCouponDiscount} 
              couponPercentageLabel={couponPercentageLabel} 
              gstTotal={activeGstTotal} 
              finalTotal={activeFinalTotal} 
              isBillingPage={true} 
            />
{/* 
            <div className="address-box mt-4">
              <div className="address-top">
                <h5>Address</h5>
                <button className="choose-address-btn"><TiPencil /> Choose Address</button>
              </div>
              <div className="address-content">
                <p>
                  Rahul Sharma, Flat No. 302, Sai Residency<br />
                  Mumbai, Maharashtra - 400058<br />
                  Mobile: 9876543210
                </p>
              </div>
            </div> */}

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
                  <div className="payment-icon"><GiMoneyStack /></div>
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
                  <div className="payment-icon"><TbCreditCardPay /></div>
                  <div>
                    <p className="fw-bold m-0">Online payment</p>
                    <p className="m-0">Pay securely Using UPI, Cards, Net banking & More</p>
                    <span className="payment-icons"><img src={PaymentImage} alt="Payment Methods" /></span>
                  </div>
                </div>
              </div>

              <button className="continue-payment-btn">Continue Payment →</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BillAddress;