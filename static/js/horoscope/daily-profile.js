/**
 * horoscope/daily-profile.js
 *
 * Main orchestration layer for the AstroLight daily horoscope engine.
 *
 * Pipeline:
 *
 *   UTC date
 *      ↓
 *   planetary snapshot
 *      ↓
 *   planetary relationships
 *      ↓
 *   active aspects
 *      ↓
 *   deterministic scores
 *      ↓
 *   structured interpretation
 *      ↓
 *   deterministic prose
 *      ↓
 *   complete daily horoscope
 */

import { calculatePlanetarySnapshot } from "./planetary.js";

import {
  interpretPlanetarySnapshot,
} from "./relationships.js";

import {
  calculateHoroscopeAspects,
} from "./aspects.js";

import {
  scorePlanetaryRelationships,
  scoreAspects,
  summarizeScores,
} from "./scoring.js";

import {
  interpretDailyProfile,
} from "./interpretation.js";

import {
  generateHoroscopeProse,
} from "./prose.js";

/**
 * Generate a deterministic daily horoscope for one Sun sign.
 *
 * @param {string} sunSign
 * @param {Date} dateUTC
 * @returns {Object}
 */
export function generateDailyProfile(
  sunSign,
  dateUTC = new Date()
) {
  if (
    !sunSign ||
    typeof sunSign !== "string"
  ) {
    throw new Error(
      "generateDailyProfile requires a Sun sign."
    );
  }

  if (
    !(dateUTC instanceof Date) ||
    Number.isNaN(dateUTC.getTime())
  ) {
    throw new Error(
      "generateDailyProfile requires a valid Date."
    );
  }

  /*
   * 1. Calculate the actual planetary state.
   */
  const snapshot =
    calculatePlanetarySnapshot(
      dateUTC
    );

  /*
   * 2. Interpret planetary placements
   *    relative to the Sun sign.
   */
  const interpretations =
    interpretPlanetarySnapshot(
      sunSign,
      snapshot
    );

  /*
   * 3. Calculate active planetary aspects.
   */
  const aspects =
    calculateHoroscopeAspects(
      snapshot
    );

  /*
   * 4. Score planetary relationships.
   */
  const planetaryScores =
    scorePlanetaryRelationships(
      interpretations
    );

  /*
   * 5. Score planetary aspects.
   */
  const aspectScores =
    scoreAspects(
      aspects
    );

  /*
   * 6. Produce numerical summary.
   */
  const summary =
    summarizeScores(
      planetaryScores,
      aspectScores
    );

  /*
   * 7. Build structured interpretation.
   */
  const interpretation =
    interpretDailyProfile({
      sunSign,
      dateUTC:
        snapshot.timestampUTC,
      planets:
        snapshot.planets,
      interpretations,
      aspects,
      planetaryScores,
      aspectScores,
      summary,
    });

  /*
   * 8. Convert structured signals into
   *    deterministic reader-facing prose.
   */
  const prose =
    generateHoroscopeProse(
      sunSign,
      interpretation,
      dateUTC,
    {
      interpretations,
      aspectSignals:
        interpretation.aspectSignals
    }
  );
 

  /*
   * Return both the machine-readable
   * engine data and the reader-facing prose.
   */
  return {
    sunSign,

    dateUTC:
      snapshot.timestampUTC,

    planets:
      snapshot.planets,

    interpretations,

    aspects,

    planetaryScores,

    aspectScores,

    summary,

    interpretation,

    prose,
  };
}

/**
 * Generate daily profiles for all twelve
 * Sun signs from the SAME planetary snapshot.
 *
 * This ensures every sign uses identical
 * astronomical input for the same UTC date.
 */
export function generateAllDailyProfiles(
  dateUTC = new Date()
) {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];

  /*
   * Calculate the planetary snapshot once.
   *
   * This is more efficient than recalculating
   * astronomy independently for every sign.
   */
  const snapshot =
    calculatePlanetarySnapshot(
      dateUTC
    );

  const profiles = {};

  for (const sign of signs) {

    const interpretations =
      interpretPlanetarySnapshot(
        sign,
        snapshot
      );

    const aspects =
      calculateHoroscopeAspects(
        snapshot
      );

    const planetaryScores =
      scorePlanetaryRelationships(
        interpretations
      );

    const aspectScores =
      scoreAspects(
        aspects
      );

    const summary =
      summarizeScores(
        planetaryScores,
        aspectScores
      );

    const interpretation =
      interpretDailyProfile({
        sunSign: sign,
        dateUTC:
          snapshot.timestampUTC,
        planets:
          snapshot.planets,
        interpretations,
        aspects,
        planetaryScores,
        aspectScores,
        summary,
      });

    const prose =
      generateHoroscopeProse(
        sign,
        interpretation,
        dateUTC,
    {
      interpretations,
      aspectSignals:
        interpretation.aspectSignals
    }
      );

    profiles[sign] = {
      sunSign: sign,

      dateUTC:
        snapshot.timestampUTC,

      planets:
        snapshot.planets,

      interpretations,

      aspects,

      planetaryScores,

      aspectScores,

      summary,

      interpretation,

      prose,
    };
  }

  return profiles;
}
