import React, { useState } from "react";

import { Navbar } from "../components/User/Navbar";
import Footer from "../components/User/Footer";
import { ProductCard } from "../components/User/ProductCard";

import Filtersidebar from "../components/User/Filtersidebar";
import FilterButton from "../components/User/FilterButton";

import "../assets/styles/allproducts.css";
import "../assets/styles/filterbutton.css";

export const Allproducts = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    size: "",
    pattern: "",
    colors: [],
    priceRange: [0, 860],
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleApply = () => {
    console.log(filters);
    setIsSidebarOpen(false); // close sidebar after applying
  };

  return (
    <>
      <Navbar />

      <div className="all-products-page">
        {/* TOP SECTION */}
        <div className="all-products-header">
          <h1>All Products</h1>
          <FilterButton toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
        </div>

        {/* MAIN CONTENT */}
        <div className={`products-layout ${isSidebarOpen ? "sidebar-open" : ""}`}>
          {/* FILTER SIDEBAR - only when open */}
          {isSidebarOpen && (
            <Filtersidebar
              filters={filters}
              onChange={setFilters}
              onApply={handleApply}
              isOpen={isSidebarOpen}
            />
          )}

          {/* PRODUCT CONTENT */}
          <div className="products-content">
            <div className={`product-grid ${isSidebarOpen ? "three-grid" : "four-grid"}`}>
              <ProductCard />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
