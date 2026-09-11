/**
 * AstroLight Vedic / Sidereal Engine
 *
 * Public entry point.
 *
 * This module intentionally has no dependency on:
 *
 *   - Western zodiac engine
 *   - Sun-sign engine
 *   - Horoscope engine
 *   - Compatibility engine
 *
 * It receives astronomical tropical longitude and
 * performs only Vedic/Sidereal calculations.
 */

import {
  lahiriAyanamsha,
  tropicalToSidereal,
  siderealToTropical,
  normalizeDegrees,
  julianDay,
  julianCenturiesFromJ2000,
  formatDegreesDMS,
} from "./ayanamsha.js";

import {
  RASHIS,
  rashiFromLongitude,
} from "./rashi.js";

import {
  NAKSHATRAS,
  NAKSHATRA_SPAN,
  PADA_SPAN,
  nakshatraFromLongitude,
} from "./nakshatra.js";

/**
 * Calculate complete Vedic lunar information.
 *
 * Input:
 *   tropicalMoonLongitude
 *   dateUTC
 *
 * Output:
 *   ayanamsha
 *   sidereal longitude
 *   Rashi
 *   Nakshatra
 *   Pada
 */
export function calculateVedicMoon({
  tropicalMoonLongitude,
  dateUTC,
}) {
  if (
    !Number.isFinite(tropicalMoonLongitude)
  ) {
    throw new TypeError(
      "tropicalMoonLongitude must be a finite number."
    );
  }

  if (
    !(dateUTC instanceof Date) ||
    Number.isNaN(dateUTC.getTime())
  ) {
    throw new TypeError(
      "dateUTC must be a valid JavaScript Date."
    );
  }

  const normalizedTropical =
    normalizeDegrees(tropicalMoonLongitude);

  const ayanamsha =
    lahiriAyanamsha(dateUTC);

  const siderealLongitude =
    tropicalToSidereal(
      normalizedTropical,
      dateUTC
    );

  const rashi =
    rashiFromLongitude(
      siderealLongitude
    );

  const nakshatra =
    nakshatraFromLongitude(
      siderealLongitude
    );

  return {
    system: "Vedic / Sidereal",
    ayanamshaSystem: "Lahiri / Chitrapaksha",

    dateUTC,

    tropicalLongitude:
      normalizedTropical,

    ayanamsha,

    siderealLongitude,

    rashi,

    nakshatra,

    pada: nakshatra.pada,
  };
}

export {
  RASHIS,
  NAKSHATRAS,

  NAKSHATRA_SPAN,
  PADA_SPAN,

  lahiriAyanamsha,
  tropicalToSidereal,
  siderealToTropical,

  normalizeDegrees,
  julianDay,
  julianCenturiesFromJ2000,

  formatDegreesDMS,

  rashiFromLongitude,
  nakshatraFromLongitude,
};