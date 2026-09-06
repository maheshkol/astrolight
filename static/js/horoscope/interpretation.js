/**
 * horoscope/interpretation.js
 *
 * Converts deterministic planetary and aspect scores into
 * structured reader-facing signals for AstroLight daily
 * Sun-sign horoscopes.
 *
 * Pipeline:
 *
 *   planetary positions
 *        ↓
 *   relationships
 *        ↓
 *   aspects
 *        ↓
 *   scoring
 *        ↓
 *   THIS FILE
 *        ↓
 *   prose.js
 *
 * No randomness.
 * No external API.
 * No astronomy calculations.
 */

/*
 * Nine reader-facing horoscope dimensions.
 */
export const HOROSCOPE_CATEGORIES = [
  "general",
  "love",
  "career",
  "money",
  "energy",
  "communication",
  "emotional",
  "opportunity",
  "guidance",
];

/*
 * Planetary themes.
 *
 * A planet can contribute to more than one
 * reader-facing category.
 */
export const PLANET_CATEGORY_MAP = {
  Sun: ["general", "career", "energy"],
  Moon: ["emotional", "love", "guidance"],
  Mercury: ["communication", "career", "money"],
  Venus: ["love", "money", "general"],
  Mars: ["energy", "career", "guidance"],
  Jupiter: ["opportunity", "money", "career"],
  Saturn: ["career", "money", "guidance"],
  Uranus: ["opportunity", "career", "money"],
  Neptune: ["emotional", "guidance", "love"],
  Pluto: ["guidance", "career", "emotional"],
};

/*
 * Stable human-readable themes.
 */
export const PLANET_THEMES = {
  Sun: "identity",
  Moon: "emotions",
  Mercury: "communication",
  Venus: "relationships",
  Mars: "action",
  Jupiter: "growth",
  Saturn: "responsibility",
  Uranus: "change",
  Neptune: "imagination",
  Pluto: "transformation",
};

/*
 * Classify a numerical planetary score.
 */
export function classifyPlanetaryInfluence(score) {
  if (score > 0) return "supportive";
  if (score < 0) return "challenging";
  return "balanced";
}

/*
 * Convert one scored planetary relationship
 * into a structured signal.
 */
export function planetarySignal(scoredItem) {
  if (!scoredItem || !scoredItem.planet) {
    throw new Error(
      "planetarySignal requires a scored planetary item."
    );
  }

  const planet = scoredItem.planet;

  const theme =
    PLANET_THEMES[planet] ?? "general";

  const categories =
    PLANET_CATEGORY_MAP[planet] ?? ["general"];

  const influence =
    classifyPlanetaryInfluence(
      scoredItem.score
    );

  return {
    planet,
    theme,
    categories,
    influence,
    score: scoredItem.score,
    weight: scoredItem.weight,
  };
}

/*
 * Convert all planetary scores into signals.
 */
export function buildPlanetarySignals(
  planetaryScores
) {
  if (!Array.isArray(planetaryScores)) {
    throw new Error(
      "buildPlanetarySignals requires an array."
    );
  }

  return planetaryScores.map(
    planetarySignal
  );
}

/*
 * Traditional aspect character.
 *
 * The strength comes from scoring.js.
 * The meaning comes from this layer.
 */
export function classifyAspect(aspect) {
  if (!aspect || !aspect.aspect) {
    throw new Error(
      "classifyAspect requires a valid aspect."
    );
  }

  switch (aspect.aspect) {
    case "Trine":
      return "supportive";

    case "Sextile":
      return "supportive";

    case "Square":
      return "challenging";

    case "Opposition":
      return "challenging";

    case "Conjunction":
      return "intensifying";

    default:
      return "neutral";
  }
}

/*
 * Convert one scored aspect into a structured signal.
 */
export function aspectSignal(aspectScore) {
  if (!aspectScore || !aspectScore.aspect) {
    throw new Error(
      "aspectSignal requires a scored aspect."
    );
  }

  return {
    planets: [
      aspectScore.a,
      aspectScore.b,
    ],

    aspect: aspectScore.aspect,

    influence:
      classifyAspect(aspectScore),

    strength:
      aspectScore.strength,

    exactOrb:
      aspectScore.exactOrb,

    direction:
      aspectScore.direction ?? 0,

    directionalScore:
      aspectScore.directionalScore ?? 0,
  };
}

/*
 * Convert all aspect scores into signals.
 */
export function buildAspectSignals(
  aspectScores
) {
  if (!Array.isArray(aspectScores)) {
    throw new Error(
      "buildAspectSignals requires an array."
    );
  }

  return aspectScores.map(
    aspectSignal
  );
}

/*
 * Determine the category contribution of one
 * planetary signal.
 *
 * A planet's score is distributed across its
 * relevant reader-facing dimensions.
 */
function categoryContribution(
  signal,
  category
) {
  if (!signal.categories.includes(category)) {
    return 0;
  }

  /*
   * Primary category receives full weight.
   * Secondary categories receive reduced weight.
   */
  const index =
    signal.categories.indexOf(category);

  const multiplier =
    index === 0 ? 1 : 0.6;

  return Number(
    (signal.score * multiplier).toFixed(2)
  );
}

/*
 * Build all nine category profiles.
 */
export function buildCategoryProfiles(
  planetarySignals,
  aspectSignals
) {
  const categories = {};

  for (const category of HOROSCOPE_CATEGORIES) {
    const signals =
      planetarySignals
        .filter(signal =>
          signal.categories.includes(category)
        )
        .map(signal => ({
          ...signal,
          contribution:
            categoryContribution(
              signal,
              category
            ),
        }));

    const total =
      signals.reduce(
        (sum, signal) =>
          sum + signal.contribution,
        0
      );

    const strongest =
      [...signals]
        .sort(
          (a, b) =>
            Math.abs(b.contribution) -
            Math.abs(a.contribution)
        )
        .slice(0, 2);

    const supportive =
      signals.filter(
        signal =>
          signal.influence === "supportive"
      ).length;

    const challenging =
      signals.filter(
        signal =>
          signal.influence === "challenging"
      ).length;

    let tone = "balanced";

    if (total >= 2) {
      tone = "supportive";
    } else if (total <= -2) {
      tone = "challenging";
    }

    categories[category] = {
      category,
      total: Number(total.toFixed(2)),
      tone,
      supportiveCount: supportive,
      challengingCount: challenging,
      strongest,
    };
  }

  /*
   * Aspects are global signals.
   * We attach relevant aspects to categories
   * based on the planets involved.
   */
  for (const category of HOROSCOPE_CATEGORIES) {
    const profile =
      categories[category];

    profile.aspects =
      aspectSignals
        .filter(signal => {
          const planets =
            signal.planets;

          return planets.some(
            planet =>
              planetarySignals.some(
                planetary =>
                  planetary.planet === planet &&
                  planetary.categories.includes(
                    category
                  )
              )
          );
        })
        .sort(
          (a, b) =>
            Math.abs(
              b.directionalScore
            ) -
            Math.abs(
              a.directionalScore
            )
        )
        .slice(0, 3);
  }

  return categories;
}

/*
 * Determine overall daily energy.
 */
export function classifyDailyEnergy(
  summary
) {
  if (!summary) {
    throw new Error(
      "classifyDailyEnergy requires a summary."
    );
  }

  const score =
    Number(summary.combinedScore ?? 0);

  if (score >= 12) {
    return "rising";
  }

  if (score <= -12) {
    return "demanding";
  }

  return "steady";
}

/*
 * Determine the broad daily focus.
 */
export function determineDailyFocus(
  planetarySignals
) {
  const supportive =
    planetarySignals.filter(
      signal =>
        signal.influence === "supportive"
    ).length;

  const challenging =
    planetarySignals.filter(
      signal =>
        signal.influence === "challenging"
    ).length;

  if (supportive > challenging) {
    return "opportunity";
  }

  if (challenging > supportive) {
    return "caution";
  }

  return "balanced";
}

/*
 * Find the strongest positive and negative
 * planetary signals.
 */
export function strongestSupportiveSignals(
  planetarySignals,
  limit = 3
) {
  return planetarySignals
    .filter(
      signal =>
        signal.influence === "supportive"
    )
    .sort(
      (a, b) =>
        Math.abs(b.score) -
        Math.abs(a.score)
    )
    .slice(0, limit);
}

export function strongestChallengingSignals(
  planetarySignals,
  limit = 3
) {
  return planetarySignals
    .filter(
      signal =>
        signal.influence === "challenging"
    )
    .sort(
      (a, b) =>
        Math.abs(b.score) -
        Math.abs(a.score)
    )
    .slice(0, limit);
}

/*
 * Complete interpretation.
 */
export function interpretDailyProfile(
  profile
) {
  if (
    !profile ||
    !profile.summary ||
    !Array.isArray(
      profile.planetaryScores
    ) ||
    !Array.isArray(
      profile.aspectScores
    )
  ) {
    throw new Error(
      "interpretDailyProfile requires a complete daily profile."
    );
  }

  const planetarySignals =
    buildPlanetarySignals(
      profile.planetaryScores
    );

  const aspectSignals =
    buildAspectSignals(
      profile.aspectScores
    );

  const categories =
    buildCategoryProfiles(
      planetarySignals,
      aspectSignals
    );

  const strongestSupport =
    strongestSupportiveSignals(
      planetarySignals
    );

  const strongestChallenges =
    strongestChallengingSignals(
      planetarySignals
    );

  return {
    energy:
      classifyDailyEnergy(
        profile.summary
      ),

    focus:
      determineDailyFocus(
        planetarySignals
      ),

    overallTone:
      profile.summary.overallTone,

    planetaryTotal:
      profile.summary.planetaryTotal,

    aspectTotal:
      profile.summary.aspectTotal,

    combinedScore:
      profile.summary.combinedScore,

    planetarySignals,

    aspectSignals,

    categories,

    strongestSupport,

    strongestChallenges,
  };
}
