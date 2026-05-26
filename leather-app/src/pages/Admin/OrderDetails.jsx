import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../../assets/styles/OrderManagement.css';
import '../../assets/styles/AdminHeader.css';
import { OrderDetailsSkeleton } from '../../components/Admin/AdminSkeleton';

const OrderDetails = () => {
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  
  
  const initialOrder = location.state?.order || {
    id: "00000",
    img: "../src/assets/images/bag.png",
    productName: "Sample Bag",
    customer: "John Doe",
    address: "123 Sample St. City, Country",
    date: "01/01/2026",
    paymentMode: "Online",
    amount: "₹1000",
    status: "Order placed",
    category: "Bag",
    orderType: "Online"
  };


  const [order, setOrder] = useState({
    ...initialOrder,
    mobileNumber: "+91 98765 43210",
    email: "pandifever@luxury.com",
    brand: "American Tourist",
    subCategory: "Office bag Casual",
    material: "Leather",
    size: "32 L",
    quantity: 2,
    customer: "Vinoth",
    address: "4517 Washington Ave.\nManchester,\nKentucky 39495, USA",
  });

  const downloadInvoice = () => {
    const doc = new jsPDF();
    
   
    doc.setFontSize(22);
    doc.setTextColor(46, 16, 101); 
    doc.text("TAX INVOICE", 105, 20, null, null, "center");
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Order ID: ${order.id}`, 20, 35);
    doc.text(`Invoice Date: ${order.date}`, 20, 42);
    doc.text(`Payment Mode: ${order.paymentMode}`, 20, 49);
    
   
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("From:", 20, 65);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text("Star Bags Official", 20, 72);
    doc.text("45 Industrial Estate", 20, 78);
    doc.text("Chennai, Tamil Nadu 600001", 20, 84);
    
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Bill To:", 120, 65);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(order.customer, 120, 72);
    doc.text(order.mobileNumber, 120, 78);
    const splitAddress = doc.splitTextToSize(order.address, 70);
    doc.text(splitAddress, 120, 84);
    
   
    autoTable(doc, {
      startY: 110,
      headStyles: { fillColor: [46, 16, 101] },
      head: [['S.No', 'Product Name', 'Brand', 'Category', 'Size', 'Qty', 'Unit Price', 'Total']],
      body: [
        ['1', order.productName, order.brand, order.category, order.size, order.quantity, order.amount, order.amount]
      ],
    });
    
  
    const finalY = doc.lastAutoTable.finalY || 110;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Grand Total: ${order.amount}`, 140, finalY + 20);
    
   
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for shopping with Star Bags!", 105, 280, null, null, "center");
    
    doc.save(`Invoice_${order.id}.pdf`);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main bg-light" style={{ background: '#f8fafc' }}>
      
        

        <div className="admin-content mt-3" style={{ padding: '0 20px 20px' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2">
              <button onClick={() => navigate(-1)} className="btn btn-link text-dark p-0 text-decoration-none">
                <i className="bi bi-arrow-left" style={{ fontSize: 14 }}></i>
              
              <span style={{ fontSize: 12, color: '#111827', fontWeight: 500 }}>Order management</span> </button>
              <span style={{ fontSize: 12, color: '#8b5cf6', fontWeight: 500 }}>/ Order details</span>
            </div>
            <button onClick={downloadInvoice} className="btn text-white d-flex align-items-center gap-2" style={{ background: '#8b5cf6', borderRadius: 6, fontSize: 11, fontWeight: 500, padding: '6px 12px', border: 'none' }}>
              <i className="bi bi-download"></i> Download invoice
            </button>
          </div>

          <div className="row g-4">
            {loading ? (
              <div className="col-12">
                <OrderDetailsSkeleton />
              </div>
            ) : (
              <>
            
            {/* Product Details */}
            <div className="col-lg-7">
              <div className="bg-white h-100 d-flex flex-column p-3" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                <div className="d-flex gap-3 h-100">
                  <div style={{ width: '35%', flexShrink: 0 }}>
                    <img src={order.img} alt={order.productName} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8, border: '1px solid #e5e7eb', padding: '8px' }} />
                  </div>
                  <div className="d-flex flex-column flex-grow-1">
                    <h5 className="fw-bold text-uppercase mb-2" style={{ letterSpacing: '0.5px', fontSize: '15px' }}>OFFICE BAG</h5>
                    <div className="d-flex gap-3 mb-3 text-muted" style={{ fontSize: 11, fontWeight: 500 }}>
                      <span>Order ID : <span className="text-dark">#3245t56</span></span>
                      <span>Product ID : <span className="text-dark">#23123</span></span>
                    </div>

                    <div className="row g-0 flex-grow-1 border-top border-bottom text-center">
                      <div className="col-4 border-end border-bottom d-flex flex-column justify-content-center p-2">
                        <span className="fw-bold mb-1" style={{ fontSize: 11 }}>Category</span>
                        <span className="text-muted" style={{ fontSize: 11 }}>Bag</span>
                      </div>
                      <div className="col-4 border-end border-bottom d-flex flex-column justify-content-center p-2">
                        <span className="fw-bold mb-1" style={{ fontSize: 11 }}>Size</span>
                        <span className="text-muted" style={{ fontSize: 11 }}>32 L</span>
                      </div>
                      <div className="col-4 border-bottom d-flex flex-column justify-content-center p-2">
                        <span className="fw-bold mb-1" style={{ fontSize: 11 }}>Quantity</span>
                        <span className="text-muted" style={{ fontSize: 11 }}>2</span>
                      </div>
                      <div className="col-4 border-end d-flex flex-column justify-content-center p-2">
                        <span className="fw-bold mb-1" style={{ fontSize: 11 }}>Material</span>
                        <span className="text-muted" style={{ fontSize: 11 }}>Leather</span>
                      </div>
                      <div className="col-4 border-end d-flex flex-column justify-content-center p-2">
                        <span className="fw-bold mb-1" style={{ fontSize: 11 }}>Brand</span>
                        <span className="text-muted" style={{ fontSize: 11, lineHeight: 1.2 }}>American<br/>Tourist</span>
                      </div>
                      <div className="col-4 d-flex flex-column justify-content-center p-2">
                        <span className="fw-bold mb-1" style={{ fontSize: 11 }}>Sub Category</span>
                        <span className="text-muted" style={{ fontSize: 11, lineHeight: 1.2 }}>Office bag<br/>Casual</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="col-lg-5">
              <div className="bg-white p-3 h-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                <h6 className="fw-bold mb-3" style={{ fontSize: '13px' }}>Customer details</h6>
                
                <div className="d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-person-circle" style={{ fontSize: 24, color: "#8b5cf6" }} />
                  <span className="fw-bold" style={{ fontSize: '13px' }}>Vinoth</span>
                </div>

                <div className="d-flex align-items-start gap-2 mb-3">
                  <i className="bi bi-envelope" style={{ fontSize: 14, color: '#8b5cf6', marginTop: '2px' }}></i>
                  <div>
                    <span className="text-muted d-block mb-0.5" style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Email</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>pandifever@luxury.com</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-2 mb-3">
                  <i className="bi bi-telephone" style={{ fontSize: 14, color: '#8b5cf6', marginTop: '2px' }}></i>
                  <div>
                    <span className="text-muted d-block mb-0.5" style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Mobile</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>+91 98765 43210</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-2">
                  <i className="bi bi-geo-alt" style={{ fontSize: 14, color: '#8b5cf6', marginTop: '2px' }}></i>
                  <div>
                    <span className="text-muted d-block mb-0.5" style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Shipping Address</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#374151', lineHeight: 1.4, display: 'block' }}>
                      4517 Washington Ave.<br/>Manchester,<br/>Kentucky 39495, USA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Tracking */}
            <div className="col-lg-7">
              <div className="bg-white p-3 h-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                <h6 className="fw-bold mb-3" style={{ fontSize: '13px' }}>Order tracking</h6>
                
                <div className="position-relative ms-2">
                  <div className="position-absolute" style={{ width: '2px', background: '#8b5cf6', left: '6px', top: '10px', bottom: '26px', zIndex: 0 }}></div>
                  
                  {[
                    { title: "Order placed", desc: "Your order has been placed", date: "Thu, 2 nd Apr 26 - 6:18 am", extraDate: "( On wed , 4th April 23 )" },
                    { title: "Order shipped", desc: "Your order has been placed", date: "Thu, 2 nd Apr 26 - 6:18 am" },
                    { title: "Out for delivery", desc: "Your order has been placed", date: "Thu, 2 nd Apr 26 - 6:18 am" },
                    { title: "Delivered", desc: "Your order has been Delivered", date: "Thu, 2 nd Apr 26 - 6:18 am" },
                  ].map((step, idx) => (
                    <div className="d-flex gap-3 mb-3 position-relative" key={idx}>
                      <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 14, height: 14, background: '#8b5cf6', color: 'white', fontSize: 8, marginTop: '4px', zIndex: 1 }}>
                        <i className="bi bi-check2"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0.5" style={{ fontSize: 12 }}>
                          {step.title} {step.extraDate && <span className="fw-normal text-muted" style={{ fontSize: 10 }}>{step.extraDate}</span>}
                        </h6>
                        <p className="text-dark mb-0.5" style={{ fontSize: 11 }}>{step.desc}</p>
                        <span className="text-muted" style={{ fontSize: 9 }}>{step.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="col-lg-5">
              <div className="bg-white p-3 h-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                <h6 className="fw-bold mb-3" style={{ fontSize: '13px' }}>Payment Summary</h6>
                
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                    <span style={{ fontSize: 12, color: '#374151' }}>Items(4)</span>
                    <span style={{ fontSize: 12, color: '#374151' }}>₹1500.00</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                    <span style={{ fontSize: 12, color: '#374151' }}>Discount</span>
                    <span style={{ fontSize: 12, color: '#22c55e' }}>-₹500.00</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                    <span style={{ fontSize: 12, color: '#374151' }}>Sub total</span>
                    <span style={{ fontSize: 12, color: '#374151' }}>₹1000.00</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                    <span style={{ fontSize: 12, color: '#374151' }}>GST Include (5%)</span>
                    <span style={{ fontSize: 12, color: '#374151' }}>₹240</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                    <span style={{ fontSize: 12, color: '#374151' }}>Shipping Fee</span>
                    <span style={{ fontSize: 12, color: '#374151' }}>Free</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-1">
                    <span className="fw-bold" style={{ fontSize: 14 }}>Total</span>
                    <span className="fw-bold" style={{ fontSize: 13, color: '#8b5cf6' }}>₹1000.00</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-uppercase text-muted fw-bold" style={{ fontSize: 11, letterSpacing: '0.5px' }}>PAYMENT MODE</span>
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-credit-card" style={{ color: '#8b5cf6', fontSize: 14 }}></i>
                      <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>Online payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
