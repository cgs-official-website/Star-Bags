import { FaStar, FaHeart, FaRegHeart, FaMinus, FaPlus } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";

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
  // Sync property names with your central product catalog schema
  const discountPercent = parseInt(item.offer) || 0;
  const oldPriceNum = Number(item.realPrice) || Number(item.price);
  
  // FIX: Using currentPrice in the layout below removes the ESLint no-unused-vars warning
  const currentPrice = oldPriceNum - (oldPriceNum * discountPercent) / 100;

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
              <div onClick={() => onToggleWishlist(item)} className="wishlist-icon" style={{ cursor: "pointer" }}>
                {item.wishlist ? <FaHeart color="red" size={24} /> : <FaRegHeart color="red" size={24} />}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center price-row-container">
            <div className="price-row">
              {/* FIX: Replaced item.price with currentPrice to show correct calculations and clear compiler errors */}
              <h5 className="current-price">₹ {currentPrice.toFixed(2)}</h5>
              <span className="old-price">₹ {oldPriceNum.toFixed(2)}</span>
              <span className="discount">{item.offer || "0% off"}</span>
            </div>

            <div className="qty-box">
              <button onClick={() => onDecrease(item.id)} className="qty-btn" type="button"><FaMinus /></button>
              <div className="qty-number">{item.qty || item.quantity || 1}</div>
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
              <button className="buy-btn" type="button">Buy this now</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;