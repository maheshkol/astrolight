/**
 * astrology/houses.js
 * Calculates the Ascendant (rising sign) and house cusps.
 *
 * The Ascendant requires: local sidereal time (from birth date+time+
 * longitude), the birth latitude, and the obliquity of the ecliptic.
 * This is the standard trigonometric formula (Meeus / classic astrological
 * texts).
 *
 * House system implemented: EQUAL HOUSES (each house is exactly 30° from
 * the Ascendant). This is a deliberate, disclosed simplification —
 * Placidus, Koch, and Whole Sign are more commonly used in practice but
 * require iterative/time-based solving that's a meaningfully bigger lift.
 * Equal house is a real, valid house system (not a placeholder), just not
 * the only one — flagged as a v2 upgrade in the README.
 */

import { DEG, RAD, norm360 } from "./coordinates.js";

/**
 * @param lstDegrees   Local Sidereal Time, in degrees (0-360)
 * @param latitudeDeg  Birth latitude, degrees (north positive)
 * @param obliquityDeg Obliquity of the ecliptic, degrees
 * @returns Ascendant ecliptic longitude, degrees (tropical)
 */
export function calculateAscendant(lstDegrees, latitudeDeg, obliquityDeg) {
  const lst = lstDegrees * DEG;
  const lat = latitudeDeg * DEG;
  const obl = obliquityDeg * DEG;

  const y = -Math.cos(lst);
  const x = Math.sin(lst) * Math.cos(obl) + Math.tan(lat) * Math.sin(obl);

  let ascendant = Math.atan2(y, x) * RAD;
  return norm360(ascendant);
}

/** Equal-house cusps: house N starts N-1 signs' worth of degrees past the Ascendant. */
export function equalHouseCusps(ascendantLongitude) {
  const cusps = [];
  for (let house = 1; house <= 12; house++) {
    cusps.push({
      house,
      cuspLongitude: norm360(ascendantLongitude + (house - 1) * 30),
    });
  }
  return cusps;
}

/** Given a planet's longitude and the house cusps, find which house it falls in. */
export function housePlacement(planetLongitude, cusps) {
  const lon = norm360(planetLongitude);
  for (let i = 0; i < 12; i++) {
    const start = cusps[i].cuspLongitude;
    const end = cusps[(i + 1) % 12].cuspLongitude;
    const inRange = start < end ? lon >= start && lon < end : lon >= start || lon < end;
    if (inRange) return cusps[i].house;
  }
  return 1; // fallback, shouldn't hit
}
