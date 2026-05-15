import React from 'react';
import "../../assets/styles/Profile-Side-Nav.css";
import { FaRegUserCircle, FaRegHeart } from "react-icons/fa";
import { FiBox, FiLogOut } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { BsSun } from "react-icons/bs";
import { IoAddCircle } from "react-icons/io5";
import { NavLink } from 'react-router-dom';

function ProfileSideNav() {
  return (
    <>
      <div className="profile-sidebar-card mb-2">
        {/* User Info */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar"></div>
            <IoAddCircle className="avatar-add-icon"  />
          </div>
          <div>
            <h5 className="fw-bold mb-1">User name</h5>
            <p className="text-muted mb-0" style={{fontSize: "0.8rem"}}>12 Mar ,2026</p>
          </div>
        </div>

        {/* Menu Items */}
        <ul className="profile-menu-list list-unstyled mb-0">
          <li>
            <a href="/profile" className="profile-menu-link">
              <FaRegUserCircle className="menu-icon" />
              My profile
            </a>
          </li>
          <li>
            <a href="#" className="profile-menu-link">
              <FiBox className="menu-icon" />
              My orders
            </a>
          </li>
          <li>
            <a href="/wishlist" className="profile-menu-link">
              <FaRegHeart className="menu-icon" />
              Wish list
            </a>
          </li>
          <li>
            <a href="/address" className="profile-menu-link">
              <GrLocation className="menu-icon" />
              Saved address
            </a>
          </li>
          <li>
            <div className="profile-menu-link theme-toggle-item">
              <div className="d-flex align-items-center">
                <BsSun className="menu-icon" />
                Dark Theme
              </div>
              <div className="form-check form-switch m-0">
                <input className="form-check-input" type="checkbox" id="themeSwitch" />
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* Logout Button */}
      <NavLink to="/login" className="btn logout-btn w-100 mt-2">
        <FiLogOut className="me-2" style={{transform: "rotate(180deg)"}} />
        Log out your Account
      </NavLink>
    </>
  );
}

export default ProfileSideNav;