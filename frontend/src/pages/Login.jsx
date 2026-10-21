import { useState } from "react";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const result = await authService.login(email.trim(), password);
      if (!result?.token || !result?.user) {
        throw new Error("Login failed. Please try again.");
      }
      login(result.user, result.token);
      window.location.hash = "my-trips";
    } catch (err) {
      const message = err?.message || "Unable to log in. Check your details and try again.";
      setError(message);
      if (/verif/i.test(message)) setShowResend(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setResending(true);
    try {
      const result = await authService.resendVerification(email.trim());
      setNotice(result?.message || "If the account needs verification, an email will be sent.");
    } catch (err) {
      setError(err?.message || "Unable to resend the verification email.");
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="trip-login">
      <section className="trip-login-visual">
        <a className="trip-login-brand" href="#home"><span className="trip-login-plane">✈</span> TripEase</a>
        <div className="trip-login-copy">
          <span className="trip-login-eyebrow">YOUR JOURNEY BEGINS HERE</span>
          <h1>Your next adventure starts here.</h1>
          <p>Plan less. Explore more.</p>
        </div>
        <div className="trip-login-caption"><span>⌖</span> Discover places worth remembering.</div>
      </section>
      <section className="trip-login-panel">
        <div className="trip-login-top"><span>New to TripEase?</span><a href="#signup">Get Started ↗</a></div>
        <div className="trip-login-card">
          <div className="trip-login-icon">✈</div>
          <h2>Welcome back</h2>
          <p className="trip-login-subtitle">Log in to continue planning your trips.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="trip-email">Email address</label>
            <div className="trip-login-input">
              <span aria-hidden="true">✉</span>
              <input id="trip-email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
            </div>
            <label htmlFor="trip-password">Password</label>
            <div className="trip-login-input">
              <span aria-hidden="true">♙</span>
              <input id="trip-password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
            </div>
            <p className="trip-login-signup"><a href="#forgot-password">Forgot your password?</a></p>
            {error && <p className="trip-login-error" role="alert">{error}</p>}
            {notice && <p role="status">{notice}</p>}
            <button className="trip-login-submit" type="submit" disabled={loading}>{loading ? "Logging in..." : "Log In →"}</button>
          </form>
          {showResend && (
            <form onSubmit={handleResend}>
              <p>Your email may not be verified yet. Resend the verification link below.</p>
              <button className="trip-login-submit" type="submit" disabled={resending || !email.trim()}>{resending ? "Sending..." : "Resend Verification Email"}</button>
            </form>
          )}
          <p className="trip-login-signup">Don’t have an account? <a href="#signup">Create one</a></p>
        </div>
        <p className="trip-login-footer">Made for curious minds and memorable journeys.</p>
      </section>
    </main>
  );
}

export default Login;