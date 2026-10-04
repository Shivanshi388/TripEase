import {
  MapPin,
  Globe,
  Mail,
  Phone,
  Home,
  Search,
  User
} from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-logo">
            <MapPin size={22} />
            TripEase
          </div>

          <p className="footer-description">
            Plan smarter, explore more, and make every journey memorable.
          </p>
        </div>

        <div>
          <h3>Explore</h3>
          <a href="/explore">Destinations</a>
          <a href="/recommendations">Recommendations</a>
          <a href="/plan-trip">Plan a Trip</a>
        </div>

        <div>
          <h3>TripEase</h3>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
        </div>

        <div>
          <h3>Follow Us</h3>

          <div className="footer-socials">
            <a href="#" aria-label="Instagram">
              Instagram
            </a>
            <a href="#" aria-label="Website">
              <Globe size={20} />
            </a>
            <a href="#" aria-label="Twitter">
              Twitter
            </a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© 2026 TripEase. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;