import { Map, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="/" className="navbar-logo">
          <span className="navbar-logo-icon">
            <Map size={22} />
          </span>
          <span>Trip<span>Ease</span></span>
        </a>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <a href="/">Home</a>
          <a href="/explore">Explore</a>
          <a href="/plan-trip">Plan a Trip</a>
          <a href="/my-trips">My Trips</a>
        </nav>

        <div className="navbar-actions">
          <a href="/login" className="navbar-login">
            Login
          </a>

          <a href="/signup" className="navbar-signup">
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