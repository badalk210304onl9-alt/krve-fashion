export default function DiwaliTheme() {
  return (
    <>
      {/* Diwali announcement */}
      <div className="krve-diwali-announcement" role="note">
        <span aria-hidden="true">✦</span>
        <strong>THE KRVE DIWALI EDITION</strong>
        <span className="krve-diwali-divider">|</span>
        <span>Special Gift Box for Every Customer</span>
        <span aria-hidden="true">✦</span>
      </div>

      {/* Festive decorations */}
      <div
        className="krve-diwali-decor"
        aria-hidden="true"
      >
        <span className="krve-diwali-garland krve-diwali-left">
          ✿　✦　✿　✦　✿
        </span>

        <span className="krve-diwali-garland krve-diwali-right">
          ✿　✦　✿　✦　✿
        </span>

        <span className="krve-diwali-diya krve-diwali-diya-left">
          🪔
        </span>

        <span className="krve-diwali-diya krve-diwali-diya-right">
          🪔
        </span>
      </div>
    </>
  );
}
