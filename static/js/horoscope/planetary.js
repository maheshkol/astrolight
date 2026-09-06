/**
 * horoscope/planetary.js
 *
 * Creates the deterministic planetary snapshot used by the
 * AstroLight daily Sun-sign horoscope engine.
 *
 * This module deliberately does NOT calculate astronomy itself.
 * It reuses the existing AstroLight astronomy layer:
 *
 *   astrology/planets.js
 *   astrology/zodiac.js
 *
 * Same UTC date/time + same astronomy library = same snapshot.
 */

import { allPlanetLongitudes } from "../astrology/planets.js";
import { signFromLongitude } from "../astrology/zodiac.js";

/**
 * Calculate a complete tropical planetary snapshot.
 *
 * @param {Date} dateUTC - JavaScript Date representing UTC time.
 * @returns {Object} Structured planetary positions.
 */
export function calculatePlanetarySnapshot(dateUTC) {
  if (!(dateUTC instanceof Date) || Number.isNaN(dateUTC.getTime())) {
    throw new Error("calculatePlanetarySnapshot requires a valid Date.");
  }

  const longitudes = allPlanetLongitudes(dateUTC);

  const planets = {};

  for (const [name, longitude] of Object.entries(longitudes)) {
    const signInfo = signFromLongitude(longitude);

    planets[name] = {
      longitude: Number(longitude.toFixed(4)),
      sign: signInfo.sign,
      symbol: signInfo.symbol,
      degreeInSign: Number(signInfo.degreeInSign.toFixed(4)),
    };
  }

  return {
    timestampUTC: dateUTC.toISOString(),
    planets,
  };
}
