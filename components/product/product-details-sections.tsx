"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  BadgeIndianRupee,
  ChevronDown,
  ChevronUp,
  Clock3,
  Headphones,
  MapPin,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

import type {
  KrveProduct,
} from "@/lib/api";

type ProductDetailsSectionsProps = {
  product: KrveProduct;
};

function createHighlights(
  product: KrveProduct,
) {
  const description =
    `${product.shortDescription || ""} ${product.description || ""}`
      .toLowerCase();

  const fabric =
    description.includes(
      "cotton",
    )
      ? "Premium Cotton"
      : "Premium Fabric";

  const fit =
    description.includes(
      "oversized",
    )
      ? "Oversized Fit"
      : "Regular Fit";

  const sleeve =
    description.includes(
      "full sleeve",
    )
      ? "Full Sleeve"
      : description.includes(
            "half sleeve",
          )
        ? "Half Sleeve"
        : "Standard Sleeve";

  const pattern =
    description.includes(
      "solid",
    )
      ? "Solid"
      : description.includes(
            "embroider",
          )
        ? "Embroidered"
        : "KRVE Signature";

  return [
    {
      label: "Pack of",
      value: "1",
    },
    {
      label: "Fabric",
      value: fabric,
    },
    {
      label: "Fit",
      value: fit,
    },
    {
      label: "Sleeve",
      value: sleeve,
    },
    {
      label: "Pattern",
      value: pattern,
    },
    {
      label: "Colour",
      value:
        product.colours[0] ||
        "As Shown",
    },
    {
      label: "Category",
      value:
        product.category,
    },
    {
      label: "Country",
      value: "India",
    },
  ];
}

export default function ProductDetailsSections({
  product,
}: ProductDetailsSectionsProps) {
  const [
    locationOpen,
    setLocationOpen,
  ] =
    useState(false);

  const [
    highlightsOpen,
    setHighlightsOpen,
  ] =
    useState(true);

  const [
    detailsOpen,
    setDetailsOpen,
  ] =
    useState(false);

  const [
    reviewsOpen,
    setReviewsOpen,
  ] =
    useState(true);

  const [
    postalCode,
    setPostalCode,
  ] =
    useState("");

  const [
    selectedLocation,
    setSelectedLocation,
  ] =
    useState("");

  const deliveryDate =
    useMemo(() => {
      const date =
        new Date();

      date.setDate(
        date.getDate() + 4,
      );

      return new Intl.DateTimeFormat(
        "en-IN",
        {
          weekday: "short",
          day: "numeric",
          month: "short",
        },
      ).format(date);
    }, []);

  const highlights =
    createHighlights(
      product,
    );

  function applyLocation() {
    if (
      postalCode.trim()
        .length >= 6
    ) {
      setSelectedLocation(
        postalCode.trim(),
      );

      setLocationOpen(
        false,
      );
    }
  }

  return (
    <div className="krve-detail-sections">
      <section className="krve-delivery-section">
        <h2>
          Delivery details
        </h2>

        <button
          type="button"
          className="krve-location-row"
          onClick={() =>
            setLocationOpen(
              (current) =>
                !current,
            )
          }
        >
          <MapPin
            size={18}
          />

          <span>
            {selectedLocation
              ? `Delivering to ${selectedLocation}`
              : "Location not set"}
          </span>

          <strong>
            {selectedLocation
              ? "Change location"
              : "Select delivery location"}
          </strong>

          <ChevronDown
            size={16}
          />
        </button>

        {locationOpen && (
          <div className="krve-location-form">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={
                postalCode
              }
              onChange={(
                event,
              ) =>
                setPostalCode(
                  event.target
                    .value.replace(
                      /\D/g,
                      "",
                    ),
                )
              }
              placeholder="Enter PIN code"
            />

            <button
              type="button"
              onClick={
                applyLocation
              }
            >
              Apply
            </button>
          </div>
        )}

        <div className="krve-delivery-status">
          <div>
            <Truck size={18} />

            <span>
              Delivery by{" "}
              <strong>
                {deliveryDate}
              </strong>
            </span>
          </div>

          <p>
            Order within the next
            few hours for faster
            processing.
          </p>
        </div>

        <div className="krve-seller-row">
          <PackageCheck
            size={18}
          />

          <div>
            <span>
              Fulfilled by
            </span>

            <strong>
              KRVE The Fashion
              Studio
            </strong>

            <small>
              Premium verified
              seller
            </small>
          </div>
        </div>

        <div className="krve-service-grid">
          <div>
            <RotateCcw
              size={21}
            />

            <strong>
              10-Day Return
            </strong>
          </div>

          <div>
            <BadgeIndianRupee
              size={21}
            />

            <strong>
              Cash on Delivery
            </strong>
          </div>

          <div>
            <Headphones
              size={21}
            />

            <strong>
              Customer Support
            </strong>
          </div>

          <div>
            <ShieldCheck
              size={21}
            />

            <strong>
              Secure Payment
            </strong>
          </div>
        </div>
      </section>

      <section className="krve-expand-section">
        <button
          type="button"
          className="krve-expand-heading"
          onClick={() =>
            setHighlightsOpen(
              (current) =>
                !current,
            )
          }
        >
          <span>
            Product highlights
          </span>

          {highlightsOpen ? (
            <ChevronUp
              size={18}
            />
          ) : (
            <ChevronDown
              size={18}
            />
          )}
        </button>

        {highlightsOpen && (
          <div className="krve-highlights-grid">
            {highlights.map(
              (highlight) => (
                <div
                  key={
                    highlight.label
                  }
                >
                  <span>
                    {highlight.label}
                  </span>

                  <strong>
                    {highlight.value}
                  </strong>
                </div>
              ),
            )}
          </div>
        )}
      </section>

      <section className="krve-expand-section">
        <button
          type="button"
          className="krve-expand-heading"
          onClick={() =>
            setDetailsOpen(
              (current) =>
                !current,
            )
          }
        >
          <div>
            <span>
              All details
            </span>

            <small>
              Features,
              description and
              more
            </small>
          </div>

          {detailsOpen ? (
            <ChevronUp
              size={18}
            />
          ) : (
            <ChevronDown
              size={18}
            />
          )}
        </button>

        {detailsOpen && (
          <div className="krve-all-details">
            <article>
              <h3>
                Product
                Description
              </h3>

              <p>
                {product.description ||
                  product.shortDescription ||
                  "A premium KRVE product created with attention to design, quality and everyday comfort."}
              </p>
            </article>

            <article>
              <h3>
                Product
                Information
              </h3>

              <dl>
                <div>
                  <dt>
                    Brand
                  </dt>

                  <dd>
                    KRVE
                  </dd>
                </div>

                <div>
                  <dt>
                    SKU
                  </dt>

                  <dd>
                    {product.sku ||
                      "KRVE"}
                  </dd>
                </div>

                <div>
                  <dt>
                    Category
                  </dt>

                  <dd>
                    {
                      product.category
                    }
                  </dd>
                </div>

                <div>
                  <dt>
                    Available
                    Sizes
                  </dt>

                  <dd>
                    {product.sizes.join(
                      ", ",
                    ) ||
                      "Standard"}
                  </dd>
                </div>

                <div>
                  <dt>
                    Available
                    Colours
                  </dt>

                  <dd>
                    {product.colours.join(
                      ", ",
                    ) ||
                      "As shown"}
                  </dd>
                </div>
              </dl>
            </article>

            <article>
              <h3>
                Care
                Instructions
              </h3>

              <p>
                Machine wash cold
                with similar
                colours. Do not
                bleach. Dry in
                shade. Follow the
                product label for
                best results.
              </p>
            </article>
          </div>
        )}
      </section>

      <section className="krve-expand-section">
        <button
          type="button"
          className="krve-expand-heading"
          onClick={() =>
            setReviewsOpen(
              (current) =>
                !current,
            )
          }
        >
          <span>
            Ratings and reviews
          </span>

          {reviewsOpen ? (
            <ChevronUp
              size={18}
            />
          ) : (
            <ChevronDown
              size={18}
            />
          )}
        </button>

        {reviewsOpen && (
          <div className="krve-reviews-content">
            <div className="krve-rating-summary">
              <div>
                <strong>
                  4.7
                </strong>

                <Star
                  size={21}
                  fill="currentColor"
                />
              </div>

              <span>
                Excellent
              </span>

              <p>
                Based on verified
                KRVE customer
                ratings
              </p>
            </div>

            <div className="krve-rating-bars">
              {[
                {
                  rating: 5,
                  width: "82%",
                },
                {
                  rating: 4,
                  width: "64%",
                },
                {
                  rating: 3,
                  width: "31%",
                },
                {
                  rating: 2,
                  width: "12%",
                },
                {
                  rating: 1,
                  width: "6%",
                },
              ].map(
                (item) => (
                  <div
                    key={
                      item.rating
                    }
                  >
                    <span>
                      {item.rating} ★
                    </span>

                    <div>
                      <i
                        style={{
                          width:
                            item.width,
                        }}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="krve-review-cards">
              <article>
                <div>
                  <strong>
                    5 ★
                  </strong>

                  <span>
                    Verified Buyer
                  </span>
                </div>

                <p>
                  Premium quality,
                  excellent fit and
                  the product looks
                  exactly as shown.
                </p>

                <small>
                  KRVE Customer
                </small>
              </article>

              <article>
                <div>
                  <strong>
                    4 ★
                  </strong>

                  <span>
                    Verified Buyer
                  </span>
                </div>

                <p>
                  Comfortable,
                  stylish and
                  suitable for
                  everyday premium
                  wear.
                </p>

                <small>
                  KRVE Customer
                </small>
              </article>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
