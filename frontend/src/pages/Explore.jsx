import { useState } from "react";
import DestinationFilters from "../components/destinations/DestinationFilters";
import DestinationCard from "../components/destinations/DestinationCard";
import images from "../assets/images";

const { goa, manali, jaipur, rishikesh, kerala, coorg } = images;

function Explore() {
  const destinations = [
    {
      id: 1,
      name: "Goa",
      category: "Beach",
      description: "Sunny beaches and nightlife",
      image: goa,
    },
    {
      id: 2,
      name: "Manali",
      category: "Mountain",
      description: "Snowy mountains and adventure",
      image: manali,
    },
    {
      id: 3,
      name: "Jaipur",
      category: "Heritage",
      description: "Historic forts and palaces",
      image: jaipur,
    },
    {
      id: 4,
      name: "Rishikesh",
      category: "Adventure",
      description: "River rafting and spirituality",
      image: rishikesh,
    },
    {
      id: 5,
      name: "Kerala",
      category: "Beach",
      description: "Tropical beaches and backwaters",
      image: kerala,
    },
    {
      id: 6,
      name: "Coorg",
      category: "Mountain",
      description: "Hilly terrain and coffee plantations",
      image: coorg,
    },
  ];

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
          <p className="no-results">
            No destinations found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Explore;