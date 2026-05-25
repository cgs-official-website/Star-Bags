import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import OrderCard from "../../components/User/OrderCard";
import { FaSearch } from "react-icons/fa";
import "../../assets/styles/Orders.css";

function Orders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Premium mock orders dataset matching your database & team specs
  const [orders] = useState([
    {
      id: "ORD002457890KJM",
      product: "2-Seater Leather Sofa",
      status: "Delivered",
      time: "12 Mar, 2026",
      rating: 4.2,
      reviews: 120,
      deliveryDate: "25/04/2020",
      discountedPrice: 120,
      originalPrice: 120,
      quantity: 1,
      image: "",
    },
    {
      id: "ORD002457890KJM",
      product: "Leather Backpack",
      status: "Delivered",
      time: "12 Mar, 2026",
      rating: 4.2,
      reviews: 120,
      deliveryDate: "25/04/2020",
      discountedPrice: 120,
      originalPrice: 120,
      quantity: 1,
      image: "",
    },
    {
      id: "ORD002",
      product: "Wooden Coffee Table",
      status: "Shipped",
      time: "10 Mar, 2026",
      rating: 4.5,
      reviews: 85,
      deliveryDate: "30/04/2020",
      discountedPrice: 79,
      originalPrice: 89,
      quantity: 2,
      image: "",
    },
    {
      id: "ORD003",
      product: "Modern Floor Lamp",
      status: "Processing",
      time: "08 Mar, 2026",
      rating: 4.8,
      reviews: 42,
      deliveryDate: "02/05/2020",
      discountedPrice: 45,
      originalPrice: 45,
      quantity: 1,
      image: "",
    },
    {
      id: "ORD004",
      product: "Cotton Bedsheet Set",
      status: "Delivered",
      time: "05 Mar, 2026",
      rating: 4.0,
      reviews: 200,
      deliveryDate: "20/03/2020",
      discountedPrice: 29,
      originalPrice: 35,
      quantity: 3,
      image: "",
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
      image: "",
    }
  ]);

  // Filter orders based on user typing in search bar
  const filteredOrders = orders.filter(
    (order) =>
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Empty orders component
  const EmptyOrders = () => {
    const getEmptyStateImage = () => {
      return new URL("../../assets/images/empty-orders.png", import.meta.url).href;
    };

    return (
      <div className="orders-empty-container">
        <div className="orders-empty-image-wrapper">
          <img 
            src={getEmptyStateImage()} 
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


// // import React, { useState } from "react";
// // import Navbar from "../../components/User/Navbar";
// // import Footer from "../../components/User/Footer";
// // import ProfileSideNav from "../../components/User/ProfileSideNav";
// // import OrderCard from "../../components/User/OrderCard";
// // import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// // import "../../assets/styles/Orders.css";
// import React, { useState } from "react";
// import Navbar from "../../components/User/Navbar";
// import Footer from "../../components/User/Footer";
// import ProfileSideNav from "../../components/User/Profile-Side-Nav";
// import OrderCard from "../../components/User/OrderCard";
// import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import "../../assets/styles/Orders.css";


// /**
//  * Orders Page Component
//  * Main page that integrates sidebar and lists of custom orders dynamically.
//  * Features keyword product filtering and active pagination selectors.
//  */
// function Orders() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const ordersPerPage = 3;

//   // Premium mock orders dataset matching your database & team specs
//   const [orders] = useState([
//     {
//       id: "ORD002457890KJM",
//       product: "2-Seater Leather Sofa",
//       status: "Delivered",
//       time: "12 Mar, 2026",
//       rating: 4.2,
//       reviews: 120,
//       deliveryDate: "25/04/2020",
//       discountedPrice: 120,
//       originalPrice: 120,
//       quantity: 1,
//       image: "", // Automatically maps to a beautiful leather sofa image
//     },
//     {
//       id: "ORD002457890KJM",
//       product: "Leather Backpack",
//       status: "Delivered",
//       time: "12 Mar, 2026",
//       rating: 4.2,
//       reviews: 120,
//       deliveryDate: "25/04/2020",
//       discountedPrice: 120,
//       originalPrice: 120,
//       quantity: 1,
//       image: "", // Automatically maps to a beautiful leather backpack image
//     },
//     {
//       id: "ORD002",
//       product: "Wooden Coffee Table",
//       status: "Shipped",
//       time: "10 Mar, 2026",
//       rating: 4.5,
//       reviews: 85,
//       deliveryDate: "30/04/2020",
//       discountedPrice: 79,
//       originalPrice: 89,
//       quantity: 2,
//       image: "",
//     },
//     {
//       id: "ORD003",
//       product: "Modern Floor Lamp",
//       status: "Processing",
//       time: "08 Mar, 2026",
//       rating: 4.8,
//       reviews: 42,
//       deliveryDate: "02/05/2020",
//       discountedPrice: 45,
//       originalPrice: 45,
//       quantity: 1,
//       image: "",
//     },
//     {
//       id: "ORD004",
//       product: "Cotton Bedsheet Set",
//       status: "Delivered",
//       time: "05 Mar, 2026",
//       rating: 4.0,
//       reviews: 200,
//       deliveryDate: "20/03/2020",
//       discountedPrice: 29,
//       originalPrice: 35,
//       quantity: 3,
//       image: "",
//     },
//     {
//       id: "ORD005",
//       product: "Ceramic Flower Vase",
//       status: "Cancelled",
//       time: "01 Mar, 2026",
//       rating: 3.9,
//       reviews: 15,
//       deliveryDate: "Cancelled",
//       discountedPrice: 25,
//       originalPrice: 25,
//       quantity: 1,
//       image: "",
//     }
//   ]);

//   // Filter orders based on user typing in search bar
//   const filteredOrders = orders.filter(
//     (order) =>
//       order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination logic (displaying 3 elements per page)
//   const indexOfLastOrder = currentPage * ordersPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//   const currentOrders = filteredOrders.slice(
//     indexOfFirstOrder,
//     indexOfLastOrder
//   );
//   const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     // Smooth scroll back to top of the orders list on mobile
//     const wrapper = document.querySelector('.orders-list');
//     if (wrapper) {
//       wrapper.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   return (
//     <div className="orders-page-app-wrapper">
//       <Navbar />
      
//       <main className="orders-container container py-4 my-2">
//         <h4 className="mb-4 fw-bold outfit-font page-section-title">Settings and Profile</h4>
        
//         <div className="row justify-content-center">
//           {/* Teammate Profile Navigation Sidebar */}
//           <div className="col-lg-4 col-md-5 mb-4 sidebar-column-view">
//             <ProfileSideNav />
//           </div>

//           {/* Main Orders Dashboard List */}
//           <div className="col-lg-8 col-md-7 list-column-view">
//             <div className="orders-card">
              
//               {/* Dashboard Row Header */}
//               <div className="orders-header">
//                 <div>
//                   <h4 className="fw-bold mb-1 outfit-font text-dark-theme">My Orders</h4>
//                   <p className="orders-subtitle">View my Last Purchase History</p>
//                 </div>
//               </div>

//               {/* Dynamic Round Search Bar */}
//               <div className="orders-search-wrapper">
//                 <div className="orders-search">
//                   <FaSearch className="search-icon" />
//                   <input
//                     type="text"
//                     className="search-input"
//                     placeholder="Search your orders or IDs"
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       setCurrentPage(1); // Reset back to first page during active filtering
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Dynamic Map of OrderCards */}
//               <div className="orders-list">
//                 {currentOrders.length > 0 ? (
//                   currentOrders.map((order, index) => (
//                     <OrderCard key={`${order.id}-${index}`} order={order} />
//                   ))
//                 ) : (
//                   <div className="no-orders py-5 text-center">
//                     <p className="text-muted">No orders found matching your search.</p>
//                   </div>
//                 )}
//               </div>

//               {/* Modern Pagination Rows */}
//               {totalPages > 1 && (
//                 <div className="pagination-wrapper mt-4">
//                   <button
//                     className="pagination-btn"
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                   >
//                     <FaChevronLeft size={10} />
//                   </button>
                  
//                   {[...Array(totalPages)].map((_, idx) => (
//                     <button
//                       key={idx}
//                       className={`pagination-number ${
//                         currentPage === idx + 1 ? "active" : ""
//                       }`}
//                       onClick={() => handlePageChange(idx + 1)}
//                     >
//                       {idx + 1}
//                     </button>
//                   ))}
                  
//                   <button
//                     className="pagination-btn"
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                   >
//                     <FaChevronRight size={10} />
//                   </button>
//                 </div>
//               )}
              
//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }

// export default Orders;


// import React, { useState } from "react";
// import Navbar from "../../components/User/Navbar";
// import Footer from "../../components/User/Footer";
// import ProfileSideNav from "../../components/User/Profile-Side-Nav";
// import OrderCard from "../../components/User/OrderCard";
// import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import "../../assets/styles/Orders.css";

// function Orders() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const ordersPerPage = 3;

//   // Sample orders data
//   const [orders] = useState([
//     {
//       id: "ORD001",
//       product: "2-Seater Leather Sofa",
//       status: "Delivered",
//       time: "12 Mar, 2026",
//       rating: 4.2,
//       reviews: 120,
//       deliveryDate: "25/04/2020",
//       discountedPrice: 120,
//       originalPrice: 150,
//       quantity: 1,
//       image: "https://via.placeholder.com/80x60?text=Sofa",
//     },
//     {
//       id: "ORD002",
//       product: "Wooden Coffee Table",
//       status: "Shipped",
//       time: "10 Mar, 2026",
//       rating: 4.5,
//       reviews: 85,
//       deliveryDate: "Expected by 30/04/2020",
//       discountedPrice: 79,
//       originalPrice: 89,
//       quantity: 2,
//       image: "https://via.placeholder.com/80x60?text=Table",
//     },
//     {
//       id: "ORD003",
//       product: "Modern Floor Lamp",
//       status: "Processing",
//       time: "08 Mar, 2026",
//       rating: 4.8,
//       reviews: 42,
//       deliveryDate: "Expected by 02/05/2020",
//       discountedPrice: 45,
//       originalPrice: 45,
//       quantity: 1,
//       image: "https://via.placeholder.com/80x60?text=Lamp",
//     },
//     {
//       id: "ORD004",
//       product: "Cotton Bedsheet Set",
//       status: "Delivered",
//       time: "05 Mar, 2026",
//       rating: 4.0,
//       reviews: 200,
//       deliveryDate: "Delivered on 20/03/2020",
//       discountedPrice: 29,
//       originalPrice: 35,
//       quantity: 3,
//       image: "https://via.placeholder.com/80x60?text=Bedsheet",
//     },
//     {
//       id: "ORD005",
//       product: "Ceramic Flower Vase",
//       status: "Cancelled",
//       time: "01 Mar, 2026",
//       rating: 3.9,
//       reviews: 15,
//       deliveryDate: "Cancelled",
//       discountedPrice: 25,
//       originalPrice: 25,
//       quantity: 1,
//       image: "https://via.placeholder.com/80x60?text=Vase",
//     },
//   ]);

//   // Filter orders based on search
//   const filteredOrders = orders.filter(
//     (order) =>
//       order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination logic
//   const indexOfLastOrder = currentPage * ordersPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//   const currentOrders = filteredOrders.slice(
//     indexOfFirstOrder,
//     indexOfLastOrder
//   );
//   const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="orders-container container py-3 my-2">
//         <h4 className="mb-3 fw-bold">Settings and Profile</h4>
//         <div className="row justify-content-center">
//           {/* Sidebar */}
//           <div className="col-lg-4 col-md-5 mb-3 d-none d-lg-block">
//             <ProfileSideNav />
//           </div>

//           {/* Main Content - My Orders */}
//           <div className="col-lg-8 col-md-7">
//             <div className="orders-card">
//               <div className="orders-header">
//                 <div>
//                   <h4 className="fw-bold mb-0">My Orders</h4>
//                   <p className="orders-subtitle">View my Last Purchase History</p>
//                 </div>
//               </div>

//               {/* Search Bar */}
//               <div className="orders-search-wrapper">
//                 <div className="orders-search">
//                   <FaSearch className="search-icon" />
//                   <input
//                     type="text"
//                     className="search-input"
//                     placeholder="Search your products"
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       setCurrentPage(1);
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Orders List */}
//               <div className="orders-list">
//                 {currentOrders.length > 0 ? (
//                   currentOrders.map((order) => (
//                     <OrderCard key={order.id} order={order} />
//                   ))
//                 ) : (
//                   <div className="no-orders">
//                     <p>No orders found matching your search.</p>
//                   </div>
//                 )}
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="pagination-wrapper">
//                   <button
//                     className="pagination-btn"
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                   >
//                     <FaChevronLeft />
//                   </button>
//                   {[...Array(totalPages)].map((_, idx) => (
//                     <button
//                       key={idx}
//                       className={`pagination-number ${
//                         currentPage === idx + 1 ? "active" : ""
//                       }`}
//                       onClick={() => handlePageChange(idx + 1)}
//                     >
//                       {idx + 1}
//                     </button>
//                   ))}
//                   <button
//                     className="pagination-btn"
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                   >
//                     <FaChevronRight />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }

// export default Orders;