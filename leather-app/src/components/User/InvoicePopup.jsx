import React from 'react';
import { IoMdClose } from "react-icons/io";
import { FaDownload } from "react-icons/fa";
import { generateInvoicePDF } from '../../utils/generateInvoicePDF';

const InvoicePopup = ({ isOpen, onClose, order, userAddress, paymentMethod, itemsPrice, savings, finalPrice }) => {
  if (!isOpen || !order) return null;

  const fmt = (n) => "₹ " + Number(n).toFixed(2);
  const qty = Number(order.quantity) || 1;
  const disc = Number(savings) || 0;
  const subTotal = Number(finalPrice) || 0;
  const gstIncluded = Math.round(subTotal * 0.18 * 100) / 100;

  const handleDownload = () => {
    generateInvoicePDF({ order, userAddress, itemsPrice, savings, finalPrice });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "16px",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div>
            <h4 style={{ margin: 0, fontWeight: 700, color: "#1e293b", fontSize: "1.1rem" }}>
              Tax Invoice Preview
            </h4>
            <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#94a3b8" }}>
              Order #{String(order.id || '').padStart(6, '0')}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f8fafc", border: "1px solid #e2e8f0",
              borderRadius: "8px", width: "34px", height: "34px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#64748b", fontSize: "1.1rem"
            }}
          >
            <IoMdClose />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div style={{ padding: "20px 24px" }}>

          {/* Shipping address */}
          <div style={{
            background: "#f5f3ff", border: "1px solid #ede9fe",
            borderRadius: "10px", padding: "14px 16px", marginBottom: "16px"
          }}>
            <p style={{ margin: "0 0 6px", fontSize: "0.7rem", fontWeight: 700, color: "#7c3aed", letterSpacing: "0.8px", textTransform: "uppercase" }}>
              📍 Shipping Address
            </p>
            <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: "0.92rem", color: "#1e293b" }}>
              {userAddress?.name || order.customer || 'Customer'}
            </p>
            <p style={{ margin: 0, fontSize: "0.84rem", color: "#475569", lineHeight: 1.6 }}>
              {userAddress?.address || ''}{userAddress?.city ? `, ${userAddress.city}` : ''}{userAddress?.state ? `, ${userAddress.state}` : ''}{userAddress?.pin ? ` - ${userAddress.pin}` : ''}
            </p>
            {(userAddress?.mobile || userAddress?.contact) && (
              <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#475569" }}>
                📞 {userAddress?.mobile || userAddress?.contact}
              </p>
            )}
          </div>

          {/* Payment badge */}
          <div style={{ marginBottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px",
              padding: "4px 12px", fontSize: "0.75rem", fontWeight: 600, color: "#15803d"
            }}>
              💳 {paymentMethod || order.paymentMode || 'Online'}
            </span>
            <span style={{
              background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "20px",
              padding: "4px 12px", fontSize: "0.75rem", fontWeight: 600, color: "#1d4ed8"
            }}>
              ⏱ Delivery: 5–6 days
            </span>
          </div>

          {/* Order summary */}
          <div style={{
            border: "1px solid #e2e8f0", borderRadius: "10px",
            padding: "16px", marginBottom: "20px"
          }}>
            <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
              Order Summary
            </p>

            {[
              { label: `Items (${qty})`,      value: fmt(itemsPrice), color: "#334155" },
              { label: "Discount",             value: `-${fmt(disc)}`,  color: "#22c55e" },
              { label: "Sub total",            value: fmt(subTotal),    color: "#334155" },
              { label: "GST Include (18%)",    value: fmt(gstIncluded), color: "#334155" },
              { label: "Shipping Fee",         value: "Free",           color: "#22c55e" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between",
                fontSize: "0.88rem", padding: "5px 0",
                borderBottom: "1px solid #f8fafc"
              }}>
                <span style={{ color: "#475569" }}>{label}</span>
                <span style={{ fontWeight: 600, color }}>{value}</span>
              </div>
            ))}

            <div style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 0 0", marginTop: "4px",
              borderTop: "2px solid #f1f5f9"
            }}>
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#7c3aed" }}>{fmt(subTotal)}</span>
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "13px",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
              transition: "transform 0.1s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <FaDownload style={{ fontSize: "0.85rem" }} />
            Download Invoice PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePopup;