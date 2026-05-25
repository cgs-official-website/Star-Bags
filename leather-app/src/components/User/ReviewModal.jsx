
import React, { useEffect, useRef } from "react";
import "../../assets/styles/ReviewModal.css";

function ReviewModal({ isOpen, onClose, onSubmit, rating, setRating }) {
  const [reviewText, setReviewText] = React.useState("");
  const [hoverRating, setHoverRating] = React.useState(0);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue) => {
    setHoverRating(starValue);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    onSubmit(rating, reviewText);
    setReviewText("");
    setRating(0);
    onClose();
  };

  const handleCancel = () => {
    setReviewText("");
    setRating(0);
    onClose();
  };

  const getStarDisplay = (index) => {
    const displayRating = hoverRating || rating;
    return index <= displayRating;
  };

  return (
    <div className="rm-overlay" onClick={onClose}>
      <div className="rm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="rm-close" onClick={onClose}>
          ×
        </button>

        <h3 className="rm-title">Write Your Reviews</h3>

        {/* Rating Section */}
        <div className="rm-rating-label">Give it to us your rating</div>
        <div className="rm-star-row">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`rm-star ${getStarDisplay(star) ? "filled" : "empty"}`}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
            >
              ★
            </span>
          ))}
        </div>

        {/* Review Section */}
        <div className="rm-review-label">
          Do you have any thoughts, you would like to share
          <span className="rm-review-sub">Write your reviews and about your product</span>
        </div>
        <textarea
          ref={textareaRef}
          className="rm-textarea"
          placeholder="Write Your reviews and about your Product"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="rm-actions">
          <button className="rm-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button className="rm-submit" onClick={handleSubmit}>
            Submit your review
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;