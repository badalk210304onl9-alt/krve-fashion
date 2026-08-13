"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
  WandSparkles,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  analyzeBodyFromPhoto,
  type BodyAnalysisResult,
} from "@/lib/body-analysis";

const PersonalTwinViewer =
  dynamic(
    () =>
      import(
        "@/components/virtual-try-on/personal-twin-viewer"
      ),
    {
      ssr: false,
      loading: () => (
        <div className="viewer-loading">
          Loading 3D studio...
        </div>
      ),
    },
  );

type Preference =
  | "menswear"
  | "womenswear"
  | "unisex";

type KrveProduct = {
  id: string;
  slug?: string;
  name: string;
  category: string;
  price: number;
  currency?: string;
  image?: string;
  imageUrl?: string;
  gallery?: string[];
  colours?: string[];
  sizes?: string[];
  description?: string;
  shortDescription?: string;
  status?: string;
  inStock?: boolean;
};

type ProductsResponse = {
  success?: boolean;
  data?: {
    products?: KrveProduct[];
  };
  products?: KrveProduct[];
};

const API_BASE = (
  process.env.NEXT_PUBLIC_KRVE_CENTRAL_API_URL ||
  "https://krve-central-api.badalk210304-onl9.workers.dev"
).replace(/\/+$/, "");

const money =
  new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits:
        0,
    },
  );

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

function getProductKey(
  product: KrveProduct,
) {
  return (
    product.slug ||
    product.id
  );
}

function recommendedSize(
  chest: number,
) {
  if (chest <= 86) return "XS";
  if (chest <= 94) return "S";
  if (chest <= 102) return "M";
  if (chest <= 110) return "L";
  if (chest <= 118) return "XL";
  return "XXL";
}

export default function VirtualTryOnPage() {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [
    photoUrl,
    setPhotoUrl,
  ] =
    useState("");

  const [
    heightCm,
    setHeightCm,
  ] =
    useState("170");

  const [
    preference,
    setPreference,
  ] =
    useState<Preference>(
      "unisex",
    );

  const [
    analysis,
    setAnalysis,
  ] =
    useState<BodyAnalysisResult | null>(
      null,
    );

  const [
    busy,
    setBusy,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    products,
    setProducts,
  ] =
    useState<KrveProduct[]>(
      [],
    );

  const [
    loadingProducts,
    setLoadingProducts,
  ] =
    useState(true);

  const [
    productIndex,
    setProductIndex,
  ] =
    useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response =
          await fetch(
            `${API_BASE}/products?limit=100`,
            {
              cache:
                "no-store",
            },
          );

        const payload =
          (await response.json()) as ProductsResponse;

        const liveProducts =
          (
            payload.data?.products ||
            payload.products ||
            []
          ).filter(
            (product) =>
              product.status ===
                "published" &&
              product.inStock !==
                false,
          );

        if (!cancelled) {
          setProducts(
            liveProducts,
          );
        }
      } catch (loadError) {
        console.error(
          loadError,
        );
      } finally {
        if (!cancelled) {
          setLoadingProducts(
            false,
          );
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleProducts =
    useMemo(() => {
      const clothing =
        products.filter(
          (product) =>
            ![
              "accessories",
              "footwear",
            ].includes(
              product.category,
            ),
        );

      if (
        preference ===
        "unisex"
      ) {
        return clothing;
      }

      const exact =
        clothing.filter(
          (product) =>
            product.category ===
              preference ||
            product.category ===
              "unisex",
        );

      return exact.length
        ? exact
        : clothing;
    }, [
      products,
      preference,
    ]);

  useEffect(() => {
    setProductIndex(0);
  }, [preference]);

  const selectedProduct =
    visibleProducts[
      productIndex
    ] || null;

  function handlePhoto(
    file: File,
  ) {
    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      setError(
        "Please upload a JPG, PNG or WEBP image.",
      );
      return;
    }

    if (photoUrl) {
      URL.revokeObjectURL(
        photoUrl,
      );
    }

    setPhotoUrl(
      URL.createObjectURL(
        file,
      ),
    );

    setAnalysis(null);
    setError("");
  }

  async function createTwin() {
    const height =
      Number(heightCm);

    if (!photoUrl) {
      setError(
        "Upload a full-body photo first.",
      );
      return;
    }

    if (
      !Number.isFinite(
        height,
      ) ||
      height <
        120 ||
      height >
        220
    ) {
      setError(
        "Enter a valid height between 120 and 220 cm.",
      );
      return;
    }

    setBusy(true);
    setError("");

    try {
      const image =
        new window.Image();

      image.crossOrigin =
        "anonymous";

      image.src =
        photoUrl;

      await new Promise<void>(
        (
          resolve,
          reject,
        ) => {
          image.onload =
            () =>
              resolve();

          image.onerror =
            () =>
              reject(
                new Error(
                  "Image could not be loaded.",
                ),
              );
        },
      );

      const result =
        await analyzeBodyFromPhoto(
          {
            image,
            heightCm:
              height,
          },
        );

      setAnalysis(
        result,
      );
    } catch (analysisError) {
      console.error(
        analysisError,
      );

      setError(
        analysisError instanceof
          Error
          ? analysisError.message
          : "Body analysis could not be completed.",
      );
    } finally {
      setBusy(false);
    }
  }

  function nextProduct() {
    if (
      !visibleProducts.length
    ) {
      return;
    }

    setProductIndex(
      (current) =>
        current ===
        visibleProducts.length -
          1
          ? 0
          : current +
            1,
    );
  }

  function previousProduct() {
    if (
      !visibleProducts.length
    ) {
      return;
    }

    setProductIndex(
      (current) =>
        current === 0
          ? visibleProducts.length -
            1
          : current -
            1,
    );
  }

  const size =
    analysis
      ? recommendedSize(
          analysis
            .measurements
            .chestCm,
        )
      : null;

  return (
    <main className="page">
      <section className="top">
        <p>
          <Sparkles
            size={15}
          />
          KRVE PERSONAL DIGITAL
          TWIN
        </p>

        <h1>
          See yourself.
          <span>
            Wear KRVE.
          </span>
        </h1>

        <div className="intro">
          Your face texture,
          body proportions and
          height-calibrated avatar
          are generated from your
          uploaded photo in the
          browser. Measurements are
          estimates for size
          recommendation, not
          tailoring.
        </div>
      </section>

      <section className="workspace">
        <aside className="profile">
          <header>
            <b>
              01
            </b>

            <div>
              <small>
                YOUR PROFILE
              </small>

              <h2>
                Build your twin
              </h2>
            </div>
          </header>

          <button
            type="button"
            className="photo"
            onClick={() =>
              inputRef.current?.click()
            }
          >
            {photoUrl ? (
              <Image
                src={
                  photoUrl
                }
                alt="Customer upload"
                fill
                unoptimized
                sizes="360px"
              />
            ) : (
              <div>
                <Upload
                  size={28}
                />

                <strong>
                  Upload full-body
                  photo
                </strong>

                <span>
                  Front-facing,
                  head-to-toe image
                  recommended.
                </span>
              </div>
            )}
          </button>

          <input
            ref={inputRef}
            hidden
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(
              event,
            ) => {
              const file =
                event.target.files?.[0];

              if (file) {
                handlePhoto(
                  file,
                );
              }
            }}
          />

          <label className="height">
            <span>
              HEIGHT
            </span>

            <div>
              <input
                value={
                  heightCm
                }
                onChange={(
                  event,
                ) =>
                  setHeightCm(
                    event.target
                      .value,
                  )
                }
                type="number"
                min="120"
                max="220"
              />

              <b>
                CM
              </b>
            </div>
          </label>

          <div className="preference">
            <span>
              SHOPPING PREFERENCE
            </span>

            <p>
              Choose the collection
              you want to try. We do
              not infer gender
              identity from photos.
            </p>

            <div>
              {([
                "menswear",
                "womenswear",
                "unisex",
              ] as Preference[]).map(
                (item) => (
                  <button
                    type="button"
                    key={
                      item
                    }
                    className={
                      preference ===
                      item
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setPreference(
                        item,
                      )
                    }
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            type="button"
            className="create"
            onClick={() =>
              void createTwin()
            }
            disabled={
              busy
            }
          >
            {busy ? (
              <>
                <LoaderCircle
                  size={18}
                  className="spin"
                />
                ANALYSING BODY...
              </>
            ) : (
              <>
                <WandSparkles
                  size={18}
                />
                CREATE DIGITAL
                TWIN
              </>
            )}
          </button>

          <div className="privacy">
            <ShieldCheck
              size={17}
            />

            <span>
              Analysis runs in the
              customer's browser in
              this version.
            </span>
          </div>
        </aside>

        <section className="viewer">
          <div className="viewer-head">
            <div>
              <b>
                02
              </b>

              <div>
                <small>
                  YOUR DIGITAL TWIN
                </small>

                <h2>
                  3D Preview
                </h2>
              </div>
            </div>

            {analysis && (
              <span className="ready">
                <Check
                  size={14}
                />
                TWIN READY
              </span>
            )}
          </div>

          <div className="viewer-box">
            {analysis ? (
              <PersonalTwinViewer
                analysis={
                  analysis
                }
                garmentImage={
                  selectedProduct
                    ? getProductImage(
                        selectedProduct,
                      )
                    : null
                }
              />
            ) : (
              <div className="waiting">
                <ScanLine
                  size={58}
                />

                <strong>
                  Your personal twin
                  will appear here
                </strong>

                <p>
                  Upload a clear
                  photo and create
                  your twin.
                </p>
              </div>
            )}
          </div>

          {analysis && (
            <div className="measurements">
              <div>
                <span>
                  SHOULDER
                </span>
                <b>
                  {
                    analysis
                      .measurements
                      .shoulderCm
                  }{" "}
                  cm
                </b>
              </div>

              <div>
                <span>
                  CHEST EST.
                </span>
                <b>
                  {
                    analysis
                      .measurements
                      .chestCm
                  }{" "}
                  cm
                </b>
              </div>

              <div>
                <span>
                  WAIST EST.
                </span>
                <b>
                  {
                    analysis
                      .measurements
                      .waistCm
                  }{" "}
                  cm
                </b>
              </div>

              <div>
                <span>
                  HIP EST.
                </span>
                <b>
                  {
                    analysis
                      .measurements
                      .hipCm
                  }{" "}
                  cm
                </b>
              </div>

              <div>
                <span>
                  RECOMMENDED
                </span>
                <b>
                  {size}
                </b>
              </div>

              <div>
                <span>
                  CONFIDENCE
                </span>
                <b>
                  {
                    analysis
                      .measurements
                      .confidence
                  }%
                </b>
              </div>
            </div>
          )}
        </section>

        <aside className="collection">
          <header>
            <b>
              03
            </b>

            <div>
              <small>
                TRY KRVE
              </small>

              <h2>
                Live Collection
              </h2>
            </div>
          </header>

          {loadingProducts ? (
            <div className="loading-products">
              Loading live
              collection...
            </div>
          ) : selectedProduct ? (
            <>
              <div className="product-image">
                <Image
                  src={
                    getProductImage(
                      selectedProduct,
                    )
                  }
                  alt={
                    selectedProduct.name
                  }
                  fill
                  sizes="320px"
                />
              </div>

              <small className="category">
                {
                  selectedProduct.category
                }
              </small>

              <h3>
                {
                  selectedProduct.name
                }
              </h3>

              <strong className="price">
                {money.format(
                  selectedProduct.price,
                )}
              </strong>

              {size && (
                <div className="fit">
                  <Sparkles
                    size={16}
                  />

                  <span>
                    AI size suggestion
                    <b>
                      {size}
                    </b>
                  </span>
                </div>
              )}

              <Link
                href={`/product/${encodeURIComponent(
                  getProductKey(
                    selectedProduct,
                  ),
                )}`}
                className="view-product"
              >
                VIEW PRODUCT
              </Link>

              <div className="nav">
                <button
                  type="button"
                  onClick={
                    previousProduct
                  }
                >
                  <ChevronLeft
                    size={18}
                  />
                  PREVIOUS
                </button>

                <span>
                  {productIndex +
                    1}
                  /
                  {
                    visibleProducts.length
                  }
                </span>

                <button
                  type="button"
                  onClick={
                    nextProduct
                  }
                >
                  NEXT
                  <ChevronRight
                    size={18}
                  />
                </button>
              </div>
            </>
          ) : (
            <div className="loading-products">
              No live clothing
              products available.
            </div>
          )}
        </aside>
      </section>

      <style jsx>{`
        .page{min-height:100vh;background:#050505;color:#f6efe5;--gold:#dda921;--line:rgba(221,169,33,.28)}
        .top{padding:70px clamp(28px,5vw,78px) 55px;border-bottom:1px solid var(--line);background:radial-gradient(circle at 75% 0,rgba(221,169,33,.08),transparent 32%)}
        .top>p{display:flex;align-items:center;gap:9px;color:var(--gold);font-size:10px;font-weight:900;letter-spacing:.15em}.top h1{margin:15px 0 0;font-family:var(--font-display),Georgia,serif;font-size:clamp(55px,6.6vw,100px);font-weight:400;line-height:.88}.top h1 span{display:block;color:var(--gold);font-style:italic}.intro{max-width:850px;margin-top:25px;color:#8b837a;font-size:12px;line-height:1.75}
        .workspace{display:grid;grid-template-columns:minmax(310px,.78fr) minmax(500px,1.55fr) minmax(300px,.72fr);min-height:850px}
        .profile,.collection{padding:42px 30px;background:#070707}.profile{border-right:1px solid var(--line)}.collection{border-left:1px solid var(--line)}
        header,.viewer-head>div{display:flex;gap:13px;align-items:flex-start}header>b,.viewer-head>div>b{color:var(--gold);font-family:var(--font-display),Georgia,serif;font-size:26px;font-weight:500}header small,.viewer-head small{color:#aca39a;font-size:9px;font-weight:900;letter-spacing:.14em}header h2,.viewer-head h2{margin:4px 0 0;font-family:var(--font-display),Georgia,serif;font-size:25px;font-weight:500}
        .photo{position:relative;display:grid;place-items:center;width:100%;height:330px;margin-top:28px;overflow:hidden;border:1px dashed rgba(221,169,33,.48);background:#090909;color:inherit;cursor:pointer}.photo :global(img){object-fit:cover;object-position:center top}.photo>div{display:grid;justify-items:center;gap:13px;padding:25px;text-align:center;color:var(--gold)}.photo strong{color:#eee;font-size:13px}.photo span{max-width:220px;color:#797168;font-size:10px;line-height:1.55}
        .height{display:grid;gap:9px;margin-top:23px}.height>span,.preference>span{color:#aaa197;font-size:9px;font-weight:900;letter-spacing:.12em}.height>div{display:grid;grid-template-columns:1fr 55px;min-height:52px;border:1px solid var(--line)}.height input{border:0;outline:0;background:#070707;color:#fff;padding:0 15px;font-size:16px}.height b{display:grid;place-items:center;border-left:1px solid var(--line);color:var(--gold);font-size:9px}
        .preference{margin-top:23px}.preference p{color:#726b64;font-size:9px;line-height:1.55}.preference>div{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line)}.preference button{min-height:43px;border:0;border-right:1px solid var(--line);background:#070707;color:#7e766e;text-transform:uppercase;font-size:7px;font-weight:900;cursor:pointer}.preference button:last-child{border-right:0}.preference button.active{background:var(--gold);color:#050505}
        .error{margin-top:15px;padding:11px;border:1px solid rgba(239,68,68,.34);color:#ffaaaa;font-size:10px}.create{display:flex;justify-content:center;align-items:center;gap:8px;width:100%;min-height:54px;margin-top:18px;border:1px solid var(--gold);background:linear-gradient(135deg,#c8860f,#efbd43,#d79d1d);color:#050505;font-size:9px;font-weight:950;letter-spacing:.08em;cursor:pointer}.create:disabled{opacity:.65;cursor:wait}.privacy{display:flex;gap:8px;align-items:flex-start;margin-top:15px;color:#706961;font-size:9px;line-height:1.5}.privacy :global(svg){color:var(--gold);flex:0 0 auto}.spin{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
        .viewer{min-width:0;padding:42px 30px;background:radial-gradient(circle at 50% 40%,rgba(221,169,33,.07),transparent 35%),#050505}.viewer-head{display:flex;justify-content:space-between;align-items:flex-start}.ready{display:flex;align-items:center;gap:7px;color:#75df9d;font-size:9px;font-weight:900;letter-spacing:.1em}.viewer-box{min-height:620px;margin-top:22px;border:1px solid var(--line);overflow:hidden}.waiting,.viewer-loading{min-height:620px;display:grid;place-content:center;justify-items:center;gap:17px;text-align:center;color:var(--gold)}.waiting strong{color:#fff;font-family:var(--font-display),Georgia,serif;font-size:28px;font-weight:500}.waiting p{color:#766f66;font-size:10px}
        .measurements{display:grid;grid-template-columns:repeat(6,1fr);margin-top:14px;border:1px solid var(--line)}.measurements>div{display:grid;gap:5px;padding:13px;border-right:1px solid var(--line)}.measurements>div:last-child{border-right:0}.measurements span{color:#625c55;font-size:7px;font-weight:900;letter-spacing:.1em}.measurements b{color:#d8d0c7;font-size:10px}
        .product-image{position:relative;height:310px;margin-top:28px;border:1px solid var(--line);background:#0b0b0b}.product-image :global(img){object-fit:cover}.category{display:block;margin-top:18px;color:var(--gold);text-transform:uppercase;font-size:8px;font-weight:900;letter-spacing:.11em}.collection h3{margin:8px 0 0;font-family:var(--font-display),Georgia,serif;font-size:30px;font-weight:500;line-height:1}.price{display:block;margin-top:13px;color:var(--gold);font-size:18px}.fit{display:flex;gap:9px;align-items:center;margin-top:18px;padding:12px;border:1px solid var(--line);color:var(--gold)}.fit span{display:grid;gap:3px;color:#887f76;font-size:8px}.fit b{color:#fff;font-size:14px}.view-product{display:flex;align-items:center;justify-content:center;min-height:45px;margin-top:13px;border:1px solid var(--gold);color:var(--gold);text-decoration:none;font-size:8px;font-weight:900;letter-spacing:.08em}
        .nav{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;margin-top:14px}.nav button{display:flex;align-items:center;gap:3px;border:0;background:transparent;color:#8b837b;font-size:7px;font-weight:900;cursor:pointer}.nav button:last-child{justify-self:end}.nav span{color:var(--gold);font-size:9px}.loading-products{margin-top:30px;padding:25px;border:1px solid var(--line);color:#756e66;font-size:10px}
        @media(max-width:1200px){.workspace{grid-template-columns:340px 1fr}.collection{grid-column:1/-1;border-left:0;border-top:1px solid var(--line)}.measurements{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:850px){.workspace{grid-template-columns:1fr}.profile{border-right:0;border-bottom:1px solid var(--line)}.viewer{padding:35px 18px}.measurements{grid-template-columns:repeat(2,1fr)}.preference>div{grid-template-columns:1fr}.preference button{border-right:0;border-bottom:1px solid var(--line)}}
      `}</style>
    </main>
  );
}
