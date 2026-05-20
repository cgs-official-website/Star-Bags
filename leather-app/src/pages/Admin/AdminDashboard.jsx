import React, { useState } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from "recharts";
import "../../assets/styles/AdminDashboard.css";
import { useNavigate, Link } from "react-router-dom";

// Mock Data
const statCards = [
  { label: "Total Sales", value: "₹89,000", icon: "bi-graph-up-arrow", iconBg: "#dcfce7", iconColor: "#16a34a", badge: "4.3% Down from yesterday", badgeClass: "down" },
  { label: "Total Products", value: "70000", icon: "bi-bag", iconBg: "#ede9fe", iconColor: "#7c3aed", badge: "85 % Available Products", badgeClass: "up" },
  { label: "Low Stock Items", value: "20", icon: "bi-clock-history", iconBg: "#ffedd5", iconColor: "#f97316", badge: "1.8% Up from yesterday", badgeClass: "up" },
  { label: "New Customers", value: "1,342", icon: "bi-bag-dash", iconBg: "#e0e7ff", iconColor: "#4f46e5", badge: "85 % Available Products", badgeClass: "up" },
  { label: "Total Order", value: "10293", icon: "bi-boxes", iconBg: "#fef3c7", iconColor: "#d97706", badge: "1.3% Up from past week", badgeClass: "up" },
  { label: "Pending Orders", value: "10293", icon: "bi-boxes", iconBg: "#fef3c7", iconColor: "#d97706", badge: "1.3% Up from past week", badgeClass: "up" },
];

const salesData = [
  { name: "5k", revenue: 10, sales: 5 },
  { name: "10k", revenue: 35, sales: 15 },
  { name: "15k", revenue: 20, sales: 10 },
  { name: "20k", revenue: 18, sales: 12 },
  { name: "25k", revenue: 22, sales: 30 },
  { name: "30k", revenue: 25, sales: 15 },
  { name: "35k", revenue: 40, sales: 65 },
  { name: "40k", revenue: 25, sales: 35 },
  { name: "45k", revenue: 35, sales: 25 },
  { name: "50k", revenue: 20, sales: 15 },
  { name: "55k", revenue: 55, sales: 35 },
  { name: "60k", revenue: 20, sales: 5 },
];

const topSellingData = [
  { img: "../src/assets/images/bag.png", name: "Leather Duffel Bag", category: "Bags", sold: 248, revenue: "₹25,000", status: "In stock", statusColor: "#16a34a", statusBg: "#dcfce7" },
  { img: "../src/assets/images/wallet.png", name: "Classic Leather Wallet", category: "Wallets", sold: 100, revenue: "₹20,000", status: "Low inventory", statusColor: "#d97706", statusBg: "#fef3c7" },
  { img: "../src/assets/images/bag.png", name: "Crossbody Saddle Bag", category: "Bags", sold: 119, revenue: "₹18,055", status: "In stock", statusColor: "#16a34a", statusBg: "#dcfce7" },
  { img: "../src/assets/images/wallet.png", name: "Premium Leather Wallet", category: "Wallets", sold: 25, revenue: "₹5,000", status: "Out of stock", statusColor: "#ef4444", statusBg: "#fee2e2" },
];

const lowStockData = [
  { img: "../src/assets/images/wallet.png", name: "Leather Wallet Classic", left: 2 },
  { img: "../src/assets/images/wallet.png", name: "Leather Wallet Classic", left: 2 },
  { img: "../src/assets/images/wallet.png", name: "Leather Wallet Classic", left: 2 },
  { img: "../src/assets/images/bag.png", name: "Brown Duffel Bag", left: 2 },
  { img: "../src/assets/images/bag.png", name: "Leather Sling Bag", left: 2 },
  { img: "../src/assets/images/bag.png", name: "Leather Sling Bag", left: 2 },
];

const orderStatusPie = [
  { name: 'Delivered', value: 45643, color: '#a3e635' }, // green-ish
  { name: 'Shipped', value: 45643, color: '#a78bfa' }, // purple-ish
  { name: 'Pending', value: 45643, color: '#fdba74' }, // orange-ish
];

const todayOrderData = [
  { img: "../src/assets/images/wallet.png", name: "Wallet", orderId: "SBO-WLT-20260712-001", total: 255, brand: "-", price: "₹1255" },
  { img: "../src/assets/images/bag.png", name: "Leather Sling Bag", orderId: "SBO-BAG-20260712-002", total: 255, brand: "American Tourister", price: "₹1255" },
  { img: "../src/assets/images/bag.png", name: "Leather Sling Bag", orderId: "SBO-BAG-20260712-003", total: 255, brand: "American Tourister", price: "₹1255" },
  { img: "../src/assets/images/bag.png", name: "Hand bag", orderId: "SBO-BAG-20260712-004", total: 255, brand: "Puma", price: "₹1255" },
  { img: "../src/assets/images/bag.png", name: "Side motion bag", orderId: "SBO-BAG-20260712-005", total: 255, brand: "American Tourister", price: "₹1255" },
  { img: "../src/assets/images/bag.png", name: "Trolley bag", orderId: "SBO-BAG-20260712-006", total: 255, brand: "American Tourister", price: "₹1255" },
];

const transactionsData = [
  { id: "SBO-WLT-20260712-001", img: "../src/assets/images/bag.png", category: "Leather Wallet", payMode: "Visa card **** 4931", payType: "Card payment", amount: "$182.94", date: "Jan 17, 2022", status: "Completed", statusColor: "#16a34a", statusBg: "#dcfce7" },
  { id: "SBO-WLT-20260712-002", img: "../src/assets/images/bag.png", category: "Leather Wallet", payMode: "Mastercard **** 5442", payType: "Card payment", amount: "$99.00", date: "Jan 17, 2022", status: "Completed", statusColor: "#16a34a", statusBg: "#dcfce7" },
  { id: "SBO-WLT-20260712-003", img: "../src/assets/images/bag.png", category: "Leather Wallet", payMode: "Account ****882", payType: "Bank payment", amount: "$249.94", date: "Jan 17, 2022", status: "Pending", statusColor: "#d97706", statusBg: "#fef3c7" },
  { id: "SBO-WLT-20260712-004", img: "../src/assets/images/bag.png", category: "Leather Wallet", payMode: "Amex card **** 5666", payType: "Card payment", amount: "$199.24", date: "Jan 17, 2022", status: "Canceled", statusColor: "#ef4444", statusBg: "#fee2e2" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          {/* <div className="header-search d-none d-sm-block">
            <span className="search-icon"> <i className="bi bi-search" style={{ color: '#9ca3af', fontSize: 14 }} /> </span>
            <input type="text" className="search-input" placeholder="Search products, orders, customers…" />
          </div> */}

          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0, }}>Banner Management</h1>
            {/* <p style={{ fontSize: 13, color: "#6b7280", margin: "2px 0 0" }}>Here's what's happening with your banners today.</p> */}
          </div>

          <div className="header-right">
            {/* Search icon mobile */}
            {/* <button className="notif-btn d-sm-none">
              <i className="bi bi-search" style={{ color: '#374151', fontSize: 18 }} />
            </button> */}

            {/* Notifications */}
            {/* <button className="notif-btn">
              <i className="bi bi-bell-fill" style={{ color: "#374151", fontSize: 18 }} /> <span className="notif-badge">5</span>
            </button> */}

            {/* Profile */}
            <div className="admin-profile" onClick={() => navigate('/admin/settings')}>
              <div className="profile-avatar">
                <i className="bi bi-person-fill" style={{ fontSize: 20, color: "#7c3aed" }} />
              </div>
              <div className="profile-info">
                <span className="profile-name">Sanjai</span>
                <span className="profile-role">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content" style={{ background: '#fafafa' }}>
          
          <div className="stats-grid mb-4">
            {statCards.map((card, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-card-top d-flex justify-content-between align-items-start">
                  <div className="stat-card-info">
                    <p className="stat-label">{card.label}</p>
                    <p className="stat-value">{card.value}</p>
                  </div>
                  <div className="stat-icon" style={{ background: card.iconBg, color: card.iconColor }}>
                    <i className={card.icon} style={{ fontSize: '20px' }}/>
                  </div>
                </div>
                <div className={`stat-badge ${card.badgeClass === 'up' ? 'text-success' : 'text-danger'}`} style={{ fontSize: '13px', fontWeight: 500, marginTop: '8px' }}>
                  <i className={`bi ${card.badgeClass === 'up' ? 'bi-graph-up' : 'bi-graph-down'} me-1`} />
                  {card.badge}
                </div>
              </div>
            ))}
          </div>

         
          <div className="chart-section mb-4 bg-white p-4 rounded-3 border">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="m-0 fw-bold">Revenue</h5>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-1"><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#c4b5fd' }}></span> <small>Revenue</small></div>
                <div className="d-flex align-items-center gap-1"><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fdba74' }}></span> <small>Sales</small></div>
                <select className="form-select form-select-sm ms-2" style={{ width: '100px', fontSize: '13px' }}>
                  <option>October</option>
                  <option>November</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c4b5fd" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#c4b5fd" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fdba74" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#fdba74" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val) => val + " Week"} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#a78bfa" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="sales" stroke="#fb923c" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

       
          <div className="row g-4 mb-4">
           
            <div className="col-lg-8">
              <div className="bg-white p-4 rounded-3 border h-100">
                <h5 className="fw-bold mb-4">Top selling products</h5>
                <div className="table-responsive">
                  <table className="table align-middle border-bottom-0 custom-table">
                    <thead className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                      <tr>
                        <th>Product Detail</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Revenue</th>
                        <th>Stock Status</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '13px', fontWeight: 500 }}>
                      {topSellingData.map((item, i) => (
                        <tr key={i}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img src={item.img} alt={item.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', background: '#f3f4f6' }} />
                              <span>{item.name}</span>
                            </div>
                          </td>
                          <td>{item.category}</td>
                          <td>{item.sold}</td>
                          <td>{item.revenue}</td>
                          <td>
                            <span style={{ color: item.statusColor, background: item.statusBg, padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>
                              <i className={`bi ${item.status === 'Out of stock' ? 'bi-x' : item.status === 'Low inventory' ? 'bi-dash' : 'bi-plus'} me-1`} />
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          
            <div className="col-lg-4">
              <div className="bg-white p-4 rounded-3 border h-100">
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <h6 className="fw-bold m-0">Low stock alerts</h6>
                  <Link to="/admin/product-management" className="text-decoration-none" style={{ color: '#6366f1', fontSize: '13px' }}>View all &rarr;</Link>
                </div>
                <p className="text-muted" style={{ fontSize: '12px', marginBottom: '20px' }}>Products requiring attention</p>
                <div className="d-flex flex-column gap-3">
                  {lowStockData.map((item, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center border-bottom pb-2">
                      <div className="d-flex align-items-center gap-2">
                        <img src={item.img} alt={item.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', background: '#f3f4f6' }} />
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.name}</span>
                      </div>
                      <span className="text-danger" style={{ fontSize: '12px', fontWeight: 500 }}>Only {item.left} left</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        
          <div className="row g-4 mb-4">
          
            <div className="col-lg-4">
              <div className="bg-white p-4 rounded-3 border h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold m-0">Order Status</h5>
                  <select className="form-select form-select-sm" style={{ width: 'auto', fontSize: '13px' }}>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Year</option>
                  </select>
                </div>
                <div className="position-relative d-flex justify-content-center my-4">
                  <PieChart width={200} height={200}>
                    <Pie data={orderStatusPie} cx={100} cy={100} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                      {orderStatusPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <h5 className="m-0 fw-bold">10,956</h5>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Total orders</span>
                  </div>
                </div>
                <div className="d-flex flex-column gap-3 mt-4">
                  {orderStatusPie.map((item, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center" style={{ fontSize: '13px', fontWeight: 500 }}>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ width: 10, height: 10, background: item.color }}></span>
                        {item.name}
                      </div>
                      <span>{item.value} <span className="text-muted">({item.name === 'Delivered' ? '62%' : '37%'})</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

           
            <div className="col-lg-8">
              <div className="bg-white p-4 rounded-3 border h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold m-0">Today Order</h5>
                  <Link to="/admin/order-management" className="text-decoration-none" style={{ color: '#6366f1', fontSize: '13px' }}>View all &rarr;</Link>
                </div>
                <div className="table-responsive">
                  <table className="table align-middle border-bottom-0 custom-table">
                    <thead className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                      <tr>
                        <th>Order ID</th>
                        <th>Product Name</th>
                        <th>Order ID</th>
                        <th>Total order</th>
                        <th>Brand</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '13px', fontWeight: 500 }}>
                      {todayOrderData.map((item, i) => (
                        <tr key={i}>
                          <td>
                            <img src={item.img} alt="img" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', background: '#f3f4f6' }} />
                          </td>
                          <td>{item.name}</td>
                          <td>{item.orderId}</td>
                          <td>{item.total}</td>
                          <td>{item.brand}</td>
                          <td>{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          
          <div className="bg-white p-4 rounded-3 border mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold m-0">Transactions</h5>
              <Link to="/admin/payment-details" className="text-decoration-none" style={{ color: '#6366f1', fontSize: '13px' }}>See All Transactions &gt;</Link>
            </div>
            <div className="table-responsive">
              <table className="table align-middle border-bottom-0 custom-table">
                <thead className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                  <tr>
                    <th>Product ID</th>
                    <th>Image</th>
                    <th>Category</th>
                    <th>Payment mode</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '13px', fontWeight: 500 }}>
                  {transactionsData.map((item, i) => (
                    <tr key={i}>
                      <td>{item.id}</td>
                      <td>
                        <img src={item.img} alt="img" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', background: '#f3f4f6' }} />
                      </td>
                      <td>{item.category}</td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="fw-bold">{item.payMode}</span>
                          <span className="text-muted" style={{ fontSize: '11px' }}>{item.payType}</span>
                        </div>
                      </td>
                      <td>{item.amount}</td>
                      <td>{item.date}</td>
                      <td>
                        <span style={{ color: item.statusColor, background: item.statusBg, padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>
                          <i className={`bi ${item.status === 'Completed' ? 'bi-circle-fill' : item.status === 'Pending' ? 'bi-circle-fill' : 'bi-circle-fill'} me-1`} style={{ fontSize: '8px' }} />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
