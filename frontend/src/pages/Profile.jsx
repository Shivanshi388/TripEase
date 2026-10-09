import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <div className="auth-eyebrow">YOUR TRIPEASE ACCOUNT</div>
          <h1>Your profile</h1>
          <p className="auth-description">
            Log in to view your account information.
          </p>
          <a className="auth-submit" href="#login" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
            Log in
          </a>
          <p className="auth-switch">
            New to TripEase? <a href="#signup">Create an account</a>
          </p>
        </div>
      </section>
    );
  }

  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-eyebrow">YOUR TRIPEASE ACCOUNT</div>

        <div
          aria-hidden="true"
          style={{
            display: "grid",
            placeItems: "center",
            width: 76,
            height: 76,
            marginBottom: 22,
            borderRadius: "50%",
            background: "var(--sage)",
            color: "var(--forest-dark)",
            fontSize: "1.5rem",
            fontWeight: 800,
          }}
        >
          {initials || "T"}
        </div>

        <h1>Hello, {user.name}</h1>
        <p className="auth-description">
          Your travel profile and account details.
        </p>

        <div style={{ marginTop: 28 }}>
          <p style={{ marginBottom: 6, color: "var(--muted)", fontSize: "0.85rem" }}>
            NAME
          </p>
          <p style={{ marginBottom: 20, overflowWrap: "anywhere", fontWeight: 650 }}>
            {user.name}
          </p>

          <p style={{ marginBottom: 6, color: "var(--muted)", fontSize: "0.85rem" }}>
            EMAIL ADDRESS
          </p>
          <p style={{ overflowWrap: "anywhere", fontWeight: 650 }}>
            {user.email}
          </p>
        </div>

        <a
          href="#my-trips"
          className="auth-submit"
          style={{
            display: "block",
            marginTop: 28,
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          View my trips
        </a>

        <button
          type="button"
          className="auth-submit"
          onClick={logout}
          style={{
            marginTop: 12,
            border: "1px solid var(--forest)",
            background: "transparent",
            color: "var(--forest)",
          }}
        >
          Log out
        </button>
      </div>
    </section>
  );
}

export default Profile;
