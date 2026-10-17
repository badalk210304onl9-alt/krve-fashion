"use client";

import { useEffect, useState } from "react";
import { getActiveFestivalTheme } from "@/lib/festival-theme";

export default function FestivalTheme() {
  const [festival, setFestival] = useState<
    ReturnType<typeof getActiveFestivalTheme>
  >(null);

  useEffect(() => {
    setFestival(getActiveFestivalTheme());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const themeClass = "krve-festival-dussehra";

    root.classList.remove(themeClass);

    if (festival?.name === "Dussehra") {
      root.classList.add(themeClass);
    }

    return () => {
      root.classList.remove(themeClass);
    };
  }, [festival]);

  if (!festival) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        html.krve-festival-dussehra {
          --krve-festival-gold: #e5b64b;
          --krve-festival-saffron: #e87524;
          --krve-festival-red: #8f1728;
        }

        html.krve-festival-dussehra body {
          background-color: #100906;
        }

        html.krve-festival-dussehra ::selection {
          background: var(--krve-festival-saffron);
          color: #ffffff;
        }

        .krve-dussehra-announcement {
          width: 100%;
          padding: 11px 16px;
          text-align: center;
          color: #fff5df;
          background: linear-gradient(
            90deg,
            #511019,
            #a74719,
            #511019
          );
          border-bottom: 1px solid #e5b64b;
          font-size: 13px;
          letter-spacing: 0.06em;
        }

        .krve-dussehra-announcement strong {
          color: #ffda82;
        }
      `}</style>

      <div
        className="krve-dussehra-announcement"
        role="status"
      >
        <strong>KRVE FESTIVE EDIT</strong>
        {" — "}
        {festival.announcement}
      </div>
    </>
  );
}
