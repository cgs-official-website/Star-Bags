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
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

function ProfileSideNav() {
  const navigate = useNavigate();
  const { userData, currentUser, logout } = useAuth();
  const fileInputRef = React.useRef(null);
  
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

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file && currentUser) {
      if (file.size > 800 * 1024) {
        alert("Please upload a photo smaller than 800KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          await updateDoc(userDocRef, {
            photo: reader.result
          });
          
          // Sync with local storage
          const storedUser = JSON.parse(localStorage.getItem("user")) || {};
          localStorage.setItem("user", JSON.stringify({
            ...storedUser,
            photo: reader.result
          }));
          console.log("Profile photo updated successfully!");
        } catch (err) {
          console.error("Error saving profile photo:", err);
          alert("Failed to save profile photo.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="profile-sidebar-card mb-2">
        {/* User Info */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="profile-avatar-wrapper" onClick={handleAvatarClick} style={{ cursor: "pointer" }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
            {userData?.photo ? (
              <img
                src={userData.photo}
                alt="Profile Avatar"
                className="profile-avatar border"
                style={{ width: "55px", height: "55px", objectFit: "cover", borderRadius: "50%" }}
              />
            ) : (
              <div
                className="profile-avatar border d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: "55px",
                  height: "55px",
                  background: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                  borderRadius: "50%"
                }}
              >
                {userName.charAt(0)}
              </div>
            )}
            <IoAddCircle className="avatar-add-icon" />
          </div>
          <div>
            <h5 className="fw-bold mb-1">{userName}</h5>
            <p className="text-muted mb-0" style={{fontSize: "0.8rem"}}>Member since 2026</p>
          </div>
        </div>

        {/* Menu Navigation Items List Hierarchy */}
        <ul className="profile-menu-list list-unstyled mb-0" style={{ width: "100%", boxSizing: "border-box" }}>
          <li style={{ width: "100%" }}>
            <NavLink 
              to="/profile" 
              className={({ isActive }) =>
                isActive ? "profile-menu-link active" : "profile-menu-link"
              }
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <FaRegUserCircle className="menu-icon" />
              My profile
            </NavLink>
          </li>
          <li style={{ width: "100%" }}>
            <NavLink 
              to="/orders" 
              className={({ isActive }) =>
                isActive ? "profile-menu-link active" : "profile-menu-link"
              }
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <FiBox className="menu-icon" />
              My orders
            </NavLink>
          </li>
          <li style={{ width: "100%" }}>
            <NavLink 
              to="/wishlist" 
              className={({ isActive }) =>
                isActive ? "profile-menu-link active" : "profile-menu-link"
              }
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <FaRegHeart className="menu-icon" />
              Wish list
            </NavLink>
          </li>
          <li style={{ width: "100%" }}>
            <NavLink 
              to="/address" 
              className={({ isActive }) =>
                isActive ? "profile-menu-link active" : "profile-menu-link"
              }
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <GrLocation className="menu-icon" />
              Saved address
            </NavLink>
          </li>
          <li style={{ width: "100%" }}>
            <NavLink 
              to="/reviews" 
              className={({ isActive }) =>
                isActive ? "profile-menu-link active" : "profile-menu-link"
              }
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
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
          backgroundColor: '#8B5CF6',
          color: 'white',
          width: "100%",
  
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
    </>
  );
}

export default ProfileSideNav;