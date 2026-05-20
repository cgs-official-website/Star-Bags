import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { FiFilter, FiPlus, FiEdit, FiTrash2, FiRefreshCw, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { BsBag, BsGraphDown, BsBoxSeam, BsClockHistory } from 'react-icons/bs';
import toast, { Toaster } from 'react-hot-toast';
import '../../assets/styles/ProductManagement.css';

const initialProducts = [
  { id: 'SBP-BAG-00001', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop', name: 'Leather Bag', category: 'Bag', subCategory: 'Hand Bag', brand: 'American Tourister', size: '20L', price: '₹190.00', discount: '25%', stocks: 13 },
  { id: 'SBP-BLT-00001', image: 'https://images.unsplash.com/photo-1628151581315-3ccbc4738555?w=100&h=100&fit=crop', name: 'Leather belt', category: 'Belt', subCategory: '-', brand: '-', size: 'medium', price: '₹190.00', discount: '25%', stocks: 13 },
  { id: 'SBP-WLT-00001', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop', name: 'Leather Wallet', category: 'Wallet', subCategory: '-', brand: '-', size: '-', price: '₹190.00', discount: '25%', stocks: 13 },
  { id: 'SBP-BAG-00002', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop', name: 'Travel Bag', category: 'Bag', subCategory: 'Travel Bag', brand: 'Sky bags', size: '30L', price: '₹190.00', discount: '25%', stocks: 13 },
  { id: 'SBP-WLT-00002', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop', name: 'Leather Wallet', category: 'Wallet', subCategory: '-', brand: '-', size: '-', price: '₹190.00', discount: '25%', stocks: 13 },
  { id: 'SBP-BAG-00003', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop', name: 'School Bag', category: 'Bag', subCategory: 'School Bag', brand: 'Puma', size: '15L', price: '₹190.00', discount: '25%', stocks: 13 },
];

function ProductManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [stockBy, setStockBy] = useState('Stock by');
  const [category, setCategory] = useState('Category');
  const [subCategory, setSubCategory] = useState('Sub Category');
  const [brandFilter, setBrandFilter] = useState('Brand');
  const [showAddPage, setShowAddPage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getInitialProductState = (cat = 'Bag') => ({
    id: `SBP-${cat === 'Wallet' ? 'WLT' : cat === 'Belt' ? 'BLT' : 'BAG'}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop',
    images: [null, null, null, null, null],
    name: '',
    category: 'Bag',
    subCategory: '',
    material: '',
    brand: '',
    size: '',
    capacity: '',
    price: '',
    discount: '',
    stocks: ''
  });

  const [newProduct, setNewProduct] = useState(getInitialProductState());

  const resetForm = () => {
    setNewProduct(getInitialProductState());
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleCancel = () => {
    setShowAddPage(false);
    resetForm();
  };



  const filteredProducts = products.filter(p => {
    let matchStock = true;
    if (stockBy === 'In Stock') matchStock = parseInt(p.stocks) > 0;
    if (stockBy === 'Out of Stock') matchStock = parseInt(p.stocks) === 0;

    let matchCategory = true;
    if (category !== 'Category') matchCategory = p.category === category;

    let matchSubCategory = true;
    if (category === 'Bag' && subCategory !== 'Sub Category') {
      matchSubCategory = p.subCategory === subCategory;
    }

    let matchBrand = true;
    if (category === 'Bag' && brandFilter !== 'Brand') {
      matchBrand = p.brand === brandFilter;
    }

    return matchStock && matchCategory && matchSubCategory && matchBrand;
  });

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage) || 1;
  const currentProducts = filteredProducts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const executeDelete = () => {
    if (productToDelete !== null) {
      const originalIndex = products.findIndex(p => p === productToDelete);
      
      if (originalIndex !== -1) {
        const newProds = [...products];
        newProds.splice(originalIndex, 1);
        setProducts(newProds);
        toast.success("Product deleted successfully!");
      }
    }
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleEdit = (productToEdit) => {
    const originalIndex = products.findIndex(p => p === productToEdit);
    
    setNewProduct({
      ...productToEdit,
      images: [productToEdit.image, null, null, null, null]
    });
    setIsEditing(true);
    setEditIndex(originalIndex);
    setShowAddPage(true);
  };

  const handleResetFilter = () => {
    setStockBy('Stock by');
    setCategory('Category');
    setSubCategory('Sub Category');
    setBrandFilter('Brand');
    setCurrentPage(1);
  };

  const handleImageUpload = (index, event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const newImages = [...newProduct.images];
    let currentIndex = index;
    
    for (let i = 0; i < files.length && currentIndex < 5; i++) {
      newImages[currentIndex] = URL.createObjectURL(files[i]);
      currentIndex++;
    }

    setNewProduct({
      ...newProduct, 
      images: newImages, 
      image: newImages[0] || newProduct.image
    });
    
  
    event.target.value = '';
  };

  const removeImage = (index) => {
    const newImages = [...newProduct.images];
    newImages[index] = null;
    setNewProduct({
      ...newProduct,
      images: newImages,
      image: newImages[0] || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop' // fallback
    });
  };

  const renderImageBox = (index, isMain = false) => {
    const hasImage = newProduct.images[index];
    const className = isMain ? "pm-upload-main" : "pm-upload-sub";
    
    return (
      <div 
        className={className} 
        style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
        onClick={() => document.getElementById(`upload-img-${index}`).click()}
      >
        {hasImage ? (
          <>
            <img src={hasImage} alt={`upload-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); removeImage(index); }} 
              style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
            >
              <i className="bi bi-x" style={{ fontSize: 16 }}></i>
            </button>
          </>
        ) : (
          isMain ? (
            <>
              <i className="bi bi-cloud-arrow-up"></i>
              <span>Upload Cover Image</span>
              <small>1200 x 1200 px recommended</small>
            </>
          ) : (
            <i className="bi bi-camera"></i>
          )
        )}
        <input 
          type="file" 
          id={`upload-img-${index}`} 
          accept="image/*" 
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleImageUpload(index, e)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if(!newProduct.name || !newProduct.price) {
      toast.error('Name and Price are required!');
      return;
    }

    const productToSave = {
      ...newProduct,
      brand: newProduct.category === 'Bag' ? newProduct.brand : '-',
      subCategory: newProduct.category === 'Bag' ? newProduct.subCategory : '-',
      capacity: newProduct.category === 'Bag' ? newProduct.capacity : '-',
      size: newProduct.category === 'Belt' ? newProduct.size : '-'
    };

    if (isEditing && editIndex !== null) {
      const updatedProducts = [...products];
      updatedProducts[editIndex] = productToSave;
      setProducts(updatedProducts);
      toast.success('Product updated successfully!');
    } else {
      setProducts([productToSave, ...products]);
      toast.success('Product added successfully!');
    }
    
    handleCancel();
  };

  if (showAddPage) {
    return (
      <div className="admin-layout pm-main">
        <Toaster position="top-right" />
        <AdminSidebar />
        <div className="admin-main" style={{ padding: 0 }}>
          <div className="pm-add-page">
            <div className="pm-add-header">
              <div>
                <div className="pm-breadcrumb">Product Management / <span>{isEditing ? 'Edit Product' : 'Add Product'}</span></div>
                <h1 className="pm-add-title">{isEditing ? 'Edit Product' : 'Add Product'}</h1>
              </div>
              <button className="pm-back-btn" onClick={handleCancel}>
                <i className="bi bi-arrow-left"></i> Back to Products
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit}>
              <div className="pm-add-grid">
                <div className="pm-panel">
                  <div className="pm-panel-header">
                    <h2 className="pm-panel-title">Product Details</h2>
                    <i className="bi bi-archive pm-panel-icon"></i>
                  </div>
                  
                  <div className={newProduct.category === 'Bag' ? "pm-form-row-2" : "pm-add-form-group"}>
                    <div className="pm-add-form-group">
                      <label>Category Type</label>
                      <select className="pm-add-input pm-add-select" value={newProduct.category} onChange={e => {
                        const newCat = e.target.value;
                        const prefix = newCat === 'Wallet' ? 'WLT' : newCat === 'Belt' ? 'BLT' : 'BAG';
                        const idSuffix = newProduct.id.split('-').pop();
                        setNewProduct({...newProduct, category: newCat, id: `SBP-${prefix}-${idSuffix}`});
                      }}>
                        <option>Bag</option>
                        <option>Belt</option>
                        <option>Wallet</option>
                      </select>
                    </div>
                    {newProduct.category === 'Bag' && (
                      <div className="pm-add-form-group">
                        <label>Sub Category</label>
                        <select className="pm-add-input pm-add-select" value={newProduct.subCategory || ''} onChange={e => setNewProduct({...newProduct, subCategory: e.target.value})}>
                          <option>Trolley Bag</option>
                          <option>Hand Bag</option>
                          <option>Lunch Bag</option>
                          <option>Office Bag</option>
                          <option>Travel Bag</option>
                          <option>School Bag</option>
                          <option>College Bag</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="pm-add-form-group">
                    <label>Material of the Product</label>
                    <select className="pm-add-input pm-add-select" value={newProduct.material || ''} onChange={e => setNewProduct({...newProduct, material: e.target.value})}>
                      <option>Choose Material</option>
                      <option>Leather</option>
                      <option>Canvas</option>
                    </select>
                  </div>

                  <div className="pm-add-form-group">
                    <label>Product Name</label>
                    <input type="text" className="pm-add-input" placeholder="e.g. Midnight Suede Executive Tote" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  </div>

                  {newProduct.category === 'Bag' && (
                    <div className="pm-add-form-group">
                      <label>Capacity</label>
                      <input type="text" className="pm-add-input" placeholder="e.g. 20L" value={newProduct.capacity || ''} onChange={e => setNewProduct({...newProduct, capacity: e.target.value})} />
                    </div>
                  )}

                  {newProduct.category === 'Belt' && (
                    <div className="pm-add-form-group">
                      <label>Size</label>
                      <select className="pm-add-input pm-add-select" value={newProduct.size || ''} onChange={e => setNewProduct({...newProduct, size: e.target.value})}>
                        <option value="">Choose Size</option>
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Long</option>
                      </select>
                    </div>
                  )}

                  <div className={newProduct.category === 'Bag' ? "pm-form-row-2" : "pm-add-form-group"}>
                    <div className="pm-add-form-group">
                      <label>Product ID</label>
                      <input type="text" className="pm-add-input" placeholder="SB-2024-XXXX" value={newProduct.id} onChange={e => setNewProduct({...newProduct, id: e.target.value})} />
                    </div>
                    {newProduct.category === 'Bag' && (
                      <div className="pm-add-form-group">
                        <label>Brand</label>
                        <select className="pm-add-input pm-add-select" value={newProduct.brand || ''} onChange={e => setNewProduct({...newProduct, brand: e.target.value})}>
                          <option value="">Choose Brand</option>
                          <option>Puma</option>
                          <option>American Tourister</option>
                          <option>Sky bags</option>
                          <option>VIP</option>
                          <option>Safari</option>
                          <option>Rubee bags</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="pm-form-row-3">
                    <div className="pm-add-form-group">
                      <label>No. of Stocks</label>
                      <input type="number" className="pm-add-input" placeholder="0" value={newProduct.stocks} onChange={e => setNewProduct({...newProduct, stocks: e.target.value})} />
                    </div>
                    <div className="pm-add-form-group">
                      <label>Price (₹)</label>
                      <input type="text" className="pm-add-input" placeholder="0.00" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                    </div>
                    <div className="pm-add-form-group">
                      <label>Discount (%)</label>
                      <input type="text" className="pm-add-input" placeholder="0" value={newProduct.discount} onChange={e => setNewProduct({...newProduct, discount: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="pm-right-col">
                  <div className="pm-panel">
                    <div className="pm-panel-header">
                      <h2 className="pm-panel-title">Product Images</h2>
                      <i className="bi bi-image pm-panel-icon"></i>
                    </div>
                    <div className="pm-image-grid">
                      {renderImageBox(0, true)}
                      {renderImageBox(1)}
                      {renderImageBox(2)}
                      {renderImageBox(3)}
                      {renderImageBox(4)}
                    </div>
                  </div>

                  <div className="pm-panel">
                    <div className="pm-panel-header">
                      <h2 className="pm-panel-title">Product Short Description</h2>
                      <i className="bi bi-file-text pm-panel-icon"></i>
                    </div>
                    <textarea className="pm-textarea" placeholder="Enter short description about the product..."></textarea>
                    <div className="pm-char-count">Recommended: 150-200 characters</div>
                  </div>

                  <div className="pm-add-actions">
                    <button type="button" className="pm-btn-outline" onClick={handleCancel}>Cancel</button>
                    <button type="submit" className="pm-btn-solid">{isEditing ? 'Update Product' : 'Publish Product'}</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout pm-main">
      <Toaster position="top-right" />
      <AdminSidebar />
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          {/* <div className="header-search d-none d-sm-block">
            <span className="search-icon"> <i className="bi bi-search" style={{ color: '#9ca3af', fontSize: 14 }} /> </span>
            <input type="text" className="search-input" placeholder="Search products, orders, customers…" />
          </div> */}

          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0, }}>Product Management</h1>
            {/* <p style={{ fontSize: 13, color: "#6b7280", margin: "2px 0 0" }}>Here's what's happening with your banners today.</p> */}
          </div>

          <div className="header-right">
            {/* Search icon mobile */}
            {/* <button className="notif-btn d-sm-none">
              <i className="bi bi-search" style={{ color: '#374151', fontSize: 18 }} />
            </button> */}

            {/* Notifications */}
            {/* <button className="notif-btn">
              <i className="bi bi-bell-fill" style={{ color: "#374151", fontSize: 18 }} /> <span className="notif-badge">5</span>
            </button> */}

            {/* Profile */}
            <div className="admin-profile" onClick={() => navigate('/admin/settings')}>
              <div className="profile-avatar">
                <i className="bi bi-person-fill" style={{ fontSize: 20, color: "#7c3aed" }} />
              </div>
              <div className="profile-info">
                <span className="profile-name">Sanjai</span>
                <span className="profile-role">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="pm-content">
          
          <div className="pm-stats-grid">
            <div className="pm-stat-card">
              <div className="pm-stat-top">
                <div>
                  <p className="pm-stat-title">Total Products</p>
                  <p className="pm-stat-value">70000</p>
                </div>
                <div className="pm-stat-icon" style={{ background: '#e0e7ff', color: '#6366f1' }}>
                  <BsBag />
                </div>
              </div>
              <div className="pm-stat-bottom pm-stat-up">
                <FiArrowUpRight /> 85 % Available Products
              </div>
            </div>

            <div className="pm-stat-card">
              <div className="pm-stat-top">
                <div>
                  <p className="pm-stat-title">Active products</p>
                  <p className="pm-stat-value">45646</p>
                </div>
                <div className="pm-stat-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
                  <BsGraphDown />
                </div>
              </div>
              <div className="pm-stat-bottom pm-stat-down">
                <FiArrowDownRight /> Stock Reduced
              </div>
            </div>

            <div className="pm-stat-card">
              <div className="pm-stat-top">
                <div>
                  <p className="pm-stat-title">Sold Products</p>
                  <p className="pm-stat-value">20</p>
                </div>
                <div className="pm-stat-icon" style={{ background: '#ffedd5', color: '#f97316' }}>
                  <BsBoxSeam />
                </div>
              </div>
              <div className="pm-stat-bottom pm-stat-up">
                <FiArrowUpRight /> 1.8% Up from yesterday
              </div>
            </div>

            <div className="pm-stat-card">
              <div className="pm-stat-top">
                <div>
                  <p className="pm-stat-title">Low Stock Items</p>
                  <p className="pm-stat-value">20</p>
                </div>
                <div className="pm-stat-icon" style={{ background: '#fee2e2', color: '#ef4444' }}>
                  <BsClockHistory />
                </div>
              </div>
              <div className="pm-stat-bottom pm-stat-up">
                <FiArrowUpRight /> 1.8% Up from yesterday
              </div>
            </div>
          </div>

        
          <div className="pm-toolbar">
            <div className="pm-toolbar-left">
              <button className="pm-filter-icon-btn">
                <FiFilter />
              </button>
              
              <div className="pm-select-wrap">
                <select className="pm-select" value={stockBy} onChange={e => setStockBy(e.target.value)}>
                  <option>Stock by</option>
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                </select>
                <i className="bi bi-chevron-down pm-select-arrow"></i>
              </div>

              <div className="pm-select-wrap">
                <select className="pm-select" value={category} onChange={e => {
                  setCategory(e.target.value);
                  setSubCategory('Sub Category');
                  setBrandFilter('Brand');
                }}>
                  <option>Category</option>
                  <option>Bag</option>
                  <option>Belt</option>
                  <option>Wallet</option>
                </select>
                <i className="bi bi-chevron-down pm-select-arrow"></i>
              </div>

              {category === 'Bag' && (
                <>
                  <div className="pm-select-wrap">
                    <select className="pm-select" value={subCategory} onChange={e => setSubCategory(e.target.value)}>
                      <option>Sub Category</option>
                      <option>Trolley Bag</option>
                      <option>Hand Bag</option>
                      <option>Lunch Bag</option>
                      <option>Office Bag</option>
                      <option>Travel Bag</option>
                      <option>School Bag</option>
                      <option>College Bag</option>
                    </select>
                    <i className="bi bi-chevron-down pm-select-arrow"></i>
                  </div>

                  <div className="pm-select-wrap">
                    <select className="pm-select" value={brandFilter} onChange={e => setBrandFilter(e.target.value)}>
                      <option>Brand</option>
                      <option>Puma</option>
                      <option>American Tourister</option>
                      <option>Sky bags</option>
                      <option>VIP</option>
                      <option>Safari</option>
                      <option>Rubee bags</option>
                    </select>
                    <i className="bi bi-chevron-down pm-select-arrow"></i>
                  </div>
                </>
              )}

              <button className="pm-reset-btn" onClick={handleResetFilter}>
                <FiRefreshCw /> Reset Filter
              </button>
            </div>
            
            <button className="pm-add-btn" onClick={() => setShowAddPage(true)}>
              <FiPlus /> Add product
            </button>
          </div>

          
          <div className="pm-table-container">
            <table className="pm-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Image</th>
                  <th>Product name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Stocks</th>
                  <th>Edit / Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((p, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 500, color: '#111827' }}>{p.id}</td>
                    <td>
                      <img src={p.image} alt="product" className="pm-product-image" />
                    </td>
                    <td style={{ fontWeight: 500, color: '#4b5563' }}>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.brand}</td>
                    <td>{p.size}</td>
                    <td style={{ fontWeight: 500, color: '#4b5563' }}>{p.price}</td>
                    <td className="pm-discount-green">{p.discount}</td>
                    <td>{p.stocks}</td>
                    <td>
                      <div className="pm-action-btns">
                        <button className="pm-action-btn edit" onClick={() => handleEdit(p)}>
                          <FiEdit size={14} />
                        </button>
                        <button className="pm-action-btn delete" onClick={() => confirmDelete(p)}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentProducts.length === 0 && (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          
            <div className="pm-pagination">
              <span className="pm-page-info">Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredProducts.length)} of {filteredProducts.length} results</span>
              <div className="pm-page-controls">
                <div className="pm-pages">
                  <button className="pm-page-btn arrow" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>&lt;</button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} className={`pm-page-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  ))}
                  <button className="pm-page-btn arrow" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>&gt;</button>
                </div>
                <div className="pm-rows-wrap">
                  Rows per page
                  <div style={{ position: 'relative' }}>
                    <select className="pm-rows-select" value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                    <i className="bi bi-chevron-down" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, pointerEvents: 'none' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', width: '450px', maxWidth: '90%', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <button onClick={cancelDelete} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <i className="bi bi-x-lg"></i>
            </button>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: '600', color: '#111827' }}>Confirm Delete</h3>
            <p style={{ margin: '0 0 32px 0', fontSize: '18px', color: '#6b7280' }}>Are you sure you want to Delete ?</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button onClick={cancelDelete} style={{ flex: 1, padding: '12px', background: '#fff', border: '1px solid #8b5cf6', color: '#111827', borderRadius: '8px', fontWeight: '500', fontSize: '16px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={executeDelete} style={{ flex: 1, padding: '12px', background: '#e10000', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: '500', fontSize: '16px', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;