import React, { useState } from "react";
import "../../assets/styles/OrderCard.css";
import ReviewModal from "./ReviewModal"; // Adjust the import path as needed

// Dynamic high-quality image mappings based on product category
const getImageForProduct = (productName, fallbackImage) => {
  const name = productName?.toLowerCase() || "";
  
  if (name.includes("sofa")) {
    return "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&h=150&fit=crop&crop=center";
  }
  if (name.includes("backpack") || name.includes("bag") || name.includes("shopa")) {
    return "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop&crop=center";
  }
  if (name.includes("table")) {
    return "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=150&h=150&fit=crop&crop=center";
  }
  if (name.includes("lamp")) {
    return "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=150&h=150&fit=crop&crop=center";
  }
  if (name.includes("bedsheet") || name.includes("cotton")) {
    return "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=150&h=150&fit=crop&crop=center";
  }
  if (name.includes("vase") || name.includes("ceramic")) {
    return "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=150&h=150&fit=crop&crop=center";
  }
  
  return fallbackImage || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop&crop=center";
};

// Reusable SVG Star Component
function StarIcon({ filled = true, color = "#F5A623", size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth="1.5"
      style={{ display: "inline-block", verticalAlign: "middle" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.62l5.34-.78z" />
    </svg>
  );
}

export default function OrderCard({ order }) {
  const [hovered, setHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRating, setModalRating] = useState(0);
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const orderId = order?.id ? `Order ${order.id}` : "Order ID002457890KJM";
  const productName = order?.product || "Leather shopa";
  const rating = order?.rating ?? 4.2;
  const reviewsCount = order?.reviews ?? 120;
  const discountedPrice = order?.discountedPrice ?? 120;
  const originalPrice = order?.originalPrice ?? 120;
  const quantity = order?.quantity ?? 1;
  const status = order?.status || "Delivered";
  const deliveryDate = order?.deliveryDate || "25/04/2020";
  const productImage = getImageForProduct(productName, order?.image);
  
  const savingsAmount = originalPrice - discountedPrice;
  const hasSavings = savingsAmount > 0;

  let statusColor = "#22c55e";
  if (status.toLowerCase().includes("ship")) {
    statusColor = "#3b82f6";
  } else if (status.toLowerCase().includes("process") || status.toLowerCase().includes("pend")) {
    statusColor = "#f59e0b";
  } else if (status.toLowerCase().includes("cancel")) {
    statusColor = "#ef4444";
  }

  const isDelivered = status.toLowerCase() === "delivered";
  const timeLabel = isDelivered ? "Delivered on" : "Expected by";
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parseInt(parts[1]);
      const year = parts[2];
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return `${day} ${monthNames[month - 1]} ${year}`;
    }
    return dateStr;
  };
  
  const formattedDate = formatDate(deliveryDate);

  const handleTrackClick = () => {
    alert(`Tracking information for Order ${order?.id || "ID002457890KJM"}: In transit.`);
  };

  const handleRateClick = () => {
    setIsModalOpen(true);
  };
  
  const handleMobileCardClick = (e) => {
    const target = e.target;
    const isInteractive = target.closest('.track-button') || 
                          target.closest('.rate-link-btn') || 
                          target.closest('.mobile-action-btn');
    if (!isInteractive) {
      setIsMobileExpanded(!isMobileExpanded);
    }
  };

  const handleReviewSubmit = (rating, reviewText) => {
    console.log(`Product: ${productName}`);
    console.log(`Rating: ${rating} stars`);
    console.log(`Review: ${reviewText}`);
    
    const newReview = {
      productId: order?.id,
      productName: productName,
      rating: rating,
      review: reviewText,
      date: new Date().toISOString()
    };
    
    setSubmittedReviews(prev => [...prev, newReview]);
    
    if (order?.onReviewSubmit) {
      order.onReviewSubmit(order?.id, rating, reviewText);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalRating(0);
  };

  return (
    <>
      <div className="order-card-container">
        {/* Mobile card: compact view with click-to-expand */}
        <div 
          className={`order-card order-card-mobile ${isMobileExpanded ? 'expanded' : ''}`}
          onClick={handleMobileCardClick}
        >
          {/* Compact row - always visible on mobile */}
          <div className="mobile-compact-row">
            <div className="product-image-wrapper mobile-image">
              <img
                src={productImage}
                alt={productName}
                className="product-image"
              />
            </div>
            <div className="mobile-product-info">
              <div className="mobile-product-header">
                <span className="mobile-product-name">{productName}</span>
                <span className="mobile-delivery-status" style={{ color: statusColor }}>
                  ● {status}
                </span>
              </div>
              <div className="mobile-date">{formattedDate}</div>
            </div>
          </div>

          {/* Expanded details - shown when clicked on mobile */}
          <div className="mobile-expanded-details">
            {/* Price row */}
            <div className="mobile-price-row">
              <span className="mobile-current-price">${discountedPrice}</span>
              {originalPrice > discountedPrice && (
                <span className="mobile-original-price">${originalPrice}</span>
              )}
              {hasSavings && (
                <span className="mobile-savings">Save ${savingsAmount}</span>
              )}
            </div>
            
            {/* Quantity and Rating row */}
            <div className="mobile-meta-row">
              <span className="mobile-qty">Qty: {quantity}</span>
              <div className="mobile-rating">
                <StarIcon filled size={14} color="#F5A623" />
                <span className="mobile-rating-number">{rating.toFixed(1)}</span>
                <span className="mobile-rating-count">({reviewsCount})</span>
              </div>
            </div>
            
            {/* Order ID row */}
            <div className="mobile-order-id">
              Order ID: {orderId.replace('Order ', '')}
            </div>
            
            {/* Action buttons - NO Buy Again button */}
            <div className="mobile-action-buttons">
              <button 
                className="mobile-action-btn track-btn"
                onClick={handleTrackClick}
                disabled={status.toLowerCase().includes("cancel")}
              >
                Track
              </button>
              <button 
                className="mobile-action-btn rate-btn"
                onClick={handleRateClick}
              >
                Rate
              </button>
            </div>
          </div>
        </div>

        {/* Desktop/Tablet card - original horizontal layout */}
        <div className="order-card order-card-desktop">
          {/* Product Image */}
          <div className="product-image-wrapper">
            <img
              src={productImage}
              alt={productName}
              className="product-image"
            />
          </div>

          {/* Product Info */}
          <div className="product-info">
            <p className="order-id">{orderId}</p>

            <div className="product-header">
              <span className="product-name">{productName}</span>
              <div className="rating-badge-row">
                <StarIcon filled size={16} color="#F5A623" />
                <span className="rating-number">{rating.toFixed(1)}</span>
                <span className="rating-count">({reviewsCount})</span>
              </div>
            </div>

            <div className="price-section">
              <div className="current-price">$ {discountedPrice}</div>
              {originalPrice > discountedPrice ? (
                <div className="original-price">$ {originalPrice}</div>
              ) : (
                <div className="original-price">$ {discountedPrice}</div>
              )}
            </div>

            <p className="quantity">Qty:{quantity}</p>
          </div>

          {/* Status Section */}
          <div className="status-section">
            <p className="section-label">Status</p>
            <span className="status-value" style={{ color: statusColor }}>
              {status}
            </span>
            <button
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={handleTrackClick}
              className={`track-button ${hovered ? "hovered" : ""}`}
              disabled={status.toLowerCase().includes("cancel")}
              style={{ 
                opacity: status.toLowerCase().includes("cancel") ? 0.5 : 1,
                cursor: status.toLowerCase().includes("cancel") ? "not-allowed" : "pointer"
              }}
            >
              Track order
            </button>
          </div>

          {/* Time Section */}
          <div className="time-section">
            <p className="section-label">Time</p>
            <div className="delivery-date">
              <p className="delivery-text">{timeLabel}</p>
              <p className="delivery-text">{deliveryDate}</p>
            </div>
            <button className="rate-link-btn" onClick={handleRateClick}>
              <StarIcon filled size={14} color="#C97E2A" />
              <span className="rate-text">Rate Your Product</span>
            </button>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleReviewSubmit}
        rating={modalRating}
        setRating={setModalRating}
      />
    </>
  );
}



