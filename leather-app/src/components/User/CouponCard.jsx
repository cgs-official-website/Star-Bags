import { FaRegCopy } from "react-icons/fa";
const CouponCard = ({ coupon, onApplyCoupon }) => {
  const copyCoupon = () => {
    navigator.clipboard.writeText(coupon.code);
    alert("Coupon copied!");
  };

  return (
    <div className="coupon-card">
      <div className="coupon-top">
        <span className="offer-tag">{coupon.offer}</span>
        <button
          className="coupon-apply-btn"
          onClick={() => onApplyCoupon(coupon.code)}
        >
          Apply
        </button>
      </div>
      <div className="coupon-code">
        <span className="code-text">{coupon.code}</span>
        <FaRegCopy style={{ cursor: "pointer" }} onClick={copyCoupon} />
      </div>
      <p className="save-text">Save {coupon.save} on this order</p>
      <hr style={{ marginBottom: "15px" }} />
      <p className="coupon-description">{coupon.description}</p>
    </div>
  );
};

export default CouponCard;
