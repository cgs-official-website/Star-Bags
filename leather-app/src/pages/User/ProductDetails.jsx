import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProductCard from "../../components/User/ProductCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaStar, FaRegStar, FaHeart } from "react-icons/fa";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { FiHeart } from "react-icons/fi";
import { IoMdCart } from "react-icons/io";

import "../../assets/styles/ProductDetails.css";

function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [selectedSize, setSelectedSize] = useState("40L");
  const [activeFilter, setActiveFilter] = useState("Positive"); 
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  const reviewsScrollRef = useRef(null);
  const [isReviewsHovered, setIsReviewsHovered] = useState(false);

  useEffect(() => {
   
    if (window.innerWidth > 768) return;

    let animationFrameId;

    const scrollStep = () => {
      if (reviewsScrollRef.current && !isReviewsHovered) {
        reviewsScrollRef.current.scrollLeft += 1;
        
       
        if (reviewsScrollRef.current.scrollLeft >= reviewsScrollRef.current.scrollWidth - reviewsScrollRef.current.clientWidth - 1) {
          reviewsScrollRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isReviewsHovered]);

  const mockReviews = [
    {
      id: 1,
      name: "Sivani",
      avatar: "https://i.pravatar.cc/150?img=33",
      rating: 5,
      text: "The Product was quite good my relative was using this product i will give 5 star for this product more over i am satisfied.",
      likes: 12,
      dislikes: 2
    },
    {
      id: 2,
      name: "Rahul",
      avatar: "https://i.pravatar.cc/150?img=11",
      rating: 4,
      text: "Nice quality leather and perfect stitching. Very happy with the purchase.",
      likes: 8,
      dislikes: 0
    },
    {
      id: 3,
      name: "Anita",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      text: "Absolutely love this bag! The capacity is exactly what I needed for daily commute.",
      likes: 15,
      dislikes: 1
    },
    {
      id: 4,
      name: "Vikram",
      avatar: "https://i.pravatar.cc/150?img=60",
      rating: 1,
      text: "Terrible packaging and arrived late. Not satisfied with the customer service.",
      likes: 30,
      dislikes: 1
    },
    {
      id: 5,
      name: "Priya",
      avatar: "https://i.pravatar.cc/150?img=20",
      rating: 3,
      text: "It's an average product. Does the job but lacks premium feel.",
      likes: 5,
      dislikes: 1
    },
    {
      id: 6,
      name: "Karan",
      avatar: "https://i.pravatar.cc/150?img=68",
      rating: 4,
      text: "Good value for money. Looks exactly like the pictures.",
      likes: 2,
      dislikes: 0
    }
  ];

  const filteredReviews = mockReviews.filter(review => {
    if (activeFilter === "Positive") return review.rating >= 3;
    if (activeFilter === "Negative") return review.rating < 3;
    return true; 
  });

  const productCategory = "Bag";
  
  const sizeOptions = productCategory === 'Bag' 
    ? [{ value: '30L', label: 'Capacity' }, { value: '40L', label: 'Capacity' }, { value: '45L', label: 'Capacity' }]
    : productCategory === 'Belt' 
      ? [{ value: 'Small', label: 'Size' }, { value: 'Medium', label: 'Size' }, { value: 'Long', label: 'Size' }]
      : [];

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

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
        <div className="row mb-4">
          <div className="col-lg-6 d-flex align-items-center">
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

       
        <div className="row mb-5">
      
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

       
          <div className="col-lg-6 ps-lg-5">
            <div className="stock-text mb-2">23 in stock available</div>
            <h1 className="product-title">Leather Bag</h1>

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

            {(productCategory === 'Bag' || productCategory === 'Belt') && (
              <div className="size-selector-section mb-4">
                <h6 className="fw-bold mb-3" style={{ fontSize: '13px' }}>
                  Select Size {productCategory === 'Bag' && '(Capacity)'}
                </h6>
                <div className="d-flex gap-3 flex-wrap">
                  {sizeOptions.map((opt, idx) => (
                    <div 
                      key={idx} 
                      className={`size-option-box ${selectedSize === opt.value ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(opt.value)}
                    >
                      <div className="size-value">{opt.value}</div>
                      <div className="size-label">{opt.label}</div>
                      {selectedSize === opt.value && (
                        <div className="size-check-icon">
                          <i className="bi bi-check-circle-fill"></i>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
            <button className={`filter-btn-user ${activeFilter === 'All' ? 'active' : ''}`} onClick={() => setActiveFilter('All')}>All</button>
            <button className={`filter-btn-user ${activeFilter === 'Positive' ? 'active' : ''}`} onClick={() => setActiveFilter('Positive')}>Positive</button>
            <button className={`filter-btn-user ${activeFilter === 'Negative' ? 'active' : ''}`} onClick={() => setActiveFilter('Negative')}>Negative</button>
          </div>

          <div 
            className={`reviews-list-container ${!showAllReviews ? 'collapsed-reviews' : ''}`}
            ref={reviewsScrollRef}
            onTouchStart={() => setIsReviewsHovered(true)}
            onTouchEnd={() => setIsReviewsHovered(false)}
            onMouseEnter={() => setIsReviewsHovered(true)}
            onMouseLeave={() => setIsReviewsHovered(false)}
          >
            <div className="row g-4 mt-2 reviews-row">
              {filteredReviews.slice(0, 6).map((review) => (
                <div key={review.id} className="col-md-4 review-col">
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img
                          src={review.avatar}
                          alt="Reviewer"
                          className="reviewer-avatar"
                        />
                        <p className="reviewer-name">{review.name}</p>
                      </div>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                        ))}
                      </div>
                    </div>
                    <p className="review-text">{review.text}</p>
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
                            onClick={() => handleFeedback(review.id, "like")}
                          >
                            {feedbackState[review.id] === "like" ? (
                              <BiSolidLike />
                            ) : (
                              <BiLike />
                            )}
                            <span style={{ fontSize: '13px', marginLeft: '2px', fontWeight: '500', color: '#6c757d' }}>
                              {feedbackState[review.id] === "like" ? review.likes + 1 : review.likes}
                            </span>
                          </button>
                          <button
                            style={{ color: "#f25858", fontSize: "18px" }}
                            onClick={() => handleFeedback(review.id, "dislike")}
                          >
                            {feedbackState[review.id] === "dislike" ? (
                              <BiSolidDislike />
                            ) : (
                              <BiDislike />
                            )}
                            <span style={{ fontSize: '13px', marginLeft: '2px', fontWeight: '500', color: '#6c757d' }}>
                              {feedbackState[review.id] === "dislike" ? review.dislikes + 1 : review.dislikes}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!showAllReviews && filteredReviews.length > 3 && (
            <div className="text-center d-none d-md-block">
              <button 
                className="view-all-link mx-auto mt-4" 
                onClick={(e) => { e.preventDefault(); setShowAllReviews(true); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                View all →
              </button>
            </div>
          )}
        </div>

       
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
