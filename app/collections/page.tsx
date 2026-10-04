import {
  getAllProducts,
} from "@/lib/api";

import type {
  KrveProduct,
} from "@/lib/api";

import CollectionsClient from "./collections-client";

export const dynamic =
  "force-dynamic";

export const metadata = {
  title:
    "Collections | KRVE The Fashion Studio",
  description:
    "Explore KRVE menswear, womenswear, kidswear, accessories and footwear.",
};

export default async function CollectionsPage() {
  let products: KrveProduct[] = [];

  try {
    products =
      await getAllProducts();

    return (
      <CollectionsClient
        initialProducts={products}
        apiConnected={true}
      />
    );
  } catch (error) {
    console.error(
      "COLLECTIONS_PRODUCTS_ERROR",
      error,
    );

    return (
      <CollectionsClient
        initialProducts={[]}
        apiConnected={false}
      />
    );
  }
}
