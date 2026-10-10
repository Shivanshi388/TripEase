import images from "../assets/images";

const { goa, manali, jaipur, rishikesh, kerala, coorg } = images;


const destinations = [
  {
    id: 1,
    name: "Goa",
    location: "India",
    category: "Beach",
    tagline: "Golden shores. Endless sunsets.",
    description:
      "Escape to sunlit beaches, peaceful coastlines, vibrant markets and unforgettable evenings.",
    image: goa,
    bestTime: "November – February",
    budget: "₹15,000 – ₹30,000",
  },
  {
    id: 2,
    name: "Manali",
    location: "Himachal Pradesh",
    category: "Mountain",
    tagline: "Wake up above the clouds.",
    description:
      "Snow-covered mountains, quiet valleys and adventures surrounded by the Himalayas.",
    image: manali,
    bestTime: "October – June",
    budget: "₹12,000 – ₹25,000",
  },
  {
    id: 3,
    name: "Kerala",
    location: "India",
    category: "Nature",
    tagline: "Slow down. Breathe deeper.",
    description:
      "Drift through peaceful backwaters, tropical forests and lush green landscapes.",
    image: kerala,
    bestTime: "September – March",
    budget: "₹18,000 – ₹35,000",
  },
  {
    id: 4,
    name: "Coorg",
    location: "Karnataka",
    category: "Nature",
    tagline: "Find yourself in the green.",
    description:
      "Coffee plantations, misty hills and quiet forest roads make Coorg a natural escape.",
    image: coorg,
    bestTime: "October – March",
    budget: "₹10,000 – ₹22,000",
  },
  {
    id: 5,
    name: "Rishikesh",
    location: "Uttarakhand",
    category: "Adventure",
    tagline: "Where adventure meets peace.",
    description:
      "Experience rivers, mountains, yoga, rafting and peaceful evenings beside the Ganges.",
    image: rishikesh,
    bestTime: "September – April",
    budget: "₹10,000 – ₹20,000",
  },
];

export default destinations;