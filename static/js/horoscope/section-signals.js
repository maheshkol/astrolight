/**
 * horoscope/section-signals.js
 *
 * Section-aware semantic interpretation for AstroLight.
 *
 * This module answers:
 *
 *   "What does this planetary signal mean
 *    specifically for Love, Career, Money, etc.?"
 *
 * It does NOT generate prose.
 * It does NOT calculate astronomy.
 *
 * Pipeline:
 *
 *   interpretation signals
 *          ↓
 *   section relevance
 *          ↓
 *   section meaning
 *          ↓
 *   prose.js
 */

/*
 * -------------------------------------------------------
 * SECTION PLANET PRIORITIES
 * -------------------------------------------------------
 *
 * Higher number = stronger relevance.
 *
 * These priorities are intentionally explicit so that
 * every horoscope section has its own interpretation logic.
 */

export const SECTION_PLANET_PRIORITIES = {

  overview: {
    Sun: 10,
    Moon: 8,
    Jupiter: 7,
    Saturn: 7,
    Mars: 6,
    Mercury: 5,
    Venus: 5,
    Uranus: 4,
    Neptune: 4,
    Pluto: 4,
  },

  love: {
    Venus: 10,
    Moon: 9,
    Mars: 7,
    Pluto: 6,
    Neptune: 5,
    Sun: 4,
    Jupiter: 4,
    Saturn: 4,
    Mercury: 3,
    Uranus: 3,
  },

  career: {
    Saturn: 10,
    Jupiter: 9,
    Sun: 8,
    Mars: 7,
    Mercury: 6,
    Uranus: 5,
    Pluto: 4,
    Venus: 3,
    Moon: 3,
    Neptune: 2,
  },

  money: {
    Jupiter: 10,
    Saturn: 9,
    Venus: 7,
    Mercury: 6,
    Pluto: 5,
    Sun: 4,
    Mars: 4,
    Uranus: 4,
    Moon: 3,
    Neptune: 2,
  },

  energy: {
    Mars: 10,
    Sun: 8,
    Saturn: 7,
    Uranus: 6,
    Moon: 5,
    Jupiter: 4,
    Mercury: 3,
    Pluto: 3,
    Venus: 2,
    Neptune: 2,
  },

  communication: {
    Mercury: 10,
    Mars: 7,
    Sun: 6,
    Venus: 6,
    Moon: 5,
    Jupiter: 4,
    Uranus: 4,
    Saturn: 3,
    Neptune: 3,
    Pluto: 2,
  },

  emotional: {
    Moon: 10,
    Neptune: 8,
    Pluto: 7,
    Venus: 6,
    Sun: 5,
    Jupiter: 4,
    Saturn: 4,
    Mars: 3,
    Mercury: 3,
    Uranus: 3,
  },

  opportunity: {
    Jupiter: 10,
    Uranus: 9,
    Venus: 7,
    Sun: 6,
    Mercury: 5,
    Mars: 5,
    Saturn: 5,
    Pluto: 4,
    Neptune: 3,
    Moon: 3,
  },

  guidance: {
    Saturn: 10,
    Jupiter: 9,
    Moon: 8,
    Mars: 7,
    Mercury: 6,
    Sun: 6,
    Venus: 5,
    Uranus: 5,
    Neptune: 5,
    Pluto: 5,
  },
};

/*
 * -------------------------------------------------------
 * SECTION THEMES
 * -------------------------------------------------------
 *
 * These describe how each planet expresses itself in
 * a particular horoscope category.
 */

export const SECTION_PLANET_THEMES = {

  love: {
    Venus: {
      supportive: "connection",
      challenging: "relationship_boundaries",
    },

    Moon: {
      supportive: "emotional_closeness",
      challenging: "emotional_sensitivity",
    },

    Mars: {
      supportive: "passion",
      challenging: "relationship_friction",
    },

    Pluto: {
      supportive: "deep_transformation",
      challenging: "intensity",
    },

    Neptune: {
      supportive: "romantic_imagination",
      challenging: "idealization",
    },

    Sun: {
      supportive: "confidence_in_relationships",
      challenging: "self_focus",
    },

    Jupiter: {
      supportive: "relationship_growth",
      challenging: "overexpectation",
    },

    Saturn: {
      supportive: "commitment",
      challenging: "distance_or_limits",
    },

    Mercury: {
      supportive: "relationship_conversation",
      challenging: "misunderstanding",
    },

    Uranus: {
      supportive: "fresh_connection",
      challenging: "unpredictability",
    },
  },

  career: {
    Saturn: {
      supportive: "discipline",
      challenging: "restriction",
    },

    Jupiter: {
      supportive: "professional_growth",
      challenging: "overextension",
    },

    Sun: {
      supportive: "leadership",
      challenging: "ego_pressure",
    },

    Mars: {
      supportive: "initiative",
      challenging: "workplace_friction",
    },

    Mercury: {
      supportive: "planning_and_communication",
      challenging: "communication_errors",
    },

    Uranus: {
      supportive: "innovation",
      challenging: "unexpected_change",
    },

    Pluto: {
      supportive: "professional_transformation",
      challenging: "power_struggles",
    },

    Venus: {
      supportive: "cooperation",
      challenging: "people_pleasing",
    },

    Moon: {
      supportive: "workplace_awareness",
      challenging: "emotional_work_pressure",
    },

    Neptune: {
      supportive: "creative_work",
      challenging: "unclear_expectations",
    },
  },

  money: {
    Jupiter: {
      supportive: "financial_opportunity",
      challenging: "financial_overreach",
    },

    Saturn: {
      supportive: "financial_discipline",
      challenging: "financial_limits",
    },

    Venus: {
      supportive: "value_and_resources",
      challenging: "unnecessary_spending",
    },

    Mercury: {
      supportive: "financial_planning",
      challenging: "financial_miscommunication",
    },

    Pluto: {
      supportive: "financial_restructuring",
      challenging: "financial_intensity",
    },

    Sun: {
      supportive: "financial_confidence",
      challenging: "ego_driven_spending",
    },

    Mars: {
      supportive: "decisive_action",
      challenging: "impulsive_action",
    },

    Uranus: {
      supportive: "financial_innovation",
      challenging: "financial_unpredictability",
    },

    Moon: {
      supportive: "financial_awareness",
      challenging: "emotional_spending",
    },

    Neptune: {
      supportive: "creative_value",
      challenging: "financial_uncertainty",
    },
  },

  energy: {
    Mars: {
      supportive: "motivation",
      challenging: "frustration",
    },

    Sun: {
      supportive: "vitality",
      challenging: "ego_exhaustion",
    },

    Saturn: {
      supportive: "controlled_effort",
      challenging: "fatigue_or_limits",
    },

    Uranus: {
      supportive: "spontaneous_energy",
      challenging: "restlessness",
    },

    Moon: {
      supportive: "emotional_rhythm",
      challenging: "mood_driven_energy",
    },

    Jupiter: {
      supportive: "enthusiasm",
      challenging: "overdoing",
    },

    Mercury: {
      supportive: "mental_activity",
      challenging: "mental_overload",
    },

    Pluto: {
      supportive: "focused_power",
      challenging: "intensity",
    },

    Venus: {
      supportive: "ease_and_balance",
      challenging: "passivity",
    },

    Neptune: {
      supportive: "flow",
      challenging: "low_clarity",
    },
  },

  communication: {
    Mercury: {
      supportive: "clear_expression",
      challenging: "misunderstanding",
    },

    Mars: {
      supportive: "directness",
      challenging: "sharp_words",
    },

    Sun: {
      supportive: "confidence_in_expression",
      challenging: "ego_in_communication",
    },

    Venus: {
      supportive: "diplomacy",
      challenging: "avoidance",
    },

    Moon: {
      supportive: "emotional_expression",
      challenging: "emotional_reactivity",
    },

    Jupiter: {
      supportive: "big_picture_thinking",
      challenging: "overstatement",
    },

    Uranus: {
      supportive: "original_ideas",
      challenging: "unexpected_messages",
    },

    Saturn: {
      supportive: "careful_words",
      challenging: "communication_blocks",
    },

    Neptune: {
      supportive: "intuition",
      challenging: "unclear_messages",
    },

    Pluto: {
      supportive: "deep_conversation",
      challenging: "intense_exchange",
    },
  },

  emotional: {
    Moon: {
      supportive: "emotional_awareness",
      challenging: "emotional_reactivity",
    },

    Neptune: {
      supportive: "intuition",
      challenging: "uncertainty",
    },

    Pluto: {
      supportive: "emotional_transformation",
      challenging: "emotional_intensity",
    },

    Venus: {
      supportive: "emotional_harmony",
      challenging: "emotional_attachment",
    },

    Sun: {
      supportive: "self_awareness",
      challenging: "self_consciousness",
    },

    Jupiter: {
      supportive: "emotional_optimism",
      challenging: "emotional_excess",
    },

    Saturn: {
      supportive: "emotional_stability",
      challenging: "emotional_reserve",
    },

    Mars: {
      supportive: "emotional_drive",
      challenging: "irritability",
    },

    Mercury: {
      supportive: "emotional_understanding",
      challenging: "overthinking",
    },

    Uranus: {
      supportive: "emotional_freedom",
      challenging: "emotional_unpredictability",
    },
  },

  opportunity: {
    Jupiter: {
      supportive: "expansion",
      challenging: "overreach",
    },

    Uranus: {
      supportive: "unexpected_opening",
      challenging: "unstable_opportunity",
    },

    Venus: {
      supportive: "cooperation",
      challenging: "dependence_on_others",
    },

    Sun: {
      supportive: "confidence",
      challenging: "overconfidence",
    },

    Mercury: {
      supportive: "useful_information",
      challenging: "missed_details",
    },

    Mars: {
      supportive: "initiative",
      challenging: "rushed_action",
    },

    Saturn: {
      supportive: "long_term_value",
      challenging: "delayed_results",
    },

    Pluto: {
      supportive: "deep_change",
      challenging: "high_stakes_change",
    },

    Neptune: {
      supportive: "inspiration",
      challenging: "unclear_potential",
    },

    Moon: {
      supportive: "timely_instinct",
      challenging: "changing_moods",
    },
  },

  guidance: {
    Saturn: {
      supportive: "discipline",
      challenging: "patience",
    },

    Jupiter: {
      supportive: "perspective",
      challenging: "moderation",
    },

    Moon: {
      supportive: "emotional_awareness",
      challenging: "emotional_patience",
    },

    Mars: {
      supportive: "decisive_action",
      challenging: "restraint",
    },

    Mercury: {
      supportive: "clarity",
      challenging: "verification",
    },

    Sun: {
      supportive: "self_trust",
      challenging: "humility",
    },

    Venus: {
      supportive: "cooperation",
      challenging: "balance",
    },

    Uranus: {
      supportive: "flexibility",
      challenging: "adaptability",
    },

    Neptune: {
      supportive: "intuition",
      challenging: "clarity",
    },

    Pluto: {
      supportive: "transformation",
      challenging: "release",
    },
  },
};

/*
 * -------------------------------------------------------
 * ASPECT PRIORITIES
 * -------------------------------------------------------
 */

export const SECTION_ASPECT_PLANETS = {

  overview: [
    "Sun",
    "Moon",
    "Jupiter",
    "Saturn",
  ],

  love: [
    "Venus",
    "Moon",
    "Mars",
    "Pluto",
    "Neptune",
  ],

  career: [
    "Saturn",
    "Jupiter",
    "Sun",
    "Mars",
    "Mercury",
  ],

  money: [
    "Jupiter",
    "Saturn",
    "Venus",
    "Mercury",
    "Pluto",
  ],

  energy: [
    "Mars",
    "Sun",
    "Saturn",
    "Uranus",
    "Moon",
  ],

  communication: [
    "Mercury",
    "Mars",
    "Sun",
    "Venus",
    "Uranus",
  ],

  emotional: [
    "Moon",
    "Neptune",
    "Pluto",
    "Venus",
  ],

  opportunity: [
    "Jupiter",
    "Uranus",
    "Venus",
    "Sun",
    "Mercury",
  ],

  guidance: [
    "Saturn",
    "Jupiter",
    "Moon",
    "Mars",
    "Mercury",
  ],
};

/*
 * -------------------------------------------------------
 * SELECT PLANETARY SIGNAL
 * -------------------------------------------------------
 */

export function selectSectionPlanetarySignal(
  interpretation,
  section
) {
  const signals =
    interpretation?.planetarySignals ?? [];

  const priorities =
    SECTION_PLANET_PRIORITIES[section] ?? {};

  if (signals.length === 0) {
    return null;
  }

  const ranked = signals
    .map(signal => ({
      signal,
      priority:
        priorities[signal.planet] ?? 0,
    }))
    .filter(item => item.priority > 0)
    .sort((a, b) => {

      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }

      return (
        Math.abs(b.signal.score ?? 0) -
        Math.abs(a.signal.score ?? 0)
      );
    });

  return ranked[0]?.signal ?? null;
}

/*
 * -------------------------------------------------------
 * SELECT SECTION ASPECT
 * -------------------------------------------------------
 */

export function selectSectionAspect(
  interpretation,
  section
) {
  const aspects =
    interpretation?.aspectSignals ?? [];

  const preferred =
    SECTION_ASPECT_PLANETS[section] ?? [];

  if (aspects.length === 0) {
    return null;
  }

  /*
   * Aspect quality.
   *
   * Supportive aspects receive a positive bonus.
   * Challenging aspects remain important, but should
   * not automatically dominate merely because they
   * contain a high-priority planet.
   *
   * Conjunctions are treated as intensifying rather
   * than inherently positive or negative.
   */
  const influenceWeight = {
    supportive: 1.15,
    challenging: 1.10,
    intensifying: 1.00,
    neutral: 0.90,
  };

  const aspectTypeWeight = {
    Trine: 1.10,
    Sextile: 1.00,
    Square: 1.00,
    Opposition: 1.00,
    Conjunction: 0.95,
  };

  const ranked = aspects
    .map(aspect => {

      /*
       * -----------------------------------------------
       * 1. SECTION PLANET RELEVANCE
       * -----------------------------------------------
       *
       * Earlier planets in the section priority list
       * are more relevant.
       */
      let planetRelevance = 0;

      for (const planet of aspect.planets) {
        const index =
          preferred.indexOf(planet);

        if (index >= 0) {
          planetRelevance +=
            preferred.length - index;
        }
      }

      /*
       * Ignore aspects that have no meaningful
       * connection to this section.
       */
      if (planetRelevance === 0) {
        return {
          aspect,
          relevance: -1,
        };
      }

      /*
       * -----------------------------------------------
       * 2. ASPECT STRENGTH
       * -----------------------------------------------
       *
       * Tighter aspects are more influential.
       */
      const strength =
        Math.max(
          0,
          Math.min(
            1,
            Number(aspect.strength ?? 0)
          )
        );

      /*
       * -----------------------------------------------
       * 3. ASPECT TYPE
       * -----------------------------------------------
       */
      const typeWeight =
        aspectTypeWeight[
          aspect.aspect
        ] ?? 1;

      /*
       * -----------------------------------------------
       * 4. INTERPRETIVE DIRECTION
       * -----------------------------------------------
       */
      const directionWeight =
        influenceWeight[
          aspect.influence
        ] ?? 1;

      /*
       * -----------------------------------------------
       * 5. FINAL RELEVANCE
       * -----------------------------------------------
       *
       * Section relevance remains the dominant factor,
       * but strong aspects now meaningfully influence
       * selection.
       */
      const relevance =
        planetRelevance *
        (
          1 +
          strength *
          typeWeight *
          directionWeight
        );

      return {
        aspect,
        relevance,
      };
    })
    .filter(
      item =>
        item.relevance >= 0
    )
    .sort(
      (a, b) => {

        if (
          b.relevance !==
          a.relevance
        ) {
          return (
            b.relevance -
            a.relevance
          );
        }

        /*
         * Deterministic tie-breaker:
         * tighter aspect wins.
         */
        return (
          Number(
            a.aspect.exactOrb ?? 99
          ) -
          Number(
            b.aspect.exactOrb ?? 99
          )
        );
      }
    );

  return ranked[0]?.aspect ?? null;
}

/*
 * -------------------------------------------------------
 * BUILD SECTION SEMANTICS
 * -------------------------------------------------------
 */

export function buildSectionSemantic(
  interpretation,
  section
) {
  const signal =
    selectSectionPlanetarySignal(
      interpretation,
      section
    );

  const aspect =
    selectSectionAspect(
      interpretation,
      section
    );

  let meaning = null;

  if (
    signal &&
    SECTION_PLANET_THEMES[section] &&
    SECTION_PLANET_THEMES[section][signal.planet]
  ) {
    const planetTheme =
      SECTION_PLANET_THEMES[section][signal.planet];

    meaning =
      planetTheme[
        signal.influence
      ] ??
      planetTheme.supportive ??
      null;
  }

  return {
    section,

    planet:
      signal?.planet ?? null,

    planetInfluence:
      signal?.influence ?? null,

    planetScore:
      signal?.score ?? 0,

    theme:
      meaning,

    aspect: aspect
      ? {
          planets: aspect.planets,
          aspect: aspect.aspect,
          influence: aspect.influence,
          strength: aspect.strength,
          exactOrb: aspect.exactOrb,
        }
      : null,
  };
}

/*
 * -------------------------------------------------------
 * BUILD ALL SECTION SEMANTICS
 * -------------------------------------------------------
 */

export function buildAllSectionSemantics(
  interpretation
) {
  const sections = [
    "overview",
    "love",
    "career",
    "money",
    "energy",
    "communication",
    "emotional",
    "opportunity",
    "guidance",
  ];

  const result = {};

  for (const section of sections) {
    result[section] =
      buildSectionSemantic(
        interpretation,
        section
      );
  }

  return result;
}

