"use client";

import { useEffect, useState } from "react";
import { getActiveFestivalTheme } from "@/lib/festival-theme";

const LIGHTS = Array.from({ length: 32 }, (_, index) => ({
  left: `${(index / 31) * 100}%`,
  delay: `${(index % 8) * 0.17}s`,
  duration: `${1.2 + (index % 5) * 0.25}s`,
}));

export default function FestivalTheme() {
  const [festival, setFestival] = useState<
    ReturnType<typeof getActiveFestivalTheme>
  >(null);

  useEffect(() => {
    const updateTheme = () => {
      setFestival(getActiveFestivalTheme());
    };

    updateTheme();

    const timer = window.setInterval(updateTheme, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const active = festival?.name === "Dussehra";

    root.classList.toggle("krve-festival-dussehra", active);
    body.classList.toggle("krve-festival-dussehra", active);

    return () => {
      root.classList.remove("krve-festival-dussehra");
      body.classList.remove("krve-festival-dussehra");
    };
  }, [festival]);

  if (!festival) return null;

  return (
    <>
      <style jsx global>{`
        html.krve-festival-dussehra {
          --krve-festival-gold: #f5cb67;
          --krve-festival-orange: #ff8b38;
        }

        body.krve-festival-dussehra {
          background-color: #050403;
          background-image:
            radial-gradient(
              ellipse at 12% 8%,
              rgba(255, 177, 55, 0.09),
              transparent 30%
            ),
            radial-gradient(
              ellipse at 88% 28%,
              rgba(255, 117, 29, 0.065),
              transparent 32%
            ),
            radial-gradient(
              ellipse at 45% 68%,
              rgba(226, 164, 50, 0.045),
              transparent 38%
            );
          background-attachment: fixed;
        }

        .krve-festival-atmosphere {
          position: fixed;
          inset: 0;
          z-index: 40;
          overflow: hidden;
          pointer-events: none;
          contain: strict;
        }

        .krve-festival-atmosphere::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at 8% 18%,
              rgba(255, 204, 103, 0.12),
              transparent 2px
            ),
            radial-gradient(
              circle at 78% 32%,
              rgba(255, 183, 75, 0.13),
              transparent 3px
            ),
            radial-gradient(
              circle at 42% 61%,
              rgba(255, 222, 144, 0.1),
              transparent 2px
            ),
            radial-gradient(
              circle at 91% 82%,
              rgba(255, 163, 60, 0.12),
              transparent 3px
            );
        }

        .krve-festival-light-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          opacity: 0.65;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 207, 100, 0.8),
            transparent
          );
          box-shadow: 0 0 14px rgba(255, 178, 51, 0.24);
        }

        .krve-festival-bulb {
          position: absolute;
          top: -2px;
          width: 4px;
          height: 5px;
          border-radius: 50%;
          background: #fff1bd;
          box-shadow:
            0 0 5px 2px rgba(255, 225, 145, 0.75),
            0 0 13px 3px rgba(255, 169, 44, 0.3);
          animation: krve-festival-twinkle 2.4s ease-in-out infinite alternate;
        }

        .krve-festival-bulb:nth-child(3n) {
          animation-delay: 0.7s;
        }

        .krve-festival-bulb:nth-child(4n) {
          animation-delay: 1.2s;
        }

        .krve-festival-sparkle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #ffe5a0;
          box-shadow: 0 0 9px 2px rgba(255, 188, 66, 0.5);
          animation: krve-festival-float 7s ease-in-out infinite;
        }

        .krve-festival-sparkle:nth-child(2n) {
          animation-delay: -3s;
        }

        .krve-festival-sparkle:nth-child(3n) {
          width: 2px;
          height: 2px;
          animation-delay: -5s;
        }

        @keyframes krve-festival-twinkle {
          from {
            opacity: 0.45;
            filter: brightness(0.8);
          }

          to {
            opacity: 1;
            filter: brightness(1.3);
          }
        }

        @keyframes krve-festival-float {
          0%,
          100% {
            opacity: 0.15;
            transform: translate3d(0, 0, 0);
          }

          50% {
            opacity: 0.75;
            transform: translate3d(0, -9px, 0);
          }
        }

        @media (max-width: 760px) {
          .krve-festival-atmosphere::before {
            opacity: 0.55;
          }

          .krve-festival-bulb {
            width: 3px;
            height: 4px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .krve-festival-bulb,
          .krve-festival-sparkle {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="krve-festival-atmosphere"
        aria-hidden="true"
      >
        <div className="krve-festival-light-line" />

        {LIGHTS.map((light, index) => (
          <span
            key={`light-${index}`}
            className="krve-festival-bulb"
            style={{
              left: light.left,
              animationDelay: light.delay,
              animationDuration: light.duration,
            }}
          />
        ))}

        {LIGHTS.slice(0, 16).map((light, index) => (
          <span
            key={`sparkle-${index}`}
            className="krve-festival-sparkle"
            style={{
              left: light.left,
              top: `${12 + ((index * 17) % 78)}%`,
              animationDelay: light.delay,
              animationDuration: `${4 + (index % 4) * 1.5}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
