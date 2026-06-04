import { useState, useCallback, memo } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../../assets/styles/FilterSideBar.css";

// ── Static Data ───────────────────────────────────────────────────────────────

export const BAG_TYPES  = ['College Bag', 'Hand Bag', 'Lunch Bag', 'Office Bag', 'School Bag', 'Travel Bag', 'Trolley Bag'];
export const BRANDS     = ['American Tourister', 'Puma', 'Rubee bags', 'Safari', 'Sky bags', 'VIP', 'Wildcraft'];
export const MATERIALS  = ['Leather', 'Canvas'];
export const SIZES      = ['Small', 'Medium', 'Large'];
export const PATTERNS   = ['Plain', 'Snake Leather', 'Crocodile', 'Ostrich'];
export const CAPACITIES = ['20L', '30L', '40L'];
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

// ── Collapsible Section ────────────────────────────────────────────────────────
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

// ── Checkbox List ──────────────────────────────────────────────────────────────
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

// ── Size Buttons ───────────────────────────────────────────────────────────────
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
              onClick={() => onChange(isActive ? selected.filter((s) => s !== size) : [...selected, size])}
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

// ── Capacity Cards ─────────────────────────────────────────────────────────────
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
              onClick={() => onChange(isActive ? selected.filter((c) => c !== option) : [...selected, option])}
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

// ── Active Filter Tags ─────────────────────────────────────────────────────────
const ActiveFilterTags = ({ filters, onRemove }) => {
  if (!filters || filters.length === 0) return null;
  return (
    <div className="active-filters-tags">
      {filters.map((filter, index) => (
        <div key={index} className="active-filter-tag">
          <span className="filter-tag-label">{filter.type}: {filter.label}</span>
          <button onClick={() => onRemove(index)} className="remove-filter-btn" aria-label={`Remove ${filter.label} filter`}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

// ── Price Range Selector - NO WHITE BACKGROUND VERSION ─────────────────────────
const PriceRangeSelector = ({ ranges, selected, onChange }) => (
  <div className="price-options">
    {ranges.map((range) => {
      const isActive = selected === range.value;
      return (
        <button
          key={range.value}
          className="price-option-btn"
          onClick={() => onChange(range.value)}
        >
          <span className={`custom-radio ${isActive ? 'active' : ''}`}>
            {isActive && <span className="radio-dot"></span>}
          </span>
          <span className="price-label">{range.label}</span>
        </button>
      );
    })}
  </div>
);

// ── Main FilterSideBar ─────────────────────────────────────────────────────────
const FilterSideBar = memo(({ filters = {}, onChange, activeTags = [], onRemoveTag, onClearAll, hideHeader = false }) => {
  const category   = filters.category   ?? '';
  const bags       = filters.bags       ?? [];
  const brands     = filters.brands     ?? [];
  const material   = filters.material   ?? [];
  const sizes      = filters.sizes      ?? [];
  const priceRange = filters.priceRange ?? '';
  const capacities = filters.capacities ?? [];

  const update = useCallback((key, value) => {
    onChange({ ...DEFAULT_FILTERS, ...filters, [key]: value });
  }, [filters, onChange]);

  const handleBagToggle = useCallback((type) => {
    update('bags', bags.includes(type) ? bags.filter((t) => t !== type) : [...bags, type]);
  }, [bags, update]);

  const handleBrandToggle = useCallback((brand) => {
    update('brands', brands.includes(brand) ? brands.filter((b) => b !== brand) : [...brands, brand]);
  }, [brands, update]);

  const handleMaterialToggle = useCallback((materialItem) => {
    update('material', material.includes(materialItem)
      ? material.filter((m) => m !== materialItem)
      : [...material, materialItem]);
  }, [material, update]);

  const handleCategoryClick = useCallback((cat) => {
    onChange({ ...DEFAULT_FILTERS, category: category === cat ? '' : cat });
  }, [category, onChange]);

  const handlePriceRangeSelect = useCallback((rangeValue) => {
    update('priceRange', rangeValue);
  }, [update]);

  const handleClearAll = () => {
    if (onClearAll) onClearAll();
    else onChange(DEFAULT_FILTERS);
  };

  const hasActiveFilters =
    category !== '' || bags.length > 0 || brands.length > 0 ||
    material.length > 0 || sizes.length > 0 || priceRange !== '' || capacities.length > 0;

  return (
    <aside className="filter-sidebar-flipkart">
      {!hideHeader && (
        <div className="filter-header">
          <h3 className="filter-title">Filters</h3>
          {hasActiveFilters && (
            <button className="clear-all-btn" onClick={handleClearAll}>CLEAR ALL</button>
          )}
        </div>
      )}
      {hideHeader && hasActiveFilters && (
        <div className="filter-header" style={{ paddingTop: 0 }}>
          <span />
          <button className="clear-all-btn" onClick={handleClearAll}>CLEAR ALL</button>
        </div>
      )}

      {activeTags && activeTags.length > 0 && (
        <ActiveFilterTags filters={activeTags} onRemove={onRemoveTag} />
      )}

      <FilterSection title="CATEGORIES">
        <div className="category-buttons">
          {['wallet', 'belt', 'bag'].map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}s
            </button>
          ))}
        </div>
      </FilterSection>

      {category !== '' && (
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
                <CheckboxList options={BAG_TYPES} selected={bags} onChange={handleBagToggle} initialLimit={4} />
              </FilterSection>
              <FilterSection title="BRANDS">
                <CheckboxList options={BRANDS} selected={brands} onChange={handleBrandToggle} initialLimit={4} />
              </FilterSection>
              <FilterSection title="MATERIAL">
                <CheckboxList options={MATERIALS} selected={material} onChange={handleMaterialToggle} initialLimit={3} />
              </FilterSection>
              <FilterSection title="CAPACITY">
                <CapacityCards options={CAPACITIES} selected={capacities} onChange={(v) => update('capacities', v)} initialLimit={3} />
              </FilterSection>
            </>
          )}

          {category === 'wallet' && (
            <FilterSection title="MATERIAL">
              <CheckboxList options={MATERIALS} selected={material} onChange={handleMaterialToggle} initialLimit={3} />
            </FilterSection>
          )}

          {category === 'belt' && (
            <FilterSection title="SIZE">
              <SizeButtons options={BELT_SIZES} selected={sizes} onChange={(v) => update('sizes', v)} initialLimit={3} />
            </FilterSection>
          )}
        </>
      )}
    </aside>
  );
});

export default FilterSideBar;


// import { useState, useCallback, memo } from 'react';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import "../../assets/styles/FilterSideBar.css";

// // ── Static Data ───────────────────────────────────────────────────────────────

// export const BAG_TYPES  = ['College Bag', 'Hand Bag', 'Lunch Bag', 'Office Bag', 'School Bag', 'Travel Bag', 'Trolley Bag'];
// export const BRANDS     = ['American Tourister', 'Puma', 'Rubee bags', 'Safari', 'Sky bags', 'VIP', 'Wildcraft'];
// export const MATERIALS  = ['Leather', 'Canvas'];
// export const SIZES      = ['Small', 'Medium', 'Large'];
// export const PATTERNS   = ['Plain', 'Snake Leather', 'Crocodile', 'Ostrich'];
// export const CAPACITIES = ['20L', '30L', '40L'];
// export const BELT_SIZES = ['Small', 'Medium', 'Large'];

// export const PRICE_RANGES = [
//   { label: 'Under ₹500',    value: 'under500',   min: 0,    max: 500      },
//   { label: '₹500 - ₹1000',  value: '500-1000',   min: 500,  max: 1000     },
//   { label: '₹1000 - ₹2000', value: '1000-2000',  min: 1000, max: 2000     },
//   { label: 'Above ₹2000',   value: 'above2000',  min: 2000, max: Infinity },
// ];

// export const DEFAULT_FILTERS = {
//   category:   '',
//   bags:       [],
//   brands:     [],
//   material:   [],
//   sizes:      [],
//   priceRange: '',
//   capacities: [],
// };

// // ── Collapsible Section ────────────────────────────────────────────────────────
// const FilterSection = ({ title, children, defaultOpen = true }) => {
//   const [isOpen, setIsOpen] = useState(defaultOpen);
//   return (
//     <div className="filter-section">
//       <div className="filter-section-header" onClick={() => setIsOpen(!isOpen)}>
//         <span className="filter-section-title">{title}</span>
//         <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
//       </div>
//       {isOpen && <div className="filter-section-content">{children}</div>}
//     </div>
//   );
// };

// // ── Checkbox List ──────────────────────────────────────────────────────────────
// const CheckboxList = ({ options, selected, onChange, color = '#8b5cf6', initialLimit = 4 }) => {
//   const [showAll, setShowAll] = useState(false);
//   const visibleOptions = showAll ? options : options.slice(0, initialLimit);
//   const hasMore = options.length > initialLimit;
//   return (
//     <div className="checkbox-list-wrapper">
//       <div className="checkbox-list">
//         {visibleOptions.map((option) => (
//           <label key={option} className="checkbox-item">
//             <input
//               type="checkbox"
//               checked={selected.includes(option)}
//               onChange={() => onChange(option)}
//               style={{ accentColor: color }}
//             />
//             <span>{option}</span>
//           </label>
//         ))}
//       </div>
//       {hasMore && (
//         <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
//           {showAll ? 'Show Less' : `+ ${options.length - initialLimit} more`}
//         </button>
//       )}
//     </div>
//   );
// };

// // ── Size Buttons ───────────────────────────────────────────────────────────────
// const SizeButtons = ({ options, selected = [], onChange, initialLimit = 3 }) => {
//   const [showAll, setShowAll] = useState(false);
//   const visibleOptions = showAll ? options : options.slice(0, initialLimit);
//   const hasMore = options.length > initialLimit;
//   return (
//     <div className="size-wrapper">
//       <div className="size-buttons">
//         {visibleOptions.map((size) => {
//           const isActive = selected.includes(size);
//           return (
//             <button
//               key={size}
//               className={`size-btn ${isActive ? 'active' : ''}`}
//               onClick={() => onChange(isActive ? selected.filter((s) => s !== size) : [...selected, size])}
//             >
//               {size}
//             </button>
//           );
//         })}
//       </div>
//       {hasMore && (
//         <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
//           {showAll ? 'Show Less' : `+ ${options.length - initialLimit} more`}
//         </button>
//       )}
//     </div>
//   );
// };

// // ── Capacity Cards ─────────────────────────────────────────────────────────────
// const CapacityCards = ({ options, selected = [], onChange, initialLimit = 3 }) => {
//   const [showAll, setShowAll] = useState(false);
//   const visibleOptions = showAll ? options : options.slice(0, initialLimit);
//   const hasMore = options.length > initialLimit;
//   return (
//     <div className="capacity-cards-wrapper">
//       <div className="capacity-cards">
//         {visibleOptions.map((option) => {
//           const isActive = selected.includes(option);
//           return (
//             <button
//               key={option}
//               className={`capacity-card ${isActive ? 'active' : ''}`}
//               onClick={() => onChange(isActive ? selected.filter((c) => c !== option) : [...selected, option])}
//             >
//               {isActive && (
//                 <span className="capacity-check">
//                   <i className="bi bi-check2"></i>
//                 </span>
//               )}
//               <span className="capacity-value">{option}</span>
//               <span className="capacity-label">Capacity</span>
//             </button>
//           );
//         })}
//       </div>
//       {hasMore && (
//         <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
//           {showAll ? 'Show Less' : `+ ${options.length - initialLimit} more`}
//         </button>
//       )}
//     </div>
//   );
// };

// // ── Active Filter Tags ─────────────────────────────────────────────────────────
// const ActiveFilterTags = ({ filters, onRemove }) => {
//   if (!filters || filters.length === 0) return null;
//   return (
//     <div className="active-filters-tags">
//       {filters.map((filter, index) => (
//         <div key={index} className="active-filter-tag">
//           <span className="filter-tag-label">{filter.type}: {filter.label}</span>
//           <button onClick={() => onRemove(index)} className="remove-filter-btn" aria-label={`Remove ${filter.label} filter`}>
//             ✕
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// // ── Price Range Selector ───────────────────────────────────────────────────────
// // Pure div-based — no native <input type="radio">.
// // Styled entirely from the `selected` prop via inline styles — no CSS pseudo-selectors.
// // This prevents the mobile WebView desync where :checked state lags behind React state.
// const PriceRangeSelector = ({ ranges, selected, onChange }) => (
//   <div className="price-options">
//     {ranges.map((range) => {
//       const isActive = selected === range.value;
//       return (
//         <div
//           key={range.value}
//           className="price-option"
//           onClick={() => onChange(range.value)}
//         >
//           <span
//             className="custom-radio"
//             style={isActive ? { borderColor: '#8b5cf6', backgroundColor: '#8b5cf6' } : {}}
//           >
//             {isActive && (
//               <span style={{
//                 display: 'block',
//                 width: 6,
//                 height: 6,
//                 borderRadius: '50%',
//                 backgroundColor: '#fff',
//                 flexShrink: 0,
//               }} />
//             )}
//           </span>
//           <span className="price-label">{range.label}</span>
//         </div>
//       );
//     })}
//   </div>
// );

// // ── Main FilterSideBar ─────────────────────────────────────────────────────────
// // memo without a custom comparator — React's default shallow prop comparison is correct.
// // The previous custom JSON.stringify comparator was causing stale renders.
// const FilterSideBar = memo(({ filters = {}, onChange, activeTags = [], onRemoveTag, onClearAll, hideHeader = false }) => {
//   const category   = filters.category   ?? '';
//   const bags       = filters.bags       ?? [];
//   const brands     = filters.brands     ?? [];
//   const material   = filters.material   ?? [];
//   const sizes      = filters.sizes      ?? [];
//   const priceRange = filters.priceRange ?? '';
//   const capacities = filters.capacities ?? [];

//   const update = useCallback((key, value) => {
//     onChange({ ...DEFAULT_FILTERS, ...filters, [key]: value });
//   }, [filters, onChange]);

//   const handleBagToggle = useCallback((type) => {
//     update('bags', bags.includes(type) ? bags.filter((t) => t !== type) : [...bags, type]);
//   }, [bags, update]);

//   const handleBrandToggle = useCallback((brand) => {
//     update('brands', brands.includes(brand) ? brands.filter((b) => b !== brand) : [...brands, brand]);
//   }, [brands, update]);

//   const handleMaterialToggle = useCallback((materialItem) => {
//     update('material', material.includes(materialItem)
//       ? material.filter((m) => m !== materialItem)
//       : [...material, materialItem]);
//   }, [material, update]);

//   const handleCategoryClick = useCallback((cat) => {
//     onChange({ ...DEFAULT_FILTERS, category: category === cat ? '' : cat });
//   }, [category, onChange]);

//   const handlePriceRangeSelect = useCallback((rangeValue) => {
//     // Always set the new value — never toggle off on tap.
//     // Deselect is handled by the active tag ✕ button or CLEAR ALL.
//     update('priceRange', rangeValue);
//   }, [update]);

//   const handleClearAll = () => {
//     if (onClearAll) onClearAll();
//     else onChange(DEFAULT_FILTERS);
//   };

//   const hasActiveFilters =
//     category !== '' || bags.length > 0 || brands.length > 0 ||
//     material.length > 0 || sizes.length > 0 || priceRange !== '' || capacities.length > 0;

//   return (
//     <aside className="filter-sidebar-flipkart">
//       {!hideHeader && (
//         <div className="filter-header">
//           <h3 className="filter-title">Filters</h3>
//           {hasActiveFilters && (
//             <button className="clear-all-btn" onClick={handleClearAll}>CLEAR ALL</button>
//           )}
//         </div>
//       )}
//       {hideHeader && hasActiveFilters && (
//         <div className="filter-header" style={{ paddingTop: 0 }}>
//           <span />
//           <button className="clear-all-btn" onClick={handleClearAll}>CLEAR ALL</button>
//         </div>
//       )}

//       {activeTags && activeTags.length > 0 && (
//         <ActiveFilterTags filters={activeTags} onRemove={onRemoveTag} />
//       )}

//       <FilterSection title="CATEGORIES">
//         <div className="category-buttons">
//           {['wallet', 'belt', 'bag'].map((cat) => (
//             <button
//               key={cat}
//               className={`category-btn ${category === cat ? 'active' : ''}`}
//               onClick={() => handleCategoryClick(cat)}
//             >
//               {cat.charAt(0).toUpperCase() + cat.slice(1)}s
//             </button>
//           ))}
//         </div>
//       </FilterSection>

//       {category !== '' && (
//         <>
//           <FilterSection title="PRICE">
//             <PriceRangeSelector
//               ranges={PRICE_RANGES}
//               selected={priceRange}
//               onChange={handlePriceRangeSelect}
//             />
//           </FilterSection>

//           {category === 'bag' && (
//             <>
//               <FilterSection title="BAG TYPES">
//                 <CheckboxList options={BAG_TYPES} selected={bags} onChange={handleBagToggle} initialLimit={4} />
//               </FilterSection>
//               <FilterSection title="BRANDS">
//                 <CheckboxList options={BRANDS} selected={brands} onChange={handleBrandToggle} initialLimit={4} />
//               </FilterSection>
//               <FilterSection title="MATERIAL">
//                 <CheckboxList options={MATERIALS} selected={material} onChange={handleMaterialToggle} initialLimit={3} />
//               </FilterSection>
//               <FilterSection title="CAPACITY">
//                 <CapacityCards options={CAPACITIES} selected={capacities} onChange={(v) => update('capacities', v)} initialLimit={3} />
//               </FilterSection>
//             </>
//           )}

//           {category === 'wallet' && (
//             <FilterSection title="MATERIAL">
//               <CheckboxList options={MATERIALS} selected={material} onChange={handleMaterialToggle} initialLimit={3} />
//             </FilterSection>
//           )}

//           {category === 'belt' && (
//             <FilterSection title="SIZE">
//               <SizeButtons options={BELT_SIZES} selected={sizes} onChange={(v) => update('sizes', v)} initialLimit={3} />
//             </FilterSection>
//           )}
//         </>
//       )}
//     </aside>
//   );
// });

// export default FilterSideBar;


// // import { useState, useEffect, useCallback, memo } from 'react';
// // import 'bootstrap-icons/font/bootstrap-icons.css';
// // import "../../assets/styles/FilterSideBar.css";

// // // ── Static Data ───────────────────────────────────────────────────────────────

// // export const BAG_TYPES = ['College Bag', 'Hand Bag', 'Lunch Bag', 'Office Bag', 'School Bag', 'Travel Bag', 'Trolley Bag'];
// // export const BRANDS    = ['American Tourister', 'Puma', 'Rubee bags', 'Safari', 'Sky bags', 'VIP', 'Wildcraft'];
// // export const MATERIALS = ['Leather', 'Canvas'];
// // export const SIZES     = ['Small', 'Medium', 'Large'];
// // export const PATTERNS  = ['Plain', 'Snake Leather', 'Crocodile', 'Ostrich'];
// // export const CAPACITIES = ['20L', '30L', '40L'];

// // // Belt uses the same SIZES but without XL
// // export const BELT_SIZES = ['Small', 'Medium', 'Large'];

// // export const PRICE_RANGES = [
// //   { label: 'Under ₹500',    value: 'under500',   min: 0,    max: 500      },
// //   { label: '₹500 - ₹1000',  value: '500-1000',   min: 500,  max: 1000     },
// //   { label: '₹1000 - ₹2000', value: '1000-2000',  min: 1000, max: 2000     },
// //   { label: 'Above ₹2000',   value: 'above2000',  min: 2000, max: Infinity },
// // ];

// // export const DEFAULT_FILTERS = {
// //   category:   '',
// //   bags:       [],
// //   brands:     [],
// //   material:   [],
// //   sizes:      [],
// //   priceRange: '',
// //   capacities: [],
// // };

// // // ── Flipkart-style collapsible section ─────────────────────────────────────────
// // const FilterSection = ({ title, children, defaultOpen = true }) => {
// //   const [isOpen, setIsOpen] = useState(defaultOpen);
  
// //   return (
// //     <div className="filter-section">
// //       <div className="filter-section-header" onClick={() => setIsOpen(!isOpen)}>
// //         <span className="filter-section-title">{title}</span>
// //         <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
// //       </div>
// //       {isOpen && <div className="filter-section-content">{children}</div>}
// //     </div>
// //   );
// // };

// // // ── Checkbox List Component with Show More/Less ─────────────────────────────
// // const CheckboxList = ({ options, selected, onChange, color = '#8b5cf6', initialLimit = 4 }) => {
// //   const [showAll, setShowAll] = useState(false);
// //   const visibleOptions = showAll ? options : options.slice(0, initialLimit);
// //   const hasMore = options.length > initialLimit;

// //   return (
// //     <div className="checkbox-list-wrapper">
// //       <div className="checkbox-list">
// //         {visibleOptions.map((option) => (
// //           <label key={option} className="checkbox-item">
// //             <input
// //               type="checkbox"
// //               checked={selected.includes(option)}
// //               onChange={() => onChange(option)}
// //               style={{ accentColor: color }}
// //             />
// //             <span>{option}</span>
// //           </label>
// //         ))}
// //       </div>
// //       {hasMore && (
// //         <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
// //           {showAll ? 'Show Less' : `+ ${options.length - initialLimit} more`}
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // // ── Size Buttons Component with Show More/Less ──────────────────────────────
// // const SizeButtons = ({ options, selected = [], onChange, initialLimit = 3 }) => {
// //   const [showAll, setShowAll] = useState(false);
// //   const visibleOptions = showAll ? options : options.slice(0, initialLimit);
// //   const hasMore = options.length > initialLimit;

// //   return (
// //     <div className="size-wrapper">
// //       <div className="size-buttons">
// //         {visibleOptions.map((size) => {
// //           const isActive = selected.includes(size);
// //           return (
// //             <button
// //               key={size}
// //               className={`size-btn ${isActive ? 'active' : ''}`}
// //               onClick={() => {
// //                 const next = isActive
// //                   ? selected.filter((s) => s !== size)
// //                   : [...selected, size];
// //                 onChange(next);
// //               }}
// //             >
// //               {size}
// //             </button>
// //           );
// //         })}
// //       </div>
// //       {hasMore && (
// //         <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
// //           {showAll ? 'Show Less' : `+ ${options.length - initialLimit} more`}
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // // ── Capacity Cards Component (card style with subtitle) ──────────────────────
// // const CapacityCards = ({ options, selected = [], onChange, initialLimit = 3 }) => {
// //   const [showAll, setShowAll] = useState(false);
// //   const visibleOptions = showAll ? options : options.slice(0, initialLimit);
// //   const hasMore = options.length > initialLimit;

// //   return (
// //     <div className="capacity-cards-wrapper">
// //       <div className="capacity-cards">
// //         {visibleOptions.map((option) => {
// //           const isActive = selected.includes(option);
// //           return (
// //             <button
// //               key={option}
// //               className={`capacity-card ${isActive ? 'active' : ''}`}
// //               onClick={() => {
// //                 const next = isActive
// //                   ? selected.filter((c) => c !== option)
// //                   : [...selected, option];
// //                 onChange(next);
// //               }}
// //             >
// //               {isActive && (
// //                 <span className="capacity-check">
// //                   <i className="bi bi-check2"></i>
// //                 </span>
// //               )}
// //               <span className="capacity-value">{option}</span>
// //               <span className="capacity-label">Capacity</span>
// //             </button>
// //           );
// //         })}
// //       </div>
// //       {hasMore && (
// //         <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
// //           {showAll ? 'Show Less' : `+ ${options.length - initialLimit} more`}
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // // ── Active Filter Tags Component ────────────────────────────────────────────
// // const ActiveFilterTags = ({ filters, onRemove }) => {
// //   if (!filters || filters.length === 0) return null;

// //   return (
// //     <div className="active-filters-tags">
// //       {filters.map((filter, index) => (
// //         <div key={index} className="active-filter-tag">
// //           <span className="filter-tag-label">{filter.type}: {filter.label}</span>
// //           <button 
// //             onClick={() => onRemove(index)} 
// //             className="remove-filter-btn"
// //             aria-label={`Remove ${filter.label} filter`}
// //           >
// //             ✕
// //           </button>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // // ── Price Range Component with Custom Radio (OPTIMIZED FOR MOBILE) ───────────
// // const PriceRangeSelector = ({ ranges, selected, onChange }) => {
// //   // Local state for immediate UI feedback
// //   const [localSelected, setLocalSelected] = useState(selected);
  
// //   // Sync local state with prop
// //   useEffect(() => {
// //     setLocalSelected(selected);
// //   }, [selected]);
  
// //   // Optimized change handler with requestAnimationFrame
// //   const handleChange = useCallback((value) => {
// //     // Update local state immediately for UI feedback
// //     setLocalSelected(value);
// //     // Use requestAnimationFrame to batch the parent update
// //     requestAnimationFrame(() => {
// //       onChange(value);
// //     });
// //   }, [onChange]);
  
// //   return (
// //     <div className="price-options">
// //       {ranges.map((range) => (
// //         <label 
// //           key={range.value} 
// //           className="price-option"
// //           onTouchEnd={(e) => {
// //             e.preventDefault(); // Prevent double-firing on mobile
// //             handleChange(range.value);
// //           }}
// //           onClick={(e) => {
// //             // Handle click for desktop
// //             e.preventDefault();
// //             handleChange(range.value);
// //           }}
// //         >
// //           <input
// //             type="radio"
// //             name="price"
// //             checked={localSelected === range.value}
// //             onChange={() => {}} // Empty onChange, handled by label
// //             className="price-radio-input"
// //           />
// //           <span className="custom-radio"></span>
// //           <span className="price-label">{range.label}</span>
// //         </label>
// //       ))}
// //     </div>
// //   );
// // };

// // // ── Main FilterSideBar (Memoized for performance) ────────────────────────────
// // const FilterSideBar = memo(({ filters = {}, onChange, activeTags = [], onRemoveTag, onClearAll }) => {
// //   const category = filters.category ?? '';
// //   const bags = filters.bags ?? [];
// //   const brands = filters.brands ?? [];
// //   const material = filters.material ?? [];
// //   const sizes = filters.sizes ?? [];
// //   const priceRange = filters.priceRange ?? '';
// //   const capacities = filters.capacities ?? [];

// //   // Optimized update function
// //   const update = useCallback((key, value) => {
// //     onChange({ ...DEFAULT_FILTERS, ...filters, [key]: value });
// //   }, [filters, onChange]);

// //   const handleBagToggle = useCallback((type) => {
// //     const next = bags.includes(type) ? bags.filter((t) => t !== type) : [...bags, type];
// //     update('bags', next);
// //   }, [bags, update]);

// //   const handleBrandToggle = useCallback((brand) => {
// //     const next = brands.includes(brand) ? brands.filter((b) => b !== brand) : [...brands, brand];
// //     update('brands', next);
// //   }, [brands, update]);

// //   const handleMaterialToggle = useCallback((materialItem) => {
// //     const next = material.includes(materialItem) 
// //       ? material.filter((m) => m !== materialItem) 
// //       : [...material, materialItem];
// //     update('material', next);
// //   }, [material, update]);

// //   const handleCategoryClick = useCallback((cat) => {
// //     const resetFilters = { ...DEFAULT_FILTERS, category: category === cat ? '' : cat };
// //     onChange(resetFilters);
// //   }, [category, onChange]);

// //   const handlePriceRangeSelect = useCallback((rangeValue) => {
// //     update('priceRange', priceRange === rangeValue ? '' : rangeValue);
// //   }, [priceRange, update]);

// //   const handleClearAll = () => {
// //     if (onClearAll) {
// //       onClearAll();
// //     } else {
// //       onChange(DEFAULT_FILTERS);
// //     }
// //   };

// //   const hasActiveFilters = () => {
// //     return category !== '' || bags.length > 0 || brands.length > 0 || 
// //            material.length > 0 || sizes.length > 0 || priceRange !== '' || capacities.length > 0;
// //   };

// //   const shouldShowFilters = () => {
// //     return category !== '';
// //   };

// //   return (
// //     <aside className="filter-sidebar-flipkart">
// //       <div className="filter-header">
// //         <h3 className="filter-title">Filters</h3>
// //         {hasActiveFilters() && (
// //           <button className="clear-all-btn" onClick={handleClearAll}>
// //             CLEAR ALL
// //           </button>
// //         )}
// //       </div>

// //       {activeTags && activeTags.length > 0 && (
// //         <ActiveFilterTags 
// //           filters={activeTags} 
// //           onRemove={onRemoveTag}
// //         />
// //       )}

// //       <FilterSection title="CATEGORIES">
// //         <div className="category-buttons">
// //           <button
// //             className={`category-btn ${category === 'wallet' ? 'active' : ''}`}
// //             onClick={() => handleCategoryClick('wallet')}
// //           >
// //             Wallets
// //           </button>
// //           <button
// //             className={`category-btn ${category === 'belt' ? 'active' : ''}`}
// //             onClick={() => handleCategoryClick('belt')}
// //           >
// //             Belts
// //           </button>
// //           <button
// //             className={`category-btn ${category === 'bag' ? 'active' : ''}`}
// //             onClick={() => handleCategoryClick('bag')}
// //           >
// //             Bags
// //           </button>
// //         </div>
// //       </FilterSection>

// //       {shouldShowFilters() && (
// //         <>
// //           <FilterSection title="PRICE">
// //             <PriceRangeSelector
// //               ranges={PRICE_RANGES}
// //               selected={priceRange}
// //               onChange={handlePriceRangeSelect}
// //             />
// //           </FilterSection>

// //           {category === 'bag' && (
// //             <>
// //               <FilterSection title="BAG TYPES">
// //                 <CheckboxList 
// //                   options={BAG_TYPES}
// //                   selected={bags}
// //                   onChange={handleBagToggle}
// //                   initialLimit={4}
// //                 />
// //               </FilterSection>

// //               <FilterSection title="BRANDS">
// //                 <CheckboxList 
// //                   options={BRANDS}
// //                   selected={brands}
// //                   onChange={handleBrandToggle}
// //                   initialLimit={4}
// //                 />
// //               </FilterSection>

// //               <FilterSection title="MATERIAL">
// //                 <CheckboxList 
// //                   options={MATERIALS}
// //                   selected={material}
// //                   onChange={handleMaterialToggle}
// //                   initialLimit={3}
// //                 />
// //               </FilterSection>

// //               <FilterSection title="CAPACITY">
// //                 <CapacityCards
// //                   options={CAPACITIES}
// //                   selected={capacities}
// //                   onChange={(value) => update('capacities', value)}
// //                   initialLimit={3}
// //                 />
// //               </FilterSection>
// //             </>
// //           )}

// //           {category === 'wallet' && (
// //             <>
// //               <FilterSection title="MATERIAL">
// //                 <CheckboxList 
// //                   options={MATERIALS}
// //                   selected={material}
// //                   onChange={handleMaterialToggle}
// //                   initialLimit={3}
// //                 />
// //               </FilterSection>
// //             </>
// //           )}

// //           {category === 'belt' && (
// //             <>
// //               <FilterSection title="SIZE">
// //                 <SizeButtons 
// //                   options={BELT_SIZES}
// //                   selected={sizes}
// //                   onChange={(value) => update('sizes', value)}
// //                   initialLimit={3}
// //                 />
// //               </FilterSection>
// //             </>
// //           )}
// //         </>
// //       )}
// //     </aside>
// //   );
// // }, (prevProps, nextProps) => {
// //   // Custom comparison to prevent unnecessary re-renders
// //   return JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters) &&
// //          JSON.stringify(prevProps.activeTags) === JSON.stringify(nextProps.activeTags);
// // });

// // export default FilterSideBar;

// // // import { useState } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import 'bootstrap-icons/font/bootstrap-icons.css';
// // // import "../../assets/styles/FilterSideBar.css";

// // // // ── Static Data ───────────────────────────────────────────────────────────────
// // // export const BAG_TYPES = ['Laptop Bag', 'Travel bag', 'Lunch bag', 'Hand bag', 'Briefcase', 'Travel Duffel Bag'];
// // // export const BRANDS    = ['Puma', 'American Tourist', 'Sky bags', 'VIP', 'Safari'];
// // // export const MATERIALS = ['Leather bags', 'Canvas bags', 'Nylon bags', 'Polyester bags'];
// // // export const SIZES     = ['Small', 'Medium', 'Large', 'XL'];
// // // export const PATTERNS  = ['Plain', 'Snake Leather', 'Crocodile', 'Ostrich'];
// // // export const CAPACITIES = ['20L', '30L', '40L'];

// // // // Belt uses the same SIZES but without XL
// // // export const BELT_SIZES = ['Small', 'Medium', 'Large']; // Removed 'XL'

// // // export const PRICE_RANGES = [
// // //   { label: 'Under ₹500',    value: 'under500',   min: 0,    max: 500      },
// // //   { label: '₹500 - ₹1000',  value: '500-1000',   min: 500,  max: 1000     },
// // //   { label: '₹1000 - ₹2000', value: '1000-2000',  min: 1000, max: 2000     },
// // //   { label: 'Above ₹2000',   value: 'above2000',  min: 2000, max: Infinity },
// // // ];

// // // export const DEFAULT_FILTERS = {
// // //   category:   '',
// // //   bags:       [],
// // //   brands:     [],
// // //   material:   [],
// // //   size:       '',
// // //   priceRange: '',
// // //   capacity:   '',
// // // };

// // // // ── Flipkart-style collapsible section ─────────────────────────────────────────
// // // const FilterSection = ({ title, children, defaultOpen = true }) => {
// // //   const [isOpen, setIsOpen] = useState(defaultOpen);
  
// // //   return (
// // //     <div className="filter-section">
// // //       <div className="filter-section-header" onClick={() => setIsOpen(!isOpen)}>
// // //         <span className="filter-section-title">{title}</span>
// // //         <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
// // //       </div>
// // //       {isOpen && <div className="filter-section-content">{children}</div>}
// // //     </div>
// // //   );
// // // };

// // // // ── Checkbox List Component with Show More/Less ─────────────────────────────
// // // const CheckboxList = ({ options, selected, onChange, color = '#8b5cf6', initialLimit = 4 }) => {
// // //   const [showAll, setShowAll] = useState(false);
// // //   const visibleOptions = showAll ? options : options.slice(0, initialLimit);
// // //   const hasMore = options.length > initialLimit;

// // //   return (
// // //     <div className="checkbox-list-wrapper">
// // //       <div className="checkbox-list">
// // //         {visibleOptions.map((option) => (
// // //           <label key={option} className="checkbox-item">
// // //             <input
// // //               type="checkbox"
// // //               checked={selected.includes(option)}
// // //               onChange={() => onChange(option)}
// // //               style={{ accentColor: color }}
// // //             />
// // //             <span>{option}</span>
// // //           </label>
// // //         ))}
// // //       </div>
// // //       {hasMore && (
// // //         <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
// // //           {showAll ? 'Show Less' : `+ ${options.length - initialLimit} more`}
// // //         </button>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // // ── Size Buttons Component with Show More/Less ──────────────────────────────
// // // const SizeButtons = ({ options, selected, onChange, initialLimit = 3 }) => {
// // //   const [showAll, setShowAll] = useState(false);
// // //   const visibleOptions = showAll ? options : options.slice(0, initialLimit);
// // //   const hasMore = options.length > initialLimit;

// // //   return (
// // //     <div className="size-wrapper">
// // //       <div className="size-buttons">
// // //         {visibleOptions.map((size) => (
// // //           <button
// // //             key={size}
// // //             className={`size-btn ${selected === size ? 'active' : ''}`}
// // //             onClick={() => onChange(selected === size ? '' : size)}
// // //           >
// // //             {size}
// // //           </button>
// // //         ))}
// // //       </div>
// // //       {hasMore && (
// // //         <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
// // //           {showAll ? 'Show Less' : `+ ${options.length - initialLimit} more`}
// // //         </button>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // // ── Capacity Cards Component (card style with subtitle) ──────────────────────
// // // const CapacityCards = ({ options, selected, onChange, initialLimit = 3 }) => {
// // //   const [showAll, setShowAll] = useState(false);
// // //   const visibleOptions = showAll ? options : options.slice(0, initialLimit);
// // //   const hasMore = options.length > initialLimit;

// // //   return (
// // //     <div className="capacity-cards-wrapper">
// // //       <div className="capacity-cards">
// // //         {visibleOptions.map((option) => {
// // //           const isActive = selected === option;
// // //           return (
// // //             <button
// // //               key={option}
// // //               className={`capacity-card ${isActive ? 'active' : ''}`}
// // //               onClick={() => onChange(isActive ? '' : option)}
// // //             >
// // //               {isActive && (
// // //                 <span className="capacity-check">
// // //                   <i className="bi bi-check2"></i>
// // //                 </span>
// // //               )}
// // //               <span className="capacity-value">{option}</span>
// // //               <span className="capacity-label">Capacity</span>
// // //             </button>
// // //           );
// // //         })}
// // //       </div>
// // //       {hasMore && (
// // //         <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
// // //           {showAll ? 'Show Less' : `+ ${options.length - initialLimit} more`}
// // //         </button>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // // ── Active Filter Tags Component ─────────────────────────────────────
// // // const ActiveFilterTags = ({ filters, onRemove }) => {
// // //   if (!filters || filters.length === 0) return null;

// // //   return (
// // //     <div className="active-filters-tags">
// // //       {filters.map((filter, index) => (
// // //         <div key={index} className="active-filter-tag">
// // //           <span className="filter-tag-label">{filter.type}: {filter.label}</span>
// // //           <button 
// // //             onClick={() => onRemove(index)} 
// // //             className="remove-filter-btn"
// // //             aria-label={`Remove ${filter.label} filter`}
// // //           >
// // //             ✕
// // //           </button>
// // //         </div>
// // //       ))}
// // //     </div>
// // //   );
// // // };

// // // // ── Main FilterSideBar ────────────────────────────────────────────────────────
// // // const FilterSideBar = ({ filters = {}, onChange, activeTags = [], onRemoveTag, onClearAll }) => {
// // //   const category = filters.category ?? '';
// // //   const bags = filters.bags ?? [];
// // //   const brands = filters.brands ?? [];
// // //   const material = filters.material ?? [];
// // //   const size = filters.size ?? '';
// // //   const priceRange = filters.priceRange ?? '';
// // //   const capacity = filters.capacity ?? '';

// // //   const update = (key, value) => onChange({ ...DEFAULT_FILTERS, ...filters, [key]: value });

// // //   const handleBagToggle = (type) => {
// // //     const next = bags.includes(type) ? bags.filter((t) => t !== type) : [...bags, type];
// // //     update('bags', next);
// // //   };

// // //   const handleBrandToggle = (brand) => {
// // //     const next = brands.includes(brand) ? brands.filter((b) => b !== brand) : [...brands, brand];
// // //     update('brands', next);
// // //   };

// // //   const handleMaterialToggle = (materialItem) => {
// // //     const next = material.includes(materialItem) 
// // //       ? material.filter((m) => m !== materialItem) 
// // //       : [...material, materialItem];
// // //     update('material', next);
// // //   };

// // //   const handleCategoryClick = (cat) => {
// // //     // Reset all filters when changing category
// // //     const resetFilters = { ...DEFAULT_FILTERS, category: category === cat ? '' : cat };
// // //     onChange(resetFilters);
// // //   };

// // //   const handlePriceRangeSelect = (rangeValue) => {
// // //     update('priceRange', priceRange === rangeValue ? '' : rangeValue);
// // //   };

// // //   const handleCapacitySelect = (capacityValue) => {
// // //     update('capacity', capacity === capacityValue ? '' : capacityValue);
// // //   };

// // //   const handleClearAll = () => {
// // //     if (onClearAll) {
// // //       onClearAll();
// // //     } else {
// // //       onChange(DEFAULT_FILTERS);
// // //     }
// // //   };

// // //   const hasActiveFilters = () => {
// // //     return category !== '' || bags.length > 0 || brands.length > 0 || 
// // //            material.length > 0 || size !== '' || priceRange !== '' || capacity !== '';
// // //   };

// // //   // Show all filters when a category is clicked
// // //   const shouldShowFilters = () => {
// // //     return category !== '';
// // //   };

// // //   return (
// // //     <aside className="filter-sidebar-flipkart">
// // //       <div className="filter-header">
// // //         <h3 className="filter-title">Filters</h3>
// // //         {hasActiveFilters() && (
// // //           <button className="clear-all-btn" onClick={handleClearAll}>
// // //             CLEAR ALL
// // //           </button>
// // //         )}
// // //       </div>

// // //       {/* Active Filter Tags */}
// // //       {activeTags && activeTags.length > 0 && (
// // //         <ActiveFilterTags 
// // //           filters={activeTags} 
// // //           onRemove={onRemoveTag}
// // //         />
// // //       )}

// // //       {/* Category Section */}
// // //       <FilterSection title="CATEGORIES">
// // //         <div className="category-buttons">
// // //           <button
// // //             className={`category-btn ${category === 'wallet' ? 'active' : ''}`}
// // //             onClick={() => handleCategoryClick('wallet')}
// // //           >
// // //             Wallets
// // //           </button>
// // //           <button
// // //             className={`category-btn ${category === 'belt' ? 'active' : ''}`}
// // //             onClick={() => handleCategoryClick('belt')}
// // //           >
// // //             Belts
// // //           </button>
// // //           <button
// // //             className={`category-btn ${category === 'bag' ? 'active' : ''}`}
// // //             onClick={() => handleCategoryClick('bag')}
// // //           >
// // //             Bags
// // //           </button>
// // //         </div>
// // //       </FilterSection>

// // //       {/* Show all filters based on selected category */}
// // //       {shouldShowFilters() && (
// // //         <>
// // //           {/* Common Price Section for all categories */}
// // //           <FilterSection title="PRICE">
// // //             <div className="price-options">
// // //               {PRICE_RANGES.map((range) => (
// // //                 <label key={range.value} className="price-option">
// // //                   <input
// // //                     type="radio"
// // //                     name="price"
// // //                     checked={priceRange === range.value}
// // //                     onChange={() => handlePriceRangeSelect(range.value)}
// // //                   />
// // //                   <span>{range.label}</span>
// // //                 </label>
// // //               ))}
// // //             </div>
// // //           </FilterSection>

// // //           {/* Category-specific filters */}
// // //           {category === 'bag' && (
// // //             <>
// // //               <FilterSection title="BAG TYPES">
// // //                 <CheckboxList 
// // //                   options={BAG_TYPES}
// // //                   selected={bags}
// // //                   onChange={handleBagToggle}
// // //                   initialLimit={4}
// // //                 />
// // //               </FilterSection>

// // //               <FilterSection title="BRANDS">
// // //                 <CheckboxList 
// // //                   options={BRANDS}
// // //                   selected={brands}
// // //                   onChange={handleBrandToggle}
// // //                   initialLimit={4}
// // //                 />
// // //               </FilterSection>

// // //               <FilterSection title="MATERIAL">
// // //                 <CheckboxList 
// // //                   options={MATERIALS}
// // //                   selected={material}
// // //                   onChange={handleMaterialToggle}
// // //                   initialLimit={3}
// // //                 />
// // //               </FilterSection>

// // //               <FilterSection title="CAPACITY">
// // //                 <CapacityCards
// // //                   options={CAPACITIES}
// // //                   selected={capacity}
// // //                   onChange={handleCapacitySelect}
// // //                   initialLimit={3}
// // //                 />
// // //               </FilterSection>
// // //             </>
// // //           )}

// // //           {category === 'wallet' && (
// // //             <>
// // //               <FilterSection title="MATERIAL">
// // //                 <CheckboxList 
// // //                   options={MATERIALS}
// // //                   selected={material}
// // //                   onChange={handleMaterialToggle}
// // //                   initialLimit={3}
// // //                 />
// // //               </FilterSection>
// // //             </>
// // //           )}

// // //           {category === 'belt' && (
// // //             <>
// // //               <FilterSection title="SIZE">
// // //                 <SizeButtons 
// // //                   options={BELT_SIZES}
// // //                   selected={size}
// // //                   onChange={(value) => update('size', value)}
// // //                   initialLimit={3}
// // //                 />
// // //               </FilterSection>
// // //             </>
// // //           )}
// // //         </>
// // //       )}
// // //     </aside>
// // //   );
// // // };

// // // export default FilterSideBar;