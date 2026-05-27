import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import SortBySelect from '../../components/User/SortBySelect';
import FilterSideBar, { DEFAULT_FILTERS } from '../../components/User/FilterSideBar';
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProductCard from "../../components/User/ProductCard";

import "../../assets/styles/allproducts.css";

const STORAGE_KEY = 'allproducts_filters';

// ─── COMPREHENSIVE PRODUCT ENHANCED DATASET ARRAY ───
export const allProductsData = [
  { 
    id: 1,  
    image: "../src/assets/images/leather1.png", 
    name: "Premium Wallet", 
    rating: 4.8, 
    price: "250", 
    realPrice: "300",  
    offer: "17%", 
    category: "wallet", 
    productId: "SBP-WLT-00001",
    brandName: "Krish Leather Factory",
    material: "Genuine Leather, Premium Inner Lining",
    description: "Premium quality bifold leather wallet with multiple card slots and an elegant smooth textured finish." 
  },
  { 
    id: 2,  
    image: "../src/assets/images/leather1.png", 
    name: "Leather Wallet", 
    rating: 4.2, 
    price: "160", 
    realPrice: "200",  
    offer: "20%", 
    category: "wallet", 
    productId: "SBP-WLT-00002",
    brandName: "Krish Leather Factory",
    material: "Genuine Top-Grain Leather, RFID Lining",
    description: "Classic genuine leather wallet tailored for daily utility usage with high scratch resistance." 
  },
  { 
    id: 3,  
    image: "../src/assets/images/leather1.png", 
    name: "Luxury Wallet",  
    rating: 4.9, price: "350", 
    realPrice: "500",  
    offer: "30%", 
    category: "wallet", 
    productId: "SBP-WLT-00003",
    brandName: "Krish Leather Factory",
    material: "Full-Grain Italian Leather, Soft Silk Lining",
    description: "Luxury designer leather wallet with premium hand-stitched detailing and sleek golden corner borders." 
  },
  { 
    id: 4,  
    image: "../src/assets/images/leather1.png", 
    name: "Slim Wallet",    
    rating: 4.2, 
    price: "120", 
    realPrice: "150",  
    offer: "20%", 
    category: "wallet", 
    productId: "SBP-WLT-00004",
    brandName: "Krish Leather Factory",
    material: "Genuine Suede Leather, Minimalist Elastic Core",
    description: "Slim minimalist front pocket wallet designed for a modern streamlined card-carrying experience." 
  },
  { 
    id: 5,  
    image: "../src/assets/images/leather1.png", 
    name: "Budget Wallet",  
    rating: 4.0, 
    price: "80",  
    realPrice: "120",  
    offer: "33%", 
    category: "wallet", 
    productId: "SBP-WLT-00005",
    brandName: "Krish Leather Factory",
    material: "PU Leather Blend, Polystyrene Lining",
    description: "Affordable everyday wallet featuring lightweight robust construction and durable coin pouch accents." 
  },
  { 
    id: 6,  
    image: "../src/assets/images/leather1.png", 
    name: "Premium Belt",   
    rating: 4.5, 
    price: "150", 
    realPrice: "200",  
    offer: "25%", 
    category: "belt",   
    productId: "SBP-BLT-00001",
    brandName: "Krish Leather Factory",
    material: "Genuine Top-Grain Leather, Heavy Steel Buckle",
    description: "Genuine top-grain leather apparel belt with solid steel buckle crafted for formal attire matching." 
  },
  { 
    id: 7,  
    image: "../src/assets/images/leather1.png", 
    name: "Casual Belt",    
    rating: 4.2, 
    price: "120", 
    realPrice: "155",  
    offer: "20%", 
    category: "belt",   
    productId: "SBP-BLT-00002",
    brandName: "Krish Leather Factory",
    material: "Distressed Vintage Leather, Solid Brass Hardware",
    description: "Casual leather belt designed to match perfectly with denim attire and rugged boot aesthetics." 
  },
  { 
    id: 8,  
    image: "../src/assets/images/leather1.png", 
    name: "Travel Bag",     
    rating: 4.6, 
    price: "899", 
    realPrice: "1299", 
    offer: "30%", 
    category: "bag",    
    productId: "SBP-BAG-00001",
    brandName: "Krish Leather Factory",
    material: "Waterproof Leather Canvas, Reinforced Nylon Inner",
    description: "Spacious heavy-duty multi-compartment travel bag for weekend trips and long-haul luggage commutes." 
  },
  { 
    id: 9,  
    image: "../src/assets/images/leather1.png", 
    name: "Laptop Bag",     
    rating: 4.4, 
    price: "599", 
    realPrice: "999",  
    offer: "40%", 
    category: "bag",    
    productId: "SBP-BAG-00002",
    brandName: "Krish Leather Factory",
    material: "Premium Nappa Leather, Shock-Absorbing Foam Padding",
    description: "Secure shockproof laptop bag with designated tech organizer slots and comfortable shoulder straps." 
  },
  { 
    id: 10, 
    image: "../src/assets/images/leather1.png", 
    name: "Hand Bag",       
    rating: 4.5, 
    price: "499", 
    realPrice: "799",  
    offer: "37%", 
    category: "bag",    
    productId: "SBP-BAG-00003",
    brandName: "Krish Leather Factory",
    material: "Genuine Leather, Premium Inner Lining",
    description: "Premium stitched leather detailing, sleek craftsmanship, and smart storage compartments—designed for everyday convenience and built to last." 
  },
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
    navigate("/product", {
      state: { product }
    });
  };

  const baseProducts = (shouldShowResults && searchResults.length > 0) ? searchResults : allProductsData;

  const filteredProducts = useMemo(() => {
    let products = [...baseProducts];
    if (appliedFilters.category) {
      products = products.filter((p) => p.category?.toLowerCase() === appliedFilters.category.toLowerCase());
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
      products = products.filter((p) => p.name?.toLowerCase().includes(appliedFilters.size.toLowerCase()) || p.size?.toLowerCase() === appliedFilters.size.toLowerCase());
    }
    if (appliedFilters.capacity) {
      products = products.filter((p) => p.capacity?.toLowerCase() === appliedFilters.capacity.toLowerCase() || p.description?.toLowerCase().includes(appliedFilters.capacity.toLowerCase()));
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

  const hasNoResults    = sortedProducts.length === 0;
  const displayProducts = hasNoResults ? allProductsData : sortedProducts;

  const sidebar = (
    <FilterSideBar
      filters={filters}
      onChange={handleFilterChange}
      activeTags={activeTags}
      onRemoveTag={handleRemoveTag}
      onClearAll={handleClearAllFilters}
    />
  );

  return (
    <>
      <Navbar />
      <div className="all-products-page">
        <div className="all-products-topbar">
          <h2 className="all-products-title">All Products</h2>
          <div className="topbar-right">
            {/* Filter button - only visible on tablet/mobile */}
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



// import { useState, useMemo, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useSearch } from '../../context/SearchContext';
// import SortBySelect from '../../components/User/SortBySelect';
// import FilterSideBar, { DEFAULT_FILTERS } from '../../components/User/FilterSideBar';
// import Navbar from "../../components/User/Navbar";
// import Footer from "../../components/User/Footer";
// import ProductCard from "../../components/User/ProductCard";

// import "../../assets/styles/allproducts.css";

// const STORAGE_KEY = 'allproducts_filters';

// export const allProductsData = [
//   { id: 1,  image: "../src/assets/images/leather1.png", name: "Premium Wallet", rating: 4.8, price: "250", realPrice: "300",  offer: "17%", category: "wallet", description: "Premium leather wallet" },
//   { id: 2,  image: "../src/assets/images/leather1.png", name: "Leather Wallet", rating: 4.2, price: "160", realPrice: "120",  offer: "20%", category: "wallet", description: "Classic leather wallet" },
//   { id: 3,  image: "../src/assets/images/leather1.png", name: "Luxury Wallet",  rating: 4.9, price: "350", realPrice: "500",  offer: "30%", category: "wallet", description: "Luxury designer wallet" },
//   { id: 4,  image: "../src/assets/images/leather1.png", name: "Slim Wallet",    rating: 4.2, price: "120", realPrice: "120",  offer: "20%", category: "wallet", description: "Slim minimalist wallet" },
//   { id: 5,  image: "../src/assets/images/leather1.png", name: "Budget Wallet",  rating: 4.0, price: "80",  realPrice: "120",  offer: "33%", category: "wallet", description: "Affordable everyday wallet" },
//   { id: 6,  image: "../src/assets/images/leather1.png", name: "Premium Belt",   rating: 4.5, price: "150", realPrice: "200",  offer: "25%", category: "belt",   description: "Genuine leather belt" },
//   { id: 7,  image: "../src/assets/images/leather1.png", name: "Casual Belt",    rating: 4.2, price: "120", realPrice: "120",  offer: "20%", category: "belt",   description: "Casual leather belt" },
//   { id: 8,  image: "../src/assets/images/leather1.png", name: "Travel Bag",     rating: 4.6, price: "899", realPrice: "1299", offer: "30%", category: "bag",    description: "Spacious travel bag" },
//   { id: 9,  image: "../src/assets/images/leather1.png", name: "Laptop Bag",     rating: 4.4, price: "599", realPrice: "999",  offer: "40%", category: "bag",    description: "Secure laptop bag" },
//   { id: 10, image: "../src/assets/images/leather1.png", name: "Hand Bag",       rating: 4.3, price: "499", realPrice: "799",  offer: "37%", category: "bag",    description: "Elegant handbag" },
// ];

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// const saveFilters = (filters) => {
//   sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
// };

// const loadFilters = () => {
//   try {
//     const raw = sessionStorage.getItem(STORAGE_KEY);
//     return raw ? { ...DEFAULT_FILTERS, ...JSON.parse(raw) } : null;
//   } catch {
//     return null;
//   }
// };

// const buildActiveTags = (filters) => {
//   const tags = [];
//   (filters.bags ?? []).forEach((b) => tags.push({ type: 'Bag', label: b }));
//   if (filters.category === 'wallet') tags.push({ type: 'Category', label: 'Wallet' });
//   if (filters.category === 'belt')   tags.push({ type: 'Category', label: 'Belt' });
//   if (filters.category === 'bag')    tags.push({ type: 'Category', label: 'Bag' });
//   (filters.brands ?? []).forEach((b) => tags.push({ type: 'Brand', label: b }));
//   // material is now an array
//   (filters.material ?? []).forEach((m) => tags.push({ type: 'Material', label: m }));
//   if (filters.size) tags.push({ type: 'Size', label: filters.size });
//   if (filters.priceRange) {
//     const map = {
//       under500:    'Under ₹500',
//       '500-1000':  '₹500 - ₹1000',
//       '1000-2000': '₹1000 - ₹2000',
//       above2000:   'Above ₹2000',
//     };
//     tags.push({ type: 'Price', label: map[filters.priceRange] ?? filters.priceRange });
//   }
//   if (filters.capacity) tags.push({ type: 'Capacity', label: filters.capacity });
//   return tags;
// };

// // ─── Component ───────────────────────────────────────────────────────────────

// const AllProducts = () => {
//   const location = useLocation();
//   const { searchResults, shouldShowResults, searchQuery, clearSearch } = useSearch();

//   const [filters, setFilters] = useState(() => {
//     const incoming = location.state?.filters;
//     if (incoming) {
//       const merged = { ...DEFAULT_FILTERS, ...incoming };
//       saveFilters(merged);
//       return merged;
//     }
//     return loadFilters() ?? DEFAULT_FILTERS;
//   });

//   const [appliedFilters, setAppliedFilters] = useState(filters);
//   const [activeTags, setActiveTags]         = useState(() => buildActiveTags(filters));
//   const [sortBy, setSortBy]                 = useState('');
//   const [drawerOpen, setDrawerOpen]         = useState(false);

//   useEffect(() => {
//     const incoming = location.state?.filters;
//     if (incoming) {
//       const merged = { ...DEFAULT_FILTERS, ...incoming };
//       applyFilters(merged);
//       window.history.replaceState({}, document.title);
//     }
//     window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
//   }, [location.state]);

//   useEffect(() => {
//     saveFilters(filters);
//   }, [filters]);

//   // ── Core helper ───────────────────────────────────────────────────────────

//   const applyFilters = (next) => {
//     setFilters(next);
//     setAppliedFilters(next);
//     setActiveTags(buildActiveTags(next));
//     saveFilters(next);
//   };

//   // ── Handlers ─────────────────────────────────────────────────────────────

//   const handleFilterChange = (next) => applyFilters(next);

//   const handleApply = () => {
//     applyFilters(filters);
//     setDrawerOpen(false);
//     window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
//   };

//   const handleRemoveTag = (index) => {
//     const tag     = activeTags[index];
//     const updated = { ...filters };
//     if (tag.type === 'Bag')      updated.bags       = updated.bags.filter((v) => v !== tag.label);
//     if (tag.type === 'Category') updated.category   = '';
//     if (tag.type === 'Brand')    updated.brands     = updated.brands.filter((v) => v !== tag.label);
//     // material is now an array — remove the specific item
//     if (tag.type === 'Material') updated.material   = (updated.material ?? []).filter((v) => v !== tag.label);
//     if (tag.type === 'Size')     updated.size       = '';
//     if (tag.type === 'Pattern')  updated.pattern    = '';
//     if (tag.type === 'Price')    updated.priceRange = '';
//     if (tag.type === 'Capacity') updated.capacity   = '';
//     applyFilters(updated);
//   };

//   const handleClearAllFilters = () => {
//     applyFilters(DEFAULT_FILTERS);
//     sessionStorage.removeItem(STORAGE_KEY);
//     clearSearch();
//     window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
//   };

//   // ── Derived data ──────────────────────────────────────────────────────────

//   const baseProducts = (shouldShowResults && searchResults.length > 0)
//     ? searchResults
//     : allProductsData;

//   const filteredProducts = useMemo(() => {
//     let products = [...baseProducts];

//     if (appliedFilters.category) {
//       products = products.filter((p) =>
//         p.category?.toLowerCase() === appliedFilters.category.toLowerCase()
//       );
//     }
//     if (appliedFilters.priceRange) {
//       products = products.filter((p) => {
//         const price = Number(p.price);
//         if (appliedFilters.priceRange === 'under500')  return price < 500;
//         if (appliedFilters.priceRange === '500-1000')  return price >= 500  && price <= 1000;
//         if (appliedFilters.priceRange === '1000-2000') return price >= 1000 && price <= 2000;
//         if (appliedFilters.priceRange === 'above2000') return price > 2000;
//         return true;
//       });
//     }
//     if (appliedFilters.bags && appliedFilters.bags.length > 0) {
//       products = products.filter((p) => {
//         const searchTerm = `${p.name} ${p.category} ${p.description}`.toLowerCase();
//         return appliedFilters.bags.some((bag) => searchTerm.includes(bag.toLowerCase()));
//       });
//     }
//     if (appliedFilters.brands && appliedFilters.brands.length > 0) {
//       products = products.filter((p) => {
//         const searchTerm = `${p.name} ${p.category} ${p.description}`.toLowerCase();
//         return appliedFilters.brands.some((brand) => searchTerm.includes(brand.toLowerCase()));
//       });
//     }
//     // material is now an array — match any selected material
//     if (appliedFilters.material && appliedFilters.material.length > 0) {
//       products = products.filter((p) => {
//         const searchTerm = `${p.name} ${p.description}`.toLowerCase();
//         return appliedFilters.material.some((m) => searchTerm.includes(m.toLowerCase()));
//       });
//     }
//     if (appliedFilters.size) {
//       products = products.filter((p) =>
//         p.name?.toLowerCase().includes(appliedFilters.size.toLowerCase()) ||
//         p.size?.toLowerCase() === appliedFilters.size.toLowerCase()
//       );
//     }
//     if (appliedFilters.capacity) {
//       products = products.filter((p) =>
//         p.capacity?.toLowerCase() === appliedFilters.capacity.toLowerCase() ||
//         p.description?.toLowerCase().includes(appliedFilters.capacity.toLowerCase())
//       );
//     }

//     return products;
//   }, [baseProducts, appliedFilters]);

//   const sortedProducts = useMemo(() => {
//     if (!sortBy) return filteredProducts;
//     const sorted = [...filteredProducts];
//     if (sortBy === 'price-low')  return sorted.sort((a, b) => Number(a.price) - Number(b.price));
//     if (sortBy === 'price-high') return sorted.sort((a, b) => Number(b.price) - Number(a.price));
//     if (sortBy === 'rating')     return sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
//     return sorted;
//   }, [sortBy, filteredProducts]);

//   const hasNoResults    = sortedProducts.length === 0;
//   const displayProducts = hasNoResults ? allProductsData : sortedProducts;

//   const noResultsMessage = useMemo(() => {
//     if (shouldShowResults && searchQuery && activeTags.length === 0)
//       return `No results for "${searchQuery}". Showing all products.`;
//     if (shouldShowResults && searchQuery && activeTags.length > 0)
//       return `No results for "${searchQuery}" with selected filters. Showing all products.`;
//     if (!shouldShowResults && activeTags.length > 0)
//       return 'No products match your filters. Showing all products.';
//     return null;
//   }, [shouldShowResults, searchQuery, activeTags.length]);

//   // ── Render ────────────────────────────────────────────────────────────────

//   const sidebar = (
//     <FilterSideBar
//       filters={filters}
//       onChange={handleFilterChange}
//       activeTags={activeTags}
//       onRemoveTag={handleRemoveTag}
//       onClearAll={handleClearAllFilters}
//     />
//   );

//   return (
//     <>
//       <Navbar />

//       <div className="all-products-page">

//         {/* ── Top bar ── */}
//         <div className="all-products-topbar">
//           <h2 className="all-products-title">All Products</h2>
//           <div className="topbar-right">
//             <button className="filter-toggle-btn" onClick={() => setDrawerOpen(true)}>
//               <i className="bi bi-sliders"></i> Filters
//             </button>
//             <SortBySelect value={sortBy} onChange={setSortBy} />
//           </div>
//         </div>

//         {/* ── No-results banner ── */}
//         {hasNoResults && noResultsMessage && (
//           <div
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '10px',
//               padding: '12px 18px',
//               marginBottom: '16px',
//               backgroundColor: '#fef3c7',
//               border: '1px solid #fcd34d',
//               borderRadius: '10px',
//               fontSize: '0.9rem',
//               color: '#92400e',
//             }}
//           >
//             <i className="bi bi-info-circle-fill" style={{ fontSize: '1rem', flexShrink: 0 }}></i>
//             <span>{noResultsMessage}</span>
//             <button
//               onClick={handleClearAllFilters}
//               style={{
//                 marginLeft: 'auto',
//                 background: 'none',
//                 border: 'none',
//                 cursor: 'pointer',
//                 color: '#92400e',
//                 fontWeight: '600',
//                 fontSize: '0.85rem',
//                 textDecoration: 'underline',
//                 padding: 0,
//                 flexShrink: 0,
//               }}
//             >
//               Clear filters
//             </button>
//           </div>
//         )}

//         {/* ── Main layout: sidebar + product grid ── */}
//         <div className="all-products-main">
//           <div className="all-products-sidebar">
//             {sidebar}
//           </div>
//           <div className="all-products-grid">
//             <ProductCard products={displayProducts} />
//           </div>
//         </div>

//       </div>

//       {/* ── Mobile filter drawer ── */}
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
//               {sidebar}
//             </div>
//             {/* <div className="filter-drawer-footer">
//               <button className="apply-filters-btn" onClick={handleApply}>
//                 Apply Filters
//               </button>
//             </div> */}
//           </div>
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default AllProducts;







// // import { useState, useMemo, useEffect } from 'react';
// // import { useLocation } from 'react-router-dom';
// // import { useSearch } from '../../context/SearchContext';
// // import SortBySelect from '../../components/User/SortBySelect';
// // import FilterSideBar, { DEFAULT_FILTERS } from '../../components/User/FilterSideBar';
// // import Navbar from "../../components/User/Navbar";
// // import Footer from "../../components/User/Footer";
// // import ProductCard from "../../components/User/ProductCard";

// // import "../../assets/styles/allproducts.css";

// // const STORAGE_KEY = 'allproducts_filters';

// // export const allProductsData = [
// //   { id: 1,  image: "../src/assets/images/leather1.png", name: "Premium Wallet", rating: 4.8, price: "250", realPrice: "300",  offer: "17%", category: "wallet", description: "Premium leather wallet" },
// //   { id: 2,  image: "../src/assets/images/leather1.png", name: "Leather Wallet", rating: 4.2, price: "160", realPrice: "120",  offer: "20%", category: "wallet", description: "Classic leather wallet" },
// //   { id: 3,  image: "../src/assets/images/leather1.png", name: "Luxury Wallet",  rating: 4.9, price: "350", realPrice: "500",  offer: "30%", category: "wallet", description: "Luxury designer wallet" },
// //   { id: 4,  image: "../src/assets/images/leather1.png", name: "Slim Wallet",    rating: 4.2, price: "120", realPrice: "120",  offer: "20%", category: "wallet", description: "Slim minimalist wallet" },
// //   { id: 5,  image: "../src/assets/images/leather1.png", name: "Budget Wallet",  rating: 4.0, price: "80",  realPrice: "120",  offer: "33%", category: "wallet", description: "Affordable everyday wallet" },
// //   { id: 6,  image: "../src/assets/images/leather1.png", name: "Premium Belt",   rating: 4.5, price: "150", realPrice: "200",  offer: "25%", category: "belt",   description: "Genuine leather belt" },
// //   { id: 7,  image: "../src/assets/images/leather1.png", name: "Casual Belt",    rating: 4.2, price: "120", realPrice: "120",  offer: "20%", category: "belt",   description: "Casual leather belt" },
// //   { id: 8,  image: "../src/assets/images/leather1.png", name: "Travel Bag",     rating: 4.6, price: "899", realPrice: "1299", offer: "30%", category: "bag",    description: "Spacious travel bag" },
// //   { id: 9,  image: "../src/assets/images/leather1.png", name: "Laptop Bag",     rating: 4.4, price: "599", realPrice: "999",  offer: "40%", category: "bag",    description: "Secure laptop bag" },
// //   { id: 10, image: "../src/assets/images/leather1.png", name: "Hand Bag",       rating: 4.3, price: "499", realPrice: "799",  offer: "37%", category: "bag",    description: "Elegant handbag" },
// // ];

// // // ─── Helpers ─────────────────────────────────────────────────────────────────

// // const saveFilters = (filters) => {
// //   sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
// // };

// // const loadFilters = () => {
// //   try {
// //     const raw = sessionStorage.getItem(STORAGE_KEY);
// //     return raw ? { ...DEFAULT_FILTERS, ...JSON.parse(raw) } : null;
// //   } catch {
// //     return null;
// //   }
// // };

// // const buildActiveTags = (filters) => {
// //   const tags = [];
// //   (filters.bags ?? []).forEach((b) => tags.push({ type: 'Bag', label: b }));
// //   if (filters.category === 'wallet') tags.push({ type: 'Category', label: 'Wallet' });
// //   if (filters.category === 'belt')   tags.push({ type: 'Category', label: 'Belt' });
// //   if (filters.category === 'bag')    tags.push({ type: 'Category', label: 'Bag' });
// //   (filters.brands ?? []).forEach((b) => tags.push({ type: 'Brand', label: b }));
// //   if (filters.material)   tags.push({ type: 'Material', label: filters.material });
// //   if (filters.size)       tags.push({ type: 'Size',     label: filters.size });
// //   if (filters.priceRange) {
// //     const map = {
// //       under500:    'Under ₹500',
// //       '500-1000':  '₹500 - ₹1000',
// //       '1000-2000': '₹1000 - ₹2000',
// //       above2000:   'Above ₹2000',
// //     };
// //     tags.push({ type: 'Price', label: map[filters.priceRange] ?? filters.priceRange });
// //   }
// //   // ── Capacity tag ──
// //   if (filters.capacity) tags.push({ type: 'Capacity', label: filters.capacity });

// //   return tags;
// // };

// // // ─── Component ───────────────────────────────────────────────────────────────

// // const AllProducts = () => {
// //   const location = useLocation();
// //   const { searchResults, shouldShowResults, searchQuery, clearSearch } = useSearch();

// //   const [filters, setFilters] = useState(() => {
// //     const incoming = location.state?.filters;
// //     if (incoming) {
// //       const merged = { ...DEFAULT_FILTERS, ...incoming };
// //       saveFilters(merged);
// //       return merged;
// //     }
// //     return loadFilters() ?? DEFAULT_FILTERS;
// //   });

// //   const [appliedFilters, setAppliedFilters] = useState(filters);
// //   const [activeTags, setActiveTags]         = useState(() => buildActiveTags(filters));
// //   const [sortBy, setSortBy]                 = useState('');
// //   const [drawerOpen, setDrawerOpen]         = useState(false);

// //   useEffect(() => {
// //     const incoming = location.state?.filters;
// //     if (incoming) {
// //       const merged = { ...DEFAULT_FILTERS, ...incoming };
// //       applyFilters(merged);
// //       window.history.replaceState({}, document.title);
// //     }
// //     window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
// //   }, [location.state]);

// //   useEffect(() => {
// //     saveFilters(filters);
// //   }, [filters]);

// //   // ── Core helper ───────────────────────────────────────────────────────────

// //   const applyFilters = (next) => {
// //     setFilters(next);
// //     setAppliedFilters(next);
// //     setActiveTags(buildActiveTags(next));
// //     saveFilters(next);
// //   };

// //   // ── Handlers ─────────────────────────────────────────────────────────────

// //   const handleFilterChange = (next) => applyFilters(next);

// //   const handleApply = () => {
// //     applyFilters(filters);
// //     setDrawerOpen(false);
// //     window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
// //   };

// //   const handleRemoveTag = (index) => {
// //     const tag     = activeTags[index];
// //     const updated = { ...filters };
// //     if (tag.type === 'Bag')      updated.bags       = updated.bags.filter((v) => v !== tag.label);
// //     if (tag.type === 'Category') updated.category   = '';
// //     if (tag.type === 'Brand')    updated.brands     = updated.brands.filter((v) => v !== tag.label);
// //     if (tag.type === 'Material') updated.material   = '';
// //     if (tag.type === 'Size')     updated.size       = '';
// //     if (tag.type === 'Pattern')  updated.pattern    = '';
// //     if (tag.type === 'Price')    updated.priceRange = '';
// //     // ── Capacity removal ──
// //     if (tag.type === 'Capacity') updated.capacity   = '';
// //     applyFilters(updated);
// //   };

// //   const handleClearAllFilters = () => {
// //     applyFilters(DEFAULT_FILTERS);
// //     sessionStorage.removeItem(STORAGE_KEY);
// //     clearSearch();
// //     window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
// //   };

// //   // ── Derived data ──────────────────────────────────────────────────────────

// //   const baseProducts = (shouldShowResults && searchResults.length > 0)
// //     ? searchResults
// //     : allProductsData;

// //   const filteredProducts = useMemo(() => {
// //     let products = [...baseProducts];

// //     if (appliedFilters.category) {
// //       products = products.filter((p) =>
// //         p.category?.toLowerCase() === appliedFilters.category.toLowerCase()
// //       );
// //     }
// //     if (appliedFilters.priceRange) {
// //       products = products.filter((p) => {
// //         const price = Number(p.price);
// //         if (appliedFilters.priceRange === 'under500')    return price < 500;
// //         if (appliedFilters.priceRange === '500-1000')    return price >= 500  && price <= 1000;
// //         if (appliedFilters.priceRange === '1000-2000')   return price >= 1000 && price <= 2000;
// //         if (appliedFilters.priceRange === 'above2000')   return price > 2000;
// //         return true;
// //       });
// //     }
// //     if (appliedFilters.bags && appliedFilters.bags.length > 0) {
// //       products = products.filter((p) => {
// //         const searchTerm = `${p.name} ${p.category} ${p.description}`.toLowerCase();
// //         return appliedFilters.bags.some((bag) => searchTerm.includes(bag.toLowerCase()));
// //       });
// //     }
// //     if (appliedFilters.brands && appliedFilters.brands.length > 0) {
// //       products = products.filter((p) => {
// //         const searchTerm = `${p.name} ${p.category} ${p.description}`.toLowerCase();
// //         return appliedFilters.brands.some((brand) => searchTerm.includes(brand.toLowerCase()));
// //       });
// //     }
// //     if (appliedFilters.material) {
// //       products = products.filter((p) =>
// //         p.description?.toLowerCase().includes(appliedFilters.material.toLowerCase())
// //       );
// //     }
// //     if (appliedFilters.size) {
// //       products = products.filter((p) =>
// //         p.name?.toLowerCase().includes(appliedFilters.size.toLowerCase())
// //       );
// //     }
// //     // ── Capacity filter ──
// //     if (appliedFilters.capacity) {
// //       products = products.filter((p) =>
// //         p.capacity?.toLowerCase() === appliedFilters.capacity.toLowerCase() ||
// //         p.description?.toLowerCase().includes(appliedFilters.capacity.toLowerCase())
// //       );
// //     }

// //     return products;
// //   }, [baseProducts, appliedFilters]);

// //   const sortedProducts = useMemo(() => {
// //     if (!sortBy) return filteredProducts;
// //     const sorted = [...filteredProducts];
// //     if (sortBy === 'price-low')  return sorted.sort((a, b) => Number(a.price) - Number(b.price));
// //     if (sortBy === 'price-high') return sorted.sort((a, b) => Number(b.price) - Number(a.price));
// //     if (sortBy === 'rating')     return sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
// //     return sorted;
// //   }, [sortBy, filteredProducts]);

// //   // When no filtered results, fall back to showing all products
// //   const hasNoResults    = sortedProducts.length === 0;
// //   const displayProducts = hasNoResults ? allProductsData : sortedProducts;

// //   const noResultsMessage = useMemo(() => {
// //     if (shouldShowResults && searchQuery && activeTags.length === 0)
// //       return `No results for "${searchQuery}". Showing all products.`;
// //     if (shouldShowResults && searchQuery && activeTags.length > 0)
// //       return `No results for "${searchQuery}" with selected filters. Showing all products.`;
// //     if (!shouldShowResults && activeTags.length > 0)
// //       return 'No products match your filters. Showing all products.';
// //     return null;
// //   }, [shouldShowResults, searchQuery, activeTags.length]);

// //   // ── Render ────────────────────────────────────────────────────────────────

// //   const sidebar = (
// //     <FilterSideBar
// //       filters={filters}
// //       onChange={handleFilterChange}
// //       activeTags={activeTags}
// //       onRemoveTag={handleRemoveTag}
// //       onClearAll={handleClearAllFilters}
// //     />
// //   );

// //   return (
// //     <>
// //       <Navbar />

// //       <div className="all-products-page">

// //         {/* ── Top bar ── */}
// //         <div className="all-products-topbar">
// //           <h2 className="all-products-title">All Products</h2>
// //           <div className="topbar-right">
// //             <button className="filter-toggle-btn" onClick={() => setDrawerOpen(true)}>
// //               <i className="bi bi-sliders"></i> Filters
// //             </button>
// //             <SortBySelect value={sortBy} onChange={setSortBy} />
// //           </div>
// //         </div>

// //         {/* ── No-results banner ── */}
// //         {hasNoResults && noResultsMessage && (
// //           <div
// //             style={{
// //               display: 'flex',
// //               alignItems: 'center',
// //               gap: '10px',
// //               padding: '12px 18px',
// //               marginBottom: '16px',
// //               backgroundColor: '#fef3c7',
// //               border: '1px solid #fcd34d',
// //               borderRadius: '10px',
// //               fontSize: '0.9rem',
// //               color: '#92400e',
// //             }}
// //           >
// //             <i className="bi bi-info-circle-fill" style={{ fontSize: '1rem', flexShrink: 0 }}></i>
// //             <span>{noResultsMessage}</span>
// //             <button
// //               onClick={handleClearAllFilters}
// //               style={{
// //                 marginLeft: 'auto',
// //                 background: 'none',
// //                 border: 'none',
// //                 cursor: 'pointer',
// //                 color: '#92400e',
// //                 fontWeight: '600',
// //                 fontSize: '0.85rem',
// //                 textDecoration: 'underline',
// //                 padding: 0,
// //                 flexShrink: 0,
// //               }}
// //             >
// //               Clear filters
// //             </button>
// //           </div>
// //         )}

// //         {/* ── Main layout: sidebar + product grid ── */}
// //         <div className="all-products-main">
// //           <div className="all-products-sidebar">
// //             {sidebar}
// //           </div>
// //           <div className="all-products-grid">
// //             <ProductCard products={displayProducts} />
// //           </div>
// //         </div>

// //       </div>

// //       {/* ── Mobile filter drawer ── */}
// //       {drawerOpen && (
// //         <div className="filter-overlay" onClick={() => setDrawerOpen(false)}>
// //           <div className="filter-drawer" onClick={(e) => e.stopPropagation()}>
// //             <div className="filter-drawer-header">
// //               <span className="filter-drawer-title">Filters</span>
// //               <button className="filter-drawer-close" onClick={() => setDrawerOpen(false)}>
// //                 <i className="bi bi-x-lg"></i>
// //               </button>
// //             </div>
// //             <div className="filter-drawer-body">
// //               {sidebar}
// //             </div>
// //             <div className="filter-drawer-footer">
// //               <button className="apply-filters-btn" onClick={handleApply}>
// //                 Apply Filters
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <Footer />
// //     </>
// //   );
// // };

// // export default AllProducts;