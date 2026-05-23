import { useState } from "react";
import { CgAsterisk } from "react-icons/cg";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import "../../assets/styles/CreateAccount.css";

import LoginImage from "../../assets/images/login-image.png";
import { NavLink } from "react-router-dom";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    termsAccepted: false
  });

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
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
      // Proceed to signup verification
      console.log("Form submitted:", formData);
      // Navigate to signupVerify - you can add navigation logic here
    }
  };

  return (
    <>
      <div className="sign-up">
        {/* LEFT SIDE */}
        <div className="d-none d-lg-block col-lg-7 logo-image">
          <img src={LoginImage} alt="Leather Bag" />

          <div className="sign-up-content">
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
          <div className="sign-up-form">
            <h6>Create Account</h6>

            <p>Join Star Bags and experience timeless craftsmanship.</p>

            <form onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div className="mb-1">
                <label className="form-label">
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
              <div className="mb-1">
                <label className="form-label">
                  Create password
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
                  placeholder="Create your Password"
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              {/* CHECKBOX */}
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                />

                <label className="form-check-label" htmlFor="remember">
                  Accepted the <NavLink className="text-decoration-none term" to="/terms">Terms and condition</NavLink>
                </label>
              </div>

              {/* BUTTON */}
              <div className="d-grid">
                <button className="btn signup-btn" type="submit">
                  Sign up
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
            <div className="signin-footer">
              <p>
                Already have an account?
                <NavLink to={"/login"}> Sign in</NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAccount;


// import { CgAsterisk } from "react-icons/cg";
// import { FaApple } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";

// import "../../assets/styles/CreateAccount.css";

// import LoginImage from "../../assets/images/login-image.png";
// import { NavLink } from "react-router-dom";

// const CreateAccount = () => {
//   return (
//     <>
//       <div className="sign-up">
//         {/* LEFT SIDE */}
//         <div className="d-none d-lg-block col-lg-7 logo-image">
//           <img src={LoginImage} alt="Leather Bag" />

//           <div className="sign-up-content">
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
//           <div className="sign-up-form">
//             <h6>Create Account</h6>

//             <p>Join Star Bags and experience timeless craftsmanship.</p>

//             <form>
//               {/* NAME */}
//               {/* <div className="mb-1">
//                 <label className="form-label">
//                   Enter your name
//                   <sup>
//                     <CgAsterisk />
//                   </sup>
//                 </label>

//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Enter your name"
//                 />
//               </div> */}

//               {/* EMAIL */}
//               <div className="mb-1">
//                 <label className="form-label">
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
//               <div className="mb-1">
//                 <label className="form-label">
//                   Create password
//                   <sup>
//                     <CgAsterisk />
//                   </sup>
//                 </label>

//                 <input
//                   type="password"
//                   className="form-control"
//                   placeholder="Create your Password"
//                 />
//               </div>

//               {/* CONFIRM PASSWORD */}
//               {/* <div className="mb-3">
//                 <label className="form-label">
//                   Confirm your password
//                   <sup>
//                     <CgAsterisk />
//                   </sup>
//                 </label>

//                 <input
//                   type="password"
//                   className="form-control"
//                   placeholder="Confirm your password"
//                 />
//               </div> */}

//               {/* CHECKBOX */}
//               <div className="form-check mb-3">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="remember"
//                 />

//                 <label className="form-check-label" htmlFor="remember">
//                   Accepted the <NavLink className="text-decoration-none term" >Terms and condition</NavLink>
//                 </label>
//               </div>

//               {/* BUTTON */}
//               <div className="d-grid">
//                 <NavLink to={'/signupVerify'} className="btn signup-btn" type="submit">
//                   Sign up
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
//             <div className="signin-footer">
//               <p>
//                 Already have an account?
//                 <NavLink  to={"/login"}> Sign in</NavLink>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CreateAccount;
