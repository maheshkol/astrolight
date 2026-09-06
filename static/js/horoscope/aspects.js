/**
 * horoscope/aspects.js
 *
 * Horoscope-specific adapter around the existing AstroLight
 * astrology/aspects.js calculation engine.
 *
 * This module does not calculate angular separation itself.
 * It reuses the established aspect calculation.
 */

import { findAspects } from "../astrology/aspects.js";

/**
 * Calculate the active planetary aspects for a daily snapshot.
 *
 * @param {Object} snapshot - Result from planetary.js
 * @returns {Array} Active aspects.
 */
export function calculateHoroscopeAspects(snapshot) {
  if (!snapshot || !snapshot.planets) {
    throw new Error(
      "calculateHoroscopeAspects requires a planetary snapshot."
    );
  }

  const longitudes = {};

  for (const [planetName, position] of Object.entries(snapshot.planets)) {
    longitudes[planetName] = position.longitude;
  }

  return findAspects(longitudes);
}

/**
 * Return aspects involving a particular planet.
 *
 * Example:
 *
 *   getPlanetAspects("Mars", aspects)
 */
export function getPlanetAspects(planetName, aspects) {
  if (!Array.isArray(aspects)) {
    throw new Error(
      "getPlanetAspects requires an aspects array."
    );
  }

  return aspects.filter(
    aspect =>
      aspect.a === planetName ||
      aspect.b === planetName
  );
}

/**
 * Return all aspects involving the Sun.
 *
 * These are especially important for a Sun-sign horoscope
 * because they describe planetary relationships directly
 * connected to the identity/sign reference point.
 */
export function getSunAspects(aspects) {
  return getPlanetAspects("Sun", aspects);
}
