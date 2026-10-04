import { Map, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">
            <Map size={22} />
          </span>
          <span>Trip<span>Ease</span></span>
        </Link>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/plan-trip">Plan a Trip</Link>
          <Link to="/my-trips">My Trips</Link>
          <Link to="/wishlist">Wishlist</Link>
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="navbar-login">
            Login
          </Link>

          <Link to="/signup" className="navbar-signup">
            Get Started
          </Link>

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