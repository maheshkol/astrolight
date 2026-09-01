/**
 * astrology/julian-day.js
 * Converts a calendar date/time to a Julian Day Number.
 * This is the standard formula (Meeus, "Astronomical Algorithms").
 * Kept as our own implementation (rather than relying on the ephemeris
 * library) because it's also the worked example on the
 * /learn/astrology-math/julian-day/ page.
 */

export function toJulianDay(year, month, day, hour = 0, minute = 0, second = 0) {
  // Decimal day including time-of-day
  const dayFraction = day + (hour + minute / 60 + second / 3600) / 24;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4); // Gregorian calendar correction

  const JD =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    dayFraction +
    B -
    1524.5;

  return JD;
}

/** Julian centuries since J2000.0 — used throughout astronomical formulas. */
export function centuriesSinceJ2000(julianDay) {
  return (julianDay - 2451545.0) / 36525;
}

/**
 * Converts a local civil date/time + UTC offset (in hours, e.g. 5.5 for IST)
 * into the Julian Day at UTC. Birth-chart accuracy depends entirely on
 * getting this offset right for the birth location and date (including
 * historical DST rules) — flagged as a known simplification.
 */
export function localToJulianDayUTC(year, month, day, hour, minute, utcOffsetHours) {
  const utcHour = hour - utcOffsetHours;
  return toJulianDay(year, month, day, utcHour, minute, 0);
}
