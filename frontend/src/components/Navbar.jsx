import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar({ isHome = false }) {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 32);

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <header
      className={`navbar ${
        isHome
          ? `navbar--nature${scrolled ? " navbar--scrolled" : ""}`
          : "navbar--nature navbar--scrolled"
      }`}
    >
      <div className="container nav-inner">
        <a href="#home" className="logo" aria-label="TripEase home">
          <span
            style={{
              fontFamily: "'Playfair Display', sans-serif",
              fontWeight: 700,
              fontSize: "2.1rem",
            }}
          >
            TripEase
          </span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#explore">Explore</a>
          <a href="#my-trips">My Trips</a>
          <a href="#wishlist">Wishlist</a>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <a className="nav-greeting" href="#profile">
                Hi, {user.name.split(" ")[0]}
              </a>
              <button
                className="nav-logout"
                type="button"
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
