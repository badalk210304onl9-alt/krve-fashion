"use client";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  Environment,
  OrbitControls,
} from "@react-three/drei";

import * as THREE from "three";

import {
  useMemo,
  useRef,
} from "react";

import type {
  BodyAnalysisResult,
} from "@/lib/body-analysis";

type ViewerProps = {
  analysis: BodyAnalysisResult;
  garmentImage?: string | null;
};

function PersonalAvatar({
  analysis,
  garmentImage,
}: ViewerProps) {
  const root =
    useRef<THREE.Group>(
      null,
    );

  const faceTexture =
    useMemo(() => {
      if (
        !analysis.faceTextureDataUrl
      ) {
        return null;
      }

      return new THREE.TextureLoader().load(
        analysis.faceTextureDataUrl,
      );
    }, [
      analysis.faceTextureDataUrl,
    ]);

  const garmentTexture =
    useMemo(() => {
      if (!garmentImage) {
        return null;
      }

      return new THREE.TextureLoader().load(
        garmentImage,
      );
    }, [garmentImage]);

  useFrame(() => {
    if (!root.current) {
      return;
    }

    root.current.rotation.y =
      THREE.MathUtils.lerp(
        root.current.rotation.y,
        root.current.rotation.y,
        0.1,
      );
  });

  const shoulder =
    analysis.bodyRatios.shoulder;

  const torso =
    analysis.bodyRatios.torso;

  const hip =
    analysis.bodyRatios.hip;

  const leg =
    analysis.bodyRatios.leg;

  return (
    <group
      ref={root}
      position={[0, -1.65, 0]}
    >
      <mesh
        position={[
          0,
          3.55 +
            (torso - 1) *
              0.35,
          0,
        ]}
        scale={[
          0.96,
          1.08,
          0.92,
        ]}
      >
        <sphereGeometry
          args={[
            0.43,
            64,
            64,
          ]}
        />

        <meshStandardMaterial
          color="#a98570"
          map={
            faceTexture ||
            undefined
          }
          roughness={0.78}
        />
      </mesh>

      <mesh
        position={[
          0,
          2.96,
          0,
        ]}
        scale={[
          0.34,
          0.45,
          0.3,
        ]}
      >
        <cylinderGeometry
          args={[
            0.42,
            0.46,
            1,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#a98570"
          roughness={0.8}
        />
      </mesh>

      <mesh
        position={[
          0,
          2.05,
          0,
        ]}
        scale={[
          shoulder,
          torso,
          0.82,
        ]}
      >
        <capsuleGeometry
          args={[
            0.75,
            1.35,
            12,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#1a1816"
          roughness={0.88}
        />
      </mesh>

      <mesh
        position={[
          0,
          0.83,
          0,
        ]}
        scale={[
          hip,
          0.58,
          0.83,
        ]}
      >
        <capsuleGeometry
          args={[
            0.65,
            0.58,
            12,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#171513"
          roughness={0.9}
        />
      </mesh>

      {[
        -1,
        1,
      ].map((side) => (
        <group
          key={`arm-${side}`}
        >
          <mesh
            position={[
              side *
                1.03 *
                shoulder,
              2.05,
              0,
            ]}
            rotation={[
              0,
              0,
              side *
                -0.08,
            ]}
            scale={[
              0.29,
              1.45 *
                torso,
              0.29,
            ]}
          >
            <capsuleGeometry
              args={[
                0.32,
                1.35,
                10,
                24,
              ]}
            />

            <meshStandardMaterial
              color="#a98570"
              roughness={
                0.82
              }
            />
          </mesh>
        </group>
      ))}

      {[
        -1,
        1,
      ].map((side) => (
        <mesh
          key={`leg-${side}`}
          position={[
            side *
              0.42 *
              hip,
            -0.75,
            0,
          ]}
          scale={[
            0.38,
            1.75 *
              leg,
            0.4,
          ]}
        >
          <capsuleGeometry
            args={[
              0.36,
              1.65,
              10,
              24,
            ]}
          />

          <meshStandardMaterial
            color="#171513"
            roughness={0.9}
          />
        </mesh>
      ))}

      {garmentTexture && (
        <mesh
          position={[
            0,
            2.08,
            0.7,
          ]}
          scale={[
            1.42 *
              shoulder,
            1.55 *
              torso,
            1,
          ]}
        >
          <planeGeometry
            args={[
              1.6,
              2,
            ]}
          />

          <meshBasicMaterial
            map={garmentTexture}
            transparent
            alphaTest={0.08}
            side={
              THREE.DoubleSide
            }
          />
        </mesh>
      )}

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          0,
          -2.55,
          0,
        ]}
      >
        <circleGeometry
          args={[
            2.4,
            64,
          ]}
        />

        <meshStandardMaterial
          color="#13100a"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}

export default function PersonalTwinViewer(
  props: ViewerProps,
) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 620,
        background:
          "radial-gradient(circle at 50% 38%, rgba(216,165,41,.12), transparent 40%), #050505",
      }}
    >
      <Canvas
        camera={{
          position: [
            0,
            2.25,
            8.1,
          ],
          fov: 34,
        }}
        dpr={[1, 1.7]}
      >
        <ambientLight
          intensity={1.2}
        />

        <directionalLight
          position={[
            3,
            7,
            5,
          ]}
          intensity={2.4}
        />

        <directionalLight
          position={[
            -4,
            4,
            2,
          ]}
          intensity={1.15}
        />

        <PersonalAvatar
          {...props}
        />

        <Environment
          preset="studio"
        />

        <OrbitControls
          enablePan={false}
          minDistance={6.7}
          maxDistance={10.5}
          target={[
            0,
            1.05,
            0,
          ]}
          maxPolarAngle={
            Math.PI /
            1.72
          }
          minPolarAngle={
            Math.PI /
            3.1
          }
        />
      </Canvas>
    </div>
  );
}
