import { useState } from "react";
import authService from "../services/authService";
import "./Login.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const result = await authService.register(name.trim(), email.trim(), password);
      setSuccess(
        result?.message ||
        "Account created. Check your email for the verification link before logging in."
      );
      setPassword("");
    } catch (err) {
      setError(err?.message || "Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="trip-login">
      <section className="trip-login-visual">
        <a className="trip-login-brand" href="#home"><span className="trip-login-plane">✈</span> TripEase</a>
        <div className="trip-login-copy">
          <span className="trip-login-eyebrow">YOUR JOURNEY BEGINS HERE</span>
          <h1>Make room for new adventures.</h1>
          <p>Plan less. Explore more.</p>
        </div>
        <div className="trip-login-caption"><span>⌖</span> Discover places worth remembering.</div>
      </section>
      <section className="trip-login-panel">
        <div className="trip-login-top"><span>Already registered?</span><a href="#login">Log In ↗</a></div>
        <div className="trip-login-card">
          <div className="trip-login-icon">✈</div>
          <h2>Create your account</h2>
          <p className="trip-login-subtitle">Join TripEase and start planning your next trip.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="signup-name">Full name</label>
            <div className="trip-login-input">
              <span aria-hidden="true">♙</span>
              <input id="signup-name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" autoComplete="name" required />
            </div>
            <label htmlFor="signup-email">Email address</label>
            <div className="trip-login-input">
              <span aria-hidden="true">✉</span>
              <input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" autoComplete="email" required />
            </div>
            <label htmlFor="signup-password">Password</label>
            <div className="trip-login-input">
              <span aria-hidden="true">♙</span>
              <input id="signup-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" autoComplete="new-password" minLength={8} required />
            </div>
            {error && <p className="trip-login-error" role="alert">{error}</p>}
            {success && <p role="status">{success} <a href="#login">Go to login</a></p>}
            <button className="trip-login-submit" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create Account →"}</button>
          </form>
          <p className="trip-login-signup">By signing up, you agree to keep your account details secure.</p>
        </div>
        <p className="trip-login-footer">Made for curious minds and memorable journeys.</p>
      </section>
    </main>
  );
}

export default Signup;