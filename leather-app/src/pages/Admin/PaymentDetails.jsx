import React, { useState, useMemo } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { FaCcVisa, FaCcMastercard, FaPaypal, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import '../../assets/styles/AdminDashboard.css';
import '../../assets/styles/PaymentDetails.css';
// import '../../assets/styles/AdminDashboard.css'

const initialData = [
  { id: "SBO-BAG-20260712-001", amount: "₹19,623.00", currency: "INR", mode: "Online Payment", method: "card", date: "Mar 23, 2022, 13:00 PM", status: "Success" },
  { id: "SBO-WLT-20260712-002", amount: "₹19,623.00", currency: "INR", mode: "Online Payment", method: "card", date: "Mar 23, 2022, 13:00 PM", status: "Success" },
  { id: "SBO-BLT-20260712-003", amount: "₹19,623.00", currency: "INR", mode: "Cash on delivery", method: "cash", date: "Mar 23, 2022, 13:00 PM", status: "Failed" },
  { id: "SBO-BAG-20260712-004", amount: "₹19,623.00", currency: "INR", mode: "Online Payment", method: "visa", date: "Mar 23, 2022, 13:00 PM", status: "Success" },
  { id: "SBO-BAG-20260712-005", amount: "₹19,623.00", currency: "INR", mode: "Online Payment", method: "mastercard", date: "Mar 23, 2022, 13:00 PM", status: "Failed" },
  { id: "SBO-WLT-20260712-006", amount: "₹19,623.00", currency: "INR", mode: "Online Payment", method: "paypal", date: "Mar 23, 2022, 13:00 PM", status: "Success" },
  { id: "SBO-BAG-20260712-007", amount: "₹19,623.00", currency: "INR", mode: "Online Payment", method: "card", date: "Mar 23, 2022, 13:00 PM", status: "Success" },
  { id: "SBO-BLT-20260712-008", amount: "₹19,623.00", currency: "INR", mode: "Cash on delivery", method: "cash", date: "Mar 23, 2022, 13:00 PM", status: "Failed" },
  { id: "SBO-BAG-20260712-009", amount: "₹19,623.00", currency: "INR", mode: "Online Payment", method: "card", date: "Mar 23, 2022, 13:00 PM", status: "Success" },
  { id: "SBO-WLT-20260712-010", amount: "₹19,623.00", currency: "INR", mode: "Online Payment", method: "card", date: "Mar 23, 2022, 13:00 PM", status: "Success" },
  { id: "SBO-BAG-20260712-011", amount: "₹19,623.00", currency: "INR", mode: "Online Payment", method: "paypal", date: "Mar 23, 2022, 13:00 PM", status: "Failed" },
  { id: "SBO-BLT-20260712-012", amount: "₹19,623.00", currency: "INR", mode: "Cash on delivery", method: "cash", date: "Mar 23, 2022, 13:00 PM", status: "Success" },
  { id: "SBO-BAG-20260712-013", amount: "₹19,623.00", currency: "INR", mode: "Online Payment", method: "visa", date: "Mar 23, 2022, 13:00 PM", status: "Success" },
  { id: "SBO-BAG-20260712-014", amount: "₹19,623.00", currency: "INR", mode: "Online Payment", method: "mastercard", date: "Mar 23, 2022, 13:00 PM", status: "Failed" },
  { id: "SBO-WLT-20260712-015", amount: "₹19,623.00", currency: "INR", mode: "Cash on delivery", method: "cash", date: "Mar 23, 2022, 13:00 PM", status: "Success" },
];

const renderMethodIcon = (method) => {
  switch (method) {
    case 'visa': return <FaCcVisa size={22} color="#1a1f71" />;
    case 'mastercard': return <FaCcMastercard size={22} color="#eb001b" />;
    case 'paypal': return <FaPaypal size={22} color="#003087" />;
    case 'cash': return <FaMoneyBillWave size={22} color="#555" />;
    case 'card':
    default: return <FaCreditCard size={22} color="#0072bc" />;
  }
};

const PaymentDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMode, setPaymentMode] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMode = paymentMode === "All" || item.mode === paymentMode;
      const matchesStatus = paymentStatus === "All" || item.status === paymentStatus;
      return matchesSearch && matchesMode && matchesStatus;
    });
  }, [searchQuery, paymentMode, paymentStatus]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main payment-details-wrapper">
       
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
              Payment Management
            </h1>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "2px 0 0" }}>
              Welcome back! Here's what's happening with your store today.
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
            <div className="admin-profile" onClick={() => navigate('/admin/settings')}>
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
       
          <div className="payment-stats-grid">
            <div className="payment-stat-card">
              <div className="payment-stat-top">
                <div className="payment-stat-info">
                  <p className="payment-stat-label">Total Order</p>
                  <p className="payment-stat-value">10293</p>
                </div>
                <div className="payment-stat-icon-wrap" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                  <i className="bi bi-box-seam" />
                </div>
              </div>
              <div className="payment-stat-trend up">
                <i className="bi bi-graph-up" />
                <span>1.3% Up from past week</span>
              </div>
            </div>

            <div className="payment-stat-card">
              <div className="payment-stat-top">
                <div className="payment-stat-info">
                  <p className="payment-stat-label">Total payment</p>
                  <p className="payment-stat-value">₹11,000</p>
                </div>
                <div className="payment-stat-icon-wrap" style={{ background: '#f3e8ff', color: '#a855f7' }}>
                  <i className="bi bi-wallet2" />
                </div>
              </div>
              <div className="payment-stat-trend up">
                <i className="bi bi-graph-up" />
                <span>10.3% Up from past week</span>
              </div>
            </div>

            <div className="payment-stat-card">
              <div className="payment-stat-top">
                <div className="payment-stat-info">
                  <p className="payment-stat-label">Successful payment</p>
                  <p className="payment-stat-value">60</p>
                </div>
                <div className="payment-stat-icon-wrap" style={{ background: '#dcfce7', color: '#10b981' }}>
                  <i className="bi bi-check-lg" style={{ fontSize: 32, fontWeight: 'bold' }} />
                </div>
              </div>
              <div className="payment-stat-trend up">
                <i className="bi bi-graph-up" />
                <span>10.3% Up from past week</span>
              </div>
            </div>

            <div className="payment-stat-card">
              <div className="payment-stat-top">
                <div className="payment-stat-info">
                  <p className="payment-stat-label">Failed Payment</p>
                  <p className="payment-stat-value">40</p>
                </div>
                <div className="payment-stat-icon-wrap" style={{ background: '#fee2e2', color: '#ef4444' }}>
                  <i className="bi bi-x" style={{ fontSize: 38, fontWeight: 'bold' }} />
                </div>
              </div>
              <div className="payment-stat-trend down">
                <i className="bi bi-graph-down" />
                <span>-20% Up from past week</span>
              </div>
            </div>
          </div>
          <div className="payment-filter-section">
            <div className="payment-filter-group search">
              <label>SEARCH</label>
              <div className="payment-search-input-wrap">
                <i className="bi bi-search" />
                <input 
                  type="text" 
                  className="payment-search-input" 
                  placeholder="Search by Order ID / Transaction ID" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="payment-filter-group">
              <label>PAYMENT MODE</label>
              <select className="payment-select" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                <option value="All">All</option>
                <option value="Online Payment">Online Payment</option>
                <option value="Cash on delivery">Cash on delivery</option>
              </select>
            </div>
            <div className="payment-filter-group">
              <label>PAYMENT STATUS</label>
              <select className="payment-select" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                <option value="All">All</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
          <div className="payment-table-container">
            <div style={{ overflowX: 'auto' }}>
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>AMOUNT</th>
                    <th>PAYMENT MODE</th>
                    <th>CREATION DATE</th>
                    <th>STATUS</th>
                    <th style={{ width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((row, index) => (
                      <tr key={index}>
                        <td style={{ color: '#6b7280' }}>{row.id}</td>
                        <td>
                          <span style={{ fontWeight: 600, color: '#374151' }}>{row.amount}</span>
                          <span style={{ color: '#9ca3af', fontSize: 12, marginLeft: 6 }}>{row.currency}</span>
                        </td>
                        <td>
                          <div className="payment-method">
                            {renderMethodIcon(row.method)}
                            <span>{row.mode}</span>
                          </div>
                        </td>
                        <td style={{ color: '#6b7280' }}>{row.date}</td>
                        <td>
                          <span className={`payment-status-badge ${row.status.toLowerCase()}`}>
                            {row.status === 'Success' && <i className="bi bi-check-circle-fill" />}
                            {row.status === 'Failed' && <i className="bi bi-dash-circle-fill" />}
                            {row.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button className="payment-more-btn">
                            <i className="bi bi-three-dots-vertical" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                        No results found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="payment-pagination">
              <div className="payment-pagination-info">
                Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, filteredData.length)} results
              </div>
              <div className="payment-pagination-controls">
                <div className="payment-page-numbers">
                  <button className="payment-page-btn nav" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <i className="bi bi-chevron-left" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i} 
                      className={`payment-page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button className="payment-page-btn nav" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <i className="bi bi-chevron-right" />
                  </button>
                </div>
                <div className="payment-rows-per-page">
                  <span>Rows per page</span>
                  <select 
                    className="payment-rows-select"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;