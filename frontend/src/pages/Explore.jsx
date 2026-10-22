import { useCallback, useEffect, useState } from "react";
import DestinationFilters from "../components/destinations/DestinationFilters";
import DestinationCard from "../components/destinations/DestinationCard";
import destinationService from "../services/destinationService";
import images from "../assets/images";
import "./Explore.css";

const fallbackImages = {
  Goa: images.goa,
  Jaipur: images.jaipur,
  Manali: images.manali,
  Rishikesh: images.rishikesh,
};

const categories = [
  "All", "Beach", "Mountains", "Heritage",
  "Adventure", "Nature", "City", "Spiritual", "Backwaters", "Culture"
];

function Explore() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState(() => {
    const hash = window.location.hash;
    const query = hash.includes("?") ? hash.split("?").slice(1).join("?") : "";
    return new URLSearchParams(query).get("destination") || "";
  });
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDestinations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const results = await destinationService.getDestinations();
      setDestinations(results.map((destination) => ({
        ...destination,
        image: destination.image || fallbackImages[destination.name] || "",
      })));
    } catch (err) {
      setError(err.message || "We couldn't load destinations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  const searchTerm = search.trim().toLowerCase();

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch = [
      destination.name,
      destination.description,
      destination.category,
      destination.location,
      destination.state,
    ].some((value) => String(value || "").toLowerCase().includes(searchTerm));

    return matchesSearch &&
      (category === "All" ||
       String(destination.category || "").toLowerCase() === category.toLowerCase());
  });

  const featured = destinations.slice(0, 5);

  return (
    <main className="explore-page">
      <section className="explore-hero">
        <div className="explore-hero-content">
          <span className="explore-eyebrow">YOUR NEXT ADVENTURE STARTS HERE</span>
          <h1>Find places that <span>move you.</span></h1>
          <p>From peaceful escapes to unforgettable adventures, discover your next favourite destination.</p>
          <div className="explore-hero-search">
            <span aria-hidden="true">&#9906;</span>
            <input
              aria-label="Search destinations"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Where do you want to go?"
            />
            <a href="#explore" onClick={(event) => { event.preventDefault(); document.getElementById("explore-results")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="btn btn-primary">Explore destinations</a>
          </div>
          <div className="explore-hero-note">
            <span>Discover</span><span>Save favourites</span><span>Plan your journey</span>
          </div>
        </div>
        <div className="explore-hero-decoration" aria-hidden="true">
          <span>Explore more.</span>
          <span>Worry less.</span>
          <div className="explore-decoration-orbit">✈</div>
        </div>
      </section>

      <section className="explore-featured container">
        <div className="explore-section-heading">
          <div>
            <span className="explore-eyebrow">A LITTLE INSPIRATION</span>
            <h2>Popular destinations</h2>
            <p>Places worth adding to your travel list.</p>
          </div>
          <a href="#explore" onClick={(event) => { event.preventDefault(); document.getElementById("explore-results")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="explore-text-link">Discover all destinations →</a>
        </div>
        <div className="explore-featured-list">
          {featured.map((place, index) => (
            <a
              href={`#destination/${place.id}`}
              className="explore-featured-chip"
              key={place.id}
            >
              <span className="explore-featured-number">{String(index + 1).padStart(2, "0")}</span>
              <span>{place.name}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="container explore-results" id="explore-results">
        <div className="explore-section-heading">
          <div>
            <span className="explore-eyebrow">YOUR PERSONAL TRAVEL COLLECTION</span>
            <h2>Explore the world, your way</h2>
            <p>Find your kind of getaway and make it yours.</p>
          </div>
          {!loading && <span className="explore-count">{filteredDestinations.length} places</span>}
        </div>

        <div className="explore-category-row" aria-label="Filter by category">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`explore-category-pill${category === item ? " selected" : ""}`}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item === "All" ? "All places" : item}
            </button>
          ))}
        </div>

        <div className="explore-filter-bar">
          <DestinationFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
          />
        </div>

        {loading ? (
          <p className="no-results" role="status">Finding beautiful places for you...</p>
        ) : error ? (
          <div className="no-results" role="alert">
            <p>{error}</p>
            <button type="button" className="btn btn-primary" onClick={loadDestinations}>Try Again</button>
          </div>
        ) : filteredDestinations.length ? (
          <div className="destination-grid explore-destination-grid">
            {filteredDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        ) : (
          <div className="explore-empty-state">
            <span aria-hidden="true">⌕</span>
            <h3>No destinations found</h3>
            <p>Try a different search or choose another category.</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { setSearch(""); setCategory("All"); }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Explore;
