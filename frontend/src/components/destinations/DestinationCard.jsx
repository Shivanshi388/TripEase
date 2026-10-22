import { useState } from "react";
import { Heart, X } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

function DestinationCard({ destination }) {
  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const { user } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const isSaved = wishlist.some(
    (item) => String(item.id) === String(destination.id)
  );

  const handleWishlistClick = async () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    if (busy) return;

    setBusy(true);
    setActionError("");

    try {
      if (isSaved) {
        await removeFromWishlist(destination.id);
      } else {
        await addToWishlist(destination);
      }
    } catch (error) {
      setActionError(error.message || "Unable to update your wishlist.");
    } finally {
      setBusy(false);
    }
  };

  const goToAuth = (page) => {
    sessionStorage.setItem(
      "tripease_after_login",
      window.location.hash.replace(/^#/, "") || "explore"
    );
    setShowAuthPrompt(false);
    window.location.hash = page;
  };

  return (
    <div className="destination-card">
      <img
        src={destination.image}
        alt={destination.name}
        className="destination-card-image"
      />

      <button
        type="button"
        onClick={handleWishlistClick}
        disabled={busy}
        className={`wishlist-btn${isSaved ? " active" : ""}`}
        aria-label={
          isSaved
            ? `Remove ${destination.name} from wishlist`
            : `Add ${destination.name} to wishlist`
        }
        aria-pressed={isSaved}
        title={
          busy
            ? "Updating wishlist..."
            : isSaved
              ? "Remove from wishlist"
              : "Add to wishlist"
        }
      >
        <Heart
          size={22}
          strokeWidth={2}
          fill={isSaved ? "currentColor" : "none"}
        />
      </button>

      {actionError && (
        <p className="trip-login-error" role="alert">
          {actionError}
        </p>
      )}

      <div className="destination-content">
        <h3>{destination.name}</h3>
        <p>{destination.description}</p>

        <a
          href={`#destination/${destination.id}`}
          className="btn btn-primary"
        >
          View Details
        </a>
      </div>

      {showAuthPrompt && (
        <div
          className="auth-prompt-overlay"
          onClick={() => setShowAuthPrompt(false)}
        >
          <div
            className="auth-prompt"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-prompt-title"
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
            <h3 id="auth-prompt-title">Sign Up / Login to continue</h3>
            <p>
              Please log in or create an account to save destinations
              to your wishlist.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => goToAuth("login")}
            >
              Login
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => goToAuth("signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DestinationCard;
