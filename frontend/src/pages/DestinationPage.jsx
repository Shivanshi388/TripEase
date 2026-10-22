import './DestinationPage.polish.css';
import { useCallback, useEffect, useState } from "react";
import { Heart, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import destinationService from "../services/destinationService";

function DestinationPage({ destination }) {
  const { user } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authReturnTo, setAuthReturnTo] = useState("");

  const loadDestination = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await destinationService.getDestinationById(destination);
      setPlace(result);
    } catch (err) {
      setPlace(null);
      setError(err.message || "Unable to load this destination.");
    } finally {
      setLoading(false);
    }
  }, [destination]);

  useEffect(() => {
    loadDestination();
  }, [loadDestination]);

  const isSaved = Boolean(
    place && wishlist.some((item) => String(item.id) === String(place.id))
  );

  const handlePlanTrip = () => {
    if (!place) return;
    if (!user) {
      setAuthReturnTo(`plan-trip/${place.id}`);
      setShowAuthPrompt(true);
      return;
    }
    window.location.hash = `plan-trip/${place.id}`;
  };

  const handleWishlist = async () => {
    if (!place) return;
    if (!user) {
      setAuthReturnTo("wishlist");
      setShowAuthPrompt(true);
      return;
    }

    setActionError("");
    setSaving(true);
    try {
      if (isSaved) {
        await removeFromWishlist(place.id);
      } else {
        await addToWishlist(place);
      }
    } catch (err) {
      setActionError(err.message || "Unable to update your wishlist.");
    } finally {
      setSaving(false);
    }
  };

  const goToAuth = (page) => {
    sessionStorage.setItem(
      "tripease_after_login",
      authReturnTo || (place ? `plan-trip/${place.id}` : "explore")
    );
    setShowAuthPrompt(false);
    window.location.hash = page;
  };

  if (loading) {
    return (
      <section className="page-section">
        <div className="container">
          <p role="status">Loading destination...</p>
        </div>
      </section>
    );
  }

  if (error || !place) {
    return (
      <section className="page-section">
        <div className="container">
          <h1>Destination unavailable</h1>
          <p role="alert">{error || "We couldn't find this destination."}</p>
          <button type="button" className="btn btn-primary" onClick={loadDestination}>
            Try Again
          </button>{" "}
          <a href="#explore" className="btn btn-secondary">Back to Explore</a>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container">
        <div className="destination-detail-hero">
          {place.image ? (
            <img src={place.image} alt={place.name} className="destination-detail-image" />
          ) : (
            <div className="destination-detail-image destination-image">
              <span aria-hidden="true">📍</span>
            </div>
          )}

          <div>
            <span>DESTINATION GUIDE</span>
            <h1>{place.name}</h1>
            <p>{place.description}</p>
            <div className="detail-actions">
              <button type="button" className="btn btn-primary" onClick={handlePlanTrip}>
                Plan a Trip
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleWishlist}
                disabled={saving}
                aria-pressed={isSaved}
              >
                {saving ? "Updating..." : isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>
            {actionError && <p role="alert">{actionError}</p>}
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
          <p>Explore your destination and get recommendations for a personalized trip.</p>
          <a href="#recommendations" className="btn btn-primary">Get Recommendations</a>
        </div>
      </div>

      {showAuthPrompt && (
        <div className="auth-prompt-overlay" onClick={() => setShowAuthPrompt(false)}>
          <div
            className="auth-prompt"
            role="dialog"
            aria-modal="true"
            aria-labelledby="destination-auth-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="auth-prompt-close"
              aria-label="Close"
              onClick={() => setShowAuthPrompt(false)}
            >
              <X size={20} />
            </button>
            <Heart size={32} />
            <h3 id="destination-auth-title">Sign Up / Login to continue</h3>
            <p>Please log in or create an account to continue.</p>
            <button type="button" className="btn btn-primary" onClick={() => goToAuth("login")}>
              Login
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => goToAuth("signup")}>
              Sign Up
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DestinationPage;
