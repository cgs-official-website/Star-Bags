import React, { useState } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from "recharts";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal, FaMoneyBillWave, FaCreditCard, FaUniversity } from "react-icons/fa";
import "../../assets/styles/AdminDashboard.css";
import { useNavigate, Link } from "react-router-dom";
import AdminHeader from "../../components/Admin/AdminHeader";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

const renderPayModeIcon = (payMode) => {
  const modeLower = payMode.toLowerCase();
  if (modeLower.includes('visa')) {
    return <FaCcVisa size={22} color="#1a1f71" />;
  } else if (modeLower.includes('mastercard')) {
    return <FaCcMastercard size={22} color="#eb001b" />;
  } else if (modeLower.includes('amex')) {
    return <FaCcAmex size={22} color="#006fcf" />;
  } else if (modeLower.includes('account') || modeLower.includes('bank')) {
    return <FaUniversity size={20} color="#8b5cf6" />;
  } else if (modeLower.includes('paypal')) {
    return <FaPaypal size={22} color="#003087" />;
  } else {
    return <FaCreditCard size={22} color="#0072bc" />;
  }
};

// Mock Data
const statCards = [
  { label: "Total Sales", value: "₹89,000", icon: "bi-graph-up-arrow", iconBg: "#dcfce7", iconColor: "#16a34a", badge: "4.3% Down from yesterday", badgeClass: "down" },
  { label: "Total Products", value: "70000", icon: "bi-bag", iconBg: "#ede9fe", iconColor: "#7c3aed", badge: "85 % Available Products", badgeClass: "up" },
  { label: "Low Stock Items", value: "20", icon: "bi-clock-history", iconBg: "#ffedd5", iconColor: "#f97316", badge: "1.8% Up from yesterday", badgeClass: "up" },
  { label: "New Customers", value: "1,342", icon: "bi-bag-dash", iconBg: "#e0e7ff", iconColor: "#4f46e5", badge: "85 % Available Products", badgeClass: "up" },
  { label: "Total Order", value: "10293", icon: "bi-boxes", iconBg: "#fef3c7", iconColor: "#d97706", badge: "1.3% Up from past week", badgeClass: "up" },
  { label: "Pending Orders", value: "10293", icon: "bi-boxes", iconBg: "#fef3c7", iconColor: "#d97706", badge: "1.3% Up from past week", badgeClass: "up" },
];

const revenueDataWeek = [
  { name: "Mon", revenue: 10 },
  { name: "Tue", revenue: 35 },
  { name: "Wed", revenue: 25 },
  { name: "Thu", revenue: 15 },
  { name: "Fri", revenue: 35 },
  { name: "Sat", revenue: 15 },
  { name: "Sun", revenue: 38 },
];

const revenueDataMonth = [
  { name: "Week 1", revenue: 80 },
  { name: "Week 2", revenue: 150 },
  { name: "Week 3", revenue: 110 },
  { name: "Week 4", revenue: 180 },
];

const revenueDataYear = [
  { name: "Jan", revenue: 150 },
  { name: "Feb", revenue: 230 },
  { name: "Mar", revenue: 180 },
  { name: "Apr", revenue: 290 },
  { name: "May", revenue: 210 },
  { name: "Jun", revenue: 350 },
  { name: "Jul", revenue: 300 },
  { name: "Aug", revenue: 410 },
  { name: "Sep", revenue: 380 },
  { name: "Oct", revenue: 520 },
  { name: "Nov", revenue: 480 },
  { name: "Dec", revenue: 600 },
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
  { id: "SBO-WLT-20260712-001", img: "../src/assets/images/bag.png", category: "Leather Wallet", payMode: "Visa card **** 4931", payType: "Card payment", amount: "₹18,294.00", date: "Jan 17, 2022", status: "Completed", statusColor: "#16a34a", statusBg: "#dcfce7" },
  { id: "SBO-WLT-20260712-002", img: "../src/assets/images/bag.png", category: "Leather Wallet", payMode: "Mastercard **** 5442", payType: "Card payment", amount: "₹9,900.00", date: "Jan 17, 2022", status: "Completed", statusColor: "#16a34a", statusBg: "#dcfce7" },
  { id: "SBO-WLT-20260712-003", img: "../src/assets/images/bag.png", category: "Leather Wallet", payMode: "Account ****882", payType: "Bank payment", amount: "₹24,994.00", date: "Jan 17, 2022", status: "Pending", statusColor: "#d97706", statusBg: "#fef3c7" },
  { id: "SBO-WLT-20260712-004", img: "../src/assets/images/bag.png", category: "Leather Wallet", payMode: "Amex card **** 5666", payType: "Card payment", amount: "₹19,924.00", date: "Jan 17, 2022", status: "Canceled", statusColor: "#ef4444", statusBg: "#fee2e2" },
];

import { DashboardSkeleton } from "../../components/Admin/AdminSkeleton";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [revenueFilter, setRevenueFilter] = useState("Last Week");
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getRevenueData = () => {
    if (revenueFilter === "Last Month") return revenueDataMonth;
    if (revenueFilter === "Last Year") return revenueDataYear;
    return revenueDataWeek;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        {/* Header */}
        <AdminHeader title="Admin Dashboard" subtitle="" />

        <main className="admin-content" style={{ background: '#fafafa' }}>
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <>
          
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
                <div className={`stat-badge ${card.badgeClass}`} style={{ fontSize: '13px', fontWeight: 500, marginTop: '8px' }}>
                  {card.badgeClass === 'up' ? <FiArrowUpRight style={{ fontSize: '16px' }} className="me-1" /> : <FiArrowDownRight style={{ fontSize: '16px' }} className="me-1" />}
                  {card.badge}
                </div>
              </div>
            ))}
          </div>

         
          <div className="chart-section mb-4 bg-white p-4 rounded-3 border">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="m-0 fw-bold">Revenue</h5>
              <div className="d-flex align-items-center gap-3">
                <select 
                  className="form-select form-select-sm text-muted" 
                  style={{ width: '120px', fontSize: '13px', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                  value={revenueFilter}
                  onChange={(e) => setRevenueFilter(e.target.value)}
                >
                  <option value="Last Week">Last Week</option>
                  <option value="Last Month">Last Month</option>
                  <option value="Last Year">Last Year</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getRevenueData()} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val) => "₹" + val + "k"} dx={-5} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                  formatter={(value) => [`₹${value}k`, "Revenue"]}
                />
                <Area type="linear" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
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
                        <th className="stock-status-col">Stock Status</th>
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
                          <td className="stock-status-col">
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
                  <Link to="/admin/product-management" state={{ stockBy: 'Low to High' }} className="text-decoration-none" style={{ color: '#6366f1', fontSize: '13px' }}>View all &rarr;</Link>
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
                  <select className="form-select form-select-sm" style={{ width: '130px', fontSize: '13px' }}>
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
                    <th style={{ textAlign: 'center' }}>Payment mode</th>
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
                      <td style={{ textAlign: 'center' }}>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          {renderPayModeIcon(item.payMode)}
                          <div className="d-flex flex-column text-start">
                            <span className="fw-bold">{item.payMode}</span>
                            <span className="text-muted" style={{ fontSize: '11px' }}>{item.payType}</span>
                          </div>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
