import { useCallback, useEffect, useState } from "react";
import DestinationFilters from "../components/destinations/DestinationFilters";
import DestinationCard from "../components/destinations/DestinationCard";
import destinationService from "../services/destinationService";
import images from "../assets/images";

const fallbackImages = {
  Agra: "",
  Goa: images.goa,
  Jaipur: images.jaipur,
  Manali: images.manali,
  Rishikesh: images.rishikesh,
};

function Explore() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDestinations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await destinationService.getDestinations();

      setDestinations(
        results.map((destination) => ({
          ...destination,
          image:
            destination.image ||
            fallbackImages[destination.name] ||
            "",
        }))
      );
    } catch (err) {
      setError(
        err.message ||
          "We couldn't load destinations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  const searchTerm = search.trim().toLowerCase();

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch =
      destination.name.toLowerCase().includes(searchTerm) ||
      destination.description.toLowerCase().includes(searchTerm) ||
      destination.category.toLowerCase().includes(searchTerm) ||
      String(destination.location || "").toLowerCase().includes(searchTerm);

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

      {loading ? (
        <p className="no-results" role="status">
          Loading destinations...
        </p>
      ) : error ? (
        <div className="no-results" role="alert">
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={loadDestinations}
          >
            Try Again
          </button>
        </div>
      ) : filteredDestinations.length > 0 ? (
        <div className="destination-grid">
          {filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
            />
          ))}
        </div>
      ) : (
        <p className="no-results">
          {destinations.length === 0
            ? "No destinations are available right now."
            : "No destinations found. Try another search or category."}
        </p>
      )}
    </div>
  );
}

export default Explore;



