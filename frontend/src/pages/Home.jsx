const destinations = [
  {
    id: "goa",
    name: "Goa",
    country: "India",
    emoji: "🏝️",
    description: "Beaches, sunsets and unforgettable adventures.",
    rating: "4.8",
  },
  {
    id: "manali",
    name: "Manali",
    country: "India",
    emoji: "🏔️",
    description: "Mountains, snow and peaceful escapes.",
    rating: "4.7",
  },
  {
    id: "jaipur",
    name: "Jaipur",
    country: "India",
    emoji: "🏰",
    description: "Royal architecture, culture and delicious food.",
    rating: "4.6",
  },
];

const features = [
  {
    icon: "🗺️",
    title: "Smart Planning",
    text: "Build a personalized trip plan based on your destination and preferences.",
  },
  {
    icon: "💡",
    title: "Personalized Recommendations",
    text: "Discover places and experiences that match your travel style.",
  },
  {
    icon: "💰",
    title: "Budget Friendly",
    text: "Keep track of your travel budget and plan smarter.",
  },
  {
    icon: "❤️",
    title: "Save Your Favorites",
    text: "Create a wishlist of destinations you want to visit.",
  },
];

function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="eyebrow">✨ Your smarter way to travel</div>

            <h1>
              Plan less.
              <br />
              <span>Travel more.</span>
            </h1>

            <p>
              TripEase helps you discover destinations, build personalized
              itineraries and manage your entire journey in one simple place.
            </p>

            <div className="hero-buttons">
              <a href="#explore" className="btn btn-primary">
                Explore Destinations →
              </a>

              <a href="#my-trips" className="btn btn-secondary">
                Plan My Trip
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>100+</strong>
                <span>Destinations</span>
              </div>
              <div>
                <strong>500+</strong>
                <span>Trip Ideas</span>
              </div>
              <div>
                <strong>4.8/5</strong>
                <span>User Rating</span>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="floating-card top-card">
              ✨ Personalized for you
            </div>

            <div className="travel-illustration">
              <div className="sun">☀️</div>
              <div className="mountain">🏔️</div>
              <div className="plane">✈️</div>
            </div>

            <div className="floating-card bottom-card">
              📍 Discover your next adventure
            </div>
          </div>
        </div>
      </section>

      <section className="planner-section">
        <div className="container">
          <div className="planner-card">
            <div className="section-heading left">
              <span>TRIP PLANNER</span>
              <h2>Where are you going?</h2>
              <p>Tell us a little about your trip and get started.</p>
            </div>

            <div className="planner-form">
              <label>
                Destination
                <input placeholder="e.g. Goa" />
              </label>

              <label>
                Start Date
                <input type="date" />
              </label>

              <label>
                End Date
                <input type="date" />
              </label>

              <label>
                Travellers
                <select>
                  <option>1 Traveller</option>
                  <option>2 Travellers</option>
                  <option>3 Travellers</option>
                  <option>4 Travellers</option>
                  <option>5+ Travellers</option>
                </select>
              </label>

              <button className="btn btn-primary">Search</button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span>EXPLORE</span>
            <h2>Popular destinations</h2>
            <p>Places travellers are loving right now.</p>
          </div>

          <div className="destination-grid">
            {destinations.map((destination) => (
              <article className="destination-card" key={destination.id}>
                <div className="destination-image">
                  <span>{destination.emoji}</span>
                  <button className="heart">♡</button>
                </div>

                <div className="destination-info">
                  <h3>{destination.name}</h3>

                  <div className="location">
                    📍 {destination.country}
                  </div>

                  <p>{destination.description}</p>

                  <div className="destination-footer">
                    <span>★ {destination.rating}</span>

                    <a href={`#destination/${destination.id}`}>
                      Explore →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="center-button">
            <a href="#explore" className="btn btn-secondary">
              View All Destinations →
            </a>
          </div>
        </div>
      </section>

      <section className="section features-section">
        <div className="container">
          <div className="section-heading">
            <span>WHY TRIPEASE?</span>
            <h2>Everything you need for your trip</h2>
            <p>
              From planning to packing, TripEase keeps everything organized.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div>
              <span>READY TO TRAVEL?</span>
              <h2>Your next adventure starts here.</h2>
              <p>
                Explore destinations and start building your perfect trip.
              </p>
            </div>

            <a href="#explore" className="btn btn-white">
              Start Exploring →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;