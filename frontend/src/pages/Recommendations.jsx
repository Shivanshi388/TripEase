import { useState } from "react";
import api from "../services/api";
import destinations from "../data/destinations";

const interestsList = ["Nature", "Adventure", "Beaches", "Culture", "Food", "Shopping"];

function Recommendations() {
  const [tab, setTab] = useState("personalized");
  const [form, setForm] = useState({
    budget: "15000",
    duration: "3",
    travellers: "2",
    interests: ["Nature", "Culture"],
    category: "",
    max_daily_cost: "5000",
    season: "",
    destination_id: "",
    days: "3",
    travelers: "2",
    budget_per_day: "3000",
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm((old) => ({ ...old, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResults(null);

    const requests = {
      personalized: [
        "/ml/recommendations/personalized",
        {
          budget: Number(form.budget),
          duration: Number(form.duration),
          travellers: Number(form.travellers),
          interests: form.interests,
        },
      ],
      filter: [
        "/ml/recommendations/filter",
        {
          category: form.category || null,
          max_daily_cost: form.max_daily_cost ? Number(form.max_daily_cost) : null,
          season: form.season || null,
          top_n: 5,
        },
      ],
      itinerary: [
        "/ml/itinerary/generate",
        {
          destination_id: form.destination_id.trim(),
          days: Number(form.days),
          budget_per_day: form.budget_per_day ? Number(form.budget_per_day) : null,
        },
      ],
      budget: [
        "/ml/budget/predict",
        {
          destination_id: form.destination_id.trim(),
          days: Number(form.days),
          travelers: Number(form.travelers),
        },
      ],
    };

    try {
      const [url, body] = requests[tab];
      const response = await api.post(url, body);
      setResults(response.data ?? response);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "The request failed. Check that the backend and ML service are running."
      );
    } finally {
      setLoading(false);
    }
  }

  function renderData(value, label = "") {
    const money = (amount) =>
      typeof amount === "number"
        ? new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(amount)
        : String(amount ?? "—");

    const destinationFor = (item) => {
      const id = String(item?.destination_id || item?.destinationId || item?.id || "").toUpperCase();
      const name = String(item?.destination || item?.destination_name || item?.name || "").toLowerCase();

      return destinations.find((destination) =>
        (id && [destination.id, destination.destinationId].some(
          (candidate) => String(candidate).toUpperCase() === id
        )) ||
        (name && destination.name.toLowerCase() === name)
      );
    };

    if (value == null) return <p>No result returned.</p>;

    if (Array.isArray(value)) {
      if (!value.length) return <p>No results found. Try adjusting your preferences.</p>;

      return (
        <div className="te-result-list">
          {value.map((item, index) => (
            <div key={item?.destination_id || item?.id || index}>
              {renderData(item, "")}
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === "object") {
      // Render destination recommendations as image-led cards.
      if (Array.isArray(value.recommendations)) {
        return (
          <div>
            {typeof value.count === "number" && (
              <p className="te-muted">{value.count} destination matches found</p>
            )}
            <div className="te-destination-grid">
              {value.recommendations.map((item, index) => {
                const destination = destinationFor(item);
                const score = typeof item.score === "number" ? item.score : null;

                return (
                  <article className="te-destination-card" key={item.destination_id || item.id || index}
                    style={{ padding: 0, overflow: "hidden" }}>
                    {destination?.imageUrl || destination?.image ? (
                      <img
                        src={destination.imageUrl || destination.image}
                        alt={destination.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                        style={{ width: "100%", height: 185, objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <div style={{ height: 90, background: "linear-gradient(120deg,#dbeafe,#e0e7ff)" }} />
                    )}
                    <div style={{ padding: 20 }}>
                      <div className="te-card-top">
                        <span className="te-rank">#{index + 1} Match</span>
                        {score !== null && <span className="te-score">Score: {score.toFixed(3)}</span>}
                      </div>
                      <h3>{destination?.name || item.destination || item.name || "Recommended destination"}</h3>
                      {destination && (
                        <>
                          <p className="te-muted">{destination.state} · {destination.category}</p>
                          <p>{destination.description}</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "12px 0" }}>
                            <span className="te-rank">★ {destination.rating}</span>
                            <span className="te-rank">Best: {destination.bestTime}</span>
                          </div>
                          <p><strong>Dataset daily estimate:</strong> {money(destination.averageCost)}</p>
                        </>
                      )}
                      {item.destination_id && (
                        <p className="te-muted">Destination ID: {item.destination_id}</p>
                      )}
                      {score !== null && (
                        <>
                          <div className="te-score-track">
                            <div className="te-score-fill"
                              style={{ width: `${Math.max(0, Math.min(100, score * 100))}%` }} />
                          </div>
                          <p className="te-muted">Recommendation score</p>
                        </>
                      )}
                      {Object.entries(item)
                        .filter(([key]) => ![
                          "destination", "name", "destination_id", "destination_name",
                          "destinationId", "score"
                        ].includes(key))
                        .map(([key, val]) => (
                          <p className="te-detail" key={key}>
                            <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                            {val !== null && typeof val === "object" ? JSON.stringify(val) : String(val ?? "—")}
                          </p>
                        ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        );
      }

      // Render the complete generated itinerary and its dataset-based estimates.
      if (Array.isArray(value.itinerary)) {
        const hasDailyActivities = value.itinerary.some(
          (day) => Array.isArray(day.activities)
        );

        return (
          <div>
            <div className="te-data-card">
              <span className="te-results-eyebrow">YOUR ROUTE</span>
              <h3 style={{ marginTop: 8 }}>
                {value.destination_name || value.destination_id || "Generated itinerary"}
              </h3>
              <p className="te-muted">
                {value.days || value.itinerary.length} day(s) ·
                {" "}Activities selected from the project dataset
              </p>
              <p>
                <strong>Estimated activities:</strong>{" "}
                {money(value.estimated_activity_total)}
              </p>
              {value.estimated_hotel_cost_for_trip != null && (
                <p>
                  <strong>Estimated accommodation:</strong>{" "}
                  {money(value.estimated_hotel_cost_for_trip)}
                </p>
              )}
              {value.estimated_food_cost_for_trip != null && (
                <p>
                  <strong>Estimated food:</strong>{" "}
                  {money(value.estimated_food_cost_for_trip)}
                </p>
              )}
              {value.estimated_local_transport_cost_for_trip != null && (
                <p>
                  <strong>Estimated local transport:</strong>{" "}
                  {money(value.estimated_local_transport_cost_for_trip)}
                </p>
              )}
              {value.estimated_trip_total_excluding_intercity_travel != null && (
                <p>
                  <strong>Estimated trip total (excluding intercity travel):</strong>{" "}
                  {money(value.estimated_trip_total_excluding_intercity_travel)}
                </p>
              )}
            </div>

            <div className="te-destination-grid">
              {value.itinerary.map((day, index) => {
                const activities = Array.isArray(day.activities)
                  ? day.activities
                  : [day];

                return (
                  <article className="te-destination-card" key={day.day || index}>
                    <span className="te-rank">DAY {day.day || index + 1}</span>

                    {activities.length === 0 ? (
                      <p className="te-muted">
                        No activities available for this day in the dataset.
                      </p>
                    ) : (
                      activities.map((activity, activityIndex) => (
                        <div
                          key={activity.activity_id || `${day.day || index}-${activityIndex}`}
                          style={{
                            padding: "12px 0",
                            borderBottom: activityIndex < activities.length - 1
                              ? "1px solid #e5e7eb"
                              : "none"
                          }}
                        >
                          <h3>{activity.activity_name || "Activity"}</h3>
                          <p className="te-muted">
                            {activity.activity_type || "Activity details"}
                          </p>
                          <div className="te-data-row">
                            <span className="te-data-label">Estimated cost</span>
                            <strong>{money(activity.estimated_activity_cost)}</strong>
                          </div>
                          {activity.duration_hours != null && (
                            <div className="te-data-row">
                              <span className="te-data-label">Duration</span>
                              <span>{activity.duration_hours} hours</span>
                            </div>
                          )}
                          {activity.rating != null && (
                            <div className="te-data-row">
                              <span className="te-data-label">Activity rating</span>
                              <span>★ {activity.rating}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}

                    {day.total_duration_hours != null && (
                      <p className="te-muted">
                        Total planned activity time: {day.total_duration_hours} hours
                      </p>
                    )}
                    {day.estimated_activity_cost != null && hasDailyActivities && (
                      <p>
                        <strong>Day estimate:</strong>{" "}
                        {money(day.estimated_activity_cost)}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>

            {Array.isArray(value.hotel_options) && value.hotel_options.length > 0 && (
              <section className="te-data-card" style={{ marginTop: 20 }}>
                <h3>Accommodation options</h3>
                <p className="te-muted">
                  Dataset estimates only; current prices and availability are not verified.
                </p>
                {value.hotel_options.map((hotel, index) => (
                  <div key={`${hotel.hotel_name || "hotel"}-${index}`} style={{ padding: "12px 0" }}>
                    <h4>{hotel.hotel_name}</h4>
                    <p className="te-muted">
                      {hotel.hotel_type}
                      {hotel.distance_from_center_km != null
                        ? ` · ${hotel.distance_from_center_km} km from centre`
                        : ""}
                    </p>
                    <p>
                      <strong>Per night:</strong>{" "}
                      {money(hotel.estimated_price_per_night)}
                      {hotel.rating != null ? ` · ★ ${hotel.rating}` : ""}
                    </p>
                    {hotel.amenities && <p className="te-muted">{hotel.amenities}</p>}
                  </div>
                ))}
              </section>
            )}

            {Array.isArray(value.intercity_transport_options) &&
              value.intercity_transport_options.length > 0 && (
                <section className="te-data-card" style={{ marginTop: 20 }}>
                  <h3>Intercity transport estimates</h3>
                  <p className="te-muted">
                    These are dataset estimates, not live schedules, ticket prices, or bookings.
                  </p>
                  {value.intercity_transport_options.map((route, index) => (
                    <div key={`${route.transport_mode || "route"}-${index}`} style={{ padding: "12px 0" }}>
                      <h4>{route.transport_mode || "Transport"}</h4>
                      <p className="te-muted">
                        From {route.origin_city || "origin not specified"}
                        {route.estimated_duration_hours != null
                          ? ` · ${route.estimated_duration_hours} hours`
                          : ""}
                        {route.distance_km != null ? ` · ${route.distance_km} km` : ""}
                      </p>
                      <p>
                        <strong>Estimated fare:</strong> {money(route.estimated_cost)}
                      </p>
                    </div>
                  ))}
                </section>
              )}

            <p className="te-muted" style={{ marginTop: 16 }}>
              {value.data_notice ||
                "All costs are estimates from the project's datasets. They are not live prices, verified availability, or bookings. Metro routes and live transit schedules are not supplied by this response."}
            </p>
          </div>
        );
      }
      // Give the predicted total visual priority without inventing categories.
      if (value.predicted_budget != null) {
        const destination = destinationFor(value);
        return (
          <div>
            <article className="te-data-card" style={{
              padding: 28,
              background: "linear-gradient(135deg,#eff6ff,#f5f3ff)",
              borderRadius: 20
            }}>
              <span className="te-results-eyebrow">ESTIMATED TRIP BUDGET</span>
              <h3 style={{ fontSize: "clamp(2rem,5vw,3rem)", margin: "12px 0", color: "#18345e" }}>
                {money(Number(value.predicted_budget))}
              </h3>
              <p className="te-muted">
                {destination?.name || value.destination_id || "Selected destination"}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                {value.days != null && <span className="te-rank">{value.days} days</span>}
                {value.travelers != null && <span className="te-rank">{value.travelers} traveller(s)</span>}
              </div>
            </article>
            <p className="te-muted">
              This is the model's total estimate. The service does not return a category-by-category breakdown here.
            </p>
            {Object.entries(value)
              .filter(([key]) => !["predicted_budget", "destination_id", "days", "travelers"].includes(key))
              .map(([key, val]) => (
                <div className="te-data-row" key={key}>
                  <span className="te-data-label">{key.replace(/_/g, " ")}</span>
                  <span>{val !== null && typeof val === "object" ? JSON.stringify(val) : String(val ?? "—")}</span>
                </div>
              ))}
          </div>
        );
      }

      return (
        <div className="te-data-card">
          {label && <h3>{label.replace(/_/g, " ")}</h3>}
          {Object.entries(value).map(([key, val]) => (
            <div className="te-data-row" key={key}>
              <span className="te-data-label">{key.replace(/_/g, " ")}</span>
              <div className="te-data-value">
                {val !== null && typeof val === "object"
                  ? renderData(val, key)
                  : String(val ?? "—")}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <span>{String(value)}</span>;
  }

  return (
    <section className="page-section">
      <style>{
        `.te-results-section { margin: 34px 0 20px; } .te-results-heading { margin-bottom: 22px; } .te-results-eyebrow { color: #5487d9; font-size: .76rem; font-weight: 800; letter-spacing: .12em; } .te-results-heading h2 { color: #18345e; margin: 7px 0; font-size: clamp(1.5rem, 3vw, 2rem); } .te-results-heading p, .te-muted { color: #6b7c93; } .te-destination-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(225px, 1fr)); gap: 18px; } .te-destination-card, .te-data-card { min-width: 0; padding: 22px; border: 1px solid #e1eaf5; border-radius: 18px; background: linear-gradient(145deg, #fff, #f5f9ff); box-shadow: 0 8px 25px rgba(40, 75, 120, .07); } .te-card-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; } .te-rank { padding: 6px 11px; border-radius: 20px; background: #e8edff; color: #465ec2; font-weight: 800; } .te-score { padding: 6px 10px; border-radius: 20px; background: #def7ed; color: #087f65; font-size: .88rem; font-weight: 700; } .te-destination-card h3 { margin: 17px 0 8px; color: #18345e; font-size: 1.25rem; overflow-wrap: anywhere; } .te-muted { font-size: .88rem; overflow-wrap: anywhere; } .te-score-track { height: 7px; margin-top: 17px; background: #e6edf6; border-radius: 10px; overflow: hidden; } .te-score-fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg, #67bce9, #818cf8); } .te-detail { font-size: .9rem; color: #4d6078; overflow-wrap: anywhere; } .te-data-card { margin-bottom: 16px; } .te-data-row { display: grid; grid-template-columns: minmax(110px, 30%) minmax(0, 1fr); gap: 12px; padding: 12px 0; border-bottom: 1px solid #e8eef6; } .te-data-row:last-child { border-bottom: 0; } .te-data-label { color: #526983; font-weight: 700; text-transform: capitalize; } .te-data-value { min-width: 0; color: #243b59; overflow-wrap: anywhere; } .te-data-value .te-data-card { margin: 8px 0; padding: 12px; box-shadow: none; } .te-result-list { display: grid; gap: 14px; } @media (max-width: 520px) { .te-data-row { grid-template-columns: 1fr; gap: 5px; } .te-destination-card, .te-data-card { padding: 17px; } }`
      }</style>
      <div className="container">
        <div className="page-header">
          <span>TRIPEASE SMART TRAVEL</span>
          <h1>Travel Recommendations</h1>
          <p>Find destinations, personalise your suggestions, plan an itinerary, or estimate your trip budget.</p>
        </div>

        <div className="recommendation-grid" style={{ marginBottom: 24 }}>
          {[
            ["personalized", "For You", "Recommendations based on your budget and interests"],
            ["filter", "Find Destinations", "Filter destination suggestions by preferences"],
            ["itinerary", "Generate Itinerary", "Create a day-by-day plan for a destination"],
            ["budget", "Predict Budget", "Estimate the total trip budget"],
          ].map(([id, title, description]) => (
            <button
              type="button"
              key={id}
              className="recommendation-card"
              onClick={() => { setTab(id); setResults(null); setError(""); }}
              aria-pressed={tab === id}
              style={{ cursor: "pointer", textAlign: "left", border: tab === id ? "2px solid #4f46e5" : undefined }}
            >
              <h2>{title}</h2>
              <p>{description}</p>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="form-card" style={{ maxWidth: 720, margin: "0 auto 28px" }}>
          {tab === "personalized" && (
            <>
              <h2>Personalise your recommendations</h2>
              <label>Budget (₹)<input type="number" min="1" required value={form.budget} onChange={e => update("budget", e.target.value)} /></label>
              <label>Trip duration (days)<input type="number" min="1" required value={form.duration} onChange={e => update("duration", e.target.value)} /></label>
              <label>Number of travellers<input type="number" min="1" required value={form.travellers} onChange={e => update("travellers", e.target.value)} /></label>
              <fieldset>
                <legend>Interests</legend>
                {interestsList.map(item => (
                  <label key={item} style={{ display: "inline-flex", gap: 6, margin: 8 }}>
                    <input type="checkbox" checked={form.interests.includes(item)} onChange={e => update("interests", e.target.checked ? [...form.interests, item] : form.interests.filter(x => x !== item))} />
                    {item}
                  </label>
                ))}
              </fieldset>
            </>
          )}

          {tab === "filter" && (
            <>
              <h2>Find destinations</h2>
              <label>Category (optional)<input value={form.category} onChange={e => update("category", e.target.value)} placeholder="e.g. beach, nature, adventure" /></label>
              <label>Maximum daily cost (₹)<input type="number" min="1" value={form.max_daily_cost} onChange={e => update("max_daily_cost", e.target.value)} /></label>
              <label>Season (optional)<input value={form.season} onChange={e => update("season", e.target.value)} placeholder="e.g. summer, winter" /></label>
            </>
          )}

          {(tab === "itinerary" || tab === "budget") && (
            <>
              <h2>{tab === "itinerary" ? "Generate an itinerary" : "Predict your budget"}</h2>
              <label>Choose destination
                <select required value={form.destination_id} onChange={e => update("destination_id", e.target.value)}>
                  <option value="">Select a destination</option>
                  {destinations.map((destination) => {
                    const id = String(destination.destinationId || destination.destination_id || destination.id || "");
                    return id ? <option key={id} value={id}>{destination.name}</option> : null;
                  })}
                </select>
              </label>
              <label>Number of days<input type="number" min="1" max={tab === "itinerary" ? 30 : undefined} required value={form.days} onChange={e => update("days", e.target.value)} /></label>
              {tab === "itinerary" ? (
                <label>Daily budget (₹, optional)<input type="number" min="1" value={form.budget_per_day} onChange={e => update("budget_per_day", e.target.value)} /></label>
              ) : (
                <label>Number of travellers<input type="number" min="1" required value={form.travelers} onChange={e => update("travelers", e.target.value)} /></label>
              )}
            </>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Working..." : "Get Results"}
          </button>
        </form>

        {error && <div role="alert" className="error-message">{error}</div>}
        {results !== null && (
          <section className="te-results-section" aria-live="polite">
            <div className="te-results-heading">
              <span className="te-results-eyebrow">YOUR TRIP, YOUR WAY</span>
              <h2>
                {tab === "personalized" ? "Your recommendations" :
                 tab === "filter" ? "Destination matches" :
                 tab === "itinerary" ? "Your itinerary" : "Your budget estimate"}
              </h2>
              <p>Results from your TripEase travel service</p>
            </div>
            {renderData(results)}
          </section>
        )}
      </div>
    </section>
  );
}

export default Recommendations;
