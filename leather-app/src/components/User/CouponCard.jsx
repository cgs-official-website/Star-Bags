import React from "react";
import { FaRegCopy, FaLock, FaCheckCircle, FaArrowRight, FaGift } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/coupon.css";

const CouponCard = ({ coupon, onSelectCoupon, currentSubTotal }) => {
  const navigate = useNavigate();

  // Set minimum threshold limit from data object or fallback to default ₹1000
  const minThreshold = coupon.minAmount || 1000; 
  const isLocked = currentSubTotal < minThreshold;
  const remainingAmount = minThreshold - currentSubTotal;

  const copyCoupon = (e) => {
    e.stopPropagation();
    if (isLocked) return;
    navigator.clipboard.writeText(coupon.code);
    alert(`Coupon "${coupon.code}" copied to clipboard!`);
  };

  const calculatedSavings = (currentSubTotal * coupon.percentage) / 100;

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

        {/* BASIC SAVINGS AND DESCRIPTION DETAILS */}
        <p className="save-text-premium">
          {isLocked 
            ? `Valid on orders over ₹${minThreshold}` 
            : `Save ₹${calculatedSavings.toFixed(2)} on this order!`
          }
        </p>
        <p className="coupon-description-premium">{coupon.description}</p>
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
            <p>Purchase <span>₹{remainingAmount}</span> extra to open premium coupons!</p>
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