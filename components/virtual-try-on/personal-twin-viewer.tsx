"use client";

import {
  Canvas,
  useLoader,
} from "@react-three/fiber";

import {
  Environment,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";

import * as THREE from "three";

import {
  Suspense,
  useMemo,
} from "react";

type BodyMeasurements = {
  heightCm?: number;
  shoulderWidthCm?: number;
  chestCm?: number;
  waistCm?: number;
  hipCm?: number;
  inseamCm?: number;
};

type PersonalTwinViewerProps = {
  photoUrl?: string | null;
  productImage?: string | null;
  productName?: string;
  measurements?: BodyMeasurements | null;
  heightCm?: number;
};

/* =========================================================
   HELPERS
========================================================= */

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    Math.max(value, min),
    max,
  );
}

function normaliseMeasurements(
  measurements?: BodyMeasurements | null,
  heightCm?: number,
) {
  const height =
    measurements?.heightCm ||
    heightCm ||
    170;

  /*
   * These are only proportions used for visualising
   * the avatar.
   *
   * They are NOT medical/body measurements.
   */

  const shoulder =
    measurements?.shoulderWidthCm ||
    height * 0.255;

  const chest =
    measurements?.chestCm ||
    height * 0.55;

  const waist =
    measurements?.waistCm ||
    height * 0.46;

  const hip =
    measurements?.hipCm ||
    height * 0.54;

  const inseam =
    measurements?.inseamCm ||
    height * 0.46;

  return {
    height,
    shoulder,
    chest,
    waist,
    hip,
    inseam,
  };
}

/* =========================================================
   FACE / PHOTO TEXTURE
========================================================= */

function PhotoFace({
  photoUrl,
}: {
  photoUrl: string;
}) {
  const texture =
    useLoader(
      THREE.TextureLoader,
      photoUrl,
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  return (
    <mesh
      position={[0, 3.42, 0.315]}
    >
      <planeGeometry
        args={[0.58, 0.72]}
      />

      <meshStandardMaterial
        map={texture}
        transparent
        roughness={0.8}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* =========================================================
   GARMENT PREVIEW
========================================================= */

function GarmentPreview({
  image,
  torsoWidth,
  torsoHeight,
}: {
  image: string;
  torsoWidth: number;
  torsoHeight: number;
}) {
  const texture =
    useLoader(
      THREE.TextureLoader,
      image,
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  const width =
    torsoWidth * 1.08;

  const height =
    torsoHeight * 0.9;

  return (
    <mesh
      position={[
        0,
        1.66,
        0.44,
      ]}
    >
      <planeGeometry
        args={[
          width,
          height,
        ]}
      />

      <meshStandardMaterial
        map={texture}
        transparent
        alphaTest={0.04}
        roughness={0.92}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* =========================================================
   DIGITAL HUMAN
========================================================= */

function DigitalHuman({
  photoUrl,
  productImage,
  measurements,
  heightCm,
}: {
  photoUrl?: string | null;
  productImage?: string | null;
  measurements?: BodyMeasurements | null;
  heightCm?: number;
}) {
  const body =
    useMemo(
      () =>
        normaliseMeasurements(
          measurements,
          heightCm,
        ),
      [
        measurements,
        heightCm,
      ],
    );

  /*
   * Convert real-world proportions into
   * stable Three.js visual proportions.
   */

  const shoulderScale =
    clamp(
      body.shoulder / 43,
      0.82,
      1.22,
    );

  const chestScale =
    clamp(
      body.chest / 94,
      0.82,
      1.24,
    );

  const waistScale =
    clamp(
      body.waist / 78,
      0.8,
      1.22,
    );

  const hipScale =
    clamp(
      body.hip / 92,
      0.82,
      1.25,
    );

  const heightScale =
    clamp(
      body.height / 170,
      0.86,
      1.16,
    );

  const torsoWidth =
    1.48 *
    shoulderScale *
    chestScale;

  const torsoHeight =
    1.72 *
    heightScale;

  const waistWidth =
    1.12 *
    waistScale;

  const hipWidth =
    1.32 *
    hipScale;

  const skinColor =
    "#b98970";

  const bodyColor =
    "#171512";

  const jointColor =
    "#211e1a";

  return (
    <group
      position={[0, -0.15, 0]}
      scale={[
        1,
        heightScale,
        1,
      ]}
    >
      {/* ==============================================
          HEAD
      ============================================== */}

      <mesh
        position={[0, 3.42, 0]}
        scale={[
          0.88,
          1.06,
          0.9,
        ]}
      >
        <sphereGeometry
          args={[
            0.42,
            48,
            48,
          ]}
        />

        <meshStandardMaterial
          color={skinColor}
          roughness={0.82}
        />
      </mesh>

      {/* hair */}

      <mesh
        position={[
          0,
          3.67,
          -0.03,
        ]}
        scale={[
          0.92,
          0.56,
          0.92,
        ]}
      >
        <sphereGeometry
          args={[
            0.43,
            36,
            36,
          ]}
        />

        <meshStandardMaterial
          color="#15110f"
          roughness={0.95}
        />
      </mesh>

      {/* uploaded customer photo */}

      {photoUrl ? (
        <Suspense fallback={null}>
          <PhotoFace
            photoUrl={photoUrl}
          />
        </Suspense>
      ) : null}

      {/* ==============================================
          NECK
      ============================================== */}

      <mesh
        position={[0, 2.93, 0]}
      >
        <cylinderGeometry
          args={[
            0.22,
            0.26,
            0.48,
            32,
          ]}
        />

        <meshStandardMaterial
          color={skinColor}
          roughness={0.82}
        />
      </mesh>

      {/* ==============================================
          SHOULDERS
      ============================================== */}

      <RoundedBox
        args={[
          torsoWidth,
          0.38,
          0.52,
        ]}
        radius={0.18}
        smoothness={5}
        position={[
          0,
          2.56,
          0,
        ]}
      >
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.9}
        />
      </RoundedBox>

      {/* ==============================================
          CHEST / TORSO
      ============================================== */}

      <RoundedBox
        args={[
          torsoWidth * 0.91,
          torsoHeight,
          0.62,
        ]}
        radius={0.25}
        smoothness={6}
        position={[
          0,
          1.78,
          0,
        ]}
      >
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.91}
        />
      </RoundedBox>

      {/* waist */}

      <RoundedBox
        args={[
          waistWidth,
          0.62,
          0.55,
        ]}
        radius={0.2}
        smoothness={5}
        position={[
          0,
          0.83,
          0,
        ]}
      >
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.9}
        />
      </RoundedBox>

      {/* hips */}

      <RoundedBox
        args={[
          hipWidth,
          0.58,
          0.64,
        ]}
        radius={0.22}
        smoothness={5}
        position={[
          0,
          0.28,
          0,
        ]}
      >
        <meshStandardMaterial
          color={jointColor}
          roughness={0.92}
        />
      </RoundedBox>

      {/* ==============================================
          LEFT ARM
      ============================================== */}

      <mesh
        position={[
          -(torsoWidth / 2 + 0.19),
          1.74,
          0,
        ]}
        rotation={[
          0,
          0,
          -0.055,
        ]}
      >
        <capsuleGeometry
          args={[
            0.18,
            1.48,
            10,
            24,
          ]}
        />

        <meshStandardMaterial
          color={skinColor}
          roughness={0.84}
        />
      </mesh>

      {/* ==============================================
          RIGHT ARM
      ============================================== */}

      <mesh
        position={[
          torsoWidth / 2 + 0.19,
          1.74,
          0,
        ]}
        rotation={[
          0,
          0,
          0.055,
        ]}
      >
        <capsuleGeometry
          args={[
            0.18,
            1.48,
            10,
            24,
          ]}
        />

        <meshStandardMaterial
          color={skinColor}
          roughness={0.84}
        />
      </mesh>

      {/* hands */}

      <mesh
        position={[
          -(torsoWidth / 2 + 0.25),
          0.63,
          0,
        ]}
      >
        <sphereGeometry
          args={[
            0.2,
            24,
            24,
          ]}
        />

        <meshStandardMaterial
          color={skinColor}
          roughness={0.85}
        />
      </mesh>

      <mesh
        position={[
          torsoWidth / 2 + 0.25,
          0.63,
          0,
        ]}
      >
        <sphereGeometry
          args={[
            0.2,
            24,
            24,
          ]}
        />

        <meshStandardMaterial
          color={skinColor}
          roughness={0.85}
        />
      </mesh>

      {/* ==============================================
          LEFT LEG
      ============================================== */}

      <mesh
        position={[
          -0.36 * hipScale,
          -1.18,
          0,
        ]}
      >
        <capsuleGeometry
          args={[
            0.27,
            2.35,
            12,
            28,
          ]}
        />

        <meshStandardMaterial
          color="#121110"
          roughness={0.94}
        />
      </mesh>

      {/* ==============================================
          RIGHT LEG
      ============================================== */}

      <mesh
        position={[
          0.36 * hipScale,
          -1.18,
          0,
        ]}
      >
        <capsuleGeometry
          args={[
            0.27,
            2.35,
            12,
            28,
          ]}
        />

        <meshStandardMaterial
          color="#121110"
          roughness={0.94}
        />
      </mesh>

      {/* ==============================================
          SHOES / FEET
      ============================================== */}

      <RoundedBox
        args={[
          0.52,
          0.28,
          0.88,
        ]}
        radius={0.12}
        smoothness={4}
        position={[
          -0.36 * hipScale,
          -2.55,
          0.18,
        ]}
      >
        <meshStandardMaterial
          color="#090909"
          roughness={0.72}
        />
      </RoundedBox>

      <RoundedBox
        args={[
          0.52,
          0.28,
          0.88,
        ]}
        radius={0.12}
        smoothness={4}
        position={[
          0.36 * hipScale,
          -2.55,
          0.18,
        ]}
      >
        <meshStandardMaterial
          color="#090909"
          roughness={0.72}
        />
      </RoundedBox>

      {/* ==============================================
          SELECTED KRVE GARMENT
      ============================================== */}

      {productImage ? (
        <Suspense fallback={null}>
          <GarmentPreview
            image={productImage}
            torsoWidth={
              torsoWidth
            }
            torsoHeight={
              torsoHeight
            }
          />
        </Suspense>
      ) : null}
    </group>
  );
}

/* =========================================================
   FLOOR
========================================================= */

function Floor() {
  return (
    <>
      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[0, -3, 0]}
      >
        <circleGeometry
          args={[3.2, 64]}
        />

        <meshStandardMaterial
          color="#090806"
          roughness={0.82}
          metalness={0.08}
        />
      </mesh>

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          0,
          -2.985,
          0,
        ]}
      >
        <ringGeometry
          args={[
            2.55,
            2.58,
            64,
          ]}
        />

        <meshBasicMaterial
          color="#d9a91d"
          transparent
          opacity={0.45}
        />
      </mesh>
    </>
  );
}

/* =========================================================
   SCENE
========================================================= */

function TwinScene({
  photoUrl,
  productImage,
  measurements,
  heightCm,
}: {
  photoUrl?: string | null;
  productImage?: string | null;
  measurements?: BodyMeasurements | null;
  heightCm?: number;
}) {
  return (
    <>
      <color
        attach="background"
        args={["#050504"]}
      />

      <fog
        attach="fog"
        args={[
          "#050504",
          8,
          16,
        ]}
      />

      <ambientLight
        intensity={1.4}
      />

      <directionalLight
        position={[
          4,
          7,
          6,
        ]}
        intensity={3.4}
        color="#fff2d4"
      />

      <directionalLight
        position={[
          -5,
          3,
          2,
        ]}
        intensity={1.7}
        color="#d6b060"
      />

      <pointLight
        position={[
          0,
          4,
          -4,
        ]}
        intensity={2}
        color="#d9a91d"
      />

      <Suspense fallback={null}>
        <DigitalHuman
          photoUrl={photoUrl}
          productImage={
            productImage
          }
          measurements={
            measurements
          }
          heightCm={heightCm}
        />
      </Suspense>

      <Floor />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableRotate
        enableZoom
        autoRotate={false}
        minDistance={5.8}
        maxDistance={10}
        minPolarAngle={
          Math.PI * 0.25
        }
        maxPolarAngle={
          Math.PI * 0.72
        }
        target={[0, 0.25, 0]}
      />

      <Environment
        preset="studio"
      />
    </>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function PersonalTwinViewer({
  photoUrl,
  productImage,
  productName,
  measurements,
  heightCm = 170,
}: PersonalTwinViewerProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "650px",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 35%, rgba(210,160,35,0.10), transparent 34%), #050504",
      }}
    >
      {/* STATUS */}

      <div
        style={{
          position:
            "absolute",
          top: 22,
          left: 22,
          zIndex: 10,
          display: "flex",
          alignItems:
            "center",
          gap: 8,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing:
            "0.1em",
          color: "#5ee69b",
          pointerEvents:
            "none",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius:
              "50%",
            background:
              "#5ee69b",
            boxShadow:
              "0 0 14px rgba(94,230,155,.7)",
          }}
        />

        DIGITAL TWIN READY
      </div>

      {/* PRODUCT LABEL */}

      {productName ? (
        <div
          style={{
            position:
              "absolute",
            left: 22,
            bottom: 22,
            zIndex: 10,
            padding:
              "11px 14px",
            border:
              "1px solid rgba(218,171,41,.35)",
            background:
              "rgba(0,0,0,.72)",
            color:
              "#e2b126",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing:
              "0.08em",
            maxWidth: 250,
            pointerEvents:
              "none",
          }}
        >
          TRYING ON
          <div
            style={{
              marginTop: 5,
              color:
                "#f6efe5",
              fontSize: 12,
              letterSpacing:
                "0",
            }}
          >
            {productName}
          </div>
        </div>
      ) : null}

      {/* ROTATION HELP */}

      <div
        style={{
          position:
            "absolute",
          right: 22,
          bottom: 22,
          zIndex: 10,
          color:
            "#81796e",
          fontSize: 10,
          letterSpacing:
            "0.06em",
          pointerEvents:
            "none",
        }}
      >
        DRAG TO ROTATE • SCROLL TO ZOOM
      </div>

      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{
          position: [
            0,
            0.4,
            7.2,
          ],
          fov: 43,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference:
            "high-performance",
        }}
        style={{
          width: "100%",
          height: "100%",
          minHeight:
            "650px",
        }}
      >
        <TwinScene
          photoUrl={photoUrl}
          productImage={
            productImage
          }
          measurements={
            measurements
          }
          heightCm={heightCm}
        />
      </Canvas>
    </div>
  );
}
