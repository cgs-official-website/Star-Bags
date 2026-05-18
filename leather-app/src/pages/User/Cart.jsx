import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaPlusCircle } from "react-icons/fa";

import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import CartItem from "../../components/User/YourCart";
import CouponCard from "../../components/User/CouponCard";
import OrderSummary from "../../components/User/OrderSummary";

import "../../assets/styles/Cart.css";

const CartPage = () => {
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Leather Bag",
      price: 120,
      oldPrice: 150,
      discount: "20% off",
      image: "./src/assets/images/product.png",
      qty: 1,
      rating: 4.2,
      wishlist: false,
      selected: true,
    },
    {
      id: 2,
      name: "Leather Wallet",
      price: 120,
      oldPrice: 150,
      discount: "20% off",
      image: "./src/assets/images/bag.png",
      qty: 1,
      rating: 4.2,
      wishlist: false,
      selected: true,
    },
    {
      id: 3,
      name: "Leather Wallet",
      price: 120,
      oldPrice: 150,
      discount: "20% off",
      image: "./src/assets/images/wallet.png",
      qty: 1,
      rating: 4.2,
      wishlist: false,
      selected: true,
    },
    {
      id: 4,
      name: "Leather Belt",
      price: 120,
      oldPrice: 150,
      discount: "20% off",
      image: "./src/assets/images/belt.png",
      qty: 1,
      rating: 4.2,
      wishlist: false,
      selected: true,
    },
    {
      id: 5,
      name: "Leather Belt",
      price: 120,
      oldPrice: 150,
      discount: "20% off",
      image: "./src/assets/images/belt.png",
      qty: 1,
      rating: 4.2,
      wishlist: false,
      selected: true,
    },
    
  ]);

  const coupons = [
    {
      id: 1,
      offer: "30% off",
      code: "PRO456DFR",
      save: "₹45",
      description: "Minimum order ₹5999 required",
    },
    {
      id: 2,
      offer: "20% off",
      code: "SAVE20",
      save: "₹30",
      description: "Applicable on leather products",
    },
    {
      id: 3,
      offer: "15% off",
      code: "TGRF74K9",
      save: "₹45",
      description: "Minimum order ₹5999 required",
    },
  ];

  const selectedItems = cartItems.filter(
    (item) => item.selected
  );

  const totalItemsCount = selectedItems.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  const rawTotal = selectedItems.reduce(
    (acc, item) => acc + item.oldPrice * item.qty,
    0
  );

  const subTotal = selectedItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const discountTotal = rawTotal - subTotal;

  const gstTotal = Math.round(subTotal * 0.05);

  const finalTotal = subTotal + gstTotal;

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item
      )
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
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
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
          : item
      )
    );
  };

  const toggleSelect = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              selected: !item.selected,
            }
          : item
      )
    );
  };

  const applyCouponCode = (code) => {
    setCouponCode(code);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item");
      return;
    }

    navigate("/checkout", {
      state: {
        cartItems: selectedItems,
        totalItemsCount,
        rawTotal,
        discountTotal,
        subTotal,
        gstTotal,
        finalTotal,
      },
    });
  };

  return (
    <>
      <Navbar />

      <div className="cart-page">
        <h2 className="cart-title">
          Your cart
          <span className="cart-count">
            ({cartItems.length} items)
          </span>
        </h2>

        <p className="cart-subtitle">
          Review your items and proceed to checkout
        </p>

        <div className="cart-wrapper">
          <div className="cart-left">
            <div className="cart-items">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={increaseQty}
                  onDecrease={decreaseQty}
                  onRemove={removeItem}
                  onToggleWishlist={toggleWishlist}
                  onSelect={toggleSelect}
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
              handleCheckout={handleCheckout}
            />

            <div className="coupon-section">
              <h5 className="coupon-title">
                Apply coupon
              </h5>

              <div className="coupon-input-box">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="coupon-input"
                  value={couponCode}
                  onChange={(e) =>
                    setCouponCode(e.target.value)
                  }
                />

                <button className="apply-btn">
                  Apply
                </button>
              </div>

              <div className="coupon-list">
                {coupons.map((coupon) => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    onApplyCoupon={applyCouponCode}
                  />
                ))}
              </div>

              <p className="more-coupon">
                <FaPlusCircle />
                More Coupons
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