// import React, { useRef } from "react"; // 1. Added useRef
// import html2pdf from "html2pdf.js";     // 2. Imported html2pdf
// import { IoMdClose } from "react-icons/io";
// import {
//   FaDownload,
//   FaPrint,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaFileInvoice,
// } from "react-icons/fa";
// import { MdVerified } from "react-icons/md";

// const InvoicePopup = ({
//   isOpen,
//   onClose,
//   order,
//   userAddress,
//   paymentMethod,
//   itemsPrice,
//   savings,
//   finalPrice,
// }) => {
//   if (!isOpen || !order) return null;

//   // Create a ref to capture only the invoice area
//   const invoiceRef = useRef(null);

//   const fmt = (n) => "₹ " + Number(n).toFixed(2);
//   const fmtShort = (n) =>
//     "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
//   const gstRate = 0.18;
//   const gstIncluded = (finalPrice * gstRate) / (1 + gstRate);

//   const safeAddress = userAddress || {
//     name: "Vinoth",
//     address: "4517 Washington Ave,",
//     city: "Manchester",
//     state: "Kentucky",
//     pin: "39495",
//     mobile: "502-555-0134",
//   };

//   const invoiceNo = `INV-${String(order.id?.split("-")[2] || "000002").padStart(6, "0")}-${Date.now().toString().slice(-6)}`;
//   const orderDate = order.time || "12-07-2026";

//   // New: Triggers an instant, silent file download
//   const handleDownloadPDF = () => {
//     const element = invoiceRef.current;
//     const options = {
//       margin:       10,
//       filename:     `${invoiceNo}.pdf`,
//       image:        { type: "jpeg", quality: 0.98 },
//       html2canvas:  { scale: 2, useCORS: true }, // scale: 2 ensures high-quality text crispness
//       jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" }
//     };

//     html2pdf().set(options).from(element).save();
//   };

//   // Standard printing fallback if they explicitly hit print
//   const handleSystemPrint = () => {
//     window.print();
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         backgroundColor: "rgba(15, 23, 42, 0.55)",
//         backdropFilter: "blur(6px)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 9999,
//         padding: "16px",
//         fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",
//       }}
//       onClick={onClose}
//     >
//       {/* This is the main container. 
//         Note: We put the ref on the INSIDE container so the download bar isn't captured in the PDF!
//       */}
//       <div
//         style={{
//           background: "#ffffff",
//           borderRadius: "8px",
//           width: "100%",
//           maxWidth: "740px",
//           maxHeight: "94vh",
//           overflowY: "auto",
//           boxShadow: "0 20px 40px rgba(139, 92, 246, 0.1), 0 4px 16px rgba(0,0,0,0.08)",
//           position: "relative",
//           boxSizing: "border-box",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* ── TOP CONTROL BAR (Excluded from PDF download automatically) ── */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "12px 24px",
//             borderBottom: "1px solid #f1f5f9",
//             background: "#fafbff",
//             borderRadius: "8px 8px 0 0",
//           }}
//         >
//           <button
//             onClick={onClose}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "4px",
//               background: "none",
//               border: "none",
//               fontSize: "0.8rem",
//               fontWeight: "600",
//               color: "#64748b",
//               cursor: "pointer",
//               padding: "4px 0",
//             }}
//           >
//             ← Back to Order
//           </button>

//           <div style={{ display: "flex", gap: "8px" }}>
//             <button
//               onClick={handleDownloadPDF}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 background: "#ffffff",
//                 border: "1.5px solid #7c3aed",
//                 padding: "6px 14px",
//                 borderRadius: "6px",
//                 fontSize: "0.78rem",
//                 fontWeight: "600",
//                 color: "#7c3aed",
//                 cursor: "pointer",
//                 transition: "all 0.2s",
//               }}
//             >
//               <FaDownload size={11} /> Download PDF
//             </button>
//             <button
//               onClick={handleSystemPrint}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 background: "#7c3aed",
//                 border: "none",
//                 padding: "7px 14px",
//                 borderRadius: "6px",
//                 fontSize: "0.78rem",
//                 fontWeight: "600",
//                 color: "#ffffff",
//                 cursor: "pointer",
//                 transition: "all 0.2s",
//               }}
//             >
//               <FaPrint size={11} /> Print
//             </button>
//           </div>
//         </div>

//         {/* ── INVOICE BODY (Captured cleanly by html2pdf via ref) ── */}
//         <div ref={invoiceRef} style={{ padding: "24px 28px 20px 28px", background: "#fff" }}>
//           {/* HEADER: LOGO + TAX INVOICE */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "flex-start",
//               flexWrap: "wrap",
//               gap: "16px",
//               marginBottom: "24px",
//             }}
//           >
//             {/* Brand Left */}
//             <div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "10px",
//                   marginBottom: "12px",
//                 }}
//               >
//                 <div
//                   style={{
//                     background: "#ede9fe",
//                     borderRadius: "50%",
//                     width: "48px",
//                     height: "48px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexShrink: 0,
//                   }}
//                 >
//                   <svg
//                     width="26"
//                     height="26"
//                     viewBox="0 0 34 34"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <rect x="4" y="13" width="26" height="18" rx="2" fill="#5b21b6" />
//                     <path
//                       d="M11 13V10a6 6 0 0 1 12 0v3"
//                       stroke="#5b21b6"
//                       strokeWidth="2.5"
//                       strokeLinecap="round"
//                       fill="none"
//                     />
//                     <path
//                       d="M17 17.5l1.1 3.3h3.5l-2.85 2.07 1.1 3.3L17 24.1l-2.85 2.07 1.1-3.3L12.4 20.8h3.5z"
//                       fill="white"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3
//                     style={{
//                       margin: 0,
//                       fontWeight: "800",
//                       fontSize: "1.2rem",
//                       color: "#0f172a",
//                       letterSpacing: "0.5px",
//                     }}
//                   >
//                     STAR BAGS
//                   </h3>
//                   <p
//                     style={{
//                       margin: 0,
//                       fontSize: "0.7rem",
//                       fontWeight: "700",
//                       color: "#7c3aed",
//                       letterSpacing: "0.5px",
//                     }}
//                   >
//                     Carry Your Confidence
//                   </p>
//                 </div>
//               </div>

//               {/* Brand Info */}
//               <div
//                 style={{
//                   fontSize: "0.78rem",
//                   color: "#475569",
//                   lineHeight: "1.6",
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "2px" }}>
//                   <FaMapMarkerAlt style={{ color: "#7c3aed", marginTop: "3px", flexShrink: 0 }} size={10} />
//                   <span>
//                     123, Business park, MG Road,
//                     <br />
//                     Bangalore, Karnataka - 560001
//                   </span>
//                 </div>
//                 <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
//                   <FaFileInvoice style={{ color: "#7c3aed", flexShrink: 0 }} size={10} />
//                   <span style={{ fontWeight: "600" }}>GSTIN: 29ABCD123F1ZS</span>
//                 </div>
//                 <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//                   <FaPhone style={{ color: "#7c3aed", flexShrink: 0 }} size={10} />
//                   <span>Phone: +91 98765 43210</span>
//                 </div>
//               </div>
//             </div>

//             {/* Invoice Details Right */}
//             <div style={{ minWidth: "200px" }}>
//               <h2
//                 style={{
//                   margin: "0 0 4px 0",
//                   fontWeight: "800",
//                   fontSize: "1.35rem",
//                   color: "#0f172a",
//                 }}
//               >
//                 TAX INVOICE
//               </h2>
//               <div
//                 style={{
//                   width: "30px",
//                   height: "2.5px",
//                   background: "#7c3aed",
//                   borderRadius: "2px",
//                   marginBottom: "12px",
//                 }}
//               />

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "auto 1fr",
//                   gap: "5px 0",
//                   fontSize: "0.78rem",
//                   color: "#334155",
//                 }}
//               >
//                 {[
//                   ["Invoice No", invoiceNo],
//                   ["Order ID", `#${order.id?.split("-")[2] || "000002"}`],
//                   ["Order Date", orderDate],
//                   ["Payment Mode", paymentMethod || "Online"],
//                   ["Payment", fmt(finalPrice)],
//                 ].map(([label, value], i) => (
//                   <React.Fragment key={i}>
//                     <span style={{ color: "#64748b", paddingRight: "12px", whiteSpace: "nowrap" }}>
//                       {label}
//                     </span>
//                     <span style={{ fontWeight: "600", color: i === 1 ? "#0f172a" : "#1e293b" }}>
//                       : {value}
//                     </span>
//                   </React.Fragment>
//                 ))}
//                 <span style={{ color: "#64748b", paddingRight: "12px" }}>Status</span>
//                 <span>
//                   :{" "}
//                   <span
//                     style={{
//                       background: "#dcfce7",
//                       color: "#15803d",
//                       padding: "2px 8px",
//                       borderRadius: "12px",
//                       fontSize: "0.7rem",
//                       fontWeight: "700",
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: "4px",
//                     }}
//                   >
//                     <MdVerified size={11} /> Completed
//                   </span>
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* SHIPPING ADDRESS */}
//           <div
//             style={{
//               background: "#faf9ff",
//               border: "1px solid #ede9fe",
//               borderRadius: "6px",
//               padding: "14px 18px",
//               display: "flex",
//               alignItems: "flex-start",
//               gap: "0",
//               marginBottom: "20px",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "160px" }}>
//               <div
//                 style={{
//                   background: "#ede9fe",
//                   borderRadius: "50%",
//                   width: "32px",
//                   height: "32px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flexShrink: 0,
//                 }}
//               >
//                 <FaMapMarkerAlt color="#7c3aed" size={14} />
//               </div>
//               <span
//                 style={{
//                   fontSize: "0.7rem",
//                   fontWeight: "800",
//                   color: "#7c3aed",
//                   letterSpacing: "0.5px",
//                   textTransform: "uppercase",
//                 }}
//               >
//                 SHIPPING ADDRESS
//               </span>
//             </div>

//             <div
//               style={{
//                 width: "1px",
//                 background: "#ddd6fe",
//                 alignSelf: "stretch",
//                 margin: "0 18px",
//               }}
//             />

//             <div style={{ fontSize: "0.8rem", color: "#334155", lineHeight: "1.6" }}>
//               <p style={{ margin: "0 0 2px 0", fontWeight: "700", fontSize: "0.9rem", color: "#0f172a" }}>
//                 {safeAddress.name}
//               </p>
//               <p style={{ margin: 0 }}>{safeAddress.address}</p>
//               <p style={{ margin: 0 }}>
//                 {safeAddress.city}, {safeAddress.state} {safeAddress.pin}
//               </p>
//               <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
//                 <FaPhone size={9} color="#7c3aed" />
//                 <span style={{ fontWeight: "600", color: "#475569" }}>
//                   +1 {safeAddress.mobile || safeAddress.contact}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* ITEMS TABLE */}
//           <div
//             style={{
//               border: "1px solid #e2e8f0",
//               borderRadius: "6px",
//               overflow: "hidden",
//               marginBottom: "20px",
//             }}
//           >
//             <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
//               <thead>
//                 <tr style={{ background: "#7c3aed", color: "#ffffff" }}>
//                   {[
//                     "#",
//                     "Product",
//                     "Brand",
//                     "Size",
//                     "Quantity",
//                     "Unit Price",
//                     "Total",
//                   ].map((h, i) => (
//                     <th
//                       key={i}
//                       style={{
//                         padding: "10px 12px",
//                         fontWeight: "700",
//                         textAlign: i >= 4 ? "center" : "left",
//                         letterSpacing: "0.3px",
//                         ...(i === 5 || i === 6 ? { textAlign: "right" } : {}),
//                       }}
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {[order].map((item, idx) => (
//                   <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9", background: "#fff" }}>
//                     <td style={{ padding: "12px 12px", color: "#64748b", fontWeight: "600" }}>
//                       {String(idx + 1).padStart(2, "0")}
//                     </td>
//                     <td style={{ padding: "12px 12px" }}>
//                       <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                         <img
//                           src={item.image || "/src/assets/images/brand-logo-light.png"}
//                           alt="Product"
//                           style={{
//                             width: "32px",
//                             height: "32px",
//                             objectFit: "cover",
//                             borderRadius: "4px",
//                             border: "1px solid #f1f5f9",
//                           }}
//                           onError={(e) => { e.target.style.display = "none"; }}
//                         />
//                         <span style={{ fontWeight: "700", color: "#0f172a" }}>
//                           {item.product || "Office Bag"}
//                         </span>
//                       </div>
//                     </td>
//                     <td style={{ padding: "12px 12px", color: "#64748b", fontWeight: "500" }}>
//                       Star Bags
//                     </td>
//                     <td style={{ padding: "12px 12px", textAlign: "center", fontWeight: "600", color: "#334155" }}>
//                       M
//                     </td>
//                     <td style={{ padding: "12px 12px", textAlign: "center", fontWeight: "700", color: "#334155" }}>
//                       {item.quantity || 1}
//                     </td>
//                     <td style={{ padding: "12px 12px", textAlign: "right", color: "#334155" }}>
//                       {fmtShort(itemsPrice / (item.quantity || 1))}
//                     </td>
//                     <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: "700", color: "#0f172a" }}>
//                       {fmtShort(itemsPrice)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* PRICING SUMMARY */}
//           <div style={{ display: "flex", justifyContent: "flex-end" }}>
//             <div style={{ width: "100%", maxWidth: "280px", fontSize: "0.8rem" }}>
//               {[
//                 { label: `Items(${order.quantity || 1})`, value: fmtShort(itemsPrice), color: "#1e293b" },
//                 { label: "Discount", value: `-${fmtShort(savings)}`, color: "#dc2626" },
//                 { label: "Sub total", value: fmtShort(finalPrice), color: "#1e293b", borderTop: "1px solid #e2e8f0" },
//                 { label: `GST Include (${Math.round(gstRate * 100)}%)`, value: fmtShort(gstIncluded), color: "#1e293b" },
//                 { label: "Shipping Fee", value: "Free", color: "#16a34a" },
//               ].map(({ label, value, color, borderTop }, i) => (
//                 <div
//                   key={i}
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     padding: "6px 0",
//                     borderTop: borderTop || "none",
//                     color: "#64748b",
//                   }}
//                 >
//                   <span>{label}</span>
//                   <span style={{ fontWeight: "600", color }}>{value}</span>
//                 </div>
//               ))}

//               {/* Total Row */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   borderTop: "1.5px dashed #cbd5e1",
//                   paddingTop: "10px",
//                   marginTop: "2px",
//                 }}
//               >
//                 <span style={{ fontWeight: "800", fontSize: "0.95rem", color: "#0f172a" }}>
//                   Total
//                 </span>
//                 <span style={{ fontWeight: "800", fontSize: "1.05rem", color: "#7c3aed" }}>
//                   {fmtShort(finalPrice)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* FOOTER */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               borderTop: "1px solid #e2e8f0",
//               marginTop: "24px",
//               paddingTop: "16px",
//               flexWrap: "wrap",
//               gap: "16px",
//             }}
//           >
//             {/* Thank you */}
//             <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//               <div
//                 style={{
//                   background: "#f5f3ff",
//                   borderRadius: "50%",
//                   width: "36px",
//                   height: "36px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flexShrink: 0,
//                 }}
//               >
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                   <path
//                     d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
//                     stroke="#7c3aed"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     fill="none"
//                   />
//                 </svg>
//               </div>
//               <div>
//                 <p style={{ margin: 0, fontWeight: "700", fontSize: "0.8rem", color: "#0f172a" }}>
//                   Thankyou for shopping with STAR BAGS!
//                 </p>
//                 <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748b" }}>
//                   We truly appreciate your trust and support.
//                 </p>
//               </div>
//             </div>

//             {/* Signature */}
//             <div style={{ textAlign: "center" }}>
//               <div
//                 style={{
//                   fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
//                   fontSize: "1.4rem",
//                   color: "#1e293b",
//                   lineHeight: 1.2,
//                   marginBottom: "4px",
//                 }}
//               >
//                 Jam Joshi
//               </div>
//               <div
//                 style={{
//                   borderTop: "1.5px solid #94a3b8",
//                   width: "140px",
//                   margin: "0 auto",
//                   paddingTop: "4px",
//                   fontSize: "0.65rem",
//                   fontWeight: "700",
//                   color: "#64748b",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Authorized Signature
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoicePopup;


import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { IoMdClose } from "react-icons/io";
import {
  FaDownload,
  FaPrint,
  FaMapMarkerAlt,
  FaPhone,
  FaFileInvoice,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const InvoicePopup = ({
  isOpen,
  onClose,
  order,
  userAddress,
  paymentMethod,
  itemsPrice,
  savings,
  finalPrice,
}) => {
  if (!isOpen || !order) return null;

  const invoiceRef = useRef(null);

  const fmt = (n) => "₹ " + Number(n).toFixed(2);
  const fmtShort = (n) =>
    "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const gstRate = 0.18;
  const gstIncluded = (finalPrice * gstRate) / (1 + gstRate);

  const safeAddress = userAddress || {
    name: "Vinoth",
    address: "4517 Washington Ave,",
    city: "Manchester",
    state: "Kentucky",
    pin: "39495",
    mobile: "502-555-0134",
  };

  const invoiceNo = `INV-${String(order.id?.split("-")[2] || "000002").padStart(6, "0")}-${Date.now().toString().slice(-6)}`;
  const orderDate = order.time || "12-07-2026";

  const handleDownloadPDF = () => {
    const element = invoiceRef.current;
    const options = {
      margin:       10,
      filename:     `${invoiceNo}.pdf`,
      image:        { type: "jpeg", quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(options).from(element).save();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "12px",
        fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",
      }}
      onClick={onClose}
    >
      {/* Dynamic CSS Injector for Mobile Layout Overrides */}
      <style>{`
        .invoice-card {
          width: 100%;
          max-width: 740px;
          max-height: 92vh;
          background: #ffffff;
          border-radius: 8px;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.1), 0 4px 16px rgba(0,0,0,0.08);
          position: relative;
          box-sizing: border-box;
        }
        .header-split, .shipping-box, .footer-split {
          display: flex;
          justifyContent: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
        }
        .shipping-box {
          background: #faf9ff;
          border: 1px solid #ede9fe;
          border-radius: 6px;
          padding: 14px 18px;
          margin-bottom: 20px;
        }
        .shipping-title-block {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 160px;
        }
        .address-divider {
          width: 1px;
          background: #ddd6fe;
          align-self: stretch;
          margin: 0 18px;
        }

        /* ── MOBILE OVERRIDES (< 600px) ── */
        @media (max-width: 600px) {
          .invoice-body-area {
            padding: 16px 16px 16px 16px !important;
          }
          .header-split {
            flex-direction: column;
            gap: 20px;
          }
          .shipping-box {
            flex-direction: column;
            gap: 10px;
            padding: 12px;
          }
          .address-divider {
            display: none;
          }
          .shipping-title-block {
            width: 100%;
            border-bottom: 1px dashed #ddd6fe;
            padding-bottom: 8px;
          }
          .summary-wrapper {
            justify-content: flex-start !important;
          }
          .summary-box {
            max-width: 100% !important;
          }
          .footer-split {
            flex-direction: column;
            align-items: stretch;
            gap: 24px;
            text-align: left;
          }
          .signature-section {
            text-align: left !important;
          }
          .signature-line {
            margin: 0 !important;
          }

          /* Transform table elements into cards */
          .responsive-table table, 
          .responsive-table thead, 
          .responsive-table tbody, 
          .responsive-table th, 
          .responsive-table td, 
          .responsive-table tr { 
            display: block; 
          }
          .responsive-table thead tr { 
            position: absolute;
            top: -9999px;
            left: -9999px;
          }
          .responsive-table tr { 
            border: 1px solid #e2e8f0; 
            border-radius: 6px;
            margin-bottom: 10px;
            padding: 8px;
            background: #fff;
          }
          .responsive-table td { 
            border: none;
            position: relative;
            padding: 6px 6px 6px 45% !important; 
            text-align: right !important;
            font-size: 0.8rem;
          }
          .responsive-table td:before { 
            position: absolute;
            top: 6px;
            left: 6px;
            width: 40%; 
            padding-right: 10px; 
            white-space: nowrap;
            text-align: left;
            font-weight: 700;
            color: #64748b;
          }
          /* Labels mapping to desktop columns */
          .responsive-table td:nth-of-type(1):before { content: "#"; }
          .responsive-table td:nth-of-type(2):before { content: "Product"; }
          .responsive-table td:nth-of-type(3):before { content: "Brand"; }
          .responsive-table td:nth-of-type(4):before { content: "Size"; }
          .responsive-table td:nth-of-type(5):before { content: "Quantity"; }
          .responsive-table td:nth-of-type(6):before { content: "Unit Price"; }
          .responsive-table td:nth-of-type(7):before { content: "Total"; }
          
          .responsive-table .product-cell-wrapper {
            justify-content: flex-end !important;
          }
        }
      `}</style>

      <div className="invoice-card" onClick={(e) => e.stopPropagation()}>
        {/* ── TOP CONTROL BAR ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            borderBottom: "1px solid #f1f5f9",
            background: "#fafbff",
            borderRadius: "8px 8px 0 0",
            flexWrap: "wrap",
            gap: "10px"
          }}
        >
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#64748b",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleDownloadPDF}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#ffffff",
                border: "1.5px solid #7c3aed",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#7c3aed",
                cursor: "pointer",
              }}
            >
              <FaDownload size={11} /> Download
            </button>
            <button
              onClick={() => window.print()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#7c3aed",
                border: "none",
                padding: "7px 12px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              <FaPrint size={11} /> Print
            </button>
          </div>
        </div>

        {/* ── INVOICE BODY ── */}
        <div className="invoice-body-area" ref={invoiceRef} style={{ padding: "24px 28px 20px 28px", background: "#fff" }}>
          
          {/* HEADER: LOGO + TAX INVOICE */}
          <div className="header-split" style={{ marginBottom: "24px" }}>
            {/* Brand Left */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div
                  style={{
                    background: "#ede9fe",
                    borderRadius: "50%",
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="13" width="26" height="18" rx="2" fill="#5b21b6" />
                    <path d="M11 13V10a6 6 0 0 1 12 0v3" stroke="#5b21b6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M17 17.5l1.1 3.3h3.5l-2.85 2.07 1.1 3.3L17 24.1l-2.85 2.07 1.1-3.3L12.4 20.8h3.5z" fill="white" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontWeight: "800", fontSize: "1.15rem", color: "#0f172a", letterSpacing: "0.5px" }}>
                    STAR BAGS
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.68rem", fontWeight: "700", color: "#7c3aed", letterSpacing: "0.5px" }}>
                    Carry Your Confidence
                  </p>
                </div>
              </div>

              {/* Brand Info */}
              <div style={{ fontSize: "0.78rem", color: "#475569", lineHeight: "1.6" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "2px" }}>
                  <FaMapMarkerAlt style={{ color: "#7c3aed", marginTop: "3px", flexShrink: 0 }} size={10} />
                  <span>
                    123, Business park, MG Road,
                    <br />
                    Bangalore, Karnataka - 560001
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <FaFileInvoice style={{ color: "#7c3aed", flexShrink: 0 }} size={10} />
                  <span style={{ fontWeight: "600" }}>GSTIN: 29ABCD123F1ZS</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaPhone style={{ color: "#7c3aed", flexShrink: 0 }} size={10} />
                  <span>Phone: +91 98765 43210</span>
                </div>
              </div>
            </div>

            {/* Invoice Details Right */}
            <div style={{ minWidth: "200px" }}>
              <h2 style={{ margin: "0 0 4px 0", fontWeight: "800", fontSize: "1.35rem", color: "#0f172a" }}>
                TAX INVOICE
              </h2>
              <div style={{ width: "30px", height: "2.5px", background: "#7c3aed", borderRadius: "2px", marginBottom: "12px" }} />

              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "5px 0", fontSize: "0.78rem", color: "#334155" }}>
                {[
                  ["Invoice No", invoiceNo],
                  ["Order ID", `#${order.id?.split("-")[2] || "000002"}`],
                  ["Order Date", orderDate],
                  ["Payment Mode", paymentMethod || "Online"],
                  ["Payment", fmt(finalPrice)],
                ].map(([label, value], i) => (
                  <React.Fragment key={i}>
                    <span style={{ color: "#64748b", paddingRight: "12px", whiteSpace: "nowrap" }}>{label}</span>
                    <span style={{ fontWeight: "600", color: i === 1 ? "#0f172a" : "#1e293b" }}>: {value}</span>
                  </React.Fragment>
                ))}
                <span style={{ color: "#64748b", paddingRight: "12px" }}>Status</span>
                <span>
                  :{" "}
                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#15803d",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <MdVerified size={11} /> Completed
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* SHIPPING ADDRESS */}
          <div className="shipping-box">
            <div className="shipping-title-block">
              <div
                style={{
                  background: "#ede9fe",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FaMapMarkerAlt color="#7c3aed" size={14} />
              </div>
              <span style={{ fontSize: "0.7rem", fontWeight: "800", color: "#7c3aed", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                SHIPPING ADDRESS
              </span>
            </div>

            <div className="address-divider" />

            <div style={{ fontSize: "0.8rem", color: "#334155", lineHeight: "1.6" }}>
              <p style={{ margin: "0 0 2px 0", fontWeight: "700", fontSize: "0.9rem", color: "#0f172a" }}>
                {safeAddress.name}
              </p>
              <p style={{ margin: 0 }}>{safeAddress.address}</p>
              <p style={{ margin: 0 }}>
                {safeAddress.city}, {safeAddress.state} {safeAddress.pin}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                <FaPhone size={9} color="#7c3aed" />
                <span style={{ fontWeight: "600", color: "#475569" }}>
                  +1 {safeAddress.mobile || safeAddress.contact}
                </span>
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="responsive-table" style={{ overflowX: "auto", marginBottom: "20px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
              <thead>
                <tr style={{ background: "#7c3aed", color: "#ffffff" }}>
                  {["#", "Product", "Brand", "Size", "Quantity", "Unit Price", "Total"].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: "10px 12px",
                        fontWeight: "700",
                        textAlign: i >= 4 ? "center" : "left",
                        letterSpacing: "0.3px",
                        ...(i === 5 || i === 6 ? { textAlign: "right" } : {}),
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[order].map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9", background: "#fff" }}>
                    <td style={{ padding: "12px 12px", color: "#64748b", fontWeight: "600" }}>
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td style={{ padding: "12px 12px" }}>
                      <div className="product-cell-wrapper" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img
                          src={item.image || "/src/assets/images/brand-logo-light.png"}
                          alt="Product"
                          style={{
                            width: "32px",
                            height: "32px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            border: "1px solid #f1f5f9",
                          }}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                        <span style={{ fontWeight: "700", color: "#0f172a" }}>
                          {item.product || "Office Bag"}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 12px", color: "#64748b", fontWeight: "500" }}>
                      Star Bags
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "center", fontWeight: "600", color: "#334155" }}>
                      M
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "center", fontWeight: "700", color: "#334155" }}>
                      {item.quantity || 1}
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", color: "#334155" }}>
                      {fmtShort(itemsPrice / (item.quantity || 1))}
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: "700", color: "#0f172a" }}>
                      {fmtShort(itemsPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PRICING SUMMARY */}
          <div className="summary-wrapper" style={{ display: "flex", justifyContent: "flex-end" }}>
            <div className="summary-box" style={{ width: "100%", maxWidth: "280px", fontSize: "0.8rem" }}>
              {[
                { label: `Items(${order.quantity || 1})`, value: fmtShort(itemsPrice), color: "#1e293b" },
                { label: "Discount", value: `-${fmtShort(savings)}`, color: "#dc2626" },
                { label: "Sub total", value: fmtShort(finalPrice), color: "#1e293b", borderTop: "1px solid #e2e8f0" },
                { label: `GST Include (${Math.round(gstRate * 100)}%)`, value: fmtShort(gstIncluded), color: "#1e293b" },
                { label: "Shipping Fee", value: "Free", color: "#16a34a" },
              ].map(({ label, value, color, borderTop }, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderTop: borderTop || "none",
                    color: "#64748b",
                  }}
                >
                  <span>{label}</span>
                  <span style={{ fontWeight: "600", color }}>{value}</span>
                </div>
              ))}

              {/* Total Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1.5px dashed #cbd5e1",
                  paddingTop: "10px",
                  marginTop: "2px",
                }}
              >
                <span style={{ fontWeight: "800", fontSize: "0.95rem", color: "#0f172a" }}>Total</span>
                <span style={{ fontWeight: "800", fontSize: "1.05rem", color: "#7c3aed" }}>{fmtShort(finalPrice)}</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="footer-split" style={{ borderTop: "1px solid #e2e8f0", marginTop: "24px", paddingTop: "16px" }}>
            {/* Thank you Left */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  background: "#f5f3ff",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    stroke="#7c3aed"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "0.8rem", color: "#0f172a" }}>
                  Thankyou for shopping with STAR BAGS!
                </p>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748b" }}>
                  We truly appreciate your trust and support.
                </p>
              </div>
            </div>

            {/* Signature Right */}
            <div className="signature-section" style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                  fontSize: "1.4rem",
                  color: "#1e293b",
                  lineHeight: 1.2,
                  marginBottom: "4px",
                }}
              >
                Jam Joshi
              </div>
              <div
                className="signature-line"
                style={{
                  borderTop: "1.5px solid #94a3b8",
                  width: "140px",
                  margin: "0 auto",
                  paddingTop: "4px",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Authorized Signature
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvoicePopup;