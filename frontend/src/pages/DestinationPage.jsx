import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import DestinationDetails from "../components/destinations/DestinationDetails";
import { useParams } from "react-router-dom";

function DestinationPage() {
  const { id } = useParams();

  return (
    <>
      <Navbar />

      <main>
        <DestinationDetails destinationId={id} />
      </main>

      <Footer />
    </>
  );
}

export default DestinationPage;