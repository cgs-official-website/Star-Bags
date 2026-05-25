import React from "react";
import { FaStar, FaHeart, FaRegHeart, FaMinus, FaPlus } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { useWishlist } from "../../context/WishlistContext";
import { useNavigate } from "react-router-dom";

const CartItem = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  onToggleWishlist,
  onSelect,
  showActions = true,
  showCheckbox = true,
}) => {
  const { wishlist, cart } = useWishlist();
  const navigate = useNavigate();

  const discountPercent = parseInt(item.offer) || 0;
  const oldPriceNum = Number(item.realPrice) || Number(item.price);
  const currentPrice = oldPriceNum - (oldPriceNum * discountPercent) / 100;

  const isItemInWishlist = wishlist ? wishlist.some(
    (wItem) => wItem.name === item.name && Number(wItem.price) === Number(item.price)
  ) : false;

  const handleSingleItemCheckout = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const singleCheckoutItem = [{ ...item, selected: true, qty: item.qty || 1 }];
    const totalItemsCount = item.qty || 1;
    const rawTotal = (Number(item.realPrice) || Number(item.price)) * totalItemsCount;
    const subTotal = Number(item.price) * totalItemsCount;
    const discountTotal = rawTotal > subTotal ? (rawTotal - subTotal) : 0;
    const gstTotal = Math.round(subTotal * 0.05);
    const finalTotal = subTotal + gstTotal;

    navigate("/checkout", {
      state: {
        allCartItems: cart || [],
        cartItems: singleCheckoutItem,
        totalItemsCount,
        rawTotal,
        discountTotal,
        subTotal,
        gstTotal,
        finalTotal,
        couponDiscount: 0,
        couponPercentageLabel: ""
      },
    });
  };

  return (
    <div className="cart-card">
      <div className="cart-image-wrapper">
        {showCheckbox && (
          <input
            type="checkbox"
            checked={!!item.selected}
            onChange={() => onSelect(item.id)}
            className="cart-check-overlay"
          />
        )}
        <div className="cart-image">
          <img src={item.image} alt={item.name} />
        </div>
      </div>

      <div className="cart-content">
        <div>
          <div className="cart-top mb-3">
            <h6 className="cart-product-name">{item.name}</h6>
            <div className="cart-rating">
              <div className="rating-box">
                <FaStar color="#facc15" />
                <span>{item.rating || "4.2"}</span>
                <span className="rating-count">({item.ratingCount || 120})</span>
              </div>
              <div 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleWishlist(item);
                }} 
                className="wishlist-icon" 
                style={{ cursor: "pointer" }}
              >
                {isItemInWishlist ? <FaHeart color="red" size={24} /> : <FaRegHeart color="red" size={24} />}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center price-row-container">
            <div className="price-row">
              <h5 className="current-price">₹ {currentPrice.toFixed(2)}</h5>
              <span className="old-price">₹ {oldPriceNum.toFixed(2)}</span>
              <span className="discount">{item.offer || "0% off"}</span>
            </div>

            <div className="qty-box">
              <button onClick={() => onDecrease(item.id)} className="qty-btn" type="button"><FaMinus /></button>
              <div className="qty-number">{item.qty || 1}</div>
              <button onClick={() => onIncrease(item.id)} className="qty-btn" type="button"><FaPlus /></button>
            </div>
          </div>
          <p className="pattern-text">Pattern : Leather</p>
          <div className="cod-box">
            <p><span><TbTruckDelivery /></span>Cash On Delivery Available</p>
          </div>
        </div>

        {showActions && (
          <div className="cart-bottom">
            <div className="cart-buttons">
              <button onClick={() => onRemove(item.id)} className="remove-btn" type="button">
                <i className="bi bi-trash3 text-danger"></i> Remove
              </button>
              <button onClick={handleSingleItemCheckout} className="buy-btn" type="button">
                Buy this now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;