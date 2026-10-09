import "../Footer.css";
import { getFeaturedDestination } from "../../utils/journeyPhoto";

function Footer() {
  const featured = getFeaturedDestination();

  return (
    <footer className="home-footer">
      <div className="home-footer__stage">
        <img
          className="home-footer__photo"
          src={featured.image}
          alt=""
        />

        <div className="home-footer__scrim" />

        <div className="container home-footer__stage-inner">
          <div className="home-footer__intro">
            <div>
              <p className="home-footer__eyebrow">
                YOUR NEXT CHAPTER
              </p>

              <h2>Somewhere beautiful awaits.</h2>

              <p className="home-footer__lead">
                From quiet mountain mornings to ocean sunsets,
                find a place that feels like you.
              </p>
            </div>

            <a
              href="#explore"
              className="home-footer__cta"
            >
              Explore destinations
            </a>
          </div>

          <a
            href={`#destination/${featured.id}`}
            className="home-footer__now"
          >
            <span className="home-footer__now-thumb">
              <img
                src={featured.image}
                alt={featured.name}
              />
            </span>

            <span className="home-footer__now-text">
              <small>Featured this visit</small>

              <strong>
                {featured.name}
              </strong>
            </span>

            <span className="home-footer__now-arrow">
              →
            </span>
          </a>
        </div>
      </div>

      <div className="home-footer__links">
        <div className="container home-footer__grid">
          <div className="home-footer__brand">
            <a
              href="#home"
              className="home-footer__logo"
            >
              ✈ TripEase
            </a>

            <p>Plan less. Travel more.</p>
          </div>

          <nav>
            <h3>Discover</h3>
            <a href="#explore">All destinations</a>
            <a href="#recommendations">For you</a>
            <a href="#wishlist">Saved places</a>
          </nav>

          <nav>
            <h3>Your Journey</h3>
            <a href="#my-trips">My Trips</a>
            <a href="#profile">My Profile</a>
          </nav>

          <nav>
            <h3>Account</h3>
            <a href="#login">Login</a>
            <a href="#signup">Sign Up</a>
          </nav>
        </div>

        <div className="container home-footer__bottom">
          <p>
            © {new Date().getFullYear()} TripEase
          </p>

          <span>Take the scenic route.</span>

          <a href="#home">
            Back to Home ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;