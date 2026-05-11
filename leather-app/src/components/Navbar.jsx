import { IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { IoMdCart } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";

import "../assets/styles/Navbar.css";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container">
        {/* LOGO */}
        <a className="navbar-brand" href="#">
          <img
            src="hello.jng"
            alt="logo"
            className="logo"
          />
        </a>

        {/* MOBILE RIGHT SIDE */}
        <div className="mobile-top d-flex align-items-center gap-2 d-lg-none">
          {/* USER */}
          <button className="icon-btn">
            <FaUserCircle />
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
              <a className="nav-link" href="#">
                Home
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                Products
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                Contact
              </a>
            </li>
          </ul>

          {/* SEARCH + MOBILE ICONS */}
          <div className="search-wrapper">
            {/* SEARCH */}
            <form className="nav-form">
              <input type="search" placeholder="Search products..." />

              <button type="submit">
                <IoSearch />
              </button>
            </form>

            {/* MOBILE ICONS */}
            <div className="mobile-search-icons d-flex d-lg-none">
              <button className="icon-btn">
                <IoNotificationsOutline />
              </button>

              <button className="icon-btn">
                 <IoMdCart />
              </button>
            </div>
          </div>

          {/* DESKTOP ICONS */}
          <div className="desktop-icons d-none d-lg-flex align-items-center gap-3 ms-3">
            <button className="icon-btn">
              <IoNotificationsOutline />
            </button>

            <button className="icon-btn">
              <IoMdCart />
            </button>

            <button className="icon-btn">
              <FaUserCircle />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
