import { CgAsterisk } from "react-icons/cg";
import "../../assets/styles/Login.css";

import LoginImage from "../../assets/images/login-image.png";
import { NavLink } from "react-router-dom";

const ResetPassword = () => {
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
            <h6>Reset Password</h6>
            <p>Create a strong password for your Maison Vero account. You'll use it every time you sign in.</p>
            <form>
             
              {/* EMAIL */}
              <div className="mb-1">
                <label className="form-label">
                  New Password
                  <sup>
                    <CgAsterisk />
                  </sup>
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Min. 8 character"
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-2">
                <label className="form-label">
                Confirm password
                  <sup>
                    <CgAsterisk />
                  </sup>
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm your Password"
                />
              </div>

              
              {/* BUTTON */}
              <div className="d-grid mt-4">
                <NavLink to={"/"} className="btn login-btn" type="submit">
                 Reset Password
                </NavLink>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword ;
