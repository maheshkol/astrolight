/**
 * AstroLight Vedic Engine
 *
 * Nakshatra and Pada calculation.
 *
 * 27 Nakshatras
 * Each Nakshatra = 13°20′
 * Each Pada = 3°20′
 */

const NAKSHATRA_COUNT = 27;

export const NAKSHATRA_SPAN = 360 / NAKSHATRA_COUNT;
export const PADA_SPAN = NAKSHATRA_SPAN / 4;

export const NAKSHATRAS = Object.freeze([
  { number: 1, name: "Ashwini", lord: "Ketu" },
  { number: 2, name: "Bharani", lord: "Venus" },
  { number: 3, name: "Krittika", lord: "Sun" },
  { number: 4, name: "Rohini", lord: "Moon" },
  { number: 5, name: "Mrigashira", lord: "Mars" },
  { number: 6, name: "Ardra", lord: "Rahu" },
  { number: 7, name: "Punarvasu", lord: "Jupiter" },
  { number: 8, name: "Pushya", lord: "Saturn" },
  { number: 9, name: "Ashlesha", lord: "Mercury" },
  { number: 10, name: "Magha", lord: "Ketu" },
  { number: 11, name: "Purva Phalguni", lord: "Venus" },
  { number: 12, name: "Uttara Phalguni", lord: "Sun" },
  { number: 13, name: "Hasta", lord: "Moon" },
  { number: 14, name: "Chitra", lord: "Mars" },
  { number: 15, name: "Swati", lord: "Rahu" },
  { number: 16, name: "Vishakha", lord: "Jupiter" },
  { number: 17, name: "Anuradha", lord: "Saturn" },
  { number: 18, name: "Jyeshtha", lord: "Mercury" },
  { number: 19, name: "Mula", lord: "Ketu" },
  { number: 20, name: "Purva Ashadha", lord: "Venus" },
  { number: 21, name: "Uttara Ashadha", lord: "Sun" },
  { number: 22, name: "Shravana", lord: "Moon" },
  { number: 23, name: "Dhanishta", lord: "Mars" },
  { number: 24, name: "Shatabhisha", lord: "Rahu" },
  { number: 25, name: "Purva Bhadrapada", lord: "Jupiter" },
  { number: 26, name: "Uttara Bhadrapada", lord: "Saturn" },
  { number: 27, name: "Revati", lord: "Mercury" },
]);

export function nakshatraFromLongitude(siderealLongitude) {
  if (
    !Number.isFinite(siderealLongitude) ||
    siderealLongitude < 0 ||
    siderealLongitude >= 360
  ) {
    throw new RangeError(
      "Sidereal longitude must be between 0° and less than 360°."
    );
  }

  const nakshatraIndex = Math.floor(
    siderealLongitude / NAKSHATRA_SPAN
  );

  const nakshatra = NAKSHATRAS[nakshatraIndex];

  if (!nakshatra) {
    throw new Error(
      `Unable to resolve Nakshatra for longitude ${siderealLongitude}.`
    );
  }

  const startLongitude =
    nakshatraIndex * NAKSHATRA_SPAN;

  const positionWithinNakshatra =
    siderealLongitude - startLongitude;

  const pada =
    Math.floor(positionWithinNakshatra / PADA_SPAN) + 1;

  return {
    ...nakshatra,

    index: nakshatraIndex,

    pada,

    nakshatraStartLongitude:
      startLongitude,

    nakshatraEndLongitude:
      startLongitude + NAKSHATRA_SPAN,

    degreeWithinNakshatra:
      positionWithinNakshatra,

    degreeWithinPada:
      positionWithinNakshatra -
      (pada - 1) * PADA_SPAN,
  };
}