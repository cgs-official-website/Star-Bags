import React from 'react';
import "../../assets/styles/Profile-Side-Nav.css";
import { FaRegUserCircle, FaRegHeart } from "react-icons/fa";
import { FiBox, FiLogOut } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { BsSun } from "react-icons/bs";
import { IoAddCircle } from "react-icons/io5";
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MdOutlineRateReview } from "react-icons/md";

function ProfileSideNav() {
  const navigate = useNavigate();
  const { userData, currentUser, logout } = useAuth();
  
  const userName = userData?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || "User";

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  return (
    <div className="profile-sidenav-container-fixed-width" style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      
      {/* ─── FIXED WIDTH MAIN SIDEBAR CARD ─── */}
      <div 
        className="profile-sidebar-card mb-2" 
        style={{ 
          width: "100%", 
          maxWidth: "100%", 
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* User Info Block */}
        <div className="d-flex align-items-center gap-3 mb-3" style={{ width: "100%", boxSizing: "border-box" }}>
          <div className="profile-avatar-wrapper" style={{ flexShrink: 0 }}>
            <div className="profile-avatar"></div>
            <IoAddCircle className="avatar-add-icon" />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h5 className="fw-bold mb-1" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>
              {userName}
            </h5>
            {/* <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>12 Mar ,2026</p> */}
          </div>
        </div>

        {/* Menu Navigation Items List Hierarchy */}
        <ul className="profile-menu-list list-unstyled mb-0" style={{ width: "100%", boxSizing: "border-box" }}>
          <li style={{ width: "100%" }}>
            <NavLink to="/profile" className="profile-menu-link" style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <FaRegUserCircle className="menu-icon" />
              My profile
            </NavLink>
          </li>
          <li style={{ width: "100%" }}>
            <NavLink to="/orders" className="profile-menu-link" style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <FiBox className="menu-icon" />
              My orders
            </NavLink>
          </li>
          <li style={{ width: "100%" }}>
            <NavLink to="/wishlist" className="profile-menu-link" style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <FaRegHeart className="menu-icon" />
              Wish list
            </NavLink>
          </li>
          <li style={{ width: "100%" }}>
            <NavLink to="/address" className="profile-menu-link" style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <GrLocation className="menu-icon" />
              Saved address
            </NavLink>
          </li>
          <li style={{ width: "100%" }}>
            <NavLink to="/reviews" className="profile-menu-link" style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <MdOutlineRateReview className="menu-icon" />
              My Reviews
            </NavLink>
          </li>
          <li style={{ width: "100%" }}>
            <div className="profile-menu-link theme-toggle-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <div className="d-flex align-items-center">
                <BsSun className="menu-icon" />
                Dark Theme
              </div>
              <div className="form-check form-switch m-0">
                <input className="form-check-input" type="checkbox" id="themeSwitch" style={{ cursor: "pointer" }} />
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* ─── FIXED WIDTH LOGOUT BUTTON LAYER ─── */}
      <button 
        onClick={handleLogout} 
        className="btn logout-btn w-100 mt-2" 
        style={{ 
          border: 'none',
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap"
        }}
      >
        <FiLogOut className="me-2" style={{ transform: "rotate(180deg)" }} />
        Log out your Account
      </button>

    </div>
  );
}

export default ProfileSideNav;