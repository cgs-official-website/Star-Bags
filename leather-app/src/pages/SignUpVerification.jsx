import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import loginImage from "../assets/images/login-image.png";
import "../assets/styles/Login.css";

function SignUpVerification() {
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
    <div className="login">
      {/* LEFT SIDE: IMAGE */}
      <div className="d-none d-lg-block col-lg-7 logo-image">
        <img src={loginImage} alt="Leather Bag" />

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

      {/* RIGHT SIDE: OTP FORM */}
      <div className="col-12 col-lg-5 form-section">
        <div className="login-form">
          {/* Back to sign up */}
          <div className="mb-4">
            <Link to="/signup" className="navigate d-inline-flex align-items-center gap-2">
              <BiArrowBack /> Back to sign up
            </Link>
          </div>

          <h6>Verify your account</h6>
          <p>
            We sent a 4-digit verification code to your email. Please enter it below to complete your registration.
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            {/* OTP Input Boxes */}
            <div className="d-flex gap-3 mb-2 justify-content-between">
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
                    width: "65px",
                    height: "65px",
                    fontSize: "1.5rem",
                    fontWeight: "600",
                  }}
                />
              ))}
            </div>

            {/* Error Message */}
            <div className="mb-3">
              <span style={{ fontSize: "13px", color: "#ff4d4d", fontWeight: "600" }}>
                The code you entered is incorrect. Please try again.
              </span>
            </div>

            {/* Resend + Timer */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span style={{ fontSize: "13px", color: "var(--gray)" }}>
                Didn't receive it?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "var(--levender)",
                    fontWeight: "700",
                    padding: 0,
                  }}
                >
                  Resend code
                </button>
              </span>
              <span style={{ fontSize: "13px", color: "var(--gray)", fontWeight: "700" }}>
                {formatTime(timer)}
              </span>
            </div>

            {/* Verify Button */}
            <div className="d-grid">
              <NavLink to="/" className="btn login-btn d-flex align-items-center justify-content-center">
                Confirm & Activate
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpVerification;