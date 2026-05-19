import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import '../../assets/styles/ReviewModal.css';

// ─── Internal Star Rating ─────────────────────────────────────────────────────
function StarRating({ max = 5, value, onChange }) {
  const [hovered, setHovered] = useState(null);
  const active = hovered !== null ? hovered : value;

  return (
    <div className="rm-star-row">
      {Array.from({ length: max }).map((_, i) =>
        i < active ? (
          <FaStar
            key={i}
            className="rm-star filled"
            onClick={() => onChange(i + 1)}
            onMouseEnter={() => setHovered(i + 1)}
            onMouseLeave={() => setHovered(null)}
          />
        ) : (
          <FaRegStar
            key={i}
            className="rm-star empty"
            onClick={() => onChange(i + 1)}
            onMouseEnter={() => setHovered(i + 1)}
            onMouseLeave={() => setHovered(null)}
          />
        )
      )}
    </div>
  );
}

// ─── Review Modal ─────────────────────────────────────────────────────────────
/**
 * Props:
 *  isOpen    {boolean}  — controls visibility
 *  onClose   {fn}       — called when modal is dismissed
 *  onSubmit  {fn(rating: number, text: string)} — called on submit
 *  rating    {number}   — current star value (controlled from parent)
 *  setRating {fn}       — updates star value in parent
 */
function ReviewModal({ isOpen, onClose, onSubmit, rating, setRating }) {
  const [review, setReview] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(rating, review);
    setReview('');
    onClose();
  };

  const handleCancel = () => {
    setReview('');
    onClose();
  };

  return (
    <div className="rm-overlay" onClick={handleCancel}>
      <div className="rm-modal" onClick={e => e.stopPropagation()}>

        {/* Close button */}
        <button className="rm-close" onClick={handleCancel} aria-label="Close">
          <IoMdClose />
        </button>

        <h4 className="rm-title">Write Your reviews</h4>

        <p className="rm-label">Give it to us your rating</p>
        <StarRating max={5} value={rating} onChange={setRating} />

        <p className="rm-label" style={{ marginTop: '1.2rem' }}>
          Do you have any thoughts, you would like to share
        </p>
        <textarea
          className="rm-textarea"
          rows={5}
          placeholder="Write Your reviews and about your Product"
          value={review}
          onChange={e => setReview(e.target.value)}
        />

        <div className="rm-actions">
          <button className="rm-cancel" onClick={handleCancel}>Cancel</button>
          <button className="rm-submit" onClick={handleSubmit}>Submit your review</button>
        </div>

      </div>
    </div>
  );
}

export default ReviewModal;
