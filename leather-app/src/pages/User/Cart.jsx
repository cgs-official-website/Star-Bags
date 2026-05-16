import { useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";
// import { CiCirclePlus } from "react-icons/ci";
import { FaPlusCircle } from "react-icons/fa";
import {
  FaRegHeart,
  FaHeart,
  FaStar,
  FaPlus,
  FaMinus,
  // FaTruck,
  FaRegCopy,
} from "react-icons/fa";

import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";

import "../../assets/styles/Cart.css";
import { NavLink } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Leather Bag",
      price: 120,
      oldPrice: 120,
      discount: "20% off",
      image: "./src/assets/images/product.png",
      qty: 1,
      rating: 4.2,
      wishlist: false,
    },
    {
      id: 2,
      name: "Leather Wallet",
      price: 120,
      oldPrice: 120,
      discount: "20% off",
      image: "./src/assets/images/bag.png",
      qty: 1,
      rating: 4.2,
      wishlist: true,
    },
    {
      id: 3,
      name: "Leather Wallet",
      price: 120,
      oldPrice: 120,
      discount: "20% off",
      image: "./src/assets/images/belt.png",
      qty: 1,
      rating: 4.2,
      wishlist: false,
    },
    {
      id: 4,
      name: "Leather Wallet",
      price: 120,
      oldPrice: 120,
      discount: "20% off",
      image: "./src/assets/images/wallet.png",
      qty: 1,
      rating: 4.2,
      wishlist: false,
    },
  ]);

  const coupons = [
    {
      id: 1,
      offer: "30% off",
      code: "PRO456DFR",
      save: "₹45",
      description:
        "If you want to Claim Coupon Add minimum $5999 Product, If not , you can’t claim this coupon",
    },
    {
      id: 2,
      offer: "30% off",
      code: "PRO456DFR",
      save: "₹45",
      description:
        "If you want to Claim Coupon Add minimum $5999 Product, If not , you can’t claim this coupon",
    },
    {
      id: 3,
      offer: "30% off",
      code: "PRO456DFR",
      save: "₹45",
      description:
        "If you want to Claim Coupon Add minimum $5999 Product, If not , you can’t claim this coupon",
    },
  ];

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleWishlist = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, wishlist: !item.wishlist } : item,
      ),
    );
  };

  return (
    <>
      <Navbar />

      <div className="cart-page">
        <h2 className="cart-title">
          Your cart{" "}
          <span className="cart-count">({cartItems.length} items)</span>
        </h2>
        <p className="cart-subtitle">
          Review your items and proceed to checkout
        </p>
        <div className="cart-wrapper">
          {/* LEFT SECTION */}
          <div className="cart-left">
            {/* CART ITEMS */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-card">
                  {/* CHECKBOX */}
                  <input
                    type="checkbox"
                    defaultChecked
                    className="cart-check"
                  />

                  {/* IMAGE */}
                  <div className="cart-image">
                    <img src={item.image} alt="" className="cart-image" />
                  </div>

                  {/* CONTENT */}
                  <div className="cart-content">
                    <div>
                      {/* TOP */}
                      <div className="cart-top">
                        <h4 className="cart-product-name">{item.name}</h4>

                        <div className="cart-rating">
                          <div className="rating-box">
                            <FaStar color="#facc15" />

                            <span>{item.rating}</span>

                            <span className="rating-count">(120)</span>
                          </div>

                          <div
                            onClick={() => toggleWishlist(item.id)}
                            className="wishlist-icon"
                          >
                            {item.wishlist ? (
                              <FaHeart color="red" size={24} />
                            ) : (
                              <FaRegHeart color="red" size={24} />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* PRICE */}
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="price-row">
                          <h5 className="current-price">₹ {item.price}</h5>

                          <span className="old-price">₹ {item.oldPrice}</span>

                          <span className="discount">{item.discount}</span>
                        </div>

                        {/* QTY */}
                        <div className="qty-box">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="qty-btn"
                          >
                            <FaMinus />
                          </button>

                          <div className="qty-number">{item.qty}</div>

                          <button
                            onClick={() => increaseQty(item.id)}
                            className="qty-btn"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>

                      <p className="pattern-text">Pattern : Leather</p>

                      <div className="cod-box">
                        {/* <FaTruck /> */}

                        <p>
                          <span>
                            <TbTruckDelivery />
                          </span>{" "}
                          Cash On Delivery Available
                        </p>
                      </div>
                    </div>

                    {/* BOTTOM */}
                    <div className="cart-bottom">
                      {/* BUTTONS */}
                      <div className="cart-buttons">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="remove-btn"
                        >
                          Remove
                        </button>

                        <button className="buy-btn">Buy this now</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="cart-right">
            {/* ORDER SUMMARY */}
            <div className="summary-box">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-row">
                <span>Items(4)</span>
                <span>₹1500.00</span>
              </div>

              <div className="summary-row">
                <span>Discount</span>

                <span className="discount-price">-₹500.00</span>
              </div>

              <div className="summary-row">
                <span>Sub total</span>
                <span>₹1000.00</span>
              </div>

              <div className="summary-row">
                <span>GST Include (5%)</span>
                <span>₹240</span>
              </div>

              <div className="total-row">
                <span>Total</span>

                <span className="total-price">₹1000.00</span>
              </div>

              <NavLink
                to={"/checkout"}
                className="checkout-btn text-decoration-none "
              >
                Proceed to checkout →
              </NavLink>
            </div>

            {/* APPLY COUPON */}
            <div className="coupon-section">
              <h5 className="coupon-title">Apply coupon</h5>

              <div className="coupon-input-box">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="coupon-input"
                />

                <button className="apply-btn">Apply</button>
              </div>

              {/* COUPON LIST */}
              <div className="coupon-list">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="coupon-card">
                    <div className="coupon-top">
                      <span className="offer-tag">{coupon.offer}</span>

                      <button className="coupon-apply-btn">Apply</button>
                    </div>

                    <div className="coupon-code">
                      <span className="code-text">{coupon.code}</span>

                      <FaRegCopy />
                    </div>

                    <p className="save-text">Save ₹45 on this order</p>

                    <hr style={{ marginBottom: "15px" }} />

                    <p className="coupon-description">{coupon.description}</p>
                  </div>
                ))}
              </div>
              <p className="more-coupon">
                <FaPlusCircle /> More Coupons
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CartPage;
