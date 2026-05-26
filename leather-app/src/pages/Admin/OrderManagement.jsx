import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import '../../assets/styles/OrderManagement.css';
import { TableSkeleton } from '../../components/Admin/AdminSkeleton';

const initialOrders = [
  { id: "SBO-BAG-20260712-001", img: "../src/assets/images/bag.png", productName: "Office Bag", customer: "Vinoth", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Delivered", category: "Bag", orderType: "Online" },
  { id: "SBO-BAG-20260712-002", img: "../src/assets/images/bag.png", productName: "Office Bag", customer: "Gokulnath", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Cash on delivery", amount: "₹1299", status: "Shipped", category: "Bag", orderType: "COD" },
  { id: "SBO-BAG-20260712-003", img: "../src/assets/images/bag.png", productName: "Office Bag", customer: "Mohan", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Out for Delivery", category: "Bag", orderType: "Online" },
  { id: "SBO-WLT-20260712-001", img: "../src/assets/images/bag.png", productName: "Leather Wallet", customer: "Arshak", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Order Placed", category: "Wallet", orderType: "Online" },
  { id: "SBO-BAG-20260712-004", img: "../src/assets/images/bag.png", productName: "Office Bag", customer: "Selvaraj", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Shipped", category: "Bag", orderType: "Online" },
  { id: "SBO-BAG-20260712-005", img: "../src/assets/images/bag.png", productName: "Office Bag", customer: "Ambani", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Order Placed", category: "Bag", orderType: "Online" },
  { id: "SBO-BAG-20260712-006", img: "../src/assets/images/bag.png", productName: "Office Bag", customer: "Elonmusk", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Order Placed", category: "Bag", orderType: "Online" },
  { id: "SBO-BLT-20260712-001", img: "../src/assets/images/bag.png", productName: "Leather Belt", customer: "Stevejobs", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Out for Delivery", category: "Belt", orderType: "Online" },
  { id: "SBO-BAG-20260712-007", img: "../src/assets/images/bag.png", productName: "Office Bag", customer: "Anand", address: "4517 Washington Ave. Manchester, Kentucky 39495", date: "12/07/2026", paymentMode: "Online", amount: "₹1299", status: "Delivered", category: "Bag", orderType: "Online" },
];

function OrderManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleResetFilter = () => {
    setDateFilter('');
    setCategoryFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  const formattedDateFilter = dateFilter ? dateFilter.split('-').reverse().join('/') : '';

  const filteredOrders = initialOrders.filter((order) => {
    if (formattedDateFilter && order.date !== formattedDateFilter) return false;
    if (categoryFilter && order.category !== categoryFilter) return false;
    if (statusFilter && order.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered': return 'delivered';
      case 'Shipped': return 'shipped';
      case 'Out for Delivery': return 'out-for-delivery';
      case 'Order Placed': return 'placed';
      default: return '';
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        
        <AdminHeader title="Order Management" subtitle="Here's what's happening with your orders." />

      
        <div className="admin-content">
          {loading ? (
            <TableSkeleton rows={rowsPerPage} cols={7} />
          ) : (
            <>
          
          <div className="filter-bar">
            <button className="filter-icon-btn">
              <i className="bi bi-funnel"></i>
            </button>
            <p className="filter-label">Filter By</p>
            
            <div className="filter-divider"></div>
            
            <input 
              type="date" 
              className="filter-select" 
              style={{ paddingRight: '8px' }}
              value={dateFilter} 
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
            />
            
            <div className="filter-divider"></div>
            
            <select className="filter-select" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">Category</option>
              <option value="Bag">Bag</option>
              <option value="Wallet">Wallet</option>
              <option value="Belt">Belt</option>
            </select>
            
            <div className="filter-divider"></div>
            
            <select className="filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">Order Status</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
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
                  {/* <th>Payment Mode</th> */}
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order, i) => (
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
                      {/* <td>
                        <div className="d-flex align-items-center gap-2">
                          {order.paymentMode === 'Online' && (
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#1a1f71', background: '#e0e7ff', padding: '2px 4px', borderRadius: 2 }}>VISA</span>
                          )}
                          <span>{order.paymentMode}</span>
                        </div>
                      </td> */}
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
              <span className="pagination-text">
                Showing {filteredOrders.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, filteredOrders.length)} results
              </span>
              
              <div className="pagination-controls">
                <button className="page-btn nav" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  <i className="bi bi-chevron-left"></i>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className="page-btn nav" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
              
              <div className="rows-per-page">
                Rows per page
                <select 
                  className="rows-select"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;