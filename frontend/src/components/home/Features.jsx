import { MapPinned, Wallet, CalendarDays } from "lucide-react";

function Features() {
  const features = [
    {
      icon: <MapPinned size={32} />,
      title: "Smart Destinations",
      description: "Discover places tailored to your travel preferences."
    },
    {
      icon: <CalendarDays size={32} />,
      title: "Trip Planning",
      description: "Build day-by-day itineraries with ease."
    },
    {
      icon: <Wallet size={32} />,
      title: "Budget Tracking",
      description: "Keep your travel expenses under control."
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <h2>Why Choose TripEase?</h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;