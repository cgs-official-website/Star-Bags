import { useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { GiPartyPopper } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import {
  FaRegHeart,
  FaHeart,
  FaStar,
  FaPlus,
  FaMinus,
  // FaTruck,
} from "react-icons/fa";

import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";

import "../../assets/styles/Cart.css";

const BillAddress = () => {
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
        <h2 className="cart-title">Billing and Address</h2>
        <NavLink className="back-btn" to={"/cart"}>
          Back
        </NavLink>
        <div className="cart-wrapper mt-5">
          {/* LEFT SECTION */}
          <div className="cart-left">
            {/* CART ITEMS */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-card">
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

              <h4 className="save-content btn">
                <GiPartyPopper /> Yay! you saved ₹500.00{" "}
              </h4>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BillAddress;
