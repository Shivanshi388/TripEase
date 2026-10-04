import { Link } from "react-router-dom";
function DestinationCard({ destination }) {
  return (
    <div className="destination-card">
      <img
        src={destination.image}
        alt={destination.name}
      />

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