import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import '../../assets/styles/OrderManagement.css';

const initialOrders = [
  { id: "SBO-BAG-20260712-001", img: "../src/assets/images/bag.png", productName: "Office Bag", customer: "Vinoth", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Delivered", category: "Bag", orderType: "Online" },
  { id: "SBO-BAG-20260712-002", img: "../src/assets/images/bag.png", productName: "Office Bag", customer: "Gokulnath", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Cash on delivery", amount: "₹1299", status: "Shipped", category: "Bag", orderType: "COD" },
  { id: "SBO-BAG-20260712-003", img: "../src/assets/images/bag.png", productName: "Office Bag", customer: "Mohan", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Completed", category: "Bag", orderType: "Online" },
  { id: "SBO-WLT-20260712-001", img: "../src/assets/images/bag.png", productName: "Leather Wallet", customer: "Arshak", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Completed", category: "Wallet", orderType: "Online" },
  { id: "SBO-BAG-20260712-004", img: "../src/assets/images/bag.png", productName: "Office Bag", customer: "Selvaraj", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Shipped", category: "Bag", orderType: "Online" },
  { id: "SBO-BAG-20260712-005", img: "../src/assets/images/bag.png", productName: "Office Bag", customer: "Ambani", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Cancelled", category: "Bag", orderType: "Online" },
  { id: "SBO-BAG-20260712-006", img: "../src/assets/images/bag.png", productName: "Office Bag", customer: "Elonmusk", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Order placed", category: "Bag", orderType: "Online" },
  { id: "SBO-BLT-20260712-001", img: "../src/assets/images/bag.png", productName: "Leather Belt", customer: "Stevejobs", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Completed", category: "Belt", orderType: "Online" },
  { id: "SBO-BAG-20260712-007", img: "../src/assets/images/bag.png", productName: "Office Bag", customer: "Anand", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Shipped", category: "Bag", orderType: "Online" },
];

function OrderManagement() {
  const navigate = useNavigate();

  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleResetFilter = () => {
    setDateFilter('');
    setCategoryFilter('');
    setOrderTypeFilter('');
    setStatusFilter('');
  };

  const filteredOrders = initialOrders.filter((order) => {
    if (dateFilter && order.date !== dateFilter) return false;
    if (categoryFilter && order.category !== categoryFilter) return false;
    if (orderTypeFilter && order.orderType !== orderTypeFilter) return false;
    if (statusFilter && order.status !== statusFilter) return false;
    return true;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered': return 'delivered';
      case 'Shipped': return 'shipped';
      case 'Completed': return 'completed';
      case 'Cancelled': return 'cancelled';
      case 'Order placed': return 'placed';
      default: return '';
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        
        <header className="admin-header">
          {/* <div className="header-search d-none d-sm-block">
            <span className="search-icon">
              <i className="bi bi-search" style={{ color: '#9ca3af', fontSize: 14 }} />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search products, orders, customers…"
            />
          </div> */}

          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              Coupons
            </h1>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "2px 0 0" }}>
              Here's what's happening with your coupons today.
            </p>
          </div>

          <div className="header-right">
            {/* Search icon mobile */}
            {/* <button className="notif-btn d-sm-none">
              <i className="bi bi-search" style={{ color: '#374151', fontSize: 18 }} />
            </button> */}

            {/* Notifications */}
            {/* <button className="notif-btn">
              <i
                className="bi bi-bell-fill"
                style={{ color: "#374151", fontSize: 18 }}
              />
              <span className="notif-badge">5</span>
            </button> */}

            {/* Profile */}
            <div className="admin-profile" onClick={() => navigate('/admin/settings')}  >
              <div className="profile-avatar">
                <i
                  className="bi bi-person-fill"
                  style={{ fontSize: 20, color: "#7c3aed" }}
                />
              </div>
              <div className="profile-info">
                <span className="profile-name">Sanjai</span>
                <span className="profile-role">Admin</span>
              </div>
            </div>
          </div>
        </header>

      
        <div className="admin-content">
          
          <div className="filter-bar">
            <button className="filter-icon-btn">
              <i className="bi bi-funnel"></i>
            </button>
            <p className="filter-label">Filter By</p>
            
            <div className="filter-divider"></div>
            
            <select className="filter-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="">Select Date</option>
              <option value="12/07/2026">12/07/2026</option>
            </select>
            
            <div className="filter-divider"></div>
            
            <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">Category</option>
              <option value="Bag">Bag</option>
              <option value="Wallet">Wallet</option>
              <option value="Belt">Belt</option>
            </select>
            
            <div className="filter-divider"></div>
            
            <select className="filter-select" value={orderTypeFilter} onChange={(e) => setOrderTypeFilter(e.target.value)}>
              <option value="">Order Type</option>
              <option value="Online">Online</option>
              <option value="COD">Cash on delivery</option>
            </select>
            
            <div className="filter-divider"></div>
            
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Order Status</option>
              <option value="Delivered">Delivered</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Order placed">Order placed</option>
            </select>
            
            <button className="reset-filter-btn" onClick={handleResetFilter}>
              <i className="bi bi-arrow-clockwise"></i> Reset Filter
            </button>
          </div>

        
          <div className="order-table-wrapper">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Customer Name</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Payment Mode</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, i) => (
                    <tr key={i} onClick={() => navigate('/admin/order-details', { state: { order } })}>
                      <td style={{ fontWeight: 500 }}>{order.id}</td>
                      <td>
                        <img src={order.img} alt={order.productName} className="order-product-img" />
                      </td>
                      <td style={{ fontWeight: 500 }}>{order.productName}</td>
                      <td>{order.customer}</td>
                      <td>
                        <div style={{ maxWidth: 200, fontSize: 12, lineHeight: 1.4 }}>
                          {order.address}
                        </div>
                      </td>
                      <td>{order.date}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {order.paymentMode === 'Online' && (
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#1a1f71', background: '#e0e7ff', padding: '2px 4px', borderRadius: 2 }}>VISA</span>
                          )}
                          <span>{order.paymentMode}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{order.amount}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">No orders found for the selected filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            
            <div className="pagination-container">
              <span className="pagination-text">Showing 1 to {filteredOrders.length} results</span>
              
              <div className="pagination-controls">
                <button className="page-btn"><i className="bi bi-chevron-left"></i></button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span style={{ color: '#6b7280', margin: '0 4px' }}>...</span>
                <button className="page-btn">5</button>
                <button className="page-btn"><i className="bi bi-chevron-right"></i></button>
              </div>
              
              <div className="rows-per-page">
                Rows per page
                <select className="rows-select">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;