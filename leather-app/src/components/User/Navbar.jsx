import React, { useState } from "react";
import { IoMdCart } from "react-icons/io";
import { FaUserCircle, FaRegUserCircle, FaRegHeart } from "react-icons/fa";
import { FiBox, FiLogOut } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { BsSun } from "react-icons/bs";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSearch } from '../../context/SearchContext';
import { useWishlist } from '../../context/WishlistContext'; 
import SearchModal from '../User/SearchModal';
import { allProductsData } from '../../pages/User/Allproducts'; 
import '../../assets/styles/Navbar.css';

const Navbar = () => {
  const { performSearch, clearSearch } = useSearch();
  const { cart } = useWishlist(); 
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalCartCount = cart ? cart.length : 0;
  const activeCategory = location.state?.filters?.category || "";

  const handleCategoryNavigation = (categoryName) => {
    setIsMenuOpen(false); 
    navigate("/AllProducts", {
      state: {
        filters: {
          category: categoryName.toLowerCase(),
        },
      },
    });
  };

  const handleSearch = (query) => {
    setIsMenuOpen(false);
    if (query.trim()) {
      performSearch(query, allProductsData);
    } else {
      clearSearch();
    }
    navigate('/AllProducts');
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenuOnly = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container navbar-container">

        {/* ── LOGO ── */}
        <NavLink className="navbar-brand" to="/" onClick={closeMenuOnly}>
          <img
            src="/src/assets/images/brand-logo-light.png"
            alt="logo"
            className="logo"
          />
        </NavLink>

        {/* ── MOBILE ROW ACTIONS ── */}
        <div className="mobile-top">

          {/* SEARCH BAR - MOBILE */}
          <div className="mobile-search">
            <SearchModal
              products={allProductsData}
              onSearch={handleSearch}
              placeholder="Search..."
            />
          </div>

          {/* USER DROPDOWN - MOBILE VIEW DROPDOWN TOGGLE ONLY */}
          <div className="dropdown">
            <button 
              className="icon-btn border-0" 
              type="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              <FaUserCircle />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm user-dropdown-menu">
              <li>
                <NavLink to="/profile" onClick={closeMenuOnly} className="dropdown-item d-flex align-items-center profile-dropdown-item">
                  <FaRegUserCircle className="me-2 text-muted profile-item-icon" /> My profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/orders" onClick={closeMenuOnly} className="dropdown-item d-flex align-items-center profile-dropdown-item">
                  <FiBox className="me-2 text-muted profile-item-icon" /> My orders
                </NavLink>
              </li>
              <li>
                <NavLink to="/wishlist" onClick={closeMenuOnly} className="dropdown-item d-flex align-items-center profile-dropdown-item">
                  <FaRegHeart className="me-2 text-muted profile-item-icon" /> Wish list
                </NavLink>
              </li>
              <li>
                <NavLink to="/address" onClick={closeMenuOnly} className="dropdown-item d-flex align-items-center profile-dropdown-item">
                  <GrLocation className="me-2 text-muted profile-item-icon" /> Saved address
                </NavLink>
              </li>
              <li><hr className="dropdown-divider my-1" /></li>
              <li>
                <div className="dropdown-item d-flex align-items-center justify-content-between profile-dropdown-item theme-toggle-item">
                  <div className="d-flex align-items-center">
                    <BsSun className="me-2 text-muted profile-item-icon" /> Dark Theme
                  </div>
                  <div className="form-check form-switch m-0 dark-theme-switch">
                    <input className="form-check-input" type="checkbox" role="switch" />
                  </div>
                </div>
              </li>
              <li><hr className="dropdown-divider my-1" /></li>
              <li>
                <NavLink to="/login" onClick={closeMenuOnly} className="dropdown-item d-flex align-items-center text-danger profile-dropdown-item logout-link">
                  <FiLogOut className="me-2 logout-icon" /> Log out
                </NavLink>
              </li>
            </ul>
          </div>

          {/* MOBILE CART */}
          <NavLink 
            to="/cart" 
            onClick={closeMenuOnly}
            className="icon-btn position-relative d-inline-flex align-items-center justify-content-center"
          >
            <IoMdCart />
            {totalCartCount > 0 && (
              <span className="position-absolute badge rounded-circle d-flex align-items-center justify-content-center fw-bold cart-badge">
                {totalCartCount}
              </span>
            )}
          </NavLink>

          {/* TOGGLE BUTTON */}
          <button
            className="navbar-toggler custom-toggler-icon"
            type="button"
            onClick={handleMenuToggle}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* ── NAVBAR LAYOUT CONTENT ── */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navContent">

          {/* CATEGORY NAVIGATION LINKS */}
          <ul className="navbar-nav mx-auto nav-links">
            <li className="nav-item">
              <button 
                type="button"
                onClick={() => handleCategoryNavigation("bag")} 
                className={`nav-link custom-nav-btn ${activeCategory === "bag" ? "active" : ""}`}
              >
                Bags
              </button>
            </li>
            <li className="nav-item">
              <button 
                type="button"
                onClick={() => handleCategoryNavigation("wallet")} 
                className={`nav-link custom-nav-btn ${activeCategory === "wallet" ? "active" : ""}`}
              >
                Wallet
              </button>
            </li>
            <li className="nav-item">
              <button 
                type="button"
                onClick={() => handleCategoryNavigation("belt")} 
                className={`nav-link custom-nav-btn ${activeCategory === "belt" ? "active" : ""}`}
              >
                Belts
              </button>
            </li>
          </ul>

          {/* DESKTOP SEARCH BAR */}
          <div className="search-wrapper d-none d-lg-flex">
            <SearchModal
              products={allProductsData}
              onSearch={handleSearch}
              placeholder="Search products..."
            />
          </div>

          {/* DESKTOP QUICK ACTION UTILITIES */}
          <div className="desktop-icons d-none d-lg-flex align-items-center gap-3 ms-3">
            
            {/* CART ICON */}
            <NavLink to="/cart" className="icon-btn position-relative d-inline-flex align-items-center justify-content-center">
              <IoMdCart />
              {totalCartCount > 0 && (
                <span className="position-absolute badge rounded-circle d-flex align-items-center justify-content-center fw-bold cart-badge">
                  {totalCartCount}
                </span>
              )}
            </NavLink>

            {/* DESKTOP DIRECT PROFILE LINK ENTRY AS REQUESTED */}
            <NavLink to="/profile" className="icon-btn">
              <FaUserCircle />
            </NavLink>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;