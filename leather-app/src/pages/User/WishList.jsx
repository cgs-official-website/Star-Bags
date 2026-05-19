import React, { useState } from "react";
import "../../assets/styles/WishList.css";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import { FaHeart, FaStar } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";

// ─── Mock wishlist data ───────────────────────────────────────────────────────
const initialWishlist = [
  {
    id: 1,
    image: "../src/assets/images/leather1.png",
    name: "Leather Wallet",
    rating: 4.2,
    ratingCount: 120,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
  {
    id: 2,
    image: "../src/assets/images/bag.png",
    name: "Leather Wallet",
    rating: 4.2,
    ratingCount: 98,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
  {
    id: 3,
    image: "../src/assets/images/product.png",
    name: "Leather Wallet",
    rating: 4.2,
    ratingCount: 75,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
  {
    id: 4,
    image: "../src/assets/images/wallet.png",
    name: "Leather Wallet",
    rating: 4.2,
    ratingCount: 60,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
  {
    id: 5,
    image: "../src/assets/images/belt.png",
    name: "Leather Wallet",
    rating: 4.2,
    ratingCount: 88,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
  {
    id: 6,
    image: "../src/assets/images/product.png",
    name: "Leather Wallet",
    rating: 4.2,
    ratingCount: 44,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
  {
    id: 7,
    image: "../src/assets/images/bag.png",
    name: "Leather Wallet",
    rating: 4.2,
    ratingCount: 33,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
  {
    id: 8,
    image: "../src/assets/images/leather1.png",
    name: "Leather Wallet",
    rating: 4.2,
    ratingCount: 52,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
  {
    id: 9,
    image: "../src/assets/images/wallet.png",
    name: "Leather Wallet",
    rating: 4.2,
    ratingCount: 19,
    price: 120,
    realPrice: 150,
    offer: "20%",
  },
];

// ─── Single Wishlist Card ─────────────────────────────────────────────────────
function WishlistCard({ item, onRemove }) {
  return (
    <div className="wl-card">
      {/* Remove (heart) button */}
      <button
        className="wl-heart-btn"
        onClick={() => onRemove(item.id)}
        aria-label="Remove from wishlist"
      >
        <FaHeart className="wl-heart-icon" />
      </button>

      {/* Product image */}
      <div className="wl-img-wrap">
        <img src={item.image} alt={item.name} className="wl-img" />
      </div>

      {/* Card body */}
      <div className="wl-card-body">
        <div className="wl-title-row">
          <h6 className="wl-name">{item.name}</h6>
          <span className="wl-rating">
            <FaStar className="wl-star" />
            {item.rating}
            <span className="wl-rating-count">({item.ratingCount})</span>
          </span>
        </div>

        <div className="wl-price-row">
          <span className="wl-price">₹{item.price}</span>
          <del className="wl-real-price">₹{item.realPrice}</del>
          <span className="wl-offer">{item.offer} off</span>
        </div>

        <div className="wl-actions">
          <button className="wl-buy-btn">Buy now</button>
          <button className="wl-cart-btn" aria-label="Add to cart">
            <MdOutlineShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyWishlist() {
  return (
    <div className="wl-empty">
      <FaHeart className="wl-empty-icon" />
      <h5>Your wishlist is empty</h5>
      <p>Browse our products and add items you love!</p>
      <a href="/" className="btn wl-shop-btn">
        Shop Now
      </a>
    </div>
  );
}

// ─── Main WishList Page ───────────────────────────────────────────────────────
function WishList() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <Navbar />

      <div className="container py-3 my-2">
        <h4 className="mb-3 fw-bold">Wishlist</h4>

        <div className="row align-items-start">
          {/* ── Sidebar (desktop only) ── */}
          <div className="col-lg-3 mb-3 d-none d-lg-block wl-sidebar-sticky">
            <ProfileSideNav />
          </div>

          {/* ── Main content ── */}
          <div className="col-lg-9 col-12">
            {wishlist.length === 0 ? (
              <EmptyWishlist />
            ) : (
              <div className="wl-grid">
                {wishlist.map((item) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default WishList;
