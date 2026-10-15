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
          ✈️ <span>TripEase</span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#explore">Explore</a>
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
