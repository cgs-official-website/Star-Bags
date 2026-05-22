import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import SortBySelect from '../../components/User/SortBySelect';
import FilterSideBar, { DEFAULT_FILTERS } from '../../components/User/FilterSideBar';
import ActiveFilterTags from '../../components/User/ActiveFilterTags';
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProductCard from "../../components/User/ProductCard";
import "../../assets/styles/allproducts.css";

const STORAGE_KEY = 'allproducts_filters';

export const allProductsData = [
  { image: "/src/assets/images/leather1.png", name: "Premium Wallet", rating: 4.8, price: "250", realPrice: "300", offer: "17%", category: "wallet", description: "Premium leather wallet" },
  { image: "/src/assets/images/leather1.png", name: "Leather Wallet", rating: 4.2, price: "160", realPrice: "120", offer: "20%", category: "wallet", description: "Classic leather wallet" },
  { image: "/src/assets/images/leather1.png", name: "Luxury Wallet", rating: 4.9, price: "350", realPrice: "500", offer: "30%", category: "wallet", description: "Luxury designer wallet" },
  { image: "/src/assets/images/leather1.png", name: "Slim Wallet",    rating: 4.2, price: "120", realPrice: "120", offer: "20%", category: "wallet", description: "Slim minimalist wallet" },
  { image: "/src/assets/images/leather1.png", name: "Budget Wallet",  rating: 4.0, price: "80",  realPrice: "120", offer: "33%", category: "wallet", description: "Affordable everyday wallet" },
  { image: "/src/assets/images/leather1.png", name: "Belt",           rating: 4.2, price: "120", realPrice: "120", offer: "20%", category: "belt",   description: "Genuine leather belt" },
  { image: "/src/assets/images/leather1.png", name: "Bag",            rating: 4.2, price: "100", realPrice: "120", offer: "20%", category: "bag",    description: "Leather handbag" },
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

const getRelatedProducts = (query, appliedFilters, exactResults) => {
  const exactNames = new Set(exactResults.map((p) => p.name));
  return allProductsData.filter((p) => {
    if (exactNames.has(p.name)) return false;
    if (query) {
      const words = query.toLowerCase().split(' ').filter(Boolean);
      const fields = `${p.name} ${p.category} ${p.description}`.toLowerCase();
      if (words.some((w) => fields.includes(w))) return true;
    }
    if (appliedFilters.category) {
      if (p.category?.toLowerCase() === appliedFilters.category.toLowerCase()) return true;
    }
    if (appliedFilters.bags?.length > 0) {
      const fields = `${p.name} ${p.category} ${p.description}`.toLowerCase();
      if (appliedFilters.bags.some((b) => fields.includes(b.toLowerCase()))) return true;
    }
    return false;
  });
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
  if (filters.pattern)  tags.push({ type: 'Pattern',  label: filters.pattern });
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
      window.history.replaceState({}, document.title);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.state]);

  const baseProducts = (shouldShowResults && searchResults.length > 0) ? searchResults : allProductsData;

  const filteredProducts = useMemo(() => {
    let products = [...baseProducts];
    if (appliedFilters.category) {
      products = products.filter(p => p.category?.toLowerCase() === appliedFilters.category.toLowerCase());
    }
    if (appliedFilters.priceRange) {
      products = products.filter(p => {
        const price = Number(p.price);
        if (appliedFilters.priceRange === 'under500')    return price < 500;
        if (appliedFilters.priceRange === '500-1000')    return price >= 500 && price <= 1000;
        if (appliedFilters.priceRange === '1000-2000')   return price >= 1000 && price <= 2000;
        if (appliedFilters.priceRange === 'above2000')   return price > 2000;
        return true;
      });
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
    return getRelatedProducts(hasSearch ? searchQuery : '', appliedFilters, hasSearch ? searchResults : []);
  }, [sortedProducts, shouldShowResults, searchQuery, searchResults, appliedFilters, activeTags]);

  const noResultsMessage = useMemo(() => {
    if (shouldShowResults && searchQuery && activeTags.length === 0) return `We couldn't find any products matching "${searchQuery}"`;
    if (shouldShowResults && searchQuery && activeTags.length > 0) return `No products match "${searchQuery}" with the selected filters`;
    if (!shouldShowResults && activeTags.length > 0) return "No products match your current filters";
    return "No products available";
  }, [shouldShowResults, searchQuery, activeTags.length]);

  const handleApply = () => {
    const next = { ...filters };
    setAppliedFilters(next);
    setActiveTags(buildActiveTags(next));
    saveFilters(next); 
    setDrawerOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleRemoveTag = (index) => {
    const tag = activeTags[index];
    const updated = { ...appliedFilters };
    if (tag.type === 'Bag')      updated.bags       = updated.bags.filter((v) => v !== tag.label);
    if (tag.type === 'Category') updated.category   = '';
    if (tag.type === 'Brand')    updated.brands     = updated.brands.filter((v) => v !== tag.label);
    if (tag.type === 'Material') updated.material   = '';
    if (tag.type === 'Size')     updated.size       = '';
    if (tag.type === 'Pattern')  updated.pattern    = '';
    if (tag.type === 'Price')    updated.priceRange = '';
    setFilters(updated);
    setAppliedFilters(updated);
    setActiveTags(buildActiveTags(updated));
    saveFilters(updated);
  };

  const handleClearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setActiveTags([]);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      <Navbar />
      <div className="all-products-page">
        <div className="all-products-topbar">
          <h2 className="all-products-title">All Products</h2>
          <div className="topbar-right">
            <button className="filter-toggle-btn" onClick={() => setDrawerOpen(true)}>
              <i className="bi bi-sliders"></i> Filters
            </button>
            <SortBySelect value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {activeTags.length > 0 && (
          <div className="active-tags-row">
            <span className="active-tags-label">Filters</span>
            <ActiveFilterTags filters={activeTags} onRemove={handleRemoveTag} />
          </div>
        )}

        {sortedProducts.length > 0 ? (
          <div className="all-products-main">
            <div className="all-products-sidebar">
              <FilterSideBar filters={filters} onChange={setFilters} onApply={handleApply} navigateOnApply={false} />
            </div>
            <div className="all-products-grid">
              <ProductCard products={sortedProducts} />
            </div>
          </div>
        ) : (
          <>
            <div className="no-results" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1.5rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '100%', maxWidth: '280px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyToContent: 'center' }}>
                {/* FIX: Set clear standard asset layout path for the vector image file block */}
                <img src="/src/assets/images/image 77.png" alt="Empty Cart State" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#000000', margin: '0 0 0.5rem 0' }}>Your cart is empty!</h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>{noResultsMessage}</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={handleClearAllFilters} style={{ backgroundColor: '#8B5CF6', color: '#ffffff', fontSize: '16px', fontWeight: '500', padding: '10px 32px', borderRadius: '10px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)' }}>
                  Shop now
                </button>
              </div>
            </div>

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
              <FilterSideBar filters={filters} onChange={setFilters} onApply={handleApply} navigateOnApply={false} />
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default AllProducts;