import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../../assets/styles/FilterSideBar.css";

// ── Static Data ───────────────────────────────────────────────────────────────
export const BAG_TYPES = ['Laptop Bag', 'Travel bag', 'Lunch bag', 'Hand bag', 'Briefcase', 'Travel Duffel Bag'];
export const BRANDS    = ['Puma', 'American Tourist', 'Sky bags', 'VIP', 'Safari'];
export const MATERIALS = ['Leather bags', 'Canvas bags', 'Nylon bags', 'Polyester bags'];
export const SIZES     = ['Small', 'Medium', 'Large', 'XL'];
export const PATTERNS  = ['Plain', 'Snake Leather', 'Crocodile', 'Ostrich'];

// ── Default filter state ──────────────────────────────────────────────────────
export const DEFAULT_FILTERS = {
  category:   '',
  bags:       [],
  brands:     [],
  material:   '',
  size:       '',
  pattern:    '',
  priceRange: [0, 860],
};

// ── Simple single-select dropdown ─────────────────────────────────────────────
const SimpleDropdown = ({ label = 'Select', options, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="filter-dropdown-group">
      <button
        className={`filter-dropdown-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <span>{selected || label}</span>
        <i className={`bi bi-chevron-${open ? 'up' : 'down'} dropdown-chevron`} />
      </button>
      {open && (
        <div className="filter-dropdown-list">
          {options.map((opt) => (
            <label
              key={opt}
              className={`filter-checkbox-item ${selected === opt ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                checked={selected === opt}
                onChange={() => { onSelect(selected === opt ? '' : opt); setOpen(false); }}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main FilterSideBar ────────────────────────────────────────────────────────
const FilterSideBar = ({ filters = {}, onChange, onApply }) => {
  const [bagsOpen, setBagsOpen] = useState(false);

  // ✅ Safe fallbacks — prevents crashes if parent passes old/partial filters
  const category   = filters.category   ?? '';
  const bags       = filters.bags       ?? [];
  const brands     = filters.brands     ?? [];
  const material   = filters.material   ?? '';
  const size       = filters.size       ?? '';
  const pattern    = filters.pattern    ?? '';
  const priceRange = filters.priceRange ?? [0, 860];

  const update = (key, value) => onChange({ ...DEFAULT_FILTERS, ...filters, [key]: value });

  const handleBagToggle = (type) => {
    const next = bags.includes(type)
      ? bags.filter((t) => t !== type)
      : [...bags, type];
    update('bags', next);
  };

  const handleBrandToggle = (brand) => {
    const next = brands.includes(brand)
      ? brands.filter((b) => b !== brand)
      : [...brands, brand];
    update('brands', next);
  };

  const handleCategoryClick = (cat) => {
    update('category', category === cat ? '' : cat);
  };

  return (
    <aside className="filter-sidebar">
      <h3 className="sidebar-title">Product Categories</h3>
      <p className="sidebar-subtitle">All Filters</p>

      {/* ── Bags — dropdown ── */}
      <div className="filter-dropdown-group">
        <button
          className={`filter-dropdown-btn ${bagsOpen ? 'open' : ''}`}
          onClick={() => setBagsOpen((o) => !o)}
          type="button"
        >
          <span>{bags.length > 0 ? `Bags (${bags.length})` : 'Bags'}</span>
          <i className={`bi bi-chevron-${bagsOpen ? 'up' : 'down'} dropdown-chevron`} />
        </button>
        {bagsOpen && (
          <div className="filter-dropdown-list">
            {BAG_TYPES.map((type) => (
              <label
                key={type}
                className={`filter-checkbox-item ${bags.includes(type) ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={bags.includes(type)}
                  onChange={() => handleBagToggle(type)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ── Wallet — flat button ── */}
      <button
        className={`category-flat-btn ${category === 'wallet' ? 'active' : ''}`}
        type="button"
        onClick={() => handleCategoryClick('wallet')}
      >
        Wallet
      </button>

      {/* ── Belt — flat button ── */}
      <button
        className={`category-flat-btn ${category === 'belt' ? 'active' : ''}`}
        type="button"
        onClick={() => handleCategoryClick('belt')}
      >
        Belt
      </button>

      {/* ── Brands — checkbox list ── */}
      <div className="filter-section">
        <p className="filter-label bold-label">Brands</p>
        <div className="brand-list">
          {BRANDS.map((brand) => (
            <label
              key={brand}
              className={`brand-item ${brands.includes(brand) ? 'selected' : ''}`}
            >
              <span className="brand-checkbox-box">
                <input
                  type="checkbox"
                  checked={brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                />
              </span>
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Material — dropdown ── */}
      <div className="filter-section">
        <p className="filter-label bold-label">Material</p>
        <SimpleDropdown
          label="Leather bags"
          options={MATERIALS}
          selected={material}
          onSelect={(v) => update('material', v)}
        />
      </div>

      {/* ── Product Size — dropdown ── */}
      <div className="filter-section">
        <p className="filter-label bold-label">Product Size</p>
        <SimpleDropdown
          label="Product Sizes"
          options={SIZES}
          selected={size}
          onSelect={(v) => update('size', v)}
        />
      </div>

      {/* ── Filter by price ── */}
      <div className="filter-price-section">
        <p className="filter-label">Filter by price</p>
        <input
          type="range"
          min="0"
          max="860"
          step="5"
          value={priceRange[1]}
          className="price-range-slider"
          onChange={(e) => update('priceRange', [priceRange[0], Number(e.target.value)])}
        />
        <div className="price-range-inputs">
          <input
            type="number"
            value={priceRange[0]}
            min="0"
            max={priceRange[1]}
            onChange={(e) => update('priceRange', [Number(e.target.value), priceRange[1]])}
          />
          <span>-</span>
          <input
            type="number"
            value={priceRange[1]}
            min={priceRange[0]}
            max="860"
            onChange={(e) => update('priceRange', [priceRange[0], Number(e.target.value)])}
          />
        </div>
      </div>

      {/* ── Apply ── */}
      <button className="apply-filter-btn" type="button" onClick={onApply}>
        Apply Filter
      </button>
    </aside>
  );
};

export default FilterSideBar;