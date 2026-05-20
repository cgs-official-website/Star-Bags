import { CgAsterisk } from "react-icons/cg";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import "../../assets/styles/CreateAccount.css";

import LoginImage from "../../assets/images/login-image.png";
import { NavLink } from "react-router-dom";

const CreateAccount = () => {
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

            <form>
              {/* NAME */}
              {/* <div className="mb-1">
                <label className="form-label">
                  Enter your name
                  <sup>
                    <CgAsterisk />
                  </sup>
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                />
              </div> */}

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
              <div className="mb-1">
                <label className="form-label">
                  Create password
                  <sup>
                    <CgAsterisk />
                  </sup>
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Create your Password"
                />
              </div>

              {/* CONFIRM PASSWORD */}
              {/* <div className="mb-3">
                <label className="form-label">
                  Confirm your password
                  <sup>
                    <CgAsterisk />
                  </sup>
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm your password"
                />
              </div> */}

              {/* CHECKBOX */}
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                />

                <label className="form-check-label" htmlFor="remember">
                  Accepted the <NavLink className="text-decoration-none term" >Terms and condition</NavLink>
                </label>
              </div>

              {/* BUTTON */}
              <div className="d-grid">
                <NavLink to={'/signupVerify'} className="btn signup-btn" type="submit">
                  Sign up
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
            <div className="signin-footer">
              <p>
                Already have an account?
                <NavLink  to={"/login"}> Sign in</NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAccount;
