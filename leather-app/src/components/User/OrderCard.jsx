import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const STATUS_MAP = {
  "Order Placed": { color: "#8b5cf6" },
  Shipped: { color: "#2563eb" },
  "Out for Delivery": { color: "#d97706" },
  Delivered: { color: "#16a34a" },
  Processing: { color: "#f59e0b" },
};
const getStatusColor = (s) => (STATUS_MAP[s] || { color: "#f59e0b" }).color;

const isProductReviewed = (productName) => {
  try {
    const raw = localStorage.getItem("user_reviewed_products");
    return raw ? JSON.parse(raw).includes(productName) : false;
  } catch {
    return false;
  }
};

const Stars = ({ rating }) => (
  <span style={{ display: "inline-flex", gap: "1px" }}>
    {[...Array(5)].map((_, i) =>
      i < Math.round(rating) ? (
        <FaStar key={i} style={{ color: "#f59e0b", fontSize: "12px" }} />
      ) : (
        <FaRegStar key={i} style={{ color: "#d1d5db", fontSize: "12px" }} />
      ),
    )}
  </span>
);

const OrderCard = ({ order, onReviewClick }) => {
  const navigate = useNavigate();
  const [reviewed, setReviewed] = useState(() =>
    isProductReviewed(order.product),
  );

  useEffect(() => {
    const sync = () => setReviewed(isProductReviewed(order.product));
    window.addEventListener("storage", sync);
    const id = setInterval(sync, 500);
    return () => {
      window.removeEventListener("storage", sync);
      clearInterval(id);
    };
  }, [order.product]);

  // Dynamic SBO ID Formatter for Desktop Layouts
  const getFormattedOrderId = () => {
    if (order.id && order.id.startsWith("SBO-")) return order.id;
    const category = order.category || "bag";
    let catCode = "BAG";
    if (
      category.toLowerCase().includes("wallet") ||
      category.toLowerCase().includes("wlt")
    )
      catCode = "WLT";
    if (
      category.toLowerCase().includes("belt") ||
      category.toLowerCase().includes("blt")
    )
      catCode = "BLT";

    const today = new Date();
    return `SBO-${catCode}-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-001`;
  };

  const finalOrderId = getFormattedOrderId();
  const discountedPrice = Number(order.discountedPrice) || 0;
  const originalPrice = Number(order.originalPrice) || discountedPrice;
  const hasDiscount = originalPrice > discountedPrice;
  const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

  const statusColor = getStatusColor(order.status);

  return (
    <div className="responsive-order-card-root">
      {/* ─── DESKTOP VIEW STRUCTURE ─── */}
      <div className="desktop-card-layout-view">
        <div className="responsive-col-box desktop-info-box">
          <div className="desktop-image-wrapper">
            {order.image ? (
              <img
                src={order.image}
                alt={order.product}
                className="desktop-product-img"
              />
            ) : (
              <div className="desktop-product-img-fallback">🛍️</div>
            )}
          </div>
          <div className="desktop-text-wrapper">
            <p className="desktop-order-id-txt">{finalOrderId}</p>
            <div className="desktop-title-row">
              <span className="desktop-product-title-name">
                {order.product}
              </span>
              <Stars rating={order.rating || 4.2} />
              <span className="desktop-reviews-count-lbl">
                ({order.reviews || 120})
              </span>
            </div>
            <div className="desktop-price-row">
              <span className="desktop-current-price">
                {fmt(discountedPrice)}
              </span>
              {hasDiscount && (
                <span className="desktop-original-price">
                  {fmt(originalPrice)}
                </span>
              )}
            </div>
            <p className="desktop-qty-lbl">Qty: {order.quantity || 1}</p>
          </div>
        </div>

        <div className="responsive-section-divider" />

        <div className="responsive-col-box desktop-status-box">
          <span className="desktop-section-title">STATUS</span>
          <span
            className="desktop-status-value-txt"
            style={{ color: statusColor }}
          >
            {order.status === "Processing" ? "Order Placed" : order.status}
          </span>
          <button
            className="desktop-track-btn"
            onClick={() => navigate("/Track-Order", { state: { order } })}
          >
            Track order
          </button>
        </div>

        <div className="responsive-section-divider" />

        <div className="responsive-col-box desktop-time-box">
          <span className="desktop-section-title">TIME</span>
          <span className="desktop-time-val-txt">
            {order.time || "25/04/2020"}
          </span>
          <span
            className="desktop-delivery-eta-txt"
            style={{
              color: order.status === "Delivered" ? "#16a34a" : "#374151",
            }}
          >
            {order.deliveryDate || "Expected in 5 Days"}
          </span>
          <div className="desktop-review-trigger-slot">
            {reviewed ? (
              <div className="desktop-reviewed-badge">
                <MdVerified size={14} /> Review Submitted
              </div>
            ) : (
              <button
                className="desktop-rate-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onReviewClick();
                }}
              >
                ★ Rate Your Product
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── 📱 MOBILE VIEW STRUCTURE (STRICT 4-ROW MATRIX) ─── */}
      <div className="mobile-card-layout-view">
        {/* UPPER BLOCK : Image + Right Side Rows */}
        <div className="mobile-upper-mesh-block">
          <div className="mobile-image-frame">
            {order.image ? (
              <img
                src={order.image}
                alt={order.product}
                className="mobile-img-element"
              />
            ) : (
              <div className="mobile-img-element-fallback">🛍️</div>
            )}
          </div>

          <div className="mobile-right-specs-column">
            {/* ROW 1 : Product Name (Ellipsis) + Right End Rating Score */}
            <div className="mobile-specs-row-one">
              <span className="mobile-product-title-string">
                {order.product}
              </span>
              <span className="mobile-product-rating-badge">
                {(order.rating || 4.2).toFixed(1)}{" "}
                <FaStar
                  style={{
                    color: "#f59e0b",
                    fontSize: "11px",
                    marginBottom: "2px",
                  }}
                />
              </span>
            </div>

            {/* ROW 2 : Pricing + Right End Qty */}
            <div className="mobile-specs-row-two">
              <div className="mobile-price-inline-group">
                <span className="mobile-curr-price-txt">
                  {fmt(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="mobile-orig-price-txt">
                    {fmt(originalPrice)}
                  </span>
                )}
              </div>
              <span className="mobile-qty-string-txt">
                Qty: {order.quantity || 1}
              </span>
            </div>
          </div>
        </div>

        {/* LOWER BLOCK : Image Down Side Grid (Status, Date, Button parallel) */}
        <div className="mobile-lower-actions-tray-block">
          <div className="mobile-action-status-cell">
            <span className="mobile-action-label">Status</span>
            <span
              className="mobile-action-status-val"
              style={{ color: statusColor }}
            >
              {order.status === "Processing" ? "Order Placed" : order.status}
            </span>
          </div>

          <div className="mobile-action-time-cell">
            <span className="mobile-action-label">Time</span>
            <span className="mobile-action-time-val">
              {order.time || "25/04/2020"}
            </span>
          </div>

          <button
            className="mobile-action-track-submit-btn"
            onClick={() => navigate("/TrackOrder", { state: { order } })}
          >
            Track order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
