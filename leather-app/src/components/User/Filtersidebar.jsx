import { useState } from "react";
import "../../assets/styles/filtersidebar.css";

// ── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = ["Bags", "Wallet", "Belt"];
const SIZES      = ["Small", "Medium", "Large", "XL"];
const PATTERNS   = ["Plain", "Snake Leather", "Crocodile", "Ostrich"];
const COLORS = [
  { name: "Orange",      hex: "#F97316", count: 5 },
  { name: "Blue",        hex: "#3B82F6", count: 5 },
  { name: "Light green", hex: "#86EFAC", count: 3 },
  { name: "Red",         hex: "#EF4444", count: 5 },
  { name: "Green",       hex: "#22C55E", count: 3 },
  { name: "Purple",      hex: "#A855F7", count: 6 },
  { name: "Black",       hex: "#111111", count: 6 },
  { name: "Yellow",      hex: "#EAB308", count: 6 },
];

// ── Small reusable dropdown ───────────────────────────────────────────────────
function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fs-dropdown">
      <button
        className="fs-dropdown-btn"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <span>{value || label}</span>
        <i className={`bi bi-chevron-${open ? "up" : "down"}`} />
      </button>
      {open && (
        <ul className="fs-dropdown-menu">
          <li
            className={`fs-dropdown-item ${!value ? "active" : ""}`}
            onClick={() => { onChange(""); setOpen(false); }}
          >
            All
          </li>
          {options.map((opt) => (
            <li
              key={opt}
              className={`fs-dropdown-item ${value === opt ? "active" : ""}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Main FilterSidebar ────────────────────────────────────────────────────────
export default function FilterSidebar({
  filters,
  onChange,
  onApply,
  isOpen
}) {
  const { category, size, pattern, colors, priceRange } = filters;

  const toggleColor = (name) => {
    const next = colors.includes(name)
      ? colors.filter((c) => c !== name)
      : [...colors, name];
    onChange({ ...filters, colors: next });
  };

  return (
    <aside className={`fs-sidebar ${isOpen ? "open" : ""}`}>
      {/* Title */}
      <h6 className="fs-main-title">Product Categories</h6>

      {/* ── Category dropdowns ── */}
      <div className="fs-section">
        <p className="fs-section-label">All Filters</p>
        <FilterDropdown
          label="Bags"
          options={CATEGORIES}
          value={category}
          onChange={(v) => onChange({ ...filters, category: v })}
        />
        <FilterDropdown
          label="Wallet"
          options={["Wallet", "Slim Wallet", "Zip Wallet"]}
          value=""
          onChange={() => {}}
        />
        <FilterDropdown
          label="Belt"
          options={["Belt", "Classic Belt", "Braided Belt"]}
          value=""
          onChange={() => {}}
        />
      </div>

      {/* ── Price range ── */}
      <div className="fs-section">
        <p className="fs-section-label">Filter by price</p>
        <input
          type="range"
          className="fs-range"
          min={0}
          max={860}
          step={5}
          value={priceRange[1]}
          onChange={(e) =>
            onChange({ ...filters, priceRange: [priceRange[0], +e.target.value] })
          }
        />
        <div className="fs-price-inputs">
          <input
            type="number"
            className="fs-price-input"
            value={priceRange[0]}
            onChange={(e) =>
              onChange({ ...filters, priceRange: [+e.target.value, priceRange[1]] })
            }
          />
          <span className="fs-price-dash">–</span>
          <input
            type="number"
            className="fs-price-input"
            value={priceRange[1]}
            onChange={(e) =>
              onChange({ ...filters, priceRange: [priceRange[0], +e.target.value] })
            }
          />
        </div>
      </div>

      {/* ── Product sizes ── */}
      <div className="fs-section">
        <p className="fs-section-label">Product sizes</p>
        <FilterDropdown
          label="Product Sizes"
          options={SIZES}
          value={size}
          onChange={(v) => onChange({ ...filters, size: v })}
        />
      </div>

      {/* ── Patterns ── */}
      <div className="fs-section">
        <p className="fs-section-label">Patterns Category</p>
        <FilterDropdown
          label="Pattern leather"
          options={PATTERNS}
          value={pattern}
          onChange={(v) => onChange({ ...filters, pattern: v })}
        />
      </div>

      {/* ── Color filter ── */}
      <div className="fs-section">
        <p className="fs-section-label">Filter by Color</p>
        <div className="fs-color-grid">
          {COLORS.map((c) => (
            <div
              key={c.name}
              className={`fs-color-item ${colors.includes(c.name) ? "selected" : ""}`}
              onClick={() => toggleColor(c.name)}
            >
              <span className="fs-color-dot" style={{ background: c.hex }} />
              <span className="fs-color-name">{c.name}</span>
              <span className="fs-color-count">({c.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Apply button ── */}
      <button className="fs-apply-btn" type="button" onClick={onApply}>
        Apply Filter
      </button>
    </aside>
  );
}
