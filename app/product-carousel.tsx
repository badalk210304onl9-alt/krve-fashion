
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
  if (!products || products.length === 0) return null;

  const formatPrice = (price: number | string) =>
    Number(price).toLocaleString("en-IN");

  const getImage = (product: Product) =>
    product.image || product.imageUrl || product.gallery?.[0] || "";

  return (
    <section className="krve-carousel">
      <div className="krve-carousel-heading">
        <div>
          <span className="krve-carousel-eyebrow">
            THE KRVE EDIT
          </span>
          <h2>Fresh Fits. Signature Style.</h2>
        </div>

        <Link href="/collections" className="krve-carousel-all">
          VIEW ALL <span>→</span>
        </Link>
      </div>

      <div className="krve-carousel-viewport">
        <div className="krve-carousel-track">
          {[...products, ...products].map((product, index) => {
            const image = getImage(product);
            const productUrl = `/products/${product.slug || product.id}`;

            return (
              <article
                className="krve-carousel-card"
                key={`${product.id}-${index}`}
              >
                <Link
                  href={productUrl}
                  className="krve-carousel-photo"
                  aria-label={`Shop ${product.name}`}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 600px) 100px, 120px"
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <span className="krve-carousel-placeholder">
                      KRVE
                    </span>
                  )}
                </Link>

                <div className="krve-carousel-info">
                  <span className="krve-carousel-label">
                    NEW ARRIVAL
                  </span>

                  <Link
                    href={productUrl}
                    className="krve-carousel-name"
                  >
                    {product.name}
                  </Link>

                  <div className="krve-carousel-prices">
                    <span className="krve-carousel-price">
                      {product.currency || "₹"}
                      {formatPrice(product.price)}
                    </span>

                    {product.compareAtPrice &&
                      Number(product.compareAtPrice) >
                        Number(product.price) && (
                        <del className="krve-carousel-old-price">
                          {product.currency || "₹"}
                          {formatPrice(product.compareAtPrice)}
                        </del>
                      )}
                  </div>

                  <Link
                    href={productUrl}
                    className="krve-carousel-shop"
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
        .krve-carousel {
          width: 100%;
          box-sizing: border-box;
          margin: 0 auto;
          padding: 14px 3.4% 18px;
          color: #f7f1e6;
          background: #0b0906;
          border-bottom: 1px solid #403018;
        }

        .krve-carousel-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }

        .krve-carousel-eyebrow {
          display: block;
          color: #d9b45e;
          font-size: 9px;
          letter-spacing: 2px;
          line-height: 1.5;
        }

        .krve-carousel-heading h2 {
          margin: 2px 0 0;
          color: #f7f1e6;
          font-family: Georgia, serif;
          font-size: clamp(16px, 1.7vw, 23px);
          font-weight: 400;
          line-height: 1.25;
        }

        .krve-carousel-all {
          flex-shrink: 0;
          color: #e5c16c;
          font-size: 11px;
          text-decoration: none;
          white-space: nowrap;
        }

        .krve-carousel-all span {
          font-size: 16px;
        }

        .krve-carousel-viewport {
          width: 100%;
          overflow: hidden;
          border: 1px solid #403018;
          border-radius: 4px;
          background: #100d08;
        }

        .krve-carousel-track {
          display: flex;
          width: max-content;
          animation: krve-carousel-scroll 35s linear infinite;
          will-change: transform;
        }

        .krve-carousel-viewport:hover .krve-carousel-track {
          animation-play-state: paused;
        }

        .krve-carousel-card {
          display: flex;
          flex: 0 0 270px;
          width: 270px;
          height: 132px;
          box-sizing: border-box;
          align-items: center;
          gap: 12px;
          padding: 9px;
          border-right: 1px solid #352818;
          overflow: hidden;
        }

        .krve-carousel-photo {
          position: relative;
          display: block;
          flex: 0 0 104px;
          width: 104px;
          height: 112px;
          box-sizing: border-box;
          overflow: hidden;
          background: #19150f;
          border: 1px solid #302517;
          border-radius: 3px;
        }

        .krve-carousel-placeholder {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          color: #d9b45e;
          font-family: Georgia, serif;
          font-size: 18px;
        }

        .krve-carousel-info {
          display: flex;
          flex: 1;
          min-width: 0;
          flex-direction: column;
          align-items: flex-start;
          gap: 5px;
        }

        .krve-carousel-label {
          color: #d9b45e;
          font-size: 8px;
          letter-spacing: 1.2px;
          white-space: nowrap;
        }

        .krve-carousel-name {
          display: -webkit-box;
          width: 100%;
          overflow: hidden;
          color: #f7f1e6;
          font-size: 12px;
          line-height: 1.35;
          text-decoration: none;
          overflow-wrap: anywhere;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .krve-carousel-prices {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 6px;
        }

        .krve-carousel-price {
          color: #e8c46f;
          font-size: 12px;
          font-weight: 600;
        }

        .krve-carousel-old-price {
          color: #a39b8d;
          font-size: 10px;
        }

        .krve-carousel-shop {
          margin-top: 2px;
          color: #f7f1e6;
          font-size: 9px;
          letter-spacing: 0.8px;
          text-decoration: none;
          white-space: nowrap;
        }

        .krve-carousel-shop:hover {
          color: #e8c46f;
        }

        @keyframes krve-carousel-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 600px) {
          .krve-carousel {
            padding: 11px 12px 14px;
          }

          .krve-carousel-card {
            flex-basis: 238px;
            width: 238px;
            height: 118px;
            gap: 9px;
            padding: 7px;
          }

          .krve-carousel-photo {
            flex-basis: 88px;
            width: 88px;
            height: 102px;
          }

          .krve-carousel-track {
            animation-duration: 30s;
          }

          .krve-carousel-name {
            font-size: 11px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .krve-carousel-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
