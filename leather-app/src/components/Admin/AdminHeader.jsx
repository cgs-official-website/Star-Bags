import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/AdminHeader.css';

const AdminHeader = ({ title, subtitle }) => {
  const navigate = useNavigate();

  return (
    <header className="admin-header">
      <div className="admin-header-title-wrapper">
        <h1 className="admin-header-title" title={title}>{title}</h1>
        {subtitle && <p className="admin-header-subtitle">{subtitle}</p>}
      </div>

      <div className="header-right">
        {/* Profile */}
        <div className="admin-profile" onClick={() => navigate('/admin/settings')}>
          <div className="profile-avatar">
            <i className="bi bi-person-fill" style={{ fontSize: 20, color: "#7c3aed" }} />
          </div>
          <div className="profile-info">
            <span className="profile-name">Sanjai</span>
            <span className="profile-role">Star Bags</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
