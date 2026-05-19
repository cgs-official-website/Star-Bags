// AllProducts.jsx - Now works perfectly with search!
import { useState, useMemo, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';
import SortBySelect from '../../components/User/SortBySelect';
import FilterSideBar, { DEFAULT_FILTERS } from '../../components/User/FilterSideBar';
import ActiveFilterTags from '../../components/User/ActiveFilterTags';
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProductCard from "../../components/User/ProductCard";
import "../../assets/styles/allproducts.css";

// Your test JSON data
const allProductsData = [
  { image: "../src/assets/images/leather1.png", name: "Premium Wallet", rating: 4.8, price: "250", realPrice: "300", offer: "17%", category: "wallet", description: "Premium leather wallet" },
  { image: "../src/assets/images/leather1.png", name: "Leather Wallet", rating: 4.2, price: "160", realPrice: "120", offer: "20%", category: "wallet", description: "Classic leather wallet" },
  { image: "../src/assets/images/leather1.png", name: "Luxury Wallet", rating: 4.9, price: "350", realPrice: "500", offer: "30%", category: "wallet", description: "Luxury designer wallet" },
  { image: "../src/assets/images/leather1.png", name: "Slim Wallet", rating: 4.2, price: "120", realPrice: "120", offer: "20%", category: "wallet", description: "Slim minimalist wallet" },
  { image: "../src/assets/images/leather1.png", name: "Budget Wallet", rating: 4.0, price: "80", realPrice: "120", offer: "33%", category: "wallet", description: "Affordable everyday wallet" },
  { image: "../src/assets/images/leather1.png", name: "Belt", rating: 4.2, price: "120", realPrice: "120", offer: "20%", category: "belt", description: "Genuine leather belt" },
  { image: "../src/assets/images/leather1.png", name: "Bag", rating: 4.2, price: "100", realPrice: "120", offer: "20%", category: "bag", description: "Leather handbag" },
];

const AllProducts = () => {
  const { searchResults, shouldShowResults, searchQuery, clearSearch } = useSearch();
  const [sortBy, setSortBy] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [activeTags, setActiveTags] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Determine which products to show (search results or all products)
  const baseProducts = (shouldShowResults && searchResults.length > 0) ? searchResults : allProductsData;

  // Apply filters to the products
  const filteredProducts = useMemo(() => {
    let products = [...baseProducts];
    
    // Apply category filter
    if (appliedFilters.category) {
      products = products.filter(p => 
        p.category?.toLowerCase() === appliedFilters.category.toLowerCase()
      );
    }
    
    // Apply price filter
    if (appliedFilters.priceRange) {
      products = products.filter(p => {
        const price = Number(p.price);
        if (appliedFilters.priceRange === 'under500') return price < 500;
        if (appliedFilters.priceRange === '500-1000') return price >= 500 && price <= 1000;
        if (appliedFilters.priceRange === '1000-2000') return price >= 1000 && price <= 2000;
        if (appliedFilters.priceRange === 'above2000') return price > 2000;
        return true;
      });
    }
    
    return products;
  }, [baseProducts, appliedFilters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    if (!sortBy) return filteredProducts;
    
    const sorted = [...filteredProducts];
    if (sortBy === 'price-low') {
      return sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      return sorted.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'rating') {
      return sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
    }
    return sorted;
  }, [sortBy, filteredProducts]);

  const buildActiveTags = (filters) => {
    const tags = [];
    (filters.bags ?? []).forEach((b) => tags.push({ type: 'Bag', label: b }));
    if (filters.category === 'wallet') tags.push({ type: 'Category', label: 'Wallet' });
    if (filters.category === 'belt') tags.push({ type: 'Category', label: 'Belt' });
    if (filters.category === 'bag') tags.push({ type: 'Category', label: 'Bag' });
    (filters.brands ?? []).forEach((b) => tags.push({ type: 'Brand', label: b }));
    if (filters.material) tags.push({ type: 'Material', label: filters.material });
    if (filters.size) tags.push({ type: 'Size', label: filters.size });
    if (filters.pattern) tags.push({ type: 'Pattern', label: filters.pattern });
    if (filters.priceRange) {
      let priceLabel = '';
      if (filters.priceRange === 'under500') priceLabel = 'Under ₹500';
      if (filters.priceRange === '500-1000') priceLabel = '₹500 - ₹1000';
      if (filters.priceRange === '1000-2000') priceLabel = '₹1000 - ₹2000';
      if (filters.priceRange === 'above2000') priceLabel = 'Above ₹2000';
      tags.push({ type: 'Price', label: priceLabel });
    }
    return tags;
  };

  const handleApply = () => {
    setAppliedFilters({ ...filters });
    setActiveTags(buildActiveTags(filters));
    setDrawerOpen(false);
  };

  const handleRemoveTag = (index) => {
    const tag = activeTags[index];
    const updated = { ...appliedFilters };
    if (tag.type === 'Bag') updated.bags = updated.bags.filter((v) => v !== tag.label);
    if (tag.type === 'Category') updated.category = '';
    if (tag.type === 'Brand') updated.brands = updated.brands.filter((v) => v !== tag.label);
    if (tag.type === 'Material') updated.material = '';
    if (tag.type === 'Size') updated.size = '';
    if (tag.type === 'Pattern') updated.pattern = '';
    if (tag.type === 'Price') updated.priceRange = '';
    setFilters(updated);
    setAppliedFilters(updated);
    setActiveTags(buildActiveTags(updated));
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  return (
    <>
      <Navbar />
      <div className="all-products-page">
        <div className="all-products-topbar">
          <h2 className="all-products-title">
            {shouldShowResults ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h2>
          <div className="topbar-right">
            {shouldShowResults && (
              <button className="clear-search-btn" onClick={handleClearSearch}>
                <i className="bi bi-x-circle"></i> Clear Search
              </button>
            )}
            <button className="filter-toggle-btn" onClick={() => setDrawerOpen(true)}>
              <i className="bi bi-sliders"></i> Filters
            </button>
            <SortBySelect value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Search Summary */}
        {shouldShowResults && (
          <div className="search-summary">
            <p>
              Found <strong>{sortedProducts.length}</strong> product{sortedProducts.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        )}

        {activeTags.length > 0 && (
          <div className="active-tags-row">
            <span className="active-tags-label">Filters</span>
            <ActiveFilterTags filters={activeTags} onRemove={handleRemoveTag} />
          </div>
        )}

        {/* No Results Message */}
        {shouldShowResults && sortedProducts.length === 0 && (
          <div className="no-results">
            <i className="bi bi-search" style={{ fontSize: '48px', color: '#ccc' }}></i>
            <h3>No products found</h3>
            <p>We couldn't find any products matching "{searchQuery}"</p>
            <button className="btn btn-primary" onClick={handleClearSearch}>
              Browse All Products
            </button>
          </div>
        )}

        {sortedProducts.length > 0 && (
          <div className="all-products-main">
            <div className="all-products-sidebar">
              <FilterSideBar filters={filters} onChange={setFilters} onApply={handleApply} />
            </div>
            
            <div className="all-products-grid">
              <ProductCard products={sortedProducts} />
            </div>
          </div>
        )}
      </div>

      {drawerOpen && (
        <div className="filter-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="filter-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="filter-drawer-header">
              <span className="filter-drawer-title">Filters</span>
              <button className="filter-drawer-close" onClick={() => setDrawerOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="filter-drawer-body">
              <FilterSideBar filters={filters} onChange={setFilters} onApply={handleApply} />
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default AllProducts;





// // AllProducts.jsx - Now works perfectly!
// import { useState, useMemo } from 'react';
// import SortBySelect from '../../components/User/SortBySelect';
// import FilterSideBar, { DEFAULT_FILTERS } from '../../components/User/FilterSideBar';
// import ActiveFilterTags from '../../components/User/ActiveFilterTags';
// import Navbar from "../../components/User/Navbar";
// import Footer from "../../components/User/Footer";
// import ProductCard from "../../components/User/ProductCard"; // Original import works!
// import "../../assets/styles/allproducts.css";

// // Your test JSON data
// const allProductsData = [
//   { image: "../src/assets/images/leather1.png", name: "Premium Wallet", rating: 4.8, price: "250", realPrice: "300", offer: "17%" },
//   { image: "../src/assets/images/leather1.png", name: "Leather Wallet", rating: 4.2, price: "160", realPrice: "120", offer: "20%" },
//   { image: "../src/assets/images/leather1.png", name: "Luxury Wallet", rating: 4.9, price: "350", realPrice: "500", offer: "30%" },
//   { image: "../src/assets/images/leather1.png", name: "Slim Wallet", rating: 4.2, price: "120", realPrice: "120", offer: "20%" },
//   { image: "../src/assets/images/leather1.png", name: "Budget Wallet", rating: 4.0, price: "80", realPrice: "120", offer: "33%" },
//   { image: "../src/assets/images/leather1.png", name: "Belt", rating: 4.2, price: "120", realPrice: "120", offer: "20%" },
//   { image: "../src/assets/images/leather1.png", name: "Bag", rating: 4.2, price: "100", realPrice: "120", offer: "20%" },
// ];

// const AllProducts = () => {
//   const [sortBy, setSortBy] = useState('');
//   const [filters, setFilters] = useState(DEFAULT_FILTERS);
//   const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
//   const [activeTags, setActiveTags] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   // Sort products when dropdown changes
//   const sortedProducts = useMemo(() => {
//     if (!sortBy) return allProductsData;
    
//     const sorted = [...allProductsData];
//     if (sortBy === 'price-low') {
//       return sorted.sort((a, b) => Number(a.price) - Number(b.price));
//     } else if (sortBy === 'price-high') {
//       return sorted.sort((a, b) => Number(b.price) - Number(a.price));
//     }
//     return sorted;
//   }, [sortBy]);

//   const buildActiveTags = (filters) => {
//     const tags = [];
//     (filters.bags ?? []).forEach((b) => tags.push({ type: 'Bag', label: b }));
//     if (filters.category === 'wallet') tags.push({ type: 'Category', label: 'Wallet' });
//     if (filters.category === 'belt') tags.push({ type: 'Category', label: 'Belt' });
//     (filters.brands ?? []).forEach((b) => tags.push({ type: 'Brand', label: b }));
//     if (filters.material) tags.push({ type: 'Material', label: filters.material });
//     if (filters.size) tags.push({ type: 'Size', label: filters.size });
//     if (filters.pattern) tags.push({ type: 'Pattern', label: filters.pattern });
//     return tags;
//   };

//   const handleApply = () => {
//     setAppliedFilters({ ...filters });
//     setActiveTags(buildActiveTags(filters));
//     setDrawerOpen(false);
//   };

//   const handleRemoveTag = (index) => {
//     const tag = activeTags[index];
//     const updated = { ...appliedFilters };
//     if (tag.type === 'Bag') updated.bags = updated.bags.filter((v) => v !== tag.label);
//     if (tag.type === 'Category') updated.category = '';
//     if (tag.type === 'Brand') updated.brands = updated.brands.filter((v) => v !== tag.label);
//     if (tag.type === 'Material') updated.material = '';
//     if (tag.type === 'Size') updated.size = '';
//     if (tag.type === 'Pattern') updated.pattern = '';
//     setFilters(updated);
//     setAppliedFilters(updated);
//     setActiveTags(buildActiveTags(updated));
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="all-products-page">
//         <div className="all-products-topbar">
//           <h2 className="all-products-title">All Products</h2>
//           <div className="topbar-right">
//             <button className="filter-toggle-btn" onClick={() => setDrawerOpen(true)}>
//               <i className="bi bi-sliders"></i> Filters
//             </button>
//             <SortBySelect value={sortBy} onChange={setSortBy} />
//           </div>
//         </div>

//         {activeTags.length > 0 && (
//           <div className="active-tags-row">
//             <span className="active-tags-label">Filters</span>
//             <ActiveFilterTags filters={activeTags} onRemove={handleRemoveTag} />
//           </div>
//         )}

//         <div className="all-products-main">
//           <div className="all-products-sidebar">
//             <FilterSideBar filters={filters} onChange={setFilters} onApply={handleApply} />
//           </div>
          
//           <div className="all-products-grid">
//             {/* Pass sorted products to ProductCard */}
//             <ProductCard products={sortedProducts} />
//           </div>
//         </div>
//       </div>

//       {drawerOpen && (
//         <div className="filter-overlay" onClick={() => setDrawerOpen(false)}>
//           <div className="filter-drawer" onClick={(e) => e.stopPropagation()}>
//             <div className="filter-drawer-header">
//               <span className="filter-drawer-title">Filters</span>
//               <button className="filter-drawer-close" onClick={() => setDrawerOpen(false)}>
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>
//             <div className="filter-drawer-body">
//               <FilterSideBar filters={filters} onChange={setFilters} onApply={handleApply} />
//             </div>
//           </div>
//         </div>
//       )}
//       <Footer />
//     </>
//   );
// };

// export default AllProducts;