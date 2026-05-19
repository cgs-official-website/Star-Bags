import { IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { IoMdCart } from "react-icons/io";
import { FaUserCircle, FaRegUserCircle, FaRegHeart } from "react-icons/fa";
import { FiBox, FiLogOut } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { BsSun } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { useSearch } from '../../context/SearchContext';
import { useState, useEffect } from 'react';
import '../../assets/styles/Navbar.css'

const Navbar = () => {
  const { performSearch, clearSearch, searchQuery } = useSearch();
  const [localSearch, setLocalSearch] = useState('');
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);

  // Fetch all products from your JSON data or API
  useEffect(() => {
    // This should match the data in your AllProducts component
    const products = [
      { image: "../src/assets/images/leather1.png", name: "Premium Wallet", rating: 4.8, price: "250", realPrice: "300", offer: "17%", category: "wallet", description: "Premium leather wallet" },
      { image: "../src/assets/images/leather1.png", name: "Leather Wallet", rating: 4.2, price: "160", realPrice: "120", offer: "20%", category: "wallet", description: "Classic leather wallet" },
      { image: "../src/assets/images/leather1.png", name: "Luxury Wallet", rating: 4.9, price: "350", realPrice: "500", offer: "30%", category: "wallet", description: "Luxury designer wallet" },
      { image: "../src/assets/images/leather1.png", name: "Slim Wallet", rating: 4.2, price: "120", realPrice: "120", offer: "20%", category: "wallet", description: "Slim minimalist wallet" },
      { image: "../src/assets/images/leather1.png", name: "Budget Wallet", rating: 4.0, price: "80", realPrice: "120", offer: "33%", category: "wallet", description: "Affordable everyday wallet" },
      { image: "../src/assets/images/leather1.png", name: "Belt", rating: 4.2, price: "120", realPrice: "120", offer: "20%", category: "belt", description: "Genuine leather belt" },
      { image: "../src/assets/images/leather1.png", name: "Bag", rating: 4.2, price: "100", realPrice: "120", offer: "20%", category: "bag", description: "Leather handbag" },
    ];
    setAllProducts(products);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      performSearch(localSearch, allProducts);
      navigate('/allProducts');
    } else {
      clearSearch();
      navigate('/allProducts');
    }
  };

  const handleInputChange = (e) => {
    setLocalSearch(e.target.value);
    if (e.target.value === '') {
      clearSearch();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container navbar-container">
        {/* LEFT SIDE LOGO */}
        <a className="navbar-brand" href="/">
          <img
            src="../src/assets/images/brand-logo-light.png"
            alt="logo"
            className="logo"
          />
        </a>

        {/* RIGHT SIDE */}
        <div className="mobile-top">
          {/* SEARCH BAR */}
          <form className="nav-form mobile-search" onSubmit={handleSearch}>
            <input 
              type="search" 
              placeholder="Search..." 
              value={localSearch}
              onChange={handleInputChange}
            />
            <button type="submit">
              <IoSearch />
            </button>
          </form>

          {/* USER */}
          <div className="dropdown">
            <button className="icon-btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <FaUserCircle />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm" style={{minWidth: "180px", borderRadius: "10px", marginTop: "8px"}}>
              <li>
                <NavLink to="/profile" className="dropdown-item d-flex align-items-center py-1 px-3" style={{fontSize: "0.95rem"}}>
                  <FaRegUserCircle className="me-2 text-muted" style={{fontSize: "1rem"}} /> My profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/orders" className="dropdown-item d-flex align-items-center py-1 px-3" style={{fontSize: "0.95rem"}}>
                  <FiBox className="me-2 text-muted" style={{fontSize: "1rem"}} /> My orders
                </NavLink>
              </li>
              <li>
                <NavLink to="/wishlist" className="dropdown-item d-flex align-items-center py-1 px-3" style={{fontSize: "0.95rem"}}>
                  <FaRegHeart className="me-2 text-muted" style={{fontSize: "1rem"}} /> Wish list
                </NavLink>
              </li>
              <li>
                <NavLink to="/address" className="dropdown-item d-flex align-items-center py-1 px-3" style={{fontSize: "0.95rem"}}>
                  <GrLocation className="me-2 text-muted" style={{fontSize: "1rem"}} /> Saved address
                </NavLink>
              </li>
              <li><hr className="dropdown-divider my-1" /></li>
              <li>
                <div className="dropdown-item d-flex align-items-center justify-content-between py-1 px-3" style={{cursor: "default", fontSize: "0.95rem"}}>
                  <div className="d-flex align-items-center"><BsSun className="me-2 text-muted" style={{fontSize: "1rem"}} /> Dark Theme</div>
                  <div className="form-check form-switch m-0">
                    <input className="form-check-input" type="checkbox" role="switch" />
                  </div>
                </div>
              </li>
              <li><hr className="dropdown-divider my-1" /></li>
              <li>
                <NavLink to="/login" className="dropdown-item d-flex align-items-center text-danger py-1 px-3" style={{fontSize: "0.95rem"}}>
                  <FiLogOut className="me-2" style={{transform: "rotate(180deg)", fontSize: "1rem"}} /> Log out
                </NavLink>
              </li>
            </ul>
          </div>

          {/* CART */}
          <NavLink to="/cart" className="icon-btn">
            <IoMdCart />
          </NavLink>

          {/* TOGGLE */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navContent"
          >
            ☰
          </button>
        </div>

        {/* NAVBAR CONTENT */}
        <div className="collapse navbar-collapse" id="navContent">
          {/* NAV LINKS */}
          <ul className="navbar-nav mx-auto nav-links">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/allProducts">
                All Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>

          {/* DESKTOP SEARCH */}
          <div className="search-wrapper d-none d-lg-flex">
            <form className="nav-form" onSubmit={handleSearch}>
              <input 
                type="search" 
                placeholder="Search products..." 
                value={localSearch}
                onChange={handleInputChange}
              />
              <button type="submit">
                <IoSearch />
              </button>
            </form>
          </div>

          {/* DESKTOP ICONS */}
          <div className="desktop-icons d-none d-lg-flex align-items-center gap-3 ms-3">
            <button className="icon-btn">
              <IoNotificationsOutline />
            </button>
            <NavLink to="/cart" className="icon-btn">
              <IoMdCart />
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





// import { IoNotificationsOutline, IoSearch } from "react-icons/io5";
// import { IoMdCart } from "react-icons/io";
// import { FaUserCircle, FaRegUserCircle, FaRegHeart } from "react-icons/fa";
// import { FiBox, FiLogOut } from "react-icons/fi";
// import { GrLocation } from "react-icons/gr";
// import { BsSun } from "react-icons/bs";
// import { NavLink } from "react-router-dom";
// import '../../assets/styles/Navbar.css'

//  const Navbar = () => {

//   return (
//     <nav className="navbar navbar-expand-lg bg-white shadow-sm">
//       <div className="container navbar-container">
//         {/* LEFT SIDE LOGO */}
//         <a className="navbar-brand" href="/">
//           <img
//             src="../src/assets/images/brand-logo-light.png"
//             alt="logo"
//             className="logo"
//           />
//         </a>

//         {/* RIGHT SIDE */}
//         <div className="mobile-top">
//           {/* SEARCH BAR */}
//           <form className="nav-form mobile-search">
//             <input type="search" placeholder="Search..." />

//             <button type="submit">
//               <IoSearch />
//             </button>
//           </form>

//           {/* USER */}

//           <div className="dropdown">
//             <button className="icon-btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">

//               <FaUserCircle />
//             </button>
//             <ul className="dropdown-menu dropdown-menu-end shadow-sm" style={{minWidth: "180px", borderRadius: "10px", marginTop: "8px"}}>
//               <li>
//                 <NavLink to="/profile" className="dropdown-item d-flex align-items-center py-1 px-3" style={{fontSize: "0.95rem"}}>
//                   <FaRegUserCircle className="me-2 text-muted" style={{fontSize: "1rem"}} /> My profile
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink to="/orders" className="dropdown-item d-flex align-items-center py-1 px-3" style={{fontSize: "0.95rem"}}>
//                   <FiBox className="me-2 text-muted" style={{fontSize: "1rem"}} /> My orders
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink to="/wishlist" className="dropdown-item d-flex align-items-center py-1 px-3" style={{fontSize: "0.95rem"}}>
//                   <FaRegHeart className="me-2 text-muted" style={{fontSize: "1rem"}} /> Wish list
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink to="/address" className="dropdown-item d-flex align-items-center py-1 px-3" style={{fontSize: "0.95rem"}}>
//                   <GrLocation className="me-2 text-muted" style={{fontSize: "1rem"}} /> Saved address
//                 </NavLink>
//               </li>
//               <li><hr className="dropdown-divider my-1" /></li>
//               <li>
//                 <div className="dropdown-item d-flex align-items-center justify-content-between py-1 px-3" style={{cursor: "default", fontSize: "0.95rem"}}>
//                   <div className="d-flex align-items-center"><BsSun className="me-2 text-muted" style={{fontSize: "1rem"}} /> Dark Theme</div>
//                   <div className="form-check form-switch m-0">
//                     <input className="form-check-input" type="checkbox" role="switch" />
//                   </div>
//                 </div>
//               </li>
//               <li><hr className="dropdown-divider my-1" /></li>
//               <li>
//                 <NavLink to="/login" className="dropdown-item d-flex align-items-center text-danger py-1 px-3" style={{fontSize: "0.95rem"}}>
//                   <FiLogOut className="me-2" style={{transform: "rotate(180deg)", fontSize: "1rem"}} /> Log out
//                 </NavLink>
//               </li>
//             </ul>
//           </div>

//           {/* CART */}
//           <NavLink to="/cart" className="icon-btn">
//             <IoMdCart />

//           </NavLink>


//           {/* TOGGLE */}
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navContent"
//           >
//             ☰
//           </button>
//         </div>

//         {/* NAVBAR CONTENT */}
//         <div className="collapse navbar-collapse" id="navContent">
//           {/* NAV LINKS */}
//           <ul className="navbar-nav mx-auto nav-links">
//             <li className="nav-item">
//               <NavLink to="/" className="nav-link">
//                 Home
//               </NavLink>
//             </li>

//             <li className="nav-item">

//               <NavLink className="nav-link" to="/allProducts">

//                 All Products
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink className="nav-link" to="/contact">
//                 Contact
//               </NavLink>
//             </li>
//           </ul>

//           {/* DESKTOP SEARCH */}
//           <div className="search-wrapper d-none d-lg-flex">
//             <form className="nav-form">
//               <input type="search" placeholder="Search products..." />

//               <button type="submit">
//                 <IoSearch />
//               </button>
//             </form>
//           </div>

//           {/* DESKTOP ICONS */}
//           <div className="desktop-icons d-none d-lg-flex align-items-center gap-3 ms-3">
//             <button className="icon-btn">
//               <IoNotificationsOutline />
//             </button>

//             <NavLink to="/cart" className="icon-btn">
//               <IoMdCart />
//             </NavLink>

//             <NavLink to="/profile" className="icon-btn">
//               <FaUserCircle />
//             </NavLink>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };


// export default Navbar;