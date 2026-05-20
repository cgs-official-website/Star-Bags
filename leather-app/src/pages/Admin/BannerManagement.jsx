import React, { useState, useCallback, useEffect } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { FiUploadCloud, FiCalendar } from 'react-icons/fi';
import { MdOutlineEdit } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import banner1 from '../../assets/images/banner1.png';
import '../../assets/styles/BannerManagement.css';


const ACTIVE_SLOT_COUNT = 3; 

const makeDefault = (slotIndex) => ({
  id: `default-slot-${slotIndex}`,
  slotIndex,           
  title: 'Signature Duffel Launch',
  subtitle: 'Exclusive Collection',
  ctaText: 'Shop Now',
  redirectLink: '/shop/duffel',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  image: banner1,
  status: 'ACTIVE',
  isDefault: true,
});


const INITIAL_ACTIVE = Array.from({ length: ACTIVE_SLOT_COUNT }, (_, i) => makeDefault(i));

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  ctaText: '',
  redirectLink: '',
  startDate: '',
  endDate: '',
  image: null,
};


const todayStr = () => new Date().toISOString().split('T')[0];

const formatDateLabel = (start, end) => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s) || isNaN(e)) return '';
  return `${months[s.getMonth()]} ${String(s.getDate()).padStart(2,'0')} – ${months[e.getMonth()]} ${String(e.getDate()).padStart(2,'0')}`;
};

const isExpired = (banner) => banner.endDate && banner.endDate < todayStr();


function BannerManagement() {
 
  const [activeSlots, setActiveSlots] = useState(INITIAL_ACTIVE);
 
  const [scheduled, setScheduled] = useState([]);

  const [activeTab, setActiveTab] = useState('active');


  const [formMode, setFormMode] = useState(null);       
  const [editingId, setEditingId] = useState(null);    
  const [form, setForm] = useState(EMPTY_FORM);

  const [toast, setToast] = useState(null);

  const today = todayStr();

 
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  
  const openForm = (mode, banner = null) => {
    setFormMode(mode);
    setEditingId(banner?.id ?? null);
    setForm(banner ? {
      title: banner.title,
      subtitle: banner.subtitle || '',
      ctaText: banner.ctaText || '',
      redirectLink: banner.redirectLink || '',
      startDate: banner.startDate || '',
      endDate: banner.endDate || '',
      image: banner.image || null,
    } : EMPTY_FORM);
  };

  const closeForm = () => {
    setFormMode(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const isFormActive = formMode !== null;

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Max 5 MB.'); e.target.value = ''; return; }
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) { alert('JPG, PNG or WEBP only.'); e.target.value = ''; return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
    
      setField('image', url);
    };
    img.onerror = () => { alert('Invalid image.'); URL.revokeObjectURL(url); e.target.value = ''; };
    img.src = url;
  };

 
  const handleSubmit = () => {
    if (!form.image || !form.title || !form.startDate || !form.endDate) {
      alert('Please fill all required fields (Image, Title, Start Date, End Date).');
      return;
    }
    if (form.endDate < form.startDate) {
      alert('End date cannot be before start date.');
      return;
    }

    if (formMode === 'edit-active') {
     
      setActiveSlots(prev => prev.map(b =>
        b.id === editingId
          ? { ...b, ...form, isDefault: false, status: 'ACTIVE' }
          : b
      ));
      showToast('Active banner updated successfully.', 'success');

    } else if (formMode === 'create-scheduled') {
      
      const newBanner = {
        id: Date.now(),
        ...form,
        status: 'SCHEDULED',
        isDefault: false,
      };
      setScheduled(prev => [...prev, newBanner]);
      setActiveTab('schedule');
      showToast('Banner scheduled! Visible in the Schedule tab.', 'success');

    } else if (formMode === 'edit-scheduled') {
     
      setScheduled(prev => prev.map(b =>
        b.id === editingId ? { ...b, ...form } : b
      ));
      showToast('Scheduled banner updated.', 'success');
    }

    closeForm();
  };

 
  useEffect(() => {
    let hasChanges = false;
    let newActiveSlots = [...activeSlots];
    let newScheduled = [...scheduled].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    const today = todayStr();

    for (let i = 0; i < newActiveSlots.length; i++) {
      const banner = newActiveSlots[i];
      if (isExpired(banner)) {
   
        const nextScheduledIndex = newScheduled.findIndex(b => b.startDate <= today);
        
        if (nextScheduledIndex !== -1) {
          const next = newScheduled[nextScheduledIndex];
          newActiveSlots[i] = { ...next, slotIndex: banner.slotIndex, status: 'ACTIVE', isDefault: false };
          newScheduled.splice(nextScheduledIndex, 1);
          hasChanges = true;
        } else if (!banner.isDefault) {

          newActiveSlots[i] = makeDefault(banner.slotIndex);
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      setActiveSlots(newActiveSlots);
      setScheduled(newScheduled);
    }
  }, [activeSlots, scheduled]);

  
  const deleteScheduled = (id) => {
    setScheduled(prev => prev.filter(b => b.id !== id));
    showToast('Scheduled banner deleted.', 'warning');
  };


  const switchTab = (tab) => {
    closeForm();
    setActiveTab(tab);
  };

 
  const sortedScheduled = [...scheduled].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
       <header className="admin-header">
          {/* <div className="header-search d-none d-sm-block">
            <span className="search-icon"> <i className="bi bi-search" style={{ color: '#9ca3af', fontSize: 14 }} /> </span>
            <input type="text" className="search-input" placeholder="Search products, orders, customers…" />
          </div> */}

          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0, }}>Banner Management</h1>
            {/* <p style={{ fontSize: 13, color: "#6b7280", margin: "2px 0 0" }}>Here's what's happening with your banners today.</p> */}
          </div>

          <div className="header-right">
            
            {/* <button className="notif-btn d-sm-none">
              <i className="bi bi-search" style={{ color: '#374151', fontSize: 18 }} />
            </button> */}

            
            {/* <button className="notif-btn">
              <i className="bi bi-bell-fill" style={{ color: "#374151", fontSize: 18 }} /> <span className="notif-badge">5</span>
            </button> */}

            
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

        <div className="banner-management-wrapper">
          <div className="banner-content-grid">

            
            <div className="banner-form-section">
              {!isFormActive && (
                <div className="form-inactive-overlay">
                  <div className="form-inactive-hint">
                    <i className="bi bi-file-earmark-plus" style={{ fontSize: 20, color: "#7c3aed" }} ></i>
                    <p>Select a banner to edit, or add a new scheduled banner from the library panel.</p>
                  </div>
                </div>
              )}

              <div className={`form-inner-content ${!isFormActive ? 'inactive-form' : 'active-form'}`}>
                <h2 className="form-header-title">
                  {formMode === 'edit-active' ? 'Edit Active Banner'
                    : formMode === 'edit-scheduled' ? 'Edit Scheduled Banner'
                    : 'Create Scheduled Banner'}
                </h2>
                <p className="form-header-desc">
                  {formMode === 'edit-active'
                    ? 'Update this active slot. Changes go live immediately.'
                    : 'Design and schedule a banner. It will auto-promote when an active banner expires.'}
                </p>

                
                <div
                  className="upload-box"
                  onClick={() => isFormActive && document.getElementById('banner-upload').click()}
                >
                  <input
                    type="file"
                    id="banner-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={!isFormActive}
                  />
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="preview-image" />
                  ) : (
                    <>
                      <FiUploadCloud className="upload-icon" />
                      <p className="upload-text">Drag or upload the hero banner</p>
                      <p className="upload-dim">JPG, PNG, WEBP · Max 5 MB</p>
                    </>
                  )}
                </div>

                <h3 className="form-section-title">Banner Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Banner Title <span className="required">*</span></label>
                    <input type="text" className="form-input" placeholder="e.g. Summer Collection" value={form.title} onChange={e => setField('title', e.target.value)} disabled={!isFormActive} />
                  </div>
                  <div className="form-group">
                    <label>Subtitle</label>
                    <input type="text" className="form-input" placeholder="e.g. Exclusive Drop" value={form.subtitle} onChange={e => setField('subtitle', e.target.value)} disabled={!isFormActive} />
                  </div>
                  <div className="form-group">
                    <label>CTA Text</label>
                    <input type="text" className="form-input" placeholder="e.g. Shop Now" value={form.ctaText} onChange={e => setField('ctaText', e.target.value)} disabled={!isFormActive} />
                  </div>
                  <div className="form-group">
                    <label>Redirect Link</label>
                    <input type="text" className="form-input" placeholder="e.g. /shop/summer" value={form.redirectLink} onChange={e => setField('redirectLink', e.target.value)} disabled={!isFormActive} />
                  </div>
                </div>

                <h3 className="form-section-title">
                  {formMode === 'edit-active' ? 'Active Period' : 'Schedule Period'}
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>START DATE <span className="required">*</span></label>
                    <div className="form-input-wrap">
                      <input type="date" className="form-input" value={form.startDate}
                        min={formMode === 'create-scheduled' ? today : undefined}
                        onChange={e => setField('startDate', e.target.value)} disabled={!isFormActive} />
                      <FiCalendar className="input-icon" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>END DATE <span className="required">*</span></label>
                    <div className="form-input-wrap">
                      <input type="date" className="form-input" value={form.endDate}
                        min={form.startDate || (formMode === 'create-scheduled' ? today : undefined)}
                        onChange={e => setField('endDate', e.target.value)} disabled={!isFormActive} />
                      <FiCalendar className="input-icon" />
                    </div>
                  </div>
                </div>

                <div className="form-action-row">
                  <button className="cancel-btn" onClick={closeForm} disabled={!isFormActive}>Cancel</button>
                  <button className="submit-btn" onClick={handleSubmit} disabled={!isFormActive}>
                    {formMode === 'edit-active' ? 'Update Active Banner'
                      : formMode === 'edit-scheduled' ? 'Update Scheduled Banner'
                      : 'Schedule Banner'}
                  </button>
                </div>
              </div>
            </div>

            
            <div className="banner-library-section">
              <h2 className="library-title">Library</h2>
              <div className="library-tabs">
                <div
                  className={`library-tab ${activeTab === 'active' ? 'active' : ''}`}
                  onClick={() => switchTab('active')}
                >
                  Active ({activeSlots.length})
                </div>
                <div
                  className={`library-tab ${activeTab === 'schedule' ? 'active' : ''}`}
                  onClick={() => switchTab('schedule')}
                >
                  Schedule ({scheduled.length})
                </div>
              </div>

              <div className="library-list">

               
                {activeTab === 'active' && activeSlots.map((banner) => {
                  const expired = isExpired(banner);
                  return (
                    <div
                      className={`library-card ${expired ? 'card-expired' : banner.isDefault ? 'card-default' : 'card-live'}`}
                      key={banner.id}
                    >
                      <div className="card-image-wrap">
                        <img src={banner.image} alt={banner.title} className="card-image" />
                        <div className={`card-badge ${expired ? 'badge-expired' : banner.isDefault ? 'badge-default' : 'badge-active'}`}>
                          {expired ? 'EXPIRED' : banner.isDefault ? 'DEFAULT' : 'ACTIVE'}
                        </div>
                        <div className="card-slot-label">Slot {banner.slotIndex + 1}</div>
                      </div>

                      <div className="card-info">
                        <h4 className="card-title">{banner.title}</h4>



                        {/* {banner.isDefault && !expired && (
                          <p className="card-default-note">🔵 Default banner — edit to replace</p>
                        )} */}

                        <div className="card-meta">
                          <div className="card-date">
                            <FiCalendar /> {formatDateLabel(banner.startDate, banner.endDate)}
                          </div>
                          <div className="card-actions">
                            <button
                              className="action-btn edit"
                              title="Edit this banner"
                              onClick={() => { openForm('edit-active', banner); setActiveTab('active'); }}
                            >
                              <MdOutlineEdit />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                
                {activeTab === 'schedule' && (
                  <>
                  
                    <div
                      className={`add-schedule-banner ${formMode === 'create-scheduled' ? 'add-banner-active' : ''}`}
                      onClick={() => openForm('create-scheduled')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && openForm('create-scheduled')}
                    >
                      <span className="add-banner-plus">+</span>
                      <span className="add-banner-label">Add New Scheduled Banner</span>
                    </div>

                    {sortedScheduled.length === 0 && (
                      <div className="empty-schedule">
                        <p>No scheduled banners yet.</p>
                        <p>Create one above — it will auto-promote when an active banner expires.</p>
                      </div>
                    )}

                    {sortedScheduled.map((banner, idx) => (
                      <div className="library-card card-scheduled" key={banner.id}>
                        <div className="card-image-wrap">
                          <img src={banner.image} alt={banner.title} className="card-image" />
                          <div className="card-badge badge-scheduled">SCHEDULED</div>
                          <div className="card-slot-label">#{idx + 1} in queue</div>
                        </div>
                        <div className="card-info">
                          <h4 className="card-title">{banner.title}</h4>
                          <div className="card-meta">
                            <div className="card-date">
                              <FiCalendar /> {formatDateLabel(banner.startDate, banner.endDate)}
                            </div>
                            <div className="card-actions">
                              <button className="action-btn edit" title="Edit" onClick={() => openForm('edit-scheduled', banner)}>
                                <MdOutlineEdit />
                              </button>
                              <button className="action-btn delete" title="Delete" onClick={() => deleteScheduled(banner.id)}>
                                <RiDeleteBin6Line />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

              </div>
            </div>
          </div>

          
          {toast && (
            <div className={`banner-toast banner-toast--${toast.type}`}>
              <span className="toast-icon">{toast.type === 'warning' ? '⚠' : '✓'}</span>
              <span>{toast.msg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BannerManagement;