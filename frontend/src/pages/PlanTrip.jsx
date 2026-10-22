import { useState } from "react";
import destinations from "../data/destinations";
import api from "../services/api";

function PlanTrip({ destinationId }) {
  const initialDestination = destinations.find(
    (item) => item.id === Number(destinationId)
  );

  const [destination, setDestination] = useState(initialDestination?.name ?? "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!localStorage.getItem("tripease_token")) {
      const returnRoute = window.location.hash.slice(1);
      sessionStorage.setItem("tripease_after_login", returnRoute);
      window.location.hash = "login";
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date must be on or after the start date.");
      return;
    }

    const selectedDestination = destination.trim();
    if (!selectedDestination) {
      setError("Please enter a destination.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.post("/trips", {
        title: `Trip to ${selectedDestination}`,
        destination: selectedDestination,
        startDate,
        endDate,
        budget: Number(budget),
      });

      if (!result.success) {
        throw new Error(result.message || "Trip could not be saved.");
      }

      setMessage("Trip saved successfully! Opening My Trips...");
      window.location.hash = "my-trips";
    } catch (err) {
      setError(err.message || "Unable to save your trip.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-header">
          <span>YOUR NEXT ADVENTURE</span>
          <h1>Plan a Trip</h1>
          <p>Start organizing your next journey.</p>
        </div>

        <form
          className="trip-planning-card"
          onSubmit={handleSubmit}
          style={{
            maxWidth: "650px",
            margin: "0 auto",
            display: "grid",
            gap: "18px",
          }}
        >
          <label>
            Destination
            <input
              required
              maxLength={150}
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Where would you like to go?"
              style={{ display: "block", width: "100%", marginTop: "8px", padding: "12px" }}
            />
          </label>

          <label>
            Start date
            <input
              required
              type="date"
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value);
                if (endDate && event.target.value > endDate) setEndDate("");
              }}
              style={{ display: "block", width: "100%", marginTop: "8px", padding: "12px" }}
            />
          </label>

          <label>
            End date
            <input
              required
              type="date"
              min={startDate || undefined}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              style={{ display: "block", width: "100%", marginTop: "8px", padding: "12px" }}
            />
          </label>

          <label>
            Budget (₹)
            <input
              required
              type="number"
              min="0"
              step="any"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              placeholder="Enter your budget"
              style={{ display: "block", width: "100%", marginTop: "8px", padding: "12px" }}
            />
          </label>

          {error && <p role="alert">{error}</p>}
          {message && <p role="status">{message}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving trip..." : "Continue Planning"}
          </button>

          <a href="#my-trips">Back to My Trips</a>
        </form>
      </div>
    </section>
  );
}

export default PlanTrip;
