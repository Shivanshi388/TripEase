import { useWishlist } from "../context/WishlistContext";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-header">
          <span>YOUR SAVED PLACES</span>
          <h1>Wishlist</h1>
          <p>Keep track of the destinations you want to visit.</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <div aria-hidden="true">♡</div>
            <h2>Your wishlist is empty</h2>
            <p>Save destinations you love and they'll appear here.</p>
            <a href="#explore" className="btn btn-primary">
              Explore Destinations
            </a>
          </div>
        ) : (
          <div className="destination-grid">
            {wishlist.map((destination) => (
              <article className="destination-card" key={destination.id}>
                {destination.image ? (
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="destination-card-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="destination-image">
                    <span aria-hidden="true">📍</span>
                  </div>
                )}

                <div className="destination-content">
                  <h3>{destination.name}</h3>
                  <p>{destination.description || "Saved destination"}</p>

                  <div className="destination-footer">
                    <a href={`#destination/${destination.id}`}>
                      View Details →
                    </a>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => removeFromWishlist(destination.id)}
                      aria-label={`Remove ${destination.name} from wishlist`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Wishlist;
