import React, { useState, useRef, useEffect } from 'react';
// import { thumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa';
import { FaRegThumbsUp, FaRegThumbsDown ,FaStar} from 'react-icons/fa6';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import '../../assets/styles/ReviewCard.css';

function StarRating({ rating, max = 5 }) {
  return (
    <div className="d-flex align-items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <FaStar
          key={i}
          style={{ color: i < rating ? '#FFC107' : '#e0e0e0', fontSize: '1rem' }}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, onEdit, onDelete }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLike = () => {
    if (liked) { setLiked(false); }
    else { setLiked(true); if (disliked) setDisliked(false); }
  };

  const handleDislike = () => {
    if (disliked) { setDisliked(false); }
    else { setDisliked(true); if (liked) setLiked(false); }
  };

  const handleEdit = () => {
    setMenuOpen(false);
    if (onEdit) onEdit(review);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    if (onDelete) onDelete(review.id);
  };

  return (
    <div className="review-card mb-3">

      {/* Header: product image + name | stars + menu */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          <img
            src={review.productImage}
            alt={review.productName}
            className="review-product-img"
          />
          <span className="review-product-name">{review.productName}</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <StarRating rating={review.rating} />

          {/* Three Dot Menu */}
          <div className="review-menu-wrapper" ref={menuRef}>
            <button
              className={`review-menu-btn ${menuOpen ? 'active' : ''}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Review options"
            >
              <BsThreeDotsVertical />
            </button>

            {menuOpen && (
              <div className="review-dropdown">
                <button className="review-dropdown-item edit" onClick={handleEdit}>
                  <FiEdit2 className="dropdown-icon" />
                  Edit
                </button>
                <button className="review-dropdown-item delete" onClick={handleDelete}>
                  <FiTrash2 className="dropdown-icon" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review body */}
      <p className="review-body-text mb-1">{review.reviewText}</p>
      <p className="review-short-text mb-0">{review.shortReview}</p>

      {/* Like / Dislike */}
      <div className="d-flex align-items-center justify-content-end gap-3 mt-2">
        <button
          className={`review-action-btn ${liked ? 'active-like' : ''}`}
          onClick={handleLike}
          aria-label="Like this review"
        >
          <FaRegThumbsUp />
        </button>
        <button
          className={`review-action-btn dislike ${disliked ? 'active-dislike' : ''}`}
          onClick={handleDislike}
          aria-label="Dislike this review"
        >
          <FaRegThumbsDown />
        </button>
      </div>
    </div>
  );
}

export default ReviewCard;



