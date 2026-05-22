import { IoNotificationsOutline } from "react-icons/io5";
import { IoMdCart } from "react-icons/io";
import { FaUserCircle, FaRegUserCircle, FaRegHeart } from "react-icons/fa";
import { FiBox, FiLogOut } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { BsSun } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { useSearch } from '../../context/SearchContext';
import { useWishlist } from '../../context/WishlistContext'; 
import SearchModal from '../User/SearchModal';
import { allProductsData } from '../../pages/User/Allproducts'; 
import '../../assets/styles/Navbar.css';

const Navbar = () => {
  const { performSearch, clearSearch } = useSearch();
  const { cart } = useWishlist(); 
  const navigate = useNavigate();

  // ─── FIX: Count unique product items (length) instead of adding quantities together ───
  const totalCartCount = cart ? cart.length : 0;

  const handleSearch = (query) => {
    if (query.trim()) {
      performSearch(query, allProductsData);
    } else {
      clearSearch();
    }
    navigate('/allProducts');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container navbar-container">

        {/* ── LOGO ── */}
        <NavLink className="navbar-brand" to="/">
          <img
            src="/src/assets/images/brand-logo-light.png"
            alt="logo"
            className="logo"
          />
        </NavLink>

        {/* ── MOBILE RIGHT SIDE ── */}
        <div className="mobile-top">

          {/* SEARCH BAR - MOBILE */}
          <div className="mobile-search">
            <SearchModal
              products={allProductsData}
              onSearch={handleSearch}
              placeholder="Search..."
            />
          </div>

          {/* USER DROPDOWN */}
          <div className="dropdown">
            <button className="icon-btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <FaUserCircle />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm user-dropdown-menu">
              <li>
                <NavLink to="/profile" className="dropdown-item d-flex align-items-center profile-dropdown-item">
                  <FaRegUserCircle className="me-2 text-muted profile-item-icon" /> My profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/orders" className="dropdown-item d-flex align-items-center profile-dropdown-item">
                  <FiBox className="me-2 text-muted profile-item-icon" /> My orders
                </NavLink>
              </li>
              <li>
                <NavLink to="/wishlist" className="dropdown-item d-flex align-items-center profile-dropdown-item">
                  <FaRegHeart className="me-2 text-muted profile-item-icon" /> Wish list
                </NavLink>
              </li>
              <li>
                <NavLink to="/address" className="dropdown-item d-flex align-items-center profile-dropdown-item">
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
                <NavLink to="/login" className="dropdown-item d-flex align-items-center text-danger profile-dropdown-item logout-link">
                  <FiLogOut className="me-2 logout-icon" /> Log out
                </NavLink>
              </li>
            </ul>
          </div>

          {/* MOBILE CART WITH ACCENT RED ROUND BADGE */}
          <NavLink to={"/cart"} className="icon-btn position-relative d-inline-flex align-items-center justify-content-center">
            <IoMdCart />
            {totalCartCount > 0 && (
              <span 
                className="position-absolute badge rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                style={{ 
                  top: "-4px", 
                  right: "-6px", 
                  background: "#ff3b30", 
                  color: "#ffffff",
                  fontSize: "10px", 
                  width: "18px", 
                  height: "18px",
                  padding: "0",
                  lineHeight: "1"
                }}
              >
                {totalCartCount}
              </span>
            )}
          </NavLink>

          {/* TOGGLE BUTTON */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navContent"
          >
            ☰
          </button>
        </div>

        {/* ── NAVBAR CONTENT (desktop) ── */}
        <div className="collapse navbar-collapse" id="navContent">

          {/* NAV LINKS */}
          <ul className="navbar-nav mx-auto nav-links">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/allProducts" className="nav-link">All Products</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link">Contact</NavLink>
            </li>
          </ul>

          {/* DESKTOP SEARCH */}
          <div className="search-wrapper d-none d-lg-flex">
            <SearchModal
              products={allProductsData}
              onSearch={handleSearch}
              placeholder="Search products..."
            />
          </div>

          {/* DESKTOP ICONS */}
          <div className="desktop-icons d-none d-lg-flex align-items-center gap-3 ms-3">
            <button className="icon-btn">
              <IoNotificationsOutline />
            </button>

            {/* DESKTOP CART WITH ACCENT RED ROUND BADGE */}
            <NavLink to="/cart" className="icon-btn position-relative d-inline-flex align-items-center justify-content-center">
              <IoMdCart />
              {totalCartCount > 0 && (
                <span 
                  className="position-absolute badge rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                  style={{ 
                    top: "-4px", 
                    right: "-6px", 
                    background: "#ff3b30", 
                    color: "#ffffff",
                    fontSize: "10px", 
                    width: "18px", 
                    height: "18px",
                    padding: "0",
                    lineHeight: "1"
                  }}
                >
                  {totalCartCount}
                </span>
              )}
            </NavLink>

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