"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/catalog";

type ProductCarouselProps = {
  products: Product[];
};

export default function ProductCarousel({
  products,
}: ProductCarouselProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (products.length < 2) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % products.length);
    }, 3800);

    return () => window.clearInterval(timer);
  }, [products.length]);

  if (!products.length) return null;

  const product = products[active];
  const image =
    product.image || product.imageUrl || product.gallery?.[0];

  return (
    <section className="krve-product-carousel">
      <div className="krve-carousel-heading">
        <span>THE KRVE EDIT</span>
        <span>NEW SEASON · NEW STYLE</span>
      </div>

      <div className="krve-carousel-slide">
        <div className="krve-carousel-photo">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 700px) 100vw, 55vw"
            />
          ) : (
            <div className="krve-carousel-no-image">
              KRVE
            </div>
          )}
        </div>

        <div className="krve-carousel-info">
          <span className="krve-carousel-label">
            NEW ARRIVAL
          </span>

          <h2>{product.name}</h2>

          <p className="krve-carousel-description">
            Discover your next signature look with KRVE.
          </p>

          <div className="krve-carousel-price">
            {product.currency || "₹"}{" "}
            {Number(product.price).toLocaleString("en-IN")}

            {product.compareAtPrice &&
              Number(product.compareAtPrice) > Number(product.price) && (
                <del>
                  {" "}
                  {product.currency || "₹"}{" "}
                  {Number(product.compareAtPrice).toLocaleString("en-IN")}
                </del>
              )}
          </div>

          <Link
            href={`/products/${product.slug || product.id}`}
            className="krve-carousel-shop"
          >
            SHOP NOW <span>→</span>
          </Link>

          <div className="krve-carousel-controls">
            <button
              type="button"
              aria-label="Previous product"
              onClick={() =>
                setActive((active - 1 + products.length) % products.length)
              }
            >
              ←
            </button>

            <span>
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(products.length).padStart(2, "0")}
            </span>

            <button
              type="button"
              aria-label="Next product"
              onClick={() =>
                setActive((active + 1) % products.length)
              }
            >
              →
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .krve-product-carousel {
          margin: 22px auto;
          padding: 0 5%;
          color: #f8f3e9;
        }

        .krve-carousel-heading {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 12px;
          color: #c8a96b;
          font-size: 10px;
          letter-spacing: 2px;
        }

        .krve-carousel-slide {
          display: grid;
          grid-template-columns: 55% 45%;
          min-height: 330px;
          overflow: hidden;
          background: #111;
          border: 1px solid #493b25;
        }

        .krve-carousel-photo {
          position: relative;
          min-height: 330px;
          background: #1b1915;
        }

        .krve-carousel-photo :global(img) {
          object-fit: cover;
          object-position: center;
        }

        .krve-carousel-no-image {
          display: grid;
          height: 100%;
          min-height: 330px;
          place-items: center;
          color: #c8a96b;
          font-size: 42px;
          letter-spacing: 8px;
        }

        .krve-carousel-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: clamp(20px, 4vw, 55px);
        }

        .krve-carousel-label {
          color: #c8a96b;
          font-size: 10px;
          letter-spacing: 3px;
        }

        .krve-carousel-info h2 {
          margin: 16px 0 10px;
          font-family: Georgia, serif;
          font-size: clamp(25px, 4vw, 46px);
          font-weight: 400;
        }

        .krve-carousel-description {
          color: #bcb8af;
          font-size: 13px;
          line-height: 1.8;
        }

        .krve-carousel-price {
          margin: 12px 0 22px;
          font-size: 18px;
        }

        .krve-carousel-price del {
          color: #999;
          font-size: 12px;
        }

        .krve-carousel-shop {
          display: inline-flex;
          gap: 24px;
          align-items: center;
          padding: 13px 20px;
          border: 1px solid #c8a96b;
          color: #f8f3e9;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-decoration: none;
        }

        .krve-carousel-shop:hover {
          background: #c8a96b;
          color: #111;
        }

        .krve-carousel-controls {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 24px;
          color: #c8a96b;
          font-size: 11px;
        }

        .krve-carousel-controls button {
          width: 34px;
          height: 34px;
          border: 1px solid #5a4a30;
          background: transparent;
          color: #f8f3e9;
          cursor: pointer;
        }

        @media (max-width: 650px) {
          .krve-product-carousel {
            padding: 0 4%;
          }

          .krve-carousel-heading {
            font-size: 8px;
            letter-spacing: 1px;
          }

          .krve-carousel-slide {
            grid-template-columns: 1fr;
          }

          .krve-carousel-photo {
            min-height: 280px;
          }

          .krve-carousel-info {
            padding: 24px;
          }

          .krve-carousel-info h2 {
            font-size: 30px;
          }
        }
      `}</style>
    </section>
  );
}
