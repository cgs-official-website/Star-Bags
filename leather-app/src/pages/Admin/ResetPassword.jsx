import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import loginImage from '../../assets/images/loginimage1.png';

function ResetPassword() {
  return (
    <div className="container-fluid vh-100 d-flex p-0 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
      <div className="row g-0 w-100 h-100">
        <div className="col-12 col-lg-5 d-none d-lg-block p-0 h-100">
          <img 
            src={loginImage} 
            alt="Reset Password" 
            className="w-100 h-100" 
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className="col-12 col-lg-7 d-flex justify-content-center align-items-center h-100" style={{ overflowY: 'auto'}}>
          <div className="w-100" style={{ maxHeight: '90vh', maxWidth: '550px', padding: '1.5rem' }}>
            <h2 className="fw-medium mb-1" style={{ color: '#111827', fontSize: '1.75rem' }}>New Password</h2>
            <p className="mb-3" style={{ fontSize: '14px', color: '#000000ff' }}>
              Create a strong password for your Star Bags account. You'll use it
every time you sign in.
            </p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label className="form-label mb-1" style={{ fontSize: '13px', fontWeight: 500, color: '#000000ff' }}>New Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Enter New Password" 
                  style={{ fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db', padding: '0.6rem 0.8rem' }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label mb-1" style={{ fontSize: '13px', fontWeight: 500, color: '#000000ff' }}>Confirm New Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Confirm your Password" 
                  style={{ fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db', padding: '0.6rem 0.8rem' }}
                />
              </div>
              <NavLink 
                type="submit" 
                to="/admin"
                className="btn w-100 py-2 mb-10" 
                style={{                   backgroundColor: '#8b5cf6', 
                  color: 'white', 
                  borderRadius: '6px', 
                  fontWeight: 500,
                  fontSize: '15px',
                  border: 'none',
                  transition: 'background-color 0.2s',
                  marginTop: '15px',
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#8b5cf6'}
              >
                Reset Password
              </NavLink>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;