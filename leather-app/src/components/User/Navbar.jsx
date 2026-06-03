import React, { useState, useEffect, useRef } from "react";
import { MdOutlineShoppingCart, MdOutlineRateReview } from "react-icons/md";
import { FaUserCircle, FaRegUserCircle, FaRegHeart, FaStar } from "react-icons/fa";
import { FiBox, FiLogOut, FiUser, FiSearch } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { BsSun } from "react-icons/bs";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSearch } from '../../context/SearchContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductsContext';
import brandLogoLight from '../../assets/images/brand-logo-light.png';
import brandLogoDark from '../../assets/images/brand-logo-dark.png';
import '../../assets/styles/Navbar.css';

const Navbar = () => {
  const { performSearch, clearSearch } = useSearch();
  const { cart } = useWishlist();
  const { currentUser, userData, logout } = useAuth();
  const { products: liveProducts } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const drawerRef = useRef(null);

  const totalCartCount = cart ? cart.length : 0;
  const activeCategory = location.state?.filters?.category || "";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.state]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleOutsideClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleCategoryNavigation = (categoryName) => {
    closeMenu();
    navigate("/AllProducts", {
      state: { filters: { category: categoryName.toLowerCase() } },
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    closeMenu();
    if (searchQuery.trim()) {
      performSearch(searchQuery, liveProducts);
    } else {
      clearSearch();
    }
    navigate('/AllProducts');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      clearSearch();
    }
  };

  const NAV_CATEGORIES = [
    { label: "Bags",    key: "bag"    },
    { label: "Wallets", key: "wallet" },
    { label: "Belts",   key: "belt"   },
  ];

  const SearchForm = ({ placeholder }) => (
    <form className="nav-search-form" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <button type="submit" aria-label="Search">
        <FiSearch />
      </button>
    </form>
  );

  return (
    <nav className="navbar" ref={drawerRef}>
      <div className="container-fluid navbar-container">
        <div className="nav-logo-wrap">
          <NavLink to="/" onClick={closeMenu}>
            <img src={brandLogoLight} alt="Brand Logo" className="logo logo-light" />
            <img src={brandLogoDark}  alt="Brand Logo" className="logo logo-dark"  />
          </NavLink>
        </div>

        <ul className="nav-links-desktop">
          {NAV_CATEGORIES.map(({ label, key }) => (
            <li key={key}>
              <button type="button" onClick={() => handleCategoryNavigation(key)} className={`custom-nav-btn ${activeCategory === key ? "active" : ""}`}>
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* 3. DESKTOP SEARCH */}
        <div className="nav-search-desktop">
          <SearchForm placeholder="Search products..." />
        </div>

        {/* 4. MOBILE SEARCH */}
        <div className="nav-search-mobile">
          <SearchForm placeholder="Search..." />
        </div>

        {/* 5. RIGHT ACTIONS */}
        <div className="nav-actions">
          {currentUser ? (
            <NavLink to="/profile" className="icon-btn d-none d-lg-flex p-0 align-items-center justify-content-center" style={{ overflow: 'hidden' }}>
              {userData?.photo ? <img src={userData.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiUser />}
            </NavLink>
          ) : (
            <NavLink to="/login" className="d-none d-lg-flex align-items-center nav-login-btn">
              Login
            </NavLink>
          )}

          <div className="dropdown d-lg-none">
            {currentUser ? (
              <>
                <button className="icon-btn p-0 d-flex align-items-center justify-content-center" data-bs-toggle="dropdown" aria-expanded="false" onClick={closeMenu} style={{ overflow: 'hidden' }}>
                  {userData?.photo ? <img src={userData.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiUser />}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm user-dropdown-menu">
                  <li>
                    <NavLink
                      to="/profile" onClick={closeMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "dropdown-item d-flex align-items-center profile-dropdown-item active"
                          : "dropdown-item d-flex align-items-center profile-dropdown-item"
                      }
                    >
                      {userData?.photo ? (
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', overflow: 'hidden', marginRight: '8px' }}>
                          <img src={userData.photo} alt="Profile Icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <FiUser className="profile-item-icon" />
                      )}
                      My profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/orders" onClick={closeMenu}
                      className={({ isActive }) => isActive
                        ? "dropdown-item d-flex align-items-center profile-dropdown-item active"
                        : "dropdown-item d-flex align-items-center profile-dropdown-item"}
                    >
                      <FiBox className="profile-item-icon" /> My orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/wishlist" onClick={closeMenu}
                      className={({ isActive }) => isActive
                        ? "dropdown-item d-flex align-items-center profile-dropdown-item active"
                        : "dropdown-item d-flex align-items-center profile-dropdown-item"}
                    >
                      <FaRegHeart className="profile-item-icon" /> Wish list
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/address" onClick={closeMenu}
                      className={({ isActive }) => isActive
                        ? "dropdown-item d-flex align-items-center profile-dropdown-item active"
                        : "dropdown-item d-flex align-items-center profile-dropdown-item"}
                    >
                      <GrLocation className="profile-item-icon" /> Saved address
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/reviews" onClick={closeMenu}
                      className={({ isActive }) => isActive
                        ? "dropdown-item d-flex align-items-center profile-dropdown-item active"
                        : "dropdown-item d-flex align-items-center profile-dropdown-item"}
                    >
                      <MdOutlineRateReview className="profile-item-icon" /> My Reviews
                    </NavLink>
                  </li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <button onClick={async () => { closeMenu(); await logout(); navigate("/login"); }} className="dropdown-item d-flex align-items-center text-danger profile-dropdown-item logout-link" style={{ border: 'none', background: 'none', width: '100%', padding: '0.25rem 1rem' }}>
                      <FiLogOut className="profile-item-icon logout-icon" /> Log out
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <NavLink
                to="/login" onClick={closeMenu}
                className="d-flex align-items-center nav-login-btn"
                style={{ marginRight: '5px' }}
              >
                Login
              </NavLink>
            )}
          </div>

          {/* Cart */}
          <NavLink to="/cart" onClick={closeMenu} className="icon-btn" aria-label="Cart">
            <MdOutlineShoppingCart />
            {totalCartCount > 0 && <span className="cart-badge">{totalCartCount}</span>}
          </NavLink>

          <button className="nav-toggler" type="button" onClick={() => setIsMenuOpen(prev => !prev)} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <div className={`nav-drawer ${isMenuOpen ? "open" : ""}`}>
        <div className="nav-drawer-inner">
          {NAV_CATEGORIES.map(({ label, key }) => (
            <div key={key} className="drawer-nav-item">
              <button type="button" onClick={() => handleCategoryNavigation(key)} className={`drawer-nav-btn ${activeCategory === key ? "active" : ""}`}>
                {label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
