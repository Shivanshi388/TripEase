import { useState } from "react";
import authService from "../services/authService";
import "./Login.css";

function ResetPassword() {
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!token) {
      setError("This reset link is missing its token. Request a new password reset email.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const result = await authService.resetPassword(token, password);
      setMessage(result?.message || "Password reset successfully. You can now log in.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err?.message || "Unable to reset your password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="trip-login">
      <section className="trip-login-panel" style={{ flex: 1 }}>
        <div className="trip-login-card">
          <div className="trip-login-icon">🔒</div>
          <h2>Choose a new password</h2>
          <p className="trip-login-subtitle">Use a new password for your TripEase account.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="reset-password">New password</label>
            <div className="trip-login-input">
              <span aria-hidden="true">♙</span>
              <input id="reset-password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" minLength={8} placeholder="At least 8 characters" required />
            </div>
            <label htmlFor="confirm-password">Confirm new password</label>
            <div className="trip-login-input">
              <span aria-hidden="true">♙</span>
              <input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" minLength={8} placeholder="Re-enter your password" required />
            </div>
            {error && <p className="trip-login-error" role="alert">{error}</p>}
            {message && <p role="status">{message}</p>}
            <button className="trip-login-submit" type="submit" disabled={loading}>{loading ? "Updating..." : "Reset Password →"}</button>
          </form>
          {message && <p className="trip-login-signup"><a href="#login">Go to login</a></p>}
        </div>
      </section>
    </main>
  );
}

export default ResetPassword;