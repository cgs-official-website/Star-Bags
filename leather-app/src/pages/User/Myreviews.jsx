import React, { useState, useEffect } from 'react';
import Navbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';
import ProfileSideNav from '../../components/User/Profile-Side-Nav';
import ReviewCard from '../../components/User/ReviewCard';
import { useAuth } from '../../context/AuthContext';
import { ReviewSkeleton } from '../../components/User/UserSkeleton';
import { db } from '../../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import '../../assets/styles/Myreviews.css';

function Myreviews() {
  const { currentUser } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ reviewText: '', rating: 5 });
  const [saving, setSaving] = useState(false);

  // Delete confirm modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ─── Real-time listener: load this user's reviews from Firestore ──────────
  useEffect(() => {
    if (!currentUser) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'reviews'),
      where('customerId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((d) => ({
          // Map Firestore fields → ReviewCard expected props
          id: d.id,                          // firestoreId used for edit/delete
          firestoreId: d.id,
          productName: d.data().productName || 'Unknown Product',
          productImage: d.data().image || '',
          rating: d.data().rating || 0,
          reviewText: d.data().text || '',
          shortReview: '',                   // not in schema, shown as empty
          date: d.data().date,
          likes: d.data().likes || [],
          dislikes: d.data().dislikes || [],
          likeCount: d.data().likeCount || 0,
          dislikeCount: d.data().dislikeCount || 0,
          isHidden: d.data().isHidden || false, // admin may hide the review
        }));

        // Sort fetched reviews by date descending in-memory
        fetched.sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date || 0);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date || 0);
          return dateB - dateA;
        });

        setReviews(fetched);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading reviews:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // ─── Edit handlers ─────────────────────────────────────────────────────────
  const handleEdit = (review) => {
    setEditingReview(review);
    setEditForm({ reviewText: review.reviewText, rating: review.rating });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!editingReview) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'reviews', editingReview.firestoreId), {
        text: editForm.reviewText.trim(),
        rating: editForm.rating,
      });
      setEditModalOpen(false);
      setEditingReview(null);
    } catch (err) {
      console.error('Error updating review:', err);
      alert('Failed to update review. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete handlers ───────────────────────────────────────────────────────
  const handleDelete = (id) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'reviews', deletingId));
      setDeleteModalOpen(false);
      setDeletingId(null);
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review. Please try again.');
    }
  };

  // ─── Date formatter ───────────────────────────────────────────────────────
  const formatDate = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="reviews-page-app-wrapper">
      <Navbar />

      <main className="container py-3 my-2">
        <h4 className="mb-3 fw-bold">Settings and Profile</h4>

        <div className="row justify-content-center">
          {/* Sidebar */}
          <div className="col-lg-4 col-md-5 mb-4 sidebar-column-view wl-sidebar-sticky">
            <ProfileSideNav />
          </div>

          {/* Main Reviews Panel */}
          <div className="col-lg-8 col-md-7 list-column-view">
            <div className="reviews-card">

              {/* Header */}
              <div className="reviews-header">
                <h4 className="fw-bold mb-1 outfit-font text-dark-theme">My Reviews</h4>
                <p className="reviews-subtitle">All your product reviews in one place</p>
              </div>

              {/* Reviews List */}
              <div className="reviews-list-wrapper">
                {loading ? (
                  <ReviewSkeleton />
                ) : reviews.length > 0 ? (
                  <div className="reviews-scroll-list">
                    {reviews.map((review) => (
                      <div key={review.id}>
                        <ReviewCard
                          review={review}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="reviews-empty-container">
                    <h3 className="reviews-empty-heading">No reviews yet!</h3>
                    <p className="reviews-empty-sub">
                      Your product reviews will appear here after you review a purchased product.
                    </p>
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
            </div>

            <div className="rv-modal-footer">
              <button className="rv-btn-cancel" onClick={() => setEditModalOpen(false)}>Cancel</button>
              <button className="rv-btn-save" onClick={handleEditSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
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