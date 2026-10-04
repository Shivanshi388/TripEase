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

        <button className="btn btn-primary">
          View Details
        </button>
      </div>
    </div>
  );
}

export default DestinationCard;