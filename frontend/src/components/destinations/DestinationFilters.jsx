function DestinationFilters({ search, setSearch, category, setCategory }) {
  const categories = [
    "All", "Beach", "Mountains", "Heritage", "Adventure",
    "Nature", "City", "Spiritual", "Backwaters", "Culture"
  ];

  return (
    <div className="destination-filters">
      <input
        type="search"
        aria-label="Search destinations"
        placeholder="Search by destination, place or experience..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <select
        aria-label="Filter destination category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        {categories.map((item) => (
          <option key={item} value={item}>{item === "All" ? "All categories" : item}</option>
        ))}
      </select>
    </div>
  );
}

export default DestinationFilters;
