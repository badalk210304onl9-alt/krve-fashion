"use client";

import {
  Canvas,
} from "@react-three/fiber";

import {
  Environment,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";

import * as THREE from "three";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  BodyAnalysisResult,
} from "@/lib/body-analysis";

type PersonalTwinViewerProps = {
  analysis: BodyAnalysisResult;
  garmentImage?: string | null;
};

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

function useSafeTexture(
  source?: string | null,
) {
  const [
    texture,
    setTexture,
  ] =
    useState<THREE.Texture | null>(
      null,
    );

  useEffect(() => {
    let active = true;

    if (!source) {
      setTexture(null);
      return;
    }

    const loader =
      new THREE.TextureLoader();

    loader.setCrossOrigin(
      "anonymous",
    );

    loader.load(
      source,
      (loaded) => {
        if (!active) {
          loaded.dispose();
          return;
        }

        loaded.colorSpace =
          THREE.SRGBColorSpace;

        loaded.needsUpdate =
          true;

        setTexture(
          loaded,
        );
      },
      undefined,
      (error) => {
        console.warn(
          "TWIN_TEXTURE_LOAD_FAILED",
          source,
          error,
        );

        if (active) {
          setTexture(null);
        }
      },
    );

    return () => {
      active = false;
    };
  }, [source]);

  return texture;
}

function FacePanel({
  faceTexture,
}: {
  faceTexture: THREE.Texture;
}) {
  return (
    <mesh
      position={[
        0,
        3.37,
        0.405,
      ]}
      scale={[
        0.72,
        0.89,
        1,
      ]}
    >
      <planeGeometry
        args={[0.82, 0.92]}
      />

      <meshBasicMaterial
        map={faceTexture}
        transparent
        alphaTest={0.02}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function GarmentPanel({
  garmentTexture,
  shoulderRatio,
  torsoRatio,
}: {
  garmentTexture: THREE.Texture;
  shoulderRatio: number;
  torsoRatio: number;
}) {
  const width =
    1.82 *
    shoulderRatio;

  const height =
    2.05 *
    torsoRatio;

  return (
    <mesh
      position={[
        0,
        1.9,
        0.55,
      ]}
      scale={[
        width,
        height,
        1,
      ]}
    >
      <planeGeometry
        args={[1, 1]}
      />

      <meshBasicMaterial
        map={
          garmentTexture
        }
        transparent
        alphaTest={0.04}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function PersonalAvatar({
  analysis,
  garmentImage,
}: PersonalTwinViewerProps) {
  const faceTexture =
    useSafeTexture(
      analysis.faceTextureDataUrl,
    );

  const garmentTexture =
    useSafeTexture(
      garmentImage,
    );

  const shoulder =
    clamp(
      analysis.bodyRatios
        .shoulder,
      0.78,
      1.28,
    );

  const torso =
    clamp(
      analysis.bodyRatios
        .torso,
      0.82,
      1.23,
    );

  const hip =
    clamp(
      analysis.bodyRatios
        .hip,
      0.78,
      1.28,
    );

  const leg =
    clamp(
      analysis.bodyRatios
        .leg,
      0.8,
      1.25,
    );

  const bodyHeightScale =
    clamp(
      analysis.measurements
        .heightCm / 170,
      0.88,
      1.14,
    );

  const shoulderWidth =
    1.72 *
    shoulder;

  const chestWidth =
    1.42 *
    shoulder;

  const waistWidth =
    1.03 *
    clamp(
      analysis.measurements
        .waistCm / 78,
      0.82,
      1.25,
    );

  const hipWidth =
    1.25 *
    hip;

  const armX =
    shoulderWidth / 2 +
    0.18;

  const legX =
    0.34 *
    hip;

  const skin =
    "#a77b64";

  const dark =
    "#171512";

  const darkTwo =
    "#211e1a";

  return (
    <group
      position={[
        0,
        -0.35,
        0,
      ]}
      scale={[
        1,
        bodyHeightScale,
        1,
      ]}
    >
      {/* HEAD */}
      <mesh
        position={[
          0,
          3.36,
          0,
        ]}
        scale={[
          0.9,
          1.06,
          0.9,
        ]}
      >
        <sphereGeometry
          args={[
            0.43,
            48,
            48,
          ]}
        />

        <meshStandardMaterial
          color={skin}
          roughness={0.83}
        />
      </mesh>

      {/* HAIR CAP */}
      <mesh
        position={[
          0,
          3.63,
          -0.035,
        ]}
        scale={[
          0.93,
          0.55,
          0.94,
        ]}
      >
        <sphereGeometry
          args={[
            0.44,
            36,
            36,
          ]}
        />

        <meshStandardMaterial
          color="#14110f"
          roughness={0.98}
        />
      </mesh>

      {/* CUSTOMER FACE TEXTURE */}
      {faceTexture && (
        <FacePanel
          faceTexture={
            faceTexture
          }
        />
      )}

      {/* NECK */}
      <mesh
        position={[
          0,
          2.89,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.2,
            0.25,
            0.46,
            32,
          ]}
        />

        <meshStandardMaterial
          color={skin}
          roughness={0.84}
        />
      </mesh>

      {/* SHOULDERS */}
      <RoundedBox
        args={[
          shoulderWidth,
          0.36,
          0.55,
        ]}
        radius={0.17}
        smoothness={5}
        position={[
          0,
          2.57,
          0,
        ]}
      >
        <meshStandardMaterial
          color={dark}
          roughness={0.92}
        />
      </RoundedBox>

      {/* UPPER TORSO */}
      <RoundedBox
        args={[
          chestWidth,
          1.42 *
            torso,
          0.62,
        ]}
        radius={0.23}
        smoothness={6}
        position={[
          0,
          1.85,
          0,
        ]}
      >
        <meshStandardMaterial
          color={dark}
          roughness={0.92}
        />
      </RoundedBox>

      {/* WAIST */}
      <RoundedBox
        args={[
          waistWidth,
          0.68 *
            torso,
          0.55,
        ]}
        radius={0.2}
        smoothness={5}
        position={[
          0,
          0.9,
          0,
        ]}
      >
        <meshStandardMaterial
          color={dark}
          roughness={0.92}
        />
      </RoundedBox>

      {/* HIPS */}
      <RoundedBox
        args={[
          hipWidth,
          0.6,
          0.65,
        ]}
        radius={0.22}
        smoothness={5}
        position={[
          0,
          0.32,
          0,
        ]}
      >
        <meshStandardMaterial
          color={darkTwo}
          roughness={0.94}
        />
      </RoundedBox>

      {/* ARMS */}
      {[-1, 1].map(
        (side) => (
          <group
            key={`arm-${side}`}
          >
            <mesh
              position={[
                side *
                  armX,
                1.86,
                0,
              ]}
              rotation={[
                0,
                0,
                side *
                  0.055,
              ]}
            >
              <capsuleGeometry
                args={[
                  0.18,
                  1.52 *
                    torso,
                  12,
                  28,
                ]}
              />

              <meshStandardMaterial
                color={skin}
                roughness={0.86}
              />
            </mesh>

            <mesh
              position={[
                side *
                  (armX +
                    0.06),
                0.67,
                0.02,
              ]}
            >
              <sphereGeometry
                args={[
                  0.19,
                  24,
                  24,
                ]}
              />

              <meshStandardMaterial
                color={skin}
                roughness={0.87}
              />
            </mesh>
          </group>
        ),
      )}

      {/* LEGS */}
      {[-1, 1].map(
        (side) => (
          <group
            key={`leg-${side}`}
          >
            <mesh
              position={[
                side *
                  legX,
                -1.08,
                0,
              ]}
              scale={[
                1,
                leg,
                1,
              ]}
            >
              <capsuleGeometry
                args={[
                  0.27,
                  2.08,
                  12,
                  28,
                ]}
              />

              <meshStandardMaterial
                color={dark}
                roughness={0.95}
              />
            </mesh>

            <RoundedBox
              args={[
                0.5,
                0.25,
                0.82,
              ]}
              radius={0.1}
              smoothness={4}
              position={[
                side *
                  legX,
                -2.48 *
                  leg,
                0.15,
              ]}
            >
              <meshStandardMaterial
                color="#080808"
                roughness={0.75}
              />
            </RoundedBox>
          </group>
        ),
      )}

      {/* LIVE KRVE GARMENT */}
      {garmentTexture && (
        <GarmentPanel
          garmentTexture={
            garmentTexture
          }
          shoulderRatio={
            shoulder
          }
          torsoRatio={
            torso
          }
        />
      )}
    </group>
  );
}

function StudioFloor() {
  return (
    <>
      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          0,
          -3.08,
          0,
        ]}
        receiveShadow
      >
        <circleGeometry
          args={[
            3.1,
            64,
          ]}
        />

        <meshStandardMaterial
          color="#0b0906"
          roughness={0.8}
          metalness={0.12}
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
          -3.065,
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
          color="#d8a529"
          transparent
          opacity={0.55}
        />
      </mesh>
    </>
  );
}

function Scene(
  props: PersonalTwinViewerProps,
) {
  return (
    <>
      <color
        attach="background"
        args={["#050505"]}
      />

      <fog
        attach="fog"
        args={[
          "#050505",
          9,
          17,
        ]}
      />

      <ambientLight
        intensity={1.45}
      />

      <directionalLight
        position={[
          4,
          7,
          5,
        ]}
        intensity={3}
        color="#fff1d0"
        castShadow
      />

      <directionalLight
        position={[
          -4,
          4,
          3,
        ]}
        intensity={1.45}
        color="#d8a529"
      />

      <pointLight
        position={[
          0,
          4,
          -3,
        ]}
        intensity={1.7}
        color="#d8a529"
      />

      <Suspense fallback={null}>
        <PersonalAvatar
          {...props}
        />
      </Suspense>

      <StudioFloor />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableRotate
        enableZoom
        minDistance={5.8}
        maxDistance={10}
        target={[
          0,
          0.25,
          0,
        ]}
        minPolarAngle={
          Math.PI *
          0.24
        }
        maxPolarAngle={
          Math.PI *
          0.72
        }
      />

      <Environment
        preset="studio"
      />
    </>
  );
}

export default function PersonalTwinViewer({
  analysis,
  garmentImage,
}: PersonalTwinViewerProps) {
  const suggestedSize =
    useMemo(() => {
      const chest =
        analysis.measurements
          .chestCm;

      if (chest <= 86) {
        return "XS";
      }

      if (chest <= 94) {
        return "S";
      }

      if (chest <= 102) {
        return "M";
      }

      if (chest <= 110) {
        return "L";
      }

      if (chest <= 118) {
        return "XL";
      }

      return "XXL";
    }, [analysis]);

  return (
    <div
      style={{
        position:
          "relative",
        width: "100%",
        height: "100%",
        minHeight: 650,
        overflow:
          "hidden",
        background:
          "radial-gradient(circle at 50% 38%, rgba(216,165,41,.12), transparent 38%), #050505",
      }}
    >
      <div
        style={{
          position:
            "absolute",
          zIndex: 10,
          top: 20,
          left: 20,
          display:
            "flex",
          alignItems:
            "center",
          gap: 8,
          color:
            "#64e89b",
          fontSize: 10,
          fontWeight: 900,
          letterSpacing:
            ".12em",
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
              "#64e89b",
            boxShadow:
              "0 0 14px rgba(100,232,155,.75)",
          }}
        />

        PERSONAL 3D TWIN
      </div>

      <div
        style={{
          position:
            "absolute",
          zIndex: 10,
          top: 20,
          right: 20,
          padding:
            "9px 12px",
          border:
            "1px solid rgba(216,165,41,.35)",
          background:
            "rgba(0,0,0,.72)",
          color:
            "#d8a529",
          fontSize: 9,
          fontWeight: 900,
          letterSpacing:
            ".08em",
          pointerEvents:
            "none",
        }}
      >
        AI SIZE {suggestedSize}
      </div>

      <div
        style={{
          position:
            "absolute",
          zIndex: 10,
          left: 20,
          bottom: 20,
          display:
            "grid",
          gridTemplateColumns:
            "repeat(4, auto)",
          gap: 8,
          pointerEvents:
            "none",
        }}
      >
        {[
          [
            "SHOULDER",
            `${analysis.measurements.shoulderCm} cm`,
          ],
          [
            "CHEST",
            `${analysis.measurements.chestCm} cm`,
          ],
          [
            "WAIST",
            `${analysis.measurements.waistCm} cm`,
          ],
          [
            "HEIGHT",
            `${analysis.measurements.heightCm} cm`,
          ],
        ].map(
          ([label, value]) => (
            <div
              key={label}
              style={{
                display:
                  "grid",
                gap: 3,
                minWidth: 76,
                padding:
                  "8px 10px",
                border:
                  "1px solid rgba(216,165,41,.24)",
                background:
                  "rgba(0,0,0,.68)",
              }}
            >
              <span
                style={{
                  color:
                    "#6e685f",
                  fontSize: 7,
                  fontWeight:
                    900,
                  letterSpacing:
                    ".09em",
                }}
              >
                {label}
              </span>

              <strong
                style={{
                  color:
                    "#eee7dd",
                  fontSize: 9,
                }}
              >
                {value}
              </strong>
            </div>
          ),
        )}
      </div>

      <div
        style={{
          position:
            "absolute",
          zIndex: 10,
          right: 20,
          bottom: 20,
          color:
            "#746d64",
          fontSize: 9,
          letterSpacing:
            ".06em",
          pointerEvents:
            "none",
        }}
      >
        DRAG TO ROTATE · SCROLL TO ZOOM
      </div>

      <Canvas
        shadows
        dpr={[1, 1.7]}
        camera={{
          position: [
            0,
            0.35,
            7.4,
          ],
          fov: 42,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias:
            true,
          alpha: false,
          powerPreference:
            "high-performance",
        }}
        style={{
          width: "100%",
          height: "100%",
          minHeight: 650,
        }}
      >
        <Scene
          analysis={
            analysis
          }
          garmentImage={
            garmentImage
          }
        />
      </Canvas>
    </div>
  );
}
