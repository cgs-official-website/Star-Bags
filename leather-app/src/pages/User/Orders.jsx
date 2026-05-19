import React, { useState } from "react";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import OrderCard from "../../components/User/OrderCard";
import SortBySelect from "../../components/User/SortBySelect"; // ✅ Import SortBySelect
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../../assets/styles/Orders.css";

function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState(""); // ✅ New state for sorting
  const ordersPerPage = 3;

  // Sample orders data
  const [orders] = useState([
    {
      id: "ORD001",
      product: "2-Seater Leather Sofa",
      status: "Delivered",
      time: "12 Mar, 2026",
      rating: 4.2,
      reviews: 120,
      deliveryDate: "25/04/2020",
      discountedPrice: 120,
      originalPrice: 150,
      quantity: 1,
      image: "https://via.placeholder.com/80x60?text=Sofa",
    },
    {
      id: "ORD002",
      product: "Wooden Coffee Table",
      status: "Shipped",
      time: "10 Mar, 2026",
      rating: 4.5,
      reviews: 85,
      deliveryDate: "Expected by 30/04/2020",
      discountedPrice: 79,
      originalPrice: 89,
      quantity: 2,
      image: "https://via.placeholder.com/80x60?text=Table",
    },
    {
      id: "ORD003",
      product: "Modern Floor Lamp",
      status: "Processing",
      time: "08 Mar, 2026",
      rating: 4.8,
      reviews: 42,
      deliveryDate: "Expected by 02/05/2020",
      discountedPrice: 45,
      originalPrice: 45,
      quantity: 1,
      image: "https://via.placeholder.com/80x60?text=Lamp",
    },
    {
      id: "ORD004",
      product: "Cotton Bedsheet Set",
      status: "Delivered",
      time: "05 Mar, 2026",
      rating: 4.0,
      reviews: 200,
      deliveryDate: "Delivered on 20/03/2020",
      discountedPrice: 29,
      originalPrice: 35,
      quantity: 3,
      image: "https://via.placeholder.com/80x60?text=Bedsheet",
    },
    {
      id: "ORD005",
      product: "Ceramic Flower Vase",
      status: "Cancelled",
      time: "01 Mar, 2026",
      rating: 3.9,
      reviews: 15,
      deliveryDate: "Cancelled",
      discountedPrice: 25,
      originalPrice: 25,
      quantity: 1,
      image: "https://via.placeholder.com/80x60?text=Vase",
    },
  ]);

  // Filter orders based on search
  let filteredOrders = orders.filter(
    (order) =>
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Apply sorting before pagination
  if (sortOption === "price-low") {
    filteredOrders = [...filteredOrders].sort(
      (a, b) => a.discountedPrice - b.discountedPrice
    );
  } else if (sortOption === "price-high") {
    filteredOrders = [...filteredOrders].sort(
      (a, b) => b.discountedPrice - a.discountedPrice
    );
  }

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Navbar />
      <div className="orders-container container py-3 my-2">
        <h4 className="mb-3 fw-bold">Settings and Profile</h4>
        <div className="row justify-content-center">
          {/* Sidebar */}
          <div className="col-lg-4 col-md-5 mb-3 d-none d-lg-block">
            <ProfileSideNav />
          </div>

          {/* Main Content - My Orders */}
          <div className="col-lg-8 col-md-7">
            <div className="orders-card">
              <div className="orders-header d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold mb-0">My Orders</h4>
                  <p className="orders-subtitle">View my Last Purchase History</p>
                </div>
                {/* ✅ SortBySelect added */}
                <SortBySelect value={sortOption} onChange={setSortOption} />
              </div>

              {/* Search Bar */}
              <div className="orders-search-wrapper">
                <div className="orders-search">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search your products"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              {/* Orders List */}
              <div className="orders-list">
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <div className="no-orders">
                    <p>No orders found matching your search.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft />
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      className={`pagination-number ${
                        currentPage === idx + 1 ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Orders;
