import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import OrderCard from "../../components/User/OrderCard";
import { FaSearch } from "react-icons/fa";
import "../../assets/styles/Orders.css";
import emptyOrders from "../../assets/images/empty.png";


function Orders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Premium mock orders dataset matching your database & team specs
  const [orders] = useState([
    // {
    //   id: "ORD002457890KJM",
    //   product: "2-Seater Leather Sofa",
    //   status: "Delivered",
    //   time: "12 Mar, 2026",
    //   rating: 4.2,
    //   reviews: 120,
    //   deliveryDate: "25/04/2020",
    //   discountedPrice: 120,
    //   originalPrice: 120,
    //   quantity: 1,
    //   image: "",
    // },
    // {
    //   id: "ORD002457890KJM",
    //   product: "Leather Backpack",
    //   status: "Delivered",
    //   time: "12 Mar, 2026",
    //   rating: 4.2,
    //   reviews: 120,
    //   deliveryDate: "25/04/2020",
    //   discountedPrice: 120,
    //   originalPrice: 120,
    //   quantity: 1,
    //   image: "",
    // },
    // {
    //   id: "ORD002",
    //   product: "Wooden Coffee Table",
    //   status: "Shipped",
    //   time: "10 Mar, 2026",
    //   rating: 4.5,
    //   reviews: 85,
    //   deliveryDate: "30/04/2020",
    //   discountedPrice: 79,
    //   originalPrice: 89,
    //   quantity: 2,
    //   image: "",
    // },
    // {
    //   id: "ORD003",
    //   product: "Modern Floor Lamp",
    //   status: "Processing",
    //   time: "08 Mar, 2026",
    //   rating: 4.8,
    //   reviews: 42,
    //   deliveryDate: "02/05/2020",
    //   discountedPrice: 45,
    //   originalPrice: 45,
    //   quantity: 1,
    //   image: "",
    // },
    // {
    //   id: "ORD004",
    //   product: "Cotton Bedsheet Set",
    //   status: "Delivered",
    //   time: "05 Mar, 2026",
    //   rating: 4.0,
    //   reviews: 200,
    //   deliveryDate: "20/03/2020",
    //   discountedPrice: 29,
    //   originalPrice: 35,
    //   quantity: 3,
    //   image: "",
    // },
    // {
    //   id: "ORD005",
    //   product: "Ceramic Flower Vase",
    //   status: "Cancelled",
    //   time: "01 Mar, 2026",
    //   rating: 3.9,
    //   reviews: 15,
    //   deliveryDate: "Cancelled",
    //   discountedPrice: 25,
    //   originalPrice: 25,
    //   quantity: 1,
    //   image: "",
    // }
  ]);

  // Filter orders based on user typing in search bar
  const filteredOrders = orders.filter(
    (order) =>
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Empty orders component - Matching Wishlist empty state design
  const EmptyOrders = () => {
    const getEmptyStateImage = () => {
      return new URL("../../assets/images/empty-orders.png", import.meta.url).href;
    };

    return (
      <div className="orders-empty-container">
        <div className="orders-empty-image-wrapper">
          <img 
            src={emptyOrders} 
            alt="No Orders Vector" 
            className="orders-empty-vector" 
          />
        </div>
        <h3 className="orders-empty-heading">No orders found!</h3>
        <span 
          onClick={() => navigate("/AllProducts")} 
          className="btn orders-empty-shop-btn"
          style={{ cursor: "pointer" }}
        >
          Shop now
        </span>
      </div>
    );
  };

  return (
    <div className="orders-page-app-wrapper">
      <Navbar />
      
      <main className="orders-container container py-4 my-2">
        <h4 className="mb-4 fw-bold outfit-font page-section-title">Settings and Profile</h4>
        
        <div className="row justify-content-center">
          {/* Profile Navigation Sidebar */}
          <div className="col-lg-3 col-md-5 mb-4 sidebar-column-view wl-sidebar-sticky">
            <ProfileSideNav />
          </div>

          {/* Main Orders Dashboard */}
          <div className="col-lg-9 col-md-7 list-column-view">
            <div className="orders-card">
              
              {/* Header */}
              <div className="orders-header">
                <div>
                  <h4 className="fw-bold mb-1 outfit-font text-dark-theme">My Orders</h4>
                  <p className="orders-subtitle">View your purchase history</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="orders-search-wrapper">
                <div className="orders-search">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search your orders or IDs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Orders Grid with Scrollbar */}
              <div className="orders-list-wrapper">
                {filteredOrders.length > 0 ? (
                  <div className="orders-grid">
                    {filteredOrders.map((order, index) => (
                      <OrderCard key={`${order.id}-${index}`} order={order} />
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

      <Footer />
    </div>
  );
}

export default Orders;