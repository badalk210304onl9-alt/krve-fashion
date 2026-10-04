import { getAllProducts } from "@/lib/api";

import CollectionsClient from "./collections-client";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export const metadata = {
  title: "Collections | KRVE The Fashion Studio",
  description:
    "Explore KRVE menswear, womenswear, kidswear, accessories and footwear.",
};

export default async function CollectionsPage() {
  let products = [];

  try {
    products = await getAllProducts();
  } catch (error) {
    console.error(
      "COLLECTIONS_PRODUCTS_ERROR",
      error,
    );
  }

  return (
    <CollectionsClient
      initialProducts={products}
      apiConnected={products.length > 0}
    />
  );
}
