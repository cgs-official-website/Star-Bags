import React from "react";
import Navbar from "../components/User/Navbar";
import Footer from "../components/User/Footer";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Orders from "../pages/Orders";

const DashboardPage = () => {
  return (
    <>
      <Navbar />
      <main className="dashboard-container">
        <div className="dashboard-layout">
          {/* Left Sidebar */}
          <aside className="sidebar">
            <AdminDashboard />
          </aside>

          {/* Right Content */}
          <section className="orders-section">
            <h2>My Orders</h2>
            <Orders />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DashboardPage;

