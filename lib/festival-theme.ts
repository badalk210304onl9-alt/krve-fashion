export type FestivalTheme = {
  name: string;
  startDate: string;
  endDate: string;
  className: string;
  announcement: string;
};

const FESTIVAL_TIME_ZONE = "Asia/Kolkata";

export const FESTIVAL_THEMES: FestivalTheme[] = [
  {
    name: "Dussehra",
    startDate: "2026-10-17",
    endDate: "2026-10-20",
    className: "krve-festival-dussehra",
    announcement:
      "Celebrate Dussehra with KRVE — The Fashion Studio",
  },
];

function getIndiaDate(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: FESTIVAL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export function getActiveFestivalTheme(): FestivalTheme | null {
  const today = getIndiaDate();

  return (
    FESTIVAL_THEMES.find(
      (festival) =>
        today >= festival.startDate &&
        today <= festival.endDate,
    ) ?? null
  );
}
