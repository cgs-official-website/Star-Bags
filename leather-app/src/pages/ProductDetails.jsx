import { useState } from "react";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import { ProductCart } from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import "../assets/styles/productdetails.css";

// ── Sample product data ───────────────────────────────────────────────────────
const PRODUCTS = [
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"}
  
  ]
// ── Default filter state ──────────────────────────────────────────────────────
const DEFAULT_FILTERS = {
  category:   "",
  size:       "",
  pattern:    "",
  colors:     [],
  priceRange: [0, 860],
};

// ── Star rating ───────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map((s) => (
        <i
          key={s}
          className={`bi ${s <= Math.round(rating) ? "bi-star-fill" : "bi-star"}`}
          style={{ color: "#FACC15", fontSize: "0.75rem" }}
        />
      ))}
    </>
  );
}
/*

// ── Single product card ───────────────────────────────────────────────────────
function ProductCard({ product, wishlist, onWishlist }) {
  const liked = wishlist.includes(product.id);
  return (
    <div className="pd-card">
      {/* Image }
      <div className="pd-card-img-wrap">
        <img src={product.image} alt={product.name} className="pd-card-img" />
        <button
          className={`pd-wishlist-btn ${liked ? "liked" : ""}`}
          onClick={() => onWishlist(product.id)}
          aria-label="Wishlist"
          type="button"
        >
          <i className={`bi ${liked ? "bi-heart-fill" : "bi-heart"}`} />
        </button>
      </div>

      {/* Body }
      <div className="pd-card-body">
        <div className="pd-card-meta">
          <span className="pd-card-name">{product.name}</span>
          <span className="pd-card-rating">
            <Stars rating={product.rating} />
            <span className="pd-rating-num">{product.rating}</span>
            <span className="pd-reviews">({product.reviews})</span>
          </span>
        </div>

        <div className="pd-card-price">
          <span className="pd-price-now">${product.price}</span>
          <del className="pd-price-old">${product.originalPrice}</del>
          <span className="pd-discount">{product.discount}% off</span>
        </div>

        <div className="pd-card-actions">
          <button className="pd-cart-btn" aria-label="Add to cart" type="button">
            <i className="bi bi-bag" />
          </button>
          <button className="pd-buy-btn" type="button">
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}
*/
// ── Active filter tag pill ────────────────────────────────────────────────────
function FilterTag({ label, value, hex, onRemove }) {
  return (
    <span className="pd-filter-tag">
      <span className="pd-tag-label">{label}</span>
      {hex && <span className="pd-tag-dot" style={{ background: hex }} />}
      <span className="pd-tag-value">{value}</span>
      <button className="pd-tag-remove" onClick={onRemove} type="button">✕</button>
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export const ProductDetails = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [wishlist,    setWishlist]    = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters,     setFilters]     = useState(DEFAULT_FILTERS);

  // Build active-tag list
  const COLOR_HEX = {
    Orange: "#F97316", Blue: "#3B82F6", "Light green": "#86EFAC",
    Red: "#EF4444", Green: "#22C55E", Purple: "#A855F7",
    Black: "#111111", Yellow: "#EAB308",
  };

  const activeTags = [
    filters.category && { label: "Bag",     value: filters.category, clear: () => setFilters((f) => ({ ...f, category: "" })) },
    filters.pattern  && { label: "Pattern", value: filters.pattern,  clear: () => setFilters((f) => ({ ...f, pattern: "" }))  },
    filters.size     && { label: "Length",  value: filters.size,     clear: () => setFilters((f) => ({ ...f, size: "" }))     },
    ...filters.colors.map((c) => ({
      label: "Color", value: c, hex: COLOR_HEX[c],
      clear: () => setFilters((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) })),
    })),
  ].filter(Boolean);

  // Filter products
  const filtered = PRODUCTS.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.size     && p.size     !== filters.size)     return false;
    if (filters.pattern  && p.pattern  !== filters.pattern)  return false;
    if (filters.colors.length && !filters.colors.includes(p.color)) return false;
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
    return true;
  });

  const toggleWishlist = (id) =>
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <>
      <Navbar searchQuery={searchQuery} onSearch={setSearchQuery} />

      <main className="pd-main container-fluid">

        {/* ── Page header ── */}
        <div className="pd-header">
          <h1 className="pd-title">All Products</h1>
          <button
            className={`pd-filter-toggle ${filtersOpen ? "open" : ""}`}
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
          >
            <i className="bi bi-funnel-fill" />
            Filters
            {filtersOpen && (
              <i
                className="bi bi-x-circle-fill pd-filter-close-icon"
                onClick={(e) => { e.stopPropagation(); setFiltersOpen(false); }}
              />
            )}
          </button>
        </div>

        {/* ── Active filter tags ── */}
        {activeTags.length > 0 && (
          <div className="pd-active-tags">
            {activeTags.map((t, i) => (
              <FilterTag
                key={i}
                label={t.label}
                value={t.value}
                hex={t.hex}
                onRemove={t.clear}
              />
            ))}
            {activeTags.length > 1 && (
              <button
                className="pd-clear-all"
                type="button"
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* ── Body: sidebar + grid ── */}
        <div className="pd-body">

          {/* Mobile overlay backdrop */}
          {filtersOpen && (
            <div
              className="pd-backdrop"
              onClick={() => setFiltersOpen(false)}
            />
          )}

          {/* FilterSidebar component */}
          <div className={`pd-sidebar-wrap ${filtersOpen ? "open" : ""}`}>
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onApply={() => setFiltersOpen(false)}
            />
          </div>

          {/* Product grid */}
          <div className="pd-grid-wrap">
            {filtered.length === 0 ? (
              <div className="pd-empty">
                <i className="bi bi-bag-x" />
                <p>No products match your filters.</p>
              </div>
            ) : (
              <div className="pd-grid">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    wishlist={wishlist}
                    onWishlist={toggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
