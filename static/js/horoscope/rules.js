/**
 * horoscope/rules.js
 *
 * Deterministic interpretation rules for AstroLight
 * daily Sun-sign horoscopes.
 *
 * IMPORTANT:
 * This file contains interpretation rules only.
 * It does not calculate astronomical positions.
 */

/*
 * The twelve Sun signs used by AstroLight.
 */
export const SUN_SIGNS = [
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
 * Planetary themes.
 *
 * These are intentionally broad interpretive categories.
 * They will later be combined with planetary relationships,
 * aspects and the person's Sun sign.
 */
export const PLANET_THEMES = {
  Sun: {
    core: "identity",
    positive: "confidence",
    challenging: "self_focus",
  },

  Moon: {
    core: "emotions",
    positive: "emotional_awareness",
    challenging: "emotional_reactivity",
  },

  Mercury: {
    core: "communication",
    positive: "clear_communication",
    challenging: "communication_friction",
  },

  Venus: {
    core: "relationships",
    positive: "connection",
    challenging: "relationship_tension",
  },

  Mars: {
    core: "action",
    positive: "motivation",
    challenging: "friction",
  },

  Jupiter: {
    core: "growth",
    positive: "opportunity",
    challenging: "overextension",
  },

  Saturn: {
    core: "responsibility",
    positive: "discipline",
    challenging: "restriction",
  },

  Uranus: {
    core: "change",
    positive: "innovation",
    challenging: "unpredictability",
  },

  Neptune: {
    core: "imagination",
    positive: "intuition",
    challenging: "uncertainty",
  },

  Pluto: {
    core: "transformation",
    positive: "renewal",
    challenging: "intensity",
  },
};

/*
 * Elements.
 *
 * These relationships will eventually help determine
 * whether a planet's sign is broadly supportive,
 * neutral or challenging for the Sun sign.
 */
export const SIGN_ELEMENTS = {
  Aries: "Fire",
  Taurus: "Earth",
  Gemini: "Air",
  Cancer: "Water",
  Leo: "Fire",
  Virgo: "Earth",
  Libra: "Air",
  Scorpio: "Water",
  Sagittarius: "Fire",
  Capricorn: "Earth",
  Aquarius: "Air",
  Pisces: "Water",
};

/*
 * Modalities.
 */
export const SIGN_MODALITIES = {
  Aries: "Cardinal",
  Taurus: "Fixed",
  Gemini: "Mutable",
  Cancer: "Cardinal",
  Leo: "Fixed",
  Virgo: "Mutable",
  Libra: "Cardinal",
  Scorpio: "Fixed",
  Sagittarius: "Mutable",
  Capricorn: "Cardinal",
  Aquarius: "Fixed",
  Pisces: "Mutable",
};

/*
 * Traditional element relationships.
 *
 * These are used as an interpretive framework,
 * not as scientific claims.
 */
export const ELEMENT_RELATIONSHIPS = {
  Fire: {
    Fire: "supportive",
    Air: "supportive",
    Earth: "challenging",
    Water: "challenging",
  },

  Earth: {
    Earth: "supportive",
    Water: "supportive",
    Fire: "challenging",
    Air: "challenging",
  },

  Air: {
    Air: "supportive",
    Fire: "supportive",
    Earth: "challenging",
    Water: "challenging",
  },

  Water: {
    Water: "supportive",
    Earth: "supportive",
    Fire: "challenging",
    Air: "challenging",
  },
};

/*
 * Returns the broad element relationship between
 * a Sun sign and another sign.
 */
export function elementRelationship(sunSign, otherSign) {
  const sunElement = SIGN_ELEMENTS[sunSign];
  const otherElement = SIGN_ELEMENTS[otherSign];

  if (!sunElement || !otherElement) {
    throw new Error("Unknown zodiac sign.");
  }

  return ELEMENT_RELATIONSHIPS[sunElement][otherElement];
}
