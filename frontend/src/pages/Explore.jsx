const places = [
  ["goa", "Goa", "🏝️", "Beaches & nightlife", "4.8"],
  ["manali", "Manali", "🏔️", "Mountains & snow", "4.7"],
  ["jaipur", "Jaipur", "🏰", "Culture & heritage", "4.6"],
  ["kerala", "Kerala", "🌴", "Backwaters & nature", "4.8"],
  ["ladakh", "Ladakh", "⛰️", "Adventure & mountains", "4.9"],
  ["udaipur", "Udaipur", "🏛️", "Lakes & royal heritage", "4.7"],
];

function Explore() {
  return (
    <section className="page-section">
      <div className="container">
        <div className="page-header">
          <span>DISCOVER</span>
          <h1>Explore destinations</h1>
          <p>Find your next place to visit.</p>
        </div>

        <div className="search-box">
          <input placeholder="🔎 Search destinations..." />
          <select>
            <option>All categories</option>
            <option>Beach</option>
            <option>Mountains</option>
            <option>Culture</option>
            <option>Adventure</option>
          </select>
          <button className="btn btn-primary">Search</button>
        </div>

        <div className="destination-grid">
          {places.map(([id, name, emoji, description, rating]) => (
            <article className="destination-card" key={id}>
              <div className="destination-image large">
                <span>{emoji}</span>
                <button className="heart">♡</button>
              </div>

              <div className="destination-info">
                <h3>{name}</h3>
                <div className="location">📍 India</div>
                <p>{description}</p>

                <div className="destination-footer">
                  <span>★ {rating}</span>
                  <a href={`#destination/${id}`}>View Details →</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Explore;