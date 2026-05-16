import React from "react";
import { VscFilterFilled } from "react-icons/vsc";
import { VscChromeClose } from "react-icons/vsc";

const FilterButton = ({ toggleSidebar, isOpen }) => {
  return (
    <button className="filter-btn" type="button" onClick={!isOpen ? toggleSidebar : undefined}>
      {/* Funnel icon + text always */}
      <VscFilterFilled className="me-2" />
      Filters

      {/* Show X only when open */}
      {isOpen && (
        <span className="close-icon" onClick={toggleSidebar}>
          <VscChromeClose />
        </span>
      )}
    </button>
  );
};

export default FilterButton;
