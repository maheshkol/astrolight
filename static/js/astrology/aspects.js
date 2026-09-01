/**
 * astrology/aspects.js
 * Calculates angular relationships (aspects) between pairs of planets.
 * An aspect is just the angular distance between two longitudes, checked
 * against known "special" angles within an allowed orb (tolerance).
 */

import { norm360 } from "./coordinates.js";

export const ASPECT_DEFINITIONS = [
  { name: "Conjunction", angle: 0, orb: 8 },
  { name: "Sextile", angle: 60, orb: 4 },
  { name: "Square", angle: 90, orb: 6 },
  { name: "Trine", angle: 120, orb: 6 },
  { name: "Opposition", angle: 180, orb: 8 },
];

function angularSeparation(lon1, lon2) {
  const diff = Math.abs(norm360(lon1) - norm360(lon2));
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Given { PlanetName: longitude } pairs, returns every aspect found
 * within its orb, e.g. { a: "Mars", b: "Jupiter", aspect: "Trine", orb: 2.3 }
 */
export function findAspects(planetLongitudes) {
  const names = Object.keys(planetLongitudes);
  const found = [];

  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const a = names[i];
      const b = names[j];
      const sep = angularSeparation(planetLongitudes[a], planetLongitudes[b]);

      for (const def of ASPECT_DEFINITIONS) {
        const diff = Math.abs(sep - def.angle);
        if (diff <= def.orb) {
          found.push({ a, b, aspect: def.name, exactOrb: Number(diff.toFixed(2)) });
          break; // only the closest-matching aspect per pair
        }
      }
    }
  }
  return found;
}
