"use client";

import {
  useCallback,
  useEffect,
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


type ProductReview = {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  reviewText: string;
  verifiedBuyer: boolean;
  createdAt: string;
  updatedAt?: string;
};

type ReviewSummary = {
  totalReviews: number;
  averageRating: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};

type ReviewsApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    summary?: ReviewSummary;
    reviews?: ProductReview[];
  };
  summary?: ReviewSummary;
  reviews?: ProductReview[];
};

const EMPTY_REVIEW_SUMMARY: ReviewSummary = {
  totalReviews: 0,
  averageRating: 0,
  distribution: {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  },
};

const REVIEWS_API_BASE_URL = (
  process.env.NEXT_PUBLIC_KRVE_CENTRAL_API_URL ||
  "https://krve-central-api.badalk210304-onl9.workers.dev"
).replace(/\/+$/, "");

function getReviewProductKey(
  product: KrveProduct,
) {
  return (
    product.slug ||
    product.id
  );
}

function getReviewsEndpoint(
  product: KrveProduct,
) {
  return `${REVIEWS_API_BASE_URL}/products/${encodeURIComponent(
    getReviewProductKey(product),
  )}/reviews`;
}

function formatReviewDate(
  value: string,
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function reviewRatingLabel(
  rating: number,
) {
  if (rating >= 4.5) {
    return "Excellent";
  }

  if (rating >= 4) {
    return "Very Good";
  }

  if (rating >= 3) {
    return "Good";
  }

  if (rating >= 2) {
    return "Average";
  }

  if (rating > 0) {
    return "Needs Improvement";
  }

  return "No ratings yet";
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
    reviews,
    setReviews,
  ] =
    useState<ProductReview[]>(
      [],
    );

  const [
    reviewSummary,
    setReviewSummary,
  ] =
    useState<ReviewSummary>(
      EMPTY_REVIEW_SUMMARY,
    );

  const [
    reviewsLoading,
    setReviewsLoading,
  ] =
    useState(true);

  const [
    reviewSubmitting,
    setReviewSubmitting,
  ] =
    useState(false);

  const [
    selectedRating,
    setSelectedRating,
  ] =
    useState(0);

  const [
    hoveredRating,
    setHoveredRating,
  ] =
    useState(0);

  const [
    reviewerName,
    setReviewerName,
  ] =
    useState("");

  const [
    reviewerEmail,
    setReviewerEmail,
  ] =
    useState("");

  const [
    reviewText,
    setReviewText,
  ] =
    useState("");

  const [
    reviewMessage,
    setReviewMessage,
  ] =
    useState<{
      type:
        | "success"
        | "error";
      text: string;
    } | null>(null);

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

  const loadReviews =
    useCallback(
      async () => {
        setReviewsLoading(
          true,
        );

        try {
          const response =
            await fetch(
              getReviewsEndpoint(
                product,
              ),
              {
                method: "GET",
                headers: {
                  Accept:
                    "application/json",
                },
                cache:
                  "no-store",
              },
            );

          const payload =
            (await response.json()) as ReviewsApiResponse;

          if (!response.ok) {
            throw new Error(
              payload.message ||
                "Reviews could not be loaded.",
            );
          }

          const data =
            payload.data ||
            payload;

          setReviews(
            Array.isArray(
              data.reviews,
            )
              ? data.reviews
              : [],
          );

          setReviewSummary(
            data.summary ||
              EMPTY_REVIEW_SUMMARY,
          );
        } catch (error) {
          console.error(
            "KRVE_REVIEWS_LOAD_ERROR",
            error,
          );

          setReviews([]);
          setReviewSummary(
            EMPTY_REVIEW_SUMMARY,
          );
        } finally {
          setReviewsLoading(
            false,
          );
        }
      },
      [product],
    );

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  async function submitReview() {
    setReviewMessage(
      null,
    );

    if (
      selectedRating < 1 ||
      selectedRating > 5
    ) {
      setReviewMessage({
        type: "error",
        text: "Please select a star rating.",
      });

      return;
    }

    if (
      reviewerName.trim()
        .length < 2
    ) {
      setReviewMessage({
        type: "error",
        text: "Please enter your name.",
      });

      return;
    }

    if (
      reviewText.trim()
        .length < 5
    ) {
      setReviewMessage({
        type: "error",
        text: "Please write a little more about your experience.",
      });

      return;
    }

    setReviewSubmitting(
      true,
    );

    try {
      const response =
        await fetch(
          getReviewsEndpoint(
            product,
          ),
          {
            method: "POST",
            headers: {
              Accept:
                "application/json",
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                customerName:
                  reviewerName.trim(),
                customerEmail:
                  reviewerEmail
                    .trim()
                    .toLowerCase(),
                rating:
                  selectedRating,
                reviewText:
                  reviewText.trim(),
              }),
          },
        );

      const payload =
        (await response.json()) as {
          success?: boolean;
          message?: string;
        };

      if (!response.ok) {
        throw new Error(
          payload.message ||
            "Review could not be submitted.",
        );
      }

      setSelectedRating(0);
      setHoveredRating(0);
      setReviewerName("");
      setReviewerEmail("");
      setReviewText("");

      setReviewMessage({
        type: "success",
        text: "Thank you. Your review has been submitted successfully.",
      });

      await loadReviews();
    } catch (error) {
      setReviewMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Review could not be submitted.",
      });
    } finally {
      setReviewSubmitting(
        false,
      );
    }
  }

  const reviewBars =
    ([5, 4, 3, 2, 1] as const).map(
      (rating) => {
        const count =
          reviewSummary
            .distribution[
            rating
          ] || 0;

        const width =
          reviewSummary
            .totalReviews >
          0
            ? `${Math.round(
                (count /
                  reviewSummary.totalReviews) *
                  100,
              )}%`
            : "0%";

        return {
          rating,
          count,
          width,
        };
      },
    );

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
                  {reviewSummary.totalReviews >
                  0
                    ? reviewSummary.averageRating.toFixed(
                        1,
                      )
                    : "0.0"}
                </strong>

                <Star
                  size={21}
                  fill="currentColor"
                />
              </div>

              <span>
                {reviewRatingLabel(
                  reviewSummary.averageRating,
                )}
              </span>

              <p>
                {reviewSummary.totalReviews ===
                1
                  ? "Based on 1 customer review"
                  : `Based on ${reviewSummary.totalReviews} customer reviews`}
              </p>
            </div>

            <div className="krve-rating-bars">
              {reviewBars.map(
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

                    <small>
                      {item.count}
                    </small>
                  </div>
                ),
              )}
            </div>

            <div className="krve-review-write-box">
              <div className="krve-review-write-heading">
                <div>
                  <span>
                    Share your experience
                  </span>

                  <h3>
                    Write a review
                  </h3>

                  <p>
                    Rate this product and
                    help other KRVE
                    customers make a
                    confident choice.
                  </p>
                </div>
              </div>

              <div className="krve-review-form">
                <label>
                  <span>
                    Your rating *
                  </span>

                  <div
                    className="krve-review-star-picker"
                    onMouseLeave={() =>
                      setHoveredRating(
                        0,
                      )
                    }
                  >
                    {[1, 2, 3, 4, 5].map(
                      (rating) => {
                        const active =
                          rating <=
                          (hoveredRating ||
                            selectedRating);

                        return (
                          <button
                            type="button"
                            key={
                              rating
                            }
                            onMouseEnter={() =>
                              setHoveredRating(
                                rating,
                              )
                            }
                            onClick={() =>
                              setSelectedRating(
                                rating,
                              )
                            }
                            aria-label={`${rating} star rating`}
                            aria-pressed={
                              selectedRating ===
                              rating
                            }
                          >
                            <Star
                              size={28}
                              fill={
                                active
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>
                        );
                      },
                    )}
                  </div>

                  {selectedRating >
                    0 && (
                    <small>
                      {
                        selectedRating
                      }{" "}
                      out of 5 stars
                    </small>
                  )}
                </label>

                <div className="krve-review-form-grid">
                  <label>
                    <span>
                      Your name *
                    </span>

                    <input
                      type="text"
                      value={
                        reviewerName
                      }
                      onChange={(
                        event,
                      ) =>
                        setReviewerName(
                          event.target
                            .value,
                        )
                      }
                      maxLength={80}
                      placeholder="Enter your name"
                      autoComplete="name"
                    />
                  </label>

                  <label>
                    <span>
                      Email
                    </span>

                    <input
                      type="email"
                      value={
                        reviewerEmail
                      }
                      onChange={(
                        event,
                      ) =>
                        setReviewerEmail(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Enter your email (optional)"
                      autoComplete="email"
                    />
                  </label>
                </div>

                <label>
                  <span>
                    Your review *
                  </span>

                  <textarea
                    value={
                      reviewText
                    }
                    onChange={(
                      event,
                    ) =>
                      setReviewText(
                        event.target
                          .value,
                      )
                    }
                    maxLength={1500}
                    rows={5}
                    placeholder="Tell us about the quality, fit, comfort and your overall experience..."
                  />

                  <small>
                    {
                      reviewText.length
                    }
                    /1500
                  </small>
                </label>

                {reviewMessage && (
                  <div
                    className={`krve-review-message ${
                      reviewMessage.type ===
                      "success"
                        ? "success"
                        : "error"
                    }`}
                  >
                    {
                      reviewMessage.text
                    }
                  </div>
                )}

                <button
                  type="button"
                  className="krve-submit-review-button"
                  onClick={() =>
                    void submitReview()
                  }
                  disabled={
                    reviewSubmitting
                  }
                >
                  {reviewSubmitting
                    ? "SUBMITTING..."
                    : "SUBMIT REVIEW"}
                </button>
              </div>
            </div>

            <div className="krve-review-list-heading">
              <div>
                <h3>
                  Customer reviews
                </h3>

                <p>
                  Genuine feedback from
                  KRVE customers.
                </p>
              </div>

              <strong>
                {
                  reviewSummary.totalReviews
                }{" "}
                review
                {reviewSummary.totalReviews ===
                1
                  ? ""
                  : "s"}
              </strong>
            </div>

            {reviewsLoading ? (
              <div className="krve-review-empty">
                Loading customer
                reviews...
              </div>
            ) : reviews.length ===
              0 ? (
              <div className="krve-review-empty">
                <Star
                  size={28}
                />

                <strong>
                  Be the first to review
                  this product
                </strong>

                <p>
                  Your feedback will
                  appear here after you
                  submit it.
                </p>
              </div>
            ) : (
              <div className="krve-review-cards">
                {reviews.map(
                  (review) => (
                    <article
                      key={
                        review.id
                      }
                    >
                      <div>
                        <strong>
                          {
                            review.rating
                          }{" "}
                          ★
                        </strong>

                        {review.verifiedBuyer ? (
                          <span>
                            Verified Buyer
                          </span>
                        ) : (
                          <span>
                            Customer Review
                          </span>
                        )}
                      </div>

                      <p>
                        {
                          review.reviewText
                        }
                      </p>

                      <small>
                        {
                          review.customerName
                        }

                        {review.createdAt
                          ? ` · ${formatReviewDate(
                              review.createdAt,
                            )}`
                          : ""}
                      </small>
                    </article>
                  ),
                )}
              </div>
            )}

            <style jsx>{`
              .krve-review-write-box {
                margin-top: 28px;
                border: 1px solid
                  rgba(
                    255,
                    255,
                    255,
                    0.12
                  );
                background: rgba(
                  255,
                  255,
                  255,
                  0.035
                );
                padding: 24px;
              }

              .krve-review-write-heading
                span {
                display: block;
                color: #d8a529;
                font-size: 10px;
                font-weight: 900;
                letter-spacing: 0.14em;
                text-transform: uppercase;
              }

              .krve-review-write-heading
                h3 {
                margin: 7px 0 0;
                color: #fff;
                font-size: 22px;
              }

              .krve-review-write-heading
                p {
                margin: 8px 0 0;
                max-width: 620px;
                color: #8b8b8b;
                font-size: 13px;
                line-height: 1.65;
              }

              .krve-review-form {
                display: grid;
                gap: 18px;
                margin-top: 22px;
              }

              .krve-review-form label {
                display: grid;
                gap: 8px;
              }

              .krve-review-form
                label
                > span {
                color: #ddd;
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 0.04em;
              }

              .krve-review-form input,
              .krve-review-form
                textarea {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid
                  rgba(
                    255,
                    255,
                    255,
                    0.13
                  );
                background: #0b0b0b;
                color: #fff;
                outline: none;
                padding: 13px 14px;
                font: inherit;
              }

              .krve-review-form input {
                min-height: 46px;
              }

              .krve-review-form
                textarea {
                resize: vertical;
                min-height: 125px;
              }

              .krve-review-form input:focus,
              .krve-review-form
                textarea:focus {
                border-color: #d8a529;
                box-shadow: 0 0 0 2px
                  rgba(
                    216,
                    165,
                    41,
                    0.12
                  );
              }

              .krve-review-form
                label
                > small {
                color: #777;
                font-size: 10px;
              }

              .krve-review-form-grid {
                display: grid;
                grid-template-columns:
                  repeat(2, minmax(0, 1fr));
                gap: 14px;
              }

              .krve-review-star-picker {
                display: flex;
                align-items: center;
                gap: 4px;
              }

              .krve-review-star-picker
                button {
                display: grid;
                place-items: center;
                border: 0;
                background: transparent;
                color: #d8a529;
                cursor: pointer;
                padding: 2px;
                transition:
                  transform 0.15s ease,
                  opacity 0.15s ease;
              }

              .krve-review-star-picker
                button:hover {
                transform: scale(1.12);
              }

              .krve-submit-review-button {
                justify-self: start;
                min-width: 180px;
                min-height: 46px;
                border: 1px solid #d8a529;
                background: #d8a529;
                color: #050505;
                padding: 0 20px;
                font-size: 10px;
                font-weight: 900;
                letter-spacing: 0.08em;
                cursor: pointer;
              }

              .krve-submit-review-button:disabled {
                cursor: wait;
                opacity: 0.6;
              }

              .krve-review-message {
                padding: 11px 13px;
                border: 1px solid;
                font-size: 12px;
                line-height: 1.5;
              }

              .krve-review-message.success {
                border-color: rgba(
                  16,
                  185,
                  129,
                  0.35
                );
                background: rgba(
                  16,
                  185,
                  129,
                  0.08
                );
                color: #8ee8c8;
              }

              .krve-review-message.error {
                border-color: rgba(
                  239,
                  68,
                  68,
                  0.35
                );
                background: rgba(
                  239,
                  68,
                  68,
                  0.08
                );
                color: #ffaaaa;
              }

              .krve-review-list-heading {
                display: flex;
                align-items: end;
                justify-content:
                  space-between;
                gap: 16px;
                margin-top: 32px;
                padding-bottom: 13px;
                border-bottom: 1px solid
                  rgba(
                    255,
                    255,
                    255,
                    0.09
                  );
              }

              .krve-review-list-heading
                h3 {
                margin: 0;
                color: #fff;
                font-size: 17px;
              }

              .krve-review-list-heading
                p {
                margin: 5px 0 0;
                color: #777;
                font-size: 11px;
              }

              .krve-review-list-heading
                > strong {
                color: #d8a529;
                font-size: 11px;
              }

              .krve-review-empty {
                display: grid;
                justify-items: center;
                gap: 8px;
                margin-top: 18px;
                border: 1px dashed
                  rgba(
                    255,
                    255,
                    255,
                    0.12
                  );
                padding: 34px 20px;
                text-align: center;
                color: #777;
                font-size: 12px;
              }

              .krve-review-empty svg {
                color: #d8a529;
              }

              .krve-review-empty
                strong {
                color: #ddd;
                font-size: 13px;
              }

              .krve-review-empty p {
                margin: 0;
              }

              .krve-rating-bars
                > div {
                grid-template-columns:
                  42px 1fr 30px;
              }

              .krve-rating-bars
                > div
                > small {
                color: #777;
                text-align: right;
                font-size: 10px;
              }

              @media (
                max-width: 720px
              ) {
                .krve-review-write-box {
                  padding: 18px;
                }

                .krve-review-form-grid {
                  grid-template-columns:
                    1fr;
                }

                .krve-submit-review-button {
                  width: 100%;
                }
              }
            `}</style>
          </div>
        )}
      </section>
    </div>
  );
}
