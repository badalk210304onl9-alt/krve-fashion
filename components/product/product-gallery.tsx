"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import styles from "./product-gallery.module.css";

type ProductGalleryProps = {
  productName: string;
  categoryLabel: string;
  newArrival: boolean;
  images: string[];
};

export default function ProductGallery({
  productName,
  categoryLabel,
  newArrival,
  images,
}: ProductGalleryProps) {
  const galleryImages =
    useMemo(
      () =>
        Array.from(
          new Set(
            images.filter(
              (image) =>
                typeof image ===
                  "string" &&
                image.trim()
                  .length >
                  0,
            ),
          ),
        ).slice(0, 3),
      [images],
    );

  const [
    selectedIndex,
    setSelectedIndex,
  ] =
    useState(0);

  const currentImage =
    galleryImages[
      selectedIndex
    ] ||
    "/images/products/product-1.jpg";

  function move(
    direction: number,
  ) {
    if (
      galleryImages.length <
      2
    ) {
      return;
    }

    setSelectedIndex(
      (current) =>
        (current +
          direction +
          galleryImages.length) %
        galleryImages.length,
    );
  }

  return (
    <section
      className={
        styles.gallery
      }
    >
      <div
        className={
          styles.mainImageCard
        }
      >
        <Image
          src={currentImage}
          alt={`${productName} view ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 58vw"
          className={
            styles.mainImage
          }
        />

        <div
          className={
            styles.labels
          }
        >
          <span>
            {categoryLabel}
          </span>

          {newArrival ? (
            <strong>
              New Arrival
            </strong>
          ) : null}
        </div>

        <button
          type="button"
          className={
            styles.wishlist
          }
          aria-label="Add product to wishlist"
        >
          ♡
        </button>

        {galleryImages.length >
        1 ? (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowLeft}`}
              onClick={() =>
                move(-1)
              }
              aria-label="Previous product image"
            >
              <ChevronLeft
                size={20}
              />
            </button>

            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowRight}`}
              onClick={() =>
                move(1)
              }
              aria-label="Next product image"
            >
              <ChevronRight
                size={20}
              />
            </button>
          </>
        ) : null}

        {galleryImages.length >
        1 ? (
          <div
            className={
              styles.counter
            }
          >
            {selectedIndex +
              1}
            /
            {
              galleryImages.length
            }
          </div>
        ) : null}
      </div>

      {galleryImages.length >
      1 ? (
        <div
          className={
            styles.thumbnails
          }
        >
          {galleryImages.map(
            (
              image,
              index,
            ) => (
              <button
                type="button"
                key={`${image}-${index}`}
                className={`${styles.thumbnail} ${
                  selectedIndex ===
                  index
                    ? styles.thumbnailActive
                    : ""
                }`}
                onClick={() =>
                  setSelectedIndex(
                    index,
                  )
                }
                aria-label={`View product image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="120px"
                  className={
                    styles.thumbnailImage
                  }
                />
              </button>
            ),
          )}
        </div>
      ) : null}
    </section>
  );
}
