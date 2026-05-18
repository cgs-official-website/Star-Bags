// 
import { useState } from 'react';
import "../../assets/styles/FilterSideBar.css";

const bagTypes = [
  'Laptop Bag',
  'Travel bag',
  'Lunch bag',
  'Hand bag',
  'Briefcase',
  'Travel Duffel Bag',
];

const FilterSideBar = ({ onApply }) => {
  const [openDropdowns, setOpenDropdowns] = useState({
    Bags: false,
    Wallet: false,
    Belt: false,
    ProductSizes: false,
    PatternCategory: false,
  });

  const [selectedBagType, setSelectedBagType] = useState('Hand bag');
  const [priceRange, setPriceRange] = useState([0, 860]);

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApply = () => {
    if (onApply) {
      onApply({ selectedBagType, priceRange });
    }
  };

  return (
    <aside className="filter-sidebar">
      <h3 className="sidebar-title">Product Categories</h3>
      <p className="sidebar-subtitle">All Filters</p>

      {/* Bags */}
      <div className="filter-dropdown-group">
        <button
          className="filter-dropdown-btn"
          onClick={() => toggleDropdown('Bags')}
        >
          <span>Bags</span>
          <span className={`dropdown-arrow ${openDropdowns.Bags ? 'open' : ''}`}>
            &#8249;
          </span>
        </button>
        {openDropdowns.Bags && (
          <div className="filter-dropdown-list">
            {bagTypes.map((bag) => (
              <label
                key={bag}
                className={`filter-checkbox-item ${selectedBagType === bag ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedBagType === bag}
                  onChange={() => setSelectedBagType(bag)}
                />
                <span>{bag}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Wallet */}
      <div className="filter-dropdown-group">
        <button
          className="filter-dropdown-btn"
          onClick={() => toggleDropdown('Wallet')}
        >
          <span>Wallet</span>
          <span className={`dropdown-arrow ${openDropdowns.Wallet ? 'open' : ''}`}>
            &#8249;
          </span>
        </button>
      </div>

      {/* Belt */}
      <div className="filter-dropdown-group">
        <button
          className="filter-dropdown-btn"
          onClick={() => toggleDropdown('Belt')}
        >
          <span>Belt</span>
          <span className={`dropdown-arrow ${openDropdowns.Belt ? 'open' : ''}`}>
            &#8249;
          </span>
        </button>
      </div>

      {/* Filter by price */}
      <div className="filter-price-section">
        <p className="filter-label">Filter by price</p>
        <input
          type="range"
          min="0"
          max="860"
          value={priceRange[1]}
          className="price-range-slider"
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
        />
        <div className="price-range-inputs">
          <input
            type="number"
            value={priceRange[0]}
            min="0"
            max={priceRange[1]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
          />
          <span>-</span>
          <input
            type="number"
            value={priceRange[1]}
            min={priceRange[0]}
            max="860"
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          />
        </div>
      </div>

      {/* Product Sizes */}
      <div className="filter-dropdown-group">
        <p className="filter-label">Product sizes</p>
        <button
          className="filter-dropdown-btn"
          onClick={() => toggleDropdown('ProductSizes')}
        >
          <span>Product Sizes</span>
          <span className={`dropdown-arrow ${openDropdowns.ProductSizes ? 'open' : ''}`}>
            &#8249;
          </span>
        </button>
      </div>

      {/* Patterns Category */}
      <div className="filter-dropdown-group">
        <p className="filter-label">Patterns Category</p>
        <button
          className="filter-dropdown-btn"
          onClick={() => toggleDropdown('PatternCategory')}
        >
          <span>Pattern leather</span>
          <span className={`dropdown-arrow ${openDropdowns.PatternCategory ? 'open' : ''}`}>
            &#8249;
          </span>
        </button>
      </div>

      {/* Apply Button */}
      <button className="apply-filter-btn" onClick={handleApply}>
        Apply Filter
      </button>
    </aside>
  );
};

export default FilterSideBar;