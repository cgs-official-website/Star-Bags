// import { useState } from "react";
// import { useLocation, NavLink, useNavigate } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";
// import { TiPencil } from "react-icons/ti";
// import { TbCreditCardPay } from "react-icons/tb";
// import { GiMoneyStack } from "react-icons/gi";
// import PaymentImage from "../../assets/images/payment-icon.png";
// import Navbar from "../../components/User/Navbar";
// import Footer from "../../components/User/Footer";
// import CartItem from "../../components/User/YourCart";
// import OrderSummary from "../../components/User/OrderSummary";
// import "../../assets/styles/Cart.css";

// const BillAddress = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { 
//     allCartItems = [], 
//     cartItems: initialSelected = [], 
//     rawTotal: passedRawTotal = 0, 
//     couponPercentageLabel = "" 
//   } = location.state || {};

//   const [paymentMethod, setPaymentMethod] = useState("cod");
//   const [cartItems, setCartItems] = useState(initialSelected);
//   const [masterCartList, setMasterCartList] = useState(allCartItems);

//   const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);
  
//   const activeRawTotal = cartItems.length > 0 
//     ? cartItems.reduce((acc, item) => {
//         const originalPrice = Number(item.realPrice) || Number(item.price) || 0;
//         return acc + (originalPrice * (item.qty || 1));
//       }, 0)
//     : passedRawTotal;
  
//   const activeBaseSubTotal = cartItems.reduce((acc, item) => {
//     return acc + (Number(item.price) * (item.qty || 1));
//   }, 0);

//   const activeDiscountTotal = activeRawTotal > activeBaseSubTotal ? (activeRawTotal - activeBaseSubTotal) : 0;
  
//   const couponPercentValue = parseFloat(couponPercentageLabel) || 0;
//   const activeCouponDiscount = (activeBaseSubTotal * couponPercentValue) / 100;
  
//   const activeCalculatedSubTotal = activeBaseSubTotal - activeCouponDiscount;
//   const activeGstTotal = Math.round(activeCalculatedSubTotal * 0.05);
//   const activeFinalTotal = activeCalculatedSubTotal + activeGstTotal;

//   const increaseQty = (id) => {
//     setCartItems((prev) => 
//       prev.map((item) => (item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item))
//     );
//     setMasterCartList((prev) => 
//       prev.map((item) => (item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item))
//     );
//   };

//   const decreaseQty = (id) => {
//     setCartItems((prev) => 
//       prev.map((item) => (item.id === id && (item.qty || 1) > 1 ? { ...item, qty: (item.qty || 1) - 1 } : item))
//     );
//     setMasterCartList((prev) => 
//       prev.map((item) => (item.id === id && (item.qty || 1) > 1 ? { ...item, qty: (item.qty || 1) - 1 } : item))
//     );
//   };

//   const toggleWishlist = () => {};

//   const handlePlaceOrderSubmit = () => {
//     alert("Order successfully placed!");
//     navigate("/");
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="cart-page style-page-billing">
//         <h2 className="cart-title">Billing and address</h2>
        
//         <NavLink 
//           to="/checkout" 
//           state={{ 
//             allCartItems: masterCartList, 
//             cartItems: cartItems, 
//             appliedCouponDiscount: activeCouponDiscount, 
//             couponPercentageLabel 
//           }}
//           className="back-btn fw-bold text-decoration-none d-inline-flex align-items-center gap-2 mb-3"
//           style={{ color: "#171744" }}
//         >
//           <FaArrowLeft /> Back to Checkout
//         </NavLink>

//         <div className="cart-layout-grid">
//           <div className="cart-left">
//             <div className="cart-items">
//               {cartItems.map((item, index) => (
//                 <CartItem 
//                   key={item.id || index} 
//                   item={item} 
//                   onIncrease={increaseQty} 
//                   onDecrease={decreaseQty} 
//                   onToggleWishlist={toggleWishlist} 
//                   showActions={false} 
//                   showCheckbox={false} 
//                 />
//               ))}
//             </div>
//           </div>

//           <div className="cart-right">
//             <OrderSummary 
//               totalItemsCount={totalItemsCount} 
//               rawTotal={activeRawTotal} 
//               discountTotal={activeDiscountTotal + activeCouponDiscount} 
//               subTotal={activeCalculatedSubTotal} 
//               couponDiscount={activeCouponDiscount} 
//               couponPercentageLabel={couponPercentageLabel} 
//               gstTotal={activeGstTotal} 
//               finalTotal={activeFinalTotal} 
//               isBillingPage={true} 
//               handleCheckout={handlePlaceOrderSubmit}
//             />

//             <div className="address-box mt-4">
//               <div className="address-top">
//                 <h5>Address</h5>
//                 <button className="choose-address-btn"><TiPencil /> Choose Address</button>
//               </div>
//               <div className="address-content">
//                 <p>
//                   Rahul Sharma, Flat No. 302, Sai Residency<br />
//                   Mumbai, Maharashtra - 400058<br />
//                   Mobile: 9876543210
//                 </p>
//               </div>
//             </div>

//             <div className="payment-box mt-4">
//               <h6 className="payment-title">Payment method</h6>
//               <p className="payment-subtitle">Choose a payment method</p>

//               <div 
//                 className={`payment-card ${paymentMethod === "cod" ? "active-payment" : ""}`} 
//                 onClick={() => setPaymentMethod("cod")}
//               >
//                 <div className="payment-left">
//                   <input 
//                     type="radio" 
//                     checked={paymentMethod === "cod"} 
//                     onChange={() => setPaymentMethod("cod")} 
//                   />
//                   <div className="payment-icon"><GiMoneyStack /></div>
//                   <div>
//                     <p className="fw-bold m-0">Cash on delivery</p>
//                     <p className="m-0">you pay when your order is delivered</p>
//                   </div>
//                 </div>
//               </div>

//               <div 
//                 className={`payment-card ${paymentMethod === "online" ? "active-payment" : ""}`} 
//                 onClick={() => setPaymentMethod("online")}
//               >
//                 <div className="payment-left">
//                   <input 
//                     type="radio" 
//                     checked={paymentMethod === "online"} 
//                     onChange={() => setPaymentMethod("online")} 
//                   />
//                   <div className="payment-icon"><TbCreditCardPay /></div>
//                   <div>
//                     <p className="fw-bold m-0">Online payment</p>
//                     <p className="m-0">Pay securely Using UPI, Cards, Net banking & More</p>
//                     <span className="payment-icons"><img src={PaymentImage} alt="Payment Methods" /></span>
//                   </div>
//                 </div>
//               </div>

//               <button className="continue-payment-btn" onClick={handlePlaceOrderSubmit}>
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

// export default BillAddress;


import React, { useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { TbCreditCardPay } from "react-icons/tb";
import { GiMoneyStack } from "react-icons/gi";
import PaymentImage from "../../assets/images/payment-icon.png";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import OrderSummary from "../../components/User/OrderSummary";
import "../../assets/styles/Cart.css";

const BillAddress = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    cartItems = [],
    totalItemsCount = 0,
    rawTotal = 0,
    discountTotal = 0,
    subTotal = 0,
    couponDiscount = 0,
    couponPercentageLabel = "",
    gstTotal = 0,
    finalTotal = 0,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handlePlaceOrderSubmit = () => {
    alert(`Order placed successfully using ${paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}!`);
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <div className="cart-page billing-page-container">
        <h2 className="main-title mb-4">Billing & Review</h2>

        <NavLink 
          to="/checkout" 
          state={{ ...location.state }}
          className="back-btn fw-bold text-decoration-none d-inline-flex align-items-center gap-2 mb-4"
          style={{ color: "#171744" }}
        >
          <FaArrowLeft /> Back to Checkout
        </NavLink>
        
        <div className="cart-layout-grid">
          <div className="cart-left">
            <div className="billing-address-summary-box mb-4 p-3 border rounded bg-light">
              <h4 className="section-subtitle-heading mb-2">Shipping Destination</h4>
              <p className="mb-1 fw-bold">Rahul Sharma</p>
              <p className="mb-1 text-muted">Flat No. 302, Sai Residency, Mumbai, Maharashtra - 400058</p>
              <p className="mb-0 text-muted">Phone: 9876543210</p>
            </div>

            <div className="review-items-box border rounded p-3 bg-white">
              <h4 className="section-subtitle-heading mb-3">Review Items ({cartItems.length})</h4>
              {cartItems.map((item, idx) => (
                <div key={item.id || idx} className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                  <div className="d-flex align-items-center gap-3">
                    <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }} />
                    <div>
                      <h6 className="mb-0 text-truncate" style={{ maxWidth: "200px" }}>{item.name}</h6>
                      <small className="text-muted">Qty: {item.qty || 1}</small>
                    </div>
                  </div>
                  <span className="fw-semibold">₹{(Number(item.price) * (item.qty || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-right">
            <OrderSummary
              totalItemsCount={totalItemsCount}
              rawTotal={rawTotal}
              discountTotal={discountTotal}
              subTotal={subTotal - couponDiscount}
              couponDiscount={couponDiscount}
              couponPercentageLabel={couponPercentageLabel}
              gstTotal={gstTotal}
              finalTotal={finalTotal}
              isBillingPage={true}
              handleCheckout={handlePlaceOrderSubmit}
            />

            <div className="payment-box mt-4">
              <h6 className="payment-title">Payment method</h6>
              <p className="payment-subtitle">Choose a payment method</p>

              <div 
                className={`payment-card ${paymentMethod === "cod" ? "active-payment" : ""}`} 
                onClick={() => setPaymentMethod("cod")}
                style={{ cursor: "pointer" }}
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
                style={{ cursor: "pointer" }}
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

              <button className="continue-payment-btn" onClick={handlePlaceOrderSubmit}>
                Place Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BillAddress;