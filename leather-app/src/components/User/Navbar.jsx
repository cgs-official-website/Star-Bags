import { IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { IoMdCart } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import '../../assets/styles/Navbar.css'

 const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container navbar-container">
        {/* LEFT SIDE LOGO */}
        <a className="navbar-brand" href="#">
          <img
            src="../src/assets/images/brand-logo-light.png"
            alt="logo"
            className="logo"
          />
        </a>

        {/* RIGHT SIDE */}
        <div className="mobile-top">
          {/* SEARCH BAR */}
          <form className="nav-form mobile-search">
            <input type="search" placeholder="Search..." />

            <button type="submit">
              <IoSearch />
            </button>
          </form>

          {/* USER */}
          <NavLink to="/signup" className="icon-btn text-dark" >
              <FaUserCircle />
            </NavLink>

          {/* CART */}
          <button className="icon-btn">
            <IoMdCart />
          </button>

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
              <a className="nav-link" href="/">
                Home
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/product">
                All Products
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/contact">
                Contact
              </a>
            </li>
          </ul>

          {/* DESKTOP SEARCH */}
          <div className="search-wrapper d-none d-lg-flex">
            <form className="nav-form">
              <input type="search" placeholder="Search products..." />

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

            <button className="icon-btn">
              <IoMdCart />
            </button>

            <NavLink to="/signup" className="icon-btn text-dark" >
              <FaUserCircle />
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;