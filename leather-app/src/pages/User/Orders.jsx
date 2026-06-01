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
    // Your orders data here
  ]);

  // Filter orders based on user typing in search bar
  const filteredOrders = orders.filter(
    (order) =>
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Empty orders component
  const EmptyOrders = () => {
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
    <>
      <Navbar />
      
      <div className="container py-3 my-2">
        <h4 className="mb-3 fw-bold">Settings and Profile</h4>
        
        <div className="row justify-content-center">
          {/* Profile Navigation Sidebar */}
          <div className="col-lg-4 col-md-5 mb-3 d-none d-lg-block">
            <ProfileSideNav />
          </div>

          {/* Main Orders Dashboard */}
          <div className="col-lg-8 col-md-7">
            <div className="profile-details-card">
              
              {/* Header with "View my last purchase history" */}
              <div className="orders-header-wrapper">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h4 className="fw-bold mb-1">My Orders</h4>
                    <p className="orders-purchase-history-text">View my last purchase history</p>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="orders-search-wrapper mt-3 mb-3">
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

              {/* Orders List */}
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
      </div>

      <Footer />
    </>
  );
}

export default Orders;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../../components/User/Navbar";
// import Footer from "../../components/User/Footer";
// import ProfileSideNav from "../../components/User/Profile-Side-Nav";
// import OrderCard from "../../components/User/OrderCard";
// import { FaSearch } from "react-icons/fa";
// import "../../assets/styles/Orders.css";
// import emptyOrders from "../../assets/images/empty.png";

// function Orders() {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");

//   // Premium mock orders dataset matching your database & team specs
//   const [orders] = useState([
//     // {
//     //   id: "ORD002457890KJM",
//     //   product: "2-Seater Leather Sofa",
//     //   status: "Delivered",
//     //   time: "12 Mar, 2026",
//     //   rating: 4.2,
//     //   reviews: 120,
//     //   deliveryDate: "25/04/2020",
//     //   discountedPrice: 120,
//     //   originalPrice: 120,
//     //   quantity: 1,
//     //   image: "",
//     // },
//     // {
//     //   id: "ORD002457890KJM",
//     //   product: "Leather Backpack",
//     //   status: "Delivered",
//     //   time: "12 Mar, 2026",
//     //   rating: 4.2,
//     //   reviews: 120,
//     //   deliveryDate: "25/04/2020",
//     //   discountedPrice: 120,
//     //   originalPrice: 120,
//     //   quantity: 1,
//     //   image: "",
//     // },
//     // {
//     //   id: "ORD002",
//     //   product: "Wooden Coffee Table",
//     //   status: "Shipped",
//     //   time: "10 Mar, 2026",
//     //   rating: 4.5,
//     //   reviews: 85,
//     //   deliveryDate: "30/04/2020",
//     //   discountedPrice: 79,
//     //   originalPrice: 89,
//     //   quantity: 2,
//     //   image: "",
//     // },
//     // {
//     //   id: "ORD003",
//     //   product: "Modern Floor Lamp",
//     //   status: "Processing",
//     //   time: "08 Mar, 2026",
//     //   rating: 4.8,
//     //   reviews: 42,
//     //   deliveryDate: "02/05/2020",
//     //   discountedPrice: 45,
//     //   originalPrice: 45,
//     //   quantity: 1,
//     //   image: "",
//     // },
//     // {
//     //   id: "ORD004",
//     //   product: "Cotton Bedsheet Set",
//     //   status: "Delivered",
//     //   time: "05 Mar, 2026",
//     //   rating: 4.0,
//     //   reviews: 200,
//     //   deliveryDate: "20/03/2020",
//     //   discountedPrice: 29,
//     //   originalPrice: 35,
//     //   quantity: 3,
//     //   image: "",
//     // },
//     // {
//     //   id: "ORD005",
//     //   product: "Ceramic Flower Vase",
//     //   status: "Cancelled",
//     //   time: "01 Mar, 2026",
//     //   rating: 3.9,
//     //   reviews: 15,
//     //   deliveryDate: "Cancelled",
//     //   discountedPrice: 25,
//     //   originalPrice: 25,
//     //   quantity: 1,
//     //   image: "",
//     // }
//   ]);

//   // Filter orders based on user typing in search bar
//   const filteredOrders = orders.filter(
//     (order) =>
//       order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Empty orders component - Matching SavedAddress card style
//   const EmptyOrders = () => {
//     return (
//       <div className="orders-empty-container">
//         <div className="orders-empty-image-wrapper">
//           <img 
//             src={emptyOrders} 
//             alt="No Orders Vector" 
//             className="orders-empty-vector" 
//           />
//         </div>
//         <h3 className="orders-empty-heading">No orders found!</h3>
//         <span 
//           onClick={() => navigate("/AllProducts")} 
//           className="btn orders-empty-shop-btn"
//           style={{ cursor: "pointer" }}
//         >
//           Shop now
//         </span>
//       </div>
//     );
//   };

//   return (
//     <div className="orders-page-app-wrapper">
//       <Navbar />
      
//       <main className="container py-3 my-2">
//         <h4 className="mb-3 fw-bold">Settings and Profile</h4>
        
//         <div className="row justify-content-center align-items-start">
//           {/* Profile Navigation Sidebar */}
//           <div className="col-lg-4 mb-3 d-none d-lg-block sidebar-sticky">
//             <ProfileSideNav />
//           </div>

//           {/* Main Orders Dashboard */}
//           <div className="col-lg-8 col-12">
//             <div className="orders-card">
              
//               {/* Header with consistent styling like SavedAddress */}
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h5 className="fw-bold mb-0">My Orders</h5>
//               </div>

//               {/* Search Bar */}
//               <div className="orders-search-wrapper mb-3">
//                 <div className="orders-search">
//                   <FaSearch className="search-icon" />
//                   <input
//                     type="text"
//                     className="search-input"
//                     placeholder="Search your orders or IDs"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//               </div>

//               {/* Orders List */}
//               <div className="orders-list-wrapper">
//                 {filteredOrders.length > 0 ? (
//                   <div className="orders-grid">
//                     {filteredOrders.map((order, index) => (
//                       <OrderCard key={`${order.id}-${index}`} order={order} />
//                     ))}
//                   </div>
//                 ) : (
//                   <EmptyOrders />
//                 )}
//               </div>
              
//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }

// export default Orders;