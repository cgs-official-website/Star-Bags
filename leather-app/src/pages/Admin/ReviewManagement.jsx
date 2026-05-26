import React, { useState } from 'react';
import '../../assets/styles/AdminReviewManagement.css';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import { CardSkeleton, TableSkeleton } from '../../components/Admin/AdminSkeleton';
import { BiMessageRoundedDetail, BiLike, BiDislike, BiSearch } from 'react-icons/bi';
import { FiRefreshCw, FiTrash2, FiEye, FiEyeOff, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import ConfirmModal from '../../components/Admin/ConfirmModal';

// Dummy data
const initialReviews = [
  { id: 1, text: "The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop", productName: "American Tourist Travel and Trolley bag 30 L", customerName: "Selva", rating: 2, date: "2026-12-24" },
  { id: 2, text: "The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop", productName: "Wallet", customerName: "Murali venkata prasadh", rating: 1, date: "2026-12-24" },
  { id: 3, text: "The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied nfkjfjgewbkwbgbwekgbew jktjbtqkjq43 2j", image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=100&h=100&fit=crop", productName: "Belt", customerName: "Vinoth Billa", rating: 3, date: "2026-12-24" },
  { id: 4, text: "The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop", productName: "Wallet", customerName: "Sudhagar kasi medu", rating: 4, date: "2026-12-24" },
  { id: 5, text: "The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop", productName: "Leather Sling Bag", customerName: "Virat kohali", rating: 5, date: "2026-12-24" },
  { id: 6, text: "The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop", productName: "Leather Bag", customerName: "Ansul kamboj", rating: 5, date: "2026-12-24" },
  { id: 7, text: "The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop", productName: "Leather Bag", customerName: "karthi keyan", rating: 5, date: "2026-12-24" },
];

function ReviewManagement() {
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const [reviews, setReviews] = useState(initialReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  // Stats calculation
  const totalReviews = reviews.length;
  const positiveReviews = reviews.filter(r => r.rating >= 4).length;
  const negativeReviews = reviews.filter(r => r.rating <= 2).length;

  const handleResetFilter = () => {
    setSearchQuery('');
    setDateFilter('');
    setRatingFilter('');
    setCurrentPage(1);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setReviews(reviews.filter(r => r.id !== deleteTargetId));
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  const handleToggleHide = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, isHidden: !r.isHidden } : r));
  };

  const filteredReviews = reviews.filter((review) => {
    if (searchQuery && !review.productName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (dateFilter && review.date !== dateFilter) return false;
    if (ratingFilter && review.rating.toString() !== ratingFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredReviews.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<span key={i} className="star-icon">★</span>);
    }
    return stars;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Review management" />
        
        <div className="admin-content rm-content">
          {loading ? (
            <>
              <CardSkeleton count={3} />
              <TableSkeleton rows={rowsPerPage} cols={7} />
            </>
          ) : (
            <>
          
          <div className="rm-stats-grid">
            <div className="rm-stat-card">
              <div className="rm-stat-top">
                <div className="rm-stat-info">
                  <span className="rm-stat-label">Total reviews</span>
                  <span className="rm-stat-value">{totalReviews}</span>
                </div>
                <div className="rm-stat-icon purple">
                  <BiMessageRoundedDetail />
                </div>
              </div>
              <div className="rm-stat-bottom rm-stat-up">
                <FiArrowUpRight style={{ fontSize: '16px' }} /> 5.2% Up from past week
              </div>
            </div>
            <div className="rm-stat-card">
              <div className="rm-stat-top">
                <div className="rm-stat-info">
                  <span className="rm-stat-label">Positive reviews</span>
                  <span className="rm-stat-value">{positiveReviews}</span>
                </div>
                <div className="rm-stat-icon green">
                  <BiLike />
                </div>
              </div>
              <div className="rm-stat-bottom rm-stat-up">
                <FiArrowUpRight style={{ fontSize: '16px' }} /> 8.1% Up from past week
              </div>
            </div>
            <div className="rm-stat-card">
              <div className="rm-stat-top">
                <div className="rm-stat-info">
                  <span className="rm-stat-label">Negative Reviews</span>
                  <span className="rm-stat-value">{negativeReviews}</span>
                </div>
                <div className="rm-stat-icon red">
                  <BiDislike />
                </div>
              </div>
              <div className="rm-stat-bottom rm-stat-down">
                <FiArrowDownRight style={{ fontSize: '16px' }} /> 2.3% Down from past week
              </div>
            </div>
          </div>

          <div className="rm-filter-bar">
            <div className="rm-search-box">
              <BiSearch className="rm-search-icon" />
              <input 
                type="text" 
                placeholder="Search product" 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            
            <div className="rm-filter-select-wrap">
              <input 
                type="date" 
                className="rm-filter-select"
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <div className="rm-filter-select-wrap">
              <select 
                className="rm-filter-select"
                value={ratingFilter}
                onChange={(e) => { setRatingFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <button className="rm-reset-btn" onClick={handleResetFilter}>
              <FiRefreshCw /> Reset Filter
            </button>
          </div>

          <div className="rm-table-wrapper">
            <table className="rm-table">
              <thead>
                <tr>
                  <th className="rm-review-col" style={{ width: '30%' }}>User review</th>
                  <th>Product Image</th>
                  <th style={{ width: '15%' }}>Product Name</th>
                  <th style={{ width: '15%' }}>Customer Name</th>
                  <th>Review</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.length > 0 ? currentReviews.map((review) => (
                  <tr key={review.id} style={{ opacity: review.isHidden ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                    <td className="rm-review-col">
                      <div className="rm-text-ellipsis-multi" title={review.text}>
                        {review.text}
                      </div>
                    </td>
                    <td>
                      <img src={review.image} alt="product" className="rm-product-img" />
                    </td>
                    <td>
                      <div className="rm-text-ellipsis" title={review.productName}>
                        {review.productName}
                      </div>
                    </td>
                    <td>
                      <div className="rm-text-ellipsis" title={review.customerName}>
                        {review.customerName}
                      </div>
                    </td>
                    <td>
                      <div className="rm-stars">
                        {renderStars(review.rating)}
                      </div>
                    </td>
                    <td>
                      {review.date.split('-').reverse().join('/')}
                    </td>
                    <td>
                      <div className="rm-action-btn-group">
                        <button 
                          className={`rm-action-btn hide ${review.isHidden ? 'hidden-state' : ''}`} 
                          onClick={() => handleToggleHide(review.id)}
                          title={review.isHidden ? "Show review to everyone" : "Hide review from other users"}
                        >
                          {review.isHidden ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                        </button>
                        <button 
                          className="rm-action-btn delete" 
                          onClick={() => handleDelete(review.id)}
                          title="Delete review entirely"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">No reviews found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="rm-pagination-container">
              <span className="rm-pagination-text">
                Showing {filteredReviews.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, filteredReviews.length)} results
              </span>
              
              <div className="rm-pagination-right">
                <div className="rm-pagination-controls">
                  <button className="rm-page-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i} 
                      className={`rm-page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button className="rm-page-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
                
                <div className="rm-rows-per-page">
                  Rows per page
                  <select 
                    className="rm-rows-select"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={6}>6</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
            </>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to Delete this Review ?"
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
}

export default ReviewManagement;