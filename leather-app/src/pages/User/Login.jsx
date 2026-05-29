import { useState, useEffect } from "react";
import { CgAsterisk } from "react-icons/cg";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

import "../../assets/styles/Login.css";

import LoginImage from "../../assets/images/login-image.png";
import { NavLink } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      console.log("Login submitted:", formData.email);
      
      const email = formData.email.includes("@") ? formData.email.trim() : `${formData.email.trim()}@starbags.com`;
      
      try {
        let userCredential;
        userCredential = await signInWithEmailAndPassword(auth, email, formData.password);

        const user = userCredential.user;

        // Fetch user data from firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.exists() ? userDocSnap.data() : {};

        // Check role strictly from Firestore document
        const role = userData.role === 'admin' ? 'admin' : 'user';

        localStorage.setItem("user", JSON.stringify({
          uid: user.uid,
          email: user.email,
          role: role,
          name: userData.name || user.displayName || (role === 'admin' ? 'Starbags Admin' : user.email.split("@")[0]),
          mobile: userData.mobile || (formData.email.includes("@") ? "" : formData.email),
          gender: userData.gender || "Male"
        }));

        if (role === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Firebase Auth Error:", err);
        let errorMsg = "Invalid email or password.";
        if (
          err.code === "auth/invalid-credential" || 
          err.code === "auth/wrong-password" || 
          err.code === "auth/user-not-found"
        ) {
          errorMsg = "Incorrect email/mobile or password.";
        } else if (err.code === "auth/too-many-requests") {
          errorMsg = "Too many failed login attempts. Try again later.";
        } else if (err.code === "auth/network-request-failed") {
          errorMsg = "Network error. Please check your connection.";
        }
        setErrors({
          email: errorMsg,
          password: errorMsg
        });
      } finally {
        setLoading(false);
      }
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
                <label className="form-label" >
                  Email or Mobile Number
                  <sup style={{color:'red', fontSize:'10px',top:'-2px'}}>
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
                  disabled={loading}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* PASSWORD */}
              <div className="mb-2">
                <label className="form-label">
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
                  disabled={loading}
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
                <button className="btn login-btn" type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Log in"}
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

              {/* <button className="social-btn">
                <FaApple className="social-icon" />
                Sign in with Apple
              </button> */}
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
