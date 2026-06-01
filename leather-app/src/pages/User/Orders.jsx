import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import OrderCard from "../../components/User/OrderCard";
import ReviewModal from "../../components/User/ReviewModal"; 
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductsContext";
import { db } from "../../firebase";
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import "../../assets/styles/Orders.css";
import emptyOrders from "../../assets/images/empty.png";

function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { products } = useProducts();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalRating, setModalRating] = useState(5);
  const [activeOrderForReview, setActiveOrderForReview] = useState(null);
  const [reviewedOrderIds, setReviewedOrderIds] = useState(new Set());

  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!currentUser) {
        setOrders([]);
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const list = [];
        querySnapshot.forEach((docSnap) => {
          list.push(docSnap.data());
        });

        // Merge with incoming location state payload if not present yet
        const incoming = location.state?.newOrderPayloads || [];
        const normalizedIncoming = incoming.map((o) => ({
          ...o,
          discountedPrice: Number(o.discountedPrice) || 0,
          originalPrice: Number(o.originalPrice) || 0,
        }));

        const merged = [...list];
        normalizedIncoming.forEach((item) => {
          if (!merged.some((o) => o.id === item.id)) {
            merged.push(item);
          }
        });

        // Sort orders by orderDate descending
        merged.sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0));

        setOrders(merged);
        localStorage.setItem("user_orders", JSON.stringify(merged));
      } catch (err) {
        console.error("Error fetching user orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();

    // Clean up location state once handled
    if (location.state?.newOrderPayloads) {
      window.history.replaceState({}, document.title);
    }
  }, [currentUser, location.state]);

  // Track which orders this user has already reviewed and auto-migrate legacy ones
  useEffect(() => {
    if (!currentUser || products.length === 0) return;
    const fetchReviewedOrders = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          where("customerId", "==", currentUser.uid)
        );
        const snap = await getDocs(q);
        const ids = new Set(snap.docs.map(d => d.data().orderId).filter(Boolean));
        setReviewedOrderIds(ids);

        // Auto-migrate legacy order-ID-based productIds to catalog IDs
        snap.docs.forEach(async (docSnap) => {
          const r = docSnap.data();
          const currentProductId = r.productId;
          if (currentProductId && (currentProductId.startsWith("SBO-") || !currentProductId)) {
            const matched = products.find((p) => p.name === r.productName);
            if (matched) {
              try {
                await updateDoc(doc(db, "reviews", docSnap.id), {
                  productId: matched.id
                });
                console.log(`Auto-migrated review ${docSnap.id} to correct productId: ${matched.id}`);
              } catch (migrateErr) {
                console.error("Failed to auto-migrate review:", migrateErr);
              }
            }
          }
        });
      } catch (err) {
        console.error("Error checking reviewed orders:", err);
      }
    };
    fetchReviewedOrders();
  }, [currentUser, products]);

  const handleOpenReviewModal = (orderItem) => {
    setActiveOrderForReview(orderItem);
    setModalRating(5);
    setModalOpen(true);
  };

  const handleReviewSubmit = async (rating, text) => {
    if (!activeOrderForReview || !currentUser) return;
    try {
      let customerName = currentUser.email || "Anonymous User";
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) {
          customerName = snap.data().name || snap.data().displayName || customerName;
        }
      } catch (_) {}

      const matchedProduct = products.find(
        (p) => p.name === activeOrderForReview.product || p.id === activeOrderForReview.productId || p.productId === activeOrderForReview.productId
      );
      const realProductId = matchedProduct?.id || activeOrderForReview.productId || activeOrderForReview.items?.[0]?.productId || activeOrderForReview.id;

      const reviewPayload = {
        productId: realProductId,
        productName: activeOrderForReview.product,
        image: activeOrderForReview.image || "",
        customerId: currentUser.uid,
        customerName,
        orderId: activeOrderForReview.id,
        text: text.trim(),
        rating: Number(rating),
        likes: [],
        dislikes: [],
        likeCount: 0,
        dislikeCount: 0,
        date: new Date(),
        isHidden: false,
      };

      await addDoc(collection(db, "reviews"), reviewPayload);
      setReviewedOrderIds(prev => new Set([...prev, activeOrderForReview.id]));
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    }
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
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading your orders...</p>
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <div className="orders-grid d-flex flex-column gap-3">
                    {filteredOrders.map((order, index) => (
                      <OrderCard 
                        key={`${order.id}-${index}`} 
                        order={order}
                        reviewed={reviewedOrderIds.has(order.id)}
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