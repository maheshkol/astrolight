/**
 * AstroLight Vedic Engine
 * Lahiri / Chitrapaksha Ayanamsha
 *
 * This module is intentionally independent from the
 * Western/Tropical astrology engine.
 *
 * Convention:
 *   Sidereal longitude = Tropical longitude - Ayanamsha
 *
 * The polynomial is referenced to J2000.0 and follows
 * a Lahiri/Chitrapaksha-style precession model.
 *
 * Ayanamsha reference:
 *   J2000.0 ≈ 23°51′24″
 *
 * Precession terms:
 *   5038.7784 T - 1.07259 T² - 0.001147 T³ arcseconds
 *
 * where T = Julian centuries from J2000.0.
 */

const J2000_JD = 2451545.0;

// Lahiri reference value at J2000.0.
// 23° 51′ 24″ = 23 + 51/60 + 24/3600 degrees.
const LAHIRI_J2000_DEG =
  23 +
  51 / 60 +
  24 / 3600;

/**
 * Normalize an angle to [0, 360).
 */
export function normalizeDegrees(degrees) {
  let value = degrees % 360;

  if (value < 0) {
    value += 360;
  }

  // Avoid returning 360 because of floating-point noise.
  if (value >= 360) {
    value = 0;
  }

  return value;
}

/**
 * Convert a JavaScript Date to Julian Day.
 *
 * The Date must represent the UTC instant.
 */
export function julianDay(dateUTC) {
  if (!(dateUTC instanceof Date) || Number.isNaN(dateUTC.getTime())) {
    throw new TypeError("Expected a valid JavaScript Date.");
  }

  return dateUTC.getTime() / 86400000 + 2440587.5;
}

/**
 * Calculate Julian centuries from J2000.0.
 */
export function julianCenturiesFromJ2000(dateUTC) {
  return (julianDay(dateUTC) - J2000_JD) / 36525;
}

/**
 * Calculate Lahiri / Chitrapaksha ayanamsha in degrees.
 */
export function lahiriAyanamsha(dateUTC) {
  const T = julianCenturiesFromJ2000(dateUTC);

  const precessionArcseconds =
    5038.7784 * T -
    1.07259 * T * T -
    0.001147 * T * T * T;

  const precessionDegrees = precessionArcseconds / 3600;

  return LAHIRI_J2000_DEG + precessionDegrees;
}

/**
 * Convert tropical longitude to Lahiri sidereal longitude.
 */
export function tropicalToSidereal(tropicalLongitude, dateUTC) {
  if (!Number.isFinite(tropicalLongitude)) {
    throw new TypeError("Tropical longitude must be a finite number.");
  }

  const ayanamsha = lahiriAyanamsha(dateUTC);

  return normalizeDegrees(
    tropicalLongitude - ayanamsha
  );
}

/**
 * Convert sidereal longitude back to tropical longitude.
 */
export function siderealToTropical(siderealLongitude, dateUTC) {
  if (!Number.isFinite(siderealLongitude)) {
    throw new TypeError("Sidereal longitude must be a finite number.");
  }

  const ayanamsha = lahiriAyanamsha(dateUTC);

  return normalizeDegrees(
    siderealLongitude + ayanamsha
  );
}

/**
 * Format a decimal degree value as:
 *
 * 23° 51′ 24.0″
 */
export function formatDegreesDMS(degrees) {
  const normalized = normalizeDegrees(degrees);

  const wholeDegrees = Math.floor(normalized);
  const minutesFloat = (normalized - wholeDegrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;

  return `${wholeDegrees}° ${String(minutes).padStart(2, "0")}′ ${seconds
    .toFixed(1)
    .padStart(4, "0")}″`;
}