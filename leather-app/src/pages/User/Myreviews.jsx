import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import ReviewModal from "../../components/User/ReviewModal";
import { FaStar, FaRegStar, FaTrashAlt } from "react-icons/fa";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { MdModeEdit } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs"; // IMPORTED FOR 3-DOT MENU TRICK
import "../../assets/styles/Myreviews.css";

function Myreviews() {
  const [reviews, setReviews] = useState(() => {
    try {
      const savedReviews = localStorage.getItem("global_product_reviews");
      return savedReviews ? JSON.parse(savedReviews) : [];
    } catch {
      return [];
    }
  });

  const [feedbackState, setFeedbackState] = useState({});
  const [activeMenuId, setActiveMenuId] = useState(null); // Tracks which 3-dot menu dropdown is currently active

  // Edit/Delete triggers states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeEditingReview, setActiveEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  useEffect(() => {
    const syncReviewsLedger = () => {
      try {
        const savedReviews = localStorage.getItem("global_product_reviews");
        setReviews(savedReviews ? JSON.parse(savedReviews) : []);
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("storage", syncReviewsLedger);
    return () => window.removeEventListener("storage", syncReviewsLedger);
  }, []);

  // FIXED TRICK: Auto-closes dropdown menu when clicking anywhere else on document window safely
  useEffect(() => {
    const closeAllDropdowns = () => setActiveMenuId(null);
    window.addEventListener("click", closeAllDropdowns);
    return () => window.removeEventListener("click", closeAllDropdowns);
  }, []);

  const handleFeedbackToggle = (id, type) => {
    setFeedbackState((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  const toggleThreeDotMenu = (e, id) => {
    e.stopPropagation(); // Block window context click trigger to prevent immediate closing layout loops
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  /* ─── EDIT WORKFLOWS ─── */
  const triggerEditWorkflow = (reviewItem) => {
    setActiveEditingReview(reviewItem);
    setEditRating(Number(reviewItem.rating) || 5);
    setEditModalOpen(true);
    setActiveMenuId(null); // Close active menu context tray
  };

  const handleEditSaveExecution = (finalRating, updatedText) => {
    if (!activeEditingReview) return;

    const modifiedMasterCollection = reviews.map((r) =>
      r.id === activeEditingReview.id
        ? {
            ...r,
            rating: Number(finalRating),
            text: updatedText.trim(),
            reviewText: updatedText.trim(),
          }
        : r,
    );

    setReviews(modifiedMasterCollection);
    localStorage.setItem(
      "global_product_reviews",
      JSON.stringify(modifiedMasterCollection),
    );
    setEditModalOpen(false);
    setActiveEditingReview(null);
  };

  /* ─── DELETE WORKFLOWS ─── */
  const triggerDeleteWorkflow = (id) => {
    setTargetDeleteId(id);
    setDeleteModalOpen(true);
    setActiveMenuId(null); // Close active menu context tray
  };

  const executeDeleteAction = () => {
    const remains = reviews.filter((r) => r.id !== targetDeleteId);
    setReviews(remains);
    localStorage.setItem("global_product_reviews", JSON.stringify(remains));

    setDeleteModalOpen(false);
    setTargetDeleteId(null);
  };

  return (
    <div
      className="reviews-page-app-wrapper"
      style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}
    >
      <Navbar />

      <main className="reviews-container container py-3 my-2">
        <h4 className="mb-4 fw-bold outfit-font page-section-title">
          Settings and Profile
        </h4>

        <div className="row justify-content-center">
          <div className="col-lg-3 col-md-5 mb-4 sidebar-column-view wl-sidebar-sticky">
            <ProfileSideNav />
          </div>

          <div className="col-lg-9 col-md-7 list-column-view">
            <div className="reviews-card p-4 bg-white shadow-sm border rounded-3">
              <div className="reviews-header ">
                <h4 className="fw-bold mb-1 outfit-font text-dark-theme">
                  My Reviews
                </h4>
                <p className="reviews-subtitle text-muted small m-0">
                  All your real-time verified purchase feedbacks
                </p>
              </div>

              <div
                className="reviews-list-wrapper"
                style={{ minHeight: "300px" }}
              >
                {reviews.length > 0 ? (
                  <div className="reviews-scroll-list d-flex flex-column gap-3">
                    {reviews.map((review) => {
                      const hasLiked = feedbackState[review.id] === "like";
                      const hasDisliked =
                        feedbackState[review.id] === "dislike";
                      const currentLikesCount = hasLiked
                        ? (review.likes || 0) + 1
                        : review.likes || 0;
                      const currentDislikesCount = hasDisliked
                        ? (review.dislikes || 0) + 1
                        : review.dislikes || 0;
                      const isMenuDropdownOpen = activeMenuId === review.id;

                      return (
                        <div
                          key={review.id}
                          className="custom-review-card-item p-3 border rounded-3 bg-white mb-2 shadow-sm position-relative"
                          style={{ fontFamily: "system-ui" }}
                        >
                          {/* Top Row Block Layout Panels */}
                          <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={
                                  review.image ||
                                  review.productImage ||
                                  "../src/assets/images/leather1.png"
                                }
                                alt={review.productName || review.product}
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  border: "1px solid #e5e7eb",
                                }}
                              />
                              <span
                                className="fw-bold text-dark"
                                style={{ fontSize: "0.95rem" }}
                              >
                                {review.productName ||
                                  review.product ||
                                  "Leather Premium Item"}
                              </span>
                            </div>

                            {/* Stars Alignment Corner Block Layout Inline Matrix */}
                            <div
                              className="d-flex align-items-center gap-3 position-relative"
                              style={{ zIndex: "10" }}
                            >
                              <div className="d-flex align-items-center gap-0.5 text-warning">
                                {[...Array(5)].map((_, i) =>
                                  i < Math.round(review.rating) ? (
                                    <FaStar key={i} size={14} />
                                  ) : (
                                    <FaRegStar
                                      key={i}
                                      size={14}
                                      style={{ color: "#d1d5db" }}
                                    />
                                  ),
                                )}
                              </div>

                              {/* ─── FIXED TRICK: THREE DOT BUTTON OVER TRIGGER CONSOLE ─── */}
                              <div
                                className="three-dot-menu-anchor-wrapper"
                                style={{ position: "relative" }}
                              >
                                <button
                                  onClick={(e) =>
                                    toggleThreeDotMenu(e, review.id)
                                  }
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: "#64748b",
                                    padding: "6px",
                                    cursor: "pointer",
                                    fontSize: "1.15rem",
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: "50%",
                                  }}
                                  className="three-dot-interactive-trigger-btn"
                                  type="button"
                                >
                                  <BsThreeDotsVertical />
                                </button>

                                {/* FLOATING DROP-DOWN MENU TRAY CONTAINER PANELS */}
                                {isMenuDropdownOpen && (
                                  <div
                                    className="floating-three-dot-dropdown-tray shadow-lg border rounded-2"
                                    style={{
                                      position: "absolute",
                                      right: "0",
                                      top: "34px",
                                      background: "#ffffff",
                                      minWidth: "120px",
                                      zIndex: "100",
                                      overflow: "hidden",
                                      padding: "4px 0",
                                    }}
                                    onClick={(e) => e.stopPropagation()} // Stop propagation layer locks
                                  >
                                    <button
                                      onClick={() =>
                                        triggerEditWorkflow(review)
                                      }
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        background: "none",
                                        padding: "8px 14px",
                                        textAlign: "left",
                                        fontSize: "0.85rem",
                                        fontWeight: "600",
                                        color: "#334155",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        cursor: "pointer",
                                      }}
                                      className="dropdown-menu-item-action"
                                    >
                                      <MdModeEdit
                                        style={{ color: "#8b5cf6" }}
                                      />{" "}
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        triggerDeleteWorkflow(review.id)
                                      }
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        background: "none",
                                        padding: "8px 14px",
                                        textAlign: "left",
                                        fontSize: "0.85rem",
                                        fontWeight: "600",
                                        color: "#ef4444",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        cursor: "pointer",
                                        borderTop: "1px solid #f1f5f9",
                                      }}
                                      className="dropdown-menu-item-action text-danger"
                                    >
                                      <FaTrashAlt /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Central Commentary Review Text Labels */}
                          {/* <p
                            className="m-0 mt-2 text-dark fw-semibold"
                            style={{ fontSize: "0.85rem", opacity: "0.65" }}
                          >
                            Comment Review Statement:
                          </p> */}
                          <p
                            className="text-secondary small m-0 mb-3 mt-1"
                            style={{
                              lineHeight: "1.45",
                              wordBreak: "break-word",
                            }}
                          >
                            {review.text ||
                              review.reviewText ||
                              "No feedback summary its entered."}
                          </p>

                          {/* Lower Action Row Panel Blocks Container - STYLING SYNC WITH PRODUCT DETAILS PAGE */}
                          <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-2">
                            <span
                              className="text-muted font-monospace"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {review.date || "29 May 2026"}
                            </span>

                            {/* Like & Dislike Engine Injected Directly Matching Product Details View Panels */}
                            <div className="d-flex align-items-center gap-3">
                              <button
                                onClick={() =>
                                  handleFeedbackToggle(review.id, "like")
                                }
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#2563eb",
                                  fontSize: "1.1rem",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                              >
                                {hasLiked ? <BiSolidLike /> : <BiLike />}
                                <span
                                  style={{ fontSize: "12px", color: "#64748b" }}
                                >
                                  {currentLikesCount}
                                </span>
                              </button>

                              <button
                                onClick={() =>
                                  handleFeedbackToggle(review.id, "dislike")
                                }
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#ef4444",
                                  fontSize: "1.1rem",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                              >
                                {hasDisliked ? (
                                  <BiSolidDislike />
                                ) : (
                                  <BiDislike />
                                )}
                                <span
                                  style={{ fontSize: "12px", color: "#64748b" }}
                                >
                                  {currentDislikesCount}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="reviews-empty-container text-center py-5 border dashed rounded-3 bg-light">
                    <div style={{ fontSize: "2.8rem" }} className="mb-2">
                      ✍️
                    </div>
                    <h3
                      className="reviews-empty-heading fw-bold"
                      style={{ fontSize: "1.2rem", color: "#374151" }}
                    >
                      No reviews submitted yet!
                    </h3>
                    <p className="reviews-empty-sub text-muted small">
                      Feedback forms you submit from your orders dashboard will
                      print here directly.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ─── DUAL-PURPOSE POPUP WINDOW INJECTION SLOT ─── */}
      <ReviewModal
        isOpen={editModalOpen}
        isEditMode={true}
        defaultText={
          activeEditingReview
            ? activeEditingReview.text || activeEditingReview.reviewText
            : ""
        }
        rating={editRating}
        setRating={setEditRating}
        onClose={() => {
          setEditModalOpen(false);
          setActiveEditingReview(null);
        }}
        onSubmit={handleEditSaveExecution}
      />

      {/* ─── STRICT VERIFIED DELETE MODAL CONFIRMATION TRAY ─── */}
      {deleteModalOpen && (
        <div
          className="rv-modal-backdrop"
          onClick={() => setDeleteModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 20000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="bg-white p-4 rounded-3 text-center shadow-lg"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "90%", maxWidth: "380px" }}
          >
            <div className="pb-2 border-bottom d-flex justify-content-between align-items-center mb-3">
              <h5
                className="fw-bold m-0 text-dark"
                style={{ fontSize: "1.1rem" }}
              >
                Confirm Deletion
              </h5>
              <button
                className="btn border-0 p-0 fs-4"
                onClick={() => setDeleteModalOpen(false)}
              >
                ×
              </button>
            </div>
            <p className="text-muted small my-3">
              Are you absolutely sure you want to delete this verified review
              history track item? This change cannot be reverted.
            </p>
            <div className="d-flex gap-3 mt-3 pt-2 border-top justify-content-end">
              <button
                className="btn btn-light border px-3 small fw-bold"
                style={{ borderRadius: "6px" }}
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger px-3 small fw-bold"
                style={{ borderRadius: "6px" }}
                onClick={executeDeleteAction}
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Myreviews;
