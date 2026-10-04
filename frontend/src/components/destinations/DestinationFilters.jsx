function DestinationFilters({
  search,
  setSearch,
  category,
  setCategory,
}) {
  return (
    <div className="destination-filters">
      <input
        type="text"
        placeholder="Search destinations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Beach">Beach</option>
        <option value="Mountain">Mountain</option>
        <option value="Heritage">Heritage</option>
        <option value="Adventure">Adventure</option>
      </select>
    </div>
  );
}

export default DestinationFilters;