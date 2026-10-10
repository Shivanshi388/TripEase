function PopularDestinations() {
  const destinations = [
    {
      name: "Goa",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2"
    },
    {
      name: "Manali",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
    },
    {
      name: "Jaipur",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245"
    }
  ];

  return (
    <section className="destinations">
      <div className="container">
        <h2>Popular Destinations</h2>

        <div className="destination-grid">
          {destinations.map((place, index) => (
            <div className="destination-card" key={index}>
              <img src={place.image} alt={place.name} />
              <h3>{place.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularDestinations;