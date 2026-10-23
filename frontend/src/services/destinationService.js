import api from "./api";
import localDestinations from "../data/destinations";

const localByName = new Map(
  localDestinations.map((destination) => [
    destination.name.trim().toLowerCase(),
    destination,
  ])
);

function normalizeDestination(destination) {
  const name = String(destination.name || "").trim();
  const fallback = localByName.get(name.toLowerCase());

  const rawCategory = String(
    destination.category || fallback?.category || "Other"
  );

  const category =
    rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);

  return {
    ...fallback,
    ...destination,
    id: destination._id || destination.id,
    _id: destination._id || destination.id,
    localId: fallback?.id ?? null,
    name: name || fallback?.name || "Unknown destination",
    location:
      destination.city ||
      fallback?.location ||
      destination.country ||
      "India",
    category,
    description:
      destination.description ||
      fallback?.description ||
      `Discover the highlights of ${name || "this destination"}.`,
    image:
      destination.imageUrl ||
      fallback?.image ||
      null,
    budget:
      destination.averageCost != null && destination.averageCost !== ""
        ? `₹${Number(destination.averageCost).toLocaleString("en-IN")}`
        : fallback?.budget || "Check local prices",
    rating: destination.rating ?? fallback?.rating ?? null,
  };
}

async function getDestinations() {
  const response = await api.get("/destinations");
  const records = response?.destinations;

  if (!Array.isArray(records)) {
    throw new Error("The destination API returned an unexpected response.");
  }

  return records.map(normalizeDestination);
}

async function getDestinationById(id) {
  if (!id) {
    throw new Error("A destination ID is required.");
  }

  const response = await api.get(
    `/destinations/${encodeURIComponent(id)}`
  );

  const destination = response?.data ?? response?.destination ?? response;

  if (!destination || !(destination._id || destination.id)) {
    throw new Error("The requested destination was not found.");
  }

  return normalizeDestination(destination);
}

const destinationService = {
  getDestinations,
  getDestinationById,
};

export default destinationService;
