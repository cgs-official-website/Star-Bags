import React, { useState, useEffect, useRef } from "react";
import { MdOutlineShoppingCart, MdOutlineRateReview } from "react-icons/md";
import { FaUserCircle, FaRegUserCircle, FaRegHeart } from "react-icons/fa";
import { FiBox, FiLogOut, FiUser } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { BsSun } from "react-icons/bs";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSearch } from '../../context/SearchContext';
import { useWishlist } from '../../context/WishlistContext';
import { useProducts } from '../../context/ProductsContext';
import SearchModal from '../User/SearchModal';
import '../../assets/styles/Navbar.css';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import brandLogoLight from '../../assets/images/brand-logo-light.png';
import brandLogoDark from '../../assets/images/brand-logo-dark.png';

const Navbar = () => {
  const { performSearch, clearSearch } = useSearch();
  const { cart } = useWishlist();
  const { currentUser, userData, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { products: liveProducts } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const handleSearch = (query) => {
    closeMenu();
    if (query.trim()) {
      performSearch(query, liveProducts);
    } else {
      clearSearch();
    }
    navigate('/AllProducts');
  };

  const NAV_CATEGORIES = [
    { label: "Bags",    key: "bag"    },
    { label: "Wallets", key: "wallet" },
    { label: "Belts",   key: "belt"   },
  ];

  return (
    <nav className="navbar" ref={drawerRef}>
      <div className="container-fluid navbar-container">

        {/* 1. LOGO */}
        <div className="nav-logo-wrap">
          <NavLink to="/" onClick={closeMenu}>
            <img
              src={brandLogoLight}
              alt="Brand Logo"
              className="logo logo-light"
            />
            <img
              src={brandLogoDark}
              alt="Brand Logo"
              className="logo logo-dark"
            />
          </NavLink>
        </div>

        {/* 2. DESKTOP NAV LINKS */}
        <ul className="nav-links-desktop">
          {NAV_CATEGORIES.map(({ label, key }) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => handleCategoryNavigation(key)}
                className={`custom-nav-btn ${activeCategory === key ? "active" : ""}`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* 3. DESKTOP SEARCH */}
        <div className="nav-search-desktop">
          <SearchModal
            products={liveProducts}
            onSearch={handleSearch}
            placeholder="Search products..."
          />
        </div>

        {/* 4. MOBILE SEARCH */}
        <div className="nav-search-mobile">
          <SearchModal
            products={liveProducts}
            onSearch={handleSearch}
            placeholder="Search..."
          />
        </div>

        {/* 5. RIGHT ACTIONS */}
        <div className="nav-actions">

          {/* DESKTOP ONLY */}
          {currentUser ? (
            <NavLink
              to="/profile"
              className="icon-btn d-none d-lg-flex p-0 align-items-center justify-content-center"
              aria-label="My Profile Page Link"
              style={{ overflow: 'hidden' }}
            >
              {userData?.photo ? (
                <img src={userData.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <FiUser />
              )}
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="d-none d-lg-flex align-items-center nav-login-btn"
            >
              Login
            </NavLink>
          )}

          {/* MOBILE DROPDOWN */}
          <div className="dropdown d-lg-none">
            {currentUser ? (
              <>
                <button
                  className="icon-btn p-0 d-flex align-items-center justify-content-center"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-label="User contextual menu"
                  onClick={closeMenu}
                  style={{ overflow: 'hidden' }}
                >
                  {userData?.photo ? (
                    <img src={userData.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <FiUser />
                  )}
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow-sm user-dropdown-menu">
                  <li>
                    <NavLink
                      to="/profile"
                      onClick={closeMenu}
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
                    <NavLink
                      to="/orders"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "dropdown-item d-flex align-items-center profile-dropdown-item active"
                          : "dropdown-item d-flex align-items-center profile-dropdown-item"
                      }
                    >
                      <FiBox className="profile-item-icon" /> My orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/wishlist"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "dropdown-item d-flex align-items-center profile-dropdown-item active"
                          : "dropdown-item d-flex align-items-center profile-dropdown-item"
                      }
                    >
                      <FaRegHeart className="profile-item-icon" /> Wish list
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/address"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "dropdown-item d-flex align-items-center profile-dropdown-item active"
                          : "dropdown-item d-flex align-items-center profile-dropdown-item"
                      }
                    >
                      <GrLocation className="profile-item-icon" /> Saved address
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/reviews"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "dropdown-item d-flex align-items-center profile-dropdown-item active"
                          : "dropdown-item d-flex align-items-center profile-dropdown-item"
                      }
                    >
                      <MdOutlineRateReview className="profile-item-icon" /> My Reviews
                    </NavLink>
                  </li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <div
                      className="dropdown-item d-flex align-items-center justify-content-between profile-dropdown-item"
                      style={{ cursor: "default" }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <BsSun className="profile-item-icon" /> Dark Theme
                      </div>
                      <div
                        className="form-check form-switch dark-theme-switch m-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="navbarThemeSwitch"
                          checked={isDark}
                          onChange={toggleTheme}
                        />
                      </div>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <button
                      onClick={async () => {
                        closeMenu();
                        await logout();
                        localStorage.removeItem("user");
                        navigate("/login");
                      }}
                      className="dropdown-item d-flex align-items-center text-danger profile-dropdown-item logout-link"
                      style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', padding: '0.25rem 1rem' }}
                    >
                      <FiLogOut className="profile-item-icon logout-icon" /> Log out
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={closeMenu}
                className="d-flex align-items-center nav-login-btn"
                style={{ marginRight: '5px' }}
              >
                Login
              </NavLink>
            )}
          </div>

          {/* Cart */}
          <NavLink
            to="/cart"
            onClick={closeMenu}
            className="icon-btn"
            aria-label="Cart"
          >
            <MdOutlineShoppingCart />
            {totalCartCount > 0 && (
              <span className="cart-badge">{totalCartCount}</span>
            )}
          </NavLink>

          {/* Hamburger */}
          <button
            className="nav-toggler"
            type="button"
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>

        </div>
      </div>

      {/* 6. MOBILE DRAWER */}
      <div className={`nav-drawer ${isMenuOpen ? "open" : ""}`}>
        <div className="nav-drawer-inner">
          {NAV_CATEGORIES.map(({ label, key }) => (
            <div key={key} className="drawer-nav-item">
              <button
                type="button"
                onClick={() => handleCategoryNavigation(key)}
                className={`drawer-nav-btn ${activeCategory === key ? "active" : ""}`}
              >
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


// import React, { useState, useEffect, useRef } from "react";
// import { MdOutlineShoppingCart, MdOutlineRateReview } from "react-icons/md";
// import { FaUserCircle, FaRegUserCircle, FaRegHeart } from "react-icons/fa";
// import { FiBox, FiLogOut } from "react-icons/fi";
// import { GrLocation } from "react-icons/gr";
// import { BsSun } from "react-icons/bs";
// import { NavLink, useNavigate, useLocation } from "react-router-dom";
// import { useSearch } from '../../context/SearchContext';
// import { useWishlist } from '../../context/WishlistContext';
// import { useProducts } from '../../context/ProductsContext';
// import SearchModal from '../User/SearchModal';
// import '../../assets/styles/Navbar.css';
// import { useAuth } from '../../context/AuthContext';

// const Navbar = () => {
//   const { performSearch, clearSearch } = useSearch();
//   const { cart } = useWishlist();
//   const { currentUser, userData, logout } = useAuth();
//   const { products: liveProducts } = useProducts();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const drawerRef = useRef(null);

//   const totalCartCount = cart ? cart.length : 0;
//   const activeCategory = location.state?.filters?.category || "";

//   // Auto-close on route change
//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [location.pathname, location.state]);

//   // Auto-close on outside click
//   useEffect(() => {
//     if (!isMenuOpen) return;
//     const handleOutsideClick = (e) => {
//       if (drawerRef.current && !drawerRef.current.contains(e.target)) {
//         setIsMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, [isMenuOpen]);

//   const closeMenu = () => setIsMenuOpen(false);

//   const handleCategoryNavigation = (categoryName) => {
//     closeMenu();
//     navigate("/AllProducts", {
//       state: { filters: { category: categoryName.toLowerCase() } },
//     });
//   };

//   const handleSearch = (query) => {
//     closeMenu();
//     if (query.trim()) {
//       performSearch(query, liveProducts);
//     } else {
//       clearSearch();
//     }
//     navigate('/AllProducts');
//   };

//   const NAV_CATEGORIES = [
//     { label: "Bags",    key: "bag"    },
//     { label: "Wallets", key: "wallet" },
//     { label: "Belts",   key: "belt"   },
//   ];

//   return (
//     <nav className="navbar" ref={drawerRef}>
//       <div className="container-fluid navbar-container">

//         {/* 1. LOGO */}
//         <div className="nav-logo-wrap">
//           <NavLink to="/" onClick={closeMenu}>
//             <img
//               src="/src/assets/images/brand-logo-light.png"
//               alt="Brand Logo"
//               className="logo"
//             />
//           </NavLink>
//         </div>

//         {/* 2. DESKTOP NAV LINKS */}
//         <ul className="nav-links-desktop">
//           {NAV_CATEGORIES.map(({ label, key }) => (
//             <li key={key}>
//               <button
//                 type="button"
//                 onClick={() => handleCategoryNavigation(key)}
//                 className={`custom-nav-btn ${activeCategory === key ? "active" : ""}`}
//               >
//                 {label}
//               </button>
//             </li>
//           ))}
//         </ul>

//         {/* 3. DESKTOP SEARCH */}
//         <div className="nav-search-desktop">
//           <SearchModal
//             products={liveProducts}
//             onSearch={handleSearch}
//             placeholder="Search products..."
//           />
//         </div>

//         {/* 4. MOBILE SEARCH */}
//         <div className="nav-search-mobile">
//           <SearchModal
//             products={liveProducts}
//             onSearch={handleSearch}
//             placeholder="Search..."
//           />
//         </div>

//         {/* 5. RIGHT ACTIONS */}
//         <div className="nav-actions">


//           {/* A. DESKTOP ONLY: Direct route navigation link jump */}
//           {currentUser ? (
//             <NavLink 
//               to="/profile" 
//               className="icon-btn d-none d-lg-flex p-0 align-items-center justify-content-center" 
//               aria-label="My Profile Page Link"
//               style={{ overflow: 'hidden', width: '30px', height: '30px', borderRadius: '50%' }}
//             >
//               {userData?.photo ? (
//                 <img src={userData.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//               ) : (
//                 <FaRegUserCircle style={{ width: '100%', height: '100%' }} />
//               )}
//             </NavLink>
//           ) : (
//             <NavLink 
//               to="/login" 
//               className="d-none d-lg-flex align-items-center nav-login-btn" 
//             >
//               Login
//             </NavLink>
//           )}


//           {/* Mobile: dropdown menu */}
//           <div className="dropdown d-lg-none">

//             {currentUser ? (
//               <>
//                 <button
//                   className="icon-btn p-0 d-flex align-items-center justify-content-center"
//                   type="button"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                   aria-label="User contextual menu"
//                   onClick={closeMenu}
//                   style={{ overflow: 'hidden', width: '28px', height: '28px', borderRadius: '50%' }}
//                 >
//                   {userData?.photo ? (
//                     <img src={userData.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                   ) : (
//                     <FaRegUserCircle style={{ width: '100%', height: '100%' }} />
//                   )}
//                 </button>
//                 <ul className="dropdown-menu dropdown-menu-end shadow-sm user-dropdown-menu">
//                   <li>
//                     <NavLink to="/profile" onClick={closeMenu} className="dropdown-item d-flex align-items-center profile-dropdown-item">
//                       {userData?.photo ? (
//                         <div style={{ width: '16px', height: '16px', borderRadius: '50%', overflow: 'hidden', marginRight: '8px' }}>
//                           <img src={userData.photo} alt="Profile Icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                         </div>
//                       ) : (
//                         <FaRegUserCircle className="profile-item-icon" />
//                       )}
//                       My profile
//                     </NavLink>
//                   </li>
//                   <li>
//                     <NavLink to="/orders" onClick={closeMenu} className="dropdown-item d-flex align-items-center profile-dropdown-item">
//                       <FiBox className="profile-item-icon" /> My orders
//                     </NavLink>
//                   </li>
//                   <li>
//                     <NavLink to="/wishlist" onClick={closeMenu} className="dropdown-item d-flex align-items-center profile-dropdown-item">
//                       <FaRegHeart className="profile-item-icon" /> Wish list
//                     </NavLink>
//                   </li>
//                   <li>
//                     <NavLink to="/address" onClick={closeMenu} className="dropdown-item d-flex align-items-center profile-dropdown-item">
//                       <GrLocation className="profile-item-icon" /> Saved address
//                     </NavLink>
//                   </li>
//                   <li>
//                     <NavLink to="/reviews" onClick={closeMenu} className="dropdown-item d-flex align-items-center profile-dropdown-item">
//                       <MdOutlineRateReview className="profile-item-icon" /> My Reviews
//                     </NavLink>
//                   </li>
//                   <li><hr className="dropdown-divider my-1" /></li>
//                   <li>
//                     <div className="dropdown-item d-flex align-items-center justify-content-between profile-dropdown-item" style={{ cursor: "default" }}>
//                       <div className="d-flex align-items-center gap-2">
//                         <BsSun className="profile-item-icon" /> Dark Theme
//                       </div>
//                       <div className="form-check form-switch m-0">
//                         <input className="form-check-input" type="checkbox" role="switch" />
//                       </div>
//                     </div>
//                   </li>
//                   <li><hr className="dropdown-divider my-1" /></li>
//                   <li>
//                     <button
//                       onClick={async () => {
//                         closeMenu();
//                         await logout();
//                         localStorage.removeItem("user");
//                         navigate("/login");
//                       }}
//                       className="dropdown-item d-flex align-items-center text-danger profile-dropdown-item logout-link"
//                       style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', padding: '0.25rem 1rem' }}
//                     >
//                       <FiLogOut className="profile-item-icon logout-icon" /> Log out
//                     </button>
//                   </li>
//                 </ul>
//               </>
//             ) : (
//               <NavLink 
//                 to="/login" 
//                 onClick={closeMenu}
//                 className="d-flex align-items-center nav-login-btn"
//                 style={{ marginRight: '5px' }}
//               >
//                 Login
//               </NavLink>
//             )}

//           </div>

//           {/* Cart */}
//           <NavLink
//             to="/cart"
//             onClick={closeMenu}
//             className="icon-btn"
//             aria-label="Cart"
//           >
//             <MdOutlineShoppingCart />
//             {totalCartCount > 0 && (
//               <span className="cart-badge">{totalCartCount}</span>
//             )}
//           </NavLink>

//           {/* Hamburger */}
//           <button
//             className="nav-toggler"
//             type="button"
//             onClick={() => setIsMenuOpen(prev => !prev)}
//             aria-label={isMenuOpen ? "Close menu" : "Open menu"}
//           >
//             {isMenuOpen ? "✕" : "☰"}
//           </button>

//         </div>
//       </div>

//       {/* 6. MOBILE DRAWER */}
//       <div className={`nav-drawer ${isMenuOpen ? "open" : ""}`}>
//         <div className="nav-drawer-inner">
//           {NAV_CATEGORIES.map(({ label, key }) => (
//             <div key={key} className="drawer-nav-item">
//               <button
//                 type="button"
//                 onClick={() => handleCategoryNavigation(key)}
//                 className={`drawer-nav-btn ${activeCategory === key ? "active" : ""}`}
//               >
//                 {label}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//     </nav>
//   );
// };

// export default Navbar;





// // import React, { useState, useEffect, useRef } from "react";
// // import { MdOutlineShoppingCart } from "react-icons/md";
// // import { FaUserCircle, FaRegUserCircle, FaRegHeart } from "react-icons/fa";
// // import { FiBox, FiLogOut } from "react-icons/fi";
// // import { GrLocation } from "react-icons/gr";
// // import { BsSun } from "react-icons/bs";
// // import { NavLink, useNavigate, useLocation } from "react-router-dom";
// // import { useSearch } from '../../context/SearchContext';
// // import { useWishlist } from '../../context/WishlistContext';
// // import SearchModal from '../User/SearchModal';
// // import { allProductsData } from '../../pages/User/Allproducts';
// // import '../../assets/styles/Navbar.css';

// // const Navbar = () => {
// //   const { performSearch, clearSearch } = useSearch();
// //   const { cart } = useWishlist();
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   const [isMenuOpen, setIsMenuOpen] = useState(false);
// //   const drawerRef = useRef(null);

// //   const totalCartCount = cart ? cart.length : 0;
// //   const activeCategory = location.state?.filters?.category || "";

// //   // ── AUTO-CLOSE: any route change closes the drawer ──────────────
// //   useEffect(() => {
// //     setIsMenuOpen(false);
// //   }, [location.pathname, location.state]);

// //   // ── AUTO-CLOSE: click anywhere outside the navbar closes drawer ─
// //   useEffect(() => {
// //     if (!isMenuOpen) return;
// //     const handleOutsideClick = (e) => {
// //       if (drawerRef.current && !drawerRef.current.contains(e.target)) {
// //         setIsMenuOpen(false);
// //       }
// //     };
// //     document.addEventListener("mousedown", handleOutsideClick);
// //     return () => document.removeEventListener("mousedown", handleOutsideClick);
// //   }, [isMenuOpen]);

// //   const closeMenu = () => setIsMenuOpen(false);

// //   const handleCategoryNavigation = (categoryName) => {
// //     closeMenu();
// //     navigate("/AllProducts", {
// //       state: { filters: { category: categoryName.toLowerCase() } },
// //     });
// //   };

// //   const handleSearch = (query) => {
// //     closeMenu();
// //     if (query.trim()) {
// //       performSearch(query, allProductsData);
// //     } else {
// //       clearSearch();
// //     }
// //     navigate('/AllProducts');
// //   };

// //   const NAV_CATEGORIES = [
// //     { label: "Bags",    key: "bag"    },
// //     { label: "Wallets", key: "wallet" },
// //     { label: "Belts",   key: "belt"   },
// //   ];

// //   return (
// //     <nav className="navbar" ref={drawerRef}>
// //       <div className="container-fluid navbar-container">

// //         {/* ── 1. LOGO ── */}
// //         <div className="nav-logo-wrap">
// //           <NavLink to="/" onClick={closeMenu}>
// //             <img
// //               src="/src/assets/images/brand-logo-light.png"
// //               alt="Brand Logo"
// //               className="logo"
// //             />
// //           </NavLink>
// //         </div>

// //         {/* ── 2. DESKTOP NAV LINKS (hidden < 992px) ── */}
// //         <ul className="nav-links-desktop">
// //           {NAV_CATEGORIES.map(({ label, key }) => (
// //             <li key={key}>
// //               <button
// //                 type="button"
// //                 onClick={() => handleCategoryNavigation(key)}
// //                 className={`custom-nav-btn ${activeCategory === key ? "active" : ""}`}
// //               >
// //                 {label}
// //               </button>
// //             </li>
// //           ))}
// //         </ul>

// //         {/* ── 3. DESKTOP SEARCH (hidden < 992px) ── */}
// //         <div className="nav-search-desktop">
// //           <SearchModal
// //             products={allProductsData}
// //             onSearch={handleSearch}
// //             placeholder="Search products..."
// //           />
// //         </div>

// //         {/* ── 4. MOBILE SEARCH (hidden ≥ 992px) ── */}
// //         <div className="nav-search-mobile">
// //           <SearchModal
// //             products={allProductsData}
// //             onSearch={handleSearch}
// //             placeholder="Search..."
// //           />
// //         </div>

// //         {/* ── 5. RIGHT ACTIONS CONTAINER ── */}
// //         <div className="nav-actions">

// //           {/* A. DESKTOP ONLY: Direct route navigation link jump */}
// //           <NavLink 
// //             to="/profile" 
// //             className="icon-btn d-none d-lg-flex" 
// //             aria-label="My Profile Page Link"
// //           >
// //             <FaUserCircle />
// //           </NavLink>

// //           {/* B. MOBILE ONLY: Bootstrap popover toggle drop menu */}
// //           <div className="dropdown d-lg-none">
// //             <button
// //               className="icon-btn"
// //               type="button"
// //               data-bs-toggle="dropdown"
// //               aria-expanded="false"
// //               aria-label="User contextual menu"
// //               onClick={closeMenu}
// //             >
// //               <FaUserCircle />
// //             </button>
// //             <ul className="dropdown-menu dropdown-menu-end shadow-sm user-dropdown-menu">
// //               <li>
// //                 <NavLink to="/profile" onClick={closeMenu} className="dropdown-item d-flex align-items-center profile-dropdown-item">
// //                   <FaRegUserCircle className="profile-item-icon" /> My profile
// //                 </NavLink>
// //               </li>
// //               <li>
// //                 <NavLink to="/orders" onClick={closeMenu} className="dropdown-item d-flex align-items-center profile-dropdown-item">
// //                   <FiBox className="profile-item-icon" /> My orders
// //                 </NavLink>
// //               </li>
// //               <li>
// //                 <NavLink to="/wishlist" onClick={closeMenu} className="dropdown-item d-flex align-items-center profile-dropdown-item">
// //                   <FaRegHeart className="profile-item-icon" /> Wish list
// //                 </NavLink>
// //               </li>
// //               <li>
// //                 <NavLink to="/address" onClick={closeMenu} className="dropdown-item d-flex align-items-center profile-dropdown-item">
// //                   <GrLocation className="profile-item-icon" /> Saved address
// //                 </NavLink>
          
// //               </li>
// //               <li>
// //                 <NavLink to="/reviews" onClick={closeMenu} className="dropdown-item d-flex align-items-center profile-dropdown-item">
// //                   <MdOutlineRateReview className="profile-item-icon" /> My Reviews
// //                 </NavLink>
// //               </li>
// //               <li><hr className="dropdown-divider my-1" /></li>
// //               <li>
// //                 <div className="dropdown-item d-flex align-items-center justify-content-between profile-dropdown-item" style={{ cursor: "default" }}>
// //                   <div className="d-flex align-items-center gap-2">
// //                     <BsSun className="profile-item-icon" /> Dark Theme
// //                   </div>
// //                   <div className="form-check form-switch m-0">
// //                     <input className="form-check-input" type="checkbox" role="switch" />
// //                   </div>
// //                 </div>
// //               </li>
// //               <li><hr className="dropdown-divider my-1" /></li>
// //               <li>
// //                 <NavLink to="/login" onClick={closeMenu} className="dropdown-item d-flex align-items-center text-danger profile-dropdown-item logout-link">
// //                   <FiLogOut className="profile-item-icon logout-icon" /> Log out
// //                 </NavLink>
// //               </li>
// //             </ul>
// //           </div>

// //           {/* UNIVERSAL CART ACTION LINK */}
// //           <NavLink
// //             to="/cart"
// //             onClick={closeMenu}
// //             className="icon-btn"
// //             aria-label="Cart"
// //           >
// //             <MdOutlineShoppingCart />
// //             {totalCartCount > 0 && (
// //               <span className="cart-badge">{totalCartCount}</span>
// //             )}
// //           </NavLink>
        

// //         {/* ── 6. HAMBURGER TOGGLE BUTTON (hidden ≥ 992px) ── */}
// //         <button
// //           className="nav-toggler"
// //           type="button"
// //           onClick={() => setIsMenuOpen(prev => !prev)}
// //           aria-label={isMenuOpen ? "Close menu" : "Open menu"}
// //         >
// //           {isMenuOpen ? "✕" : "☰"}
// //         </button>
// //         </div>

// //       </div>

// //       {/* ── 7. MOBILE NAVIGATION DRAWER ── */}
// //       <div className={`nav-drawer ${isMenuOpen ? "open" : ""}`}>
// //         <div className="nav-drawer-inner">
// //           {NAV_CATEGORIES.map(({ label, key }) => (
// //             <div key={key} className="drawer-nav-item">
// //               <button
// //                 type="button"
// //                 onClick={() => handleCategoryNavigation(key)}
// //                 className={`drawer-nav-btn ${activeCategory === key ? "active" : ""}`}
// //               >
// //                 {label}
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //     </nav>
// //   );
// // };

// // export default Navbar;

