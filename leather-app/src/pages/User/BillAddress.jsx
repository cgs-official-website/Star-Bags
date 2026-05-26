<<<<<<< HEAD
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
=======
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft as ArrowIcon } from "react-icons/fa";
>>>>>>> 0f8a16d5332536f4717356f90a720422dc453b29
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
  const navigate = useNavigate();

  // FIXED: Unpacking the dynamically passed custom chosen address object payload here
  const { 
    allCartItems = [], 
    cartItems: initialSelected = [], 
    rawTotal: passedRawTotal = 0, 
    couponPercentageLabel = "",
    selectedAddress = null 
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cartItems, setCartItems] = useState(initialSelected);
  const [masterCartList, setMasterCartList] = useState(allCartItems);

  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);
  
  const activeRawTotal = cartItems.length > 0 
    ? cartItems.reduce((acc, item) => {
        const originalPrice = Number(item.realPrice) || Number(item.price) || 0;
        return acc + (originalPrice * (item.qty || 1));
      }, 0)
    : passedRawTotal;
  
  const activeBaseSubTotal = cartItems.reduce((acc, item) => {
    return acc + (Number(item.price) * (item.qty || 1));
  }, 0);

  const activeDiscountTotal = activeRawTotal > activeBaseSubTotal ? (activeRawTotal - activeBaseSubTotal) : 0;
  
  const couponPercentValue = parseFloat(couponPercentageLabel) || 0;
  const activeCouponDiscount = (activeBaseSubTotal * couponPercentValue) / 100;
  
  const activeCalculatedSubTotal = activeBaseSubTotal - activeCouponDiscount;
  const activeGstTotal = Math.round(activeCalculatedSubTotal * 0.05);
  const activeFinalTotal = activeCalculatedSubTotal + activeGstTotal;

  const increaseQty = (id) => {
    setCartItems((prev) => 
      prev.map((item) => (item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item))
    );
    setMasterCartList((prev) => 
      prev.map((item) => (item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item))
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) => 
      prev.map((item) => (item.id === id && (item.qty || 1) > 1 ? { ...item, qty: (item.qty || 1) - 1 } : item))
    );
    setMasterCartList((prev) => 
      prev.map((item) => (item.id === id && (item.qty || 1) > 1 ? { ...item, qty: (item.qty || 1) - 1 } : item))
    );
  };

  const toggleWishlist = () => {};

  const handlePlaceOrderSubmit = () => {

    alert("Order successfully placed!");

    navigate("/");
  };

  const handleBackToCheckout = () => {
    navigate("/checkout", {
      state: {
        allCartItems: masterCartList,
        cartItems: cartItems,
        couponPercentageLabel: couponPercentageLabel
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="cart-page style-page-billing ">
        <div className="checkout-header pb-3">
          <h2 className="main-title">Billing and Address</h2>
          <button
            className="back-navigation-btn"
            onClick={handleBackToCheckout}
          >
            <ArrowIcon className="me-2" /> Back to Checkout
          </button>
        </div>

<<<<<<< HEAD
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
              <h4 className="section-subtitle-heading mb-2">
                Shipping Destination
              </h4>
              <p className="mb-1 fw-bold">Rahul Sharma</p>
              <p className="mb-1 text-muted">
                Flat No. 302, Sai Residency, Mumbai, Maharashtra - 400058
              </p>
              <p className="mb-0 text-muted">Phone: 9876543210</p>
            </div>

            <div className="review-items-box border rounded p-3 bg-white">
              <h4 className="section-subtitle-heading mb-3">
                Review Items ({cartItems.length})
              </h4>
              {cartItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2"
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                    <div>
                      <h6
                        className="mb-0 text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {item.name}
                      </h6>
                      <small className="text-muted">Qty: {item.qty || 1}</small>
                    </div>
                  </div>
                  <span className="fw-semibold">
                    ₹{(Number(item.price) * (item.qty || 1)).toFixed(2)}
                  </span>
                </div>
=======
        <div className="cart-layout-grid ">
          <div className="cart-left">
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <CartItem 
                  key={item.id || index} 
                  item={item} 
                  onIncrease={increaseQty} 
                  onDecrease={decreaseQty} 
                  onToggleWishlist={toggleWishlist} 
                  showActions={false} 
                  showCheckbox={false} 
                />
>>>>>>> 0f8a16d5332536f4717356f90a720422dc453b29
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
              handleCheckout={handlePlaceOrderSubmit}
            />

            {/* FIXED: Dynamic conditional template rendering block handles state values instead of strings */}
            <div className="address-box mt-4">
              <div className="address-top">
                <h5>Address</h5>
              </div>
              <div className="address-content">
                {selectedAddress ? (
                  <p>
                    <strong>{selectedAddress.name}</strong><br />
                    {selectedAddress.address}<br />
                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pin}<br />
                    Mobile: {selectedAddress.mobile}
                  </p>
                ) : (
                  <p className="text-muted">No selected destination address passed.</p>
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
<<<<<<< HEAD
=======


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

// export default BillAddress;
>>>>>>> 0f8a16d5332536f4717356f90a720422dc453b29
