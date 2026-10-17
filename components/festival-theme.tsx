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
    const themeClass = "krve-festival-dussehra";

    root.classList.toggle(
      themeClass,
      festival?.name === "Dussehra",
    );

    return () => root.classList.remove(themeClass);
  }, [festival]);

  if (!festival) return null;

  return (
    <>
      <style jsx global>{`
        html.krve-festival-dussehra {
          --krve-festival-gold: #f5cb67;
          --krve-festival-orange: #ff8b38;
        }

        .krve-festive-effects {
          position: relative;
          z-index: 50;
          width: 100%;
          pointer-events: none;
        }

        .krve-festive-lights {
          position: absolute;
          z-index: 2;
          top: 0;
          left: 0;
          width: 100%;
          height: 14px;
          overflow: hidden;
          background: linear-gradient(
            180deg,
            rgba(255, 190, 60, 0.2),
            transparent
          );
          box-shadow: 0 3px 18px rgba(255, 176, 48, 0.22);
        }

        .krve-festive-bulb {
          position: absolute;
          top: 3px;
          width: 5px;
          height: 7px;
          border-radius: 50%;
          background: #fff5c2;
          box-shadow:
            0 0 4px 2px #ffe49a,
            0 0 10px 4px rgba(255, 181, 49, 0.8),
            0 0 20px 5px rgba(255, 130, 35, 0.32);
          animation: krve-bulb-glow 1.7s ease-in-out infinite alternate;
        }

        .krve-festive-bulb:nth-child(3n) {
          background: #ffbd70;
          box-shadow:
            0 0 5px 2px #ffca7b,
            0 0 15px 4px rgba(255, 135, 35, 0.8);
        }

        .krve-festive-bulb:nth-child(4n) {
          animation-delay: 0.6s;
        }

        .krve-festive-banner {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: 12px 16px;
          text-align: center;
          color: #fff8e8;
          background:
            radial-gradient(
              ellipse at 50% 0%,
              rgba(255, 158, 45, 0.25),
              transparent 65%
            ),
            linear-gradient(90deg, #210c0b, #54200e, #210c0b);
          border-top: 1px solid rgba(255, 214, 128, 0.7);
          border-bottom: 1px solid #dba846;
          box-shadow:
            0 0 16px rgba(255, 166, 52, 0.16),
            inset 0 0 16px rgba(255, 190, 80, 0.07);
          font-size: 12px;
          letter-spacing: 0.09em;
        }

        .krve-festive-banner::before {
          content: "";
          position: absolute;
          z-index: -1;
          top: -80%;
          left: -35%;
          width: 35%;
          height: 260%;
          transform: rotate(20deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 221, 150, 0.15),
            transparent
          );
          animation: krve-light-sweep 6s ease-in-out infinite;
        }

        .krve-festive-banner strong {
          color: #ffda82;
          text-shadow: 0 0 12px rgba(255, 183, 60, 0.65);
        }

        .krve-festive-sparkles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .krve-festive-sparkle {
          position: absolute;
          bottom: 0;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #ffe7a6;
          box-shadow: 0 0 8px 2px rgba(255, 190, 70, 0.8);
          animation: krve-sparkle-rise 4s linear infinite;
        }

        @keyframes krve-bulb-glow {
          from {
            opacity: 0.55;
            filter: brightness(0.8);
          }
          to {
            opacity: 1;
            filter: brightness(1.35);
          }
        }

        @keyframes krve-light-sweep {
          0%, 20% {
            left: -35%;
          }
          75%, 100% {
            left: 130%;
          }
        }

        @keyframes krve-sparkle-rise {
          from {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          to {
            transform: translateY(-45px) scale(1.3);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .krve-festive-bulb,
          .krve-festive-banner::before,
          .krve-festive-sparkle {
            animation: none !important;
          }
        }
      `}</style>

      <div className="krve-festive-effects">
        <div className="krve-festive-lights" aria-hidden="true">
          {LIGHTS.map((light, index) => (
            <span
              key={index}
              className="krve-festive-bulb"
              style={{
                left: light.left,
                animationDelay: light.delay,
                animationDuration: light.duration,
              }}
            />
          ))}
        </div>

        <div
          className="krve-festive-banner"
          role="status"
        >
          <div
            className="krve-festive-sparkles"
            aria-hidden="true"
          >
            {LIGHTS.slice(0, 12).map((light, index) => (
              <span
                key={index}
                className="krve-festive-sparkle"
                style={{
                  left: light.left,
                  animationDelay: light.delay,
                }}
              />
            ))}
          </div>

          <strong>KRVE FESTIVE EDIT</strong>
          {" ✦ "}
          {festival.announcement}
          {" ✦ "}
        </div>
      </div>
    </>
  );
}
