"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  KrveProduct,
} from "@/lib/api";

import {
  useCart,
} from "@/components/cart-provider";

import styles from "./ai-stylist.module.css";

const money =
  new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  );

type StyleProfile = {
  occasion: string;
  aesthetic: string;
  colour: string;
  priority: string;
};

const initialProfile: StyleProfile = {
  occasion: "",
  aesthetic: "",
  colour: "",
  priority: "",
};

const questions = [
  {
    key: "occasion",
    number: "01",
    eyebrow: "YOUR OCCASION",
    title: "Where are you dressing for?",
    description:
      "Choose the setting where you want your KRVE look to perform.",
    options: [
      {
        value: "business",
        label: "Business",
        detail: "Office, meetings and formal events",
      },
      {
        value: "evening",
        label: "Evening",
        detail: "Dinner, celebrations and luxury occasions",
      },
      {
        value: "travel",
        label: "Travel",
        detail: "Premium comfort with effortless elegance",
      },
      {
        value: "everyday",
        label: "Everyday",
        detail: "Refined daily dressing",
      },
    ],
  },
  {
    key: "aesthetic",
    number: "02",
    eyebrow: "PERSONAL STYLE",
    title: "Which aesthetic feels most like you?",
    description:
      "Your selection helps KRVE understand your visual identity.",
    options: [
      {
        value: "classic",
        label: "Classic",
        detail: "Timeless, structured and sophisticated",
      },
      {
        value: "minimal",
        label: "Minimal",
        detail: "Clean, understated and intentional",
      },
      {
        value: "bold",
        label: "Bold",
        detail: "Confident, striking and expressive",
      },
      {
        value: "modern",
        label: "Modern",
        detail: "Contemporary, sharp and versatile",
      },
    ],
  },
  {
    key: "colour",
    number: "03",
    eyebrow: "COLOUR DIRECTION",
    title: "Choose your preferred palette.",
    description:
      "KRVE will prioritise pieces that complement your selected mood.",
    options: [
      {
        value: "black",
        label: "Midnight Black",
        detail: "Powerful and timeless",
      },
      {
        value: "neutral",
        label: "Refined Neutrals",
        detail: "Versatile and understated",
      },
      {
        value: "contrast",
        label: "High Contrast",
        detail: "Sharp and visually distinctive",
      },
      {
        value: "open",
        label: "Surprise Me",
        detail: "Let KRVE intelligence decide",
      },
    ],
  },
  {
    key: "priority",
    number: "04",
    eyebrow: "STYLE PRIORITY",
    title: "What matters most in your selection?",
    description:
      "This determines how your final recommendations are ranked.",
    options: [
      {
        value: "luxury",
        label: "Luxury Presence",
        detail: "Premium impact and elevated craftsmanship",
      },
      {
        value: "versatility",
        label: "Versatility",
        detail: "Multiple looks from one refined piece",
      },
      {
        value: "comfort",
        label: "Comfort",
        detail: "Ease of movement with premium styling",
      },
      {
        value: "statement",
        label: "Statement",
        detail: "A memorable and distinctive appearance",
      },
    ],
  },
] as const;

function SparkleIcon({
  size = 20,
}: {
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function HeartIcon({
  filled = false,
}: {
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      className={filled ? styles.filledHeart : ""}
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v6h6" />
    </svg>
  );
}


const KRVE_API_BASE_URL = (
  process.env.NEXT_PUBLIC_KRVE_CENTRAL_API_URL ||
  "https://krve-central-api.badalk210304-onl9.workers.dev"
).replace(/\/+$/, "");

type PublicProductsResponse = {
  success?: boolean;
  message?: string;
  data?: {
    products?: KrveProduct[];
  };
  products?: KrveProduct[];
};

function getProductImage(
  product: KrveProduct,
) {
  return (
    product.image ||
    product.imageUrl ||
    product.gallery?.[0] ||
    "/images/products/product-1.jpg"
  );
}

function getProductSlug(
  product: KrveProduct,
) {
  return (
    product.slug ||
    product.id
  );
}

function getSearchableProductText(
  product: KrveProduct,
) {
  return [
    product.name,
    product.category,
    product.description,
    product.shortDescription,
    product.sku,
    ...(product.colours || []),
    ...(product.sizes || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function includesAny(
  text: string,
  words: string[],
) {
  return words.some(
    (word) =>
      text.includes(word),
  );
}

function getProductScore(
  product: KrveProduct,
  profile: StyleProfile,
) {
  const text =
    getSearchableProductText(
      product,
    );

  let score = 20;

  /*
    OCCASION
    Rank only from real product information.
  */
  if (
    profile.occasion ===
    "business"
  ) {
    if (
      includesAny(text, [
        "shirt",
        "blazer",
        "formal",
        "trouser",
        "kurta",
        "kurti",
        "classic",
        "structured",
      ])
    ) {
      score += 34;
    }
  }

  if (
    profile.occasion ===
    "evening"
  ) {
    if (
      includesAny(text, [
        "black",
        "premium",
        "luxury",
        "statement",
        "dress",
        "shirt",
        "kurti",
        "embroider",
        "graphic",
      ])
    ) {
      score += 28;
    }
  }

  if (
    profile.occasion ===
    "travel"
  ) {
    if (
      includesAny(text, [
        "oversized",
        "relaxed",
        "comfort",
        "cotton",
        "t-shirt",
        "tee",
        "shirt",
        "footwear",
        "accessories",
      ])
    ) {
      score += 32;
    }
  }

  if (
    profile.occasion ===
    "everyday"
  ) {
    if (
      includesAny(text, [
        "t-shirt",
        "tee",
        "shirt",
        "kurti",
        "cotton",
        "casual",
        "oversized",
        "everyday",
      ])
    ) {
      score += 31;
    }
  }

  /*
    AESTHETIC
  */
  if (
    profile.aesthetic ===
    "classic" &&
    includesAny(text, [
      "classic",
      "minimal",
      "solid",
      "shirt",
      "kurti",
      "elegant",
      "premium",
    ])
  ) {
    score += 24;
  }

  if (
    profile.aesthetic ===
    "minimal" &&
    includesAny(text, [
      "minimal",
      "solid",
      "clean",
      "less is more",
      "focus",
      "simple",
      "neutral",
    ])
  ) {
    score += 27;
  }

  if (
    profile.aesthetic ===
    "bold" &&
    includesAny(text, [
      "graphic",
      "abstract",
      "embroider",
      "statement",
      "print",
      "bold",
      "contrast",
    ])
  ) {
    score += 28;
  }

  if (
    profile.aesthetic ===
    "modern" &&
    includesAny(text, [
      "oversized",
      "modern",
      "graphic",
      "abstract",
      "contemporary",
      "drop shoulder",
      "tee",
      "t-shirt",
    ])
  ) {
    score += 27;
  }

  /*
    COLOUR
  */
  const colours = (
    product.colours || []
  )
    .join(" ")
    .toLowerCase();

  if (
    profile.colour ===
    "black" &&
    (
      colours.includes("black") ||
      text.includes("black") ||
      text.includes("charcoal")
    )
  ) {
    score += 31;
  }

  if (
    profile.colour ===
    "neutral" &&
    includesAny(
      `${colours} ${text}`,
      [
        "white",
        "beige",
        "cream",
        "ivory",
        "grey",
        "gray",
        "charcoal",
        "olive",
        "sage",
        "neutral",
      ],
    )
  ) {
    score += 25;
  }

  if (
    profile.colour ===
    "contrast" &&
    (
      (product.colours?.length ||
        0) > 1 ||
      includesAny(text, [
        "graphic",
        "contrast",
        "abstract",
        "print",
      ])
    )
  ) {
    score += 22;
  }

  if (
    profile.colour ===
    "open"
  ) {
    score += 10;
  }

  /*
    PRIORITY
  */
  if (
    profile.priority ===
    "luxury" &&
    includesAny(text, [
      "premium",
      "luxury",
      "embroider",
      "signature",
      "elegant",
      "collection",
    ])
  ) {
    score += 28;
  }

  if (
    profile.priority ===
    "versatility" &&
    includesAny(text, [
      "everyday",
      "casual",
      "shirt",
      "tee",
      "t-shirt",
      "kurti",
      "solid",
      "minimal",
    ])
  ) {
    score += 26;
  }

  if (
    profile.priority ===
    "comfort" &&
    includesAny(text, [
      "cotton",
      "oversized",
      "relaxed",
      "comfort",
      "soft",
      "tee",
      "t-shirt",
    ])
  ) {
    score += 31;
  }

  if (
    profile.priority ===
    "statement" &&
    includesAny(text, [
      "graphic",
      "abstract",
      "embroider",
      "bold",
      "statement",
      "print",
      "contrast",
    ])
  ) {
    score += 30;
  }

  /*
    BUSINESS PRIORITY:
    Featured/New Arrival products get a small
    ranking boost, but profile match stays primary.
  */
  if (product.featured) {
    score += 5;
  }

  if (product.newArrival) {
    score += 3;
  }

  if (product.inStock) {
    score += 2;
  }

  return score;
}


export default function AiStylistPage() {
  const {
    wishlist,
    toggleWishlist,
  } = useCart();

  const [
    liveProducts,
    setLiveProducts,
  ] =
    useState<KrveProduct[]>(
      [],
    );

  const [
    productsLoading,
    setProductsLoading,
  ] =
    useState(true);

  const [
    productsError,
    setProductsError,
  ] =
    useState("");


  const [
    profile,
    setProfile,
  ] =
    useState<StyleProfile>(
      initialProfile,
    );

  const [
    currentStep,
    setCurrentStep,
  ] =
    useState(0);

  const [
    showResults,
    setShowResults,
  ] =
    useState(false);

  const [
    isAnalysing,
    setIsAnalysing,
  ] =
    useState(false);

  const completedAnswers =
    Object.values(
      profile,
    ).filter(Boolean).length;

  const progress =
    showResults
      ? 100
      : Math.round(
          (
            completedAnswers /
            questions.length
          ) *
            100,
        );

  useEffect(() => {
    let cancelled = false;

    async function loadLiveProducts() {
      setProductsLoading(true);
      setProductsError("");

      try {
        const response =
          await fetch(
            `${KRVE_API_BASE_URL}/products?limit=100`,
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
          (await response.json()) as PublicProductsResponse;

        if (!response.ok) {
          throw new Error(
            payload.message ||
              "KRVE collection could not be loaded.",
          );
        }

        const products =
          payload.data?.products ||
          payload.products ||
          [];

        const publishedProducts =
          products.filter(
            (product) =>
              product.status ===
                "published" &&
              product.inStock !==
                false,
          );

        if (!cancelled) {
          setLiveProducts(
            publishedProducts,
          );
        }
      } catch (error) {
        console.error(
          "AI_STYLIST_PRODUCTS_ERROR",
          error,
        );

        if (!cancelled) {
          setLiveProducts([]);
          setProductsError(
            "Live KRVE collection could not be loaded. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(
            false,
          );
        }
      }
    }

    void loadLiveProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const recommendations =
    useMemo(
      () =>
        liveProducts
          .map(
            (
              product,
            ) => ({
              product,
              score:
                getProductScore(
                  product,
                  profile,
                ),
            }),
          )
          .sort(
            (
              first,
              second,
            ) =>
              second.score -
              first.score,
          )
          .slice(0, 8),
      [
        liveProducts,
        profile,
      ],
    );

  const activeQuestion =
    questions[
      currentStep
    ];

  function selectOption(
    value: string,
  ) {
    setProfile(
      (
        current,
      ) => ({
        ...current,
        [activeQuestion.key]:
          value,
      }),
    );
  }

  function goNext() {
    const selectedValue =
      profile[
        activeQuestion.key
      ];

    if (!selectedValue) {
      return;
    }

    if (
      currentStep <
      questions.length - 1
    ) {
      setCurrentStep(
        (
          current,
        ) =>
          current + 1,
      );

      return;
    }

    setIsAnalysing(
      true,
    );

    window.setTimeout(
      () => {
        setIsAnalysing(
          false,
        );

        setShowResults(
          true,
        );

        window.scrollTo({
          top: 0,
          behavior:
            "smooth",
        });
      },
      1500,
    );
  }

  function goBack() {
    if (
      currentStep >
      0
    ) {
      setCurrentStep(
        (
          current,
        ) =>
          current - 1,
      );
    }
  }

  function restartStylist() {
    setProfile(
      initialProfile,
    );

    setCurrentStep(
      0,
    );

    setShowResults(
      false,
    );

    setIsAnalysing(
      false,
    );
  }

  return (
    <main
      className={
        styles.page
      }
    >
      <section
        className={
          styles.hero
        }
      >
        <div
          className={
            styles.heroGlow
          }
        />

        <div
          className={
            styles.heroMonogram
          }
        >
          K
        </div>

        <div
          className={
            styles.heroContent
          }
        >
          <div
            className={
              styles.heroEyebrow
            }
          >
            <span />

            <SparkleIcon />

            KRVE INTELLIGENCE
          </div>

          <h1>
            Your personal
            <em>
              AI stylist.
            </em>
          </h1>

          <p>
            Discover a refined
            wardrobe selected around
            your lifestyle, aesthetic
            and individuality.
          </p>

          <div
            className={
              styles.heroStats
            }
          >
            <div>
              <strong>
                01
              </strong>

              <span>
                PERSONAL PROFILE
              </span>
            </div>

            <div>
              <strong>
                02
              </strong>

              <span>
                AI ANALYSIS
              </span>
            </div>

            <div>
              <strong>
                03
              </strong>

              <span>
                CURATED LOOKS
              </span>
            </div>
          </div>
        </div>

        <div
          className={
            styles.intelligenceCard
          }
        >
          <div
            className={
              styles.orbit
            }
          >
            <div
              className={
                styles.orbitInner
              }
            >
              <SparkleIcon
                size={42}
              />
            </div>
          </div>

          <p>
            KRVE AI
          </p>

          <h2>
            Style intelligence
            designed around you.
          </h2>

          <span>
            Analysing occasion,
            personality, colour and
            lifestyle preferences.
          </span>
        </div>
      </section>

      {!showResults ? (
        <section
          className={
            styles.stylistSection
          }
        >
          <aside
            className={
              styles.progressPanel
            }
          >
            <p>
              STYLE PROFILE
            </p>

            <h2>
              Let&apos;s define
              your signature.
            </h2>

            <span>
              Complete four refined
              selections to receive
              your personalised KRVE
              recommendations.
            </span>

            <div
              className={
                styles.progressTrack
              }
            >
              <div
                style={{
                  width:
                    `${progress}%`,
                }}
              />
            </div>

            <div
              className={
                styles.progressText
              }
            >
              <strong>
                {completedAnswers}/
                {questions.length}
              </strong>

              <span>
                PROFILE COMPLETE
              </span>
            </div>

            <div
              className={
                styles.stepList
              }
            >
              {questions.map(
                (
                  question,
                  index,
                ) => {
                  const completed =
                    Boolean(
                      profile[
                        question.key
                      ],
                    );

                  const active =
                    currentStep ===
                    index;

                  return (
                    <button
                      type="button"
                      key={
                        question.key
                      }
                      className={`
                        ${styles.stepItem}
                        ${
                          active
                            ? styles.activeStep
                            : ""
                        }
                        ${
                          completed
                            ? styles.completedStep
                            : ""
                        }
                      `}
                      onClick={() =>
                        setCurrentStep(
                          index,
                        )
                      }
                    >
                      <span>
                        {completed ? (
                          <CheckIcon />
                        ) : (
                          question.number
                        )}
                      </span>

                      <div>
                        <strong>
                          {
                            question.eyebrow
                          }
                        </strong>

                        <small>
                          {completed
                            ? "Selection complete"
                            : "Awaiting selection"}
                        </small>
                      </div>
                    </button>
                  );
                },
              )}
            </div>
          </aside>

          <div
            className={
              styles.questionPanel
            }
          >
            <div
              className={
                styles.questionNumber
              }
            >
              {
                activeQuestion.number
              }
            </div>

            <p
              className={
                styles.questionEyebrow
              }
            >
              {
                activeQuestion.eyebrow
              }
            </p>

            <h2>
              {
                activeQuestion.title
              }
            </h2>

            <span
              className={
                styles.questionDescription
              }
            >
              {
                activeQuestion.description
              }
            </span>

            <div
              className={
                styles.optionGrid
              }
            >
              {activeQuestion.options.map(
                (
                  option,
                  index,
                ) => {
                  const selected =
                    profile[
                      activeQuestion.key
                    ] ===
                    option.value;

                  return (
                    <button
                      type="button"
                      key={
                        option.value
                      }
                      className={`
                        ${styles.optionCard}
                        ${
                          selected
                            ? styles.selectedOption
                            : ""
                        }
                      `}
                      onClick={() =>
                        selectOption(
                          option.value,
                        )
                      }
                    >
                      <span
                        className={
                          styles.optionIndex
                        }
                      >
                        0{index + 1}
                      </span>

                      <div>
                        <h3>
                          {
                            option.label
                          }
                        </h3>

                        <p>
                          {
                            option.detail
                          }
                        </p>
                      </div>

                      <span
                        className={
                          styles.optionCheck
                        }
                      >
                        {selected && (
                          <CheckIcon />
                        )}
                      </span>
                    </button>
                  );
                },
              )}
            </div>

            <div
              className={
                styles.navigation
              }
            >
              <button
                type="button"
                className={
                  styles.backButton
                }
                onClick={
                  goBack
                }
                disabled={
                  currentStep ===
                  0
                }
              >
                ← BACK
              </button>

              <button
                type="button"
                className={
                  styles.nextButton
                }
                onClick={
                  goNext
                }
                disabled={
                  !profile[
                    activeQuestion.key
                  ] ||
                  isAnalysing
                }
              >
                {isAnalysing ? (
                  <>
                    ANALYSING PROFILE

                    <span
                      className={
                        styles.loader
                      }
                    />
                  </>
                ) : currentStep ===
                  questions.length -
                    1 ? (
                  <>
                    CREATE MY STYLE
                    PROFILE

                    <SparkleIcon
                      size={17}
                    />
                  </>
                ) : (
                  <>
                    CONTINUE

                    <ArrowIcon />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section
          className={
            styles.resultsSection
          }
        >
          <div
            className={
              styles.resultsHeader
            }
          >
            <div>
              <p>
                YOUR KRVE EDIT
              </p>

              <h2>
                Curated
                exclusively for
                you.
              </h2>

              <span>
                These pieces were
                ranked using your
                selected lifestyle,
                aesthetic and styling
                priorities.
              </span>
            </div>

            <button
              type="button"
              onClick={
                restartStylist
              }
              className={
                styles.restartButton
              }
            >
              <RestartIcon />

              RESTART STYLIST
            </button>
          </div>

          <div
            className={
              styles.profileSummary
            }
          >
            {Object.entries(
              profile,
            ).map(
              (
                [
                  key,
                  value,
                ],
              ) => (
                <div
                  key={
                    key
                  }
                >
                  <span>
                    {key.toUpperCase()}
                  </span>

                  <strong>
                    {value
                      .replace(
                        "-",
                        " ",
                      )
                      .toUpperCase()}
                  </strong>
                </div>
              ),
            )}
          </div>

          <div
            className={
              styles.recommendationGrid
            }
          >
            {productsLoading ? (
              <div
                style={{
                  gridColumn:
                    "1 / -1",
                  minHeight:
                    260,
                  display:
                    "grid",
                  placeItems:
                    "center",
                  border:
                    "1px solid rgba(216,165,41,.25)",
                  color:
                    "#d8a529",
                  letterSpacing:
                    ".12em",
                  fontSize:
                    12,
                }}
              >
                LOADING LIVE KRVE COLLECTION...
              </div>
            ) : productsError ? (
              <div
                style={{
                  gridColumn:
                    "1 / -1",
                  padding:
                    32,
                  border:
                    "1px solid rgba(216,165,41,.25)",
                  color:
                    "#d8a529",
                  textAlign:
                    "center",
                }}
              >
                {productsError}
              </div>
            ) : recommendations.length ===
              0 ? (
              <div
                style={{
                  gridColumn:
                    "1 / -1",
                  padding:
                    42,
                  border:
                    "1px solid rgba(216,165,41,.25)",
                  textAlign:
                    "center",
                  color:
                    "#a29a90",
                }}
              >
                <strong
                  style={{
                    display:
                      "block",
                    color:
                      "#f6efe5",
                    marginBottom:
                      8,
                  }}
                >
                  No live products available
                </strong>

                Publish products from KEOS Center and they will automatically become available to KRVE AI Stylist.
              </div>
            ) : (
              recommendations.map(
                (
                  {
                    product,
                    score,
                  },
                  index,
                ) => {
                  const productKey =
                    getProductSlug(
                      product,
                    );

                  const saved =
                    wishlist.includes(
                      product.id,
                    ) ||
                    wishlist.includes(
                      productKey,
                    );

                  const match =
                    Math.min(
                      98,
                      Math.max(
                        72,
                        72 +
                          Math.round(
                            score /
                              5,
                          ),
                      ),
                    );

                  return (
                    <article
                      key={
                        product.id
                      }
                      className={
                        styles.productCard
                      }
                    >
                      <div
                        className={
                          styles.rankBadge
                        }
                      >
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </div>

                      <button
                        type="button"
                        className={
                          styles.wishlistButton
                        }
                        onClick={() =>
                          toggleWishlist(
                            product.id,
                          )
                        }
                        aria-label={
                          saved
                            ? `Remove ${product.name} from wishlist`
                            : `Save ${product.name} to wishlist`
                        }
                      >
                        <HeartIcon
                          filled={
                            saved
                          }
                        />
                      </button>

                      <Link
                        href={`/product/${encodeURIComponent(
                          productKey,
                        )}`}
                        className={
                          styles.productImage
                        }
                      >
                        <Image
                          src={
                            getProductImage(
                              product,
                            )
                          }
                          alt={
                            product.name
                          }
                          fill
                          sizes="(max-width: 700px) 100vw, 25vw"
                        />

                        <span />
                      </Link>

                      <div
                        className={
                          styles.productContent
                        }
                      >
                        <div
                          className={
                            styles.matchRow
                          }
                        >
                          <span>
                            AI MATCH
                          </span>

                          <strong>
                            {match}%
                          </strong>
                        </div>

                        <div
                          className={
                            styles.matchBar
                          }
                        >
                          <span
                            style={{
                              width:
                                `${match}%`,
                            }}
                          />
                        </div>

                        <p>
                          {String(
                            product.category ||
                              "KRVE COLLECTION",
                          )
                            .replace(
                              /-/g,
                              " ",
                            )
                            .toUpperCase()}
                        </p>

                        <h3>
                          {
                            product.name
                          }
                        </h3>

                        <div
                          className={
                            styles.productPrice
                          }
                        >
                          <strong>
                            {money.format(
                              product.price,
                            )}
                          </strong>

                          <Link
                            href={`/product/${encodeURIComponent(
                              productKey,
                            )}`}
                          >
                            VIEW PIECE
                            <ArrowIcon />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                },
              )
            )}
          </div>

          <section
            className={
              styles.tryOnBanner
            }
          >
            <div
              className={
                styles.tryOnIcon
              }
            >
              <SparkleIcon
                size={32}
              />
            </div>

            <div>
              <p>
                AI VIRTUAL TRY-ON
              </p>

              <h2>
                See your curated
                pieces on you.
              </h2>

              <span>
                Upload your photograph
                and experience your
                recommended KRVE looks
                before purchasing.
              </span>
            </div>

            <Link
              href="/virtual-try-on"
            >
              START VIRTUAL TRY-ON

              <ArrowIcon />
            </Link>
          </section>
        </section>
      )}
    </main>
  );
}
