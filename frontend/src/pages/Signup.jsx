import { useState } from "react";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./Signup.css";

function Signup() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.register(name.trim(), email.trim(), password);

      const result = await authService.login(email.trim(), password);

      if (!result?.token || !result?.user) {
        throw new Error("Your account was created, but automatic login failed. Please log in.");
      }

      login(result.user, result.token);
      window.location.hash = "my-trips";
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="trip-signup">
      <section className="trip-signup-art">
        <a className="trip-signup-brand" href="#home">
          <span>✈</span> TripEase
        </a>

        <div className="trip-signup-message">
          <span className="trip-signup-kicker">YOUR STORY. YOUR JOURNEY.</span>
          <h1>Every great trip begins with a dream.</h1>
          <p>Create your account and turn your travel ideas into plans.</p>
        </div>

        <div className="trip-signup-destination destination-one">
          <span className="destination-icon">🏝️</span>
          <div><strong>Find your happy place</strong><small>Somewhere new is waiting</small></div>
          <span className="destination-arrow">↗</span>
        </div>

        <div className="trip-signup-destination destination-two">
          <span className="destination-icon">🧭</span>
          <div><strong>Make every trip yours</strong><small>Plan at your own pace</small></div>
        </div>

        <div className="trip-signup-orbit orbit-one"></div>
        <div className="trip-signup-orbit orbit-two"></div>
        <span className="trip-signup-spark spark-one">✦</span>
        <span className="trip-signup-spark spark-two">✧</span>
      </section>

      <section className="trip-signup-panel">
        <div className="trip-signup-top">
          <span>Already have an account?</span>
          <a href="#login">Log in</a>
        </div>

        <div className="trip-signup-card">
          <div className="trip-signup-icon">✦</div>
          <span className="trip-signup-step">LET'S GET YOU GOING</span>
          <h2>Start your journey</h2>
          <p className="trip-signup-subtitle">
            Create an account to start planning your next adventure.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="signup-name">Your name</label>
            <input
              id="signup-name"
              type="text"
              placeholder="What should we call you?"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />

            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="signup-password">Create a password</label>
            <input
              id="signup-password"
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
            />

            <p className="trip-signup-hint">Use at least 8 characters for your password.</p>

            {error && <p className="trip-signup-error" role="alert">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Creating your account..." : "Create Account"}
              {!loading && <span> →</span>}
            </button>
          </form>

          <p className="trip-signup-terms">
            Your next adventure is closer than you think.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Signup;
