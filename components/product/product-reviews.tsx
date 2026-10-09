
"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

type ProductReview = {
  id: string;
  productId?: string;
  customerName: string;
  rating: number;
  reviewText: string;
  verifiedBuyer?: boolean;
  createdAt: string;
};

type ReviewSummary = {
  totalReviews: number;
  averageRating: number;
  distribution?: Record<number, number>;
};

type ReviewsResponse = {
  summary?: ReviewSummary;
  reviews?: ProductReview[];
  review?: ProductReview;
  message?: string;
  error?: string;
};

type ProductReviewsProps = {
  productSlug: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_KRVE_CENTRAL_API_URL?.replace(
    /\/+$/,
    "",
  ) ?? "";

export default function ProductReviews({
  productSlug,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({
    totalReviews: 0,
    averageRating: 0,
  });

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const reviewsUrl = `${API_BASE}/products/${encodeURIComponent(
    productSlug,
  )}/reviews`;

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(reviewsUrl, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const data =
        (await response.json()) as ReviewsResponse;

      if (!response.ok) {
        throw new Error(
          data.error || "Reviews could not be loaded.",
        );
      }

      setReviews(data.reviews ?? []);
      setSummary(
        data.summary ?? {
          totalReviews: 0,
          averageRating: 0,
        },
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load reviews.",
      );
    } finally {
      setLoading(false);
    }
  }, [reviewsUrl]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");
    setMessage("");

    const name = customerName.trim();
    const email = customerEmail.trim();
    const text = reviewText.trim();

    if (name.length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    if (text.length < 5) {
      setError("Please write at least 5 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(reviewsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          rating,
          reviewText: text,
        }),
      });

      const data =
        (await response.json()) as ReviewsResponse;

      if (!response.ok) {
        throw new Error(
          data.error || "Your review could not be submitted.",
        );
      }

      setCustomerName("");
      setCustomerEmail("");
      setRating(5);
      setReviewText("");

      setMessage(
        data.message || "Your review was submitted successfully.",
      );

      await loadReviews();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting your review.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="krve-reviews-heading"
      style={{
        background: "#050505",
        color: "#f5f0e6",
        padding: "36px 20px",
        borderTop: "1px solid #3b3017",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "#d8a529",
            letterSpacing: "3px",
            fontSize: 11,
            marginBottom: 10,
          }}
        >
          THE KRVE EXPERIENCE
        </p>

        <h2
          id="krve-reviews-heading"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 30,
            fontWeight: 400,
            margin: "0 0 16px",
          }}
        >
          Customer Reviews
        </h2>

        <div
          style={{
            padding: 20,
            border: "1px solid #3b3017",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              color: "#d8a529",
              fontSize: 25,
            }}
          >
            {"★".repeat(
              Math.round(summary.averageRating),
            )}
            {"☆".repeat(
              5 - Math.round(summary.averageRating),
            )}
          </div>

          <p style={{ margin: "8px 0" }}>
            <strong>
              {summary.averageRating.toFixed(1)} / 5
            </strong>
          </p>

          <p style={{ color: "#aaa", margin: 0 }}>
            Based on {summary.totalReviews}{" "}
            {summary.totalReviews === 1
              ? "customer review"
              : "customer reviews"}
          </p>
        </div>

        <h3
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 22,
            fontWeight: 400,
            marginBottom: 18,
          }}
        >
          Write a Review
        </h3>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: 14,
            marginBottom: 40,
          }}
        >
          <label>
            Your rating
            <div
              role="radiogroup"
              aria-label="Your rating"
              style={{
                display: "flex",
                gap: 8,
                marginTop: 8,
              }}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  onClick={() => setRating(value)}
                  style={{
                    background: "transparent",
                    border: 0,
                    color:
                      value <= rating ? "#d8a529" : "#666",
                    fontSize: 30,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            Name *
            <input
              required
              minLength={2}
              maxLength={100}
              value={customerName}
              onChange={(event) =>
                setCustomerName(event.target.value)
              }
              placeholder="Enter your name"
              autoComplete="name"
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            Email (optional)
            <input
              type="email"
              maxLength={254}
              value={customerEmail}
              onChange={(event) =>
                setCustomerEmail(event.target.value)
              }
              placeholder="Enter your email"
              autoComplete="email"
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            Your review *
            <textarea
              required
              minLength={5}
              maxLength={1500}
              rows={5}
              value={reviewText}
              onChange={(event) =>
                setReviewText(event.target.value)
              }
              placeholder="Share your experience with this product..."
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />
          </label>

          {error && (
            <p role="alert" style={{ color: "#ff8b8b" }}>
              {error}
            </p>
          )}

          {message && (
            <p role="status" style={{ color: "#d8a529" }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: "#d8a529",
              color: "#050505",
              border: 0,
              padding: "14px 20px",
              fontWeight: 700,
              letterSpacing: 1,
              cursor: submitting ? "wait" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
          </button>
        </form>

        <h3
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 22,
            fontWeight: 400,
            marginBottom: 20,
          }}
        >
          Customer Experiences
        </h3>

        {loading ? (
          <p style={{ color: "#aaa" }}>
            Loading customer reviews...
          </p>
        ) : reviews.length === 0 ? (
          <p style={{ color: "#aaa" }}>
            No reviews yet. Be the first to review this product.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {reviews.map((review) => (
              <article
                key={review.id}
                style={{
                  borderTop: "1px solid #3b3017",
                  paddingTop: 18,
                }}
              >
                <div
                  style={{
                    color: "#d8a529",
                    fontSize: 20,
                  }}
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>

                <h4 style={{ margin: "8px 0" }}>
                  {review.customerName}
                  {review.verifiedBuyer && (
                    <span
                      style={{
                        color: "#d8a529",
                        fontSize: 12,
                        marginLeft: 10,
                      }}
                    >
                      Verified Buyer
                    </span>
                  )}
                </h4>

                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.7,
                    color: "#ccc",
                  }}
                >
                  {review.reviewText}
                </p>

                <small style={{ color: "#888" }}>
                  {new Date(review.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </small>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  background: "#101010",
  color: "#f5f0e6",
  border: "1px solid #514323",
  padding: "12px 14px",
  borderRadius: 0,
  outlineColor: "#d8a529",
};
