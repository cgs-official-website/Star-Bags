import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import { useProducts } from '../../context/ProductsContext';
import SortBySelect from '../../components/User/SortBySelect';
import FilterSideBar, { DEFAULT_FILTERS } from '../../components/User/FilterSideBar';
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProductCard from "../../components/User/ProductCard";

import "../../assets/styles/allproducts.css";

const STORAGE_KEY = 'allproducts_filters';

// Kept as empty for legacy imports (Navbar/ProductCard fallback).
// Real data is supplied via ProductsContext.
export const allProductsData = [];

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
  (filters.material ?? []).forEach((m) => tags.push({ type: 'Material', label: m }));
  if (filters.size) tags.push({ type: 'Size', label: filters.size });
  if (filters.priceRange) {
    const map = {
      under500:    'Under ₹500',
      '500-1000':  '₹500 - ₹1000',
      '1000-2000': '₹1000 - ₹2000',
      above2000:   'Above ₹2000',
    };
    tags.push({ type: 'Price', label: map[filters.priceRange] ?? filters.priceRange });
  }
  if (filters.capacity) tags.push({ type: 'Capacity', label: filters.capacity });
  return tags;
};

const AllProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, shouldShowResults, clearSearch } = useSearch();

  // ── Live Firestore products ───────────────────────────────────────────────
  const { products: dbProducts, loading, error } = useProducts();

  const [filters, setFilters] = useState(() => {
    const incoming = location.state?.filters;
    if (incoming) {
      const merged = { ...DEFAULT_FILTERS, ...incoming };
      saveFilters(merged);
      return merged;
    }
    return loadFilters() ?? DEFAULT_FILTERS;
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [activeTags, setActiveTags]         = useState(() => buildActiveTags(filters));
  const [sortBy, setSortBy]                 = useState('');
  const [drawerOpen, setDrawerOpen]         = useState(false);

  useEffect(() => {
    const incoming = location.state?.filters;
    if (incoming) {
      const merged = { ...DEFAULT_FILTERS, ...incoming };
      applyFilters(merged);
      window.history.replaceState({}, document.title);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.state]);

  useEffect(() => {
    saveFilters(filters);
  }, [filters]);

  const applyFilters = (next) => {
    setFilters(next);
    setAppliedFilters(next);
    setActiveTags(buildActiveTags(next));
    saveFilters(next);
  };

  const handleFilterChange = (next) => applyFilters(next);

  const handleRemoveTag = (index) => {
    const tag     = activeTags[index];
    const updated = { ...filters };
    if (tag.type === 'Bag')      updated.bags       = updated.bags.filter((v) => v !== tag.label);
    if (tag.type === 'Category') updated.category   = '';
    if (tag.type === 'Brand')    updated.brands     = updated.brands.filter((v) => v !== tag.label);
    if (tag.type === 'Material') updated.material   = (updated.material ?? []).filter((v) => v !== tag.label);
    if (tag.type === 'Size')     updated.size       = '';
    if (tag.type === 'Pattern')  updated.pattern    = '';
    if (tag.type === 'Price')    updated.priceRange = '';
    if (tag.type === 'Capacity') updated.capacity   = '';
    applyFilters(updated);
  };

  const handleClearAllFilters = () => {
    applyFilters(DEFAULT_FILTERS);
    sessionStorage.removeItem(STORAGE_KEY);
    clearSearch();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleBuyNowCheckout = (product) => {
    navigate("/product", { state: { product } });
  };

  // ── Base: search results OR full Firestore list ───────────────────────────
  const baseProducts = (shouldShowResults && searchResults.length > 0)
    ? searchResults
    : dbProducts;

  const filteredProducts = useMemo(() => {
    let products = [...baseProducts];

    if (appliedFilters.category) {
      products = products.filter((p) =>
        p.category?.toLowerCase() === appliedFilters.category.toLowerCase()
      );
    }
    if (appliedFilters.priceRange) {
      products = products.filter((p) => {
        const price = Number(p.price);
        if (appliedFilters.priceRange === 'under500')  return price < 500;
        if (appliedFilters.priceRange === '500-1000')  return price >= 500  && price <= 1000;
        if (appliedFilters.priceRange === '1000-2000') return price >= 1000 && price <= 2000;
        if (appliedFilters.priceRange === 'above2000') return price > 2000;
        return true;
      });
    }
    if (appliedFilters.bags && appliedFilters.bags.length > 0) {
      products = products.filter((p) => {
        const searchTerm = `${p.name} ${p.category} ${p.description}`.toLowerCase();
        return appliedFilters.bags.some((bag) => searchTerm.includes(bag.toLowerCase()));
      });
    }
    if (appliedFilters.brands && appliedFilters.brands.length > 0) {
      products = products.filter((p) => {
        const searchTerm = `${p.name} ${p.category} ${p.description}`.toLowerCase();
        return appliedFilters.brands.some((brand) => searchTerm.includes(brand.toLowerCase()));
      });
    }
    if (appliedFilters.material && appliedFilters.material.length > 0) {
      products = products.filter((p) => {
        const searchTerm = `${p.name} ${p.description}`.toLowerCase();
        return appliedFilters.material.some((m) => searchTerm.includes(m.toLowerCase()));
      });
    }
    if (appliedFilters.size) {
      products = products.filter((p) =>
        p.name?.toLowerCase().includes(appliedFilters.size.toLowerCase()) ||
        p.size?.toLowerCase() === appliedFilters.size.toLowerCase()
      );
    }
    if (appliedFilters.capacity) {
      products = products.filter((p) =>
        p.capacity?.toLowerCase() === appliedFilters.capacity.toLowerCase() ||
        p.description?.toLowerCase().includes(appliedFilters.capacity.toLowerCase())
      );
    }

    return products;
  }, [baseProducts, appliedFilters]);

  const sortedProducts = useMemo(() => {
    if (!sortBy) return filteredProducts;
    const sorted = [...filteredProducts];
    if (sortBy === 'price-low')  return sorted.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === 'price-high') return sorted.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === 'rating')     return sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
    return sorted;
  }, [sortBy, filteredProducts]);

  const hasNoResults    = !loading && sortedProducts.length === 0;
  const displayProducts = hasNoResults ? dbProducts : sortedProducts;

  const sidebar = (
    <FilterSideBar
      filters={filters}
      onChange={handleFilterChange}
      activeTags={activeTags}
      onRemoveTag={handleRemoveTag}
      onClearAll={handleClearAllFilters}
    />
  );

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="all-products-page">
          <div className="all-products-topbar">
            <h2 className="all-products-title">All Products</h2>
          </div>
          <div className="all-products-main">
            <div className="all-products-sidebar desktop-only">{sidebar}</div>
            <div className="all-products-grid">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem 0' }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '15rem',
                      height: '22rem',
                      borderRadius: '12px',
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.4s infinite',
                    }}
                  />
                ))}
              </div>
              <style>{`
                @keyframes shimmer {
                  0%   { background-position: -200% 0; }
                  100% { background-position:  200% 0; }
                }
              `}</style>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <>
        <Navbar />
        <div
          className="all-products-page"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}
        >
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <i className="bi bi-exclamation-triangle" style={{ fontSize: '2.5rem', color: '#ef4444' }} />
            <p style={{ marginTop: '1rem', fontWeight: 500 }}>
              Failed to load products. Please try again later.
            </p>
            <small style={{ color: '#9ca3af' }}>{error}</small>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className="all-products-page">
        <div className="all-products-topbar">
          <h2 className="all-products-title">All Products</h2>
          <div className="topbar-right">
            {/* Filter button — only visible on tablet/mobile */}
            <button className="filter-toggle-btn mobile-only" onClick={() => setDrawerOpen(true)}>
              <i className="bi bi-sliders"></i> Filters
            </button>
            <SortBySelect value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        <div className="all-products-main">
          <div className="all-products-sidebar desktop-only">
            {sidebar}
          </div>

          <div className="all-products-grid">
            <ProductCard products={displayProducts} onBuyNowClick={handleBuyNowCheckout} />
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
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
              {sidebar}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AllProducts;