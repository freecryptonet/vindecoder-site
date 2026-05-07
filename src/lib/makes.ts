export type Make = { slug: string; name: string };

// 18 popular US-market makes for the homepage brand grid (6×3 desktop / 3×6 mobile).
// Ordered roughly by US 2024 sales volume.
export const TOP_US_MAKES: Make[] = [
  { slug: "toyota", name: "Toyota" },
  { slug: "ford", name: "Ford" },
  { slug: "chevrolet", name: "Chevrolet" },
  { slug: "honda", name: "Honda" },
  { slug: "nissan", name: "Nissan" },
  { slug: "hyundai", name: "Hyundai" },
  { slug: "kia", name: "Kia" },
  { slug: "jeep", name: "Jeep" },
  { slug: "subaru", name: "Subaru" },
  { slug: "gmc", name: "GMC" },
  { slug: "ram", name: "Ram" },
  { slug: "mazda", name: "Mazda" },
  { slug: "volkswagen", name: "Volkswagen" },
  { slug: "bmw", name: "BMW" },
  { slug: "mercedes-benz", name: "Mercedes-Benz" },
  { slug: "lexus", name: "Lexus" },
  { slug: "tesla", name: "Tesla" },
  { slug: "dodge", name: "Dodge" },
];
