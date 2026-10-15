<<<<<<< HEAD
<<<<<<< HEAD
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
=======
﻿import destinations from "../data/destinations";
>>>>>>> 8cc68a1 (Fix destination page JSX structure and button classes)
=======
﻿import { useState } from "react";
import { Heart, X } from "lucide-react";
import destinations from "../data/destinations";
import { useAuth } from "../context/AuthContext";
>>>>>>> 3daa256 (Add authentication and protect wishlist and trip planning)

function DestinationPage({ destination }) {
  const { user } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authReturnTo, setAuthReturnTo] = useState("");

  const place = destinations.find(
    (d) => d.id === Number(destination)
  );

  const handlePlanTrip = () => {
    if (!user) {
      setAuthReturnTo(`plan-trip/${place.id}`);
      setShowAuthPrompt(true);
      return;
    }

    window.location.hash = `plan-trip/${place.id}`;
  };

  const handleAddToWishlist = () => {
    if (!user) {
      setAuthReturnTo("wishlist");
      setShowAuthPrompt(true);
      return;
    }

    window.location.hash = "wishlist";
  };

  const goToAuth = (page) => {
    sessionStorage.setItem(
      "tripease_after_login",
      authReturnTo || `plan-trip/${place.id}`
    );

    setShowAuthPrompt(false);
    window.location.hash = page;
  };

  if (!place) {
    return (
      <section className="page-section">
        <div className="container">
          <h1>Destination not found</h1>
        </div>
      </section>
    );
  }

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
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePlanTrip}
              >
                Plan a Trip
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddToWishlist}
              >
                Add to Wishlist
              </button>
            </div>
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
          <p>
            TripEase will eventually use destination, weather, budget and
            recommendation APIs to help create a personalized itinerary for
            you.
          </p>

          <a href="#recommendations" className="btn btn-primary">
            Get Recommendations
          </a>
        </div>
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

            <h3 id="destination-auth-title">
              Sign Up / Login to continue
            </h3>

            <p>
              Please log in or create an account to continue.
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
    </section>
  );
}

export default DestinationPage;
