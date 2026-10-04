import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import DestinationGrid from "../components/destinations/DestinationGrid";

function Explore() {
  return (
    <>
      <Navbar />

      <main className="explore-page">
        <div className="container">
          <h1>Explore Destinations</h1>
          <p>
            Discover beautiful places and find your next adventure.
          </p>

          <DestinationGrid />
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Explore;