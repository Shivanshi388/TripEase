import { ArrowRight, Compass } from "lucide-react";
import destinations from "../../data/destinations";

function Hero() {
  const randomDestination =
    destinations[Math.floor(Math.random() * destinations.length)];

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${randomDestination.image})`,
      }}
    >
      {/* hero content */}
    </section>
  );
}

export default Hero;