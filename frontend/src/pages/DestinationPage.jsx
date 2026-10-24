import "./DestinationPage.polish.css";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  Heart,
  Landmark,
  Leaf,
  Map,
  MapPin,
  Mountain,
  Sparkles,
  Star,
  Sun,
  Wallet,
  Waves,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import destinationService from "../services/destinationService";

function getTravelHighlights(category) {
  const key = String(category || "").toLowerCase();

  if (key.includes("beach")) {
    return [
      {
        icon: Waves,
        title: "Coastal escapes",
        description: "Find your own way to enjoy the coast.",
      },
      {
        icon: Sun,
        title: "Sunny experiences",
        description: "Make time for outdoor adventures.",
      },
      {
        icon: Compass,
        title: "Local discoveries",
        description: "Explore the character of the destination.",
      },
    ];
  }

  if (key.includes("mountain")) {
    return [
      {
        icon: Mountain,
        title: "Mountain views",
        description: "Discover scenic landscapes and viewpoints.",
      },
      {
        icon: Leaf,
        title: "Time in nature",
        description: "Enjoy peaceful surroundings and fresh air.",
      },
      {
        icon: Compass,
        title: "Outdoor exploring",
        description: "Plan experiences around your interests.",
      },
    ];
  }

  if (key.includes("heritage") || key.includes("culture")) {
    return [
      {
        icon: Landmark,
        title: "Local heritage",
        description: "Discover architecture and history.",
      },
      {
        icon: MapPin,
        title: "Cultural discoveries",
        description: "Explore the character of the region.",
      },
      {
        icon: Compass,
        title: "Explore at your pace",
        description: "Make room for your own discoveries.",
      },
    ];
  }

  if (key.includes("adventure")) {
    return [
      {
        icon: Mountain,
        title: "Outdoor adventures",
        description: "Find experiences that suit your interests.",
      },
      {
        icon: Compass,
        title: "Discover more",
        description: "Explore different sides of the destination.",
      },
      {
        icon: Sun,
        title: "Make a day of it",
        description: "Allow time for memorable experiences.",
      },
    ];
  }

  if (key.includes("nature")) {
    return [
      {
        icon: Leaf,
        title: "Natural beauty",
        description: "Take in the surrounding landscapes.",
      },
      {
        icon: Mountain,
        title: "Scenic exploration",
        description: "Make time for beautiful views.",
      },
      {
        icon: Compass,
        title: "Find your escape",
        description: "Choose experiences at your own pace.",
      },
    ];
  }

  return [
    {
      icon: Compass,
      title: "Explore your way",
      description: "Discover experiences that interest you.",
    },
    {
      icon: MapPin,
      title: "Local discoveries",
      description: "Get to know the destination.",
    },
    {
      icon: CalendarDays,
      title: "Make a plan",
      description: "Organise a trip that works for you.",
    },
  ];
}

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
  const [activeTab, setActiveTab] = useState("overview");
  const [imageFailed, setImageFailed] = useState(false);

  const loadDestination = useCallback(async () => {
    setLoading(true);
    setError("");
    setImageFailed(false);
    setActionError("");
    setActiveTab("overview");

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
    place &&
    wishlist.some((item) => String(item.id) === String(place.id))
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
      <section className="destination-page">
        <div className="destination-state">
          <span className="destination-state-icon">
            <Compass size={28} />
          </span>
          <h2>Finding your next adventure...</h2>
          <p>Getting your destination ready.</p>
        </div>
      </section>
    );
  }

  if (error || !place) {
    return (
      <section className="destination-page">
        <div className="destination-state">
          <span className="destination-state-icon">
            <MapPin size={28} />
          </span>
          <h2>Destination unavailable</h2>
          <p role="alert">
            {error || "We couldn't find this destination."}
          </p>
          <div className="destination-button-row">
            <button
              type="button"
              className="destination-btn destination-btn-primary"
              onClick={loadDestination}
            >
              Try again
            </button>
            <a
              href="#explore"
              className="destination-btn destination-btn-light"
            >
              Back to Explore
            </a>
          </div>
        </div>
      </section>
    );
  }

  const name = place.name || "Your destination";
  const category = place.category || "Travel";
  const location = place.location || "Discover the region";
  const budget = place.budget || "Check local prices";
  const description =
    place.description ||
    `Discover the highlights and experiences of ${name}.`;
  const tagline = place.tagline || `Discover ${name}`;
  const bestTime = place.bestTime || "Check local seasonal conditions";
  const imageSrc = place.image || place.imageUrl || "";
  const highlights = getTravelHighlights(category);
  const rating =
    place.rating != null && Number.isFinite(Number(place.rating))
      ? Number(place.rating)
      : null;

  return (
    <section className="destination-page">
      <div
        className={`destination-hero ${
          !imageSrc || imageFailed ? "destination-hero-no-image" : ""
        }`}
      >
        {imageSrc && !imageFailed && (
          <img
            className="destination-hero-image"
            src={imageSrc}
            alt={`${name} scenery`}
            onError={() => setImageFailed(true)}
          />
        )}

        <div className="destination-hero-inner">
          <div className="destination-hero-copy">
            <div className="destination-eyebrow">
              <Sparkles size={16} />
              <span>YOUR NEXT ADVENTURE</span>
            </div>

            <span className="destination-category-pill">
              <MapPin size={14} />
              {category}
            </span>

            <h1>{name}</h1>
            <p className="destination-hero-description">{description}</p>

            <div className="destination-button-row">
              <button
                type="button"
                className="destination-btn destination-btn-primary"
                onClick={handlePlanTrip}
              >
                <CalendarDays size={17} />
                Plan a Trip
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="destination-btn destination-btn-glass"
                onClick={handleWishlist}
                disabled={saving}
                aria-pressed={isSaved}
              >
                <Heart
                  size={18}
                  fill={isSaved ? "currentColor" : "none"}
                />
                {saving
                  ? "Updating..."
                  : isSaved
                    ? "Saved to Wishlist"
                    : "Add to Wishlist"}
              </button>
            </div>

            {actionError && (
              <p className="destination-action-error" role="alert">
                {actionError}
              </p>
            )}
          </div>

          <div className="destination-hero-note">
            <span className="destination-hero-note-icon">
              <Compass size={24} />
            </span>
            <span>
              <strong>Make it yours</strong>
              <small>Travel at your own pace</small>
            </span>
          </div>
        </div>
      </div>

      <div className="destination-shell">
        <div className="destination-facts" aria-label="Destination information">
          <div className="destination-fact">
            <span className="destination-fact-icon fact-location">
              <MapPin size={21} />
            </span>
            <div className="destination-fact-copy">
              <span>LOCATION</span>
              <strong>{location}</strong>
            </div>
          </div>

          <div className="destination-fact">
            <span className="destination-fact-icon fact-category">
              <Compass size={21} />
            </span>
            <div className="destination-fact-copy">
              <span>BEST FOR</span>
              <strong>{category}</strong>
            </div>
          </div>

          <div className="destination-fact">
            <span className="destination-fact-icon fact-budget">
              <Wallet size={21} />
            </span>
            <div className="destination-fact-copy">
              <span>ESTIMATED BUDGET</span>
              <strong>{budget}</strong>
            </div>
          </div>
        </div>

        <div className="destination-section-heading">
          <div>
            <span className="destination-section-kicker">
              YOUR DESTINATION GUIDE
            </span>
            <h2>Discover {name}</h2>
            <p>
              Everything starts with a place. Make your next trip your own.
            </p>
          </div>

          {rating !== null && (
            <div className="destination-rating">
              <Star size={18} fill="currentColor" />
              <strong>{rating.toFixed(1)}</strong>
              <span>Destination rating</span>
            </div>
          )}
        </div>

        <div
          className="destination-tabs"
          role="tablist"
          aria-label="Destination guide sections"
        >
          <button
            type="button"
            role="tab"
            id="destination-tab-overview"
            aria-controls="destination-guide-panel"
            aria-selected={activeTab === "overview"}
            className={activeTab === "overview" ? "is-active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            <Compass size={17} />
            Overview
          </button>

          <button
            type="button"
            role="tab"
            id="destination-tab-planning"
            aria-controls="destination-guide-panel"
            aria-selected={activeTab === "planning"}
            className={activeTab === "planning" ? "is-active" : ""}
            onClick={() => setActiveTab("planning")}
          >
            <Map size={17} />
            Plan your visit
          </button>

          <button
            type="button"
            role="tab"
            id="destination-tab-tips"
            aria-controls="destination-guide-panel"
            aria-selected={activeTab === "tips"}
            className={activeTab === "tips" ? "is-active" : ""}
            onClick={() => setActiveTab("tips")}
          >
            <Sun size={17} />
            Travel tips
          </button>
        </div>

        <div className="destination-content-grid">
          <article
            className="destination-guide-card"
            id="destination-guide-panel"
            role="tabpanel"
            aria-labelledby={`destination-tab-${activeTab}`}
            key={activeTab}
          >
            {activeTab === "overview" && (
              <div className="destination-tab-content">
                <span className="destination-card-kicker">
                  A LITTLE INSPIRATION
                </span>
                <h3>{tagline}</h3>
                <p className="destination-overview-description">
                  {description}
                </p>

                <div className="destination-highlight-list">
                  {highlights.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div className="destination-highlight" key={item.title}>
                        <span className="destination-highlight-icon">
                          <Icon size={20} />
                        </span>
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "planning" && (
              <div className="destination-tab-content">
                <span className="destination-card-kicker">
                  YOUR TRIP, YOUR WAY
                </span>
                <h3>Turn inspiration into a travel plan.</h3>
                <p>
                  Start with {name}, then organise your trip around your
                  interests, available dates and budget.
                </p>

                <div className="destination-step-list">
                  <div className="destination-step">
                    <span>01</span>
                    <div>
                      <strong>Start with your destination</strong>
                      <p>Use this destination as the starting point for your trip.</p>
                    </div>
                  </div>

                  <div className="destination-step">
                    <span>02</span>
                    <div>
                      <strong>Think about your priorities</strong>
                      <p>Consider your schedule, interests and estimated costs.</p>
                    </div>
                  </div>

                  <div className="destination-step">
                    <span>03</span>
                    <div>
                      <strong>Build your own experience</strong>
                      <p>Use your travel plan and recommendations to get organised.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="destination-btn destination-btn-primary"
                  onClick={handlePlanTrip}
                >
                  <CalendarDays size={17} />
                  Start planning
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {activeTab === "tips" && (
              <div className="destination-tab-content">
                <span className="destination-card-kicker">
                  BEFORE YOU SET OFF
                </span>
                <h3>A little preparation goes a long way.</h3>
                <p>
                  Keep these practical points in mind while preparing for
                  your visit to {name}.
                </p>

                <div className="destination-tip-list">
                  <div className="destination-tip">
                    <span className="destination-tip-icon">
                      <Sun size={19} />
                    </span>
                    <div>
                      <strong>Check the season</strong>
                      <p>
                        Suggested travel window: {bestTime}. Confirm conditions
                        for your actual travel dates.
                      </p>
                    </div>
                  </div>

                  <div className="destination-tip">
                    <span className="destination-tip-icon">
                      <Clock size={19} />
                    </span>
                    <div>
                      <strong>Confirm timings</strong>
                      <p>
                        Check opening hours, local transport and current prices
                        before setting off.
                      </p>
                    </div>
                  </div>

                  <div className="destination-tip">
                    <span className="destination-tip-icon">
                      <CheckCircle2 size={19} />
                    </span>
                    <div>
                      <strong>Keep essentials organised</strong>
                      <p>
                        Bring together your bookings, travel documents and
                        important trip details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>

          <aside className="destination-sidebar">
            <div className="destination-photo-card">
              {imageSrc && !imageFailed ? (
                <img
                  className="destination-card-image"
                  src={imageSrc}
                  alt={`Scenery in ${name}`}
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="destination-card-image destination-image-fallback">
                  <Compass size={54} />
                </div>
              )}

              <div className="destination-photo-shade" />

              <div className="destination-photo-caption">
                <span>
                  <Sparkles size={14} />
                  YOUR NEXT CHAPTER
                </span>
                <h3>{tagline}</h3>
                <p>
                  {location} <span aria-hidden="true">·</span> {category}
                </p>
              </div>
            </div>

            <div className="destination-snapshot-card">
              <div className="destination-snapshot-heading">
                <span className="destination-snapshot-icon">
                  <MapPin size={18} />
                </span>
                <div>
                  <span className="destination-card-kicker">
                    QUICK SNAPSHOT
                  </span>
                  <h3>At a glance</h3>
                </div>
              </div>

              <div className="destination-snapshot-row">
                <span>
                  <Sun size={16} />
                  Suggested season
                </span>
                <strong>{bestTime}</strong>
              </div>

              <div className="destination-snapshot-row">
                <span>
                  <Wallet size={16} />
                  Daily budget
                </span>
                <strong>{budget}</strong>
              </div>

              {rating !== null && (
                <div className="destination-snapshot-row">
                  <span>
                    <Star size={16} />
                    Destination rating
                  </span>
                  <strong>{rating.toFixed(1)} / 5</strong>
                </div>
              )}
            </div>
          </aside>
        </div>

        <div className="destination-cta">
          <span className="destination-cta-icon">
            <Compass size={28} />
          </span>

          <div className="destination-cta-copy">
            <h3>Ready to explore {name}?</h3>
            <p>Get recommendations and make your next trip personal.</p>
          </div>

          <a
            href="#recommendations"
            className="destination-btn destination-btn-primary"
          >
            Get Recommendations
            <ArrowRight size={17} />
          </a>
        </div>
      </div>

      {showAuthPrompt && (
        <div
          className="destination-auth-overlay"
          onClick={() => setShowAuthPrompt(false)}
        >
          <div
            className="destination-auth-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="destination-auth-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="destination-auth-close"
              aria-label="Close"
              onClick={() => setShowAuthPrompt(false)}
            >
              <X size={20} />
            </button>

            <span className="destination-auth-icon">
              <Heart size={27} />
            </span>

            <h3 id="destination-auth-title">Your next trip awaits</h3>
            <p>Please log in or create an account to continue.</p>

            <div className="destination-auth-actions">
              <button
                type="button"
                className="destination-btn destination-btn-primary"
                onClick={() => goToAuth("login")}
              >
                Login
              </button>

              <button
                type="button"
                className="destination-btn destination-btn-light"
                onClick={() => goToAuth("signup")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default DestinationPage;