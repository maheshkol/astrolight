/**
 * astrology/zodiac.js
 * Maps an ecliptic longitude (0-360°) to a tropical zodiac sign.
 * This replaces the old hardcoded "March 21 = Aries" date-range table:
 * the sign is now derived from the Sun's (or any planet's) actual
 * calculated ecliptic longitude, per the doc's requirement.
 */

import { norm360 } from "./coordinates.js";

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const ZODIAC_SYMBOLS = {
  Aries: "\u2648", Taurus: "\u2649", Gemini: "\u264A", Cancer: "\u264B",
  Leo: "\u264C", Virgo: "\u264D", Libra: "\u264E", Scorpio: "\u264F",
  Sagittarius: "\u2650", Capricorn: "\u2651", Aquarius: "\u2652", Pisces: "\u2653",
};

/**
 * signIndex = floor(longitude / 30)
 * Each sign occupies exactly 30° of the 360° ecliptic.
 */
export function signFromLongitude(longitudeDegrees) {
  const lon = norm360(longitudeDegrees);
  const index = Math.floor(lon / 30);
  const degreeInSign = lon - index * 30;
  return {
    index,
    sign: ZODIAC_SIGNS[index],
    symbol: ZODIAC_SYMBOLS[ZODIAC_SIGNS[index]],
    degreeInSign, // 0-30, e.g. 17.4° Leo
  };
}
