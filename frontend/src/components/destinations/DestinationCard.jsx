import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";

function DestinationCard({ destination }) {
  const { addToWishlist } = useWishlist();
  
  return (
    <div className="destination-card">
      <img
        src={destination.image}
        alt={destination.name}
        width={380}
        height={247}
      />

      <button
        onClick={() => addToWishlist(destination)}
        className="wishlist-btn"
     > 
        <Heart size={18} />
      </button>

      <div className="destination-content">
        <h3>{destination.name}</h3>

        <a
          href={`#destination/${destination.id}`}
          className="btn btn-primary"
        >
          View Details
        </a>
      </div>
    </div>
  );
}

export default DestinationCard;
