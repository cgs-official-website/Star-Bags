import React, { useState, useMemo } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { FaCcVisa, FaCcMastercard, FaPaypal, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { FiRefreshCw, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import '../../assets/styles/AdminDashboard.css';
import '../../assets/styles/PaymentDetails.css';
import AdminHeader from '../../components/Admin/AdminHeader';
import PaymentPopup from '../../components/Admin/PaymentPopup';
import { CardSkeleton, TableSkeleton } from '../../components/Admin/AdminSkeleton';

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
    case 'cash': return <FaMoneyBillWave size={22} color="#8B5CF6" />;
    case 'card':
    default: return <FaCreditCard size={22} color="#0072bc" />;
  }
};

const PaymentDetails = () => {
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMode, setPaymentMode] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const popupDetails = selectedPayment ? {
    amount: selectedPayment.amount,
    transactionId: selectedPayment.id,
    paymentMethod: {
      visa: "Visa",
      mastercard: "Mastercard",
      paypal: "PayPal",
      cash: "Cash on delivery",
      card: "Credit card"
    }[selectedPayment.method] || "Credit card",
    date: selectedPayment.date.split(', ').slice(0, 2).join(', '),
    time: selectedPayment.date.split(', ')[2] || "12:00 PM",
    merchant: "Star Bags"
  } : {};

  const popupStatus = selectedPayment && selectedPayment.status === 'Success' ? 'success' : 'failed';

  const handleResetFilter = () => {
    setSearchQuery("");
    setPaymentMode("All");
    setPaymentStatus("All");
    setCurrentPage(1);
  };

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
       
       <AdminHeader title="Payment Management" subtitle="Manage your payments."  />

        <div className="admin-content">
          {loading ? (
            <>
              <CardSkeleton count={3} />
              <TableSkeleton rows={rowsPerPage} cols={6} />
            </>
          ) : (
            <>
          <div className="payment-stats-grid">
            <div className="payment-stat-card">
              <div className="payment-stat-top">
                <div className="payment-stat-info">
                  <p className="payment-stat-label">Total payment</p>
                  <p className="payment-stat-value">₹ 11,000</p>
                </div>
                <div className="payment-stat-icon-wrap" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                  <i className="bi bi-wallet2" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div className="payment-stat-trend">
                <FiArrowUpRight style={{ fontSize: '16px' }} />
                <span>+10.3% Up from past week</span>
              </div>
            </div>

            <div className="payment-stat-card">
              <div className="payment-stat-top">
                <div className="payment-stat-info">
                  <p className="payment-stat-label">Cash on delivery</p>
                  <p className="payment-stat-value">₹ 22,000</p>
                </div>
                <div className="payment-stat-icon-wrap" style={{ background: '#dcfce7', color: '#16a34a' }}>
                  <i className="bi bi-cash-coin" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div className="payment-stat-trend">
                <FiArrowUpRight style={{ fontSize: '16px' }} />
                <span>1.3% Up from past week</span>
              </div>
            </div>

            <div className="payment-stat-card">
              <div className="payment-stat-top">
                <div className="payment-stat-info">
                  <p className="payment-stat-label">Online payment</p>
                  <p className="payment-stat-value">₹ 10,000</p>
                </div>
                <div className="payment-stat-icon-wrap" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
                  <i className="bi bi-credit-card" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div className="payment-stat-trend">
                <FiArrowUpRight style={{ fontSize: '16px' }} />
                <span>+10.3% Up from past week</span>
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
            <button className="payment-reset-btn" onClick={handleResetFilter}>
              <FiRefreshCw /> Reset Filter
            </button>
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
                          <button 
                            className="payment-more-btn"
                            onClick={() => {
                              setSelectedPayment(row);
                              setShowPopup(true);
                            }}
                          >
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
            </>
          )}
        </div>
      </div>

      <PaymentPopup 
        isOpen={showPopup}
        status={popupStatus}
        details={popupDetails}
        onClose={() => setShowPopup(false)}
        onDownloadReceipt={() => alert("Downloading receipt PDF...")}
      />
    </div>
  );
};

export default PaymentDetails;