import destinations from "../data/destinations";

let chosenDestination = null;

export function getFeaturedDestination() {
  if (!chosenDestination) {
    chosenDestination =
      destinations[Math.floor(Math.random() * destinations.length)];
  }

  return chosenDestination;
}