import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { CgAsterisk } from "react-icons/cg";
import { sendOtp, verifyOtp } from "../../utils/sendOtp";
import loginImage from "../../assets/images/login-image.png";
import "../../assets/styles/Login.css";

// ─── Step 1: Enter Email ──────────────────────────────────────────────────────
function EmailStep({ onOtpSent }) {
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed)                       return setError("Please enter your email address.");
    if (!/\S+@\S+\.\S+/.test(trimmed)) return setError("Please enter a valid email address.");

    setLoading(true);
    setError("");
    try {
      await sendOtp(trimmed, "forgot"); // generates OTP, stores it, emails it
      onOtpSent(trimmed);
    } catch (err) {
      console.error("OTP send error:", err);
      setError("Failed to send code. Please check the email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <div className="mb-4">
        <Link to="/login" className="navigate d-inline-flex align-items-center gap-2">
          <BiArrowBack /> Back to login
        </Link>
      </div>
      <h6>Forgot Password?</h6>
      <p>Enter your registered email and we'll send you a 4-digit verification code.</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            Email Address
            <sup style={{ color: "red", fontSize: "10px", top: "-2px" }}>
              <CgAsterisk />
            </sup>
          </label>
          <input
            type="email"
            className={`form-control ${error ? "is-invalid" : ""}`}
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            disabled={loading}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
        <div className="d-grid mt-4">
          <button className="btn login-btn" type="submit" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status" />Sending code...</>
            ) : "Send verification code"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Step 2: Enter OTP ───────────────────────────────────────────────────────
function OtpStep({ email, onVerified, onBack }) {
  const [otp, setOtp]                   = useState(["", "", "", ""]);
  const [timer, setTimer]               = useState(119);
  const [timerActive, setTimerActive]   = useState(true);
  const [error, setError]               = useState("");
  const [resending, setResending]       = useState(false);
  const inputRefs                       = useRef([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  useEffect(() => {
    if (!timerActive || timer <= 0) return;
    const id = setInterval(() => {
      setTimer((t) => { if (t <= 1) { setTimerActive(false); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(id);
  }, [timerActive, timer]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp]; next[index] = value; setOtp(next); setError("");
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await sendOtp(email, "forgot");
      setTimer(119); setTimerActive(true);
      setOtp(["", "", "", ""]); setError("");
      inputRefs.current[0]?.focus();
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const entered = otp.join("");
    if (entered.length < 4) return setError("Please enter the complete 4-digit code.");
    const result = verifyOtp(entered, "forgot");
    if (!result.valid) return setError(result.error);
    sessionStorage.setItem("fp_verified", JSON.stringify({ email, verified: true }));
    onVerified();
  };

  return (
    <div className="login-form">
      <div className="mb-4">
        <button onClick={onBack} className="navigate d-inline-flex align-items-center gap-2"
          style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}>
          <BiArrowBack /> Back
        </button>
      </div>
      <h6>Enter your code</h6>
      <p>We sent a 4-digit code to <b>{email}</b>. It expires in 2 minutes.</p>
      <form onSubmit={handleVerify}>
        <div className="d-flex gap-3 mb-2 justify-content-between">
          {otp.map((digit, i) => (
            <input key={i} ref={(el) => (inputRefs.current[i] = el)}
              type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`form-control text-center ${error ? "is-invalid" : ""}`}
              style={{ width: "65px", height: "65px", fontSize: "1.5rem", fontWeight: "600" }} />
          ))}
        </div>
        <div className="mb-3" style={{ minHeight: "20px" }}>
          {error && <span style={{ fontSize: "13px", color: "#ff4d4d", fontWeight: "600" }}>{error}</span>}
        </div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span style={{ fontSize: "13px", color: "var(--gray)" }}>
            Didn't receive it?{" "}
            <button type="button" onClick={handleResend} disabled={timerActive || resending}
              style={{ border: "none", background: "transparent", padding: 0, fontWeight: "700",
                color: timerActive || resending ? "var(--gray)" : "var(--levender)",
                cursor: timerActive || resending ? "default" : "pointer" }}>
              {resending ? "Sending..." : "Resend code"}
            </button>
          </span>
          <span style={{ fontSize: "13px", color: "var(--gray)", fontWeight: "700" }}>{formatTime(timer)}</span>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn login-btn">Verify code</button>
        </div>
      </form>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function ForgotPassword() {
  const navigate                      = useNavigate();
  const [step, setStep]               = useState("email");
  const [sentEmail, setSentEmail]     = useState("");

  return (
    <div className="login">
      <div className="d-none d-lg-block col-lg-7 logo-image">
        <img src={loginImage} alt="Leather Bag" />
        <div className="login-content">
          <div className="brand-logo"><span>✦</span><h5>Star Bags</h5></div>
          <h3>Timeless Craft.<br />Trusted Always.</h3>
          <div className="line"></div>
          <p>Premium leather essentials,<br />crafted to accompany every journey.</p>
        </div>
      </div>
      <div className="col-12 col-lg-5 form-section">
        {step === "email" ? (
          <EmailStep onOtpSent={(email) => { setSentEmail(email); setStep("otp"); }} />
        ) : (
          <OtpStep email={sentEmail} onVerified={() => navigate("/resetpassword")} onBack={() => setStep("email")} />
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;