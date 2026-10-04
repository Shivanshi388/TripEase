function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-logo">✈️ TripEase</div>
          <p>
            Your smarter way to discover destinations, plan trips and travel
            better.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <a href="#explore">Destinations</a>
          <a href="#recommendations">Recommendations</a>
          <a href="#my-trips">My Trips</a>
        </div>

        <div>
          <h4>Account</h4>
          <a href="#login">Login</a>
          <a href="#signup">Create Account</a>
          <a href="#profile">Profile</a>
        </div>

        <div>
          <h4>TripEase</h4>
          <a href="#wishlist">Wishlist</a>
          <a href="#recommendations">Smart Recommendations</a>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 TripEase. Built for smarter travel.
      </div>
    </footer>
  );
}

export default Footer;