function DestinationDetails({ destinationId }) {
  const destinations = {
    1: {
      name: "Goa",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
      description:
        "Goa is famous for its beaches, nightlife, water sports, and Portuguese heritage.",
      bestTime: "November - February",
      budget: "₹15,000 - ₹30,000",
      attractions: [
        "Baga Beach",
        "Fort Aguada",
        "Dudhsagar Falls"
      ],
      activities: [
        "Parasailing",
        "Scuba Diving",
        "Nightlife"
      ]
    },

    2: {
      name: "Manali",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      description:
        "Manali is a beautiful hill station known for snow, mountains, and adventure sports.",
      bestTime: "October - June",
      budget: "₹12,000 - ₹25,000",
      attractions: [
        "Solang Valley",
        "Rohtang Pass",
        "Hadimba Temple"
      ],
      activities: [
        "Skiing",
        "Trekking",
        "Camping"
      ]
    }
  };

  const destination = destinations[destinationId];

  if (!destination) {
    return (
      <div className="container">
        <h2>Destination Not Found</h2>
      </div>
    );
  }

  return (
    <section className="destination-details">
      <div className="container">
        <img
          src={destination.image}
          alt={destination.name}
          className="destination-banner"
        />

        <h1>{destination.name}</h1>

        <p>{destination.description}</p>

        <div className="details-grid">
          <div>
            <h3>Best Time To Visit</h3>
            <p>{destination.bestTime}</p>
          </div>

          <div>
            <h3>Estimated Budget</h3>
            <p>{destination.budget}</p>
          </div>
        </div>

        <h3>Top Attractions</h3>

        <ul>
          {destination.attractions.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h3>Activities</h3>

        <ul>
          {destination.activities.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default DestinationDetails;