import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";

function DestinationCard({ destination }) {
  const { wishlist, toggleWishlist } = useWishlist();

  const isWishlisted = useWishlist().wishlist.some((item) => item.id === destination.id);

  const openDestination = () => {
    window.location.hash = `destination/${destination.id}`;
  };

  return (
    <div
      className="destination-card"
      onClick={openDestination}
    >
      <img
        src={destination.image}
        alt={destination.name}
      />

      <div className="destination-content">
        <div className="destination-header">
          <h3>{destination.name}</h3>

          <button
            className="wishlist-btn"
            onClick={(e) => {
  e.stopPropagation();
  toggleWishlist(destination);
}}
          >
            <Heart
  size={18}
  fill={isWishlisted ? "red" : "none"}
  color={isWishlisted ? "red" : "currentColor"}
/>
          </button>
        </div>

        <p>{destination.description}</p>

        <button
          className="btn btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            openDestination();
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default DestinationCard;
