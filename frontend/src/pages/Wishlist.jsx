import { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { Heart, MapPin, ArrowRight, Compass, Trash2, Sparkles } from "lucide-react";

function Wishlist() {
  const {
    wishlist,
    removeFromWishlist,
    wishlistLoading,
    wishlistError,
    loadWishlist,
  } = useWishlist();

  const [actionError, setActionError] = useState("");
  const [removingId, setRemovingId] = useState("");

  const handleRemove = async (id) => {
    setActionError("");
    setRemovingId(String(id));
    try {
      await removeFromWishlist(id);
    } catch (error) {
      setActionError(error.message || "Unable to remove this destination.");
    } finally {
      setRemovingId("");
    }
  };

  return (
    <section className="page-section wishlist-page">
      <div className="container">
        <header className="wishlist-hero">
          <div className="wishlist-hero-copy">
            <span className="wishlist-eyebrow"><Heart size={15} /> YOUR TRAVEL WISHLIST</span>
            <h1>Places your heart <em>belongs.</em></h1>
            <p>A little collection of places to dream about today and explore tomorrow.</p>
            <a href="#explore" className="wishlist-primary">
              Find your next favourite <ArrowRight size={17} />
            </a>
          </div>
          <div className="wishlist-hero-photo" role="img" aria-label="Beautiful scenic travel landscape" />
        </header>

        {wishlistError && (
          <div className="wishlist-alert" role="alert">
            <p>{wishlistError}</p>
            <button type="button" className="wishlist-secondary" onClick={loadWishlist} disabled={wishlistLoading}>
              Try again
            </button>
          </div>
        )}

        {actionError && <div className="wishlist-alert" role="alert">{actionError}</div>}

        <div className="wishlist-heading">
          <div>
            <span className="wishlist-eyebrow">SAVED INSPIRATION</span>
            <h2>Your collection <span>{wishlist.length}</span></h2>
          </div>
          <a href="#explore" className="wishlist-discover">Explore places <ArrowRight size={16} /></a>
        </div>

        {wishlistLoading ? (
          <div className="wishlist-message" role="status">Gathering your saved places...</div>
        ) : wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon"><Heart size={34} /></div>
            <h2>Room for a little wanderlust?</h2>
            <p>Save destinations that inspire you, and your personal travel collection will grow here.</p>
            <a href="#explore" className="wishlist-primary">Explore destinations <ArrowRight size={17} /></a>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((destination) => (
              <article className="wishlist-card" key={destination.id}>
                <div className="wishlist-card-image-wrap">
                  {destination.image ? (
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="wishlist-card-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="wishlist-image-fallback" aria-hidden="true"><Compass size={34} /></div>
                  )}
                  <span className="wishlist-saved-label"><Heart size={13} fill="currentColor" /> Saved place</span>
                </div>
                <div className="wishlist-card-body">
                  <span className="wishlist-location"><MapPin size={15} /> Destination to discover</span>
                  <h3>{destination.name}</h3>
                  <p className="wishlist-description">{destination.description || "A place waiting to become part of your next adventure."}</p>
                  <div className="wishlist-card-actions">
                    <a href={`#destination/${destination.id}`} className="wishlist-primary wishlist-view">
                      View details <ArrowRight size={15} />
                    </a>
                    <button
                      type="button"
                      className="wishlist-remove"
                      onClick={() => handleRemove(destination.id)}
                      disabled={removingId === String(destination.id)}
                      aria-label={`Remove ${destination.name} from wishlist`}
                    >
                      <Trash2 size={15} />
                      {removingId === String(destination.id) ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!wishlistLoading && wishlist.length > 0 && (
          <div className="wishlist-bottom-note">
            <Sparkles size={18} />
            <span>Your next favourite memory could be one of these places.</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default Wishlist;
