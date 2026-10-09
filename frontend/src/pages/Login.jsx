import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const result = login(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    window.location.hash = "#home";
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-eyebrow">YOUR NEXT JOURNEY AWAITS</div>
        <h1>Welcome back</h1>
        <p className="auth-description">
          Sign in to pick up where your travel story left off.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button className="auth-submit" type="submit">
            Log in
          </button>
        </form>

        <p className="auth-switch">
          New to TripEase? <a href="#signup">Create an account</a>
        </p>
      </div>
    </section>
  );
}

export default Login;
