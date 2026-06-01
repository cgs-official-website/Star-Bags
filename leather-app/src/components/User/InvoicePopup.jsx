import React from 'react';
import { IoMdClose } from "react-icons/io";
import { FaDownload } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { MdStorefront } from "react-icons/md";

const InvoicePopup = ({ isOpen, onClose, order, userAddress, paymentMethod, itemsPrice, savings, finalPrice }) => {
  if (!isOpen || !order) return null;

  const fmt = (n) => "₹" + Number(n).toFixed(2);
  const gstIncluded = Math.round(finalPrice * 0.18);

  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
          maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Header Cross Button */}
        <button 
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            fontSize: "1.3rem",
            cursor: "pointer",
            color: "#64748b"
          }}
        >
          <IoMdClose />
        </button>

        <h4 style={{ fontWeight: "700", color: "#1e293b", marginBottom: "20px", fontSize: "1.3rem" }}>
          Address Customer
        </h4>

        {/* ─── BLOCK 1: DELIVERY ADDRESS CARD ─── */}
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
          <h5 style={{ fontWeight: "700", fontSize: "1.05rem", color: "#0f172a", margin: "0 0 12px 0" }}>
            Delivery Address
          </h5>
          <div style={{ fontSize: "0.9rem", color: "#334155", lineHeight: "1.5" }}>
            <p style={{ margin: "0 0 4px 0", fontWeight: "600" }}>{userAddress.name}</p>
            <p style={{ margin: "0 0 4px 0" }}>{userAddress.address}</p>
            <p style={{ margin: "0 0 4px 0" }}>{userAddress.city}, {userAddress.state} - {userAddress.pin}</p>
            <p style={{ margin: "8px 0 0 0", fontWeight: "600", color: "#475569" }}>
              Mobile: {userAddress.mobile || userAddress.contact}
            </p>
          </div>

          {/* Badge Chips Meta Elements Row */}
          <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
            <span style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: "500", color: "#334155", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <TbTruckDelivery /> {paymentMethod}
            </span>
            <span style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: "500", color: "#334155" }}>
              ⏱️ Delivery time 5 to 6 days
            </span>
          </div>
        </div>

        {/* ─── BLOCK 2: MERCHANT STORE ADDRESS CARD ─── */}
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
          <h5 style={{ fontWeight: "700", fontSize: "1.05rem", color: "#0f172a", margin: "0 0 8px 0" }}>
            Store Address
          </h5>
          <div style={{ fontSize: "0.88rem", color: "#334155", lineHeight: "1.45" }}>
            <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "#1e293b" }}>Store Name: Star Bags Premium Factory</p>
            <p style={{ margin: "0" }}>
              Address: No 554, Vannikamvalam Opposite, Old Bus Stand Road, Bhavani Main Road, Perundurai-638052, Tamil Nadu
            </p>
            <p style={{ margin: "4px 0 0 0" }}>Phone: +91 97999 02475</p>
          </div>
        </div>

        {/* ─── BLOCK 3: FINAL INVOICE ORDER SUMMARY METRICS ─── */}
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px" }}>
          <h5 style={{ fontWeight: "700", fontSize: "1.2rem", color: "#0f172a", margin: "0 0 16px 0" }}>
            Order Summary
          </h5>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "between", alignItems: "center", width: "100%", fontSize: "0.92rem" }}>
              <span style={{ color: "#334155" }}>Items({order.quantity || 1})</span>
              <span style={{ fontWeight: "600", marginLeft: "auto" }}>{fmt(itemsPrice)}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "between", alignItems: "center", width: "100%", fontSize: "0.92rem" }}>
              <span style={{ color: "#334155" }}>Discount</span>
              <span style={{ fontWeight: "600", color: "#22c55e", marginLeft: "auto" }}>-{fmt(savings)}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "between", alignItems: "center", width: "100%", fontSize: "0.92rem" }}>
              <span style={{ color: "#334155" }}>Sub total</span>
              <span style={{ fontWeight: "600", marginLeft: "auto" }}>{fmt(finalPrice)}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "between", alignItems: "center", width: "100%", fontSize: "0.92rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
              <span style={{ color: "#334155" }}>GST Include (18%)</span>
              <span style={{ fontWeight: "600", marginLeft: "auto" }}>{fmt(gstIncluded)}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "between", alignItems: "center", width: "100%", pt: "4px" }}>
              <span style={{ fontWeight: "700", fontSize: "1.1rem", color: "#0f172a" }}>Total</span>
              <span style={{ fontWeight: "700", fontSize: "1.1rem", color: "#8b5cf6", marginLeft: "auto" }}>{fmt(finalPrice)}</span>
            </div>
          </div>

          {/* Central Trigger Action CTA Link Button */}
          <button 
            onClick={() => alert("Downloading secure system-compiled PDF invoice data statement...")}
            style={{
              width: "100%",
              backgroundColor: "#8b5cf6",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "12px",
              fontWeight: "600",
              fontSize: "0.95rem",
              cursor: "pointer",
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            Download invoice <FaDownload style={{ fontSize: "0.85rem" }} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default InvoicePopup;