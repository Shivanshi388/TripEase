import destinations from "../data/destinations";
import { getFeaturedDestination } from "../utils/journeyPhoto";

import {
  useRef,
} from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import "./Home.css";

function Home() {
  const featured = getFeaturedDestination();

const others = destinations.filter(
  (d) => d.id !== featured.id
);

  const morphRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: morphRef,
    offset: ["start start", "end end"],
  });

  const width = useTransform(
    scrollYProgress,
    [0, 0.6],
    ["100vw", "42vw"]
  );

  const height = useTransform(
    scrollYProgress,
    [0, 0.6],
    ["100vh", "62vh"]
  );

  const radius = useTransform(
    scrollYProgress,
    [0, 0.6],
    ["0px", "28px"]
  );

  const x = useTransform(
    scrollYProgress,
    [0, 0.6],
    ["0vw", "-24vw"]
  );

  const overlay = useTransform(
    scrollYProgress,
    [0, 0.4],
    [0.45, 0]
  );

  const heroTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.25],
    [1, 0]
  );

  const heroTextY = useTransform(
    scrollYProgress,
    [0, 0.25],
    [0, -60]
  );

  const detailsOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.75],
    [0, 1]
  );

  const detailsX = useTransform(
    scrollYProgress,
    [0.5, 0.75],
    [60, 0]
  );

  return (
    <>
      <section ref={morphRef} className="morph">
        <div className="morph__sticky">
          <motion.div
            className="morph__photo"
            style={{
              width,
              height,
              borderRadius: radius,
              x,
            }}
          >
            <img
              src={featured.image}
              alt={featured.name}
            />

            <motion.div
              className="morph__overlay"
              style={{ opacity: overlay }}
            />
          </motion.div>

          <motion.div
            className="morph__hero-text"
            style={{
              opacity: heroTextOpacity,
              y: heroTextY,
            }}
          >
            <p className="eyebrow">
              Discover the world with TripEase
            </p>

            <h1>
              Where nature
              <br />
              meets wanderlust
            </h1>

            <p className="sub">
              Plan unforgettable journeys to beautiful destinations.
            </p>

            <span className="scroll-hint">
              Scroll ↓
            </span>
          </motion.div>

          <motion.div
            className="morph__details"
            style={{
              opacity: detailsOpacity,
              x: detailsX,
            }}
          >
            <p className="eyebrow eyebrow--green">
              Featured Destination
            </p>

            <h2>{featured.name}</h2>

            <p className="country">
  {featured.location}
</p>

<p className="tagline">
  {featured.tagline}
</p>

<p className="desc">
  {featured.description}
</p>

<div className="meta">
  <div>
    <span>Best Time</span>
    <strong>{featured.bestTime}</strong>
  </div>

  <div>
    <span>Budget</span>
    <strong>{featured.budget}</strong>
  </div>
</div>
          </motion.div>
        </div>
      </section>

      <section id="explore" className="others">
        <h2>Explore More Destinations</h2>

        <div className="others__grid">
          {others.map((destination) => (
            <div
  key={destination.id}
  className="card"
  onClick={() => {
    window.location.hash = `destination/${destination.id}`;
  }}
>
              <img
                src={destination.image}
                alt={destination.name}
              />

              <div className="card__body">
                <h3>{destination.name}</h3>

                <p className="country">
                  {destination.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;