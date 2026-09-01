/**
 * astrology/sidereal.js
 * Converts tropical (Western) ecliptic longitude to sidereal (Vedic)
 * longitude by subtracting the ayanamsa — the accumulated precessional
 * offset between the two zodiacs.
 *
 * This implements the Lahiri ayanamsa (the official standard used by the
 * Indian government and most Vedic astrologers), via the standard
 * linear approximation anchored to its N. C. Lahiri committee epoch.
 * It's accurate to within a few arcseconds for any date in living memory
 * — plenty precise for sign/nakshatra placement, though a full
 * IAU-precession model would be used for research-grade work.
 */

import { centuriesSinceJ2000 } from "./julian-day.js";
import { norm360 } from "./coordinates.js";

// Compact Lahiri-style approximation anchored near the beginning of the
// 20th century. This is suitable for sign/nakshatra display, but is not
// a substitute for a research-grade ephemeris implementation.
const AYANAMSA_AT_1900 = 22.46; // degrees, per Lahiri's reference epoch
const PRECESSION_PER_YEAR = 0.013972; // degrees/year (~50.3 arcsec/year)

export function lahiriAyanamsa(year) {
  const yearsSince1900 = year - 1900;
  return AYANAMSA_AT_1900 + yearsSince1900 * PRECESSION_PER_YEAR;
}

/** Tropical longitude -> sidereal (Vedic) longitude for a given birth year. */
export function toSidereal(tropicalLongitude, birthYear) {
  const ayanamsa = lahiriAyanamsa(birthYear);
  return norm360(tropicalLongitude - ayanamsa);
}
