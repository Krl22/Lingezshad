type Location = {
  name: string;
  description: string;
  position: { lat: number; lng: number };
  pinColor: string;
  route: string;
  iconUrl: string;
};

const LocationsList: Location[] = [
  {
    name: "Store",
    description: "Learn vocabulary and phrases related to shopping.",
    position: { lat: 42.3551, lng: -71.0656 }, // Boston Common
    pinColor: "#FBBC04", // Amarillo
    route: "/store",
    iconUrl: "https://img.icons8.com/color/48/000000/shop.png",
  },

  {
    name: "Hospital",
    description:
      "Understand medical terms and common phrases used in healthcare.",
    position: { lat: 42.3651, lng: -71.0616 }, // Massachusetts General Hospital
    pinColor: "#EA4335", // Rojo
    route: "/hospital",
    iconUrl: "https://img.icons8.com/color/48/000000/hospital-3.png",
  },
  {
    name: "Bank",
    description:
      "Familiarize yourself with financial terminology and banking procedures.",
    position: { lat: 42.377, lng: -71.0603 }, // Cambridge near Harvard University
    pinColor: "#4285F4", // Azul
    route: "/bank",
    iconUrl: "https://img.icons8.com/color/48/000000/bank.png",
  },
  {
    name: "Restaurant",
    description:
      "Practice ordering food and interacting with restaurant staff.",
    position: { lat: 42.3933, lng: -71.0465 }, // East Boston
    pinColor: "#34A853", // Verde
    route: "/restaurant",
    iconUrl: "https://img.icons8.com/color/48/000000/restaurant.png",
  },
  {
    name: "School",
    description: "Learn phrases and vocabulary related to education.",
    position: { lat: 42.3001, lng: -71.0589 }, // Dorchester
    pinColor: "#FF6F00", // Naranja
    route: "/school",
    iconUrl: "https://img.icons8.com/color/48/000000/school.png",
  },
  {
    name: "Park",
    description:
      "Explore vocabulary and phrases used in recreational settings.",
    position: { lat: 42.4134, lng: -71.0101 }, // Revere
    pinColor: "#9C27B0", // Morado
    route: "/park",
    iconUrl: "https://img.icons8.com/color/48/000000/park-bench.png",
  },
];

export default LocationsList;
