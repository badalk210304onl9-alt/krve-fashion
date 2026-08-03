export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "signature-blazer",
    name: "KrvE Signature Blazer",
    price: 199,
    image: "/images/products/product-1.jpg",
    category: "Tailoring",
    description: "A structured black blazer with a refined KRVE signature finish."
  },
  {
    id: "luxe-shirt",
    name: "KrvE Luxe Shirt",
    price: 129,
    image: "/images/products/product-2.jpg",
    category: "Shirts",
    description: "A sleek black shirt designed for evening sophistication."
  },
  {
    id: "travel-duffle",
    name: "KrvE Travel Duffle",
    price: 249,
    image: "/images/products/product-3.jpg",
    category: "Accessories",
    description: "A premium black duffle crafted for polished travel."
  },
  {
    id: "elite-sneakers",
    name: "KrvE Elite Sneakers",
    price: 179,
    image: "/images/products/product-4.jpg",
    category: "Footwear",
    description: "Minimal black sneakers built for refined everyday wear."
  }
];

export function productBySlug(slug: string) {
  return products.find((product) => product.id === slug);
}
