"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog";

type ProductCarouselProps = {
  products: Product[];
};

export default function ProductCarousel({
  products,
}: ProductCarouselProps) {
  if (!products.length) return null;

  const formatPrice = (price: number | string) =>
    Number(price).toLocaleString("en-IN");

  return (
    <section className="krve-running-carousel">
      <div className="krve-running-heading">
        <div>
          <span className="krve-running-kicker">THE KRVE EDIT</span>
          <h2>Fresh Fits. Signature Style.</h2>
        </div>

        <Link href="/collections" className="krve-view-all">
          VIEW ALL →
        </Link>
      </div>

      <div className="krve-running-window">
        <div className="krve-running-track">
          {[...products, ...products].map((product, index) => {
            const image =
              product.image ||
              product.imageUrl ||
              product.gallery?.[0];

            return (
              <article
                className="krve-running-card"
                key={`${product.id}-${index}`}
              >
                <Link
                  href={`/products/${product.slug || product.id}`}
                  className="krve-running-image"
                  aria-label={`Shop ${product.name}`}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      sizes="120px"
                    />
                  ) : (
                    <span className="krve-running-placeholder">
                      KRVE
                    </span>
                  )}
                </Link>

                <div className="krve-running-details">
                  <span className="krve-running-tag">
                    NEW ARRIVAL
                  </span>

                  <Link
                    href={`/products/${product.slug || product.id}`}
                    className="krve-running-name"
                  >
                    {product.name}
                  </Link>

                  <div className="krve-running-price">
                    {product.currency || "₹"}{" "}
                    {formatPrice(product.price)}
                  </div>

                  {product.compareAtPrice &&
                    Number(product.compareAtPrice) >
                      Number(product.price) && (
                      <del className="krve-running-old-price">
                        {product.currency || "₹"}{" "}
                        {formatPrice(product.compareAtPrice)}
                      </del>
                    )}

                  <Link
                    href={`/products/${product.slug || product.id}`}
                    className="krve-running-shop"
                  >
                    SHOP NOW →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .krve-running-carousel {
          margin: 12px auto 18px;
          padding: 0 3.5%;
          color: #f7f1e6;
        }

        .krve-running-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }

        .krve-running-kicker {
          color: #d6b15f;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .krve-running-heading h2 {
          margin: 3px 0 0;
          font-family: Georgia, serif;
          font-size: clamp(16px, 2vw, 22px);
          font-weight: 400;
        }

        .krve-view-all {
          color: #e3bf6b;
          font-size: 10px;
          white-space: nowrap;
          text-decoration: none;
        }

        .krve-running-window {
          overflow: hidden;
          border: 1px solid #5c4724;
          border-radius: 5px;
          background: #0c0b09;
        }

        .krve-running-track {
          display: flex;
          width: max-content;
          animation: krve-marquee 32s linear infinite;
        }

        .krve-running-window:hover .krve-running-track {
          animation-play-state: paused;
        }

        .krve-running-card {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 285px;
          min-height: 142px;
          padding: 10px;
          border-right: 1px solid #332818;
          box-sizing: border-box;
        }

        .krve-running-image {
          position: relative;
          display: block;
          flex: 0 0 108px;
          width: 108px;
          height: 120px;
          overflow: hidden;
          background: #191713;
          border: 1px solid #332818;
          border-radius: 3px;
        }

        .krve-running-image :global(img) {
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .krve-running-image:hover :global(img) {
          transform: scale(1.06);
        }

        .krve-running-placeholder {
          display: grid;
          width: 100%;
          height: 100%;
          place-items: center;
          color: #d6b15f;
          font-family: Georgia, serif;
        }

        .krve-running-details {
          display: flex;
          flex: 1;
          min-width: 0;
          flex-direction: column;
          align-items: flex-start;
          gap: 5px;
        }

        .krve-running-tag {
          color: #d6b15f;
          font-size: 8px;
          letter-spacing: 1.3px;
        }

        .krve-running-name {
          display: -webkit-box;
          overflow: hidden;
          color: #f7f1e6;
          font-size: 12px;
          line-height: 1.35;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .krve-running-price {
          color: #e8c46f;
          font-size: 12px;
          font-weight: 600;
        }

        .krve-running-old-price {
          color: #999;
          font-size: 10px;
        }

        .krve-running-shop {
          margin-top: 2px;
          color: #f7f1e6;
          font-size: 9px;
          letter-spacing: 0.8px;
          text-decoration: none;
        }

        .krve-running-shop:hover {
          color: #e8c46f;
        }

        @keyframes krve-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 600px) {
          .krve-running-carousel {
            margin: 10px auto 14px;
            padding: 0 12px;
          }

          .krve-running-card {
            width: 255px;
            min-height: 124px;
            padding: 8px;
            gap: 9px;
          }

          .krve-running-image {
            flex-basis: 92px;
            width: 92px;
            height: 106px;
          }

          .krve-running-track {
            animation-duration: 26s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .krve-running-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
