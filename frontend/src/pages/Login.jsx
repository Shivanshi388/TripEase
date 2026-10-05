function Login() {
  return (
    <section className="auth-section">
      <div className="auth-card">
        <div className="auth-logo">✈️ TripEase</div>

        <h1>Welcome back</h1>
        <p>Log in to continue planning your trips.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.location.hash = "profile";
          }}
        >
          <label>Email</label>
          <input type="email" placeholder="you@example.com" required />

          <label>Password</label>
          <input type="password" placeholder="••••••••" required />

          <button className="btn btn-primary full-btn">Log In</button>
        </form>

        <p className="auth-switch">
          Don't have an account? <a href="#signup">Create one</a>
        </p>
      </div>
    </section>
  );
}

export default Login;