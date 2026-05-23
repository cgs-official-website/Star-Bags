import { useState } from "react";
import { CgAsterisk } from "react-icons/cg";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

import "../../assets/styles/Login.css";

import LoginImage from "../../assets/images/login-image.png";
import { NavLink } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    // Email validation - supports both email and mobile number
    const isEmail = /\S+@\S+\.\S+/.test(formData.email);
    const isMobile = /^[0-9]{10}$/.test(formData.email);
    
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address or mobile number.";
      isValid = false;
    } else if (!isEmail && !isMobile) {
      newErrors.email = "Please enter a valid email address or mobile number";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password must be 6 characters or more.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be 6 characters or more.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Proceed to login
      console.log("Login submitted:", formData);
      navigate('/');
    }
  };

  return (
    <>
      <div className="login">
        {/* LEFT SIDE */}
        <div className="d-none d-lg-block col-lg-7 logo-image">
          <img src={LoginImage} alt="Leather Bag" />

          <div className="login-content">
            <div className="brand-logo">
              <span>✦</span>
              <h5>Star Bags</h5>
            </div>

            <h3>
              Timeless Craft.
              <br />
              Trusted Always.
            </h3>

            <div className="line"></div>

            <p>
              Premium leather essentials,
              <br />
              crafted to accompany every journey.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-12 col-lg-5 form-section ">
          <div className="login-form">
            <h6>Welcome Back</h6>
            <p>Login to your account and continue.</p>
            <form onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div className="mb-1">
                <label className="form-label required">
                  Email or Mobile Number
                  <sup>
                    <CgAsterisk />
                  </sup>
                </label>

                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter your email or mobile number"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* PASSWORD */}
              <div className="mb-2">
                <label className="form-label required">
                  Password
                  <sup>
                    <CgAsterisk />
                  </sup>
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Enter your Password"
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              {/* FORGOT PASSWORD */}
              <div className="forgot-password my-2 text-end">
                <NavLink to={"/forgotPassword"} className="navigate">Forgot password?</NavLink>
              </div>
              
              {/* BUTTON */}
              <div className="d-grid">
                <button className="btn login-btn" type="submit">
                  Log in
                </button>
              </div>
            </form>

            {/* DIVIDER */}
            <div className="divider">
              <hr />

              <span>or</span>

              <hr />
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="social-buttons">
              <button className="social-btn">
                <FcGoogle className="social-icon" />
                Sign in with Google
              </button>

              <button className="social-btn">
                <FaApple className="social-icon" />
                Sign in with Apple
              </button>
            </div>

            {/* FOOTER */}
            <div className="signup-footer">
              <p>
                Don't have an account?
                <NavLink to={"/signup"}> Create Account</NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;













// import { CgAsterisk } from "react-icons/cg";
// import { FaApple } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";

// import "../../assets/styles/Login.css";

// import LoginImage from "../../assets/images/login-image.png";
// import { NavLink } from "react-router-dom";

// const Login = () => {
//   return (
//     <>
//       <div className="login">
//         {/* LEFT SIDE */}
//         <div className="d-none d-lg-block col-lg-7 logo-image">
//           <img src={LoginImage} alt="Leather Bag" />

//           <div className="login-content">
//             <div className="brand-logo">
//               <span>✦</span>
//               <h5>Star Bags</h5>
//             </div>

//             <h3>
//               Timeless Craft.
//               <br />
//               Trusted Always.
//             </h3>

//             <div className="line"></div>

//             <p>
//               Premium leather essentials,
//               <br />
//               crafted to accompany every journey.
//             </p>
//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="col-12 col-lg-5 form-section ">
//           <div className="login-form">
//             <h6>Welcome Back</h6>
//             <p>Login to your account and continue.</p>
//             <form>
             
//               {/* EMAIL */}
//               <div className="mb-1">
//                 <label className="form-label required" >
//                   E-mail Address
//                   <sup>
//                     <CgAsterisk />
//                   </sup>
//                 </label>

//                 <input
//                   type="email"
//                   className="form-control"
//                   placeholder="Enter your e-mail"
//                 />
//               </div>

//               {/* PASSWORD */}
//               <div className="mb-2">
//                 <label className="form-label required " >
//                    Password
//                   <sup>
//                     <CgAsterisk />
//                   </sup>
//                 </label>

//                 <input
//                   type="password"
//                   className="form-control"
//                   placeholder="Enter your Password"
//                 />
//               </div>

//               {/* FORGOT PASSWORD  */}
//               <div className="forgot-password my-2 text-end">
//                 <NavLink to={"/forgotPassword"} className="navigate">Forgot password?</NavLink>
//               </div>
              
//               {/* BUTTON */}
//               <div className="d-grid">
//                 <NavLink   to={ "/"} className="btn login-btn" type="submit">
//                  Log in
//                 </NavLink>
//               </div>
//             </form>

//             {/* DIVIDER */}
//             <div className="divider">
//               <hr />

//               <span>or</span>

//               <hr />
//             </div>

//             {/* SOCIAL BUTTONS */}
//             <div className="social-buttons">
              
//               <button className="social-btn">
//                 <FcGoogle className="social-icon" />
//                 Sign in with Google
//               </button>

//               <button className="social-btn">
//                 <FaApple className="social-icon" />
//                 Sign in with Apple
//               </button>
//             </div>

//             {/* FOOTER */}
//             <div className="signup-footer">
//               <p>
//                 Don't have an account?
//                 <NavLink  to={"/signup"}> Create Account</NavLink>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;
