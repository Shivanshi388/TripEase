import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import DestinationPage from "./pages/DestinationPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import MyTrips from "./pages/MyTrips";
import Recommendations from "./pages/Recommendations";

function App() {
  const getRoute = () => {
    const hash = window.location.hash.replace("#", "") || "home";
    return hash;
  };

  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
      window.scrollTo(0, 0);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const renderPage = () => {
    if (route === "home") return <Home />;
    if (route === "explore") return <Explore />;
    if (route === "login") return <Login />;
    if (route === "signup") return <Signup />;
    if (route === "profile") return <Profile />;
    if (route === "wishlist") return <Wishlist />;
    if (route === "my-trips") return <MyTrips />;
    if (route === "recommendations") return <Recommendations />;

    if (route.startsWith("destination/")) {
      const destination = route.split("/")[1];
      return <DestinationPage destination={destination} />;
    }

    return <Home />;
  };

  return (
    <>
      <Navbar />
      <main>{renderPage()}</main>
      <Footer />
    </>
  );
}

export default App;