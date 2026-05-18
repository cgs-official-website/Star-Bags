import { useState } from 'react';
import Navbar from '../components/User/Navbar'
import Footer from '../components/User/Footer'
import ProductCard from '../components/User/ProductCard';
import FilterToggleBtn from '../components/User/FilterToggleBtn';
import SortBySelect from '../components/User/SortBySelect';
import ActiveFilterTags from '../components/User/ActiveFilterTags';
import FilterSidebar from '../components/User/FilterSideBar';
import '../assets/styles/AllProducts.css';

const AllProducts = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [activeFilters, setActiveFilters] = useState([
    { label: 'Hand bag', type: 'Bag' },
    { label: 'Snake Leather', type: 'Pattern' },
  ]);

  const handleRemoveFilter = (index) => {
    setActiveFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyFilter = ({ selectedBagType, priceRange }) => {
    // Update active filter tags based on sidebar selections
    setActiveFilters((prev) => [
      ...prev.filter((f) => f.type !== 'Bag'),
      { label: selectedBagType, type: 'Bag' },
    ]);
  };

  return (
    <>
    <div className="all-products-page">
      <Navbar/>

      {/* TOP BAR */}
      <div className="all-products-topbar">
        <h2 className="all-products-title">All Products</h2>
        <div className="topbar-right">
          {!showFilter ? (
            <FilterToggleBtn onClick={() => setShowFilter(true)} />
          ) : (
            <SortBySelect value={sortBy} onChange={setSortBy} />
          )}
        </div>
      </div>

      {/* ACTIVE FILTER TAGS — only when sidebar is open */}
      {showFilter && (
        <ActiveFilterTags
          filters={activeFilters}
          onRemove={handleRemoveFilter}
        />
      )}

      {/* MAIN CONTENT */}
      <div className={`all-products-main ${showFilter ? 'with-sidebar' : ''}`}>

        {/* FILTER SIDEBAR */}
        {showFilter && (
          <FilterSidebar onApply={handleApplyFilter} />
        )}

        {/* PRODUCT GRID */}
        <div className={`products-grid-wrapper ${showFilter ? 'sidebar-open' : ''}`}>
          <ProductCard />
        </div>

      </div>
      <Footer/>
    </div>
    </>
  );
};

export default AllProducts;





// import React, { useState } from "react";

// import Navbar  from "../components/User/Navbar";
// import Footer from "../components/User/Footer";
// import ProductCard  from "../components/User/ProductCard";

// import Filtersidebar from "../components/User/Filtersidebar";
// import FilterButton from "../components/User/FilterButton";

// import "../assets/styles/allproducts.css";
// import "../assets/styles/filterbutton.css";
// import OrderCard from "../components/User/OrderCard";

// const Allproducts = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const [filters, setFilters] = useState({
//     category: "",
//     size: "",
//     pattern: "",
//     colors: [],
//     priceRange: [0, 860],
//   });

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   const handleApply = () => {
//     console.log(filters);
//     setIsSidebarOpen(false); // close sidebar after applying
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="all-products-page">
//         {/* TOP SECTION */}
//         <div className="all-products-header">
//           <h1>All Products</h1>
//           <FilterButton toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
//         </div>

//         {/* MAIN CONTENT */}
//         <div className={`products-layout ${isSidebarOpen ? "sidebar-open" : ""}`}>
//           {/* FILTER SIDEBAR - only when open */}
//           {isSidebarOpen && (
//             <Filtersidebar
//               filters={filters}
//               onChange={setFilters}
//               onApply={handleApply}
//               isOpen={isSidebarOpen}
//             />
//           )}

//           {/* PRODUCT CONTENT */}
//           <div className="products-content">
//             <div className={`product-grid ${isSidebarOpen ? "three-grid" : "four-grid"}`}>
//               <ProductCard />
//             </div>
//           </div>
//         </div>
//       </div>
      

//       <Footer />
//     </>
//   );
// };

// export default Allproducts;
