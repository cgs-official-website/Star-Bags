import { FaRegCopy } from "react-icons/fa";

const CouponCard = ({ coupon, onSelectCoupon, currentSubTotal }) => {
  const copyCoupon = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(coupon.code);
    alert("Coupon copied!");
  };

  // Calculates financial savings directly relative to the targeted category item value subtotal
  const calculatedSavings = (currentSubTotal * coupon.percentage) / 100;

  return (
    <div className="coupon-card">
      <div className="coupon-top">
        <span className="offer-tag">{coupon.offer} off</span>
        <button className="coupon-apply-btn" onClick={() => onSelectCoupon(coupon.code)}>
          Apply
        </button>
      </div>
      <div className="coupon-code">
        <span className="code-text">{coupon.code}</span>
        <FaRegCopy style={{ cursor: "pointer" }} onClick={copyCoupon} />
      </div>
      {/* If subtotal contains products, display actual dynamic currency numbers, otherwise render percentage fallback */}
      <p className="save-text">
        Save {calculatedSavings > 0 ? `₹${calculatedSavings.toFixed(2)}` : `${coupon.offer}`} on this order
      </p>
      <p className="coupon-description text-muted" style={{ fontSize: "0.78rem" }}>{coupon.description}</p>
    </div>
  );
};

export default CouponCard;