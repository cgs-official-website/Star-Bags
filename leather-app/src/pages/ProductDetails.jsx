import React, { useState } from "react";
import Navbar from "../components/User/Navbar";
import Footer from "../components/User/Footer";
import ProductCard from "../components/User/ProductCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaStar, FaRegStar, FaHeart } from "react-icons/fa";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { FiHeart } from "react-icons/fi";
import { IoMdCart } from "react-icons/io";

import "../assets/styles/ProductDetails.css";

function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Mock data for images
  const images = [
    "../src/assets/images/bag.png",
    "../src/assets/images/belt.png",
    "../src/assets/images/wallet.png",
    "../src/assets/images/product.png",
    "../src/assets/images/leather1.png",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [slideDirection, setSlideDirection] = useState("right");
  const [feedbackState, setFeedbackState] = useState({});

  const handleFeedback = (id, type) => {
    setFeedbackState((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  const mainImage = images[currentImageIndex];

  const handlePrevImage = () => {
    setSlideDirection("left");
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSlideDirection("right");
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNextImage();
    }
    if (isRightSwipe) {
      handlePrevImage();
    }
  };

  return (
    <div className="product-details-page">
      <Navbar />

      <div className="container py-4">
        {/* Breadcrumb & Header */}
        <div className="row mb-4">
          <div className="col-lg-6 d-flex align-items-center">
            {/* Removed image counter */}
          </div>
          <div className="col-lg-6 ps-lg-5 d-flex justify-content-between align-items-center">
            <div className="breadcrumb-text">
              Wallets / <span className="active">Leather Wallet</span>
            </div>
            <div
              className="text-danger fs-4 cursor-pointer wishlist-btn"
              onClick={() => setIsWishlist(!isWishlist)}
            >
              {isWishlist ? <FaHeart /> : <FiHeart />}
            </div>
          </div>
        </div>

        {/* --- Section 1: Main Product Info --- */}
        <div className="row mb-5">
          {/* Left Column: Images */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div
              className="main-image-container"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <button
                className="arrow-btn d-none d-md-block"
                onClick={handlePrevImage}
              >
                <IoIosArrowBack />
              </button>
              <img
                key={currentImageIndex}
                src={mainImage}
                alt="Product"
                className={`main-product-image mx-4 slide-${slideDirection}`}
              />
              <button
                className="arrow-btn d-none d-md-block"
                onClick={handleNextImage}
              >
                <IoIosArrowForward />
              </button>
            </div>

            <div className="thumbnail-gallery mt-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`thumbnail-box ${currentImageIndex === idx ? "active" : ""}`}
                  onClick={() => {
                    setSlideDirection(
                      idx > currentImageIndex ? "right" : "left",
                    );
                    setCurrentImageIndex(idx);
                  }}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="col-lg-6 ps-lg-5">
            <div className="stock-text mb-2">23 in stock available</div>
            <h1 className="product-title">Leather Wallet</h1>

            <div className="price-section d-flex align-items-center mb-2">
              <span className="current-price">₹ 1199</span>
              <span className="original-price">₹ 1499</span>
              <span className="discount">20% off</span>
            </div>

            <div className="d-flex align-items-center mb-3">
              <div className="rating-stars">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <span className="rating-count">4.5 / 5.0 (120)</span>
            </div>

            <p className="product-description">
              Premium stitched leather detailing, sleek craftsmanship, and smart
              storage compartments—designed for everyday convenience and built
              to last.
            </p>

            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="quantity-selector">
                <button onClick={decreaseQuantity}>-</button>
                <input type="text" value={quantity} readOnly />
                <button onClick={increaseQuantity}>+</button>
              </div>

              <button className="btn-add-cart">
                <IoMdCart /> Add to Cart
              </button>
            </div>

            <button className="btn-buy-now">Buy Now</button>

            <div className="delivery-box mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-bold text-dark">Delivery Address</h6>
                <h6
                  className="cursor-pointer"
                  style={{
                    color: "#8b5cf6",
                    fontSize: "13px",
                    fontWeight: "400",
                  }}
                >
                  Change Location <span className="bi bi-pencil-square"></span>
                </h6>
              </div>
              <hr
                style={{ width: "100%", borderColor: "#ddd" }}
                className="my-2"
              />
              <div className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
                <p className="mb-1">
                  Rahul Sharma, Flat No. 302, Sai Residency
                </p>
                <p className="mb-1">Mumbai, Maharashtra - 400058</p>
                <p className="mb-0">Mobile: 9876543210</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 2: Product details Table --- */}
        <div className="details-section mb-5">
          <h3>Product details</h3>
          <div className="table-responsive">
            <table className="table table-bordered product-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Specifications</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Product Name</td>
                  <td>Classic Bifold Leather Wallet</td>
                </tr>
                <tr>
                  <td>Brand Name</td>
                  <td>Krish Feather Factory</td>
                </tr>
                <tr>
                  <td>Product ID</td>
                  <td>KLW-WLT-2045</td>
                </tr>
                <tr>
                  <td>Manufactur Date</td>
                  <td>March 2026</td>
                </tr>
                <tr>
                  <td>Material</td>
                  <td>Genuine Leather, Premium Inner Lining</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Section 3: Rating And Reviews --- */}
        <div className="reviews-section">
          <h4>Rating And Reviews</h4>

          <div className="overall-rating-card shadow-sm">
            <div className="rating-score">
              <h2>
                4.6 <FaStar className="fs-4" />
              </h2>
              <p>24,000 Ratings</p>
              <p>&</p>
              <p>8,000 Reviews</p>
            </div>

            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="rating-bar-row">
                  <span>
                    {star} <FaStar className="text-warning" />
                  </span>
                  <div className="progress-custom">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width:
                          star === 5
                            ? "80%"
                            : star === 4
                              ? "50%"
                              : star === 3
                                ? "20%"
                                : star === 2
                                  ? "5%"
                                  : "10%",
                        backgroundColor:
                          star >= 3
                            ? "#22c55e"
                            : star === 2
                              ? "#fbbf24"
                              : "#ef4444",
                      }}
                    ></div>
                  </div>
                  <span
                    className="text-muted"
                    style={{ width: "40px", textAlign: "right" }}
                  >
                    {star === 5
                      ? "12k"
                      : star === 4
                        ? "5k"
                        : star === 3
                          ? "2k"
                          : star === 2
                            ? "100"
                            : "50"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-buttons">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">Positive</button>
            <button className="filter-btn">Negative</button>
          </div>

          <div className="row g-4 mt-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="col-md-6">
                <div className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img
                        src="https://i.pravatar.cc/150?img=33"
                        alt="Reviewer"
                        className="reviewer-avatar"
                      />
                      <p className="reviewer-name">Sivani</p>
                    </div>
                    <div className="rating-stars">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                  </div>
                  <p className="review-text">
                    The Product was quite good my relative was using this
                    product i will give 5 star for this product more over i am
                    satisfied.
                  </p>
                  <div className="review-actions">
                    <div className="d-flex align-items-center gap-1">
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          marginBottom: "0",
                        }}
                      >
                        Was this helpful?
                      </p>

                      <div className="helpful-btns">
                        <button
                          style={{ color: "#058aff", fontSize: "18px" }}
                          onClick={() => handleFeedback(item, "like")}
                        >
                          {feedbackState[item] === "like" ? (
                            <BiSolidLike />
                          ) : (
                            <BiLike />
                          )}
                        </button>
                        <button
                          style={{ color: "#f25858", fontSize: "18px" }}
                          onClick={() => handleFeedback(item, "dislike")}
                        >
                          {feedbackState[item] === "dislike" ? (
                            <BiSolidDislike />
                          ) : (
                            <BiDislike />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <a href="#" className="view-all-link">
            View all →
          </a>
        </div>

        {/* --- Section 4: You May Also Like Products --- */}
        <div className="related-products-section">
          <h2>YOU MAY ALSO LIKE PRODUCTS</h2>
          <p>
            Premium Leather Furniture Crafted For Comfort, Durability, And
            Timeless Style Designed To Elevate Every Space.
          </p>

          <div className="text-start mb-3">
            <h5 className="fw-bold">All Products</h5>
          </div>
          <ProductCard />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductDetails;
