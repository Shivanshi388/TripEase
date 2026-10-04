const data = {
  goa: {
    name: "Goa",
    emoji: "🏝️",
    description:
      "A beautiful destination famous for beaches, sunsets, food and unforgettable experiences.",
  },
  manali: {
    name: "Manali",
    emoji: "🏔️",
    description:
      "A peaceful mountain destination perfect for nature, adventure and relaxing getaways.",
  },
  jaipur: {
    name: "Jaipur",
    emoji: "🏰",
    description:
      "Explore royal palaces, historic forts, colorful markets and amazing Rajasthani cuisine.",
  },
  kerala: {
    name: "Kerala",
    emoji: "🌴",
    description:
      "Discover peaceful backwaters, beautiful landscapes and rich local culture.",
  },
  ladakh: {
    name: "Ladakh",
    emoji: "⛰️",
    description:
      "An adventurous mountain destination with breathtaking landscapes and unique experiences.",
  },
  udaipur: {
    name: "Udaipur",
    emoji: "🏛️",
    description:
      "Known for beautiful lakes, palaces and unforgettable royal architecture.",
  },
};

function DestinationPage({ destination }) {
  const place = data[destination] || data.goa;

  return (
    <section className="page-section">
      <div className="container">
        <div className="destination-detail-hero">
          <div className="big-emoji">{place.emoji}</div>

          <div>
            <span>DESTINATION GUIDE</span>
            <h1>{place.name}</h1>
            <p>{place.description}</p>

            <div className="detail-actions">
              <a href="#my-trips" className="btn btn-primary">
                Plan a Trip
              </a>

              <a href="#wishlist" className="btn btn-secondary">
                ♡ Add to Wishlist
              </a>
            </div>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-box">
            <span>📍</span>
            <h3>Location</h3>
            <p>India</p>
          </div>

          <div className="detail-box">
            <span>⭐</span>
            <h3>Rating</h3>
            <p>4.8 / 5</p>
          </div>

          <div className="detail-box">
            <span>🌤️</span>
            <h3>Best for</h3>
            <p>Leisure & Adventure</p>
          </div>

          <div className="detail-box">
            <span>💰</span>
            <h3>Budget</h3>
            <p>Moderate</p>
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
            Get Recommendations →
          </a>
        </div>
      </div>
    </section>
  );
}

export default DestinationPage;