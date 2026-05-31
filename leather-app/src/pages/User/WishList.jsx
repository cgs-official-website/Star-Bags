import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from "../../context/WishlistContext";
import "../../assets/styles/WishList.css";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import { FaHeart, FaStar } from "react-icons/fa";

// ─── Single Wishlist Card Structure (Buy now/Cart buttons Removed thalaiva) ───
function WishlistCard({ item, onRemove }) {
  const navigate = useNavigate();

  return (
    /* FIXED TRICK 1: Whole card acts as clickable viewport frame to launch details route */
    <div 
      className="wl-card" 
      onClick={() => navigate("/ProductDetails", { state: { product: item } })}
      style={{ cursor: "pointer", position: "relative" }}
    >
      <button
        className="wl-heart-btn"
        onClick={(e) => { 
          e.stopPropagation(); // Stems propagation to block double routing fires
          onRemove(item.id); 
        }}
        aria-label="Remove from wishlist"
        style={{ zIndex: "5" }}
      >
        <FaHeart className="wl-heart-icon" />
      </button>

      <div className="wl-img-wrap">
        <img src={item.image} alt={item.name} className="wl-img" />
      </div>

      <div className="wl-card-body">
        <div className="wl-title-row">
          <h6 className="wl-name">{item.name}</h6>
          <span className="wl-rating">
            <FaStar className="wl-star" />
            {item.rating || "4.2"}
            <span className="wl-rating-count">({item.ratingCount || item.reviews || 0})</span>
          </span>
        </div>

        <div className="wl-price-row" style={{ marginBottom: "0", paddingBottom: "4px" }}>
          <span className="wl-price">₹{item.price}</span>
          <del className="wl-real-price">₹{item.realPrice || item.price}</del>
          <span className="wl-offer">{item.offer || "0% off"}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Empty Wishlist View State Grid ───
function EmptyWishlist() {
  const navigate = useNavigate();
  const getEmptyStateImage = () => {
    return new URL("../../assets/images/empty.png", import.meta.url).href;
  };

  return (
    <div className="wl-empty-container text-center py-5 border dashed rounded-3 bg-white">
      <div className="wl-empty-image-wrapper mb-3 mx-auto" style={{ maxWidth: "180px" }}>
        <img src={getEmptyStateImage()} alt="Empty Bag Vector" className="wl-empty-vector" style={{ width: "100%", height: "100%" }} />
      </div>
      <h3 className="wl-empty-heading fw-bold" style={{ fontSize: "1.2rem" }}>Your wishlist is empty!</h3>
      <span onClick={() => navigate("/AllProducts")} className="btn wl-empty-shop-btn text-white mt-2" style={{ cursor: "pointer", backgroundColor: "#8b5cf6", padding: "8px 24px", borderRadius: "6px" }}>
        Shop now
      </span>
    </div>
  );
}

// ─── Main WishList Integrated Dashboard Component ───
function WishList() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="wishlist-page-app-wrapper" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      {/* FIXED TRICK 2: EQUALIZED BOOTSTRAP ROW GRID SPANS FOR UNIFORM SIDEBAR WIDTH */}
      <div className="orders-container container py-3 my-2">
        <h4 className="mb-4 fw-bold">My Wishlist</h4>

        <div className="row justify-content-center">
          {/* Sidebar Area Column - Uniform 3-Span Layout Grid matching SavedAddress/Orders sheets */}
          <div className="col-lg-3 col-md-5 mb-4 sidebar-column-view wl-sidebar-sticky">
            <ProfileSideNav />
          </div>

          {/* Main Content Grid Area Column */}
          <div className="col-lg-9 col-md-7 list-column-view">
            <div className="orders-card p-4 bg-white shadow-sm border rounded-3" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div className="reviews-header pb-2">
                <h4 className="fw-bold mb-1 outfit-font text-dark-theme">Saved Products</h4>
                <p className="reviews-subtitle text-muted small m-0">Click any card item row to configure purchasing options details</p>
              </div>

              {wishlist.length === 0 ? (
                <EmptyWishlist />
              ) : (
                <div className="wl-grid d-flex flex-wrap gap-3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
                  {wishlist.map((item) => (
                    <WishlistCard
                      key={item.id}
                      item={item}
                      onRemove={removeFromWishlist}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default WishList;