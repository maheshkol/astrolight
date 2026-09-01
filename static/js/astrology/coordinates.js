/**
 * astrology/coordinates.js
 * Small shared math helpers — angle normalization, degree formatting,
 * obliquity of the ecliptic, local sidereal time. Everything else in the
 * engine builds on these.
 */

export const DEG = Math.PI / 180;
export const RAD = 180 / Math.PI;

/** Normalize any angle in degrees to the 0–360 range. */
export function norm360(deg) {
  let d = deg % 360;
  if (d < 0) d += 360;
  // Floating-point roundoff can produce exactly 360° for an angle that is
  // mathematically 0°. Keep the function's contract in [0, 360).
  return d >= 360 ? 0 : d;
}

/** Convert a decimal degree value to degrees/minutes/seconds display, e.g. 137.4° -> 137°24'00" */
export function toDMS(decimalDegrees) {
  const d = Math.floor(decimalDegrees);
  const minFloat = (decimalDegrees - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);
  return `${d}\u00B0${String(m).padStart(2, "0")}'${String(s).padStart(2, "0")}"`;
}

/**
 * Mean obliquity of the ecliptic (Earth's axial tilt), which slowly
 * decreases over time. Meeus formula, accurate to within ~1" over
 * several centuries either side of J2000.
 */
export function obliquityOfEcliptic(julianCenturiesT) {
  const T = julianCenturiesT;
  const seconds =
    21.448 -
    T * (46.815 + T * (0.00059 - T * 0.001813));
  return 23 + (26 + seconds / 60) / 60; // degrees
}

/**
 * Greenwich Mean Sidereal Time in degrees, for a given Julian Day (UT).
 * Meeus formula (low-precision, adequate for a birth-chart ascendant).
 */
export function greenwichSiderealTime(julianDayUT, julianCenturiesT) {
  const T = julianCenturiesT;
  let gst =
    280.46061837 +
    360.98564736629 * (julianDayUT - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  return norm360(gst);
}

/** Local Sidereal Time = GST + geographic longitude (east positive, degrees). */
export function localSiderealTime(gstDegrees, longitudeDegreesEast) {
  return norm360(gstDegrees + longitudeDegreesEast);
}
