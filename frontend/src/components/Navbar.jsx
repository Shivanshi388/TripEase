import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  function handleProtectedNavigation(event, destination) {
    if (!user) {
      event.preventDefault();
      window.location.hash = "signup";
      return;
    }

    window.location.hash = destination;
  }

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a href="#home" className="logo">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "8px", flexShrink: 0 }}>
            <path d="M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8l-8.2-1.8a.5.5 0 0 0-.5.8l3.6 5.4-3.6 3.6a2 2 0 0 0 0 2.8l.4.4a2 2 0 0 0 2.8 0l3.6-3.6 5.4 3.6a.5.5 0 0 0 .7-.5Z" />
          </svg>
          <span>TripEase</span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#explore">Explore</a>
          <a href="#recommendations">Recommendations</a>
          <a
            href={user ? "#my-trips" : "#signup"}
            onClick={(event) => handleProtectedNavigation(event, "my-trips")}
          >
            My Trips
          </a>
          <a
            href={user ? "#wishlist" : "#signup"}
            onClick={(event) => handleProtectedNavigation(event, "wishlist")}
          >
            Wishlist
          </a>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="login-link">
                Hi, {user.name}
              </span>
              <button
                type="button"
                className="btn btn-primary small-btn"
                onClick={logout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <a href="#login" className="login-link">
                Log in
              </a>
              <a href="#signup" className="btn btn-primary small-btn">
                Get Started
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

