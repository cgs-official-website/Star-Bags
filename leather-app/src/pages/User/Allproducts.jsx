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

export const allProductsData = [
  { id: 1,  image: "../src/assets/images/leather1.png", name: "Premium Wallet", rating: 4.8, price: "250", realPrice: "300",  offer: "17%", category: "wallet", description: "Premium leather wallet" },
  { id: 2,  image: "../src/assets/images/leather1.png", name: "Leather Wallet", rating: 4.2, price: "160", realPrice: "120",  offer: "20%", category: "wallet", description: "Classic leather wallet" },
  { id: 3,  image: "../src/assets/images/leather1.png", name: "Luxury Wallet",  rating: 4.9, price: "350", realPrice: "500",  offer: "30%", category: "wallet", description: "Luxury designer wallet" },
  { id: 4,  image: "../src/assets/images/leather1.png", name: "Slim Wallet",    rating: 4.2, price: "120", realPrice: "120",  offer: "20%", category: "wallet", description: "Slim minimalist wallet" },
  { id: 5,  image: "../src/assets/images/leather1.png", name: "Budget Wallet",  rating: 4.0, price: "80",  realPrice: "120",  offer: "33%", category: "wallet", description: "Affordable everyday wallet" },
  { id: 6,  image: "../src/assets/images/leather1.png", name: "Premium Belt",   rating: 4.5, price: "150", realPrice: "200",  offer: "25%", category: "belt",   description: "Genuine leather belt" },
  { id: 7,  image: "../src/assets/images/leather1.png", name: "Casual Belt",    rating: 4.2, price: "120", realPrice: "120",  offer: "20%", category: "belt",   description: "Casual leather belt" },
  { id: 8,  image: "../src/assets/images/leather1.png", name: "Travel Bag",     rating: 4.6, price: "899", realPrice: "1299", offer: "30%", category: "bag",    description: "Spacious travel bag" },
  { id: 9,  image: "../src/assets/images/leather1.png", name: "Laptop Bag",     rating: 4.4, price: "599", realPrice: "999",  offer: "40%", category: "bag",    description: "Secure laptop bag" },
  { id: 10, image: "../src/assets/images/leather1.png", name: "Hand Bag",       rating: 4.3, price: "499", realPrice: "799",  offer: "37%", category: "bag",    description: "Elegant handbag" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
  if (filters.material)   tags.push({ type: 'Material', label: filters.material });
  if (filters.size)       tags.push({ type: 'Size',     label: filters.size });
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

const getRelatedProducts = (searchQuery, appliedFilters, searchResults) => {
  if (appliedFilters.category) {
    return allProductsData
      .filter((p) => p.category !== appliedFilters.category)
      .slice(0, 6);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    const broad = allProductsData.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
    if (broad.length > 0) return broad.slice(0, 6);
  }
  return allProductsData.slice(0, 6);
};

// ─── Component ───────────────────────────────────────────────────────────────

const AllProducts = () => {
  const location = useLocation();
  const { searchResults, shouldShowResults, searchQuery, clearSearch } = useSearch();

  // Initialise filters from navigation state → session storage → defaults
  const [filters, setFilters] = useState(() => {
    const incoming = location.state?.filters;
    if (incoming) {
      const merged = { ...DEFAULT_FILTERS, ...incoming };
      saveFilters(merged);
      return merged;
    }
    return loadFilters() ?? DEFAULT_FILTERS;
  });

  // appliedFilters is kept in sync with filters at all times.
  // The sidebar calls onChange which triggers handleFilterChange,
  // which updates BOTH states immediately — giving real-time filtering.
  // The mobile drawer's Apply button does the same via handleApply.
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [activeTags, setActiveTags]         = useState(() => buildActiveTags(filters));
  const [sortBy, setSortBy]                 = useState('');
  const [drawerOpen, setDrawerOpen]         = useState(false);

  // React to category navigation from Navbar / elsewhere
  useEffect(() => {
    const incoming = location.state?.filters;
    if (incoming) {
      const merged = { ...DEFAULT_FILTERS, ...incoming };
      applyFilters(merged);
      window.history.replaceState({}, document.title);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.state]);

  // Persist filters to session storage whenever they change
  useEffect(() => {
    saveFilters(filters);
  }, [filters]);

  // ── Core helper: update all filter-related state at once ─────────────────
  // This is the single source of truth for applying any filter change.
  const applyFilters = (next) => {
    const tags = buildActiveTags(next);
    setFilters(next);
    setAppliedFilters(next);
    setActiveTags(tags);
    saveFilters(next);
  };

  // ── Handlers ─────────────────────────────────────────────────────────────

  // Called by FilterSideBar's onChange on every interaction (real-time).
  const handleFilterChange = (next) => {
    applyFilters(next);
  };

  // Called by the mobile drawer's Apply button.
  const handleApply = () => {
    applyFilters(filters);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleRemoveTag = (index) => {
    const tag     = activeTags[index];
    const updated = { ...filters };
    if (tag.type === 'Bag')      updated.bags       = updated.bags.filter((v) => v !== tag.label);
    if (tag.type === 'Category') updated.category   = '';
    if (tag.type === 'Brand')    updated.brands     = updated.brands.filter((v) => v !== tag.label);
    if (tag.type === 'Material') updated.material   = '';
    if (tag.type === 'Size')     updated.size       = '';
    if (tag.type === 'Pattern')  updated.pattern    = '';
    if (tag.type === 'Price')    updated.priceRange = '';
    applyFilters(updated);
  };

  const handleClearAllFilters = () => {
    applyFilters(DEFAULT_FILTERS);
    sessionStorage.removeItem(STORAGE_KEY);
    clearSearch();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // ── Derived data ──────────────────────────────────────────────────────────

  const baseProducts = (shouldShowResults && searchResults.length > 0)
    ? searchResults
    : allProductsData;

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
        if (appliedFilters.priceRange === 'under500')    return price < 500;
        if (appliedFilters.priceRange === '500-1000')    return price >= 500  && price <= 1000;
        if (appliedFilters.priceRange === '1000-2000')   return price >= 1000 && price <= 2000;
        if (appliedFilters.priceRange === 'above2000')   return price > 2000;
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

    if (appliedFilters.material) {
      products = products.filter((p) =>
        p.description?.toLowerCase().includes(appliedFilters.material.toLowerCase())
      );
    }

    if (appliedFilters.size) {
      products = products.filter((p) =>
        p.name?.toLowerCase().includes(appliedFilters.size.toLowerCase())
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

  const relatedProducts = useMemo(() => {
    if (sortedProducts.length > 0) return [];
    const hasSearch  = shouldShowResults && !!searchQuery;
    const hasFilters = activeTags.length > 0;
    if (!hasSearch && !hasFilters) return [];
    return getRelatedProducts(
      hasSearch ? searchQuery : '',
      appliedFilters,
      hasSearch ? searchResults : []
    );
  }, [sortedProducts, shouldShowResults, searchQuery, searchResults, appliedFilters, activeTags]);

  const noResultsMessage = useMemo(() => {
    if (shouldShowResults && searchQuery && activeTags.length === 0)
      return `We couldn't find any products matching "${searchQuery}"`;
    if (shouldShowResults && searchQuery && activeTags.length > 0)
      return `No products match "${searchQuery}" with the selected filters`;
    if (!shouldShowResults && activeTags.length > 0)
      return 'No products match your current filters';
    return 'No products available';
  }, [shouldShowResults, searchQuery, activeTags.length]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />

      <div className="all-products-page">

        {/* ── Top bar ── */}
        <div className="all-products-topbar">
          <h2 className="all-products-title">All Products</h2>
          <div className="topbar-right">
            <button className="filter-toggle-btn" onClick={() => setDrawerOpen(true)}>
              <i className="bi bi-sliders"></i> Filters
            </button>
            <SortBySelect value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* ── Main content ── */}
        {sortedProducts.length > 0 ? (
          <div className="all-products-main">
            <div className="all-products-sidebar">
              {/* onChange = handleFilterChange for real-time filtering */}
              <FilterSideBar
                filters={filters}
                onChange={handleFilterChange}
                activeTags={activeTags}
                onRemoveTag={handleRemoveTag}
                onClearAll={handleClearAllFilters}
              />
            </div>
            <div className="all-products-grid">
              <ProductCard products={sortedProducts} />
            </div>
          </div>
        ) : (
          <>
            {/* ── Empty / no-results state ── */}
            <div
              className="no-results"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '280px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/src/assets/images/image 77.png"
                  alt="No results"
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#000000', margin: '0 0 0.5rem 0' }}>
                No products found!
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
                {noResultsMessage}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={handleClearAllFilters}
                  style={{
                    backgroundColor: '#8B5CF6',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    padding: '10px 32px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
                  }}
                >
                  Shop now
                </button>
              </div>
            </div>

            {/* ── Related products ── */}
            {relatedProducts.length > 0 && (
              <div className="related-products-section">
                <h3 className="related-products-title">Related Products</h3>
                <div className="all-products-grid">
                  <ProductCard products={relatedProducts} />
                </div>
              </div>
            )}
          </>
        )}
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
              {/* Drawer also uses handleFilterChange for consistency */}
              <FilterSideBar
                filters={filters}
                onChange={handleFilterChange}
                activeTags={activeTags}
                onRemoveTag={handleRemoveTag}
                onClearAll={handleClearAllFilters}
              />
            </div>
            <div className="filter-drawer-footer">
              <button className="apply-filters-btn" onClick={handleApply}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AllProducts;