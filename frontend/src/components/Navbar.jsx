function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a href="#home" className="logo">
          ✈️ <span>TripEase</span>
        </a>

        <nav className="nav-links">
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
        </div>
      </div>
    </header>
  );
}

export default Navbar;