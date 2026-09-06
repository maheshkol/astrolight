/**
 * horoscope/sections/career.js
 *
 * AstroLight Career Engine — V1.1
 *
 * This is an independent career-specific interpretation engine.
 *
 * Pipeline:
 *
 *   planetary snapshot
 *        ↓
 *   sign relationships
 *        ↓
 *   sign geometry
 *        ↓
 *   traditional rulership
 *        ↓
 *   essential dignity
 *        ↓
 *   Career planetary signals
 *        ↓
 *   seven independent career dimensions
 *        ↓
 *   dimension-specific aspects
 *        ↓
 *   dimension normalization
 *        ↓
 *   Career dynamic
 *        ↓
 *   structured interpretation
 *        ↓
 *   Career prose (separate module)
 *
 * Design principles:
 *
 *   - deterministic
 *   - no Math.random()
 *   - no fake wording-based uniqueness
 *   - sign-specific logic
 *   - career-specific planetary priorities
 *   - aspects modify relevant dimensions only
 *   - shared daily aspects remain career weather
 *   - dimensions are normalized before comparison
 *
 * This module interprets Western Tropical astrology
 * symbolism. It is not a scientific prediction system.
 */

import {
  SIGN_ELEMENTS,
  SIGN_MODALITIES,
  PLANET_THEMES,
  elementRelationship,
} from "../rules.js";


/* -------------------------------------------------------
 * Engine version
 * ----------------------------------------------------- */

const CAREER_ENGINE_VERSION = "1.3.1";


/* -------------------------------------------------------
 * Zodiac
 * ----------------------------------------------------- */

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
  "Pisces",
];


/* -------------------------------------------------------
 * Traditional Western rulers
 * ----------------------------------------------------- */

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
  Pisces: "Jupiter",
};


/* -------------------------------------------------------
 * Essential dignities
 *
 * Traditional Western dignity relationships.
 *
 * Only the seven classical planets are included.
 * ----------------------------------------------------- */

const ESSENTIAL_DIGNITIES = {
  Sun: {
    domicile: ["Leo"],
    exaltation: ["Aries"],
    detriment: ["Aquarius"],
    fall: ["Libra"],
  },

  Moon: {
    domicile: ["Cancer"],
    exaltation: ["Taurus"],
    detriment: ["Capricorn"],
    fall: ["Scorpio"],
  },

  Mercury: {
    domicile: ["Gemini", "Virgo"],
    exaltation: ["Virgo"],
    detriment: ["Sagittarius", "Pisces"],
    fall: ["Pisces"],
  },

  Venus: {
    domicile: ["Taurus", "Libra"],
    exaltation: ["Pisces"],
    detriment: ["Aries", "Scorpio"],
    fall: ["Virgo"],
  },

  Mars: {
    domicile: ["Aries", "Scorpio"],
    exaltation: ["Capricorn"],
    detriment: ["Taurus", "Libra"],
    fall: ["Cancer"],
  },

  Jupiter: {
    domicile: ["Sagittarius", "Pisces"],
    exaltation: ["Cancer"],
    detriment: ["Gemini", "Virgo"],
    fall: ["Capricorn"],
  },

  Saturn: {
    domicile: ["Capricorn", "Aquarius"],
    exaltation: ["Libra"],
    detriment: ["Cancer", "Leo"],
    fall: ["Aries"],
  },
};


/* -------------------------------------------------------
 * Career dimensions
 * ----------------------------------------------------- */

const CAREER_DIMENSIONS = [
  "professionalDrive",
  "careerDirection",
  "workPerformance",
  "recognition",
  "growth",
  "authority",
  "opportunity",
];


/* -------------------------------------------------------
 * Career planetary priorities
 *
 * Higher number = stronger relevance to the dimension.
 *
 * These are relevance weights, not independent
 * astrological effects.
 * ----------------------------------------------------- */

const CAREER_PRIORITIES = {

  professionalDrive: {
    Mars: 10,
    Sun: 8,
    Jupiter: 5,
    Pluto: 4,
    Uranus: 3,
    Mercury: 2,
  },

  careerDirection: {
    Sun: 10,
    Saturn: 9,
    Jupiter: 8,
    Mercury: 5,
    Mars: 4,
    Pluto: 3,
    Moon: 2,
  },

  workPerformance: {
    Saturn: 10,
    Mars: 9,
    Mercury: 8,
    Sun: 5,
    Jupiter: 4,
    Uranus: 3,
    Pluto: 3,
  },

  recognition: {
    Sun: 10,
    Jupiter: 9,
    Venus: 5,
    Mars: 4,
    Saturn: 4,
    Pluto: 3,
  },

  growth: {
    Jupiter: 10,
    Mercury: 8,
    Uranus: 7,
    Sun: 5,
    Saturn: 4,
    Pluto: 4,
    Mars: 3,
  },

  authority: {
    Saturn: 10,
    Sun: 9,
    Mars: 7,
    Pluto: 6,
    Jupiter: 5,
    Mercury: 3,
  },

  opportunity: {
    Jupiter: 10,
    Uranus: 9,
    Venus: 6,
    Sun: 5,
    Mercury: 5,
    Mars: 4,
    Pluto: 4,
  },
};


/* -------------------------------------------------------
 * Career planetary themes
 * ----------------------------------------------------- */

const CAREER_THEMES = {

  Sun: {
    core: "visibility",
    supportive:
      "confidence and leadership",
    challenging:
      "pressure around recognition or self-direction",
  },

  Moon: {
    core: "work environment",
    supportive:
      "emotional awareness at work",
    challenging:
      "emotional reactivity around work",
  },

  Mercury: {
    core: "skills and communication",
    supportive:
      "clear thinking and useful communication",
    challenging:
      "overthinking or communication friction",
  },

  Venus: {
    core: "professional relationships",
    supportive:
      "cooperation and professional goodwill",
    challenging:
      "people-pleasing or difficulty with boundaries",
  },

  Mars: {
    core: "drive and execution",
    supportive:
      "initiative and decisive action",
    challenging:
      "impatience or conflict",
  },

  Jupiter: {
    core: "growth",
    supportive:
      "expansion and opportunity",
    challenging:
      "overreach or excessive optimism",
  },

  Saturn: {
    core: "responsibility",
    supportive:
      "discipline and durable progress",
    challenging:
      "delays, pressure or heavier obligations",
  },

  Uranus: {
    core: "change",
    supportive:
      "innovation and unexpected openings",
    challenging:
      "instability or abrupt changes",
  },

  Neptune: {
    core: "vision",
    supportive:
      "creativity and intuition",
    challenging:
      "unclear expectations or idealization",
  },

  Pluto: {
    core: "transformation",
    supportive:
      "strategic transformation and influence",
    challenging:
      "power struggles or excessive control",
  },
};


/* -------------------------------------------------------
 * Helpers
 * ----------------------------------------------------- */

function round(
  value,
  decimals = 2
) {

  const factor =
    10 ** decimals;

  return Math.round(
    value * factor
  ) / factor;
}


function clamp(
  value,
  min,
  max
) {

  return Math.max(
    min,
    Math.min(max, value)
  );
}


function classify(
  score
) {

  if (score >= 2) {
    return "supportive";
  }

  if (score <= -2) {
    return "challenging";
  }

  return "balanced";
}

function classifyNormalizedCareerScore(
  score
) {

    /*
   * Career dimension scores are continuous signals.
   *
   * These thresholds only translate the calibrated
   * numerical score into a reader-facing tone.
   *
   * They do NOT alter the underlying astrology,
   * planetary scoring, aspects, or normalization.
   */

  if (score >= 0.45) {
    return "supportive";
  }

  if (score <= -0.25) {
    return "challenging";
  }

  return "balanced";
}

function signIndex(
  sign
) {

  return ZODIAC_SIGNS.indexOf(
    sign
  );
}


/* -------------------------------------------------------
 * Sign distance
 * ----------------------------------------------------- */

function signDistance(
  signA,
  signB
) {

  const a =
    signIndex(signA);

  const b =
    signIndex(signB);

  if (
    a < 0 ||
    b < 0
  ) {
    return null;
  }

  const difference =
    Math.abs(a - b);

  return Math.min(
    difference,
    12 - difference
  );
}


/* -------------------------------------------------------
 * Sign geometry
 * ----------------------------------------------------- */

function signGeometry(
  sunSign,
  planetSign
) {

  const distance =
    signDistance(
      sunSign,
      planetSign
    );

  if (
    distance === null
  ) {
    return "unknown";
  }

  switch (distance) {

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


/* -------------------------------------------------------
 * Geometry influence
 *
 * Secondary refinement only.
 * ----------------------------------------------------- */

function geometryInfluence(
  geometry
) {

  switch (geometry) {

    case "conjunction":
      return 1.25;

    case "sextile":
      return 0.9;

    case "trine":
      return 1.0;

    case "square":
      return -0.75;

    case "opposition":
      return -0.8;

    case "quincunx":
      return -0.45;

    case "semisextile":
      return 0.2;

    default:
      return 0;
  }
}


/* -------------------------------------------------------
 * Traditional ruler relationships
 * ----------------------------------------------------- */

const RULER_RELATIONSHIPS = {

  Sun: {
    Sun: 1,
    Moon: 0.7,
    Jupiter: 0.8,
    Mars: 0.7,
    Venus: 0.4,
    Mercury: 0.3,
    Saturn: -0.4,
  },

  Moon: {
    Moon: 1,
    Venus: 0.8,
    Jupiter: 0.7,
    Mercury: 0.5,
    Sun: 0.5,
    Mars: -0.3,
    Saturn: -0.4,
  },

  Mercury: {
    Mercury: 1,
    Venus: 0.7,
    Jupiter: 0.5,
    Saturn: 0.4,
    Mars: 0.2,
    Sun: 0.3,
    Moon: 0.2,
  },

  Venus: {
    Venus: 1,
    Moon: 0.8,
    Mercury: 0.7,
    Jupiter: 0.6,
    Sun: 0.5,
    Mars: -0.3,
    Saturn: 0.2,
  },

  Mars: {
    Mars: 1,
    Sun: 0.8,
    Jupiter: 0.7,
    Saturn: 0.4,
    Mercury: 0.2,
    Venus: -0.4,
    Moon: -0.2,
  },

  Jupiter: {
    Jupiter: 1,
    Sun: 0.8,
    Mars: 0.7,
    Moon: 0.7,
    Venus: 0.6,
    Mercury: -0.2,
    Saturn: 0.3,
  },

  Saturn: {
    Saturn: 1,
    Mercury: 0.5,
    Venus: 0.3,
    Jupiter: 0.3,
    Sun: -0.4,
    Moon: -0.4,
    Mars: 0.2,
  },
};


function rulerRelationship(
  sunSign,
  planetName
) {

  const sunRuler =
    SIGN_RULERS[sunSign];

  return (
    RULER_RELATIONSHIPS[
      sunRuler
    ]?.[planetName] ?? 0
  );
}


/* -------------------------------------------------------
 * Essential dignity
 * ----------------------------------------------------- */

function planetaryDignity(
  planet,
  sign
) {

  const dignity =
    ESSENTIAL_DIGNITIES[
      planet
    ];

  if (!dignity) {
    return 0;
  }

  if (
    dignity.domicile.includes(
      sign
    )
  ) {
    return 1;
  }

  if (
    dignity.exaltation.includes(
      sign
    )
  ) {
    return 0.75;
  }

  if (
    dignity.detriment.includes(
      sign
    )
  ) {
    return -0.7;
  }

  if (
    dignity.fall.includes(
      sign
    )
  ) {
    return -0.8;
  }

  return 0;
}


/* -------------------------------------------------------
 * Dimension capacity
 *
 * The sum of planetary priorities describes how much
 * planetary weighting is available to a dimension.
 *
 * V1.1 uses this only for normalization.
 * It does NOT change the underlying priorities.
 * ----------------------------------------------------- */

function dimensionCapacity(
  dimensionName
) {

  const priorities =
    CAREER_PRIORITIES[
      dimensionName
    ] ?? {};

  return Object.values(
    priorities
  ).reduce(
    (
      total,
      priority
    ) =>
      total +
      priority / 10,
    0
  );
}


/* -------------------------------------------------------
 * Career planetary structural score
 *
 * This calculates the astrological signal before
 * dimension relevance is applied.
 * ----------------------------------------------------- */

function calculateStructuralScore(
  sunSign,
  interpretation
) {

  const {
    planet,
    planetSign,
    elementRelation,
    modalityRelation,
  } = interpretation;

  let score = 0;

  /*
   * Element relationship remains the primary
   * directional signal.
   */
  if (
    elementRelation ===
    "supportive"
  ) {
    score += 1;
  }

  if (
    elementRelation ===
    "challenging"
  ) {
    score -= 1;
  }

  /*
 * Modality is a small secondary refinement.
 *
 * It should be directionally balanced:
 * same modality gives a small supportive refinement,
 * while different modality gives a small challenging
 * refinement.
 *
 * Modality does NOT override the primary element
 * relationship.
 */
 
  if (
    modalityRelation ===
    "same"
  ) {
    score += 0.10;
  } else {
    score -= 0.10;
  }

  /*
   * Zodiac geometry.
   */
  const geometry =
    signGeometry(
      sunSign,
      planetSign
    );

  score +=
    geometryInfluence(
      geometry
    );

  /*
   * Traditional ruler relationship.
   */
  score +=
    rulerRelationship(
      sunSign,
      planet
    ) * 0.5;

  /*
   * Essential dignity.
   */
  score +=
    planetaryDignity(
      planet,
      planetSign
    ) * 0.55;

  return round(
  clamp(
    score,
    -1.5,
    1.5
  ));
}


/* -------------------------------------------------------
 * Build one planetary career signal
 * ----------------------------------------------------- */

function buildPlanetSignal(
  sunSign,
  interpretation,
  dimensionName
) {

  const priorities =
    CAREER_PRIORITIES[
      dimensionName
    ] ?? {};

  const planet =
    interpretation.planet;

  const priority =
    priorities[planet] ?? 0;

  if (
    priority <= 0
  ) {
    return null;
  }

  const structuralScore =
    calculateStructuralScore(
      sunSign,
      interpretation
    );

  /*
   * Relevance weight.
   *
   * Priority 10 = full relevance.
   * Priority 5  = half relevance.
   */
  const relevance =
    priority / 10;

  const score =
    structuralScore *
    relevance;

  const theme =
    CAREER_THEMES[
      planet
    ] ??
    PLANET_THEMES[
      planet
    ] ??
    {};

  const geometry =
    signGeometry(
      sunSign,
      interpretation.planetSign
    );

  const rulerRelation =
    rulerRelationship(
      sunSign,
      planet
    );

  const dignity =
    planetaryDignity(
      planet,
      interpretation.planetSign
    );

  return {

    planet,

    planetSign:
      interpretation.planetSign,

    degreeInSign:
      interpretation.degreeInSign,

    theme:
      theme.core ??
      interpretation.theme,

    positiveTheme:
      theme.supportive ??
      interpretation.positiveTheme,

    challengingTheme:
      theme.challenging ??
      interpretation.challengingTheme,

    influence:
      classify(score),

    score:
      round(score),

    structuralScore:
      round(
        structuralScore
      ),

    priority,

    relevance:
      round(relevance),

    elementRelation:
      interpretation.elementRelation,

    modalityRelation:
      interpretation.modalityRelation,

    geometry,

    rulerRelation:
      round(
        rulerRelation
      ),

    dignity:
      round(
        dignity
      ),
  };
}


/* -------------------------------------------------------
 * Dimension-specific aspect planets
 * ----------------------------------------------------- */

const DIMENSION_ASPECT_PLANETS = {

  professionalDrive: [
    "Mars",
    "Sun",
    "Pluto",
    "Uranus",
  ],

  careerDirection: [
    "Sun",
    "Saturn",
    "Jupiter",
    "Mercury",
  ],

  workPerformance: [
    "Saturn",
    "Mars",
    "Mercury",
  ],

  recognition: [
    "Sun",
    "Jupiter",
    "Venus",
    "Saturn",
  ],

  growth: [
    "Jupiter",
    "Mercury",
    "Uranus",
    "Pluto",
  ],

  authority: [
    "Saturn",
    "Sun",
    "Mars",
    "Pluto",
  ],

  opportunity: [
    "Jupiter",
    "Uranus",
    "Venus",
    "Sun",
    "Mercury",
  ],
};


/* -------------------------------------------------------
 * Aspect relevance
 * ----------------------------------------------------- */

function aspectDimensionWeight(
  aspectSignal,
  dimensionName
) {

  const relevant =
    DIMENSION_ASPECT_PLANETS[
      dimensionName
    ] ?? [];

  const [
    a,
    b
  ] =
    aspectSignal.planets ?? [];

  const aRelevant =
    relevant.includes(a);

  const bRelevant =
    relevant.includes(b);

  if (
    aRelevant &&
    bRelevant
  ) {
    return 0.35;
  }

  if (
    aRelevant ||
    bRelevant
  ) {
    return 0.2;
  }

  return 0;
}


/* -------------------------------------------------------
 * Dimension aspect score
 * ----------------------------------------------------- */

function scoreDimensionAspect(
  aspectSignal,
  dimensionName
) {

  const relevance =
    aspectDimensionWeight(
      aspectSignal,
      dimensionName
    );

  if (
    relevance === 0
  ) {
    return null;
  }

  const directionalScore =
    Number(
      aspectSignal.directionalScore ??
      0
    );

  const score =
    directionalScore *
    relevance;

  return {

    planets:
      aspectSignal.planets,

    aspect:
      aspectSignal.aspect,

    influence:
      aspectSignal.influence,

    strength:
      aspectSignal.strength,

    exactOrb:
      aspectSignal.exactOrb,

    direction:
      aspectSignal.direction,

    relevance,

    score:
      round(
        clamp(
          score,
          -3,
          3
        )
      ),
  };
}


/* -------------------------------------------------------
 * Normalize dimension
 *
 * IMPORTANT:
 *
 * The raw score is retained.
 *
 * The normalized score is used when comparing the
 * seven dimensions.
 *
 * This prevents dimensions with more/high-priority
 * planetary contributors from automatically winning.
 * ----------------------------------------------------- */

function normalizeDimensionScore(
  planetaryTotal,
  aspectTotal,
  dimensionName
) {

  const capacity =
    dimensionCapacity(
      dimensionName
    );

  if (
    capacity <= 0
  ) {
    return 0;
  }

  /*
   * Planetary score is divided by the dimension's
   * priority capacity.
   *
   * This converts the score into an approximate
   * average structural signal rather than a raw
   * accumulation of every contributing planet.
   */
  const normalizedPlanetary =
    planetaryTotal /
    capacity;

  /*
 * Aspects are a secondary refinement.
 *
 * They can strengthen or soften the planetary signal,
 * but they should not normally reverse the underlying
 * career direction by themselves.
 */
const normalizedAspect =
  aspectTotal /
  Math.max(
    1,
    capacity
  );

const aspectAdjustment =
  clamp(
    normalizedAspect,
    -0.35,
    0.35
  );

const normalized =
  normalizedPlanetary +
  aspectAdjustment;

  return round(
    clamp(
      normalized,
      -12,
      12
    )
  );
}


/* -------------------------------------------------------
 * Build career dimension
 * ----------------------------------------------------- */

function buildDimension(
  sunSign,
  interpretations,
  aspectSignals,
  dimensionName
) {

  const priorities =
    CAREER_PRIORITIES[
      dimensionName
    ] ?? {};

  const capacity =
    dimensionCapacity(
      dimensionName
    );

  /*
   * Build planetary signals.
   */
  const planets =
    interpretations
      .map(
        interpretation =>
          buildPlanetSignal(
            sunSign,
            interpretation,
            dimensionName
          )
      )
      .filter(Boolean)
      .sort(
        (
          a,
          b
        ) =>
          Math.abs(b.score) -
          Math.abs(a.score)
      );

  const planetaryTotal =
    planets.reduce(
      (
        sum,
        planet
      ) =>
        sum +
        planet.score,
      0
    );

  /*
   * Build dimension-specific aspects.
   */
  const aspects =
    aspectSignals
      .map(
        aspect =>
          scoreDimensionAspect(
            aspect,
            dimensionName
          )
      )
      .filter(Boolean)
      .sort(
        (
          a,
          b
        ) =>
          Math.abs(b.score) -
          Math.abs(a.score)
      );

  const aspectTotal =
    aspects.reduce(
      (
        sum,
        aspect
      ) =>
        sum +
        aspect.score,
      0
    );

  /*
   * Raw score.
   *
   * Kept for diagnostics and transparency.
   */
  const rawScore =
    planetaryTotal +
    aspectTotal;

  /*
   * V1.1 normalized score.
   */
  const normalizedScore =
    normalizeDimensionScore(
      planetaryTotal,
      aspectTotal,
      dimensionName
    );

  const strongestPlanet =
    planets[0] ??
    null;

  const strongestAspect =
    aspects[0] ??
    null;

  return {

    dimension:
      dimensionName,

    /*
     * Normalized score is the public dimension score.
     */
    score:
      normalizedScore,

    rawScore:
      round(
        rawScore
      ),

    normalizedScore,

    planetaryTotal:
      round(
        planetaryTotal
      ),

    aspectTotal:
      round(
        aspectTotal
      ),

    normalizationCapacity:
      round(
        capacity
      ),

    tone:
       classifyNormalizedCareerScore(
        normalizedScore
      ),

    planets,

    aspects,

    strongestPlanet,

    strongestAspect,

    methodology: {

      planetaryPriority:
        priorities,

      normalization:
        "priority-capacity normalization",

      rawScoreRetained:
        true,

      aspectsAreDimensionSpecific:
        true,

      globalAspectBonus:
        false,

      randomization:
        false,
    },
  };
}


/* -------------------------------------------------------
 * Determine career dynamic
 * ----------------------------------------------------- */

function determineCareerDynamic(
  dimensions
) {

  const supportive = [];

  const challenging = [];

  for (
    const dimensionName
    of CAREER_DIMENSIONS
  ) {

    const dimension =
      dimensions[
        dimensionName
      ];

    if (!dimension) {
      continue;
    }

    if (
      dimension.tone ===
      "supportive"
    ) {
      supportive.push(
        dimensionName
      );
    }

    if (
      dimension.tone ===
      "challenging"
    ) {
      challenging.push(
        dimensionName
      );
    }
  }

  let type =
    "mixed";

  if (
    supportive.length >= 5
  ) {

    type =
      "expansive";

  } else if (
    challenging.length >= 5
  ) {

    type =
      "pressured";

  } else if (
    supportive.length >
    challenging.length
  ) {

    type =
      "constructive";

  } else if (
    challenging.length >
    supportive.length
  ) {

    type =
      "demanding";
  }

  return {

    type,

    supportiveDimensions:
      supportive,

    challengingDimensions:
      challenging,
  };
}


/* -------------------------------------------------------
 * Strongest dimension
 *
 * V1.1 compares normalized scores.
 * ----------------------------------------------------- */

function strongestDimension(
  dimensions
) {

  return CAREER_DIMENSIONS
    .map(
      name =>
        dimensions[name]
    )
    .filter(Boolean)
    .sort(
      (
        a,
        b
      ) =>
        Math.abs(
          b.normalizedScore ??
          b.score ??
          0
        ) -
        Math.abs(
          a.normalizedScore ??
          a.score ??
          0
        )
    )[0] ?? null;
}


/* -------------------------------------------------------
 * Strongest planet across career
 * ----------------------------------------------------- */

function strongestPlanet(
  dimensions
) {

  const signals = [];

  for (
    const dimensionName
    of CAREER_DIMENSIONS
  ) {

    const dimension =
      dimensions[
        dimensionName
      ];

    if (!dimension) {
      continue;
    }

    for (
      const planet
      of dimension.planets
    ) {

      signals.push({

        ...planet,

        dimension:
          dimensionName,

        dimensionScore:
          dimension.score,
      });
    }
  }

  return signals.sort(
    (
      a,
      b
    ) =>
      Math.abs(b.score) -
      Math.abs(a.score)
  )[0] ?? null;
}


/* -------------------------------------------------------
 * Strongest career aspect
 * ----------------------------------------------------- */

function strongestAspect(
  dimensions
) {

  const signals = [];

  for (
    const dimensionName
    of CAREER_DIMENSIONS
  ) {

    const dimension =
      dimensions[
        dimensionName
      ];

    if (!dimension) {
      continue;
    }

    for (
      const aspect
      of dimension.aspects
    ) {

      signals.push({

        ...aspect,

        dimension:
          dimensionName,
      });
    }
  }

  return signals.sort(
    (
      a,
      b
    ) =>
      Math.abs(b.score) -
      Math.abs(a.score)
  )[0] ?? null;
}


/* -------------------------------------------------------
 * Shared career weather
 *
 * This describes the planetary climate shared by all
 * Sun signs.
 *
 * It does NOT contribute to the individual score.
 * ----------------------------------------------------- */

function buildCareerWeather(
  aspectSignals
) {

  const relevantPlanets = [

    "Sun",
    "Mercury",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Pluto",

  ];

  const careerAspects =
    aspectSignals
      .filter(
        aspect =>
          aspect.planets?.some(
            planet =>
              relevantPlanets.includes(
                planet
              )
          )
      )
      .sort(
        (
          a,
          b
        ) =>
          Math.abs(
            b.directionalScore ??
            0
          ) -
          Math.abs(
            a.directionalScore ??
            0
          )
      );

  const total =
    careerAspects.reduce(
      (
        sum,
        aspect
      ) =>
        sum +
        Number(
          aspect.directionalScore ??
          0
        ),
      0
    );

  return {

    score:
      round(total),

    tone:
      classify(total),

    aspects:
      careerAspects,

    shared:
      true,

    contributesToOverallScore:
      false,
  };
}


/* -------------------------------------------------------
 * Calculate overall Career score
 *
 * The seven normalized dimensions receive equal
 * importance.
 *
 * This mirrors the structural principle used by
 * the Love Engine.
 * ----------------------------------------------------- */

function calculateOverallScore(
  dimensions
) {

  const scores =
    CAREER_DIMENSIONS
      .map(
        name =>
          Number(
            dimensions[
              name
            ]?.normalizedScore ??
            dimensions[
              name
            ]?.score ??
            0
          )
      )
      .filter(
        Number.isFinite
      );

  if (!scores.length) {
    return 0;
  }

  const total =
    scores.reduce(
      (
        sum,
        score
      ) =>
        sum +
        score,
      0
    );

  return round(
    total /
    scores.length
  );
}


/* -------------------------------------------------------
 * Main Career Engine
 * ----------------------------------------------------- */

export function interpretCareerSection({
  sunSign,
  interpretations,
  aspectSignals,
}) {

  if (
    !sunSign ||
    !ZODIAC_SIGNS.includes(
      sunSign
    )
  ) {

    throw new Error(
      "interpretCareerSection requires a valid Sun sign."
    );
  }

  if (
    !Array.isArray(
      interpretations
    )
  ) {

    throw new Error(
      "interpretCareerSection requires planetary interpretations."
    );
  }

  if (
    !Array.isArray(
      aspectSignals
    )
  ) {

    throw new Error(
      "interpretCareerSection requires aspect signals."
    );
  }


  /* ---------------------------------------------------
   * Build seven independent dimensions
   * ------------------------------------------------- */

  const dimensions = {};

  for (
    const dimensionName
    of CAREER_DIMENSIONS
  ) {

    dimensions[
      dimensionName
    ] =
      buildDimension(
        sunSign,
        interpretations,
        aspectSignals,
        dimensionName
      );
  }


  /* ---------------------------------------------------
   * Overall score
   * ------------------------------------------------- */

  const combinedScore =
    calculateOverallScore(
      dimensions
    );


  /* ---------------------------------------------------
   * Strongest signals
   * ------------------------------------------------- */

  const strongest =
    strongestDimension(
      dimensions
    );

  const strongestPlanetSignal =
    strongestPlanet(
      dimensions
    );

  const strongestAspectSignal =
    strongestAspect(
      dimensions
    );


  /* ---------------------------------------------------
   * Career dynamic
   * ------------------------------------------------- */

  const careerDynamic =
    determineCareerDynamic(
      dimensions
    );


  /* ---------------------------------------------------
   * Shared career weather
   * ------------------------------------------------- */

  const careerWeather =
    buildCareerWeather(
      aspectSignals
    );


  /* ---------------------------------------------------
   * Career tone
   * ------------------------------------------------- */

  const tone =
    classifyNormalizedCareerScore(
      combinedScore
    );


  /* ---------------------------------------------------
   * Themes
   * ------------------------------------------------- */

  const themes = [];

  for (
    const dimensionName
    of CAREER_DIMENSIONS
  ) {

    const dimension =
      dimensions[
        dimensionName
      ];

    if (
      dimension.tone ===
      "supportive"
    ) {

      themes.push(
        `${dimensionName}:supportive`
      );

    } else if (
      dimension.tone ===
      "challenging"
    ) {

      themes.push(
        `${dimensionName}:challenging`
      );
    }
  }


  /* ---------------------------------------------------
   * Return structured Career interpretation
   * ------------------------------------------------- */

  return {

    section:
      "career",

    sunSign,

    tone,

    combinedScore,

    overallScore:
      combinedScore,

    dimensions,

    planets:
      interpretations,

    aspects:
      aspectSignals,

    strongestPlanet:
      strongestPlanetSignal,

    strongestPlanetInfluence:
      strongestPlanetSignal?.influence ??
      null,

    strongestDimension:
      strongest,

    strongestAspect:
      strongestAspectSignal,

    careerDynamic,

    careerWeather,

    themes,

    methodology: {

      primarySystem:
        "Western Tropical astrology with traditional rulership and essential-dignity techniques",

      signSpecificLogic:
        true,

      elementRelationship:
        true,

      modalityRelationship:
        true,

      signGeometry:
        true,

      traditionalRulership:
        true,

      essentialDignity:
        true,

      dimensionSpecificAspects:
        true,

      dimensionNormalization:
        "priority-capacity normalization",

      equalDimensionOverallScore:
        true,

      rawDimensionScoresRetained:
        true,

      globalAspectBonus:
        false,

      randomization:
        false,

      proseGeneration:
        "separate",
    },

    engineVersion:
      CAREER_ENGINE_VERSION,
  };
}


/* -------------------------------------------------------
 * Generic section alias
 * ----------------------------------------------------- */

export const interpretSection =
  interpretCareerSection;


/* -------------------------------------------------------
 * Named exports for testing
 * ----------------------------------------------------- */

export {

  CAREER_DIMENSIONS,

  CAREER_PRIORITIES,

  SIGN_RULERS,

  signGeometry,

  planetaryDignity,

  dimensionCapacity,

};