import React from 'react';
import '../../assets/styles/FilterToggleBtn.css';

const FilterToggleBtn = ({ onClick }) => {
  return (
    <button className="filter-toggle-btn" onClick={onClick}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
      Filters
    </button>
  );
};

export default FilterToggleBtn;