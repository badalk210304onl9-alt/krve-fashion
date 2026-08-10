"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ProductDetailsSections from "@/components/product/product-details-sections";
import ProductPurchasePanel from "@/components/product/product-purchase-panel";
import type {
  KrveProduct,
} from "@/lib/api";

import styles from "@/app/product/[slug]/page.module.css";

type ProductShowcaseProps = {
  product: KrveProduct;
};

function formatPrice(
  price: number,
  currency = "INR",
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    },
  ).format(price);
}

function normaliseToken(
  value: string,
) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function uniqueImages(
  product: KrveProduct,
) {
  return Array.from(
    new Set(
      [
        product.imageUrl,
        product.image,
        ...(Array.isArray(product.gallery)
          ? product.gallery
          : []),
      ].filter(
        (value): value is string =>
          typeof value === "string" &&
          value.trim().length > 0,
      ),
    ),
  );
}

function buildColourGalleries(
  product: KrveProduct,
) {
  const allImages =
    uniqueImages(product);

  const colours =
    product.colours.length > 0
      ? product.colours
      : ["Default"];

  const result:
    Record<string, string[]> =
    {};

  /*
    BEST CASE:
    If image URLs contain the colour name
    (for example powder-blue-front.jpg,
    powder-blue-back.jpg), those images are
    automatically grouped with that colour.
  */

  colours.forEach(
    (colour) => {
      const colourToken =
        normaliseToken(
          colour,
        );

      const matched =
        allImages.filter(
          (image) =>
            normaliseToken(
              image,
            ).includes(
              colourToken,
            ),
        );

      if (
        matched.length > 0
      ) {
        result[colour] =
          matched.slice(
            0,
            5,
          );
      }
    },
  );

  /*
    FALLBACK:
    If filenames do not contain colour names,
    flat product.gallery images are distributed
    colour-by-colour. Upload 4–5 images per colour
    to get a Flipkart-style unique gallery for
    every variant.
  */

  const coloursWithoutMatch =
    colours.filter(
      (colour) =>
        !result[colour]
          ?.length,
    );

  if (
    coloursWithoutMatch.length >
    0
  ) {
    const requestedPerColour =
      5;

    const availablePerColour =
      Math.max(
        1,
        Math.floor(
          allImages.length /
            colours.length,
        ),
      );

    const perColour =
      Math.min(
        requestedPerColour,
        availablePerColour,
      );

    colours.forEach(
      (
        colour,
        colourIndex,
      ) => {
        if (
          result[colour]
            ?.length
        ) {
          return;
        }

        const start =
          colourIndex *
          perColour;

        const chunk =
          allImages.slice(
            start,
            start +
              perColour,
          );

        result[colour] =
          chunk.length > 0
            ? chunk
            : allImages.slice(
                0,
                Math.min(
                  5,
                  allImages.length,
                ),
              );
      },
    );
  }

  return {
    colours,
    galleries:
      result,
    allImages,
  };
}

function colourSwatch(
  colour: string,
) {
  const value =
    colour
      .toLowerCase()
      .trim();

  const swatches:
    Record<string, string> =
    {
      black:
        "#111111",
      white:
        "#f5f5f5",
      blue:
        "#7aa6cc",
      "powder blue":
        "#a8c9e8",
      navy:
        "#17213c",
      red:
        "#aa2832",
      maroon:
        "#711f2b",
      green:
        "#2d6a4f",
      olive:
        "#6f7544",
      yellow:
        "#d7ae37",
      gold:
        "#c79b35",
      beige:
        "#c7aa87",
      brown:
        "#72513d",
      pink:
        "#c97c91",
      purple:
        "#75528d",
      grey:
        "#777777",
      gray:
        "#777777",
      orange:
        "#ce7138",
      cream:
        "#ded0b4",
    };

  for (
    const [
      key,
      color,
    ] of Object.entries(
      swatches,
    )
  ) {
    if (
      value.includes(key)
    ) {
      return color;
    }
  }

  return "#4a4a4a";
}

function discountPercentage(
  product: KrveProduct,
) {
  if (
    !product.compareAtPrice ||
    product.compareAtPrice <=
      product.price
  ) {
    return null;
  }

  return Math.round(
    ((product.compareAtPrice -
      product.price) /
      product.compareAtPrice) *
      100,
  );
}

export default function ProductShowcase({
  product,
}: ProductShowcaseProps) {
  const galleryData =
    useMemo(
      () =>
        buildColourGalleries(
          product,
        ),
      [product],
    );

  const [
    selectedColour,
    setSelectedColour,
  ] =
    useState(
      galleryData.colours[0] ||
        "",
    );

  const [
    selectedImageIndex,
    setSelectedImageIndex,
  ] =
    useState(0);

  const [
    wishlistAdded,
    setWishlistAdded,
  ] =
    useState(false);

  const selectedGallery =
    galleryData.galleries[
      selectedColour
    ] ||
    galleryData.allImages;

  const selectedImage =
    selectedGallery[
      selectedImageIndex
    ] ||
    selectedGallery[0] ||
    product.imageUrl ||
    product.image ||
    "/images/products/product-1.jpg";

  const discount =
    discountPercentage(
      product,
    );

  useEffect(() => {
    setSelectedImageIndex(
      0,
    );
  }, [selectedColour]);

  useEffect(() => {
    try {
      const wishlist =
        JSON.parse(
          window.localStorage.getItem(
            "krve-wishlist",
          ) || "[]",
        ) as string[];

      setWishlistAdded(
        wishlist.includes(
          product.id,
        ),
      );
    } catch {
      setWishlistAdded(
        false,
      );
    }
  }, [product.id]);

  function moveImage(
    direction: number,
  ) {
    if (
      selectedGallery.length <=
      1
    ) {
      return;
    }

    setSelectedImageIndex(
      (current) =>
        (current +
          direction +
          selectedGallery.length) %
        selectedGallery.length,
    );
  }

  function toggleWishlist() {
    try {
      const wishlist =
        JSON.parse(
          window.localStorage.getItem(
            "krve-wishlist",
          ) || "[]",
        ) as string[];

      const next =
        wishlist.includes(
          product.id,
        )
          ? wishlist.filter(
              (id) =>
                id !==
                product.id,
            )
          : [
              ...wishlist,
              product.id,
            ];

      window.localStorage.setItem(
        "krve-wishlist",
        JSON.stringify(next),
      );

      setWishlistAdded(
        next.includes(
          product.id,
        ),
      );

      window.dispatchEvent(
        new CustomEvent(
          "krve-wishlist-updated",
          {
            detail: next,
          },
        ),
      );
    } catch (error) {
      console.error(
        "KRVE_WISHLIST_ERROR",
        error,
      );
    }
  }

  return (
    <div
      className={
        styles.productGrid
      }
    >
      <section
        className={
          styles.galleryColumn
        }
      >
        <div
          className={
            styles.desktopGallery
          }
        >
          <aside
            className={
              styles.verticalThumbs
            }
            aria-label="Product images"
          >
            {selectedGallery
              .slice(0, 5)
              .map(
                (
                  image,
                  index,
                ) => (
                  <button
                    type="button"
                    key={`${selectedColour}-${image}-${index}`}
                    className={`${styles.verticalThumb} ${
                      index ===
                      selectedImageIndex
                        ? styles.verticalThumbActive
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedImageIndex(
                        index,
                      )
                    }
                    aria-label={`View ${selectedColour} image ${index + 1}`}
                  >
                    <Image
                      src={
                        image
                      }
                      alt={`${product.name} ${selectedColour} view ${index + 1}`}
                      fill
                      sizes="84px"
                      className={
                        styles.thumbImage
                      }
                    />
                  </button>
                ),
              )}
          </aside>

          <div
            className={
              styles.mainImageCard
            }
          >
            <Image
              src={
                selectedImage
              }
              alt={`${product.name} - ${selectedColour}`}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 52vw"
              className={
                styles.mainImage
              }
            />

            <div
              className={
                styles.imageLabels
              }
            >
              <span>
                {
                  product.category
                }
              </span>

              {product.newArrival ? (
                <strong>
                  New Arrival
                </strong>
              ) : null}
            </div>

            <button
              type="button"
              className={`${styles.imageWishlist} ${
                wishlistAdded
                  ? styles.imageWishlistActive
                  : ""
              }`}
              onClick={
                toggleWishlist
              }
              aria-label="Toggle wishlist"
            >
              <Heart
                size={21}
                fill={
                  wishlistAdded
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

            {selectedGallery.length >
            1 ? (
              <>
                <button
                  type="button"
                  className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`}
                  onClick={() =>
                    moveImage(
                      -1,
                    )
                  }
                  aria-label="Previous image"
                >
                  <ChevronLeft
                    size={20}
                  />
                </button>

                <button
                  type="button"
                  className={`${styles.galleryArrow} ${styles.galleryArrowRight}`}
                  onClick={() =>
                    moveImage(
                      1,
                    )
                  }
                  aria-label="Next image"
                >
                  <ChevronRight
                    size={20}
                  />
                </button>
              </>
            ) : null}
          </div>
        </div>

        <div
          className={
            styles.mobileThumbs
          }
        >
          {selectedGallery
            .slice(0, 5)
            .map(
              (
                image,
                index,
              ) => (
                <button
                  type="button"
                  key={`mobile-${selectedColour}-${image}-${index}`}
                  className={`${styles.mobileThumb} ${
                    index ===
                    selectedImageIndex
                      ? styles.mobileThumbActive
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedImageIndex(
                      index,
                    )
                  }
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    sizes="92px"
                    className={
                      styles.thumbImage
                    }
                  />
                </button>
              ),
            )}
        </div>
      </section>

      <aside
        className={
          styles.detailsColumn
        }
      >
        <section
          className={
            styles.productIdentity
          }
        >
          <p
            className={
              styles.eyebrow
            }
          >
            KRVE Signature
            Collection
          </p>

          <h1>
            {product.name}
          </h1>

          <div
            className={
              styles.ratingLine
            }
          >
            <span
              className={
                styles.ratingBadge
              }
            >
              4.7
              <Star
                size={12}
                fill="currentColor"
              />
            </span>

            <span>
              Premium customer
              rating
            </span>
          </div>

          <div
            className={
              styles.topPrice
            }
          >
            <strong>
              {formatPrice(
                product.price,
                product.currency,
              )}
            </strong>

            {product.compareAtPrice &&
            product.compareAtPrice >
              product.price ? (
              <del>
                {formatPrice(
                  product.compareAtPrice,
                  product.currency,
                )}
              </del>
            ) : null}

            {discount !==
            null ? (
              <span>
                {discount}% OFF
              </span>
            ) : null}
          </div>

          <p
            className={
              styles.taxText
            }
          >
            Inclusive of all taxes
          </p>
        </section>

        {galleryData.colours.length >
          0 && (
          <section
            className={
              styles.colourSection
            }
          >
            <div
              className={
                styles.sectionLabelRow
              }
            >
              <strong>
                SELECT COLOUR:
              </strong>

              <span>
                {selectedColour}
              </span>
            </div>

            <div
              className={
                styles.colourCards
              }
            >
              {galleryData.colours.map(
                (
                  colour,
                ) => {
                  const image =
                    galleryData.galleries[
                      colour
                    ]?.[0] ||
                    product.imageUrl ||
                    product.image;

                  return (
                    <button
                      key={
                        colour
                      }
                      type="button"
                      onClick={() =>
                        setSelectedColour(
                          colour,
                        )
                      }
                      className={`${styles.colourCard} ${
                        selectedColour ===
                        colour
                          ? styles.colourCardActive
                          : ""
                      }`}
                    >
                      <div
                        className={
                          styles.colourCardImage
                        }
                      >
                        {image ? (
                          <Image
                            src={
                              image
                            }
                            alt={`${product.name} ${colour}`}
                            fill
                            sizes="90px"
                            className={
                              styles.thumbImage
                            }
                          />
                        ) : null}
                      </div>

                      <span
                        className={
                          styles.colourName
                        }
                      >
                        <i
                          style={{
                            background:
                              colourSwatch(
                                colour,
                              ),
                          }}
                        />

                        {
                          colour
                        }
                      </span>
                    </button>
                  );
                },
              )}
            </div>

            <div
              className={
                styles.selectedColourGallery
              }
            >
              <div
                className={
                  styles.selectedColourTitle
                }
              >
                <strong>
                  {
                    selectedColour
                  }
                </strong>

                <span>
                  {
                    selectedGallery.length
                  }{" "}
                  photos
                </span>
              </div>

              <div
                className={
                  styles.selectedColourThumbs
                }
              >
                {selectedGallery
                  .slice(0, 5)
                  .map(
                    (
                      image,
                      index,
                    ) => (
                      <button
                        type="button"
                        key={`colour-gallery-${image}-${index}`}
                        className={`${styles.colourGalleryThumb} ${
                          index ===
                          selectedImageIndex
                            ? styles.colourGalleryThumbActive
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedImageIndex(
                            index,
                          )
                        }
                      >
                        <Image
                          src={
                            image
                          }
                          alt={`${selectedColour} view ${index + 1}`}
                          fill
                          sizes="110px"
                          className={
                            styles.thumbImage
                          }
                        />
                      </button>
                    ),
                  )}
              </div>
            </div>
          </section>
        )}

        <section
          className={
            styles.descriptionSection
          }
        >
          <h2>
            Product Story
          </h2>

          <p>
            {product.description ||
              product.shortDescription ||
              "A premium KRVE creation designed for modern luxury, comfort and confident everyday styling."}
          </p>
        </section>

        <ProductPurchasePanel
          product={product}
          selectedColour={
            selectedColour
          }
          onSelectedColourChange={
            setSelectedColour
          }
          selectedImage={
            selectedImage
          }
          hideHeaderPrice
          hideColourSelector
        />

        <ProductDetailsSections
          product={product}
        />
      </aside>
    </div>
  );
}
