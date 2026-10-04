import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useWishlist } from "../context/WishlistContext";

function Wishlist() {
    const { wishlist, removeFromWishlist } = useWishlist();
  return (
    <>
      <Navbar />

      <main className="container">
        <h1>My Wishlist</h1>
        <p>Your saved destinations will appear here.</p>
        {wishlist.length === 0 ? (
          <p>No destinations saved yet.</p>
        ) : (
          wishlist.map((destination) => (
            <div key={destination.id}>
              <h3>{destination.name}</h3>

              <button
                onClick={() => removeFromWishlist(destination.id)}
           >
                Remove
              </button>
            </div>
          ))
        )}
      </main>

      <Footer />
    </>
  );
}

export default Wishlist;