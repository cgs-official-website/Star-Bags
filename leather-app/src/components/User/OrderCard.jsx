import React from "react";
import "../../assets/styles/OrderCard.css";
import defaultImage from "../../assets/images/bag.png";

// Small star icon (used for rating display)
function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5a623">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function OrderCard(props) {
  // Read props (with default values for demo / empty usage)
  const id = props.id || "ID002457890KJM";
  const productName = props.productName || "2-Seater Leather Sofa";
  const image = props.image || defaultImage;
  const oldPrice = props.oldPrice;
  const price = props.price !== undefined ? props.price : 120;
  const quantity = props.quantity !== undefined ? props.quantity : 1;
  const rating = props.rating !== undefined ? props.rating : 4.2;
  const reviews = props.reviews !== undefined ? props.reviews : 120;
  const status = props.status || "Delivered";
  const deliveryDate = props.deliveryDate || "25/04/2020";
  const onTrackOrder = props.onTrackOrder || function () {};
  const onRateProduct = props.onRateProduct || function () {};

  // Pick CSS class for status color
  let statusColorClass = "status-default";
  if (status === "Delivered") {
    statusColorClass = "status-delivered";
  } else if (status === "Pending" || status === "Shipped") {
    statusColorClass = "status-pending";
  } else if (status === "Cancelled") {
    statusColorClass = "status-cancelled";
  }

  // Show old price only when it is higher than current price
  const showOldPrice = oldPrice && oldPrice > price;

  return (
    <div className="order-card">
      {/* Left: product image */}
      <div className="order-card-image">
        <img src={image} alt={productName} />
      </div>

      {/* Center: product info */}
      <div className="order-card-info">
        <p className="order-id">Order {id}</p>

        <div className="name-rating-row">
          <h3 className="product-name">{productName}</h3>
          <div className="rating-box">
            <StarIcon />
            <span className="rating-number">{rating}</span>
            <span className="review-count">({reviews})</span>
          </div>
        </div>

        <div className="price-row">
          <span className="current-price">$ {price}</span>
          {showOldPrice && (
            <span className="old-price">$ {oldPrice}</span>
          )}
        </div>

        <p className="quantity">Qty:{quantity}</p>
      </div>

      {/* Right: status + track button */}
      <div className="order-card-status">
        <p className="section-label">Status</p>
        <p className={"status-text " + statusColorClass}>{status}</p>
        <div className="track-button-container">
          <button type="button" className="btn-track" onClick={onTrackOrder}>
            Track Order
          </button>
        </div>
      </div>

      {/* Right: time + rate button */}
      <div className="order-card-time">
        <p className="section-label">Time</p>
        <p className="delivery-date">
          {status === "Delivered" ? "Delivered on " : ""}
          <span>{deliveryDate}</span>
        </p>
        <button type="button" className="btn-rate" onClick={onRateProduct}>
          <StarIcon />
          Rate Product
        </button>
      </div>
    </div>
  );
}

export default OrderCard;
