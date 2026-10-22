import api from "./api";
import localDestinations from "../data/destinations";

const localByName = new Map(
  localDestinations.map((destination) => [
    destination.name.trim().toLowerCase(),
    destination,
  ])
);

const localById = new Map(
  localDestinations.map((destination) => [
    String(destination.destinationId || destination.id),
    destination,
  ])
);

function normalizeDestination(destination) {
  const name = String(destination.name || "").trim();
  const fallback = localByName.get(name.toLowerCase());

  const destinationId = String(
    destination.destinationId ||
    destination.destination_id ||
    fallback?.destinationId ||
    fallback?.id ||
    ""
  );

  const rawCategory = String(
    destination.category || fallback?.category || "Other"
  );

  const category =
    rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);

  return {
    ...fallback,
    ...destination,
    id: destinationId || destination._id || destination.id,
    destinationId,
    destination_id: destinationId,
    _id: destination._id || destination.mongoId || null,
    mongoId: destination._id || destination.mongoId || null,
    name: name || fallback?.name || "Unknown destination",
    location:
      destination.state ||
      destination.city ||
      destination.location ||
      fallback?.location ||
      destination.country ||
      "India",
    category,
    description:
      destination.description ||
      fallback?.description ||
      `Discover the highlights of ${name || "this destination"}.`,
    image:
      destination.image ||
      destination.imageUrl ||
      fallback?.image ||
      null,
    imageUrl:
      destination.imageUrl ||
      destination.image ||
      fallback?.imageUrl ||
      null,
    budget:
      destination.budget ||
      (destination.averageCost != null && destination.averageCost !== ""
        ? `₹${Number(destination.averageCost).toLocaleString("en-IN")}`
        : fallback?.budget || "Check local prices"),
    rating: destination.rating ?? fallback?.rating ?? null,
  };
}

async function getDestinations() {
  let apiRecords = [];

  try {
    const response = await api.get("/destinations");
    const records = response?.destinations;
    if (Array.isArray(records)) apiRecords = records;
  } catch {
    // The ML CSV remains the source of truth and keeps Explore usable
    // when the optional destination API is unavailable.
  }

  const apiByName = new Map(
    apiRecords.map((record) => [
      String(record.name || "").trim().toLowerCase(),
      record,
    ])
  );

  return localDestinations.map((local) => {
    const remote = apiByName.get(local.name.trim().toLowerCase());
    return normalizeDestination({
      ...local,
      ...(remote || {}),
      destinationId: local.destinationId || local.id,
      destination_id: local.destinationId || local.id,
      // Keep MongoDB ID separately; do not confuse it with D001-style IDs.
      _id: remote?._id || null,
    });
  });
}

async function getDestinationById(id) {
  if (!id) {
    throw new Error("A destination ID is required.");
  }

  const key = String(id);
  const local = localById.get(key);

  if (local) {
    let remote = null;
    try {
      const response = await api.get(
        `/destinations/${encodeURIComponent(key)}`
      );
      remote = response?.data ?? response?.destination ?? response;
    } catch {
      // Canonical dataset has enough information to display the destination.
    }

    return normalizeDestination({
      ...local,
      ...(remote && remote.name ? remote : {}),
      destinationId: local.destinationId || local.id,
      destination_id: local.destinationId || local.id,
      _id: remote?._id || null,
    });
  }

  // Compatibility path for links/bookmarks that still contain a MongoDB ID.
  const response = await api.get(`/destinations/${encodeURIComponent(key)}`);
  const record = response?.data ?? response?.destination ?? response;

  if (!record || !(record._id || record.id || record.destination_id)) {
    throw new Error("The requested destination was not found.");
  }

  return normalizeDestination(record);
}

export { normalizeDestination };
const destinationService = { getDestinations, getDestinationById };
export default destinationService;
