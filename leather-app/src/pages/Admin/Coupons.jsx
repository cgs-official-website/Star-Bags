import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { FiEdit, FiTrash2, FiSearch, FiRefreshCw, FiCopy, FiX, FiCalendar } from 'react-icons/fi';
import { BsTicketPerforated, BsCart3 } from 'react-icons/bs';
import { BiCheckShield } from 'react-icons/bi';
import toast, { Toaster } from 'react-hot-toast';
import '../../assets/styles/coupon.css';

const Coupons = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Status: All');
  const [sortOrder, setSortOrder] = useState('Sort by: Latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteModalId, setDeleteModalId] = useState(null);

  const [coupons, setCoupons] = useState([
    { id: 1, code: 'SBC-BAG-001', discount: '20', minOrder: '₹999', category: 'Bag', subCategory: 'Hand bag', expiry: '31 May 2025', status: 'Active', discountType: 'green', desc: 'Sample condition text.', usageLimit: '5000', startDate: '2025-05-01', endDate: '2025-05-31' },
    { id: 2, code: 'SBC-WLT-002', discount: '30', minOrder: '₹1,999', category: 'Wallet', subCategory: '', expiry: '10 Apr 2025', status: 'Expired', discountType: 'green', desc: 'Summer discount.', usageLimit: '2000', startDate: '2025-03-01', endDate: '2025-04-10' },
  ]);

  const [formData, setFormData] = useState({
    id: null,
    code: '',
    minOrder: '',
    usageLimit: '',
    expiry: '',
    discount: '',
    category: 'Bag',
    subCategory: 'Hand bag',
    desc: '',
    startDate: '',
    endDate: '',
    status: 'Active'
  });

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let stateChanged = false;
    const updatedCoupons = coupons.map(c => {
      let newStatus = 'Active';
      
      if (c.startDate) {
        const startDate = new Date(c.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (startDate > today) {
          newStatus = 'Scheduled';
        }
      }
      
      if (c.endDate) {
        const expDate = new Date(c.endDate);
        expDate.setHours(0, 0, 0, 0);
        if (expDate < today) {
          newStatus = 'Expired';
        }
      }

      if (c.status !== newStatus) {
        stateChanged = true;
        return { ...c, status: newStatus };
      }
      
      return c;
    });

    if (stateChanged) {
      setCoupons(updatedCoupons);
    }
  }, [coupons]);

  const stats = [
    {
      title: 'Total Coupons',
      value: coupons.length,
      sub: 'All time coupons',
      icon: <BsTicketPerforated />,
      bgColor: '#f3e8ff',
      color: '#8b5cf6'
    },
    {
      title: 'Active Coupons',
      value: coupons.filter(c => c.status === 'Active').length,
      sub: 'Currently active',
      icon: <BiCheckShield />,
      bgColor: '#dcfce7',
      color: '#10b981'
    },
    {
      title: 'Total Redemption',
      value: '1,293',
      sub: 'All time usage',
      icon: <BsCart3 />,
      bgColor: '#e0f2fe',
      color: '#3b82f6'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      const prefix = value === 'Wallet' ? 'WLT' : value === 'Belt' ? 'BLT' : 'BAG';
      const codeSuffix = formData.code.split('-').pop() || Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setFormData(prev => ({ ...prev, [name]: value, code: `SBC-${prefix}-${codeSuffix}` }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const openModal = (mode, coupon = null) => {
    setModalMode(mode);
    if (mode === 'edit' && coupon) {
      setFormData(coupon);
    } else {
      setFormData({
        id: null, code: '', minOrder: '', usageLimit: '', discount: '', category: 'Bag', subCategory: 'Hand bag', desc: '', startDate: '', endDate: '', status: 'Active'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const generateCode = () => {
    const prefix = formData.category === 'Wallet' ? 'WLT' : formData.category === 'Belt' ? 'BLT' : 'BAG';
    const randNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setFormData(prev => ({ ...prev, code: `SBC-${prefix}-${randNum}` }));
  };

  const handleSubmit = () => {
    if (!formData.code || !formData.discount) return toast.error("Coupon Code and Discount are required.");

    const discountStr = formData.discount.toLowerCase();
    let type = 'green';
    if (discountStr.includes('₹') || discountStr.includes('fixed')) type = 'blue';
    if (discountStr.includes('free')) type = 'orange';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let calculatedStatus = 'Active';
    
    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      startDate.setHours(0, 0, 0, 0);
      if (startDate > today) {
        calculatedStatus = 'Scheduled';
      }
    }
    
    if (formData.endDate) {
      const expDate = new Date(formData.endDate);
      expDate.setHours(0, 0, 0, 0);
      if (expDate < today) {
        calculatedStatus = 'Expired';
      }
    }

    if (modalMode === 'create') {
      const newCoupon = { ...formData, id: Date.now(), discountType: type, status: calculatedStatus };
      setCoupons([newCoupon, ...coupons]);
      toast.success("Coupon created successfully!");
    } else {
      setCoupons(coupons.map(c => c.id === formData.id ? { ...formData, discountType: type, status: calculatedStatus } : c));
      toast.success("Coupon updated successfully!");
    }
    closeModal();
  };

  const handleDeleteClick = (id) => {
    setDeleteModalId(id);
  };

  const confirmDelete = () => {
    if (deleteModalId !== null) {
      setCoupons(coupons.filter(c => c.id !== deleteModalId));
      toast.success("Coupon deleted successfully!");
      setDeleteModalId(null);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied: ${code}`);
  };

  const handleResetFilter = () => {
    setSearchQuery('');
    setStatusFilter('Status: All');
    setSortOrder('Sort by: Latest');
    setCurrentPage(1);
  };

  let filteredCoupons = coupons.filter(c => {
    const matchSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'Status: All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (sortOrder === 'Oldest') {
    filteredCoupons.sort((a, b) => a.id - b.id);
  } else {
    filteredCoupons.sort((a, b) => b.id - a.id);
  }

  const totalPages = Math.ceil(filteredCoupons.length / rowsPerPage) || 1;
  const currentCoupons = filteredCoupons.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="admin-layout">
      <Toaster position="top-right" reverseOrder={false} />
      <AdminSidebar />
      <div className="admin-main cp-main">
        
       
         <header className="admin-header">
          {/* <div className="header-search d-none d-sm-block">
            <span className="search-icon">
              <i className="bi bi-search" style={{ color: '#9ca3af', fontSize: 14 }} />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search products, orders, customers…"
            />
          </div> */}

          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              Coupons
            </h1>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "2px 0 0" }}>
              Here's what's happening with your coupons today.
            </p>
          </div>

          <div className="header-right">
            {/* Search icon mobile */}
            {/* <button className="notif-btn d-sm-none">
              <i className="bi bi-search" style={{ color: '#374151', fontSize: 18 }} />
            </button> */}

            {/* Notifications */}
            {/* <button className="notif-btn">
              <i
                className="bi bi-bell-fill"
                style={{ color: "#374151", fontSize: 18 }}
              />
              <span className="notif-badge">5</span>
            </button> */}

            {/* Profile */}
            <div className="admin-profile" onClick={() => navigate('/admin/settings')}  >
              <div className="profile-avatar">
                <i
                  className="bi bi-person-fill"
                  style={{ fontSize: 20, color: "#7c3aed" }}
                />
              </div>
              <div className="profile-info">
                <span className="profile-name">Sanjai</span>
                <span className="profile-role">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="cp-content">
          
          
          <div className="cp-stats-grid">
            {stats.map((s, i) => (
              <div className="cp-stat-card" key={i}>
                <div className="cp-stat-icon-wrap" style={{ backgroundColor: s.bgColor, color: s.color }}>
                  {s.icon}
                </div>
                <div className="cp-stat-info">
                  <p className="cp-stat-title">{s.title}</p>
                  <h2 className="cp-stat-value">{s.value}</h2>
                  <p className="cp-stat-sub">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

        
          <div className="cp-toolbar">
            <div className="cp-toolbar-left">
              <div className="cp-search-box">
                <FiSearch className="cp-search-icon" />
                <input 
                  type="text" 
                  placeholder="Search coupon code..." 
                  className="cp-search-input" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="cp-select-wrap">
                <select 
                  className="cp-select" 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>Status: All</option>
                  <option>Active</option>
                  <option>Scheduled</option>
                  <option>Expired</option>
                </select>
                <i className="bi bi-chevron-down cp-select-arrow"></i>
              </div>
              
              <div className="cp-select-wrap">
                <select className="cp-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="Sort by: Latest">Sort by: Latest</option>
                  <option value="Oldest">Oldest</option>
                </select>
                <i className="bi bi-chevron-down cp-select-arrow"></i>
              </div>

              <button className="cp-reset-btn" onClick={handleResetFilter}>
                <FiRefreshCw /> Reset Filter
              </button>
            </div>
            
            <button className="cp-create-btn" onClick={() => openModal('create')}>
              + Create New Coupon
            </button>
          </div>

         
          <div className="cp-table-container">
            <table className="cp-table">
              <thead>
                <tr>
                  <th>COUPON CODE</th>
                  <th>DISCOUNT</th>
                  <th>MIN. ORDER</th>
                  <th>CATEGORY</th>
                  <th>SUB CATEGORY</th>
                  <th>VALIDITY PERIOD</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentCoupons.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="cp-code-badge">
                        {c.code} <FiCopy className="cp-copy-icon" onClick={() => copyCode(c.code)} />
                      </div>
                    </td>
                    <td>
                      <span className={`cp-pill discount-pill ${c.discountType}`}>
                        {c.discount} % OFF
                      </span>
                    </td>
                    <td className="cp-cell-text">{c.minOrder}</td>
                    <td className="cp-cell-text">{c.category || 'Bag'}</td>
                    <td className="cp-cell-text">{c.subCategory || '-'}</td>
                    <td className="cp-cell-date" style={{ fontSize: '13px', fontWeight:400 }}>
                      <FiCalendar className="cp-cal-icon" /> {c.startDate}  <span style={{fontWeight:600}}>to</span> {c.endDate}
                    </td>
                    <td>
                      <span className={`cp-pill status-pill ${c.status.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div className="cp-action-btns">
                        <button className="cp-action-btn edit-btn" onClick={() => openModal('edit', c)}><FiEdit /></button>
                        <button className="cp-action-btn delete-btn" onClick={() => handleDeleteClick(c.id)}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCoupons.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                      No coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
           
            <div className="cp-pagination-row">
              <span className="cp-showing-text">
                Showing {filteredCoupons.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredCoupons.length)} of {filteredCoupons.length} results
              </span>
              <div className="cp-pagination-right">
                <div className="cp-page-numbers">
                  <button className="cp-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>&lt;</button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i} 
                      className={`cp-page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button className="cp-page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>&gt;</button>
                </div>
                <div className="cp-rows-per-page">
                  <span>Rows per page</span>
                  <div className="cp-select-wrap-small">
                    <select className="cp-select-small" value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                    <i className="bi bi-chevron-down cp-small-arrow"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {showModal && (
        <div className="cp-modal-overlay" onClick={closeModal}>
          <div className="cp-modal-content" onClick={e => e.stopPropagation()}>
            <div className="cp-modal-header">
              <div>
                <h2>{modalMode === 'create' ? 'Create Coupon' : 'Edit Coupon'}</h2>
                <p>This name is for internal reference only.</p>
              </div>
              <button className="cp-modal-close" onClick={closeModal}><FiX /></button>
            </div>
            
            <div className="cp-modal-body">
              <div className="cp-form-group cp-code-group">
                <label>Coupon Code</label>
                <div className="cp-code-input-row">
                  <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g. WINTER2025" />
                  <button className="cp-generate-btn" onClick={generateCode}><FiRefreshCw /> Generate</button>
                </div>
              </div>

              <div className="cp-form-row">
                <div className="cp-form-group">
                  <label>Minimum Purchase</label>
                  <input type="number" name="minOrder" value={formData.minOrder} onChange={handleInputChange} placeholder="e.g. 1200" />
                </div>
                <div className="cp-form-group">
                  <label>Usage Limit</label>
                  <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleInputChange} placeholder="e.g. 5000" />
                </div>
              </div>

              <div className="cp-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div className="cp-form-group">
                  <label>Discount</label>
                  <input type="text" name="discount" value={formData.discount} onChange={handleInputChange} placeholder="e.g. 30 %" />
                </div>
                <div className="cp-form-group">
                  <label>category</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange} 
                    style={{ 
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      outline: 'none',
                      backgroundColor: '#fff',
                      fontSize: '14px',
                      color: '#111827',
                      appearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' fill=\'none\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%236b7280\' stroke-width=\'1.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center'
                    }}
                  >
                    <option value="Bag">Bag</option>
                    <option value="Wallet">Wallet</option>
                    <option value="Belt">Belt</option>
                  </select>
                </div>
                <div className="cp-form-group">
                  <label>Sub category</label>
                  <select 
                    name="subCategory" 
                    value={formData.subCategory} 
                    onChange={handleInputChange} 
                    disabled={formData.category !== 'Bag'}
                    style={{ 
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      outline: 'none',
                      backgroundColor: formData.category !== 'Bag' ? '#f3f4f6' : '#fff',
                      fontSize: '14px',
                      color: '#111827',
                      appearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' fill=\'none\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%236b7280\' stroke-width=\'1.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      cursor: formData.category !== 'Bag' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="Trolley Bag">Trolley Bag</option>
                    <option value="Hand Bag">Hand Bag</option>
                    <option value="Lunch Bag">Lunch Bag</option>
                    <option value="Office Bag">Office Bag</option>
                    <option value="Travel Bag">Travel Bag</option>
                    <option value="School Bag">School Bag</option>
                    <option value="College Bag">College Bag</option>
                  </select>
                </div>
              </div>


              <div className="cp-form-group">
                <label>Description</label>
                <textarea name="desc" value={formData.desc} onChange={handleInputChange} placeholder="Describe the conditions of this coupon..." rows="3"></textarea>
              </div>


              <div className="cp-schedule-section">
                <h3>Schedule coupon</h3>
                <div className="cp-form-row">
                  <div className="cp-form-group">
                    <label>START DATE</label>
                    <div className="cp-date-input">
                      <input 
                        type="date" 
                        name="startDate" 
                        value={formData.startDate} 
                        onChange={handleInputChange} 
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="cp-form-group">
                    <label>END DATE</label>
                    <div className="cp-date-input">
                      <input 
                        type="date" 
                        name="endDate" 
                        value={formData.endDate} 
                        onChange={handleInputChange} 
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="cp-modal-footer">
              <button className="cp-btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="cp-btn-submit" onClick={handleSubmit}>{modalMode === 'create' ? 'Create Coupon' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

     
      {deleteModalId !== null && (
        <div className="cp-modal-overlay" onClick={() => setDeleteModalId(null)}>
          <div className="cp-modal-content" style={{ maxWidth: '500px', padding: '32px 40px', borderRadius: '12px' }} onClick={e => e.stopPropagation()}>
            <div className="cp-modal-header" style={{ borderBottom: 'none', padding: '0', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#000', margin: 0 }}>Confirm Delete</h2>
                <p style={{ fontSize: '18px', color: '#8c8c8c', marginTop: '12px', marginBottom: 0 }}>Are you sure you want to Delete ?</p>
              </div>
              <button className="cp-modal-close" onClick={() => setDeleteModalId(null)} style={{ margin: '-8px -8px 0 0', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FiX size={28} color="#000" />
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '48px', justifyContent: 'center' }}>
              <button 
                onClick={() => setDeleteModalId(null)}
                style={{ 
                  padding: '12px 0', 
                  border: '1px solid #9f7aea', 
                  borderRadius: '6px', 
                  background: '#fff', 
                  color: '#000', 
                  fontWeight: '500',
                  fontSize: '16px',
                  cursor: 'pointer',
                  width: '160px'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                style={{ 
                  padding: '12px 0', 
                  border: 'none', 
                  borderRadius: '6px', 
                  background: '#e00000', 
                  color: '#fff', 
                  fontWeight: '500', 
                  fontSize: '16px',
                  cursor: 'pointer',
                  width: '160px'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
