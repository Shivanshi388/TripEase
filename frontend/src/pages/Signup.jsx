import { useState } from "react";
import authService from "../services/authService";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register(name, email, password);
      setMessage(result.message || "Account created successfully!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-section">
      <div className="container auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-icon">✈️</span>
            <h1>Create your TripEase account</h1>
            <p>Start planning smarter trips today.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                maxLength={60}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </label>

            {error && <p role="alert">{error}</p>}
            {message && <p role="status">{message}</p>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <a href="#login">Log in</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Signup;
