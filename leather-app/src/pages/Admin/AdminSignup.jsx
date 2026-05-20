import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import loginImage from '../../assets/images/loginimage1.png';

function AdminSignup() {
  return (
    <div className="container-fluid vh-100 d-flex p-0 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
      <div className="row g-0 w-100 h-100">
        
        <div className="col-12 col-lg-5 d-none d-lg-block p-0 h-100">
          <img 
            src={loginImage} 
            alt="Admin Login" 
            className="w-100 h-100" 
            style={{ objectFit: 'cover' }}
          />
        </div>

      
        <div className="col-12 col-lg-7 d-flex justify-content-center align-items-center h-100" style={{ overflowY: 'auto'}}>
          <div className="w-100" style={{ maxHeight: '90vh', maxWidth: '650px', padding: '1.5rem' }}>
            <h2 className="fw-medium mb-1" style={{ color: '#111827', fontSize: '1.75rem' }}>Create Account</h2>
            <p className="mb-3" style={{ fontSize: '14px', color: '#4b5563' }}>
              Join Krish Leather and experience timeless craftsmanship.
            </p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label className="form-label mb-1" style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Enter your name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter your name" 
                  style={{ fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db', padding: '0.6rem 0.8rem' }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label mb-1" style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>E-mail Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter your e-mail" 
                  style={{ fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db', padding: '0.6rem 0.8rem' }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label mb-1" style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Create password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Create your Password" 
                  style={{ fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db', padding: '0.6rem 0.8rem' }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label mb-1" style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Confirm your password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Confirm your password" 
                  style={{ fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db', padding: '0.6rem 0.8rem' }}
                />
              </div>

              <div className="mb-4 form-check d-flex align-items-center gap-2">
                <input type="checkbox" className="form-check-input mt-0" id="rememberMe" style={{ width: '14px', height: '14px', cursor: 'pointer' }} />
                <label className="form-check-label" htmlFor="rememberMe" style={{ fontSize: '13px', color: '#111827', cursor: 'pointer' }}>
                  Remember me
                </label>
              </div>

              <NavLink 
                type="submit" 
                to="/admin/store-details"
                className="btn w-100 py-2 mb-3" 
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
                Next
              </NavLink>
              <span style={{color:'red', fontSize:'14px', display:'flex', justifyContent:'center'}}>Check Your mail to Activate the Account</span>
              <div className="d-flex align-items-center mb-3">
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

export default AdminSignup;