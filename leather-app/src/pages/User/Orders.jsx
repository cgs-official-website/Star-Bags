import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import OrderCard from "../../components/User/OrderCard";
import ReviewModal from "../../components/User/ReviewModal"; 
import { FaSearch } from "react-icons/fa";
import "../../assets/styles/Orders.css";
import emptyOrders from "../../assets/images/empty.png";

function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // ─── REVIEW SYSTEM STATE MATRIX ───
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRating, setModalRating] = useState(5);
  const [activeOrderForReview, setActiveOrderForReview] = useState(null);

  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem("user_orders");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  useEffect(() => {
    const incoming = location.state?.newOrderPayloads || [];

    if (incoming.length > 0) {
      const normalised = incoming.map((o) => ({
        ...o,
        discountedPrice: Number(o.discountedPrice) || 0,
        originalPrice: Number(o.originalPrice) || 0,
      }));

      setOrders((prevOrders) => {
        const merged = [...normalised, ...prevOrders];
        const unique = merged.filter(
          (o, idx, self) => idx === self.findIndex((x) => x.id === o.id)
        );
        localStorage.setItem("user_orders", JSON.stringify(unique));
        return unique;
      });

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleOpenReviewModal = (orderItem) => {
    setActiveOrderForReview(orderItem);
    setModalRating(5);
    setModalOpen(true);
  };

  const handleReviewSubmit = (rating, text) => {
    if (!activeOrderForReview) return;

    const productName = activeOrderForReview.product;

    try {
      const rawReviewed = localStorage.getItem("user_reviewed_products");
      const reviewedList = rawReviewed ? JSON.parse(rawReviewed) : [];
      if (!reviewedList.includes(productName)) {
        reviewedList.push(productName);
        localStorage.setItem("user_reviewed_products", JSON.stringify(reviewedList));
      }
    } catch (e) { console.error(e); }

    try {
      const rawGlobalReviews = localStorage.getItem("global_product_reviews");
      const globalReviews = rawGlobalReviews ? JSON.parse(rawGlobalReviews) : [];
      
      const freshReviewObj = {
        id: Date.now(),
        productName: productName,
        name: "Rahul Sharma", 
        avatar: "https://i.pravatar.cc/150?img=11",
        rating: Number(rating),
        text: text,
        likes: 0,
        dislikes: 0,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      };

      localStorage.setItem("global_product_reviews", JSON.stringify([freshReviewObj, ...globalReviews]));
    } catch (e) { console.error(e); }

    setOrders([...orders]);

    setTimeout(() => {
      alert("Thank you! Your review has been submitted successfully.");
    }, 100);
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const EmptyOrders = () => (
    <div className="orders-empty-container text-center py-5">
      <div className="orders-empty-image-wrapper mb-3">
        <img src={emptyOrders} alt="No Orders" className="orders-empty-vector" style={{ maxWidth: "200px" }} />
      </div>
      <h3 className="orders-empty-heading">No orders yet!</h3>
      <span onClick={() => navigate("/AllProducts")} className="btn orders-empty-shop-btn text-white mt-2" style={{ cursor: "pointer", backgroundColor: "#8b5cf6", padding: "8px 24px", borderRadius: "6px" }}>
        Shop now
      </span>
    </div>
  );

  return (
    <div className="orders-page-app-wrapper">
      <Navbar />

      <main className="orders-container container py-3 my-2">
        <h4 className="mb-4 fw-bold">Settings and Profile</h4>

        <div className="row justify-content-center">
          <div className="col-lg-3 col-md-5 mb-4 sidebar-column-view wl-sidebar-sticky">
            <ProfileSideNav />
          </div>

          <div className="col-lg-9 col-md-7 list-column-view">
            <div className="orders-card p-4 bg-white shadow-sm border rounded-3">
              <div className="orders-header ">
                <div>
                  <h4 className="fw-bold mb-1 outfit-font text-dark-theme">My Orders</h4>
                  <p className="orders-subtitle text-muted small">View your purchase history and tracking details</p>
                </div>
              </div>

              <div className="orders-search-wrapper mb-4">
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <FaSearch style={{ position: "absolute", left: "14px", color: "#9ca3af" }} />
                  <input
                    type="text"
                    className="search-input"
                    style={{ paddingLeft: "40px", width: "100%", height: "42px", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    placeholder="Search your orders or IDs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="orders-list-wrapper">
                {filteredOrders.length > 0 ? (
                  <div className="orders-grid d-flex flex-column gap-3">
                    {filteredOrders.map((order, index) => (
                      <OrderCard 
                        key={`${order.id}-${index}`} 
                        order={order} 
                        onReviewClick={() => handleOpenReviewModal(order)} 
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyOrders />
                )}
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