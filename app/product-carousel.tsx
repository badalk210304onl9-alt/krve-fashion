
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog";

type ProductCarouselProps = {
  products: Product[];
};

type ProductWithImages = Product & {
  images?: Array<string | { url?: string; src?: string }>;
  thumbnail?: string;
  featuredImage?: string;
  image_url?: string;
  imageUrl?: string;
  gallery?: Array<string | { url?: string; src?: string }>;
};

function findImage(product: Product): string {
  const p = product as ProductWithImages;

  const candidates = [
    p.image,
    p.imageUrl,
    p.image_url,
    p.thumbnail,
    p.featuredImage,
    ...(p.gallery || []),
    ...(p.images || []),
  ];

  for (const item of candidates) {
    if (typeof item === "string" && item.trim()) return item;

    if (item && typeof item === "object") {
      if (typeof item.url === "string" && item.url.trim()) {
        return item.url;
      }
      if (typeof item.src === "string" && item.src.trim()) {
        return item.src;
      }
    }
  }

  return "";
}

export default function ProductCarousel({
  products,
}: ProductCarouselProps) {
  if (!products?.length) return null;

  const formatPrice = (price: number | string) =>
    Number(price).toLocaleString("en-IN");

  return (
    <section className="krve-products">
      <div className="krve-products-heading">
        <div>
          <span>THE KRVE EDIT</span>
          <h2>Fresh Fits. Signature Style.</h2>
        </div>

        <Link href="/collections" className="krve-products-all">
          VIEW ALL →
        </Link>
      </div>

      <div className="krve-products-window">
        <div className="krve-products-track">
          {[...products, ...products].map((product, index) => {
            const image = findImage(product);
            const href = `/products/${product.slug || product.id}`;

            return (
              <article
                className="krve-product-card"
                key={`${product.id}-${index}`}
              >
                <Link
                  href={href}
                  className="krve-product-photo"
                  aria-label={`Shop ${product.name}`}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      sizes="180px"
                      style={{ objectFit: "contain" }}
                      unoptimized
                    />
                  ) : (
                    <span className="krve-product-no-image">
                      KRVE
                    </span>
                  )}
                </Link>

                <div className="krve-product-info">
                  <span className="krve-product-tag">
                    NEW ARRIVAL
                  </span>

                  <Link href={href} className="krve-product-name">
                    {product.name}
                  </Link>

                  <div className="krve-product-price">
                    {product.currency || "₹"}
                    {formatPrice(product.price)}
                    {product.compareAtPrice &&
                      Number(product.compareAtPrice) >
                        Number(product.price) && (
                        <del>
                          {product.currency || "₹"}
                          {formatPrice(product.compareAtPrice)}
                        </del>
                      )}
                  </div>

                  <Link href={href} className="krve-product-button">
                    SHOP NOW →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .krve-products {
          width: 100%;
          box-sizing: border-box;
          padding: 14px 3.4% 18px;
          color: #f7f1e6;
          background: #0b0906;
          border-bottom: 1px solid #49371d;
        }

        .krve-products-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .krve-products-heading span {
          color: #d9b45e;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .krve-products-heading h2 {
          margin: 3px 0 0;
          font-family: Georgia, serif;
          font-size: clamp(17px, 1.8vw, 23px);
          font-weight: 400;
        }

        .krve-products-all {
          flex-shrink: 0;
          color: #e8c46f;
          font-size: 11px;
          text-decoration: none;
        }

        .krve-products-window {
          width: 100%;
          overflow: hidden;
          border: 1px solid #49371d;
          border-radius: 4px;
          background: #100d08;
        }

        .krve-products-track {
          display: flex;
          width: max-content;
          animation: krve-product-scroll 38s linear infinite;
        }

        .krve-products-window:hover .krve-products-track {
          animation-play-state: paused;
        }

        .krve-product-card {
          flex: 0 0 190px;
          width: 190px;
          min-width: 0;
          box-sizing: border-box;
          padding: 9px;
          border-right: 1px solid #352818;
        }

        .krve-product-photo {
          position: relative;
          display: block;
          width: 100%;
          height: 112px;
          overflow: hidden;
          box-sizing: border-box;
          background: #19150f;
          border: 1px solid #302517;
          border-radius: 3px;
        }

        .krve-product-no-image {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          color: #d9b45e;
          font-family: Georgia, serif;
          font-size: 21px;
        }

        .krve-product-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          padding-top: 9px;
        }

        .krve-product-tag {
          color: #d9b45e;
          font-size: 8px;
          letter-spacing: 1.1px;
        }

        .krve-product-name {
          display: -webkit-box;
          width: 100%;
          min-height: 32px;
          overflow: hidden;
          color: #f7f1e6;
          font-size: 11px;
          line-height: 1.4;
          text-decoration: none;
          overflow-wrap: anywhere;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .krve-product-price {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 6px;
          color: #e8c46f;
          font-size: 12px;
          font-weight: 600;
        }

        .krve-product-price del {
          color: #9d9588;
          font-size: 10px;
          font-weight: 400;
        }

        .krve-product-button {
          color: #f7f1e6;
          font-size: 9px;
          letter-spacing: 0.7px;
          text-decoration: none;
        }

        .krve-product-button:hover {
          color: #e8c46f;
        }

        @keyframes krve-product-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 600px) {
          .krve-products {
            padding: 12px;
          }

          .krve-product-card {
            flex-basis: 165px;
            width: 165px;
            padding: 7px;
          }

          .krve-product-photo {
            height: 105px;
          }

          .krve-products-track {
            animation-duration: 32s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .krve-products-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
