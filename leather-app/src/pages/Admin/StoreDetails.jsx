import React from 'react';
import { Link,NavLink } from 'react-router-dom';
import loginImage from '../../assets/images/loginimage1.png';

function StoreDetails() {
  return (
    <div className="container-fluid vh-100 d-flex p-0 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
      <div className="row g-0 w-100 h-100">
       
        <div className="col-12 col-lg-5 d-none d-lg-block p-0 h-100">
          <img 
            src={loginImage} 
            alt="Store Details" 
            className="w-100 h-100" 
            style={{ objectFit: 'cover' }}
          />
        </div>

      
        <div className="col-12 col-lg-7 d-flex justify-content-center align-items-center h-100" style={{ overflowY: 'auto'}}>
          <div className="w-100" style={{ maxHeight: '90vh', maxWidth: '650px', padding: '1.5rem' }}>
            <h2 className="fw-medium mb-1" style={{ color: '#111827', fontSize: '1.75rem' }}>Store details</h2>
            <p className="mb-4" style={{ fontSize: '14px', color: '#4b5563' }}>
              Join Krish Leather and experience timeless craftsmanship.
            </p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label className="form-label mb-1" style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Store Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter your store name" 
                  style={{ fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db', padding: '0.6rem 0.8rem' }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label mb-1" style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Contact Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter your contact number" 
                  style={{ fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db', padding: '0.6rem 0.8rem' }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label mb-1" style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>GST IN</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter your GST Number" 
                  style={{ fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db', padding: '0.6rem 0.8rem' }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label mb-1" style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Store Bussiness Address</label>
                <textarea 
                  className="form-control" 
                  placeholder="Enter your address" 
                  rows="3"
                  style={{ fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db', padding: '0.6rem 0.8rem', resize: 'none' }}
                />
              </div>

              <NavLink  
                type="submit" 
                to="/admin/dashboard" 
                className="btn w-100 py-2 mb-4" 
                style={{ 
                  backgroundColor: '#8b5cf6', 
                  color: 'white', 
                  borderRadius: '6px', 
                  fontWeight: 500,
                  fontSize: '15px',
                  border: 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#8b5cf6'}
              >
                Create Account
              </NavLink>

              <div className="d-flex align-items-center mb-4">
                <hr className="flex-grow-1" style={{ borderColor: '#d1d5db' }} />
                <span className="mx-3" style={{ fontSize: '13px', color: '#6b7280' }}>or</span>
                <hr className="flex-grow-1" style={{ borderColor: '#d1d5db' }} />
              </div>

              <div className="text-center" style={{ fontSize: '13px', color: '#6b7280' }}>
                Already have an account ?{' '}
                <Link to="/admin" className="text-decoration-none fw-medium" style={{ color: '#8b5cf6' }}>
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreDetails;