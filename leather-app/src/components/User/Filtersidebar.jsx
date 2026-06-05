import { useState, useEffect, useCallback, memo } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../../assets/styles/FilterSideBar.css";

// ── Static Data ───────────────────────────────────────────────────────────────

export const BAG_TYPES = ['College Bag', 'Hand Bag', 'Lunch Bag', 'Office Bag', 'School Bag', 'Travel Bag', 'Trolley Bag'];
export const BRANDS    = ['American Tourister', 'Puma', 'Rubee bags', 'Safari', 'Sky bags', 'VIP', 'Wildcraft'];
export const MATERIALS = ['Leather', 'Canvas'];
export const SIZES     = ['Small', 'Medium', 'Large'];
export const PATTERNS  = ['Plain', 'Snake Leather', 'Crocodile', 'Ostrich'];
export const CAPACITIES = ['20L', '30L', '40L'];

// Belt uses the same SIZES but without XL
export const BELT_SIZES = ['Small', 'Medium', 'Large'];

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
  sizes:      [],
  priceRange: '',
  capacities: [],
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
const SizeButtons = ({ options, selected = [], onChange, initialLimit = 3 }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, initialLimit);
  const hasMore = options.length > initialLimit;

  return (
    <div className="size-wrapper">
      <div className="size-buttons">
        {visibleOptions.map((size) => {
          const isActive = selected.includes(size);
          return (
            <button
              key={size}
              className={`size-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                const next = isActive
                  ? selected.filter((s) => s !== size)
                  : [...selected, size];
                onChange(next);
              }}
            >
              {size}
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

// ── Capacity Cards Component (card style with subtitle) ──────────────────────
const CapacityCards = ({ options, selected = [], onChange, initialLimit = 3 }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, initialLimit);
  const hasMore = options.length > initialLimit;

  return (
    <div className="capacity-cards-wrapper">
      <div className="capacity-cards">
        {visibleOptions.map((option) => {
          const isActive = selected.includes(option);
          return (
            <button
              key={option}
              className={`capacity-card ${isActive ? 'active' : ''}`}
              onClick={() => {
                const next = isActive
                  ? selected.filter((c) => c !== option)
                  : [...selected, option];
                onChange(next);
              }}
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

// ── Active Filter Tags Component ────────────────────────────────────────────
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

// ── Price Range Component with Custom Radio (OPTIMIZED FOR MOBILE) ───────────
const PriceRangeSelector = ({ ranges, selected, onChange }) => {
  // Local state for immediate UI feedback
  const [localSelected, setLocalSelected] = useState(selected);
  
  // Sync local state with prop
  useEffect(() => {
    setLocalSelected(selected);
  }, [selected]);
  
  // Optimized change handler with requestAnimationFrame
  const handleChange = useCallback((value) => {
    // Update local state immediately for UI feedback
    setLocalSelected(value);
    // Use requestAnimationFrame to batch the parent update
    requestAnimationFrame(() => {
      onChange(value);
    });
  }, [onChange]);
  
  return (
    <div className="price-options">
      {ranges.map((range) => (
        <label 
          key={range.value} 
          className="price-option"
          onTouchEnd={(e) => {
            e.preventDefault(); // Prevent double-firing on mobile
            handleChange(range.value);
          }}
          onClick={(e) => {
            // Handle click for desktop
            e.preventDefault();
            handleChange(range.value);
          }}
        >
          <input
            type="radio"
            name="price"
            checked={localSelected === range.value}
            onChange={() => {}} // Empty onChange, handled by label
            className="custom-radio"
          />
          {/* <span className="custom-radio"></span> */}
          <span className="price-label">{range.label}</span>
        </label>
      ))}
    </div>
  );
};

// ── Main FilterSideBar (Memoized for performance) ────────────────────────────
const FilterSideBar = memo(({ filters = {}, onChange, activeTags = [], onRemoveTag, onClearAll }) => {
  const category = filters.category ?? '';
  const bags = filters.bags ?? [];
  const brands = filters.brands ?? [];
  const material = filters.material ?? [];
  const sizes = filters.sizes ?? [];
  const priceRange = filters.priceRange ?? '';
  const capacities = filters.capacities ?? [];

  // Optimized update function
  const update = useCallback((key, value) => {
    onChange({ ...DEFAULT_FILTERS, ...filters, [key]: value });
  }, [filters, onChange]);

  const handleBagToggle = useCallback((type) => {
    const next = bags.includes(type) ? bags.filter((t) => t !== type) : [...bags, type];
    update('bags', next);
  }, [bags, update]);

  const handleBrandToggle = useCallback((brand) => {
    const next = brands.includes(brand) ? brands.filter((b) => b !== brand) : [...brands, brand];
    update('brands', next);
  }, [brands, update]);

  const handleMaterialToggle = useCallback((materialItem) => {
    const next = material.includes(materialItem) 
      ? material.filter((m) => m !== materialItem) 
      : [...material, materialItem];
    update('material', next);
  }, [material, update]);

  const handleCategoryClick = useCallback((cat) => {
    const resetFilters = { ...DEFAULT_FILTERS, category: category === cat ? '' : cat };
    onChange(resetFilters);
  }, [category, onChange]);

  const handlePriceRangeSelect = useCallback((rangeValue) => {
    update('priceRange', priceRange === rangeValue ? '' : rangeValue);
  }, [priceRange, update]);

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    } else {
      onChange(DEFAULT_FILTERS);
    }
  };

  const hasActiveFilters = () => {
    return category !== '' || bags.length > 0 || brands.length > 0 || 
           material.length > 0 || sizes.length > 0 || priceRange !== '' || capacities.length > 0;
  };

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

      {activeTags && activeTags.length > 0 && (
        <ActiveFilterTags 
          filters={activeTags} 
          onRemove={onRemoveTag}
        />
      )}

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

      {shouldShowFilters() && (
        <>
          <FilterSection title="PRICE">
            <PriceRangeSelector
              ranges={PRICE_RANGES}
              selected={priceRange}
              onChange={handlePriceRangeSelect}
            />
          </FilterSection>

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
                  selected={capacities}
                  onChange={(value) => update('capacities', value)}
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
                  selected={sizes}
                  onChange={(value) => update('sizes', value)}
                  initialLimit={3}
                />
              </FilterSection>
            </>
          )}
        </>
      )}
    </aside>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters) &&
         JSON.stringify(prevProps.activeTags) === JSON.stringify(nextProps.activeTags);
});

export default FilterSideBar;
