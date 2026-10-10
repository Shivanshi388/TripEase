import destinations from "../data/destinations";

function DestinationPage({ destination }) {
  const place = destinations.find(
    (d) => d.id === Number(destination)
  );

  if (!place) {
    return (
      <section className="page-section">
        <div className="container">
          <h1>Destination not found</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container">
        <div className="destination-detail-hero">
          <img
            src={place.image}
            alt={place.name}
            className="destination-detail-image"
          />

          <div>
            <span>DESTINATION GUIDE</span>
            <h1>{place.name}</h1>
            <p>{place.description}</p>

            <div className="detail-actions">
              <a href="#my-trips" className="btn btn-primary">
                Plan a Trip
              </a>
              <a href="#wishlist" className="btn btn-secondary">
                Add to Wishlist
              </a>
            </div>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-box">
            <span>Location</span>
            <h3>Location</h3>
            <p>{place.location}</p>
          </div>

          <div className="detail-box">
            <span>Category</span>
            <h3>Best for</h3>
            <p>{place.category}</p>
          </div>

          <div className="detail-box">
            <span>Budget</span>
            <h3>Budget</h3>
            <p>{place.budget}</p>
          </div>
        </div>

        <div className="info-panel">
          <h2>Plan your visit</h2>
          <p>
            TripEase will eventually use destination, weather, budget and
            recommendation APIs to help create a personalized itinerary for
            you.
          </p>

          <a href="#recommendations" className="btn btn-primary">
            Get Recommendations
          </a>
        </div>
      </div>
    </section>
  );
}

export default DestinationPage;
