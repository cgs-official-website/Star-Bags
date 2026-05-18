import { useState } from "react";

import { NavLink, useLocation } from "react-router-dom";

import { FaArrowLeft, FaClock, FaTruck } from "react-icons/fa";

import { TiPencil } from "react-icons/ti";

import { TbCreditCardPay } from "react-icons/tb";

import { GiMoneyStack } from "react-icons/gi";

import Navbar from "../components/User/Navbar";

import Footer from "../components/User/Footer";

import CartItem from "../components/User/YourCart";

import OrderSummary from "../components/User/OrderSummary";

import "../assets/styles/Cart.css";

const BillAddress = () => {
  const location = useLocation();

  const {
    cartItems: selectedCartItems = [],
    totalItemsCount = 0,
    rawTotal = 0,
    discountTotal = 0,
    subTotal = 0,
    gstTotal = 0,
    finalTotal = 0,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [cartItems, setCartItems] = useState(selectedCartItems);

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1
          ? {
              ...item,
              qty: item.qty - 1,
            }
          : item,
      ),
    );
  };

  const toggleWishlist = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              wishlist: !item.wishlist,
            }
          : item,
      ),
    );
  };

  return (
    <>
      <Navbar />

      <div className="cart-page">
        <h2 className="cart-title">Billing and address</h2>

        <NavLink className="back-btn fw-bold" to={"/cart"}>
          <FaArrowLeft /> Back
        </NavLink>

        <div className="cart-wrapper mt-4">
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
              rawTotal={rawTotal}
              discountTotal={discountTotal}
              subTotal={subTotal}
              gstTotal={gstTotal}
              finalTotal={finalTotal}
              isBillingPage={true}
            />

            <div className="address-box mt-4">
              <div className="address-top">
                <h5>Address</h5>

                <button className="choose-address-btn">
                  <TiPencil />
                  Choose Address
                </button>
              </div>

              <div className="address-content">
                <p>
                  Rahul Sharma , Flat No. 302, Sai Residency
                  <br />
                  Mumbai, Maharashtra - 400058
                  <br />
                  Mobile: 9876543210
                </p>
              </div>

              <div className="delivery-info">
                <div className="delivery-card">
                  <FaTruck />
                  <span>Cash on delivery</span>
                </div>

                <div className="delivery-card">
                  <FaClock />
                  <span>Delivery time 3 to 6 days</span>
                </div>
              </div>
            </div>

            <div className="payment-box mt-4">
              <h5 className="payment-title">Payment method</h5>

              <p className="payment-subtitle">Choose a payment method</p>

              <div
                className={`payment-card ${
                  paymentMethod === "cod" ? "active-payment" : ""
                }`}
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
                    <p className="fw-bold">Cash on delivery</p>

                    <p>you pay when your order is delivered</p>
                  </div>
                </div>
              </div>

              <div
                className={`payment-card ${
                  paymentMethod === "online" ? "active-payment" : ""
                }`}
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
                    <p className="fw-bold">Online payment</p>

                    <p>Pay securely Using UPI, Cards, Net banking & More</p>

                    <div className="payment-brands">
                      <span>UPI</span>
                      <span>RuPay</span>
                      <span>VISA</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="continue-payment-btn">
                Continue Payment →
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
