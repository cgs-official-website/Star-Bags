import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import SortBySelect from '../../components/User/SortBySelect';
import FilterSideBar, { DEFAULT_FILTERS } from '../../components/User/FilterSideBar';
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProductCard from "../../components/User/ProductCard";

import "../../assets/styles/allproducts.css";

const STORAGE_KEY = 'allproducts_filters';

const allProductsData = [
  { id: 1, image: "../src/assets/images/leather1.png", name: "Premium Wallet", rating: 4.8, price: "250", realPrice: "300", offer: "17%", category: "wallet", description: "Premium leather wallet" },
  { id: 2, image: "../src/assets/images/leather1.png", name: "Leather Wallet", rating: 4.2, price: "160", realPrice: "120", offer: "20%", category: "wallet", description: "Classic leather wallet" },
  { id: 3, image: "../src/assets/images/leather1.png", name: "Luxury Wallet", rating: 4.9, price: "350", realPrice: "500", offer: "30%", category: "wallet", description: "Luxury designer wallet" },
  { id: 4, image: "../src/assets/images/leather1.png", name: "Slim Wallet",    rating: 4.2, price: "120", realPrice: "120", offer: "20%", category: "wallet", description: "Slim minimalist wallet" },
  { id: 5, image: "../src/assets/images/leather1.png", name: "Budget Wallet",  rating: 4.0, price: "80",  realPrice: "120", offer: "33%", category: "wallet", description: "Affordable everyday wallet" },
  { id: 6, image: "../src/assets/images/leather1.png", name: "Premium Belt",   rating: 4.5, price: "150", realPrice: "200", offer: "25%", category: "belt",   description: "Genuine leather belt" },
  { id: 7, image: "../src/assets/images/leather1.png", name: "Casual Belt",    rating: 4.2, price: "120", realPrice: "120", offer: "20%", category: "belt",   description: "Casual leather belt" },
  { id: 8, image: "../src/assets/images/leather1.png", name: "Travel Bag",     rating: 4.6, price: "899", realPrice: "1299", offer: "30%", category: "bag",    description: "Spacious travel bag" },
  { id: 9, image: "../src/assets/images/leather1.png", name: "Laptop Bag",     rating: 4.4, price: "599", realPrice: "999", offer: "40%", category: "bag",    description: "Secure laptop bag" },
  { id: 10, image: "../src/assets/images/leather1.png", name: "Hand Bag",      rating: 4.3, price: "499", realPrice: "799", offer: "37%", category: "bag",    description: "Elegant handbag" },
];

const saveFilters = (filters) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
};

const loadFilters = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_FILTERS, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
};

const buildActiveTags = (filters) => {
  const tags = [];
  (filters.bags ?? []).forEach((b) => tags.push({ type: 'Bag', label: b }));
  if (filters.category === 'wallet') tags.push({ type: 'Category', label: 'Wallet' });
  if (filters.category === 'belt')   tags.push({ type: 'Category', label: 'Belt' });
  if (filters.category === 'bag')    tags.push({ type: 'Category', label: 'Bag' });
  (filters.brands ?? []).forEach((b) => tags.push({ type: 'Brand', label: b }));
  if (filters.material) tags.push({ type: 'Material', label: filters.material });
  if (filters.size)     tags.push({ type: 'Size',     label: filters.size });
  if (filters.priceRange) {
    const map = {
      under500:    'Under ₹500',
      '500-1000':  '₹500 - ₹1000',
      '1000-2000': '₹1000 - ₹2000',
      above2000:   'Above ₹2000',
    };
    tags.push({ type: 'Price', label: map[filters.priceRange] ?? filters.priceRange });
  }
  return tags;
};

const AllProducts = () => {
  const location = useLocation();
  const { searchResults, shouldShowResults, searchQuery, clearSearch } = useSearch();

  const [sortBy, setSortBy] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const incoming = location.state?.filters;

    if (incoming) {
      const merged = { ...DEFAULT_FILTERS, ...incoming };
      setFilters(merged);
      saveFilters(merged);
      window.history.replaceState({}, document.title);
      return;
    }

    const saved = loadFilters();
    if (saved) {
      setFilters(saved);
    }
  }, []);

  useEffect(() => {
    saveFilters(filters);
  }, [filters]);

  const baseProducts = (shouldShowResults && searchResults.length > 0)
    ? searchResults
    : allProductsData;

  const filteredProducts = useMemo(() => {
    let products = [...baseProducts];

    if (filters.category) {
      products = products.filter(p =>
        p.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.priceRange) {
      products = products.filter(p => {
        const price = Number(p.price);
        if (filters.priceRange === 'under500')    return price < 500;
        if (filters.priceRange === '500-1000')    return price >= 500 && price <= 1000;
        if (filters.priceRange === '1000-2000')   return price >= 1000 && price <= 2000;
        if (filters.priceRange === 'above2000')   return price > 2000;
        return true;
      });
    }

    if (filters.bags && filters.bags.length > 0) {
      products = products.filter(p => {
        const searchTerm = `${p.name} ${p.category} ${p.description}`.toLowerCase();
        return filters.bags.some(bag => searchTerm.includes(bag.toLowerCase()));
      });
    }

    if (filters.brands && filters.brands.length > 0) {
      products = products.filter(p => {
        const searchTerm = `${p.name} ${p.category} ${p.description}`.toLowerCase();
        return filters.brands.some(brand => searchTerm.includes(brand.toLowerCase()));
      });
    }

    if (filters.material) {
      products = products.filter(p =>
        p.description?.toLowerCase().includes(filters.material.toLowerCase())
      );
    }

    if (filters.size) {
      products = products.filter(p =>
        p.name?.toLowerCase().includes(filters.size.toLowerCase())
      );
    }

    return products;
  }, [baseProducts, filters]);

  const sortedProducts = useMemo(() => {
    if (!sortBy) return filteredProducts;
    const sorted = [...filteredProducts];
    if (sortBy === 'price-low')  return sorted.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === 'price-high') return sorted.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === 'rating')     return sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
    return sorted;
  }, [sortBy, filteredProducts]);

  const activeTags = useMemo(() => buildActiveTags(filters), [filters]);

  const hasNoSearchResults = shouldShowResults && searchResults.length === 0;
  const hasNoFilteredResults = !hasNoSearchResults && filteredProducts.length === 0;

  const displayProducts = (hasNoSearchResults || hasNoFilteredResults)
    ? allProductsData
    : sortedProducts;

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRemoveTag = (index) => {
    const tag = activeTags[index];
    const updated = { ...filters };
    if (tag.type === 'Bag')      updated.bags       = updated.bags.filter((v) => v !== tag.label);
    if (tag.type === 'Category') updated.category   = '';
    if (tag.type === 'Brand')    updated.brands     = updated.brands.filter((v) => v !== tag.label);
    if (tag.type === 'Material') updated.material   = '';
    if (tag.type === 'Size')     updated.size       = '';
    if (tag.type === 'Pattern')  updated.pattern    = '';
    if (tag.type === 'Price')    updated.priceRange = '';
    setFilters(updated);
  };

  const handleClearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
    if (hasNoSearchResults) {
      clearSearch();
    }
  };

  return (
    <>
      <Navbar />

      <div className="all-products-page">
        <div className="all-products-topbar">
          <h2 className="all-products-title">
            All Products  {/* Changed: Always shows "All Products" */}
          </h2>
          <div className="topbar-right">
            <button className="filter-toggle-btn" onClick={() => setDrawerOpen(true)}>
              <i className="bi bi-sliders"></i> Filters
            </button>
            <SortBySelect value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        <div className="all-products-main">
          <div className="all-products-sidebar">
            <FilterSideBar
              filters={filters}
              onChange={handleFilterChange}
              activeTags={activeTags}
              onRemoveTag={handleRemoveTag}
              onClearAll={handleClearAllFilters}
            />
          </div>

          <div className="all-products-grid">
            <ProductCard products={displayProducts} />
          </div>
        </div>
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
              <FilterSideBar
                filters={filters}
                onChange={handleFilterChange}
                activeTags={activeTags}
                onRemoveTag={handleRemoveTag}
                onClearAll={handleClearAllFilters}
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

