import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
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
  return (
    <div className="cart-card">
      {/* CHECKBOX */}
      {showCheckbox && (
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => onSelect(item.id)}
          className="cart-check"
        />
      )}
      {/* IMAGE */}
      <div className="cart-image">
        <img src={item.image} alt={item.name} />
      </div>

      {/* CONTENT */}
      <div className="cart-content">
        <div>
          {/* TOP */}
          <div className="cart-top">
            <h4 className="cart-product-name">
              {item.name}
            </h4>

            <div className="cart-rating">
              <div className="rating-box">
                <FaStar color="#facc15" />

                <span>{item.rating}</span>

                <span className="rating-count">
                  (120)
                </span>
              </div>
              <div
                onClick={() =>
                  onToggleWishlist(item.id)
                }
                className="wishlist-icon"
              >
                {item.wishlist ? (
                  <FaHeart color="red" size={24} />
                ) : (
                  <FaRegHeart
                    color="red"
                    size={24}
                  />
                )}
              </div>
            </div>
          </div>
          {/* PRICE */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="price-row">
              <h5 className="current-price">
                ₹ {item.price}
              </h5>

              <span className="old-price">
                ₹ {item.oldPrice}
              </span>

              <span className="discount">
                {item.discount}
              </span>
            </div>

            {/* QTY */}
            <div className="qty-box">
              <button
                onClick={() =>
                  onDecrease(item.id)
                }
                className="qty-btn"
              >
                <FaMinus />
              </button>
              <div className="qty-number">
                {item.qty}
              </div>
              <button
                onClick={() =>
                  onIncrease(item.id)
                }
                className="qty-btn"
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <p className="pattern-text">
            Pattern : Leather
          </p>
          <div className="cod-box">
            <p>
              <span>
                <TbTruckDelivery />
              </span>
              Cash On Delivery Available
            </p>
          </div>
        </div>
        {/* ACTIONS */}
        {showActions && (
          <div className="cart-bottom">
            <div className="cart-buttons">
              <button
                onClick={() =>
                  onRemove(item.id)
                }
                className="remove-btn"
              >
                Remove
              </button>
              <button className="buy-btn">
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