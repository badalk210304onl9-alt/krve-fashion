"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
  WandSparkles,
} from "lucide-react";

type Preference = "menswear" | "womenswear" | "unisex";
type TwinStage = "idle" | "reading" | "mapping" | "building" | "ready" | "error";

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
  newArrival?: boolean;
};

type ProductsResponse = {
  success?: boolean;
  message?: string;
  data?: { products?: KrveProduct[] };
  products?: KrveProduct[];
};

const API_BASE = (
  process.env.NEXT_PUBLIC_KRVE_CENTRAL_API_URL ||
  "https://krve-central-api.badalk210304-onl9.workers.dev"
).replace(/\/+$/, "");

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

function productImage(product: KrveProduct) {
  return (
    product.image ||
    product.imageUrl ||
    product.gallery?.[0] ||
    "/images/products/product-1.jpg"
  );
}

function productKey(product: KrveProduct) {
  return product.slug || product.id;
}

export default function VirtualTryOnPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [photoUrl, setPhotoUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [height, setHeight] = useState("170");
  const [preference, setPreference] = useState<Preference>("unisex");
  const [stage, setStage] = useState<TwinStage>("idle");
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState("");

  const [products, setProducts] = useState<KrveProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showGarment, setShowGarment] = useState(true);

  const twinReady = stage === "ready";

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setProductsLoading(true);
      setProductsError("");

      try {
        const response = await fetch(`${API_BASE}/products?limit=100`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        const payload = (await response.json()) as ProductsResponse;

        if (!response.ok) {
          throw new Error(payload.message || "Unable to load products.");
        }

        const rows = payload.data?.products || payload.products || [];
        const live = rows.filter(
          (product) =>
            product.status === "published" && product.inStock !== false,
        );

        if (!cancelled) setProducts(live);
      } catch (err) {
        console.error("VIRTUAL_TRY_ON_PRODUCTS_ERROR", err);
        if (!cancelled) {
          setProductsError("Live KRVE collection could not be loaded.");
        }
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    }

    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const tryOnProducts = useMemo(() => {
    const clothing = products.filter(
      (p) => !["accessories", "footwear"].includes(p.category),
    );

    if (preference === "unisex") return clothing;

    const exact = clothing.filter(
      (p) => p.category === preference || p.category === "unisex",
    );

    return exact.length ? exact : clothing;
  }, [products, preference]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [preference]);

  const selectedProduct = tryOnProducts[selectedIndex] || null;

  function onPhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a JPG, PNG or WEBP image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    if (photoUrl) URL.revokeObjectURL(photoUrl);

    setPhotoUrl(URL.createObjectURL(file));
    setFileName(file.name);
    setStage("idle");
    setError("");
  }

  async function createTwin() {
    const h = Number(height);

    if (!photoUrl) {
      setError("Upload one clear full-body photo first.");
      return;
    }

    if (!Number.isFinite(h) || h < 120 || h > 220) {
      setError("Enter a height between 120 cm and 220 cm.");
      return;
    }

    setError("");

    try {
      setStage("reading");
      await sleep(650);

      setStage("mapping");
      await sleep(800);

      setStage("building");
      await sleep(850);

      setStage("ready");
    } catch {
      setStage("error");
      setError("Digital twin could not be prepared.");
    }
  }

  function prevProduct() {
    if (!tryOnProducts.length) return;

    setSelectedIndex((current) =>
      current === 0 ? tryOnProducts.length - 1 : current - 1,
    );
  }

  function nextProduct() {
    if (!tryOnProducts.length) return;

    setSelectedIndex((current) =>
      current === tryOnProducts.length - 1 ? 0 : current + 1,
    );
  }

  const stageText =
    stage === "reading"
      ? "Reading photo proportions..."
      : stage === "mapping"
        ? "Mapping body landmarks..."
        : stage === "building"
          ? "Building digital twin..."
          : "";

  return (
    <main className="krve-tryon">
      <section className="hero">
        <p className="eyebrow">
          <Sparkles size={15} />
          KRVE DIGITAL FIT LAB
        </p>

        <h1>
          Build your
          <span>digital twin.</span>
        </h1>

        <p className="lead">
          Upload one full-body photo, add your height and create a private
          fitting profile. Then try your live KRVE collection one piece at a
          time.
        </p>
      </section>

      <section className="workspace">
        <aside className="setup">
          <div className="section-title">
            <span>01</span>
            <div>
              <small>DIGITAL TWIN SETUP</small>
              <h2>Create your fitting profile</h2>
            </div>
          </div>

          <button
            type="button"
            className={`upload ${photoUrl ? "has-photo" : ""}`}
            onClick={() => inputRef.current?.click()}
          >
            {photoUrl ? (
              <>
                <Image
                  src={photoUrl}
                  alt="Uploaded full-body photo"
                  fill
                  unoptimized
                  sizes="360px"
                />
                <b>CHANGE PHOTO</b>
              </>
            ) : (
              <div>
                <Upload size={27} />
                <strong>Upload full-body photo</strong>
                <p>Front-facing photo with the full body visible works best.</p>
                <small>JPG, PNG or WEBP · max 10 MB</small>
              </div>
            )}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onPhotoChange}
            hidden
          />

          {fileName && (
            <p className="filename">
              <Check size={14} />
              {fileName}
            </p>
          )}

          <label className="field">
            <span>HEIGHT</span>
            <div>
              <input
                type="number"
                min="120"
                max="220"
                value={height}
                onChange={(event) => {
                  setHeight(event.target.value);
                  setStage("idle");
                }}
              />
              <b>CM</b>
            </div>
          </label>

          <fieldset className="preference">
            <legend>SHOPPING PREFERENCE</legend>
            <p>
              Select the collection you want to try. KRVE does not infer gender
              identity from the photo.
            </p>

            <div>
              {(["menswear", "womenswear", "unisex"] as Preference[]).map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    className={preference === item ? "active" : ""}
                    onClick={() => {
                      setPreference(item);
                      setStage("idle");
                    }}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </fieldset>

          {error && <div className="error">{error}</div>}

          <button
            type="button"
            className="create"
            onClick={() => void createTwin()}
            disabled={["reading", "mapping", "building"].includes(stage)}
          >
            {["reading", "mapping", "building"].includes(stage) ? (
              <>
                <LoaderCircle className="spin" size={18} />
                {stageText}
              </>
            ) : (
              <>
                <WandSparkles size={18} />
                CREATE DIGITAL TWIN
              </>
            )}
          </button>

          <div className="privacy">
            <ShieldCheck size={17} />
            <span>
              This V1 keeps the uploaded photo inside the browser preview.
            </span>
          </div>
        </aside>

        <section className="studio">
          <div className="studio-head">
            <div>
              <small>02 · DIGITAL TWIN</small>
              <h2>Fitting Studio</h2>
            </div>

            <div className="rotate-buttons">
              <button
                type="button"
                disabled={!twinReady}
                onClick={() => setRotation((v) => v - 20)}
              >
                <ArrowLeft size={17} />
              </button>

              <button
                type="button"
                disabled={!twinReady}
                onClick={() => setRotation(0)}
              >
                <RotateCcw size={17} />
              </button>

              <button
                type="button"
                disabled={!twinReady}
                onClick={() => setRotation((v) => v + 20)}
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          <div className="canvas">
            {!twinReady ? (
              <div className="empty">
                <ScanLine size={54} />
                <strong>Your digital twin will appear here.</strong>
                <p>
                  Upload a photo, enter height and select Create Digital Twin.
                </p>
              </div>
            ) : (
              <>
                <div className="ready-badge">● DIGITAL TWIN READY</div>

                <div
                  className="avatar"
                  style={{
                    transform: `translateX(-50%) perspective(900px) rotateY(${rotation}deg)`,
                  }}
                >
                  <div className="head" />
                  <div className="neck" />
                  <div className="torso" />
                  <div className="arm left" />
                  <div className="arm right" />
                  <div className="leg left" />
                  <div className="leg right" />

                  {selectedProduct && showGarment && (
                    <div className="garment">
                      <Image
                        src={productImage(selectedProduct)}
                        alt={selectedProduct.name}
                        fill
                        sizes="260px"
                      />
                    </div>
                  )}
                </div>

                <div className="avatar-meta">
                  <span>
                    HEIGHT <b>{height} CM</b>
                  </span>
                  <span>
                    COLLECTION <b>{preference.toUpperCase()}</b>
                  </span>
                  <span>
                    ROTATION <b>{rotation}°</b>
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="v1-note">
            <b>V1 FOUNDATION</b>
            <p>
              This page provides upload, height calibration, a rotatable digital
              mannequin and live KRVE product try-on flow. Photorealistic
              single-photo 3D body reconstruction and physically accurate cloth
              draping need a dedicated AI/GPU backend, which can be connected
              to this same interface later.
            </p>
          </div>
        </section>
      </section>

      <section className="products">
        <div className="products-head">
          <div>
            <small>03 · LIVE KRVE COLLECTION</small>
            <h2>Try your store, one piece at a time.</h2>
            <p>Only published, in-stock products are loaded from Central API.</p>
          </div>

          <Link href="/collections">BROWSE ALL →</Link>
        </div>

        {productsLoading ? (
          <div className="message">
            <LoaderCircle className="spin" size={22} />
            Loading live KRVE collection...
          </div>
        ) : productsError ? (
          <div className="message error">{productsError}</div>
        ) : !selectedProduct ? (
          <div className="message">
            No published clothing products are available yet.
          </div>
        ) : (
          <div className="product-shell">
            <button type="button" onClick={prevProduct} className="nav">
              <ChevronLeft size={24} />
            </button>

            <article className="product-card">
              <div className="product-image">
                <Image
                  src={productImage(selectedProduct)}
                  alt={selectedProduct.name}
                  fill
                  sizes="(max-width: 900px) 100vw, 45vw"
                />
              </div>

              <div className="product-copy">
                <small>{selectedProduct.category.toUpperCase()}</small>

                <h3>{selectedProduct.name}</h3>

                <strong>{money.format(selectedProduct.price)}</strong>

                <p>
                  {selectedProduct.shortDescription ||
                    selectedProduct.description ||
                    "A live KRVE product from your current collection."}
                </p>

                {!!selectedProduct.colours?.length && (
                  <div>
                    <span>COLOURS</span>
                    <b>{selectedProduct.colours.join(" · ")}</b>
                  </div>
                )}

                {!!selectedProduct.sizes?.length && (
                  <div>
                    <span>SIZES</span>
                    <b>{selectedProduct.sizes.join(" · ")}</b>
                  </div>
                )}

                <div className="actions">
                  <button
                    type="button"
                    disabled={!twinReady}
                    className={showGarment ? "active" : ""}
                    onClick={() => setShowGarment(true)}
                  >
                    TRY ON TWIN
                  </button>

                  <button
                    type="button"
                    disabled={!twinReady}
                    onClick={() => setShowGarment(false)}
                  >
                    REMOVE
                  </button>

                  <Link
                    href={`/product/${encodeURIComponent(
                      productKey(selectedProduct),
                    )}`}
                  >
                    VIEW PRODUCT →
                  </Link>
                </div>
              </div>
            </article>

            <button type="button" onClick={nextProduct} className="nav">
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </section>

      <style jsx>{`
        .krve-tryon{min-height:100vh;background:#050505;color:#f6efe5;--gold:#dfa923;--line:rgba(223,169,35,.28)}
        .hero{padding:80px clamp(28px,5vw,80px);border-bottom:1px solid var(--line);background:radial-gradient(circle at 80% 0,rgba(223,169,35,.08),transparent 35%)}
        .eyebrow{display:flex;gap:10px;align-items:center;color:var(--gold);font-size:11px;font-weight:900;letter-spacing:.15em}
        .hero h1{margin:22px 0 0;font-family:var(--font-display),Georgia,serif;font-size:clamp(58px,7vw,105px);font-weight:400;line-height:.88;letter-spacing:-.04em}
        .hero h1 span{display:block;color:var(--gold);font-style:italic}
        .lead{max-width:780px;color:#8e877f;font-size:14px;line-height:1.8;margin-top:28px}
        .workspace{display:grid;grid-template-columns:minmax(330px,.75fr) minmax(0,1.45fr);min-height:850px}
        .setup{padding:48px clamp(24px,4vw,55px);border-right:1px solid var(--line);background:#070707}
        .section-title{display:flex;gap:15px;align-items:flex-start}
        .section-title>span{display:grid;place-items:center;width:42px;height:42px;border:1px solid var(--line);color:var(--gold);font-family:var(--font-display),serif;font-size:19px}
        .section-title small,.studio-head small,.products-head small{color:var(--gold);font-size:9px;font-weight:900;letter-spacing:.14em}
        .section-title h2,.studio-head h2{margin:5px 0 0;font-family:var(--font-display),serif;font-weight:500;font-size:30px}
        .upload{position:relative;display:grid;place-items:center;width:100%;height:320px;margin-top:30px;overflow:hidden;border:1px dashed rgba(223,169,35,.5);background:#090909;color:inherit;cursor:pointer}
        .upload>div{display:grid;justify-items:center;text-align:center;max-width:250px;padding:25px}
        .upload strong{margin-top:15px;font-size:14px}
        .upload p{color:#827a71;font-size:11px;line-height:1.6}
        .upload small{color:#5f5a54;font-size:9px}
        .upload.has-photo :global(img){object-fit:cover;object-position:center top}
        .upload.has-photo b{position:absolute;left:14px;right:14px;bottom:14px;z-index:2;background:rgba(0,0,0,.8);border:1px solid var(--line);color:var(--gold);padding:13px;font-size:9px;letter-spacing:.1em}
        .filename{display:flex;align-items:center;gap:7px;color:#8cd6a6;font-size:10px}
        .field{display:grid;gap:9px;margin-top:24px}.field>span,.preference legend{color:#aaa198;font-size:9px;font-weight:900;letter-spacing:.12em}
        .field>div{display:grid;grid-template-columns:1fr 55px;min-height:54px;border:1px solid var(--line)}
        .field input{border:0;outline:0;background:#070707;color:#fff;padding:0 16px;font-size:16px}.field b{display:grid;place-items:center;border-left:1px solid var(--line);color:var(--gold);font-size:9px}
        .preference{border:0;padding:0;margin:24px 0 0}.preference p{color:#736d66;font-size:10px;line-height:1.6}
        .preference>div{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line)}
        .preference button{min-height:45px;border:0;border-right:1px solid var(--line);background:#070707;color:#857d75;text-transform:uppercase;font-size:8px;font-weight:900;cursor:pointer}.preference button:last-child{border-right:0}.preference button.active{background:var(--gold);color:#050505}
        .error{margin-top:17px;padding:12px;border:1px solid rgba(239,68,68,.35);background:rgba(239,68,68,.07);color:#ffaaaa;font-size:11px}
        .create{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;min-height:56px;margin-top:22px;border:1px solid var(--gold);background:linear-gradient(135deg,#c98a12,#efbd43,#d99d20);color:#050505;font-size:9px;font-weight:950;letter-spacing:.09em;cursor:pointer}
        .create:disabled{opacity:.7;cursor:wait}.privacy{display:flex;gap:9px;align-items:flex-start;margin-top:18px;color:#736d66;font-size:9px;line-height:1.6}.privacy :global(svg){color:var(--gold);flex:0 0 auto}
        .spin{animation:spin .9s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
        .studio{padding:48px clamp(24px,4vw,58px);background:radial-gradient(circle at 50% 35%,rgba(223,169,35,.08),transparent 34%),#050505}
        .studio-head{display:flex;justify-content:space-between;align-items:flex-start}.rotate-buttons{display:flex;gap:8px}.rotate-buttons button,.nav{display:grid;place-items:center;border:1px solid var(--line);background:#090909;color:var(--gold);cursor:pointer}
        .rotate-buttons button{width:42px;height:42px}.rotate-buttons button:disabled{opacity:.3;cursor:not-allowed}
        .canvas{position:relative;min-height:620px;margin-top:28px;overflow:hidden;border:1px solid var(--line);background:radial-gradient(circle at center,#15120d,#050505 65%)}
        .empty{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;text-align:center;padding:30px;color:var(--gold)}
        .empty strong{margin-top:20px;color:#fff;font-family:var(--font-display),serif;font-size:28px;font-weight:500}.empty p{max-width:360px;color:#766f67;font-size:11px;line-height:1.7}
        .ready-badge{position:absolute;top:20px;left:20px;color:#8cd6a6;font-size:9px;font-weight:900;letter-spacing:.1em}
        .avatar{position:absolute;left:50%;top:70px;width:300px;height:500px;transform-style:preserve-3d;transform-origin:center;transition:transform .4s ease}
        .head{position:absolute;left:50%;top:0;width:70px;height:86px;transform:translateX(-50%);border-radius:48%;background:linear-gradient(100deg,#342f29,#151412 55%,#3b352f)}
        .neck{position:absolute;left:50%;top:80px;width:34px;height:37px;transform:translateX(-50%);background:#25211d}
        .torso{position:absolute;left:50%;top:110px;width:150px;height:205px;transform:translateX(-50%);clip-path:polygon(14% 0,86% 0,100% 35%,78% 100%,22% 100%,0 35%);background:linear-gradient(100deg,#2b2722,#111 50%,#342f29)}
        .arm{position:absolute;top:125px;width:38px;height:235px;border-radius:25px;background:linear-gradient(90deg,#171513,#2d2924)}.arm.left{left:45px;transform:rotate(4deg)}.arm.right{right:45px;transform:rotate(-4deg)}
        .leg{position:absolute;top:300px;width:56px;height:210px;border-radius:10px 10px 25px 25px;background:linear-gradient(90deg,#121110,#2a2622)}.leg.left{left:82px}.leg.right{right:82px}
        .garment{position:absolute;z-index:4;left:50%;top:105px;width:220px;height:250px;transform:translateX(-50%);opacity:.9;mix-blend-mode:screen;pointer-events:none}
        .garment :global(img){object-fit:contain;object-position:center top}
        .avatar-meta{position:absolute;left:20px;right:20px;bottom:17px;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line);background:rgba(0,0,0,.75)}
        .avatar-meta span{display:grid;gap:4px;padding:12px;border-right:1px solid var(--line);color:#6c655e;font-size:8px}.avatar-meta span:last-child{border-right:0}.avatar-meta b{color:#d6cfc7;font-size:9px}
        .v1-note{margin-top:16px;padding:16px 18px;border-left:2px solid var(--gold);background:rgba(223,169,35,.035)}.v1-note b{color:var(--gold);font-size:9px;letter-spacing:.12em}.v1-note p{margin:7px 0 0;color:#716a63;font-size:10px;line-height:1.65}
        .products{padding:75px clamp(28px,5vw,80px) 100px;border-top:1px solid var(--line)}
        .products-head{display:flex;justify-content:space-between;align-items:flex-end;gap:30px;margin-bottom:38px}.products-head h2{margin:7px 0 0;font-family:var(--font-display),serif;font-size:clamp(42px,5vw,70px);font-weight:400;line-height:1}.products-head p{color:#787169;font-size:11px}.products-head>a{color:var(--gold);text-decoration:none;font-size:9px;font-weight:900;letter-spacing:.09em}
        .message{min-height:220px;display:flex;align-items:center;justify-content:center;gap:10px;border:1px solid var(--line);color:#8e867e;font-size:11px}.message.error{color:#ffaaaa}
        .product-shell{display:grid;grid-template-columns:55px minmax(0,1fr) 55px;gap:14px;align-items:center}.nav{width:55px;height:55px}
        .product-card{display:grid;grid-template-columns:minmax(320px,.95fr) minmax(320px,1.05fr);min-height:540px;border:1px solid var(--line);overflow:hidden;background:#070707}
        .product-image{position:relative;min-height:540px}.product-image :global(img){object-fit:cover}
        .product-copy{display:flex;flex-direction:column;justify-content:center;padding:clamp(30px,5vw,65px)}.product-copy>small{color:var(--gold);font-size:9px;font-weight:900;letter-spacing:.12em}.product-copy h3{margin:12px 0 0;font-family:var(--font-display),serif;font-size:clamp(38px,4vw,58px);font-weight:400;line-height:1}.product-copy>strong{margin-top:18px;color:var(--gold);font-size:20px}.product-copy>p{color:#898179;font-size:11px;line-height:1.75}
        .product-copy>div:not(.actions){display:grid;grid-template-columns:75px 1fr;gap:12px;padding:10px 0;border-top:1px solid rgba(255,255,255,.07)}.product-copy span{color:#625d56;font-size:8px;font-weight:900}.product-copy b{color:#b5ada5;font-size:9px}
        .actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:22px}.actions button,.actions a{min-height:44px;border:1px solid var(--line);background:#090909;color:#918980;padding:0 16px;font-size:8px;font-weight:900;letter-spacing:.07em}.actions button{cursor:pointer}.actions button.active{background:var(--gold);color:#050505}.actions button:disabled{opacity:.35;cursor:not-allowed}.actions a{display:inline-flex;align-items:center;color:var(--gold);text-decoration:none}
        @media(max-width:1000px){.workspace{grid-template-columns:1fr}.setup{border-right:0;border-bottom:1px solid var(--line)}.product-card{grid-template-columns:1fr}.product-image{min-height:480px}}
        @media(max-width:700px){.hero{padding-top:55px}.hero h1{font-size:clamp(50px,16vw,75px)}.preference>div{grid-template-columns:1fr}.preference button{border-right:0;border-bottom:1px solid var(--line)}.products-head{align-items:flex-start;flex-direction:column}.product-shell{grid-template-columns:1fr}.nav{display:none}.product-card{min-height:auto}.product-image{min-height:430px}.avatar{scale:.88}}
      `}</style>
    </main>
  );
}
