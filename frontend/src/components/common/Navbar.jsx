import { Map, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a href="#home" className="logo">
          <span className="navbar-logo-icon">
            <Map size={22} />
          </span>
          <span>TripEase</span>
        </a>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#home">Home</a>
          <a href="#explore">Explore</a>
          <a href="#my-trips">My Trips</a>
          <a href="#wishlist">Wishlist</a>
        </nav>

        <div className="nav-actions">
          <a href="#login" className="login-link">
            Log in
          </a>

          <a href="#signup" className="btn btn-primary small-btn">
            Get Started
          </a>

          <button
            className="navbar-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;