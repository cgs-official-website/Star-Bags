import React, { useState } from 'react';
import Navbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';
import ProfileSideNav from '../../components/User/Profile-Side-Nav';
import ReviewCard from '../../components/User/ReviewCard';
import '../../assets/styles/Myreviews.css';

const initialReviews = [
  {
    id: 1,
    productName: 'Leather product Bag',
    productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
    rating: 5,
    reviewText: 'The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied',
    shortReview: 'It was very help full',
  },
  {
    id: 2,
    productName: 'Leather product Bag',
    productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
    rating: 4,
    reviewText: 'The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied',
    shortReview: 'It was very help full',
  },
  {
    id: 3,
    productName: 'Leather product Bag',
    productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
    rating: 5,
    reviewText: 'The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied',
    shortReview: 'It was very help full',
  },
  {
    id: 4,
    productName: 'Leather product Bag',
    productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
    rating: 4,
    reviewText: 'The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied',
    shortReview: 'It was very help full',
  },
  {
    id: 5,
    productName: 'Leather Wallet',
    productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
    rating: 3,
    reviewText: 'Decent quality for the price. Stitching could be better but overall it holds up well after a few months of use.',
    shortReview: 'Average product',
  },
  {
    id: 6,
    productName: 'Canvas Tote Bag',
    productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
    rating: 5,
    reviewText: 'Absolutely love this bag! Very spacious and the material is durable. Got compliments from friends too.',
    shortReview: 'Highly recommended!',
  },
];

function Myreviews() {
  const [reviews, setReviews] = useState(initialReviews);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ reviewText: '', shortReview: '', rating: 5 });

  // Delete confirm modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /* ── Edit handlers ── */
  const handleEdit = (review) => {
    setEditingReview(review);
    setEditForm({
      reviewText: review.reviewText,
      shortReview: review.shortReview,
      rating: review.rating,
    });
    setEditModalOpen(true);
  };

  const handleEditSave = () => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === editingReview.id ? { ...r, ...editForm } : r
      )
    );
    setEditModalOpen(false);
    setEditingReview(null);
  };

  /* ── Delete handlers ── */
  const handleDelete = (id) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setReviews((prev) => prev.filter((r) => r.id !== deletingId));
    setDeleteModalOpen(false);
    setDeletingId(null);
  };

  return (
    <div className="reviews-page-app-wrapper">
      <Navbar />

      <main className="container py-3 my-2">
        <h4 className="mb-3 fw-bold">Settings and Profile</h4>

        <div className="row justify-content-center">
          {/* Sidebar */}
          <div className="col-lg-3 col-md-5 mb-4 sidebar-column-view wl-sidebar-sticky">
            <ProfileSideNav />
          </div>

          {/* Main Reviews Panel */}
          <div className="col-lg-9 col-md-7 list-column-view">
            <div className="reviews-card">

              {/* Header */}
              <div className="reviews-header">
                <h4 className="fw-bold mb-1 outfit-font text-dark-theme">My Reviews</h4>
                <p className="reviews-subtitle">All your product reviews in one place</p>
              </div>

              {/* Scrollable Reviews List */}
              <div className="reviews-list-wrapper">
                {reviews.length > 0 ? (
                  <div className="reviews-scroll-list">
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="reviews-empty-container">
                    <h3 className="reviews-empty-heading">No reviews yet!</h3>
                    <p className="reviews-empty-sub">Your product reviews will appear here.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Edit Modal ── */}
      {editModalOpen && (
        <div className="rv-modal-backdrop" onClick={() => setEditModalOpen(false)}>
          <div className="rv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rv-modal-header">
              <h5 className="rv-modal-title">Edit Review</h5>
              <button className="rv-modal-close" onClick={() => setEditModalOpen(false)}>×</button>
            </div>

            <div className="rv-modal-body">
              {/* Star Rating Picker */}
              <label className="rv-label">Rating</label>
              <div className="rv-star-picker">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`rv-star-btn ${star <= editForm.rating ? 'filled' : ''}`}
                    onClick={() => setEditForm((f) => ({ ...f, rating: star }))}
                    aria-label={`${star} star`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <label className="rv-label mt-3">Review</label>
              <textarea
                className="rv-textarea"
                rows={4}
                value={editForm.reviewText}
                onChange={(e) => setEditForm((f) => ({ ...f, reviewText: e.target.value }))}
                placeholder="Write your review..."
              />

              <label className="rv-label mt-3">Short Summary</label>
              <input
                className="rv-input"
                type="text"
                value={editForm.shortReview}
                onChange={(e) => setEditForm((f) => ({ ...f, shortReview: e.target.value }))}
                placeholder="One-line summary"
              />
            </div>

            <div className="rv-modal-footer">
              <button className="rv-btn-cancel" onClick={() => setEditModalOpen(false)}>Cancel</button>
              <button className="rv-btn-save" onClick={handleEditSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteModalOpen && (
        <div className="rv-modal-backdrop" onClick={() => setDeleteModalOpen(false)}>
          <div className="rv-modal rv-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="rv-modal-header">
              <h5 className="rv-modal-title">Delete Review</h5>
              <button className="rv-modal-close" onClick={() => setDeleteModalOpen(false)}>×</button>
            </div>
            <div className="rv-modal-body">
              <p className="rv-delete-msg">Are you sure you want to delete this review? This action cannot be undone.</p>
            </div>
            <div className="rv-modal-footer">
              <button className="rv-btn-cancel" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
              <button className="rv-btn-delete" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Myreviews;





// import React, { useState } from 'react';
// import Navbar from '../../components/User/Navbar';
// import Footer from '../../components/User/Footer';
// import ProfileSideNav from '../../components/User/Profile-Side-Nav';
// import ReviewCard from '../../components/User/ReviewCard';
// import '../../assets/styles/Myreviews.css';

// const initialReviews = [
//   {
//     id: 1,
//     productName: 'Leather product Bag',
//     productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
//     rating: 5,
//     reviewText: 'The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied',
//     shortReview: 'It was very help full',
//   },
//   {
//     id: 2,
//     productName: 'Leather product Bag',
//     productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
//     rating: 4,
//     reviewText: 'The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied',
//     shortReview: 'It was very help full',
//   },
//   {
//     id: 3,
//     productName: 'Leather product Bag',
//     productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
//     rating: 5,
//     reviewText: 'The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied',
//     shortReview: 'It was very help full',
//   },
//   {
//     id: 4,
//     productName: 'Leather product Bag',
//     productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
//     rating: 4,
//     reviewText: 'The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied',
//     shortReview: 'It was very help full',
//   },
//   {
//     id: 5,
//     productName: 'Leather Wallet',
//     productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
//     rating: 3,
//     reviewText: 'Decent quality for the price. Stitching could be better but overall it holds up well after a few months of use.',
//     shortReview: 'Average product',
//   },
//   {
//     id: 6,
//     productName: 'Canvas Tote Bag',
//     productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
//     rating: 5,
//     reviewText: 'Absolutely love this bag! Very spacious and the material is durable. Got compliments from friends too.',
//     shortReview: 'Highly recommended!',
//   },
// ];

// function Myreviews() {
//   const [reviews, setReviews] = useState(initialReviews);

//   // Edit modal state
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editingReview, setEditingReview] = useState(null);
//   const [editForm, setEditForm] = useState({ reviewText: '', shortReview: '', rating: 5 });

//   // Delete confirm modal state
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);

//   /* ── Edit handlers ── */
//   const handleEdit = (review) => {
//     setEditingReview(review);
//     setEditForm({
//       reviewText: review.reviewText,
//       shortReview: review.shortReview,
//       rating: review.rating,
//     });
//     setEditModalOpen(true);
//   };

//   const handleEditSave = () => {
//     setReviews((prev) =>
//       prev.map((r) =>
//         r.id === editingReview.id ? { ...r, ...editForm } : r
//       )
//     );
//     setEditModalOpen(false);
//     setEditingReview(null);
//   };

//   /* ── Delete handlers ── */
//   const handleDelete = (id) => {
//     setDeletingId(id);
//     setDeleteModalOpen(true);
//   };

//   const confirmDelete = () => {
//     setReviews((prev) => prev.filter((r) => r.id !== deletingId));
//     setDeleteModalOpen(false);
//     setDeletingId(null);
//   };

//   return (
//     <div className="reviews-page-app-wrapper">
//       <Navbar />

//       <main className="reviews-container container py-4 my-2">
//         <h4 className="mb-4 fw-bold outfit-font page-section-title">Settings and Profile</h4>

//         <div className="row justify-content-center">
//           {/* Sidebar */}
//           <div className="col-lg-3 col-md-5 mb-4 sidebar-column-view wl-sidebar-sticky">
//             <ProfileSideNav />
//           </div>

//           {/* Main Reviews Panel */}
//           <div className="col-lg-9 col-md-7 list-column-view">
//             <div className="reviews-card">

//               {/* Header */}
//               <div className="reviews-header">
//                 <h4 className="fw-bold mb-1 outfit-font text-dark-theme">My Reviews</h4>
//                 <p className="reviews-subtitle">All your product reviews in one place</p>
//               </div>

//               {/* Scrollable Reviews List */}
//               <div className="reviews-list-wrapper">
//                 {reviews.length > 0 ? (
//                   <div className="reviews-scroll-list">
//                     {reviews.map((review) => (
//                       <ReviewCard
//                         key={review.id}
//                         review={review}
//                         onEdit={handleEdit}
//                         onDelete={handleDelete}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="reviews-empty-container">
//                     <h3 className="reviews-empty-heading">No reviews yet!</h3>
//                     <p className="reviews-empty-sub">Your product reviews will appear here.</p>
//                   </div>
//                 )}
//               </div>

//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer />

//       {/* ── Edit Modal ── */}
//       {editModalOpen && (
//         <div className="rv-modal-backdrop" onClick={() => setEditModalOpen(false)}>
//           <div className="rv-modal" onClick={(e) => e.stopPropagation()}>
//             <div className="rv-modal-header">
//               <h5 className="rv-modal-title">Edit Review</h5>
//               <button className="rv-modal-close" onClick={() => setEditModalOpen(false)}>×</button>
//             </div>

//             <div className="rv-modal-body">
//               {/* Star Rating Picker */}
//               <label className="rv-label">Rating</label>
//               <div className="rv-star-picker">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     key={star}
//                     className={`rv-star-btn ${star <= editForm.rating ? 'filled' : ''}`}
//                     onClick={() => setEditForm((f) => ({ ...f, rating: star }))}
//                     aria-label={`${star} star`}
//                   >
//                     ★
//                   </button>
//                 ))}
//               </div>

//               <label className="rv-label mt-3">Review</label>
//               <textarea
//                 className="rv-textarea"
//                 rows={4}
//                 value={editForm.reviewText}
//                 onChange={(e) => setEditForm((f) => ({ ...f, reviewText: e.target.value }))}
//                 placeholder="Write your review..."
//               />

//               <label className="rv-label mt-3">Short Summary</label>
//               <input
//                 className="rv-input"
//                 type="text"
//                 value={editForm.shortReview}
//                 onChange={(e) => setEditForm((f) => ({ ...f, shortReview: e.target.value }))}
//                 placeholder="One-line summary"
//               />
//             </div>

//             <div className="rv-modal-footer">
//               <button className="rv-btn-cancel" onClick={() => setEditModalOpen(false)}>Cancel</button>
//               <button className="rv-btn-save" onClick={handleEditSave}>Save Changes</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Delete Confirm Modal ── */}
//       {deleteModalOpen && (
//         <div className="rv-modal-backdrop" onClick={() => setDeleteModalOpen(false)}>
//           <div className="rv-modal rv-modal-sm" onClick={(e) => e.stopPropagation()}>
//             <div className="rv-modal-header">
//               <h5 className="rv-modal-title">Delete Review</h5>
//               <button className="rv-modal-close" onClick={() => setDeleteModalOpen(false)}>×</button>
//             </div>
//             <div className="rv-modal-body">
//               <p className="rv-delete-msg">Are you sure you want to delete this review? This action cannot be undone.</p>
//             </div>
//             <div className="rv-modal-footer">
//               <button className="rv-btn-cancel" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
//               <button className="rv-btn-delete" onClick={confirmDelete}>Yes, Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Myreviews;



// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import Navbar from '../../components/User/Navbar';
// // import Footer from '../../components/User/Footer';
// // import ProfileSideNav from '../../components/User/Profile-Side-Nav';
// // import { FaThumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa';
// // import { BsThreeDotsVertical } from 'react-icons/bs';
// // import '../../assets/styles/Myreviews.css';

// // const reviewsData = [
// //   {
// //     id: 1,
// //     productName: 'Leather product Bag',
// //     productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
// //     rating: 5,
// //     reviewText: 'The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied',
// //     shortReview: 'It was very help full',
// //   },
// //   {
// //     id: 2,
// //     productName: 'Leather product Bag',
// //     productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
// //     rating: 4,
// //     reviewText: 'The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied',
// //     shortReview: 'It was very help full',
// //   },
// //   {
// //     id: 3,
// //     productName: 'Leather product Bag',
// //     productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
// //     rating: 5,
// //     reviewText: 'The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied',
// //     shortReview: 'It was very help full',
// //   },
// //   {
// //     id: 4,
// //     productName: 'Leather product Bag',
// //     productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
// //     rating: 4,
// //     reviewText: 'The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied',
// //     shortReview: 'It was very help full',
// //   },
// //   {
// //     id: 5,
// //     productName: 'Leather Wallet',
// //     productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
// //     rating: 3,
// //     reviewText: 'Decent quality for the price. Stitching could be better but overall it holds up well after a few months of use.',
// //     shortReview: 'Average product',
// //   },
// //   {
// //     id: 6,
// //     productName: 'Canvas Tote Bag',
// //     productImage: 'https://via.placeholder.com/48x48/8B6914/ffffff?text=Bag',
// //     rating: 5,
// //     reviewText: 'Absolutely love this bag! Very spacious and the material is durable. Got compliments from friends too.',
// //     shortReview: 'Highly recommended!',
// //   },
// // ];

// // function StarRating({ rating, max = 5 }) {
// //   return (
// //     <div className="d-flex align-items-center gap-1">
// //       {Array.from({ length: max }, (_, i) => (
// //         <FaStar
// //           key={i}
// //           style={{ color: i < rating ? '#FFC107' : '#e0e0e0', fontSize: '1rem' }}
// //         />
// //       ))}
// //     </div>
// //   );
// // }

// // function ReviewCard({ review }) {
// //   const [liked, setLiked] = useState(false);
// //   const [disliked, setDisliked] = useState(false);

// //   const handleLike = () => {
// //     if (liked) { setLiked(false); }
// //     else { setLiked(true); if (disliked) setDisliked(false); }
// //   };

// //   const handleDislike = () => {
// //     if (disliked) { setDisliked(false); }
// //     else { setDisliked(true); if (liked) setLiked(false); }
// //   };

// //   return (
// //     <div className="review-card mb-3">
// //       <div className="d-flex align-items-center justify-content-between mb-2">
// //         <div className="d-flex align-items-center gap-2">
// //           <img
// //             src={review.productImage}
// //             alt={review.productName}
// //             className="review-product-img"
// //           />
// //           <span className="review-product-name">{review.productName}</span>
// //         </div>
// //         <div className="d-flex align-items-center gap-2">
// //           <StarRating rating={review.rating} />
// //           <button className="review-menu-btn">
// //             <BsThreeDotsVertical />
// //           </button>
// //         </div>
// //       </div>

// //       <p className="review-body-text mb-1">{review.reviewText}</p>
// //       <p className="review-short-text mb-0">{review.shortReview}</p>

// //       <div className="d-flex align-items-center justify-content-end gap-3 mt-2">
// //         <button
// //           className={`review-action-btn ${liked ? 'active-like' : ''}`}
// //           onClick={handleLike}
// //           aria-label="Like this review"
// //         >
// //           <FaThumbsUp />
// //         </button>
// //         <button
// //           className={`review-action-btn dislike ${disliked ? 'active-dislike' : ''}`}
// //           onClick={handleDislike}
// //           aria-label="Dislike this review"
// //         >
// //           <FaThumbsDown />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // function Myreviews() {
// //   return (
// //     <div className="reviews-page-app-wrapper">
// //       <Navbar />

// //       <main className="reviews-container container py-4 my-2">
// //         <h4 className="mb-4 fw-bold outfit-font page-section-title">Settings and Profile</h4>

// //         <div className="row justify-content-center">
// //           {/* Sidebar */}
// //           <div className="col-lg-3 col-md-5 mb-4 sidebar-column-view wl-sidebar-sticky">
// //             <ProfileSideNav />
// //           </div>

// //           {/* Main Reviews Panel */}
// //           <div className="col-lg-9 col-md-7 list-column-view">
// //             <div className="reviews-card">

// //               {/* Header */}
// //               <div className="reviews-header">
// //                 <div>
// //                   <h4 className="fw-bold mb-1 outfit-font text-dark-theme">My Reviews</h4>
// //                   <p className="reviews-subtitle">All your product reviews in one place</p>
// //                 </div>
// //               </div>

// //               {/* Scrollable Reviews List */}
// //               <div className="reviews-list-wrapper">
// //                 {reviewsData.length > 0 ? (
// //                   <div className="reviews-scroll-list">
// //                     {reviewsData.map((review) => (
// //                       <ReviewCard key={review.id} review={review} />
// //                     ))}
// //                   </div>
// //                 ) : (
// //                   <div className="reviews-empty-container">
// //                     <h3 className="reviews-empty-heading">No reviews yet!</h3>
// //                     <p className="reviews-empty-sub">Your product reviews will appear here.</p>
// //                   </div>
// //                 )}
// //               </div>

// //             </div>
// //           </div>
// //         </div>
// //       </main>

// //       <Footer />
// //     </div>
// //   );
// // }

// // export default Myreviews;