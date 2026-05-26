import React from "react";
import { FaRegCopy, FaLock, FaCheckCircle, FaArrowRight, FaCalendarAlt, FaUserCheck, FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/coupon.css";

const CouponCard = ({ coupon, onSelectCoupon, currentSubTotal }) => {
  const navigate = useNavigate();

  // Read minThreshold from the object structure
  const minThreshold = coupon.minThreshold || 1000; 
  const isLocked = currentSubTotal < minThreshold;
  const remainingAmount = minThreshold - currentSubTotal;

  const copyCoupon = (e) => {
    e.stopPropagation();
    if (isLocked) return;
    navigator.clipboard.writeText(coupon.code);
    alert(`Coupon "${coupon.code}" copied to clipboard!`);
  };

  // Safe parsing helper for date formats
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  return (
    <div className={`coupon-card-premium ${isLocked ? "coupon-state-locked" : "coupon-state-unlocked"}`}>
      <div className="coupon-card-body-wrapper">
        
        {/* TOP BADGE AND STATUS ROW */}
        <div className="coupon-top">
          <span className="offer-tag-premium">{coupon.offer} OFF</span>
          <button 
            className="coupon-apply-btn-premium" 
            onClick={() => onSelectCoupon(coupon.code)}
            disabled={isLocked}
          >
            {isLocked ? "Locked" : "Apply"}
          </button>
        </div>
        
        {/* CODE ROW CONTAINER */}
        <div className="coupon-code-row">
          <div className="coupon-badge-pill">
            <span className="code-text-highlight">{coupon.code}</span>
            <FaRegCopy 
              className={`cp-copy-action-icon ${isLocked ? "disabled-icon" : ""}`} 
              onClick={copyCoupon} 
            />
          </div>
        </div>

        {/* METADATA TARGET TAGS ROW */}
        <div className="coupon-metadata-tags">
          <span className="meta-tag">
            <FaShoppingBag size={10} /> {coupon.category} 
            {coupon.subCategory && coupon.subCategory !== "All" && ` • ${coupon.subCategory}`}
          </span>
          <span className="meta-tag">
            <FaUserCheck size={10} /> Limit: {coupon.usageLimit || 1}
          </span>
        </div>

        {/* CORE CONDITIONS AND DESCRIPTION DETAILS */}
        <p className="save-text-premium">
          {isLocked 
            ? `Minimum purchase required: ₹${minThreshold}` 
            : `Coupon unlocked for this order!`
          }
        </p>
        <p className="coupon-description-premium">{coupon.description}</p>

        {/* TIMELINE VALIDITY META LINES */}
        {coupon.startDate && coupon.endDate && (
          <div className="coupon-timeline-row">
            <FaCalendarAlt size={10} />
            <span>Valid: {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}</span>
          </div>
        )}
      </div>

      {/* DYNAMIC INFOBAR DISPLAYED BELOW INPUT WRAPPER BOUNDS */}
      {isLocked ? (
        <div 
          className="coupon-card-slogan-footer"
          onClick={() => navigate("/allProducts")}
          title="Browse catalog to unlock this offer"
        >
          <div className="slogan-footer-content">
            <FaLock className="lock-pulse" />
            <p>Purchase <span>₹{remainingAmount.toFixed(0)}</span> extra to open premium coupons!</p>
          </div>
          <FaArrowRight className="arrow-slide-icon" />
        </div>
      ) : (
        <div className="coupon-card-slogan-footer success-footer">
          <div className="slogan-footer-content">
            <FaCheckCircle className="check-pulse" />
            <p>Premium coupon unlocked! Ready to apply.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponCard;