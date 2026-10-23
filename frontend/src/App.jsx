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
import PlanTrip from "./pages/PlanTrip";
import Recommendations from "./pages/Recommendations";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function getRoute() {
  return window.location.hash.slice(1).split("?")[0] || "home";
}

function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  function renderPage() {
    if (route === "home") return <Home />;
    if (route === "explore") return <Explore />;
    if (route === "login") return <Login />;
    if (route === "signup") return <Signup />;
    if (route === "verify-email") return <VerifyEmail />;
    if (route === "forgot-password") return <ForgotPassword />;
    if (route === "reset-password") return <ResetPassword />;
    if (route === "profile") return <Profile />;
    if (route === "wishlist") return <Wishlist />;
    if (route === "my-trips") return <MyTrips />;
    if (route === "plan-trip" || route.startsWith("plan-trip/")) {
      return <PlanTrip destinationId={route.split("/")[1]} />;
    }
    if (route === "recommendations") return <Recommendations />;
    if (route.startsWith("destination/")) {
      return <DestinationPage destination={route.split("/")[1]} />;
    }
    return <Home />;
  }

  return <><Navbar /><main>{renderPage()}</main><Footer /></>;
}

export default App;