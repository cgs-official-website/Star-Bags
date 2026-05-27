import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../../assets/styles/FilterSideBar.css";

// ── Static Data ───────────────────────────────────────────────────────────────
export const BAG_TYPES = ['Laptop Bag', 'Travel bag', 'Lunch bag', 'Hand bag', 'Briefcase', 'Travel Duffel Bag'];
export const BRANDS    = ['Puma', 'American Tourist', 'Sky bags', 'VIP', 'Safari'];
export const MATERIALS = ['Leather bags', 'Canvas bags', 'Nylon bags', 'Polyester bags'];
export const SIZES     = ['Small', 'Medium', 'Large', 'XL'];
export const PATTERNS  = ['Plain', 'Snake Leather', 'Crocodile', 'Ostrich'];
export const CAPACITIES = ['20L', '30L', '40L'];

// Belt uses the same SIZES but without XL
export const BELT_SIZES = ['Small', 'Medium', 'Large']; // Removed 'XL'

export const PRICE_RANGES = [
  { label: 'Under ₹500',    value: 'under500',   min: 0,    max: 500      },
  { label: '₹500 - ₹1000',  value: '500-1000',   min: 500,  max: 1000     },
  { label: '₹1000 - ₹2000', value: '1000-2000',  min: 1000, max: 2000     },
  { label: 'Above ₹2000',   value: 'above2000',  min: 2000, max: Infinity },
];

export const DEFAULT_FILTERS = {
  category:   '',
  bags:       [],
  brands:     [],
  material:   [],
  size:       '',
  priceRange: '',
  capacity:   '',
};

// ── Flipkart-style collapsible section ─────────────────────────────────────────
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="filter-section">
      <div className="filter-section-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="filter-section-title">{title}</span>
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </div>
      {isOpen && <div className="filter-section-content">{children}</div>}
    </div>
  );
};

// ── Checkbox List Component with Show More/Less ─────────────────────────────
const CheckboxList = ({ options, selected, onChange, color = '#8b5cf6', initialLimit = 4 }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, initialLimit);
  const hasMore = options.length > initialLimit;

  return (
    <div className="checkbox-list-wrapper">
      <div className="checkbox-list">
        {visibleOptions.map((option) => (
          <label key={option} className="checkbox-item">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onChange(option)}
              style={{ accentColor: color }}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {hasMore && (
        <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : `+ ${options.length - initialLimit} more`}
        </button>
      )}
    </div>
  );
};

// ── Size Buttons Component with Show More/Less ──────────────────────────────
const SizeButtons = ({ options, selected, onChange, initialLimit = 3 }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, initialLimit);
  const hasMore = options.length > initialLimit;

  return (
    <div className="size-wrapper">
      <div className="size-buttons">
        {visibleOptions.map((size) => (
          <button
            key={size}
            className={`size-btn ${selected === size ? 'active' : ''}`}
            onClick={() => onChange(selected === size ? '' : size)}
          >
            {size}
          </button>
        ))}
      </div>
      {hasMore && (
        <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : `+ ${options.length - initialLimit} more`}
        </button>
      )}
    </div>
  );
};

// ── Capacity Cards Component (card style with subtitle) ──────────────────────
const CapacityCards = ({ options, selected, onChange, initialLimit = 3 }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, initialLimit);
  const hasMore = options.length > initialLimit;

  return (
    <div className="capacity-cards-wrapper">
      <div className="capacity-cards">
        {visibleOptions.map((option) => {
          const isActive = selected === option;
          return (
            <button
              key={option}
              className={`capacity-card ${isActive ? 'active' : ''}`}
              onClick={() => onChange(isActive ? '' : option)}
            >
              {isActive && (
                <span className="capacity-check">
                  <i className="bi bi-check2"></i>
                </span>
              )}
              <span className="capacity-value">{option}</span>
              <span className="capacity-label">Capacity</span>
            </button>
          );
        })}
      </div>
      {hasMore && (
        <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : `+ ${options.length - initialLimit} more`}
        </button>
      )}
    </div>
  );
};

// ── Active Filter Tags Component ─────────────────────────────────────
const ActiveFilterTags = ({ filters, onRemove }) => {
  if (!filters || filters.length === 0) return null;

  return (
    <div className="active-filters-tags">
      {filters.map((filter, index) => (
        <div key={index} className="active-filter-tag">
          <span className="filter-tag-label">{filter.type}: {filter.label}</span>
          <button 
            onClick={() => onRemove(index)} 
            className="remove-filter-btn"
            aria-label={`Remove ${filter.label} filter`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

// ── Main FilterSideBar ────────────────────────────────────────────────────────
const FilterSideBar = ({ filters = {}, onChange, activeTags = [], onRemoveTag, onClearAll }) => {
  const category = filters.category ?? '';
  const bags = filters.bags ?? [];
  const brands = filters.brands ?? [];
  const material = filters.material ?? [];
  const size = filters.size ?? '';
  const priceRange = filters.priceRange ?? '';
  const capacity = filters.capacity ?? '';

  const update = (key, value) => onChange({ ...DEFAULT_FILTERS, ...filters, [key]: value });

  const handleBagToggle = (type) => {
    const next = bags.includes(type) ? bags.filter((t) => t !== type) : [...bags, type];
    update('bags', next);
  };

  const handleBrandToggle = (brand) => {
    const next = brands.includes(brand) ? brands.filter((b) => b !== brand) : [...brands, brand];
    update('brands', next);
  };

  const handleMaterialToggle = (materialItem) => {
    const next = material.includes(materialItem) 
      ? material.filter((m) => m !== materialItem) 
      : [...material, materialItem];
    update('material', next);
  };

  const handleCategoryClick = (cat) => {
    // Reset all filters when changing category
    const resetFilters = { ...DEFAULT_FILTERS, category: category === cat ? '' : cat };
    onChange(resetFilters);
  };

  const handlePriceRangeSelect = (rangeValue) => {
    update('priceRange', priceRange === rangeValue ? '' : rangeValue);
  };

  const handleCapacitySelect = (capacityValue) => {
    update('capacity', capacity === capacityValue ? '' : capacityValue);
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    } else {
      onChange(DEFAULT_FILTERS);
    }
  };

  const hasActiveFilters = () => {
    return category !== '' || bags.length > 0 || brands.length > 0 || 
           material.length > 0 || size !== '' || priceRange !== '' || capacity !== '';
  };

  // Show all filters when a category is clicked
  const shouldShowFilters = () => {
    return category !== '';
  };

  return (
    <aside className="filter-sidebar-flipkart">
      <div className="filter-header">
        <h3 className="filter-title">Filters</h3>
        {hasActiveFilters() && (
          <button className="clear-all-btn" onClick={handleClearAll}>
            CLEAR ALL
          </button>
        )}
      </div>

      {/* Active Filter Tags */}
      {activeTags && activeTags.length > 0 && (
        <ActiveFilterTags 
          filters={activeTags} 
          onRemove={onRemoveTag}
        />
      )}

      {/* Category Section */}
      <FilterSection title="CATEGORIES">
        <div className="category-buttons">
          <button
            className={`category-btn ${category === 'wallet' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('wallet')}
          >
            Wallets
          </button>
          <button
            className={`category-btn ${category === 'belt' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('belt')}
          >
            Belts
          </button>
          <button
            className={`category-btn ${category === 'bag' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('bag')}
          >
            Bags
          </button>
        </div>
      </FilterSection>

      {/* Show all filters based on selected category */}
      {shouldShowFilters() && (
        <>
          {/* Common Price Section for all categories */}
          <FilterSection title="PRICE">
            <div className="price-options">
              {PRICE_RANGES.map((range) => (
                <label key={range.value} className="price-option">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === range.value}
                    onChange={() => handlePriceRangeSelect(range.value)}
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Category-specific filters */}
          {category === 'bag' && (
            <>
              <FilterSection title="BAG TYPES">
                <CheckboxList 
                  options={BAG_TYPES}
                  selected={bags}
                  onChange={handleBagToggle}
                  initialLimit={4}
                />
              </FilterSection>

              <FilterSection title="BRANDS">
                <CheckboxList 
                  options={BRANDS}
                  selected={brands}
                  onChange={handleBrandToggle}
                  initialLimit={4}
                />
              </FilterSection>

              <FilterSection title="MATERIAL">
                <CheckboxList 
                  options={MATERIALS}
                  selected={material}
                  onChange={handleMaterialToggle}
                  initialLimit={3}
                />
              </FilterSection>

              <FilterSection title="CAPACITY">
                <CapacityCards
                  options={CAPACITIES}
                  selected={capacity}
                  onChange={handleCapacitySelect}
                  initialLimit={3}
                />
              </FilterSection>
            </>
          )}

          {category === 'wallet' && (
            <>
              <FilterSection title="MATERIAL">
                <CheckboxList 
                  options={MATERIALS}
                  selected={material}
                  onChange={handleMaterialToggle}
                  initialLimit={3}
                />
              </FilterSection>
            </>
          )}

          {category === 'belt' && (
            <>
              <FilterSection title="SIZE">
                <SizeButtons 
                  options={BELT_SIZES}
                  selected={size}
                  onChange={(value) => update('size', value)}
                  initialLimit={3}
                />
              </FilterSection>
            </>
          )}
        </>
      )}
    </aside>
  );
};

export default FilterSideBar;