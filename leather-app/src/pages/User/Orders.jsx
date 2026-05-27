import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import OrderCard from "../../components/User/OrderCard";
import ReviewModal from "../../components/User/ReviewModal"; 
import { FaSearch, FaRegStar, FaCheckCircle } from "react-icons/fa";
import "../../assets/styles/Orders.css";
import emptyOrders from "../../assets/images/empty.png";

const EmptyOrders = ({ onShopNowClick }) => {
  return (
    <div className="orders-empty-container text-center py-5">
      <div className="orders-empty-image-wrapper mb-3">
        <img src={emptyOrders} alt="No Orders Blueprint" className="orders-empty-vector" style={{ maxWidth: "200px", height: "auto" }} />
      </div>
      <h3 className="orders-empty-heading fw-bold" style={{ fontSize: "1.3rem", color: "#374151" }}>No orders found!</h3>
      <span onClick={onShopNowClick} className="btn orders-empty-shop-btn text-white mt-2" style={{ cursor: "pointer", backgroundColor: "#8b5cf6", padding: "8px 24px", borderRadius: "6px", fontWeight: "600" }}>Shop now</span>
    </div>
  );
};

function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // Review Modal Configuration States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRating, setModalRating] = useState(5);
  const [activeOrderForReview, setActiveOrderForReview] = useState(null);

  const [orders, setOrders] = useState(() => {
    const localSaved = localStorage.getItem("user_purchase_history");
    return localSaved ? JSON.parse(localSaved) : [];
  });

  const [submittedProductReviews, setSubmittedProductReviews] = useState(() => {
    const savedReviews = localStorage.getItem("global_product_reviews");
    return savedReviews ? JSON.parse(savedReviews) : [];
  });

  useEffect(() => {
    const incomingSingle = location.state?.newOrderPayload;
    const incomingMultiple = location.state?.newOrderPayloads;
    
    let itemsToAdd = [];
    if (incomingSingle) {
      itemsToAdd = [incomingSingle];
    } else if (incomingMultiple && Array.isArray(incomingMultiple)) {
      itemsToAdd = incomingMultiple;
    }

    if (itemsToAdd.length > 0) {
      setOrders((prevOrders) => {
        const uniqueNewOrders = itemsToAdd.filter(
          (newOrder) => !prevOrders.some((existingOrder) => existingOrder.id === newOrder.id)
        );
        if (uniqueNewOrders.length === 0) return prevOrders;
        const updatedLedger = [...uniqueNewOrders, ...prevOrders];
        localStorage.setItem("user_purchase_history", JSON.stringify(updatedLedger));
        return updatedLedger;
      });

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // TRIGGER POPUP MODAL ONLY IF NOT REVIEWED YET
  const openReviewTrigger = (selectedOrderItem, e) => {
    e.stopPropagation(); // Prevents parent navigation trigger loops
    setActiveOrderForReview(selectedOrderItem);
    setModalRating(5); 
    setModalOpen(true);
  };

  const handleReviewSubmit = (rating, text) => {
    if (!activeOrderForReview) return;

    const freshReviewObj = {
      id: Date.now(),
      productName: activeOrderForReview.product, 
      name: "Rahul Sharma", 
      avatar: "https://i.pravatar.cc/150?img=11",
      rating: Number(rating),
      text: text,
      likes: 0,
      dislikes: 0,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    };

    const updatedReviewsMasterList = [freshReviewObj, ...submittedProductReviews];
    setSubmittedProductReviews(updatedReviewsMasterList);
    localStorage.setItem("global_product_reviews", JSON.stringify(updatedReviewsMasterList));
    
    setModalOpen(false); 
    setActiveOrderForReview(null);

    setTimeout(() => {
      alert("Thank you! Your review has been submitted successfully.");
    }, 100);
  };

  const filteredOrders = orders.filter(
    (order) => order.product?.toLowerCase().includes(searchTerm.toLowerCase()) || order.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="orders-page-app-wrapper">
      <Navbar />
      
      {/* ─── FIXED TRICK: STABLE TRACK ENGINE TO STRIP AWAY DOCK HOVER SCALES ─── */}
      <style>{`
        .stable-order-card-container {
          position: relative;
          display: block;
          margin-bottom: 16px;
        }
        /* Completely kills standard hover reactions on the order item mesh block */
        .stable-order-card-container,
        .stable-order-card-container:hover {
          cursor: default !important;
          transform: none !important;
          box-shadow: none !important;
          transition: none !important;
        }
        .stable-order-card-container * {
          cursor: default !important;
        }
        /* Keep cursor working beautifully ONLY on the interactive active button itself */
        .active-rate-review-btn-trigger {
          cursor: pointer !important;
        }
        .active-rate-review-btn-trigger * {
          cursor: pointer !important;
        }
      `}</style>

      <main className="orders-container container py-4 my-2">
        <h4 className="mb-4 fw-bold outfit-font page-section-title">Settings and Profile</h4>
        <div className="row justify-content-center">
          <div className="col-lg-3 col-md-5 mb-4 sidebar-column-view wl-sidebar-sticky"><ProfileSideNav /></div>
          <div className="col-lg-9 col-md-7 list-column-view">
            <div className="orders-card p-4 bg-white shadow-sm border rounded-3">
              <div className="orders-header">
                <h4 className="fw-bold mb-1 outfit-font text-dark">My Orders</h4>
                <p className="orders-subtitle text-muted small">View your purchase history and tracking details</p>
              </div>

              <div className="orders-search-wrapper mb-4">
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <FaSearch style={{ position: "absolute", left: "14px", color: "#9ca3af" }} />
                  <input type="text" className="search-input" style={{ paddingLeft: "40px", width: "100%", height: "42px", borderRadius: "8px", border: "1px solid #e5e7eb" }} placeholder="Search your orders or IDs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>

              <div className="orders-list-wrapper">
                {filteredOrders.length > 0 ? (
                  <div className="orders-grid d-flex flex-column gap-3">
                    {filteredOrders.map((order, index) => {
                      const isReviewed = submittedProductReviews.some((r) => r.productName === order.product);
                      return (
                        <div 
                          key={`${order.id}-${index}`} 
                          onClick={() => !isReviewed && navigate("/TrackOrder", { state: { order } })}
                          className="stable-order-card-container"
                        >
                          {/* Main product billing information layout (Always 100% visible, No cover overlay) */}
                          <OrderCard order={order} />
                          
                          {/* ─── FIXED DYNAMIC TRAY: EXACT DOWN SIDE ALIGNMENT REPLACEMENT LAYER ─── */}
                          <div 
                            style={{ 
                              position: "absolute", 
                              bottom: "16px", 
                              right: "20px", 
                              zIndex: 10
                            }}
                          >
                            {!isReviewed ? (
                              /* INITIAL STATE: Action Button Display on Down Side Column */
                              <button
                                onClick={(e) => openReviewTrigger(order, e)}
                                className="active-rate-review-btn-trigger"
                                style={{
                                  backgroundColor: "transparent",
                                  border: "1px solid #8b5cf6",
                                  color: "#8b5cf6",
                                  padding: "5px 14px",
                                  borderRadius: "6px",
                                  fontSize: "0.8rem",
                                  fontWeight: "600",
                                  transition: "all 0.2s ease",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px"
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = "#8b5cf6";
                                  e.target.style.color = "#ffffff";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = "transparent";
                                  e.target.style.color = "#8b5cf6";
                                }}
                              >
                                <FaRegStar /> Rate & Review
                              </button>
                            ) : (
                              /* SUCCESS SUBMITTED STATE: Instantly replaces the button with this clean static text (NO HOVER EFFECTS) */
                              <span 
                                style={{ 
                                  color: "#2e7d32", 
                                  fontSize: "0.78rem", 
                                  fontWeight: "700",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  userSelect: "none",
                                  pointerEvents: "none" // Disables any hover triggers cleanly
                                }}
                              >
                                <FaCheckCircle style={{ fontSize: "0.85rem" }} /> Review Submitted
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <EmptyOrders onShopNowClick={() => navigate("/AllProducts")} />}
              </div>
            </div>
          </div>
        </div>
      </main>

      <ReviewModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleReviewSubmit} 
        rating={modalRating} 
        setRating={setModalRating} 
      />

      <Footer />
    </div>
  );
}

export default Orders;