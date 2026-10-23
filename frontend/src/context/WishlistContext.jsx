import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);
const STORAGE_KEY = "wishlist";

function readLocalWishlist() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function normalizeWishlistEntry(entry) {
  const destination = entry?.destination;

  if (!destination || typeof destination !== "object") {
    return null;
  }

  return {
    ...destination,
    id: String(destination._id || destination.id || ""),
    wishlistItemId: String(entry._id || ""),
    name: destination.name || "Destination",
    location: destination.city || destination.country || "India",
    category: destination.category || "Travel",
    description: destination.description || "Saved destination",
    image: destination.image || destination.imageUrl || "",
    budget:
      destination.averageCost != null
        ? `₹${destination.averageCost}`
        : "Check local prices",
  };
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(readLocalWishlist);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState("");

  const loadWishlist = useCallback(async () => {
    if (!user) {
      setWishlist(readLocalWishlist());
      setWishlistError("");
      return;
    }

    setWishlistLoading(true);
    setWishlistError("");

    try {
      const result = await api.get("/wishlist");
      const entries = Array.isArray(result.wishlist)
        ? result.wishlist
        : [];

      const normalized = entries
        .map(normalizeWishlistEntry)
        .filter(Boolean);

      setWishlist(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (error) {
      setWishlistError(error.message || "Unable to load your wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToWishlist = async (destination) => {
    if (!user) {
      throw new Error("Please log in to save destinations.");
    }

    const destinationId = String(
      destination?._id || destination?.id || ""
    );

    if (!/^[a-f\d]{24}$/i.test(destinationId)) {
      throw new Error("This destination has no valid database ID.");
    }

    const alreadySaved = wishlist.some(
      (item) => String(item.id) === destinationId
    );

    if (alreadySaved) return;

    setWishlistError("");

    try {
      const result = await api.post("/wishlist", {
        destination: destinationId,
      });

      const saved = normalizeWishlistEntry(result.data);

      if (!saved) {
        await loadWishlist();
        return;
      }

      setWishlist((current) => {
        const next = [
          saved,
          ...current.filter((item) => String(item.id) !== saved.id),
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    } catch (error) {
      setWishlistError(error.message || "Unable to save this destination.");
      throw error;
    }
  };

  const removeFromWishlist = async (id) => {
    const entry = wishlist.find(
      (item) => String(item.id) === String(id)
    );

    if (!entry) return;

    if (!user) {
      const next = wishlist.filter(
        (item) => String(item.id) !== String(id)
      );
      setWishlist(next);
      return;
    }

    if (!entry.wishlistItemId) {
      throw new Error("This saved item needs to be refreshed before removal.");
    }

    setWishlistError("");

    try {
      await api.delete(`/wishlist/${entry.wishlistItemId}`);

      setWishlist((current) => {
        const next = current.filter(
          (item) => String(item.id) !== String(id)
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    } catch (error) {
      setWishlistError(error.message || "Unable to remove this destination.");
      throw error;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistLoading,
        wishlistError,
        loadWishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
