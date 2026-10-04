const fallbackImages = {
  grill:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85",
  burger:
    "https://images.unsplash.com/photo-1568901346375-23c9450d58cd?auto=format&fit=crop&w=1200&q=85",
  kitchen:
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=85",
  shawarma:
    "https://images.unsplash.com/photo-1569058242253-92a9a755a0e1?auto=format&fit=crop&w=1200&q=85",
  restaurant:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
};

export function getRestaurantImage(restaurant) {
  if (restaurant?.image) {
    return restaurant.image;
  }

  const name = restaurant?.name?.toLowerCase() || "";

  if (name.includes("burger")) return fallbackImages.burger;
  if (name.includes("shawarma")) return fallbackImages.shawarma;
  if (name.includes("kitchen") || name.includes("thalas")) {
    return fallbackImages.kitchen;
  }
  if (
    name.includes("grill") ||
    name.includes("alfaham") ||
    name.includes("chicken")
  ) {
    return fallbackImages.grill;
  }

  return fallbackImages.restaurant;
}