import React, { useState } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import '../../assets/styles/AdminSettings.css';
import '../../assets/styles/AdminDashboard.css';

const recentActivities = [
  { id: 1, title: "New Product Added", description: '"Hand purse"', time: "2 hours ago", color: "#4f46e5" },
  { id: 2, title: "Product Edited", description: '"Hand purse"', time: "5 hours ago", color: "#10b981" },
  { id: 3, title: "New Product Added", description: '"Backpack"', time: "Yesterday", color: "#3b82f6" },
  { id: 4, title: "New Product Added", description: '"Laptop bag"', time: "Oct 24, 2023", color: "#f97316" }
];

function Settings() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Star Bags",
    email: "starbags@gmail.com",
    phone: "+91 8833356757",
    storeName: "Krish Leather",
    gstIn: "23 432",
    storeAddress: "Thindal 432"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real application, save to the backend API here.
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        {/* Header */}
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
              General Settings
            </h1>
            {/* <p style={{ fontSize: 13, color: "#6b7280", margin: "2px 0 0" }}>
              Welcome back! Here's what's happening with your store today.
            </p> */}
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

        <div className="admin-content settings-content">
          <div className="settings-banner">
            <div className="settings-banner-left">
              <div className="settings-avatar-wrap">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="settings-avatar-img" />
                <div className="settings-status-dot"></div>
              </div>
              <div className="settings-user-info">
                <h2 className="settings-user-name">{formData.fullName}</h2>
                <p className="settings-user-role">Admin</p>
                <p className="settings-user-email">
                  <i className="bi bi-envelope"></i> {formData.email}
                </p>
              </div>
            </div>
            <div>
              {isEditing ? (
                <button className="settings-save-btn" onClick={handleSave}>
                  <i className="bi bi-check-lg"></i> Save Changes
                </button>
              ) : (
                <button className="settings-edit-btn" onClick={() => setIsEditing(true)}>
                  <i className="bi bi-pencil-fill"></i> Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="settings-grid">
            <div className="settings-card">
               <h3 className="settings-section-title">Personal Information</h3>
               <p className="settings-section-subtitle">Manage your Personal details and Store details.</p>

               <div className="settings-form-row">
                 <div className="settings-form-group">
                   <label className="settings-form-label">Full Name</label>
                   <input type="text" className="settings-input" name="fullName" value={formData.fullName} onChange={handleChange} disabled={!isEditing} />
                 </div>
                 <div className="settings-form-group">
                   <label className="settings-form-label">Email Address</label>
                   <input type="email" className="settings-input" name="email" value={formData.email} onChange={handleChange} disabled={true} />
                 </div>
               </div>

               <div className="settings-form-row">
                 <div className="settings-form-group" style={{ flex: '0 0 calc(50% - 10px)' }}>
                   <label className="settings-form-label">Phone Number</label>
                   <input type="text" className="settings-input" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
                 </div>
               </div>

               <h3 className="settings-section-title" style={{ marginTop: '30px' }}>Store Details</h3>
               <p className="settings-section-subtitle">Join Krish Leather and experience timeless craftsmanship.</p>

               <div className="settings-form-row">
                 <div className="settings-form-group">
                   <label className="settings-form-label">Store Name</label>
                   <input type="text" className="settings-input" name="storeName" value={formData.storeName} onChange={handleChange} disabled={!isEditing} />
                 </div>
               </div>

               <div className="settings-form-row">
                 <div className="settings-form-group">
                   <label className="settings-form-label">GST IN</label>
                   <input type="text" className="settings-input" name="gstIn" value={formData.gstIn} onChange={handleChange} disabled={!isEditing} />
                 </div>
               </div>

               <div className="settings-form-row" style={{ marginBottom: 0 }}>
                 <div className="settings-form-group">
                   <label className="settings-form-label">Store Business Address</label>
                   <textarea className="settings-input" name="storeAddress" value={formData.storeAddress} onChange={handleChange} disabled={!isEditing} />
                 </div>
               </div>
            </div>

            
            <div className="settings-card" style={{ height: 'fit-content' }}>
              <h3 className="settings-section-title" style={{ marginBottom: '24px' }}>Recent Activity</h3>
              <div className="activity-timeline">
                {recentActivities.map((activity) => (
                  <div className="activity-item" key={activity.id}>
                    <div className="activity-dot" style={{ background: activity.color }}></div>
                    <div className="activity-content">
                      <h4 className="activity-title">{activity.title}</h4>
                      <p className="activity-desc">{activity.description}</p>
                      <p className="activity-time">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;