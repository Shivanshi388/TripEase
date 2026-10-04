import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import PopularDestinations from "../components/home/PopularDestinations";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Features />
        <PopularDestinations />
      </main>

      <Footer />
    </>
  );
}

export default Home;