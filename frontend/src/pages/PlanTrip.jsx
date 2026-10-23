import { useState } from "react";
import destinations from "../data/destinations";
import api from "../services/api";

function PlanTrip({ destinationId }) {
  const [destination, setDestination] = useState(() => {
    const id = String(destinationId ?? "").trim();
    const match = destinations.find((item) =>
      String(item.destinationId || item.id || "").trim() === id
    );
    return match ? String(match.destinationId || match.id) : "";
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!localStorage.getItem("tripease_token")) {
      sessionStorage.setItem(
        "tripease_after_login",
        window.location.hash.slice(1)
      );
      window.location.hash = "login";
      return;
    }

    const selected = destinations.find(
      (item) => String(item.destinationId || item.id) === destination
    );

    if (!selected) {
      setError("Please choose a destination from the list.");
      return;
    }

    if (!startDate || !endDate || endDate < startDate) {
      setError("Please enter valid dates. The end date must be on or after the start date.");
      return;
    }

    const budgetAmount = Number(budget);
    if (budget.trim() === "" || !Number.isFinite(budgetAmount) || budgetAmount <= 0) {
      setError("Please enter a budget greater than ₹0.");
      return;
    }

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const days = Math.floor((end - start) / 86400000) + 1;

    if (days < 1 || days > 30) {
      setError("Please choose a trip duration between 1 and 30 days.");
      return;
    }

    setLoading(true);

    try {
      const generated = await api.post("/ml/itinerary/generate", {
        destination_id: String(selected.destinationId || selected.id),
        days,
        budget_per_day: budgetAmount / days,
        travel_date: startDate,
      });
      const plan = generated?.data ?? generated;
      setGeneratedPlan(plan);

      if (
        !plan ||
        !Array.isArray(plan.itinerary) ||
        plan.itinerary.length === 0
      ) {
        throw new Error("The planner did not return an itinerary. No trip was saved.");
      }

      const tripResult = await api.post("/trips", {
        title: `Trip to ${selected.name}`,
        destination: selected.name,
        startDate,
        endDate,
        budget: budgetAmount,
      });

      const trip = tripResult?.data;

      if (!tripResult?.success || !trip?._id) {
        throw new Error("The trip could not be saved. Please try again.");
      }

      try {
        for (const day of plan.itinerary) {
          const rawActivities = Array.isArray(day.activities)
            ? day.activities
            : day.activity_name
              ? [day]
              : [];

          const activities = rawActivities.map((activity) => ({
            title: String(activity.activity_name || "Activity"),
            description: `${activity.activity_type || "Activity"}${
              activity.rating != null ? ` · Rating: ${activity.rating}` : ""
            }`,
            location: selected.name,
            duration: Number(activity.duration_hours) || 0,
            estimatedCost: Number(activity.estimated_activity_cost) || 0,
          }));

          if (activities.length === 0) continue;

          const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
          const dayDate = new Date(Date.UTC(
            startYear,
            startMonth - 1,
            startDay + (Number(day.day || 1) - 1)
          ));
          const itineraryDate = dayDate.toISOString().slice(0, 10);

          await api.post("/itinerary", {
            tripId: trip._id,
            day: Number(day.day) || 1,
            date: itineraryDate,
            activities,
          });
        }
      } catch (itineraryError) {
        try {
          await api.delete(`/trips/${trip._id}`);
        } catch {
          // Keep the original error; the user will be told the save was incomplete.
        }
        throw new Error(
          `The itinerary could not be saved, so the trip was rolled back where possible. ${itineraryError.message}`
        );
      }


    } catch (err) {
      setError(err.message || "Unable to generate and save your trip.");
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
          <p>Choose your destination and dates to generate a daily itinerary.</p>
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
            <select
              required
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginTop: "8px",
                padding: "12px",
              }}
            >
              <option value="">Choose a destination</option>
              {destinations.map((item) => {
                const id = String(item.destinationId || item.id || "");
                return (
                  <option key={id} value={id}>
                    {item.name}{item.state ? `, ${item.state}` : ""}
                  </option>
                );
              })}
            </select>
          </label>

          <label>
            Start date
            <input
              required
              type="date"
              min={new Date().toISOString().slice(0, 10)}
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
              min={startDate || new Date().toISOString().slice(0, 10)}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              style={{ display: "block", width: "100%", marginTop: "8px", padding: "12px" }}
            />
          </label>

          <label>
            Total budget (₹)
            <input
              required
              type="number"
              min="1"
              step="any"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              placeholder="Enter your total trip budget"
              style={{ display: "block", width: "100%", marginTop: "8px", padding: "12px" }}
            />
          </label>

          {error && <p role="alert">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Generating and saving itinerary..." : "Generate My Itinerary"}
          </button>

          <a href="#my-trips">Back to My Trips</a>
        </form>

        {generatedPlan && (
          <section
            aria-live="polite"
            style={{
              maxWidth: "850px",
              margin: "32px auto",
              padding: "24px",
              border: "1px solid #ddd",
              borderRadius: "12px",
            }}
          >
            <h2>Your Generated Itinerary</h2>
            <p>
              <strong>Destination:</strong>{" "}
              {generatedPlan.destination_name || "Selected destination"}
            </p>
            <p>
              <strong>Duration:</strong> {generatedPlan.days} days
            </p>

            {generatedPlan.itinerary.map((day, index) => (
              <article
                key={day.day || index}
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <h3>Day {day.day || index + 1}</h3>

                {Array.isArray(day.activities) && day.activities.length > 0 ? (
                  <ul>
                    {day.activities.map((activity, activityIndex) => (
                      <li key={activity.activity_id || activityIndex}>
                        <strong>
                          {activity.activity_name || "Activity"}
                        </strong>
                        {activity.activity_type
                          ? ` — ${activity.activity_type}`
                          : ""}
                        {activity.duration_hours != null
                          ? ` · ${activity.duration_hours} hours`
                          : ""}
                        {(activity.estimated_activity_cost ?? activity.avg_cost) != null
                          ? ` · ₹${Number(activity.estimated_activity_cost ?? activity.avg_cost).toLocaleString("en-IN")}`
                          : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No activity details were returned for this day.</p>
                )}

                <p>
                  <strong>Estimated activity cost:</strong>{" "}
                  ₹{Number(day.estimated_activity_cost || 0).toLocaleString("en-IN")}
                </p>
              </article>
            ))}

            <section
              aria-label="Estimated cost breakdown"
              style={{ marginTop: 24, padding: 20, border: "1px solid #ddd", borderRadius: 10 }}
            >
              <h3>Estimated cost breakdown</h3>
              {[
                ["Activities", generatedPlan.estimated_activity_total],
                ["Accommodation", generatedPlan.estimated_hotel_cost_for_trip],
                ["Food", generatedPlan.estimated_food_cost_for_trip],
                ["Local transport", generatedPlan.estimated_local_transport_cost_for_trip],
              ].map(([label, amount]) => amount != null && (
                <p key={label}>
                  <strong>{label}:</strong> ₹{Number(amount).toLocaleString("en-IN")}
                </p>
              ))}
            </section>

            {Array.isArray(generatedPlan.hotel_options) && generatedPlan.hotel_options.length > 0 && (
              <section style={{ marginTop: 24, padding: 20, border: "1px solid #ddd", borderRadius: 10 }}>
                <h3>Accommodation options</h3>
                <p>Sample-dataset options only; current prices and availability are not verified.</p>
                {generatedPlan.hotel_options.map((hotel, index) => (
                  <article key={`${hotel.hotel_name || "hotel"}-${index}`} style={{ padding: "12px 0", borderTop: "1px solid #eee" }}>
                    <h4>{hotel.hotel_name || "Accommodation option"}</h4>
                    <p>{hotel.hotel_type || "Stay"}{hotel.rating != null ? ` · ★ ${hotel.rating}` : ""}</p>
                    <p><strong>Estimated per night:</strong> ₹{Number(hotel.estimated_price_per_night || 0).toLocaleString("en-IN")}</p>
                    {hotel.distance_from_center_km != null && <p>{hotel.distance_from_center_km} km from the centre</p>}
                    {hotel.amenities && <p>{hotel.amenities}</p>}
                  </article>
                ))}
              </section>
            )}

            {Array.isArray(generatedPlan.intercity_transport_options) && generatedPlan.intercity_transport_options.length > 0 && (
              <section style={{ marginTop: 24, padding: 20, border: "1px solid #ddd", borderRadius: 10 }}>
                <h3>Intercity transport estimates</h3>
                <p>These are dataset estimates, not live timetables, ticket prices, or bookings.</p>
                {generatedPlan.intercity_transport_options.map((route, index) => (
                  <article key={`${route.transport_mode || "transport"}-${index}`} style={{ padding: "12px 0", borderTop: "1px solid #eee" }}>
                    <h4>{route.transport_mode || "Transport option"}</h4>
                    <p>From {route.origin_city || "origin not specified"}{route.estimated_duration_hours != null ? ` · ${route.estimated_duration_hours} hours` : ""}{route.distance_km != null ? ` · ${route.distance_km} km` : ""}</p>
                    <p><strong>Estimated fare:</strong> ₹{Number(route.estimated_cost || 0).toLocaleString("en-IN")}</p>
                  </article>
                ))}
              </section>
            )}

            <h3>
              Estimated total (excluding intercity travel):{" "}
              ₹{Number(
                generatedPlan.estimated_trip_total_excluding_intercity_travel || 0
              ).toLocaleString("en-IN")}
            </h3>

            <p>
              {generatedPlan.data_notice || "Costs are estimates from the project's sample datasets, not live prices or confirmed bookings."}
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                window.location.hash = "my-trips";
              }}
            >
              View My Trips
            </button>
          </section>
        )}
      </div>
    </section>
  );
}

export default PlanTrip;




