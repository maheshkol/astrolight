/**
 * AstroLight — Love Engine
 * Version 2.2.0
 *
 * Purpose:
 *   Generate a deterministic, sign-specific love interpretation
 *   from the shared astronomical planetary snapshot.
 *
 * Design:
 *   Sun-sign relationship
 *      ├── Element relationship
 *      ├── Modality relationship
 *      ├── Zodiac geometry
 *      ├── Sun-sign ruler relationship
 *      └── Planetary essential dignity
 *                ↓
 *          Love dimensions
 *                ↓
 *        Relevant aspects
 *                ↓
 *       Dimension synthesis
 *                ↓
 *       Overall love profile
 *
 * Important:
 *   This engine does NOT randomize prose or scores.
 *   Sign differentiation comes from deterministic astrological
 *   relationships.
 */

const LOVE_ENGINE_VERSION = "2.2.0";

/* ---------------------------------------------------------
 * Planet weights
 * --------------------------------------------------------- */

const LOVE_PLANET_WEIGHTS = {
  Venus: 10,
  Moon: 9,
  Mars: 8,
  Pluto: 7,
  Neptune: 5,
  Mercury: 4,
  Saturn: 4,
  Sun: 3,
  Jupiter: 2,
  Uranus: 2
};


/* ---------------------------------------------------------
 * Seven love dimensions
 * --------------------------------------------------------- */

const LOVE_DIMENSIONS = {
  affection: {
    planets: {
      Venus: 1.0,
      Moon: 0.9,
      Sun: 0.5
    },
    supportiveThemes: [
      "warmth",
      "affection",
      "relationship_harmony"
    ],
    challengingThemes: [
      "emotional_distance",
      "relationship_boundaries",
      "affectional_tension"
    ]
  },

  emotionalCloseness: {
    planets: {
      Moon: 1.0,
      Venus: 0.8,
      Pluto: 0.7,
      Neptune: 0.5
    },
    supportiveThemes: [
      "emotional_closeness",
      "empathy",
      "emotional_depth"
    ],
    challengingThemes: [
      "emotional_sensitivity",
      "emotional_overload",
      "uncertainty"
    ]
  },

  attraction: {
    planets: {
      Venus: 0.9,
      Mars: 1.0,
      Pluto: 0.8
    },
    supportiveThemes: [
      "magnetism",
      "passion",
      "romantic_attraction"
    ],
    challengingThemes: [
      "relationship_friction",
      "possessiveness",
      "impulsiveness"
    ]
  },

  intimacy: {
    planets: {
      Moon: 0.8,
      Mars: 0.8,
      Pluto: 1.0,
      Venus: 0.6
    },
    supportiveThemes: [
      "deep_connection",
      "intimacy",
      "trust"
    ],
    challengingThemes: [
      "intensity",
      "vulnerability",
      "control_issues"
    ]
  },

  romance: {
    planets: {
      Venus: 1.0,
      Neptune: 0.9,
      Moon: 0.7,
      Jupiter: 0.5
    },
    supportiveThemes: [
      "romantic_imagination",
      "romantic_expression",
      "idealism"
    ],
    challengingThemes: [
      "idealization",
      "romantic_uncertainty",
      "unrealistic_expectations"
    ]
  },

  communication: {
    planets: {
      Mercury: 1.0,
      Moon: 0.7,
      Venus: 0.6,
      Mars: 0.5
    },
    supportiveThemes: [
      "relationship_conversation",
      "honesty",
      "understanding"
    ],
    challengingThemes: [
      "misunderstanding",
      "reactive_communication",
      "mixed_signals"
    ]
  },

  commitment: {
    planets: {
      Saturn: 1.0,
      Venus: 0.8,
      Moon: 0.6,
      Jupiter: 0.5
    },
    supportiveThemes: [
      "commitment",
      "relationship_stability",
      "long_term_growth"
    ],
    challengingThemes: [
      "distance_or_limits",
      "responsibility_pressure",
      "commitment_questions"
    ]
  }
};


/* ---------------------------------------------------------
 * Aspects relevant to each love dimension
 * --------------------------------------------------------- */

const LOVE_DIMENSION_ASPECTS = {
  affection: [
    "Venus",
    "Moon",
    "Sun"
  ],

  emotionalCloseness: [
    "Moon",
    "Venus",
    "Pluto",
    "Neptune"
  ],

  attraction: [
    "Venus",
    "Mars",
    "Pluto"
  ],

  intimacy: [
    "Moon",
    "Mars",
    "Pluto",
    "Venus"
  ],

  romance: [
    "Venus",
    "Neptune",
    "Moon",
    "Jupiter"
  ],

  communication: [
    "Mercury",
    "Moon",
    "Venus",
    "Mars"
  ],

  commitment: [
    "Saturn",
    "Venus",
    "Moon",
    "Jupiter"
  ]
};


/* ---------------------------------------------------------
 * Planet set used by the love engine
 * --------------------------------------------------------- */

const LOVE_ASPECT_PLANETS = new Set([
  "Venus",
  "Moon",
  "Mars",
  "Pluto",
  "Neptune",
  "Mercury",
  "Saturn"
]);


/* ---------------------------------------------------------
 * Aspect scoring
 * --------------------------------------------------------- */

const LOVE_ASPECT_WEIGHTS = {
  conjunction: 5,
  opposition: 4,
  square: 4,
  trine: 4,
  sextile: 3
};

const LOVE_ASPECT_DIRECTIONS = {
  conjunction: 0,
  opposition: -1,
  square: -1,
  trine: 1,
  sextile: 1
};


/* ---------------------------------------------------------
 * Western tropical zodiac structure
 * --------------------------------------------------------- */

const ZODIAC_SIGNS = [
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
  "Pisces"
];


/* ---------------------------------------------------------
 * Traditional Western sign rulers
 *
 * Traditional rulership is used deliberately here because
 * it gives a stable, deterministic relationship structure
 * without inventing arbitrary per-sign bonuses.
 * --------------------------------------------------------- */

const SIGN_RULERS = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter"
};


/* ---------------------------------------------------------
 * Essential dignities
 *
 * Only established traditional domicile / detriment /
 * exaltation / fall relationships are included.
 *
 * Outer planets are intentionally excluded rather than
 * inventing traditional dignity rules for them.
 * --------------------------------------------------------- */

const DOMICILES = {
  Sun: ["Leo"],
  Moon: ["Cancer"],
  Mercury: ["Gemini", "Virgo"],
  Venus: ["Taurus", "Libra"],
  Mars: ["Aries", "Scorpio"],
  Jupiter: ["Sagittarius", "Pisces"],
  Saturn: ["Capricorn", "Aquarius"]
};

const EXALTATIONS = {
  Sun: "Aries",
  Moon: "Taurus",
  Mercury: "Virgo",
  Venus: "Pisces",
  Mars: "Capricorn",
  Jupiter: "Cancer",
  Saturn: "Libra"
};

const DETRIMENTS = {
  Sun: ["Aquarius"],
  Moon: ["Capricorn"],
  Mercury: ["Sagittarius", "Pisces"],
  Venus: ["Aries", "Scorpio"],
  Mars: ["Libra", "Taurus"],
  Jupiter: ["Gemini", "Virgo"],
  Saturn: ["Cancer", "Leo"]
};

const FALLS = {
  Sun: "Libra",
  Moon: "Scorpio",
  Mercury: "Pisces",
  Venus: "Virgo",
  Mars: "Cancer",
  Jupiter: "Capricorn",
  Saturn: "Aries"
};


/* ---------------------------------------------------------
 * Utility
 * --------------------------------------------------------- */

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalize(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return value;
}


/* ---------------------------------------------------------
 * Zodiac geometry
 *
 * Distance is measured in sign steps.
 *
 * 0  = conjunction / same sign
 * 1  = semisextile
 * 2  = sextile
 * 3  = square
 * 4  = trine
 * 5  = quincunx
 * 6  = opposition
 * --------------------------------------------------------- */

function signIndex(sign) {
  return ZODIAC_SIGNS.indexOf(sign);
}

function signDistance(fromSign, toSign) {
  const from = signIndex(fromSign);
  const to = signIndex(toSign);

  if (from === -1 || to === -1) {
    return null;
  }

  return (to - from + 12) % 12;
}

function geometryType(distance) {
  if (distance === null) {
    return "unknown";
  }

  const d = Math.min(distance, 12 - distance);

  switch (d) {
    case 0:
      return "conjunction";

    case 1:
      return "semisextile";

    case 2:
      return "sextile";

    case 3:
      return "square";

    case 4:
      return "trine";

    case 5:
      return "quincunx";

    case 6:
      return "opposition";

    default:
      return "unknown";
  }
}


/* ---------------------------------------------------------
 * Geometry influence
 *
 * This is deliberately a SECONDARY factor.
 * Element relationship remains the primary broad tone.
 * Geometry refines the relationship instead of replacing it.
 * --------------------------------------------------------- */

function geometryInfluence(distance) {
  if (distance === null) {
    return 0;
  }

  const type = geometryType(distance);

  switch (type) {
    case "conjunction":
      return 0.80;

    case "trine":
      return 0.55;

    case "sextile":
      return 0.35;

    case "square":
      return -0.45;

    case "opposition":
      return -0.55;

    case "quincunx":
      return -0.20;

    case "semisextile":
      return 0.05;

    default:
      return 0;
  }
}


/* ---------------------------------------------------------
 * Ruler relationship
 *
 * The relationship between the Sun-sign ruler and the
 * transiting planet adds sign-specific structure.
 *
 * Example:
 *   Aries → Mars ruled
 *   Libra → Venus ruled
 *
 * Therefore identical element/modality relationships do
 * not automatically produce identical love profiles.
 * --------------------------------------------------------- */

const RULER_RELATIONSHIPS = {
  Sun: {
    Sun: 1.0,
    Moon: 0.4,
    Mercury: 0.3,
    Venus: 0.6,
    Mars: 0.6,
    Jupiter: 0.5,
    Saturn: -0.3
  },

  Moon: {
    Sun: 0.4,
    Moon: 1.0,
    Mercury: 0.2,
    Venus: 0.7,
    Mars: 0.2,
    Jupiter: 0.5,
    Saturn: -0.4
  },

  Mercury: {
    Sun: 0.3,
    Moon: 0.2,
    Mercury: 1.0,
    Venus: 0.5,
    Mars: -0.1,
    Jupiter: -0.4,
    Saturn: 0.2
  },

  Venus: {
    Sun: 0.6,
    Moon: 0.7,
    Mercury: 0.5,
    Venus: 1.0,
    Mars: 0.7,
    Jupiter: 0.6,
    Saturn: 0.4
  },

  Mars: {
    Sun: 0.6,
    Moon: 0.2,
    Mercury: -0.1,
    Venus: 0.7,
    Mars: 1.0,
    Jupiter: 0.5,
    Saturn: 0.2
  },

  Jupiter: {
    Sun: 0.5,
    Moon: 0.5,
    Mercury: -0.4,
    Venus: 0.6,
    Mars: 0.5,
    Jupiter: 1.0,
    Saturn: -0.2
  },

  Saturn: {
    Sun: -0.3,
    Moon: -0.4,
    Mercury: 0.2,
    Venus: 0.4,
    Mars: 0.2,
    Jupiter: -0.2,
    Saturn: 1.0
  }
};

function rulerRelationship(ruler, planet) {
  return RULER_RELATIONSHIPS[ruler]?.[planet] ?? 0;
}


/* ---------------------------------------------------------
 * Essential dignity
 * --------------------------------------------------------- */

function planetaryDignity(planet, planetSign) {
  if (!planetSign) {
    return {
      type: "neutral",
      score: 0
    };
  }

  if (DOMICILES[planet]?.includes(planetSign)) {
    return {
      type: "domicile",
      score: 0.65
    };
  }

  if (EXALTATIONS[planet] === planetSign) {
    return {
      type: "exaltation",
      score: 0.50
    };
  }

  if (DETRIMENTS[planet]?.includes(planetSign)) {
    return {
      type: "detriment",
      score: -0.55
    };
  }

  if (FALLS[planet] === planetSign) {
    return {
      type: "fall",
      score: -0.45
    };
  }

  return {
    type: "neutral",
    score: 0
  };
}


/* ---------------------------------------------------------
 * Dimension-specific weight
 * --------------------------------------------------------- */

function dimensionPlanetWeight(dimension, planet) {
  return LOVE_DIMENSIONS[dimension]?.planets?.[planet] ?? 0;
}


/* ---------------------------------------------------------
 * Planet scoring
 * --------------------------------------------------------- */

function scorePlanet(interpretation, sunSign) {
  const planet = interpretation.planet;
  const planetSign = interpretation.planetSign;

  const baseWeight =
    LOVE_PLANET_WEIGHTS[planet] ?? 0;

  if (!baseWeight) {
    return null;
  }

  /*
   * Existing engine direction.
   *
   * Element relationship remains the primary directional
   * signal because it comes from the shared relationship
   * engine.
   */
  let direction = 0;

  if (interpretation.tone === "supportive") {
    direction = 1;
  } else if (interpretation.tone === "challenging") {
    direction = -1;
  }

  /*
   * Modality relationship provides a small secondary
   * adjustment.
   */
  const modalityModifier =
    interpretation.modalityRelation === "same"
      ? 0.10
      : -0.05;

  /*
   * Zodiac geometry.
   */
  const distance =
    signDistance(sunSign, planetSign);

  const geometry =
    geometryInfluence(distance);

  const geometryTypeName =
    geometryType(distance);

  /*
   * Sun-sign ruler relationship.
   */
  const sunRuler =
    SIGN_RULERS[sunSign];

  const rulerAffinity =
    rulerRelationship(sunRuler, planet);

  /*
   * Planetary dignity.
   *
   * This is a property of the actual planet's current
   * tropical sign, not an arbitrary Sun-sign bonus.
   */
  const dignity =
    planetaryDignity(planet, planetSign);

  /*
   * Combine the structural factors.
   *
   * Element direction remains strongest.
   * Geometry and ruler relationship refine it.
   */
  const structuralScore =
    direction +
    modalityModifier +
    geometry * 0.60 +
    rulerAffinity * 0.35 +
    dignity.score * 0.20;

  const normalizedDirection =
    clamp(structuralScore, -1.5, 1.5);

  const score =
    baseWeight * normalizedDirection;

  let influence = "balanced";

  if (score > 1) {
    influence = "supportive";
  } else if (score < -1) {
    influence = "challenging";
  }

  return {
    planet,
    planetSign,
    degreeInSign: interpretation.degreeInSign,

    theme: interpretation.theme,

    tone: interpretation.tone,
    influence,

    score,
    baseWeight,

    elementRelation:
      interpretation.elementRelation,

    modalityRelation:
      interpretation.modalityRelation,

    geometry: {
      distance,
      type: geometryTypeName,
      influence: geometry
    },

    sunSignRuler: sunRuler,

    rulerAffinity,

    dignity: {
      type: dignity.type,
      score: dignity.score
    }
  };
}


/* ---------------------------------------------------------
 * Planetary signals
 * --------------------------------------------------------- */

function buildPlanetarySignals(
  interpretations,
  sunSign
) {
  if (!Array.isArray(interpretations)) {
    return [];
  }

  return interpretations
    .map(item => scorePlanet(item, sunSign))
    .filter(Boolean);
}


/* ---------------------------------------------------------
 * Aspect signals
 * --------------------------------------------------------- */

function buildAspectSignals(aspectSignals) {
  if (!Array.isArray(aspectSignals)) {
    return [];
  }

  return aspectSignals
    .filter(signal => {
      if (!Array.isArray(signal.planets)) {
        return false;
      }

      return signal.planets.some(
        planet => LOVE_ASPECT_PLANETS.has(planet)
      );
    })
    .map(signal => {
      const aspect =
        signal.aspect?.toLowerCase();

      const weight =
        LOVE_ASPECT_WEIGHTS[aspect] ?? 0;

      const direction =
        LOVE_ASPECT_DIRECTIONS[aspect] ?? 0;

      const strength =
        Number.isFinite(signal.strength)
          ? signal.strength
          : Math.max(
              0.25,
              1 -
                (Number(signal.exactOrb) || 0) / 10
            );

      const baseImpact =
        weight *
        strength *
        direction;

      return {
        planets: signal.planets,
        aspect: signal.aspect,
        influence: signal.influence,
        strength,
        exactOrb: signal.exactOrb,
        direction,
        baseImpact
      };
    });
}


/* ---------------------------------------------------------
 * Dimension aspect relevance
 * --------------------------------------------------------- */

function aspectRelevance(
  dimension,
  planets
) {
  const relevant =
    LOVE_DIMENSION_ASPECTS[dimension] ?? [];

  const matches =
    planets.filter(
      planet => relevant.includes(planet)
    ).length;

  if (matches >= 2) {
    return 0.35;
  }

  if (matches === 1) {
    return 0.20;
  }

  return 0;
}


/* ---------------------------------------------------------
 * Build one love dimension
 * --------------------------------------------------------- */

function buildDimension(
  dimension,
  planetarySignals,
  aspectSignals
) {
  const config =
    LOVE_DIMENSIONS[dimension];

  if (!config) {
    return null;
  }

  const contributingPlanets =
    planetarySignals
      .filter(signal =>
        dimensionPlanetWeight(
          dimension,
          signal.planet
        ) > 0
      )
      .map(signal => ({
        ...signal,

        dimensionWeight:
          dimensionPlanetWeight(
            dimension,
            signal.planet
          ),

        dimensionScore:
          signal.score *
          dimensionPlanetWeight(
            dimension,
            signal.planet
          )
      }));

  const planetaryScore =
    contributingPlanets.reduce(
      (total, signal) =>
        total + signal.dimensionScore,
      0
    );

  const contributingAspects =
    aspectSignals
      .map(signal => {
        const relevance =
          aspectRelevance(
            dimension,
            signal.planets
          );

        if (!relevance) {
          return null;
        }

        return {
          ...signal,

          relevance,

          dimensionScore:
            signal.baseImpact *
            relevance
        };
      })
      .filter(Boolean);

  const rawAspectScore =
    contributingAspects.reduce(
      (total, aspect) =>
        total + aspect.dimensionScore,
      0
    );

  /*
   * Keep aspects meaningful but subordinate to the
   * dimension's planetary structure.
   */
  const aspectScore =
    clamp(
      rawAspectScore,
      -3,
      3
    );

  const finalScore =
    planetaryScore +
    aspectScore;

  let influence = "balanced";

  if (finalScore >= 2) {
    influence = "supportive";
  } else if (finalScore <= -2) {
    influence = "challenging";
  }

  const themes =
    influence === "supportive"
      ? config.supportiveThemes
      : influence === "challenging"
        ? config.challengingThemes
        : [
            ...config.supportiveThemes,
            ...config.challengingThemes
          ];

  return {
    score: Number(finalScore.toFixed(3)),
    influence,

    planetaryScore:
      Number(planetaryScore.toFixed(3)),

    aspectScore:
      Number(aspectScore.toFixed(3)),

    themes,

    contributingPlanets,

    contributingAspects
  };
}


/* ---------------------------------------------------------
 * Build all seven dimensions
 * --------------------------------------------------------- */

function buildDimensions(
  planetarySignals,
  aspectSignals
) {
  const dimensions = {};

  for (const dimension of Object.keys(
    LOVE_DIMENSIONS
  )) {
    dimensions[dimension] =
      buildDimension(
        dimension,
        planetarySignals,
        aspectSignals
      );
  }

  return dimensions;
}


/* ---------------------------------------------------------
 * Overall score
 *
 * The seven dimensions are averaged equally.
 *
 * This prevents one heavily weighted planet or shared
 * aspect from dominating the entire love interpretation.
 * --------------------------------------------------------- */

function calculateOverallScore(dimensions) {
  const values =
    Object.values(dimensions)
      .map(dimension => dimension.score)
      .filter(Number.isFinite);

  if (!values.length) {
    return 0;
  }

  const total =
    values.reduce(
      (sum, value) => sum + value,
      0
    );

  return Number(
    (total / values.length).toFixed(3)
  );
}


/* ---------------------------------------------------------
 * Relationship dynamic
 * --------------------------------------------------------- */

function determineRelationshipDynamic(
  dimensions
) {
  const supportive = [];
  const challenging = [];

  for (const [name, dimension] of
    Object.entries(dimensions)) {

    if (dimension.influence === "supportive") {
      supportive.push(name);
    }

    if (dimension.influence === "challenging") {
      challenging.push(name);
    }
  }

  let type = "balanced";

  if (
    supportive.length >= 4 &&
    challenging.length <= 1
  ) {
    type = "supportive";
  } else if (
    challenging.length >= 4 &&
    supportive.length <= 1
  ) {
    type = "challenging";
  } else if (
    supportive.length > 0 &&
    challenging.length > 0
  ) {
    type = "mixed";
  }

  return {
    type,
    supportiveDimensions: supportive,
    challengingDimensions: challenging
  };
}


/* ---------------------------------------------------------
 * Strongest planet
 * --------------------------------------------------------- */

function strongestPlanet(
  planetarySignals
) {
  if (!planetarySignals.length) {
    return null;
  }

  return planetarySignals.reduce(
    (strongest, current) =>
      Math.abs(current.score) >
      Math.abs(strongest.score)
        ? current
        : strongest
  );
}


/* ---------------------------------------------------------
 * Strongest dimension
 * --------------------------------------------------------- */

function strongestDimension(
  dimensions
) {
  const entries =
    Object.entries(dimensions);

  if (!entries.length) {
    return null;
  }

  const [
    name,
    dimension
  ] = entries.reduce(
    (strongest, current) =>
      Math.abs(current[1].score) >
      Math.abs(strongest[1].score)
        ? current
        : strongest
  );

  return {
    dimension: name,
    ...dimension
  };
}


/* ---------------------------------------------------------
 * Strongest aspect
 * --------------------------------------------------------- */

function strongestAspect(
  aspectSignals
) {
  if (!aspectSignals.length) {
    return null;
  }

  return aspectSignals.reduce(
    (strongest, current) =>
      Math.abs(current.baseImpact) >
      Math.abs(strongest.baseImpact)
        ? current
        : strongest
  );
}


/* ---------------------------------------------------------
 * Themes
 * --------------------------------------------------------- */

function collectThemes(
  dimensions
) {
  const themes = [];

  for (const dimension of
    Object.values(dimensions)) {

    if (!Array.isArray(dimension.themes)) {
      continue;
    }

    themes.push(
      ...dimension.themes
    );
  }

  return [
    ...new Set(themes)
  ];
}


/* ---------------------------------------------------------
 * Relationship weather
 *
 * This represents the shared planetary climate of the day.
 *
 * IMPORTANT:
 * It is deliberately NOT added to the individual Sun-sign
 * overall score.
 * --------------------------------------------------------- */

function buildRelationshipWeather(
  aspectSignals
) {
  if (!aspectSignals.length) {
    return {
      score: 0,
      tone: "neutral",
      strongestAspect: null
    };
  }

  const total =
    aspectSignals.reduce(
      (sum, signal) =>
        sum + signal.baseImpact,
      0
    );

  const score =
    Number(total.toFixed(3));

  let tone = "neutral";

  if (score >= 2) {
    tone = "supportive";
  } else if (score <= -2) {
    tone = "challenging";
  } else if (score > 0) {
    tone = "mildly_supportive";
  } else if (score < 0) {
    tone = "mildly_challenging";
  }

  return {
    score,
    tone,
    strongestAspect:
      strongestAspect(aspectSignals)
  };
}


/* ---------------------------------------------------------
 * Methodology metadata
 * --------------------------------------------------------- */

function buildMethodology() {
  return {
    engine: "AstroLight Love Engine",

    engineVersion:
      LOVE_ENGINE_VERSION,

    zodiac: "Western Tropical",

    primaryFactors: [
      "element relationship",
      "modality relationship",
      "zodiac geometry",
      "sun-sign ruler relationship",
      "planetary essential dignity"
    ],

    dimensions: [
      "affection",
      "emotionalCloseness",
      "attraction",
      "intimacy",
      "romance",
      "communication",
      "commitment"
    ],

    aspectModel:
      "dimension-specific",

    globalAspectBonus: false,

    randomization: false,

    proseGeneration:
      "performed separately by prose layer"
  };
}


/* ---------------------------------------------------------
 * PUBLIC API
 * --------------------------------------------------------- */

export function interpretLoveSection({
  sunSign,
  interpretations,
  aspectSignals
}) {
  if (!sunSign) {
    throw new Error(
      "Love Engine requires sunSign."
    );
  }

  const planetarySignals =
    buildPlanetarySignals(
      interpretations,
      sunSign
    );

  const loveAspectSignals =
    buildAspectSignals(
      aspectSignals
    );

  const dimensions =
    buildDimensions(
      planetarySignals,
      loveAspectSignals
    );

  const overallScore =
    calculateOverallScore(
      dimensions
    );

  let tone = "balanced";

  if (overallScore >= 2) {
    tone = "supportive";
  } else if (overallScore <= -2) {
    tone = "challenging";
  }

  const dynamic =
    determineRelationshipDynamic(
      dimensions
    );

  const strongestPlanetSignal =
    strongestPlanet(
      planetarySignals
    );

  const strongestDimensionSignal =
    strongestDimension(
      dimensions
    );

  const strongestAspectSignal =
    strongestAspect(
      loveAspectSignals
    );

  const themes =
    collectThemes(
      dimensions
    );

  const relationshipWeather =
    buildRelationshipWeather(
      loveAspectSignals
    );

  /*
   * Diagnostic totals.
   *
   * planetaryTotal is retained for compatibility/debugging.
   * aspectTotal is the sum of dimension-level aspect effects.
   *
   * Neither is used as a global bonus.
   */
  const planetaryTotal =
    planetarySignals.reduce(
      (sum, signal) =>
        sum + signal.score,
      0
    );

  const aspectTotal =
    Object.values(dimensions)
      .reduce(
        (sum, dimension) =>
          sum + dimension.aspectScore,
        0
      );

  return {
    section: "love",

    sunSign,

    tone,

    combinedScore:
      overallScore,

    overallScore,

    planetaryTotal:
      Number(planetaryTotal.toFixed(3)),

    aspectTotal:
      Number(aspectTotal.toFixed(3)),

    dimensions,

    planets:
      planetarySignals,

    aspects:
      loveAspectSignals,

    strongestPlanet:
      strongestPlanetSignal,

    strongestPlanetInfluence:
      strongestPlanetSignal?.influence ?? null,

    strongestDimension:
      strongestDimensionSignal,

    strongestAspect:
      strongestAspectSignal,

    relationshipDynamic:
      dynamic,

    relationshipWeather,

    themes,

    methodology:
      buildMethodology(),

    engineVersion:
      LOVE_ENGINE_VERSION
  };
}


/*
 * Compatibility alias.
 *
 * This lets the section engine be called through the generic
 * section-engine contract if desired.
 */
export const interpretSection =
  interpretLoveSection;