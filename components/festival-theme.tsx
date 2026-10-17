
"use client";

import { useEffect, useState } from "react";
import { getActiveFestivalTheme } from "@/lib/festival-theme";

const LIGHTS = Array.from({ length: 38 }, (_, index) => ({
  left: `${(index / 37) * 100}%`,
  delay: `${(index % 9) * 0.19}s`,
  duration: `${1.5 + (index % 5) * 0.32}s`,
}));

const SPARKLES = Array.from({ length: 30 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  top: `${8 + ((index * 29) % 86)}%`,
  delay: `${-((index * 7) % 12)}s`,
  duration: `${5 + (index % 6) * 1.4}s`,
  size: `${2 + (index % 3)}px`,
}));

function Lantern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`krve-festival-lantern ${className}`}
      viewBox="0 0 60 112"
      fill="none"
      aria-hidden="true"
    >
      <path d="M30 0V15" stroke="#E9AD32" strokeWidth="1.5" />
      <path d="M22 15H38L34 23H26L22 15Z" fill="#9C5C0B" stroke="#F7C65B" />
      <path
        d="M30 23L11 39L17 76L30 94L43 76L49 39L30 23Z"
        fill="url(#krveLanternGlass)"
        stroke="#F6BD45"
        strokeWidth="1.5"
      />
      <path d="M17 39H43M14 53H46M17 69H43" stroke="#F4B83D" strokeWidth="1" />
      <path d="M30 25V91M13 40L47 75M47 40L13 75" stroke="#EAA62C" strokeWidth="1" />
      <path d="M22 94H38L34 101H26L22 94Z" fill="#B87515" stroke="#F6C454" />
      <path d="M30 101V108" stroke="#E9AD32" />
      <circle cx="30" cy="57" r="11" fill="#FFB323" opacity=".25" />
      <circle cx="30" cy="57" r="5" fill="#FFF1B4" opacity=".9" />
      <defs>
        <linearGradient
          id="krveLanternGlass"
          x1="12"
          y1="30"
          x2="48"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFDB79" stopOpacity=".85" />
          <stop offset=".45" stopColor="#C87512" stopOpacity=".35" />
          <stop offset="1" stopColor="#FF9B19" stopOpacity=".7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

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

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        updateTheme();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const active = festival?.name === "Dussehra";

    root.classList.toggle("krve-festival-dussehra", active);
    body.classList.toggle("krve-festival-dussehra", active);
    root.dataset.festival = active ? "dussehra" : "none";

    return () => {
      root.classList.remove("krve-festival-dussehra");
      body.classList.remove("krve-festival-dussehra");
      delete root.dataset.festival;
    };
  }, [festival]);

  if (festival?.name !== "Dussehra") {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        html.krve-festival-dussehra {
          --krve-festival-gold: #ffc94d;
          --krve-festival-orange: #ff8b25;
          --krve-festival-glow: rgba(255, 158, 34, 0.25);
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
              rgba(255, 117, 29, 0.07),
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
          z-index: 80;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          contain: strict;
        }

        .krve-festival-top-wire {
          position: absolute;
          top: 0;
          left: -1%;
          width: 102%;
          height: 30px;
          border-bottom: 1px solid rgba(255, 191, 68, 0.45);
          border-radius: 0 0 50% 50%;
          background: linear-gradient(
            180deg,
            rgba(60, 29, 4, 0.26),
            transparent
          );
        }

        .krve-festival-top-wire::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            #9f5a0a,
            #ffe2a0,
            #b66c0d,
            transparent
          );
          box-shadow: 0 0 12px rgba(255, 171, 42, 0.6);
        }

        .krve-festival-bulb {
          position: absolute;
          top: 13px;
          width: 5px;
          height: 7px;
          border-radius: 50%;
          background: #fff0ba;
          box-shadow:
            0 0 5px 2px rgba(255, 225, 145, 0.8),
            0 0 13px 4px rgba(255, 169, 44, 0.4);
          animation: krve-festival-twinkle 2.4s ease-in-out infinite alternate;
        }

        .krve-festival-bulb:nth-child(3n) {
          top: 18px;
          animation-delay: 0.7s;
        }

        .krve-festival-bulb:nth-child(4n) {
          top: 11px;
          animation-delay: 1.2s;
        }

        .krve-festival-sparkle {
          position: absolute;
          border-radius: 50%;
          background: #ffe5a0;
          box-shadow: 0 0 10px 2px rgba(255, 188, 66, 0.5);
          animation: krve-festival-float 8s ease-in-out infinite;
        }

        .krve-festival-lantern {
          position: absolute;
          top: 18px;
          width: clamp(28px, 3.5vw, 58px);
          height: auto;
          overflow: visible;
          filter: drop-shadow(0 0 9px rgba(255, 157, 29, 0.7));
          transform-origin: top center;
          animation: krve-festival-swing 5s ease-in-out infinite;
        }

        .krve-festival-lantern--left {
          left: 12px;
        }

        .krve-festival-lantern--right {
          right: 12px;
          animation-delay: -2.5s;
        }

        .krve-festival-edge {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          opacity: 0.7;
          background: linear-gradient(
            180deg,
            #f8c44e,
            rgba(255, 155, 26, 0.08) 45%,
            rgba(255, 188, 57, 0.28) 80%,
            transparent
          );
          box-shadow: 0 0 9px rgba(255, 170, 32, 0.4);
        }

        .krve-festival-edge--left {
          left: 0;
        }

        .krve-festival-edge--right {
          right: 0;
        }

        .krve-festival-announcement {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          min-height: 38px;
          padding: 8px 16px;
          border-bottom: 1px solid rgba(235, 177, 59, 0.4);
          background:
            radial-gradient(
              ellipse at center,
              rgba(125, 65, 9, 0.28),
              transparent 65%
            ),
            #080603;
          color: #f8d27a;
          text-align: center;
          font-family: var(--font-body, Arial, sans-serif);
          font-size: 12px;
          letter-spacing: 0.035em;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
        }

        .krve-festival-announcement strong {
          color: #ffd45c;
          font-weight: 800;
        }

        .krve-festival-announcement__star {
          color: #ffcf53;
          text-shadow: 0 0 10px rgba(255, 183, 40, 0.7);
        }

        @keyframes krve-festival-twinkle {
          from {
            opacity: 0.45;
            filter: brightness(0.8);
          }

          to {
            opacity: 1;
            filter: brightness(1.35);
          }
        }

        @keyframes krve-festival-float {
          0%,
          100% {
            opacity: 0.15;
            transform: translate3d(0, 0, 0);
          }

          50% {
            opacity: 0.8;
            transform: translate3d(0, -10px, 0);
          }
        }

        @keyframes krve-festival-swing {
          0%,
          100% {
            transform: rotate(-3deg);
          }

          50% {
            transform: rotate(3deg);
          }
        }

        @media (max-width: 760px) {
          .krve-festival-top-wire {
            height: 20px;
          }

          .krve-festival-bulb {
            width: 3px;
            height: 4px;
            top: 9px;
          }

          .krve-festival-lantern {
            top: 24px;
            width: 27px;
          }

          .krve-festival-lantern--left {
            left: 2px;
          }

          .krve-festival-lantern--right {
            right: 2px;
          }

          .krve-festival-announcement {
            padding: 8px 38px;
            font-size: 10px;
            gap: 5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .krve-festival-bulb,
          .krve-festival-sparkle,
          .krve-festival-lantern {
            animation: none !important;
          }
        }
      `}</style>

      <div className="krve-festival-atmosphere" aria-hidden="true">
        <div className="krve-festival-top-wire" />
        <div className="krve-festival-edge krve-festival-edge--left" />
        <div className="krve-festival-edge krve-festival-edge--right" />

        <Lantern className="krve-festival-lantern--left" />
        <Lantern className="krve-festival-lantern--right" />

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

        {SPARKLES.map((sparkle, index) => (
          <span
            key={`sparkle-${index}`}
            className="krve-festival-sparkle"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              width: sparkle.size,
              height: sparkle.size,
              animationDelay: sparkle.delay,
              animationDuration: sparkle.duration,
            }}
          />
        ))}
      </div>
    </>
  );
}
