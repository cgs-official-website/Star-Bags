import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../../assets/styles/OrderManagement.css';

const OrderDetails = () => {
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
    mobileNumber: "+91 9876543210",
    brand: "American Tourister",
    subCategory: "Office Bag",
    size: "Medium",
    quantity: 1,
  });

  const handleStatusChange = (e) => {
    setOrder({ ...order, status: e.target.value });
  };

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
      <div className="admin-main">
      
        <header className="admin-header">
          <div className="d-flex align-items-center gap-3">
            <button onClick={() => navigate(-1)} className="btn btn-light d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: 8, padding: 0 }}>
              <i className="bi bi-arrow-left"></i>
            </button>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
              Order Details
            </h1>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button onClick={downloadInvoice} className="btn text-white d-flex align-items-center gap-2" style={{ background: '#2e1065', borderRadius: 8, fontSize: 14 }}>
              <i className="bi bi-printer"></i> Print Invoice
            </button>
            <div className="position-relative cursor-pointer ms-2">
              <i className="bi bi-bell" style={{ fontSize: '20px', color: '#4b5563' }} />
            </div>
            <div className="d-flex align-items-center gap-2 ms-2 cursor-pointer">
              <img src="https://i.pravatar.cc/150?img=11" alt="Profile" style={{ width: 36, height: 36, borderRadius: '50%' }} />
              <div className="d-flex flex-column">
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>Vijay Reddy</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Admin</span>
              </div>
            </div>
          </div>
        </header>

      
        <div className="admin-content mt-4">
          <div className="row g-4">
            
        
            <div className="col-lg-8">
              <div className="bg-white p-4 rounded-3 border" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div className="d-flex align-items-center gap-4 border-bottom pb-4 mb-4">
                  <img src={order.img} alt={order.productName} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, background: '#f3f4f6' }} />
                  <div>
                    <h3 className="fw-bold mb-1">{order.productName}</h3>
                    <p className="text-muted mb-2">Product ID: {order.id}</p>
                    <h4 className="fw-bold text-primary mb-0" style={{ color: '#2e1065' }}>{order.amount}</h4>
                  </div>
                </div>
                
                <div className="row g-4 mb-4 border-bottom pb-4">
                  <div className="col-md-4">
                    <span className="text-muted d-block mb-1" style={{ fontSize: 13 }}>Brand</span>
                    <span className="fw-semibold">{order.brand}</span>
                  </div>
                  <div className="col-md-4">
                    <span className="text-muted d-block mb-1" style={{ fontSize: 13 }}>Category</span>
                    <span className="fw-semibold">{order.category}</span>
                  </div>
                  <div className="col-md-4">
                    <span className="text-muted d-block mb-1" style={{ fontSize: 13 }}>Sub Category</span>
                    <span className="fw-semibold">{order.subCategory}</span>
                  </div>
                  <div className="col-md-4">
                    <span className="text-muted d-block mb-1" style={{ fontSize: 13 }}>Size</span>
                    <span className="fw-semibold">{order.size}</span>
                  </div>
                  <div className="col-md-4">
                    <span className="text-muted d-block mb-1" style={{ fontSize: 13 }}>Quantity</span>
                    <span className="fw-semibold">{order.quantity}</span>
                  </div>
                  <div className="col-md-4">
                    <span className="text-muted d-block mb-1" style={{ fontSize: 13 }}>Payment Mode</span>
                    <span className="fw-semibold">{order.paymentMode}</span>
                  </div>
                </div>

                <div>
                  <h6 className="fw-bold mb-3">Update Order Status</h6>
                  <select 
                    className="form-select w-50" 
                    value={order.status} 
                    onChange={handleStatusChange}
                    style={{ cursor: 'pointer', borderColor: '#e5e7eb' }}
                  >
                    <option value="Order placed">Order placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            
            <div className="col-lg-4">
              <div className="bg-white p-4 rounded-3 border h-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h5 className="fw-bold mb-4">Customer Details</h5>
                
                <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-4">
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold' }}>
                    {order.customer.charAt(0)}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">{order.customer}</h6>
                    <span className="text-muted" style={{ fontSize: 13 }}>Customer</span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-muted d-block mb-1" style={{ fontSize: 13 }}>Mobile Number</span>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-telephone text-muted"></i>
                    <span className="fw-semibold">{order.mobileNumber}</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted d-block mb-1" style={{ fontSize: 13 }}>Shipping Address</span>
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-geo-alt text-muted mt-1"></i>
                    <span className="fw-semibold" style={{ lineHeight: 1.5 }}>
                      {order.address}
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
