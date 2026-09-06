/**
 * horoscope/scoring.js
 *
 * Converts planetary relationships and aspects into a
 * deterministic daily horoscope score.
 *
 * This module does not generate prose.
 * It produces structured signals that the prose layer
 * can safely interpret.
 */

import { PLANET_THEMES } from "./rules.js";

/*
 * Planet importance for a general Sun-sign horoscope.
 *
 * Faster planets receive more weight because they create
 * more noticeable day-to-day changes.
 *
 * Slower planets still matter, but with less daily weight.
 */
export const PLANET_WEIGHTS = {
  Sun: 5,
  Moon: 5,
  Mercury: 4,
  Venus: 4,
  Mars: 4,
  Jupiter: 3,
  Saturn: 3,
  Uranus: 2,
  Neptune: 2,
  Pluto: 2,
};

/*
 * Aspect strength.
 *
 * Smaller exactOrb = stronger aspect.
 */
export const ASPECT_WEIGHTS = {
  Conjunction: 5,
  Opposition: 4,
  Square: 4,
  Trine: 4,
  Sextile: 3,
};

export const ASPECT_DIRECTIONS = {
  Trine: 1,
  Sextile: 1,
  Square: -1,
  Opposition: -1,
  Conjunction: 0,
};

/**
 * Convert one planetary interpretation into a score.
 */
export function scorePlanetPlacement(interpretation) {
  if (!interpretation || !interpretation.planet) {
    throw new Error(
      "scorePlanetPlacement requires a planetary interpretation."
    );
  }

  const planet = interpretation.planet;
  const weight = PLANET_WEIGHTS[planet] ?? 1;

  /*
   * Supportive placements contribute positively.
   * Challenging placements contribute negatively.
   */
  const direction =
    interpretation.tone === "supportive"
      ? 1
      : -1;

  const score = direction * weight;

  const theme =
    PLANET_THEMES[planet]?.core ?? "general";

  return {
    planet,
    theme,
    tone: interpretation.tone,
    score,
    weight,
  };
}

/**
 * Score all planetary placements.
 */
export function scorePlanetaryRelationships(
  interpretations
) {
  if (!Array.isArray(interpretations)) {
    throw new Error(
      "scorePlanetaryRelationships requires an array."
    );
  }

  return interpretations.map(scorePlanetPlacement);
}

/**
 * Score one planetary aspect.
 */
export function scoreAspect(aspect) {
  if (!aspect || !aspect.aspect) {
    throw new Error(
      "scoreAspect requires a valid aspect."
    );
  }

  const weight =
    ASPECT_WEIGHTS[aspect.aspect] ?? 1;

  const orb = Number(
    aspect.exactOrb ?? 0
  );

  const strength = Math.max(
    0.25,
    1 - orb / 10
  );

  const direction =
    ASPECT_DIRECTIONS[aspect.aspect] ?? 0;

  const directionalScore =
    Number(
      (weight * strength * direction).toFixed(2)
    );

  return {
    a: aspect.a,
    b: aspect.b,

    aspect: aspect.aspect,

    exactOrb: orb,

    weight,

    strength:
      Number(strength.toFixed(2)),

    direction,

    directionalScore,
  };
}

/**
 * Score all planetary aspects.
 *
 * Aspect direction is already encoded by ASPECT_DIRECTIONS.
 * The interpretation layer can therefore use both the
 * directional score and the aspect type when generating prose.
 */
export function scoreAspects(aspects) {
  if (!Array.isArray(aspects)) {
    throw new Error(
      "scoreAspects requires an aspects array."
    );
  }

  return aspects.map(scoreAspect);
}

/**
 * Produce the overall numerical profile.
 */
export function summarizeScores(
  planetaryScores,
  aspectScores
) {
  if (
    !Array.isArray(planetaryScores) ||
    !Array.isArray(aspectScores)
  ) {
    throw new Error(
      "summarizeScores requires planetary and aspect score arrays."
    );
  }

  const planetaryTotal = planetaryScores.reduce(
    (total, item) => total + item.score,
    0
  );

  const aspectTotal = Number(
  aspectScores
    .reduce(
      (total, item) =>
        total + (item.directionalScore ?? 0),
      0
    )
    .toFixed(2)
);

  const supportiveCount = planetaryScores.filter(
    item => item.score > 0
  ).length;

  const challengingCount = planetaryScores.filter(
    item => item.score < 0
  ).length;

  let overallTone = "balanced";

  if (planetaryTotal >= 8) {
    overallTone = "supportive";
  } else if (planetaryTotal <= -8) {
    overallTone = "challenging";
  }

  return {
    planetaryTotal,
    aspectTotal,
    combinedScore: Number(
      (planetaryTotal + aspectTotal).toFixed(2)
    ),
    supportiveCount,
    challengingCount,
    overallTone,
  };
}


