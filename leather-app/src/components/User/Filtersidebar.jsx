import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../../assets/styles/FilterSideBar.css";

// ── Static Data ───────────────────────────────────────────────────────────────
export const BAG_TYPES     = ['Laptop Bag', 'Travel bag', 'Lunch bag', 'Hand bag', 'Briefcase', 'Travel Duffel Bag'];
export const WALLET_TYPES  = ['Slim Wallet', 'Zip Wallet', 'Card Holder', 'Bifold Wallet'];
export const BELT_TYPES    = ['Classic Belt', 'Braided Belt', 'Reversible Belt', 'Web Belt'];
export const SIZES         = ['Small', 'Medium', 'Large', 'XL'];
export const PATTERNS      = ['Plain', 'Snake Leather', 'Crocodile', 'Ostrich'];

// ── Default filter state (exported so AllProducts can initialise with it) ─────
export const DEFAULT_FILTERS = {
  bags:       [],
  wallets:    [],
  belts:      [],
  size:       '',
  pattern:    '',
  priceRange: [0, 860],
};

// ── Reusable Accordion Dropdown ───────────────────────────────────────────────
const AccordionDropdown = ({ label, options, selectedValues, onSelect, multiSelect = false }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option) => {
    if (multiSelect) {
      const next = selectedValues.includes(option)
        ? selectedValues.filter((v) => v !== option)
        : [...selectedValues, option];
      onSelect(next);
    } else {
      onSelect(selectedValues === option ? '' : option);
      setOpen(false);
    }
  };

  const isSelected = (option) =>
    multiSelect ? selectedValues.includes(option) : selectedValues === option;

  const btnLabel = multiSelect && selectedValues.length > 0
    ? `${label} (${selectedValues.length})`
    : selectedValues && !multiSelect
    ? selectedValues
    : label;

  return (
    <div className="filter-dropdown-group">
      <button
        className="filter-dropdown-btn"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <span>{btnLabel}</span>
        <i className={`bi bi-chevron-${open ? 'up' : 'down'} dropdown-chevron`} />
      </button>
      {open && (
        <div className="filter-dropdown-list">
          {options.map((option) => (
            <label
              key={option}
              className={`filter-checkbox-item ${isSelected(option) ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected(option)}
                onChange={() => handleSelect(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main FilterSideBar ────────────────────────────────────────────────────────
const FilterSideBar = ({ filters, onChange, onApply }) => {
  const { bags, wallets, belts, size, pattern, priceRange } = filters;

  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside className="filter-sidebar">
      <h3 className="sidebar-title">Product Categories</h3>
      <p className="sidebar-subtitle">All Filters</p>

      {/* Bags */}
      <AccordionDropdown
        label="Bags"
        options={BAG_TYPES}
        selectedValues={bags}
        onSelect={(v) => update('bags', v)}
        multiSelect
      />

      {/* Wallet */}
      <AccordionDropdown
        label="Wallet"
        options={WALLET_TYPES}
        selectedValues={wallets}
        onSelect={(v) => update('wallets', v)}
        multiSelect
      />

      {/* Belt */}
      <AccordionDropdown
        label="Belt"
        options={BELT_TYPES}
        selectedValues={belts}
        onSelect={(v) => update('belts', v)}
        multiSelect
      />

      {/* Filter by price */}
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

      {/* Product Sizes */}
      <div className="filter-dropdown-group">
        <p className="filter-label">Product sizes</p>
        <AccordionDropdown
          label="Product Sizes"
          options={SIZES}
          selectedValues={size}
          onSelect={(v) => update('size', v)}
          multiSelect={false}
        />
      </div>

      {/* Patterns Category */}
      <div className="filter-dropdown-group">
        <p className="filter-label">Patterns Category</p>
        <AccordionDropdown
          label="Pattern leather"
          options={PATTERNS}
          selectedValues={pattern}
          onSelect={(v) => update('pattern', v)}
          multiSelect={false}
        />
      </div>

      {/* Apply Button */}
      <button className="apply-filter-btn" type="button" onClick={onApply}>
        Apply Filter
      </button>
    </aside>
  );
};

export default FilterSideBar;