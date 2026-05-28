import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import RecentProduct from "../../components/User/RecentProduct";
import ReviewModal from "../../components/User/ReviewModal";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaStar, FaRegStar, FaHeart, FaTrashAlt } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { FiHeart } from "react-icons/fi";
import { IoMdCart } from "react-icons/io";
import { MdAdd, MdClose, MdModeEdit } from "react-icons/md";
import { TiPencil } from "react-icons/ti";
import { useWishlist } from "../../context/WishlistContext";

import "../../assets/styles/ProductDetails.css";

function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, cart, addToCart } = useWishlist();

  const productData = location.state?.product;

  const currentProduct = productData || {
    id: 10,
    image: "../src/assets/images/leather1.png",
    name: "Hand Bag",
    price: "499",
    realPrice: "799",
    offer: "37%",
    category: "bag",
    productId: "SBP-BAG-00003",
    brandName: "Krish Leather Factory",
    material: "Genuine Leather, Premium Inner Lining",
    description:
      "Premium stitched leather detailing, sleek craftsmanship, and smart storage compartments—designed for everyday convenience and built to last.",
  };

  // Address and Selector States
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const rawData = localStorage.getItem("savedAddresses");
    return rawData ? JSON.parse(rawData) : [];
  });

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const rawData = localStorage.getItem("savedAddresses");
    const parsed = rawData ? JSON.parse(rawData) : [];
    return parsed.length > 0 ? parsed[0].id : null;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  const activeSelectedAddress = savedAddresses.find(
    (addr) => addr.id === selectedAddressId,
  );
  const [quantity, setQuantity] = useState(1);

  // Wishlist and Category Parsing
  const isProductInWishlist = wishlist?.some(
    (item) => item.id === currentProduct.id,
  );
  const productCategory =
    currentProduct.category?.toLowerCase() === "wallet"
      ? "Wallet"
      : currentProduct.category?.toLowerCase() === "belt"
        ? "Belt"
        : "Bag";

  const [selectedSize, setSelectedSize] = useState(
    productCategory === "Bag" ? "40L" : "M",
  );

  // ─── REVIEW SYSTEM STATE MANAGEMENT ENGINE ───
  const [dynamicReviews, setDynamicReviews] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRating, setModalRating] = useState(4);
  const [feedbackState, setFeedbackState] = useState({});

  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isReviewsHovered, setIsReviewsHovered] = useState(false);
  const reviewsScrollRef = useRef(null);

  // Fetch product matches from global review index
  useEffect(() => {
    const savedReviews = localStorage.getItem("global_product_reviews");
    if (savedReviews) {
      const parsed = JSON.parse(savedReviews);
      const matchedProductReviews = parsed.filter(
        (r) => r.productName === currentProduct.name,
      );
      setDynamicReviews(matchedProductReviews);
    } else {
      setDynamicReviews([]);
    }
    window.scrollTo(0, 0);
  }, [currentProduct.name, currentProduct.id]);

  // Mobile Auto Scroll Carousel Animation Effect for Reviews
  useEffect(() => {
    if (window.innerWidth > 768) return;

    let animationFrameId;
    const scrollStep = () => {
      if (reviewsScrollRef.current && !isReviewsHovered) {
        reviewsScrollRef.current.scrollLeft += 1;
        if (
          reviewsScrollRef.current.scrollLeft >=
          reviewsScrollRef.current.scrollWidth -
            reviewsScrollRef.current.clientWidth -
            1
        ) {
          reviewsScrollRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isReviewsHovered]);

  // Live Score System Calculations
  const totalReviewsCount = dynamicReviews.length;
  const averageRatingScore =
    totalReviewsCount > 0
      ? (
          dynamicReviews.reduce((sum, r) => sum + r.rating, 0) /
          totalReviewsCount
        ).toFixed(1)
      : "0.0";

  const getStarCountFactor = (starNum) =>
    dynamicReviews.filter((r) => r.rating === starNum).length;
  const getStarPercentFactor = (starNum) =>
    totalReviewsCount > 0
      ? `${(getStarCountFactor(starNum) / totalReviewsCount) * 100}%`
      : "0%";

  // ─── REFACTORED CUSTOM FILTER AND MATRIX SORT CONDITIONAL PIPELINE ───
  const getFilteredAndSortedReviews = () => {
    if (activeFilter === "Positive") {
      return dynamicReviews
        .filter((review) => review.rating > 2) // Rated above 2 stars (3, 4, 5 stars)
        .sort((a, b) => b.id - a.id); // Ordered by newest first (First In, Last Out)
    }
    if (activeFilter === "Negative") {
      return dynamicReviews
        .filter((review) => review.rating <= 2) // Rated 2 stars and below (1, 2 stars)
        .sort((a, b) => b.id - a.id); // Ordered by newest first (First In, Last Out)
    }
    
    // Default Tab Pathway: "All" Review Elements
    return dynamicReviews
      .sort((a, b) => b.rating - a.rating); // Ordered explicitly by standard 5 to 1 score sorting
  };

  const filteredReviews = getFilteredAndSortedReviews().slice(0, 6); // Global display cap set to 6 total items maximum

  const visibleReviews = showAllReviews
    ? filteredReviews
    : filteredReviews.slice(0, 3);

  const handleFeedback = (id, type) => {
    setFeedbackState((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  const handleWriteReviewSubmit = (rating, text) => {
    if (!text || !text.trim()) {
      alert("Please write a comment before submitting your review.");
      return;
    }

    const freshReviewObj = {
      id: Date.now(),
      productName: currentProduct.name,
      name: "Anonymous User",
      rating: rating,
      text: text,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      likes: 0,
      dislikes: 0,
    };

    const updatedReviewsList = [freshReviewObj, ...dynamicReviews];
    setDynamicReviews(updatedReviewsList);

    const rawGlobalReviews = localStorage.getItem("global_product_reviews");
    const parsedGlobal = rawGlobalReviews ? JSON.parse(rawGlobalReviews) : [];
    localStorage.setItem(
      "global_product_reviews",
      JSON.stringify([freshReviewObj, ...parsedGlobal]),
    );

    alert("Thank you! Your review has been successfully submitted.");
  };

  // Size Configurations
  const sizeOptions =
    productCategory === "Bag"
      ? [
          { value: "30L", label: "Capacity" },
          { value: "40L", label: "Capacity" },
          { value: "45L", label: "Capacity" },
        ]
      : productCategory === "Belt"
        ? [
            { value: "S", label: "Size" },
            { value: "M", label: "Size" },
            { value: "L", label: "Size" },
          ]
        : [];

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Image Gallery Configurations
  const images = [
    currentProduct.image,
    "../src/assets/images/bag.png",
    "../src/assets/images/belt.png",
    "../src/assets/images/wallet.png",
    "../src/assets/images/leather1.png",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const mainImage = images[currentImageIndex];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const promptDeleteAddress = (e, id) => {
    e.stopPropagation();
    setTargetDeleteId(id);
    setShowDeleteModal(true);
  };

  const executeDeleteAddress = () => {
    const updated = savedAddresses.filter((addr) => addr.id !== targetDeleteId);
    setSavedAddresses(updated);
    localStorage.setItem("savedAddresses", JSON.stringify(updated));
    if (selectedAddressId === targetDeleteId) {
      setSelectedAddressId(updated.length > 0 ? updated[0].id : null);
    }
    setShowDeleteModal(false);
    setTargetDeleteId(null);
  };

  const isCurrentlyInCartWithThisSize = cart?.some(
    (item) => item.id === currentProduct.id && item.size === selectedSize,
  );

  const handleAddToCartAction = () => {
    if (isCurrentlyInCartWithThisSize) {
      navigate("/cart");
    } else {
      const cartPayload = {
        ...currentProduct,
        qty: quantity,
        size: selectedSize,
      };
      addToCart(cartPayload);
    }
  };

  const handleProceedToCheckoutDirectly = () => {
    const itemPayload = {
      ...currentProduct,
      qty: quantity,
      size: selectedSize,
    };
    navigate("/checkout", {
      state: {
        allCartItems: [itemPayload],
        cartItems: [itemPayload],
        couponPercentageLabel: "",
        returnedAddressId: selectedAddressId,
      },
    });
  };

  return (
    <div className="product-details-page" style={{ position: "relative" }}>
      <Navbar />

      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-lg-6 d-flex align-items-center"></div>
          <div className="col-lg-6 ps-lg-5 d-flex justify-content-between align-items-center">
            <div
              className="breadcrumb-text"
              style={{ textTransform: "capitalize" }}
            >
              {currentProduct.category}s /{" "}
              <span className="active">{currentProduct.name}</span>
            </div>
            <div
              className="text-danger fs-4 cursor-pointer wishlist-btn"
              onClick={() => toggleWishlist(currentProduct)}
            >
              {isProductInWishlist ? <FaHeart /> : <FiHeart />}
            </div>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="main-image-container">
              <button
                className="arrow-btn d-none d-md-block"
                onClick={handlePrevImage}
              >
                <IoIosArrowBack />
              </button>
              <img
                key={currentImageIndex}
                src={mainImage}
                alt={currentProduct.name}
                className="main-product-image mx-4"
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
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img src={img} alt="Thumbnail segment element" />
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-6 ps-lg-5">
            <div className="stock-text mb-2">23 in stock available</div>
            <h1 className="product-title">{currentProduct.name}</h1>
            <div className="price-section d-flex align-items-center mb-2">
              <span className="current-price">₹ {currentProduct.price}</span>
              <span className="original-price">
                ₹ {currentProduct.realPrice || "799"}
              </span>
              <span className="discount">
                {currentProduct.offer || "37% off"} off
              </span>
            </div>

            <div className="d-flex align-items-center mb-3">
              <div className="rating-stars text-warning me-2">
                {[...Array(5)].map((_, i) =>
                  i < Math.round(Number(averageRatingScore)) ? (
                    <FaStar key={i} />
                  ) : (
                    <FaRegStar key={i} style={{ color: "#d1d5db" }} />
                  ),
                )}
              </div>
              <span
                className="rating-count"
                style={{ fontSize: "0.85rem", color: "#6b7280" }}
              >
                {totalReviewsCount > 0
                  ? `${averageRatingScore} / 5.0`
                  : "No ratings yet"}{" "}
                ({totalReviewsCount} Reviews)
              </span>
            </div>
            <p className="product-description">{currentProduct.description}</p>

            {sizeOptions.length > 0 && (
              <div className="size-selector-section mb-4">
                <h6 className="fw-bold mb-3" style={{ fontSize: "13px" }}>
                  Select Size {productCategory === "Bag" && "(Capacity)"}
                </h6>
                <div className="d-flex gap-3 flex-wrap">
                  {sizeOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`size-option-box ${selectedSize === opt.value ? "selected" : ""}`}
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

              <button
                className="btn-add-cart"
                onClick={handleAddToCartAction}
                style={{
                  backgroundColor: isCurrentlyInCartWithThisSize
                    ? "#4b5563"
                    : "#f3f4f6",
                  color: isCurrentlyInCartWithThisSize ? "#ffffff" : "#1f2937",
                  border: isCurrentlyInCartWithThisSize
                    ? "none"
                    : "1px solid #d1d5db",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                }}
              >
                <IoMdCart />{" "}
                {isCurrentlyInCartWithThisSize ? "Go to Cart" : "Add to Cart"}
              </button>
            </div>
            <button
              className="btn-buy-now"
              onClick={handleProceedToCheckoutDirectly}
            >
              Buy Now
            </button>

            <div className="delivery-box mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-bold text-dark">Delivery Address</h6>
                {savedAddresses.length > 0 && (
                  <h6
                    className="cursor-pointer"
                    style={{ color: "#8b5cf6", fontSize: "13px", fontWeight: "600" }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Choose Address <span className="bi bi-pencil-square"></span>
                  </h6>
                )}
              </div>
              <hr
                style={{ width: "100%", borderColor: "#ddd" }}
                className="my-2"
              />

              {savedAddresses.length === 0 ? (
                <div
                  className="empty-address-viewport d-flex justify-content-center align-items-center py-2"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <button
                    type="button"
                    className="add-delivery-trigger-btn d-flex align-items-center gap-2"
                    style={{
                      background: "none",
                      border: "1px dashed #8b5cf6",
                      color: "#8b5cf6",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                    onClick={() => navigate("/address")}
                  >
                    <TiPencil style={{ transform: "rotate(-45deg)" }} /> Add
                    your Delivery Address
                  </button>
                </div>
              ) : !activeSelectedAddress ? (
                <div className="p-2 text-warning small fw-semibold">
                  ⚠️ Please click 'Choose Address' to select a card.
                </div>
              ) : (
                <div className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
                  <p className="mb-1">
                    <strong>{activeSelectedAddress.name}</strong>,{" "}
                    {activeSelectedAddress.address}
                  </p>
                  <p className="mb-1">
                    {activeSelectedAddress.city}, {activeSelectedAddress.state}{" "}
                    - {activeSelectedAddress.pin}
                  </p>
                  <p className="mb-0">Mobile: {activeSelectedAddress.mobile}</p>
                </div>
              )}
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
                  <td>{currentProduct.name}</td>
                </tr>
                <tr>
                  <td>Brand Name</td>
                  <td>{currentProduct.brandName || "Krish Leather Factory"}</td>
                </tr>
                <tr>
                  <td>Product ID</td>
                  <td>{currentProduct.productId || "SBP-BAG-00003"}</td>
                </tr>
                <tr>
                  <td>Material</td>
                  <td>
                    {currentProduct.material ||
                      "Genuine Leather, Premium Inner Lining"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── RATING AND USER REVIEWS PANEL ─── */}
        <div className="reviews-section">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Rating And Reviews</h4>
            <button
              onClick={() => setModalOpen(true)}
              className="btn text-white fw-bold px-3 py-1.5"
              style={{
                backgroundColor: "#8b5cf6",
                borderRadius: "6px",
                fontSize: "0.8rem",
                border: "none",
              }}
            >
              Write a Review
            </button>
          </div>

          <div className="overall-rating-card shadow-sm mb-4">
            <div className="rating-score">
              <h2>
                {averageRatingScore}{" "}
                {totalReviewsCount > 0 ? (
                  <FaStar className="fs-4 text-warning" />
                ) : (
                  <FaRegStar className="fs-4" />
                )}
              </h2>
              <p>{totalReviewsCount} Ratings</p>
              <p>&</p>
              <p>{totalReviewsCount} Reviews</p>
            </div>

            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="rating-bar-row">
                  <span>
                    {star}{" "}
                    <FaStar
                      style={{
                        color:
                          getStarCountFactor(star) > 0 ? "#fbbf24" : "#e5e7eb",
                      }}
                    />
                  </span>
                  <div className="progress-custom">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: getStarPercentFactor(star),
                        backgroundColor:
                          star >= 3
                            ? "#22c55e"
                            : star === 2
                              ? "#fbbf24"
                              : "#ef4444",
                      }}
                    />
                  </div>
                  <span
                    className="text-muted"
                    style={{ width: "40px", textAlign: "right" }}
                  >
                    {getStarCountFactor(star)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-buttons">
            {["All", "Positive", "Negative"].map((type) => (
              <button
                key={type}
                className={`filter-btn-user ${activeFilter === type ? "active" : ""}`}
                onClick={() => {
                  setActiveFilter(type);
                  setShowAllReviews(false);
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {filteredReviews.length === 0 ? (
            <div
              className="text-center py-5 shadow-sm border rounded-3 my-3 bg-white"
              style={{ fontFamily: "system-ui" }}
            >
              <div style={{ fontSize: "2.8rem", color: "#a8a29e" }} className="mb-2">
                ✍️
              </div>
              <h5
                className="fw-bold mb-1 text-dark"
                style={{ fontSize: "1.1rem" }}
              >
                No matching reviews yet
              </h5>
              <p className="text-muted small mb-3">
                Be the first to leave a verified review matching your selected
                filter metrics!
              </p>
            </div>
          ) : (
            <div
              className="reviews-list-container mobile-swipe-slider"
              ref={reviewsScrollRef}
              onTouchStart={() => setIsReviewsHovered(true)}
              onTouchEnd={() => setIsReviewsHovered(false)}
              onMouseEnter={() => setIsReviewsHovered(true)}
              onMouseLeave={() => setIsReviewsHovered(false)}
            >
              <div
                className="row flex-nowrap flex-md-wrap g-4 mt-2 reviews-row"
                style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
              >
                {visibleReviews.map((review) => (
                  <div
                    key={review.id}
                    className="col-10 col-sm-6 col-md-4 review-col flex-shrink-0"
                  >
                    <div className="review-card p-3 border rounded bg-white shadow-sm">
                      <div className="review-header d-flex justify-content-between mb-2">
                        <div className="reviewer-info d-flex align-items-center gap-2">
                          <FaCircleUser className="fs-4 text-secondary" />
                          <p
                            className="reviewer-name fw-bold m-0 small"
                            style={{ color: "#111827" }}
                          >
                            {review.name}
                          </p>
                        </div>
                        <div className="rating-stars text-warning small">
                          {[...Array(5)].map((_, i) =>
                            i < review.rating ? (
                              <FaStar key={i} />
                            ) : (
                              <FaRegStar key={i} />
                            ),
                          )}
                        </div>
                      </div>
                      <p
                        className="review-text small text-muted"
                        style={{
                          lineHeight: "1.5",
                          height: "65px",
                          overflowY: "auto",
                        }}
                      >
                        {review.text}
                      </p>

                      <div className="review-actions d-flex justify-content-between align-items-center mt-3 border-top pt-2">
                        <span
                          className="text-muted"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {review.date}
                        </span>
                        <div className="helpful-btns d-flex gap-2">
                          <button
                            style={{
                              color: "#058aff",
                              background: "none",
                              border: "none",
                              fontSize: "16px",
                            }}
                            onClick={() => handleFeedback(review.id, "like")}
                          >
                            {feedbackState[review.id] === "like" ? (
                              <BiSolidLike />
                            ) : (
                              <BiLike />
                            )}
                            <span
                              style={{
                                fontSize: "12px",
                                marginLeft: "3px",
                                color: "#6c757d",
                              }}
                            >
                              {feedbackState[review.id] === "like"
                                ? review.likes + 1
                                : review.likes}
                            </span>
                          </button>
                          <button
                            style={{
                              color: "#f25858",
                              background: "none",
                              border: "none",
                              fontSize: "16px",
                            }}
                            onClick={() => handleFeedback(review.id, "dislike")}
                          >
                            {feedbackState[review.id] === "dislike" ? (
                              <BiSolidDislike />
                            ) : (
                              <BiDislike />
                            )}
                            <span
                              style={{
                                fontSize: "12px",
                                marginLeft: "3px",
                                color: "#6c757d",
                              }}
                            >
                              {feedbackState[review.id] === "dislike"
                                ? review.dislikes + 1
                                : review.dislikes}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!showAllReviews && filteredReviews.length > 3 && (
            <div className="text-center d-none d-md-block">
              <button
                className="view-all-link mx-auto mt-4"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAllReviews(true);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                See all →
              </button>
            </div>
          )}
        </div>

        <div className="recent-products-outer-container py-4 border-top mt-5">
          <div className="container">
            <RecentProduct />
          </div>
        </div>
      </div>

      {/* Address Selection Modal Grid */}
      {isModalOpen && (
        <div
          className="address-popup-modal-overlay d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(2px)",
            zIndex: 999,
          }}
        >
          <div
            className="address-popup-modal-box shadow-lg bg-white p-4 rounded"
            style={{
              width: "92%",
              maxWidth: "625px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <h4 className="m-0 text-dark fw-bold" style={{ fontSize: "1.4rem" }}>
                Select delivery address
              </h4>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setIsModalOpen(false)}
              >
                <MdClose size={24} />
              </button>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="m-0 text-dark fw-semibold" style={{ fontSize: "1.05rem" }}>
                Saved Addresses
              </h5>
              <button
                type="button"
                className="popup-add-new-address-btn d-flex align-items-center gap-1"
                style={{
                  backgroundColor: "#8b5cf6",
                  color: "#fff",
                  border: "none",
                  padding: "7px 14px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "0.8rem",
                }}
                onClick={() => navigate("/address")}
              >
                <MdAdd size={16} /> Add a New Address
              </button>
            </div>
            <div
              className="popup-address-items-scroller pr-1"
              style={{ maxHeight: "365px", overflowY: "auto" }}
            >
              {savedAddresses.map((addr, index) => (
                <div
                  key={addr.id}
                  className="popup-address-item-card p-3 mb-3 border rounded position-relative"
                  onClick={() => {
                    setSelectedAddressId(addr.id);
                    setIsModalOpen(false);
                  }}
                  style={{
                    cursor: "pointer",
                    borderColor: selectedAddressId === addr.id ? "#8b5cf6" : "#e5e7eb",
                    backgroundColor: selectedAddressId === addr.id ? "#f5f3ff" : "#fff",
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="fw-bold text-dark" style={{ fontSize: "1rem" }}>
                      Address {index + 1}
                    </span>
                    {selectedAddressId === addr.id && (
                      <span
                        className="px-2 py-0.5 rounded-pill"
                        style={{
                          backgroundColor: "#ddd6fe",
                          color: "#6d28d9",
                          fontSize: "0.72rem",
                          fontWeight: "700",
                        }}
                      >
                        Selected
                      </span>
                    )}
                    <div
                      className="popup-card-actions-tray d-flex align-items-center gap-2 ms-auto"
                      style={{ position: "absolute", top: "14px", right: "14px" }}
                    >
                      <button
                        type="button"
                        className="edit-icon"
                        style={{
                          background: "transparent",
                          border: "1px solid #c4b5fd",
                          color: "#8b5cf6",
                          borderRadius: "20px",
                          padding: "3px 12px",
                          fontSize: "0.78rem",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/address");
                        }}
                      >
                        <MdModeEdit size={14} />{" "}
                        <span style={{ marginLeft: "2px" }}>Edit</span>
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#9ca3af",
                          cursor: "pointer",
                        }}
                        onClick={(e) => promptDeleteAddress(e, addr.id)}
                      >
                        <FaTrashAlt size={13} />
                      </button>
                    </div>
                  </div>
                  <p className="text-dark m-0 mb-1" style={{ fontSize: "0.88rem" }}>
                    {addr.name} , {addr.address}
                  </p>
                  <p className="text-dark m-0 mb-1" style={{ fontSize: "0.88rem" }}>
                    {addr.city}, {addr.state} - {addr.pin}
                  </p>
                  <p className="text-muted m-0" style={{ fontSize: "0.85rem" }}>
                    Mobile: {addr.mobile}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Address Modal */}
      {showDeleteModal && (
        <div
          className="modal-overlay-custom"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
        >
          <div
            className="modal-box-custom shadow-lg bg-white p-4 rounded text-center"
            style={{ width: "90%", maxWidth: "400px" }}
          >
            <h5 className="fw-bold mb-2">Confirm Deletion</h5>
            <p className="text-muted small">
              Are you sure you want to delete this delivery address profile?
            </p>
            <div className="d-flex gap-3 mt-4">
              <button
                type="button"
                className="btn btn-secondary flex-fill"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger flex-fill"
                onClick={executeDeleteAddress}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleWriteReviewSubmit}
        rating={modalRating}
        setRating={setModalRating}
      />
      <Footer />
    </div>
  );
}

export default ProductDetails;