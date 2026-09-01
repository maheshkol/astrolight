/**
 * astrology/nakshatra.js
 * The sidereal ecliptic is divided into 27 nakshatras (lunar mansions) of
 * 13°20' each, each split into 4 padas of 3°20'. This module maps a
 * sidereal longitude (almost always the Moon's) to nakshatra + pada.
 */

import { norm360 } from "./coordinates.js";

export const NAKSHATRA_SPAN = 360 / 27; // 13.3333...°
export const PADA_SPAN = NAKSHATRA_SPAN / 4; // 3.3333...°

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

export function nakshatraFromSiderealLongitude(siderealLongitude) {
  const lon = norm360(siderealLongitude);
  const index = Math.floor(lon / NAKSHATRA_SPAN);
  const remainder = lon - index * NAKSHATRA_SPAN;
  const pada = Math.floor(remainder / PADA_SPAN) + 1; // 1-4
  return {
    index,
    name: NAKSHATRAS[index],
    pada,
    degreeInNakshatra: remainder,
  };
}
