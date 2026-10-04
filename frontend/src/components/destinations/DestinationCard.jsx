import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";

function DestinationCard({ destination }) {
  const { addToWishlist } = useWishlist();
  
  return (
    <div className="destination-card">
      <img
        src={destination.image}
        alt={destination.name}
      />

      <button
        onClick={() => addToWishlist(destination)}
        className="wishlist-btn"
     > 
        <Heart size={18} />
      </button>

      <div className="destination-content">
        <h3>{destination.name}</h3>
        <p>{destination.description}</p>

        <Link
          to={`/destination/${destination.id}`}
          className="btn btn-primary"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default DestinationCard;