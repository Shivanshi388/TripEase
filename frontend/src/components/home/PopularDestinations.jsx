import { ArrowUpRight, MapPin } from "lucide-react";
/*import { Link } from "react-router-dom";*/

function PopularDestinations({
  destinations,
  featuredDestination,
}) {
  const orderedDestinations = [
    featuredDestination,
    ...destinations.filter(
      (destination) =>
        destination.id !== featuredDestination.id
    ),
  ];

  return (
    <section className="destination-showcase">
      <div className="container">
        <div className="destination-heading">
          <div>
            <span className="section-label">
              DISCOVER
            </span>

            <h2>
              Go where you
              <br />
              <span>feel alive.</span>
            </h2>
          </div>

          <p>
            From quiet mountains to tropical coastlines,
            find a place that feels exactly right.
          </p>
        </div>

        <div className="destination-showcase-grid">
          {orderedDestinations.slice(0, 3).map(
            (destination, index) => (
              <a
                href={`#destination/${destination.id}`}
                className={`showcase-card ${
                  index === 0 ? "showcase-card-featured" : ""
                }`}
                key={destination.id}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                />

                <div className="showcase-card-gradient" />

                <div className="showcase-card-content">
                  <div className="showcase-location">
                    <MapPin size={15} />
                    {destination.location}
                  </div>

                  <h3>{destination.name}</h3>

                  <p>{destination.tagline}</p>
                </div>

                <div className="showcase-arrow">
                  <ArrowUpRight size={21} />
                </div>
              </a>
            )
          )}
        </div>

        <div className="destination-footer-link">
          <a href="#explore">
            Explore all destinations
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default PopularDestinations;