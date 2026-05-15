import  { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import loginImage from "../assets/images/login-image.png";
import "../assets/styles/Login.css";


function ForgetPassword() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(119); // 1:59 in seconds
  const [timerActive, setTimerActive] = useState(true);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (!timerActive || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setTimerActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(119);
    setTimerActive(true);
    setOtp(["", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div
      className="container-fluid vh-100 d-flex p-0 overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="row g-0 w-100 h-100">
        {/* Left Side: Image */}
        <div className="d-none d-lg-block col-lg-7 logo-image">
          <img src={loginImage} alt="Leather Bag" />
        
          <div className="sign-up-content">
            <div className="brand-logo">
            <span>✦</span>
            <h5>Star Bags</h5>
          </div>
        
          <h3>
            Timeless Craft.<br />
            Trusted Always.
          </h3>
          <div className="line"></div>
          <p> Premium leather essentials,<br />
            crafted to accompany every journey.
          </p>
        </div>
      </div>

        {/* Right Side: OTP Form */}
        <div
          className="col-12 col-lg-5 p-5 h-100 d-flex flex-column gap-4  "
          style={{ overflowY: "auto" }}
        >
          {/* Back to login */}
          <Link
              to="/login"
              className="d-inline-flex align-items-center gap-2 text-decoration-none mb-5 fw-bolder"
              style={{ fontSize: "14px", color: "#374151", }}
            >
              <i className="bi bi-arrow-left" style={{ fontSize: "16px"  }} />
              Back to login
            </Link>
          <div
            className="w-100 align-self-center  "
            style={{ maxWidth: "520px",  }}
          >      
            

            <h2
              className="fw-bold mb-2"
              style={{ color: "#111827", fontSize: "1.75rem" }}
            >
              Enter your code
            </h2>
            <p
              className="mb-4"
              style={{ fontSize: "14px", color: "#4b5563", maxWidth: "340px" }}
            >
              We sent a 4-digit code to <b> starbags1993@gmail.com. </b>It
              expires in 2 minutes.
            </p>

            {/* OTP Input Boxes */}
            <div className="d-flex gap-3 mb-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="form-control text-center"
                  style={{
                    width: "68px",
                    height: "68px",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: "#111827",
                    borderRadius: "8px",
                    border: "1.5px solid #d1d5db",
                    outline: "none",
                    flexShrink: 0,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              ))}
            </div>
            <span
              style={{ fontSize: "14px", color: "#ef4444",fontWeight: "600" }}
            >
              The code you entered is incorrect. Please try again.
            </span>
            {/* Resend + Timer */}
            <div className="d-flex justify-content-between align-items-center mb-4 fw-bolder" style={{ width: '320px',paddingTop:"10px" }}>
              <span style={{ fontSize: "13px", color: "#6b7280"  }}>
                Didn't receive it?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="btn p-0 text-decoration-none fw-bolder"
                  style={{
                    fontSize: "13px",
                    color: "#8b5cf6",
                    border: "none",
                    background: "transparent",
                  }}
                >
                  Resend code
                </button>
              </span>
              <span
                style={{ fontSize: "13px", color: "#6b7280", fontWeight: "bolder" }}
              >
                {formatTime(timer)}
              </span>
            </div>

            {/* Verify Button */}
            <NavLink
              type="button"
              to={'/resetpassword'}
              className="btn py-2"
              style={{
                width: '340px',
                backgroundColor: "#8b5cf6",
                color: "white",
                borderRadius: "6px",
                fontWeight: 500,
                fontSize: "15px",
                border: "none",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#7c3aed")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#8b5cf6")
              }
            >
              Verify code
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
