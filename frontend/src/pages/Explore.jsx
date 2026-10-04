import { useState } from "react";
import DestinationFilters from "../components/destinations/DestinationFilters";
import DestinationCard from "../components/destinations/DestinationCard";

function Explore() {
  const destinations = [
    {
      id: 1,
      name: "Goa",
      category: "Beach",
      description: "Sunny beaches and nightlife",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2"
    },
    {
      id: 2,
      name: "Manali",
      category: "Mountain",
      description: "Snowy mountains and adventure",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
    },
    {
      id: 3,
      name: "Jaipur",
      category: "Heritage",
      description: "Historic forts and palaces",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245"
    },
    {
      id: 4,
      name: "Rishikesh",
      category: "Adventure",
      description: "River rafting and spirituality",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592"
    },
  ];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch = destination.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      destination.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container">
      <h1>Explore Destinations</h1>

      <DestinationFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      <div className="destination-grid">
        {filteredDestinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
          />
        ))}
      </div>
    </div>
  );
}

export default Explore;


  

  


