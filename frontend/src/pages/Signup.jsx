function Signup() {
  return (
    <section className="page-section">
      <div className="container auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-icon">✈️</span>
            <h1>Create your TripEase account</h1>
            <p>Start planning smarter trips today.</p>
          </div>

          <form className="auth-form">
            <label>
              Full Name
              <input
                type="text"
                placeholder="Enter your name"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                placeholder="Enter your email"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Create a password"
              />
            </label>

            <button type="button" className="btn btn-primary">
              Create Account
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