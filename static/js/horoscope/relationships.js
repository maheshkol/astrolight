/**
 * horoscope/relationships.js
 *
 * Converts planetary sign placements into deterministic
 * interpretive relationships for the daily horoscope engine.
 *
 * This module does not calculate astronomy.
 * It interprets the planetary snapshot produced by planetary.js.
 */

import {
  SIGN_ELEMENTS,
  SIGN_MODALITIES,
  PLANET_THEMES,
  elementRelationship,
} from "./rules.js";

/**
 * Determine the broad relationship between two signs.
 *
 * Returns:
 *   {
 *     elementRelation,
 *     modalityRelation
 *   }
 */
export function signRelationship(sunSign, planetSign) {
  const normalizeSign = (value) => {
    const text = String(value).trim();

    if (!text) return "";

    return (
      text.charAt(0).toUpperCase() +
      text.slice(1).toLowerCase()
    );
  };

  const normalizedSunSign =
    normalizeSign(sunSign);

  const normalizedPlanetSign =
    normalizeSign(planetSign);

  const sunElement =
    SIGN_ELEMENTS[normalizedSunSign];

  const planetElement =
    SIGN_ELEMENTS[normalizedPlanetSign];

  const sunModality =
    SIGN_MODALITIES[normalizedSunSign];

  const planetModality =
    SIGN_MODALITIES[normalizedPlanetSign];

  if (!sunElement || !planetElement) {
    throw new Error(
      `Unknown sign: ${sunSign} or ${planetSign}`
    );
  }

  return {
    elementRelation:
      elementRelationship(
        normalizedSunSign,
        normalizedPlanetSign
      ),

    modalityRelation:
      sunModality === planetModality
        ? "same"
        : "different",
  };
}

/**
 * Interpret one planetary placement relative to a Sun sign.
 *
 * Example:
 *
 *   Sun sign = Aries
 *   Mars sign = Cancer
 *
 * produces a structured interpretation such as:
 *
 *   {
 *     planet: "Mars",
 *     sign: "Cancer",
 *     theme: "action",
 *     tone: "challenging",
 *     elementRelation: "challenging"
 *   }
 */
export function interpretPlanetPlacement(
  sunSign,
  planetName,
  planetPosition
) {
  if (!PLANET_THEMES[planetName]) {
    throw new Error(`Unknown planet: ${planetName}`);
  }

  if (!planetPosition || !planetPosition.sign) {
    throw new Error(
      `Missing planetary position for ${planetName}`
    );
  }

  const relationship = signRelationship(
    sunSign,
    planetPosition.sign
  );

  const theme = PLANET_THEMES[planetName];

  const tone =
    relationship.elementRelation === "supportive"
      ? "supportive"
      : "challenging";

  return {
    planet: planetName,
    planetSign: planetPosition.sign,
    degreeInSign: planetPosition.degreeInSign,

    theme: theme.core,

    positiveTheme: theme.positive,
    challengingTheme: theme.challenging,

    tone,

    elementRelation: relationship.elementRelation,
    modalityRelation: relationship.modalityRelation,
  };
}

/**
 * Interpret every planet in a planetary snapshot
 * relative to one Sun sign.
 *
 * Returns an array that can later be scored and converted
 * into horoscope prose.
 */
export function interpretPlanetarySnapshot(
  sunSign,
  snapshot
) {
  if (!snapshot || !snapshot.planets) {
    throw new Error(
      "interpretPlanetarySnapshot requires a planetary snapshot."
    );
  }

  return Object.entries(snapshot.planets).map(
    ([planetName, planetPosition]) =>
      interpretPlanetPlacement(
        sunSign,
        planetName,
        planetPosition
      )
  );
}
