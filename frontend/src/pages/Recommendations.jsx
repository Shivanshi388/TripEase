function Recommendations() {
  const recommendations = [
    ["🏖️", "Beach Escape", "Perfect for relaxing, sunsets and coastal adventures."],
    ["🏔️", "Mountain Adventure", "Explore beautiful landscapes and peaceful mountains."],
    ["🏰", "Culture & Heritage", "Discover history, architecture and local traditions."],
  ];

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-header">
          <span>SMART TRAVEL</span>
          <h1>Recommended for you</h1>
          <p>Travel ideas based on your preferences.</p>
        </div>

        <div className="recommendation-grid">
          {recommendations.map(([icon, title, text]) => (
            <div className="recommendation-card" key={title}>
              <div className="recommendation-icon">{icon}</div>
              <h2>{title}</h2>
              <p>{text}</p>
              <a href="#explore">Explore →</a>
            </div>
          ))}
        </div>

        <div className="ml-note">
          <strong>🤖 Future ML integration</strong>
          <p>
            This section can later connect to the team's Python ML model to
            generate personalized travel recommendations.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Recommendations;