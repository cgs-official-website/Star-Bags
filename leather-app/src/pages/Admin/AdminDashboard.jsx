import  { useState } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./Styles/AdminDashboard.css";

/* ─── Mock Data ─── */
const salesData = [
  { month: "Jan", revenue: 42000, orders: 310 },
  { month: "Feb", revenue: 53000, orders: 398 },
  { month: "Mar", revenue: 48000, orders: 352 },
  { month: "Apr", revenue: 61000, orders: 430 },
  { month: "May", revenue: 55000, orders: 401 },
  { month: "Jun", revenue: 72000, orders: 512 },
  { month: "Jul", revenue: 68000, orders: 200 },
  { month: "Aug", revenue: 79000, orders: 360 },
  { month: "Sep", revenue: 83000, orders: 490 },
  { month: "Oct", revenue: 91000, orders: 540 },
  { month: "Nov", revenue: 105000, orders: 720 },
  { month: "Dec", revenue: 98000, orders: 680 },
];

const topProducts = [
  {
    name: "Classic Leather Tote",
    orders: 124,
    sold: 248,
    revenue: "₹8,67,752",
    stock: 42,
    stockColor: "#059669",
    stockBg: "#d1fae5",
  },
  {
    name: "Executive Briefcase",
    orders: 98,
    sold: 185,
    revenue: "₹11,09,815",
    stock: 25,
    stockColor: "#059669",
    stockBg: "#d1fae5",
  },
  {
    name: "Vintage Satchel",
    orders: 85,
    sold: 163,
    revenue: "₹4,56,237",
    stock: 10,
    stockColor: "#059669",
    stockBg: "#d1fae5",
  },
  {
    name: "Minimalist Crossbody",
    orders: 71,
    sold: 142,
    revenue: "₹2,83,858",
    stock: 5,
    stockColor: "#059669",
    stockBg: "#d1fae5",
  },
  {
    name: "Premium Backpack",
    orders: 59,
    sold: 118,
    revenue: "₹5,07,282",
    stock: 0,
    stockColor: "#d97706",
    stockBg: "#fef3c7",
  },
  {
    name: "Zip-Around Wallet",
    orders: 45,
    sold: 97,
    revenue: "₹87,203",
    stock: 0,
    stockColor: "#ef4444",
    stockBg: "#fee2e2",
  },
];

const stockAlerts = [
  {
    label: "Bag Products",
    count: "6 Items",
    icon: "bi-bag-check",
    colorClass: "green",
    textClass: "green-text",
    bg: "green-bg",
  },
  {
    label: "Belt Products",
    count: "14 Items",
    icon: "bi-arrow-right-arrow-left-square-fill",
    colorClass: "green",
    textClass: "green-text",
    bg: "green-bg",
  },
  {
    label: "Wallet Products",
    count: "9 Items",
    icon: "bi-wallet2",
    colorClass: "red",
    textClass: "red-text",
    bg: "red-bg",
  },
];

const orderStatuses = [
  { label: "Pending", count: 42, color: "#f59e0b", pct: 18 },
  { label: "Shipped", count: 95, color: "#8b5cf6", pct: 40 },
  { label: "Delivered", count: 210, color: "#10b981", pct: 88 },
  // { label: "Cancelled", count: 15, color: "#ef4444", pct: 6 },
];

/* ─── Stat Cards data ─── */
const statCards = [
  {
    label: "Total Sales",
    value: "₹12.4L",
    icon: "bi-currency-rupee",
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
    badge: "+18.2%",
    badgeClass: "up",
    sub: "vs last month",
  },
  {
    label: "Total Products",
    value: "348",
    icon: "bi-box-seam-fill",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
    badge: "+12",
    badgeClass: "up",
    sub: "this month",
  },
  {
    label: "Low Stock Items",
    value: "14",
    icon: "bi-exclamation-triangle-fill",
    iconBg: "#fef3c7",
    iconColor: "#d97706",
    badge: "6 critical",
    badgeClass: "down",
    sub: "need restock",
  },
  {
    label: "New Customers",
    value: "94",
    icon: "bi-people-fill",
    iconBg: "#d1fae5",
    iconColor: "#059669",
    badge: "+94",
    badgeClass: "up",
    sub: "new this month",
  },
  {
    label: "Total Orders",
    value: "1,284",
    icon: "bi-cart-fill",
    iconBg: "#fce7f3",
    iconColor: "#db2777",
    badge: "+7.5%",
    badgeClass: "up",
    sub: "vs last month",
  },
  {
    label: "Pending Orders",
    value: "42",
    icon: "bi-clock-history",
    iconBg: "#fff7ed",
    iconColor: "#ea580c",
    badge: "-3",
    badgeClass: "down",
    sub: "from yesterday",
  },
];

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="tooltip-value" style={{ color: p.color }}>
            {p.name === "revenue"
              ? `₹${p.value.toLocaleString("en-IN")}`
              : p.value}{" "}
            {p.name}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ─── Main Component ─── */
const AdminDashboard = () => {
  const [activeRange, setActiveRange] = useState("12M");

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        {/* ── Top Header ── */}
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
              Dashboard
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
            <button className="notif-btn">
              <i
                className="bi bi-bell-fill"
                style={{ color: "#374151", fontSize: 18 }}
              />
              <span className="notif-badge">5</span>
            </button>

            {/* Profile */}
            <div className="admin-profile">
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

        {/* ── Dashboard Content ── */}
        <main className="admin-content">
          {/* Page Title */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            {/* <div className="d-flex gap-2">
              <button
                className="btn btn-sm d-flex align-items-center gap-1"
                style={{ background: '#ede9fe', color: '#7c3aed', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13 }}
              >
                <i className="bi bi-download" /> Export
              </button>
              <button
                className="btn btn-sm d-flex align-items-center gap-1"
                style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13 }}
              >
                <i className="bi bi-plus-lg" /> Add Product
              </button>
            </div> */}
          </div>

          {/* ── Stat Cards ── */}
          <div className="stats-grid">
            {statCards.map((card, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-card-top">
                  <div className="stat-card-info">
                    <p className="stat-label">{card.label}</p>
                    <p className="stat-value">{card.value}</p>
                  </div>
                  <div
                    className="stat-icon"
                    style={{ background: card.iconBg }}
                  >
                    <i
                      className={`bi ${card.icon}`}
                      style={{ fontSize: 22, color: card.iconColor }}
                    />
                  </div>
                </div>
                <div className={`stat-badge ${card.badgeClass}`}>
                  <i
                    className={`bi ${card.badgeClass === "up" ? "bi-arrow-up-right" : "bi-arrow-down-right"}`}
                  />
                  <span>{card.badge}</span>
                  <span
                    className={`bi ${card.badgeClass === "up" ? "text-success" : "text-danger"}`}
                    style={{ fontWeight: 600 }}
                  >
                    {card.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Sales Analytics Chart ── */}
          <div className="chart-section">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h2 className="section-title mb-0">Sales Analytics</h2>
              {/* <div className="d-flex gap-1">
                {['7D', '1M', '3M', '6M', '12M'].map(r => (
                  <button
                    key={r}
                    onClick={() => setActiveRange(r)}
                    className="btn btn-sm"
                    style={{
                      padding: '4px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 7,
                      border: 'none',
                      background: activeRange === r ? '#7c3aed' : '#f3f4f6',
                      color: activeRange === r ? '#fff' : '#6b7280',
                      transition: 'background 0.18s',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div> */}
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={salesData}
                margin={{ top: 6, right: 12, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                  tickFormatter={(v) => (v >= 1000 ? `₹${v / 1000}k` : v)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  fill="url(#gradRevenue)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#7c3aed" }}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fill="url(#gradOrders)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#06b6d4" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* ── Top Selling Products Table ── */}
          <div className="products-section">
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <h2 className="section-title mb-0">Top Selling Products</h2>
            </div>
            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th className="text-center">Total Order</th>
                    <th className="d-none d-sm-table-cell text-center">
                      Units Sold
                    </th>
                    <th className="d-none d-lg-table-cell">Revenue</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={p.id}>
                      <td className="product-name">{p.name}</td>
                      <td
                        className="text-center"
                        style={{ fontWeight: 700, color: "#374151" }}
                      >
                        {p.orders}
                      </td>
                      <td
                        className="d-none d-sm-table-cell text-center"
                        style={{ fontWeight: 700, color: "#111827" }}
                      >
                        {p.sold}
                      </td>
                      <td
                        className="d-none d-lg-table-cell"
                        style={{ fontWeight: 700, color: "#111827" }}
                      >
                        {p.revenue}
                      </td>
                      <td>
                        <span
                          className="stock-badge"
                          style={{
                            background: p.stockBg,
                            color: "#111827",
                            fontWeight: 700,
                          }}
                        >
                          <span
                            className="stock-dot"
                            style={{ background: p.stockColor }}
                          />
                          {p.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Bottom Panels ── */}
          <div className="bottom-panels">
            {/* Stock Alerts */}
            <div className="panel">
              <div className="panel-header">
                <h2 className="section-title">Stock Alerts</h2>
                <button
                  className="panel-arrow"
                  aria-label="View all stock alerts"
                >
                  <i className="bi bi-arrow-right" style={{ fontSize: 16 }} />
                </button>
              </div>

              {stockAlerts.map((alert, i) => (
                <div key={i} className={`stock-alert-item ${alert.colorClass}`}>
                  <div className={`alert-icon-wrap ${alert.bg}`}>
                    <i
                      className={`bi ${alert.icon} ${alert.textClass}`}
                      style={{ fontSize: 18 }}
                    />
                  </div>
                  <span className={`alert-label ${alert.textClass}`}>
                    {alert.label}
                  </span>
                  <span className={`alert-count ${alert.textClass}`}>
                    {alert.count}
                  </span>
                  <button
                    className="alert-arrow"
                    aria-label={`Go to ${alert.label}`}
                  >
                    <i
                      className={`bi bi-arrow-right ${alert.textClass}`}
                      style={{ fontSize: 18 }}
                    />
                  </button>
                </div>
              ))}

              {/* Summary row */}
              {/* <div
                className="d-flex align-items-center justify-content-between mt-3 pt-3"
                style={{ borderTop: '1px solid #f3f4f6' }}
              >
                <span style={{ fontSize: 12, color: '#6b7280' }}>Total items needing attention</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>29 Items</span>
              </div> */}
            </div>

            {/* Order Status */}
            <div className="panel">
              <div className="panel-header">
                <h2 className="section-title">Order Status</h2>
                <button className="panel-arrow" aria-label="View all orders">
                  <i
                    className="bi bi-arrow-right"
                    style={{ fontSize: 16, color: "black" }}
                  />
                </button>
              </div>

              {orderStatuses.map((status, i) => (
                <div key={i} className="order-status-item">
                  <div className="order-status-row">
                    <div className="order-status-label">
                      <span
                        className="order-dot"
                        style={{ background: status.color }}
                      />
                      <span
                        style={{
                          fontSize: 14,
                          color: "#374151",
                          fontWeight: 500,
                        }}
                      >
                        {status.label}
                      </span>
                    </div>
                    <span className="order-status-count">{status.count}</span>
                    <button
                      className="status-arrow"
                      aria-label={`View ${status.label} orders`}
                    >
                      <i
                        className="bi bi-arrow-right"
                        style={{ fontSize: 16 }}
                      />
                    </button>
                  </div>
                  <div className="order-progress-bar">
                    <div
                      className="order-progress-fill"
                      style={{
                        width: `${status.pct}%`,
                        background: status.color,
                      }}
                    />
                  </div>
                  <hr style={{ color: "#c3c3c3ff" }} />
                </div>
              ))}

              {/* Total
              <div
                className="d-flex align-items-center justify-content-between mt-3 pt-3"
                style={{ borderTop: '1px solid #f3f4f6' }}
              >
                <span style={{ fontSize: 12, color: '#6b7280' }}>Total orders this month</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>440</span>
              </div> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
