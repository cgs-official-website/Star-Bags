import "../../assets/styles/OrderCard.css";
import bagImg from "../../assets/images/bag.png";

const StarIcon = ({ color = "#f5a623" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const statusClass = {
  Delivered: "order-card__status--delivered",
  Pending: "order-card__status--pending",
  Cancelled: "order-card__status--cancelled",
};

export default function OrderCard({
  orderId = "ID002457890KJM",
  productName = "2-Seater Leather Sofa",
  rating = 4.2,
  reviewCount = 120,
  price = 120,
  originalPrice = 120,
  quantity = 1,
  status = "Delivered",
  deliveredOn = "25/04/2020",
  imageUrl = { bagImg },
  onTrackOrder = () => { },
  onRateProduct = () => { },
}) {
  return (
    <div className="order-card">

      {/* Product Image */}
      <div className="order-card__image-wrapper">
        <img src={bagImg} alt={productName} />
      </div>

      {/* Product Info */}
      <div >
        <div className="order-card__info">
          <div>
            <p className="order-card__order-id">Order {orderId}</p>
          </div>
          <div className="pd">
            <div className="pd-header">
              <p className="order-card__product-name">{productName}</p>
              <div className="order-card__rating">
                <StarIcon />
                <span className="order-card__rating-value">{rating}</span>
                <span className="order-card__rating-count">({reviewCount})</span>
              </div>
            </div>
          </div>

          <div className="order-card__price-row">
            <span className="order-card__price">${price}</span>
            {originalPrice && (
              <span className="order-card__original-price">${originalPrice}</span>
            )}
          </div>
          <div>
            <p className="order-card__qty">Qty:{quantity}</p>
          </div>
        </div>

      </div>


      {/* Status */}
      <div className="order-card__status-section">
        <p className="order-card__label">Status</p>
        <p className={`order-card__status ${statusClass[status] ?? "order-card__status--default"}`}>
          {status}
        </p>
        <div className="btn">
          <button className="order-card__track-btn" onClick={onTrackOrder}>
            Track order
          </button>
        </div>
      </div>

      {/* Time */}
      <div className="order">
        <div className="order-card__time-section">
          <p className="order-card__label">Time</p>
        </div>
        <div>
          <p className="order-card__delivery-time">
            Delivered on <br />
            <span>{deliveredOn}</span>
          </p>
        </div>
        <div>
          <button className="order-card__rate-btn" onClick={onRateProduct}>
            <StarIcon />
            Rate Your Product
          </button>
        </div>
      </div>






    </div>
  );
}
