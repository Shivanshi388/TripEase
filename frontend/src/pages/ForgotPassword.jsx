import { useState } from "react";
import authService from "../services/authService";
import "./Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const result = await authService.forgotPassword(email.trim());
      setMessage(result?.message || "If an account exists for this email, a password reset link will be sent.");
    } catch (err) {
      setError(err?.message || "Unable to request a password reset. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="trip-login">
      <section className="trip-login-panel" style={{ flex: 1 }}>
        <div className="trip-login-card">
          <div className="trip-login-icon">✉</div>
          <h2>Forgot password?</h2>
          <p className="trip-login-subtitle">Enter your email and we'll send a reset link if an account matches.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="forgot-email">Email address</label>
            <div className="trip-login-input">
              <span aria-hidden="true">✉</span>
              <input id="forgot-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" autoComplete="email" required />
            </div>
            {error && <p className="trip-login-error" role="alert">{error}</p>}
            {message && <p role="status">{message}</p>}
            <button className="trip-login-submit" type="submit" disabled={loading}>{loading ? "Sending..." : "Send Reset Link →"}</button>
          </form>
          <p className="trip-login-signup"><a href="#login">Back to login</a></p>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;