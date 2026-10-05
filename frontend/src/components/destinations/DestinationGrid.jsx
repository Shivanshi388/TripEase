import DestinationCard from "./DestinationCard";

function DestinationGrid() {
  const destinations = [
    {
      id: 1,
      name: "Goa",
      description: "Beaches, nightlife and water sports.",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2"
    },
    {
      id: 2,
      name: "Manali",
      description: "Mountains, snow and adventure.",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
    },
    {
      id: 3,
      name: "Jaipur",
      description: "Historic forts and royal heritage.",
      image:
        "https://images.unsplash.com/photo-1477587458883-47145ed94245"
    },
    {
      id: 4,
      name: "Kashmir",
      description: "Valleys, lakes and scenic beauty.",
      image:
        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e"
    }
  ];

  return (
    <div className="destination-grid">
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
        />
      ))}
    </div>
  );
}

export default DestinationGrid;