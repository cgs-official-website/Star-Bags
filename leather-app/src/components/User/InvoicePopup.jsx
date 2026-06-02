import React from "react";
import { IoMdClose } from "react-icons/io";
import { FaDownload } from "react-icons/fa";
import { generateInvoicePDF } from "../../utils/generateInvoicePDF";

const InvoicePopup = ({
  isOpen,
  onClose,
  order,
  userAddress,
  paymentMethod,
  itemsPrice, // Matches exactly the baseline item row amount
  savings,    // Matches exactly the baseline discount amount 
  finalPrice,  // Matches exactly the final calculated total from parent component state
}) => {
  if (!isOpen || !order) return null;

  const fmt = (n) => "₹ " + Number(n).toFixed(2);
  const qty = Number(order.quantity) || 1;

  // ─── STAGE 1: ZERO CALCULATION REFLECTION MATRIX ───
  // We strictly assign values straight from parent state components to prevent any local mathematical anomalies
  const displayItemsPrice = Number(itemsPrice) || Number(order.originalPrice) || 0;
  const displayDiscount = Number(savings) || 0;
  
  // As per your exact specification: Sub total is passed dynamically reflecting billing specs directly
  const displaySubTotal = displayItemsPrice - displayDiscount;
  
  // GST display metric is shown as a component line matching tracking values directly
  const displayGstAmount = Math.round(displaySubTotal * 0.18);
  
  // Total is the absolute net grand total displayed on your tracker order summary component card
  const displayGrandTotal = Number(finalPrice) || Number(order.discountedPrice) || 0;

  // ─── STAGE 2: SHIPPING ADDRESS LAYOUT EXTRACTOR ───
  const getLivePlacedBillingSpecs = () => {
    const fallbackAddress = { name: "", address: "", cityAndPin: "", mobile: "" };

    if (userAddress && userAddress.name) {
      return {
        name: userAddress.name,
        address: userAddress.address || "",
        cityAndPin: userAddress.cityAndPin || (userAddress.city ? `${userAddress.city}, ${userAddress.state || ""} ${userAddress.pin || ""}` : ""),
        mobile: userAddress.mobile || userAddress.contact || "",
      };
    }

    const details = order.customerDetails || {};
    if (details.shippingAddress) {
      const addressParts = details.shippingAddress.split(",");
      const streetLine = addressParts[0]?.trim() || "";
      let cityStatePinLine = "";

      if (addressParts.length > 1) {
        cityStatePinLine = addressParts.slice(1).join(",").trim().replace(/\s*-\s*/, " - ");
      }

      return {
        name: details.name || "",
        address: streetLine,
        cityAndPin: cityStatePinLine,
        mobile: details.mobile || "",
      };
    }

    if (order.selectedAddress) {
      const sa = order.selectedAddress;
      const pinSuffix = sa.pin ? ` - ${sa.pin}` : "";
      return {
        name: sa.name || "",
        address: sa.address || "",
        cityAndPin: `${sa.city || ""}${sa.state ? `, ${sa.state}` : ""}${pinSuffix}`,
        mobile: sa.mobile || sa.contact || "",
      };
    }

    return fallbackAddress;
  };

  const safeAddress = getLivePlacedBillingSpecs();

  const getNormalizedPaymentMethod = () => {
    const rawMethod = paymentMethod || order.paymentMode || order.paymentMethod || "Cash on delivery";
    const cleanMethod = rawMethod.toLowerCase().trim();

    if (cleanMethod === "cod" || cleanMethod === "cash on delivery") {
      return "Cash on delivery";
    }
    if (cleanMethod === "online" || cleanMethod === "online payment") {
      return "Online payment";
    }
    return rawMethod;
  };

  const placedPaymentMethod = getNormalizedPaymentMethod();

  const handleDownload = () => {
    generateInvoicePDF({
      order,
      userAddress: {
        name: safeAddress.name,
        address: `${safeAddress.address}, ${safeAddress.cityAndPin}`,
        mobile: safeAddress.mobile,
      },
      itemsPrice: displayItemsPrice,
      savings: displayDiscount,
      finalPrice: displayGrandTotal,
    });
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
        zIndex: 9999,
        padding: "12px",
        fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",
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
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h4 style={{ margin: 0, fontWeight: 700, color: "#1e293b", fontSize: "1.1rem" }}>
              Tax Invoice Preview
            </h4>
            <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#94a3b8" }}>
              Order #{String(order.id || "").padStart(6, "0")}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            <IoMdClose />
          </button>
        </div>

        {/* Body Container */}
        <div style={{ padding: "20px 24px" }}>
          
          {/* Shipping Address Summary Box */}
          <div
            style={{
              background: "#f5f3ff",
              border: "1px solid #ede9fe",
              borderRadius: "10px",
              padding: "14px 16px",
              marginBottom: "16px",
            }}
          >
            <p style={{ margin: "0 0 6px", fontSize: "0.7rem", fontWeight: 700, color: "#7c3aed", letterSpacing: "0.8px", textTransform: "uppercase" }}>
              📍 Shipping Address
            </p>
            <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: "1.05rem", color: "#0f172a" }}>
              {safeAddress.name}
            </p>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#475569", lineHeight: 1.5 }}>
              {safeAddress.address}
            </p>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#475569", lineHeight: 1.5 }}>
              {safeAddress.cityAndPin}
            </p>
            {safeAddress.mobile && (
              <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "#1e293b", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontWeight: "bold", opacity: 0.6 }}>MOBILE :</span> {safeAddress.mobile}
              </p>
            )}
          </div>

          {/* Payment Method Badge */}
          <div style={{ marginBottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "4px 12px", fontSize: "0.75rem", fontWeight: 600, color: "#15803d" }}>
              Status: Placed via {placedPaymentMethod}
            </span>
          </div>

          {/* Order Summary Table Elements Block */}
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
              Order Summary
            </p>

            {[
              { label: `Items (${qty})`,   value: fmt(displayItemsPrice), color: "#334155" },
              ...(displayDiscount > 0 ? [{ label: "Discount", value: `-${fmt(displayDiscount)}`, color: "#22c55e" }] : []),
              { label: "Sub total",         value: fmt(displaySubTotal),    color: "#334155" },
              { label: "GST Include (18%)", value: fmt(displayGstAmount),   color: "#334155" },
              { label: "Shipping Fee",      value: "Free",                  color: "#22c55e" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.88rem",
                  padding: "5px 0",
                  borderBottom: "1px solid #f8fafc",
                }}
              >
                <span style={{ color: "#475569" }}>{label}</span>
                <span style={{ fontWeight: 600, color }}>{value}</span>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0 0",
                marginTop: "4px",
                borderTop: "2px solid #f1f5f9",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}>
                Total
              </span>
              <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#7c3aed" }}>
                {fmt(displayGrandTotal)}
              </span>
            </div>
          </div>

          {/* Download Button Component Trigger */}
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
              transition: "transform 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
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