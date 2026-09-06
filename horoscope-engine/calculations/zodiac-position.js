/**
 * AstroLight Horoscope Engine
 * Phase 1 — Planetary Position Calculation
 *
 * Converts planetary ecliptic longitudes into
 * zodiac signs and degrees.
 *
 * Astronomy Engine supplies the astronomical
 * coordinates; this module handles the
 * zodiac-position interpretation layer.
 */

const ZODIAC_SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces"
];

/**
 * Convert an ecliptic longitude (0–360°)
 * into a Sun-sign zodiac position.
 *
 * Example:
 *   0°   → Aries 0°
 *   30°  → Taurus 0°
 *   45°  → Taurus 15°
 *   359° → Pisces 29°
 */
export function longitudeToZodiac(longitude) {
  if (!Number.isFinite(longitude)) {
    throw new Error("Longitude must be a finite number.");
  }

  // Normalize longitude into [0, 360).
  const normalized = ((longitude % 360) + 360) % 360;

  const signIndex = Math.floor(normalized / 30);
  const degree = normalized - signIndex * 30;

  return {
    sign: ZODIAC_SIGNS[signIndex],
    signIndex,
    degree
  };
}

/**
 * Return all 12 zodiac signs.
 */
export function getZodiacSigns() {
  return [...ZODIAC_SIGNS];
}
