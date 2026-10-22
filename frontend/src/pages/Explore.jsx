import { useState } from "react";
import DestinationFilters from "../components/destinations/DestinationFilters";
import DestinationCard from "../components/destinations/DestinationCard";
import destinations from "../data/destinations";

function Explore() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredDestinations = destinations.filter((destination) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      destination.name.toLowerCase().includes(searchTerm) ||
      destination.description.toLowerCase().includes(searchTerm) ||
      destination.category.toLowerCase().includes(searchTerm);

    const matchesCategory =
      category === "All" ||
      destination.category.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container">
      <div className="explore-header">
        <h1>Explore Destinations</h1>

        <DestinationFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
        />
      </div>

      <div className="destination-grid">
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
            />
          ))
        ) : (
          <p className="no-results">No destinations found.</p>
        )}
      </div>
    </div>
  );
}

export default Explore;
