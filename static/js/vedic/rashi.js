/**
 * AstroLight Vedic Engine
 *
 * Rashi calculation from sidereal longitude.
 */

export const RASHIS = Object.freeze([
  {
    index: 0,
    name: "Aries",
    sanskrit: "Mesha",
    symbol: "♈",
  },
  {
    index: 1,
    name: "Taurus",
    sanskrit: "Vrishabha",
    symbol: "♉",
  },
  {
    index: 2,
    name: "Gemini",
    sanskrit: "Mithuna",
    symbol: "♊",
  },
  {
    index: 3,
    name: "Cancer",
    sanskrit: "Karka",
    symbol: "♋",
  },
  {
    index: 4,
    name: "Leo",
    sanskrit: "Simha",
    symbol: "♌",
  },
  {
    index: 5,
    name: "Virgo",
    sanskrit: "Kanya",
    symbol: "♍",
  },
  {
    index: 6,
    name: "Libra",
    sanskrit: "Tula",
    symbol: "♎",
  },
  {
    index: 7,
    name: "Scorpio",
    sanskrit: "Vrishchika",
    symbol: "♏",
  },
  {
    index: 8,
    name: "Sagittarius",
    sanskrit: "Dhanu",
    symbol: "♐",
  },
  {
    index: 9,
    name: "Capricorn",
    sanskrit: "Makara",
    symbol: "♑",
  },
  {
    index: 10,
    name: "Aquarius",
    sanskrit: "Kumbha",
    symbol: "♒",
  },
  {
    index: 11,
    name: "Pisces",
    sanskrit: "Meena",
    symbol: "♓",
  },
]);

/**
 * Return the Rashi for a sidereal longitude.
 */
export function rashiFromLongitude(siderealLongitude) {
  if (
    !Number.isFinite(siderealLongitude) ||
    siderealLongitude < 0 ||
    siderealLongitude >= 360
  ) {
    throw new RangeError(
      "Sidereal longitude must be between 0° and less than 360°."
    );
  }

  const index = Math.floor(siderealLongitude / 30);

  const rashi = RASHIS[index];

  return {
    ...rashi,
    degreeInSign: siderealLongitude - index * 30,
  };
}