export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  badge?: string;
  colors: string[];
  sizes: string[];
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "noir-signature-blazer",
    name: "Noir Signature Blazer",
    category: "Tailoring",
    price: 18999,
    oldPrice: 22999,
    description: "A sculpted double-layer blazer with a clean shoulder line and satin-finish detailing.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=85",
    badge: "New",
    colors: ["Black", "Charcoal"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "p2",
    slug: "obsidian-double-breasted-suit",
    name: "Obsidian Double-Breasted Suit",
    category: "Tailoring",
    price: 28999,
    description: "A sharp six-button suit designed for formal evenings, weddings and executive dressing.",
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1400&q=85",
    badge: "Signature",
    colors: ["Black", "Midnight"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "p3",
    slug: "ivory-tailored-shirt",
    name: "Ivory Tailored Shirt",
    category: "Shirts",
    price: 6999,
    description: "A refined ivory shirt with a structured collar and soft stretch construction.",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1400&q=85",
    colors: ["Ivory", "White"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "p4",
    slug: "icon-luxury-sneakers",
    name: "Icon Luxury Sneakers",
    category: "Footwear",
    price: 10999,
    oldPrice: 12999,
    description: "Minimal leather sneakers made for effortless everyday luxury.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85",
    badge: "Bestseller",
    colors: ["White", "Black"],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
  },
  {
    id: "p5",
    slug: "midnight-structured-shirt",
    name: "Midnight Structured Shirt",
    category: "Shirts",
    price: 7499,
    description: "A dark evening shirt with clean geometry and a premium smooth-touch finish.",
    image: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=1400&q=85",
    colors: ["Midnight", "Black"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "p6",
    slug: "signature-travel-jacket",
    name: "Signature Travel Jacket",
    category: "Outerwear",
    price: 14999,
    description: "A lightweight luxury jacket engineered for travel, movement and elevated casual wear.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1400&q=85",
    badge: "Limited",
    colors: ["Black", "Olive", "Stone"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
];

export const productBySlug = (slug: string) => products.find((product) => product.slug === slug);
