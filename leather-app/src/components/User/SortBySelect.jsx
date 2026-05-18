import React from 'react';
import '../../assets/styles/SortBySelect.css';


const SortBySelect = ({ value, onChange }) => {
  return (
    <select
      className="sortby-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Sort by</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="rating">Rating</option>
      <option value="newest">Newest</option>
    </select>
  );
};

export default SortBySelect;