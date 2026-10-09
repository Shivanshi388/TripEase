import { ArrowRight, Compass } from "lucide-react";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <span className="hero-badge">
            <Compass size={16} />
            Your journey starts here
          </span>

          <h1>
            Travel more.
            <br />
            <span>Plan less.</span>
          </h1>

          <p>
            Discover amazing destinations, build personalized itineraries,
            manage your budget, and make every trip easier with TripEase.
          </p>

          <div className="hero-actions">
            <a href="/plan-trip" className="btn btn-primary">
              Plan My Trip
              <ArrowRight size={18} />
            </a>

            <a href="/explore" className="btn btn-secondary">
              Explore Destinations
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;