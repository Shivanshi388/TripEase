import { useCallback, useEffect, useState } from "react";
import { MapPinned, Luggage, CalendarDays, Wallet, ArrowRight, Compass, Eye, Pencil, Trash2 } from "lucide-react";
import api from "../services/api";

const destinationPhotos = {
  jaipur: "photo-1599661046827-dacff0c0f09a",
  goa: "photo-1512343879784-a960bf40e7f2",
  manali: "photo-1626621341517-bbf3d9990a23",
  shimla: "photo-1597074866923-dc0589150358",
  udaipur: "photo-1590050752117-238cb0fb12b1",
  kerala: "photo-1602216056096-3b40cc0c9944",
  amritsar: "photo-1567539568395-8f2f7b5f2e4b",
  agra: "photo-1564507592333-c60657eea523",
  varanasi: "photo-1561361513-2d000a50f0dc",
  mumbai: "photo-1570168007204-dfb528c6958f",
  delhi: "photo-1587474260584-136574528ed5",
  srinagar: "photo-1595815771614-ade9d652a65d",
  default: "photo-1464822759023-fed622ff2c3b",
};

function photoFor(destination = "") {
  const key = Object.keys(destinationPhotos).find(
    (name) => name !== "default" && destination.toLowerCase().includes(name)
  );
  return `https://images.unsplash.com/${destinationPhotos[key || "default"]}?auto=format&fit=crop&w=1100&q=85`;
}

function formatDate(value) {
  if (!value) return "Date not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date not set"
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTrip, setExpandedTrip] = useState(null);
  const [clearingTrips, setClearingTrips] = useState(false);
  const [selectedTripIds, setSelectedTripIds] = useState([]);
  const [deletingSelectedTrips, setDeletingSelectedTrips] = useState(false);

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

  const toggleTripSelection = useCallback((tripId, checked) => {
    const normalizedId = String(tripId);
    setSelectedTripIds((current) => checked
      ? (current.includes(normalizedId) ? current : [...current, normalizedId])
      : current.filter((id) => id !== normalizedId));
  }, []);

  const toggleAllTripSelection = useCallback((checked) => {
    setSelectedTripIds(checked
      ? trips.map((trip) => String(trip._id || trip.id || trip.title))
      : []);
  }, [trips]);

  const deleteSelectedTrips = useCallback(async () => {
    if (!selectedTripIds.length || deletingSelectedTrips) return;

    const selectedTrips = trips.filter((trip) =>
      selectedTripIds.includes(String(trip._id || trip.id || trip.title))
    );
    if (!selectedTrips.length) {
      setSelectedTripIds([]);
      return;
    }

    const tripsWithoutIds = selectedTrips.filter((trip) => !(trip._id || trip.id));
    if (tripsWithoutIds.length) {
      setError("Unable to delete the selected trips because at least one trip is missing its ID.");
      return;
    }

    const confirmed = window.confirm(
      `Permanently delete ${selectedTrips.length} selected trip${selectedTrips.length === 1 ? "" : "s"}? Associated itinerary and expense records may also be deleted. This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingSelectedTrips(true);
    setError("");
    const deletedIds = [];
    try {
      for (const trip of selectedTrips) {
        const tripId = trip._id || trip.id;
        await api.delete(`/trips/${encodeURIComponent(tripId)}`);
        deletedIds.push(String(tripId));
      }
      setTrips((current) => current.filter((trip) =>
        !deletedIds.includes(String(trip._id || trip.id || trip.title))
      ));
      setSelectedTripIds([]);
      setExpandedTrip(null);
    } catch (err) {
      setSelectedTripIds((current) => current.filter((id) => !deletedIds.includes(id)));
      try {
        const result = await api.get("/trips");
        setTrips(Array.isArray(result.data) ? result.data : []);
      } catch {
        // Keep the existing list and show the deletion error below.
      }
      setError(
        deletedIds.length
          ? `Deleted ${deletedIds.length} of ${selectedTrips.length} selected trips. ${err.message || "A later deletion failed."}`
          : (err.message || "Unable to delete the selected trips.")
      );
    } finally {
      setDeletingSelectedTrips(false);
    }
  }, [selectedTripIds, deletingSelectedTrips, trips]);

  const clearAllTrips = useCallback(async () => {
    if (!trips.length || clearingTrips) return;

    const confirmed = window.confirm(
      `Remove all ${trips.length} trips from My Trips? This permanently deletes these saved trips and their associated expenses and itineraries. This action cannot be undone.`
    );
    if (!confirmed) return;

    const tripIds = trips.map((trip) => trip._id || trip.id);
    if (tripIds.some((id) => !id)) {
      setError("Unable to remove all trips because at least one trip is missing its ID.");
      return;
    }

    setClearingTrips(true);
    setError("");
    let deletedCount = 0;

    try {
      // Use the existing per-trip endpoint so each deletion stays scoped to this signed-in user.
      for (const tripId of tripIds) {
        await api.delete(`/trips/${encodeURIComponent(tripId)}`);
        deletedCount += 1;
      }

      setTrips([]);
      setExpandedTrip(null);
    } catch (err) {
      const requestMessage = err.message || "Unable to remove your trips.";
      // Refresh in case some earlier deletions succeeded before a later request failed.
      try {
        const result = await api.get("/trips");
        setTrips(Array.isArray(result.data) ? result.data : []);
      } catch {
        // Keep the current list visible through the existing error state if refresh also fails.
      }
      setError(
        deletedCount > 0
          ? `Removed ${deletedCount} of ${tripIds.length} trips. ${requestMessage}`
          : requestMessage
      );
    } finally {
      setClearingTrips(false);
    }
  }, [trips, clearingTrips]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  return (
    <section className="page-section my-trips-page">
      <div className="container">
        <header className="my-trips-hero">
          <div className="my-trips-hero-copy">
            <span className="my-trips-eyebrow"><Compass size={15} /> YOUR TRAVEL JOURNAL</span>
            <h1>Your next story starts <em>here.</em></h1>
            <p>Keep every getaway, plan, and travel memory together.</p>
            <a href="#plan-trip" className="my-trips-primary">Plan an adventure <ArrowRight size={17} /></a>
          </div>
          <div className="my-trips-hero-photo" role="img" aria-label="Scenic mountain travel destination" />
        </header>

        <div className="my-trips-section-heading">
          <div>
            <span className="my-trips-eyebrow">THE COLLECTION</span>
            <h2>My trips <span>{trips.length}</span></h2>
          </div>
          <div className="my-trips-heading-actions">
            {trips.length > 0 && (
              <>
                <label className="my-trips-select-all">
                  <input
                    type="checkbox"
                    checked={trips.length > 0 && selectedTripIds.length === trips.length}
                    onChange={(event) => toggleAllTripSelection(event.target.checked)}
                    disabled={loading || deletingSelectedTrips || clearingTrips}
                  />
                  Select all
                </label>
                {selectedTripIds.length > 0 && (
                  <button
                    type="button"
                    className="my-trips-danger"
                    onClick={deleteSelectedTrips}
                    disabled={deletingSelectedTrips || clearingTrips || loading}
                  >
                    <Trash2 size={16} /> {deletingSelectedTrips ? "Deleting selected..." : `Delete selected (${selectedTripIds.length})`}
                  </button>
                )}
                <button
                  type="button"
                  className="my-trips-danger"
                  onClick={clearAllTrips}
                  disabled={clearingTrips || deletingSelectedTrips || loading}
                >
                  <Trash2 size={16} /> {clearingTrips ? "Removing trips..." : "Remove all trips"}
                </button>
              </>
            )}
            <a href="#explore" className="my-trips-text-link">Discover places <ArrowRight size={16} /></a>
          </div>
        </div>

        {loading ? (
          <div className="my-trips-message" role="status">Gathering your adventures...</div>
        ) : error ? (
          <div className="my-trips-message" role="alert">
            <p>{error}</p>
            <button className="my-trips-secondary" onClick={loadTrips}>Try again</button>
            <a href="#login">Log in</a>
          </div>
        ) : trips.length === 0 ? (
          <div className="my-trips-empty">
            <div className="my-trips-empty-icon"><Luggage size={34} /></div>
            <h2>Your travel story is waiting</h2>
            <p>Your saved trips will appear here. Start with a destination that inspires you.</p>
            <a href="#explore" className="my-trips-primary">Explore destinations <ArrowRight size={17} /></a>
          </div>
        ) : (
          <div className="my-trips-grid">
            {trips.map((trip) => {
              const id = trip._id || trip.id || trip.title;
              const destination = trip.destination || "Your destination";
              const budget = Number(trip.budget);
              const hasBudget = trip.budget !== "" && trip.budget != null && Number.isFinite(budget);
              const expanded = expandedTrip === id;

              return (
                <article className="my-trip-card" key={id}>
                  <label className="my-trip-select">
                    <input
                      type="checkbox"
                      checked={selectedTripIds.includes(String(id))}
                      onChange={(event) => toggleTripSelection(id, event.target.checked)}
                      disabled={deletingSelectedTrips || clearingTrips || loading}
                      aria-label={`Select trip to ${destination}`}
                    />
                    <span>Select trip</span>
                  </label>
                  <div className="my-trip-photo-wrap">
                    <img
                      className="my-trip-photo"
                      src={photoFor(destination)}
                      alt={`Scenery in ${destination}`}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = photoFor("default");
                      }}
                    />
                    <span className="my-trip-status">{trip.status || "Planned"}</span>
                  </div>
                  <div className="my-trip-card-body">
                    <span className="my-trip-location"><MapPinned size={15} /> {destination}</span>
                    <h3>{trip.title || `A trip to ${destination}`}</h3>
                    <div className="my-trip-meta">
                      <div><CalendarDays size={17} /><span>{formatDate(trip.startDate)}<small>to {formatDate(trip.endDate)}</small></span></div>
                      <div><Wallet size={17} /><span>{hasBudget ? `₹${budget.toLocaleString("en-IN")}` : "Not set"}<small>Trip budget</small></span></div>
                    </div>
                    <div className="my-trip-actions">
                      <button
                        className="my-trips-primary my-trip-view"
                        onClick={() => setExpandedTrip(expanded ? null : id)}
                        aria-expanded={expanded}
                      >
                        <Eye size={16} /> {expanded ? "Hide plan" : "View plan"}
                      </button>
                      <a className="my-trip-edit" href="#plan-trip" aria-label={`Plan a trip to ${destination}`}>
                        <Pencil size={16} /> Plan trip
                      </a>
                    </div>
                    {expanded && (
                      <div className="my-trip-details">
                        <strong>Trip overview</strong>
                        <p>Destination: {destination}</p>
                        <p>Departure: {formatDate(trip.startDate)}</p>
                        <p>Return: {formatDate(trip.endDate)}</p>
                        <p>Budget: {hasBudget ? `₹${budget.toLocaleString("en-IN")}` : "Not set"}</p>
                        <a href={`#explore?destination=${encodeURIComponent(destination)}`}>Explore attractions in {destination} <ArrowRight size={14} /></a>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyTrips;

