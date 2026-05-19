import { useState } from 'react';

import SortBySelect from '../../components/User/SortBySelect';
import FilterSideBar, { DEFAULT_FILTERS } from '../../components/User/FilterSideBar';
import ActiveFilterTags from '../../components/User/ActiveFilterTags';
// import ProductCard from '../components/User/ProductCard';
import '../../assets/styles/AllProducts.css';

import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProductCard from "../../components/User/ProductCard";

// import Filtersidebar from "../../components/User/Filtersidebar";
// import FilterButton from "../../components/User/FilterButton";

import "../../assets/styles/allproducts.css";
// import "../../assets/styles/filterbutton.css";
import OrderCard from "../../components/User/OrderCard";

// <<<<<<< HEAD:leather-app/src/pages/Allproducts.jsx
const buildActiveTags = (filters) => {
  const tags = [];
  filters.bags.forEach((b)    => tags.push({ type: 'Bag',     label: b }));
  filters.wallets.forEach((w) => tags.push({ type: 'Wallet',  label: w }));
  filters.belts.forEach((b)   => tags.push({ type: 'Belt',    label: b }));
  if (filters.size)    tags.push({ type: 'Size',    label: filters.size });
  if (filters.pattern) tags.push({ type: 'Pattern', label: filters.pattern });
  return tags;
};

const AllProducts = () => {
  const [sortBy,         setSortBy]         = useState('');
  const [filters,        setFilters]        = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [activeTags,     setActiveTags]     = useState([]);
  const [drawerOpen,     setDrawerOpen]     = useState(false);

  const handleApply = () => {
    setAppliedFilters({ ...filters });
    setActiveTags(buildActiveTags(filters));
    setDrawerOpen(false);
  };

  const handleRemoveTag = (index) => {
    const tag = activeTags[index];
    const updated = { ...appliedFilters };

    if (tag.type === 'Bag')     updated.bags    = updated.bags.filter((v) => v !== tag.label);
    if (tag.type === 'Wallet')  updated.wallets = updated.wallets.filter((v) => v !== tag.label);
    if (tag.type === 'Belt')    updated.belts   = updated.belts.filter((v) => v !== tag.label);
    if (tag.type === 'Size')    updated.size    = '';
    if (tag.type === 'Pattern') updated.pattern = '';

    setFilters(updated);
    setAppliedFilters(updated);
    setActiveTags(buildActiveTags(updated));
  };

  return (
    <>
      <Navbar />

      <div className="all-products-page">

        {/* TOP BAR */}
        <div className="all-products-topbar">
          <h2 className="all-products-title">All Products</h2>
          <div className="topbar-right">
            <button
              className="filter-toggle-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open filters"
            >
              <i className="bi bi-sliders"></i> Filters
            </button>
            <SortBySelect value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* ACTIVE FILTER TAGS */}
        {activeTags.length > 0 && (
          <div className="active-tags-row">
            <span className="active-tags-label">Filters</span>
            <ActiveFilterTags filters={activeTags} onRemove={handleRemoveTag} />
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="all-products-main">

          {/* Desktop sidebar */}
          <div className="all-products-sidebar">
            <FilterSideBar
              filters={filters}
              onChange={setFilters}
              onApply={handleApply}
            />
          </div>

          {/* Product grid */}
          <div className="all-products-grid">
            <ProductCard />
          </div>

        </div>

      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="filter-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="filter-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="filter-drawer-header">
              <span className="filter-drawer-title">Filters</span>
              <button
                className="filter-drawer-close"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="filter-drawer-body">
              <FilterSideBar
                filters={filters}
                onChange={setFilters}
                onApply={handleApply}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};



export default AllProducts;
// >>>>>>> a16689dca845d93c2944bd149799ac7995bc61de:leather-app/src/pages/User/Allproducts.jsx
