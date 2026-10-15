import { useCallback, useEffect, useState } from "react";
import { MapPinned, Luggage } from "lucide-react";
import api from "../services/api";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTrips = useCallback(async () => {
    setError("");
    setLoading(true);

    if (!localStorage.getItem("tripease_token")) {
      setTrips([]);
      setLoading(false);
      return;
    }

    try {
      const result = await api.get("/trips");
      setTrips(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message || "Unable to load your trips.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

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
            <MapPinned size={42} strokeWidth={1.8} aria-hidden="true" />
            <h2>Plan your next adventure</h2>
            <p>Choose a destination and organize your journey.</p>
          </div>
          <a href="#plan-trip" className="btn btn-primary">Start Planning →</a>
        </div>

        {loading ? (
          <p role="status">Loading your trips...</p>
        ) : error ? (
          <div className="empty-state small">
            <p role="alert">{error}</p>
            <button className="btn btn-secondary" onClick={loadTrips}>Try again</button>
            <a href="#login">Log in</a>
          </div>
        ) : trips.length === 0 ? (
          <div className="empty-state small">
            <Luggage size={56} strokeWidth={1.5} aria-hidden="true" />
            <h2>No trips yet</h2>
            <p>Your saved trips will appear here.</p>
            <a href="#explore" className="btn btn-secondary">Explore Destinations</a>
          </div>
        ) : (
          <div className="destination-grid">
            {trips.map((trip) => (
              <article className="destination-card" key={trip._id || trip.id}>
                <div className="destination-content">
                  <h3>{trip.title || `Trip to ${trip.destination}`}</h3>
                  <p>{trip.destination}</p>
                  <p>
                    {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "Start date not set"}
                    {" – "}
                    {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : "End date not set"}
                  </p>
                  <p>Budget: ₹{Number(trip.budget).toLocaleString()}</p>
                  <span>{trip.status || "planned"}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyTrips;
