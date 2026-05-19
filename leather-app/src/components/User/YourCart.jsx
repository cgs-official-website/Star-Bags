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
  // Dynamically calculate current price based on oldPrice and discount percentage string
  const discountPercent = parseInt(item.discount) || 0;
  const currentPrice = item.oldPrice - (item.oldPrice * discountPercent) / 100;

  return (
    <div className="cart-card">
      <div className="cart-image-wrapper">
        {showCheckbox && (
          <input
            type="checkbox"
            checked={item.selected}
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
                <span>{item.rating}</span>
                <span className="rating-count">(120)</span>
              </div>
              <div onClick={() => onToggleWishlist(item.id)} className="wishlist-icon" style={{ cursor: "pointer" }}>
                {item.wishlist ? <FaHeart color="red" size={24} /> : <FaRegHeart color="red" size={24} />}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center price-row-container">
            <div className="price-row">
              <h5 className="current-price">₹ {currentPrice.toFixed(2)}</h5>
              <span className="old-price">₹ {item.oldPrice}</span>
              <span className="discount">{item.discount}</span>
            </div>

            <div className="qty-box">
              <button onClick={() => onDecrease(item.id)} className="qty-btn"><FaMinus /></button>
              <div className="qty-number">{item.qty}</div>
              <button onClick={() => onIncrease(item.id)} className="qty-btn"><FaPlus /></button>
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
              <button onClick={() => onRemove(item.id)} className="remove-btn">
                <i className="bi bi-trash3 text-danger"></i> Remove
              </button>
              <button className="buy-btn">Buy this now</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;