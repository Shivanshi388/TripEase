function MyTrips() {
  return (
    <section className="page-section">
      <div className="container">
        <div className="page-header">
          <span>TRIP MANAGEMENT</span>
          <h1>My Trips</h1>
          <p>Plan and manage all your adventures in one place.</p>
        </div>

        <div className="trip-planning-card">
          <div>
            <span className="planning-icon">🗺️</span>
            <h2>Plan your next adventure</h2>
            <p>
              Choose a destination and TripEase will help you organize your
              journey.
            </p>
          </div>

          <a href="#explore" className="btn btn-primary">
            Start Planning →
          </a>
        </div>

        <div className="empty-state small">
          <div>🧳</div>
          <h2>No trips yet</h2>
          <p>Your planned trips will appear here.</p>
        </div>
      </div>
    </section>
  );
}

export default MyTrips;