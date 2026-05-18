import { CgAsterisk } from "react-icons/cg";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import "../../assets/styles/Login.css";

import LoginImage from "../../assets/images/login-image.png";
import { NavLink } from "react-router-dom";

const Login = () => {
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
            <form>
             
              {/* EMAIL */}
              <div className="mb-1">
                <label className="form-label">
                  E-mail Address
                  <sup>
                    <CgAsterisk />
                  </sup>
                </label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your e-mail"
                />
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
                  className="form-control"
                  placeholder="Enter your Password"
                />
              </div>

              {/* FORGOT PASSWORD  */}
              <div className="forgot-password my-2 text-end">
                <NavLink to={"/forgotPassword"} className="navigate">Forgot password?</NavLink>
              </div>
              
              {/* BUTTON */}
              <div className="d-grid">
                <NavLink   to={ "/"} className="btn login-btn" type="submit">
                 Log in
                </NavLink>
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
                <NavLink  to={"/signup"}> Create Account</NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
