import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
  const saved = localStorage.getItem("wishlist");
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem(
    "wishlist",
    JSON.stringify(wishlist)
  );
}, [wishlist]);

  const addToWishlist = (destination) => {
    if (!wishlist.find((item) => item.id === destination.id)) {
      setWishlist([...wishlist, destination]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const toggleWishlist = (destination) => {
  const exists = wishlist.some(
    (item) => item.id === destination.id
  );

  if (exists) {
    setWishlist(
      wishlist.filter(
        (item) => item.id !== destination.id
      )
    );
  } else {
    setWishlist([...wishlist, destination]);
  }
};

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);