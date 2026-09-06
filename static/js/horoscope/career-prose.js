/**
 * horoscope/career-prose.js
 *
 * Deterministic reader-facing prose layer for AstroLight Career.
 *
 * This module consumes structured output from career.js.
 * It does not calculate astronomy, scores, aspects, rulership,
 * dignity, or interpretation.
 *
 * Same sign + Career interpretation (+ optional date) = same prose.
 *
 * Input:
 * {
 *   sunSign,
 *   career,
 *   aspectSignals,
 *   dateUTC
 * }
 */

export const CAREER_PROSE_VERSION = "1.2.3";

/*
 * -------------------------------------------------------
 * DETERMINISTIC HASH
 * -------------------------------------------------------
 */

function hashString(value) {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash =
      ((hash << 5) - hash) +
      value.charCodeAt(i);

    hash |= 0;
  }

  return Math.abs(hash);
}

function chooseVariation(variations, seed) {
  if (
    !Array.isArray(variations) ||
    variations.length === 0
  ) {
    return "";
  }

  return variations[
    hashString(seed) % variations.length
  ];
}

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/*
 * -------------------------------------------------------
 * CAREER PROSE
 * -------------------------------------------------------
 *
 * The vocabulary maps directly to the seven dimensions
 * produced by career.js.
 *
 * Each dimension has supportive / challenging / balanced
 * language, following the same architecture as Love Prose.
 * -------------------------------------------------------
 */

const CAREER_PROSE = {

  professionalDrive: {
    supportive: [
      "Professional motivation can run strongly today, making it easier to take initiative on an important priority.",
      "You may have useful momentum behind your work when you direct your effort toward one clear objective.",
      "Initiative comes more naturally today, especially when you give your strongest energy a practical direction."
    ],

    challenging: [
      "Professional motivation may come with impatience today, so direct your energy carefully rather than forcing progress.",
      "You may feel pressure to act quickly at work, but deliberate action is more useful than unnecessary urgency.",
      "Drive is present, although frustration could make it harder to judge which tasks genuinely deserve your effort."
    ],

    balanced: [
      "Professional motivation is steady today, with the best results coming from focused rather than scattered effort.",
      "Your drive is available without needing to dominate the day; give it a clear priority and let progress build.",
      "A measured level of ambition can keep your work moving without creating unnecessary pressure."
    ]
  },

  careerDirection: {
    supportive: [
      "Career direction is becoming clearer, making it easier to distinguish important priorities from distractions.",
      "You can make useful progress by aligning today's decisions with the direction you want your career to take.",
      "A clearer sense of professional direction can help you choose where your attention is most valuable."
    ],

    challenging: [
      "Career direction may feel less certain, so avoid making a major decision simply to escape temporary pressure.",
      "Competing professional priorities could make direction harder to judge today; give yourself time to separate urgency from importance.",
      "Your next professional step may require more reflection than action, particularly if expectations are still unclear."
    ],

    balanced: [
      "Career direction is manageable today, although a few priorities may need clearer definition.",
      "You do not need to settle every long-term question today; focus on the direction that makes practical sense now.",
      "A measured look at your priorities can help you keep your professional path clear without forcing certainty."
    ]
  },

  workPerformance: {
    supportive: [
      "Work performance benefits from focus, making this a useful time to turn plans into measurable results.",
      "Execution can be especially effective when you keep important tasks organized and finish what you start.",
      "Productivity is supported by disciplined attention to detail and a clear working rhythm."
    ],

    challenging: [
      "Work performance may require extra concentration today, particularly where details or deadlines are involved.",
      "Pressure around execution could make small errors easier to overlook, so slow down enough to check important work.",
      "Productivity may feel uneven; prioritize essential tasks instead of trying to maintain maximum output everywhere."
    ],

    balanced: [
      "Work performance remains steady when you keep the workload realistic and priorities organized.",
      "A practical working rhythm can help you produce reliable results without unnecessary strain.",
      "Focus on completing important work cleanly rather than measuring the day only by how much you accomplish."
    ]
  },

  recognition: {
    supportive: [
      "Professional visibility is supported today, giving your work a better chance of receiving useful acknowledgment.",
      "Recognition can grow naturally when you allow the quality of your work to speak clearly for itself.",
      "Your professional presence may be more noticeable today, especially when confidence is backed by tangible results."
    ],

    challenging: [
      "Recognition may not arrive as quickly as expected, so avoid allowing external acknowledgment to determine the value of your work.",
      "Professional visibility may feel uneven today; focus on results rather than trying to force recognition.",
      "You may need patience around acknowledgment or reputation matters, particularly if expectations are running high."
    ],

    balanced: [
      "Recognition is best approached through consistent results and measured professional visibility.",
      "Your work can speak for itself today, while patience helps you avoid chasing acknowledgment too aggressively.",
      "Professional visibility remains manageable when confidence is supported by substance rather than presentation alone."
    ]
  },

  growth: {
    supportive: [
      "Professional growth has room to expand today, especially through learning, development and useful new possibilities.",
      "A growth-oriented approach can open the way for meaningful professional development.",
      "This is a constructive time to build skills, broaden your experience or explore a path with longer-term potential."
    ],

    challenging: [
      "Growth may require more patience than enthusiasm today, particularly if results are developing gradually.",
      "A desire to move ahead could become counterproductive if you take on more than current circumstances can support.",
      "Professional development is still possible, but steady preparation may be more valuable than forcing rapid expansion."
    ],

    balanced: [
      "Professional growth is available, although its value depends on choosing development that supports your longer-term direction.",
      "There is room to develop without needing to expand everything at once.",
      "A measured investment in skills and experience can create useful progress over time."
    ]
  },

  authority: {
    supportive: [
      "Responsibility and leadership can work in your favor today when you use authority with a practical purpose.",
      "You may be in a stronger position to take responsibility or guide an important professional decision.",
      "Leadership is most effective today when confidence is matched by accountability and sound judgment."
    ],

    challenging: [
      "Questions of authority or control may create professional tension, so avoid turning responsibility into a contest.",
      "Leadership may feel heavier today, particularly if expectations or responsibilities are competing.",
      "Be careful with professional power dynamics; forcing control may create more resistance than progress."
    ],

    balanced: [
      "Authority is best handled through responsibility rather than control.",
      "You can take ownership of important work without needing to manage every surrounding detail.",
      "A balanced approach to leadership can protect both your authority and your working relationships."
    ]
  },

  opportunity: {
    supportive: [
      "Useful professional opportunities may be easier to recognize today, especially when you remain open to practical possibilities.",
      "An opening could develop into meaningful progress if you choose the option that fits your longer-term direction.",
      "The professional landscape offers constructive potential, with timely initiative helping turn possibility into progress."
    ],

    challenging: [
      "A promising professional opening may require more evaluation than immediate action.",
      "Not every attractive possibility needs to be pursued; check whether an opportunity genuinely fits your priorities before committing.",
      "Opportunity is present but may come with conditions, so flexibility and careful judgment matter more than enthusiasm alone."
    ],

    balanced: [
      "Useful possibilities may emerge today, although patience can help distinguish a genuine opportunity from a temporary opening.",
      "Stay open to professional opportunities without assuming that every possibility requires an immediate decision.",
      "A measured approach can help you recognize which openings are worth exploring and which are better left aside."
    ]
  }

};

/*
 * -------------------------------------------------------
 * DIMENSION ORDER / LABELS
 * -------------------------------------------------------
 */

const CAREER_DIMENSION_ORDER = [
  "professionalDrive",
  "careerDirection",
  "workPerformance",
  "recognition",
  "growth",
  "authority",
  "opportunity"
];

const CAREER_DIMENSION_LABELS = {
  professionalDrive: "professional drive",
  careerDirection: "career direction",
  workPerformance: "work performance",
  recognition: "recognition",
  growth: "growth",
  authority: "authority",
  opportunity: "opportunity"
};

function careerDimensionSentence(
  dimensionName,
  dimension,
  seed
) {
  if (!dimension) {
    return "";
  }

  const influence =
    dimension.tone === "supportive" ||
    dimension.influence === "supportive"
      ? "supportive"
      : dimension.tone === "challenging" ||
        dimension.influence === "challenging"
        ? "challenging"
        : "balanced";

  return chooseVariation(
    CAREER_PROSE[dimensionName]?.[influence],
    `${seed}:career:dimension:${dimensionName}:${influence}`
  );
}

/*
 * -------------------------------------------------------
 * CAREER DYNAMIC
 * -------------------------------------------------------
 */

const CAREER_DYNAMIC_PROSE = {

  constructive: [
    "The professional picture is generally constructive today, with useful momentum available when priorities remain clear.",
    "Career matters carry a constructive tone today, especially where focused effort is matched with practical judgment.",
    "The workday has a generally forward-moving quality, with progress favored when you use your strongest areas deliberately."
  ],

  demanding: [
    "Career matters may require more patience today, particularly where pressure and expectations compete.",
    "The professional picture is more demanding than usual, making careful priorities and measured responses especially useful.",
    "Work may ask more of you today, so protect your attention and avoid creating additional pressure unnecessarily."
  ],

  mixed: [
    "The professional picture is mixed today, with some areas moving forward while others require adjustment.",
    "Career matters are manageable but uneven today, so use the stronger areas without ignoring what needs more care.",
    "Some professional themes are constructive while others call for restraint, making flexibility useful throughout the day."
  ]
};

function careerOpening(career, seed) {
  const dynamic =
    career.careerDynamic?.type ?? "mixed";

  return chooseVariation(
    CAREER_DYNAMIC_PROSE[dynamic] ??
    CAREER_DYNAMIC_PROSE.mixed,
    `${seed}:career:opening:${dynamic}`
  );
}

/*
 * -------------------------------------------------------
 * SIGN-SPECIFIC CAREER CONTEXT
 * -------------------------------------------------------
 *
 * Narrative-only layer. It does not alter Career Engine
 * scores or perform any astronomical calculations.
 */
const CAREER_SIGN_CONTEXT = {
  Aries: { constructive: "Direct action and initiative are especially useful when you can see a clear professional opening.", balanced: "A practical target helps your natural drive stay productive without creating unnecessary urgency.", demanding: "Strong initiative needs restraint today, especially where acting too quickly could create avoidable friction." },
  Taurus: { constructive: "Steady effort and tangible progress can make the strongest professional possibilities more valuable.", balanced: "Consistency and practical judgment can help you build progress without forcing the pace.", demanding: "Protect stability by resisting pressure to change course before the practical value is clear." },
  Gemini: { constructive: "Information, choices and timely decisions can help you turn professional possibilities into useful movement.", balanced: "Keeping priorities clear will help you use your flexibility without scattering attention.", demanding: "Too many competing options can dilute progress, so distinguish useful information from unnecessary distraction." },
  Cancer: { constructive: "Awareness of the working environment can help you choose where your effort will have the greatest practical effect.", balanced: "A sustainable rhythm can help you balance professional effort with changing demands around you.", demanding: "Protect your focus when workplace pressures shift, and avoid carrying every surrounding concern into your decisions." },
  Leo: { constructive: "Visibility, confidence and growth can reinforce one another when your ambitions are backed by demonstrable results.", balanced: "Purposeful visibility is more useful than chasing attention, particularly when results can speak for themselves.", demanding: "Recognition matters, but confidence is strongest when it remains grounded in responsibility and measurable work." },
  Virgo: { constructive: "Careful planning and useful execution can turn professional motivation into dependable progress.", balanced: "Clear standards and realistic priorities can keep your work effective without demanding perfection everywhere.", demanding: "Extra attention to details is useful, but avoid letting minor imperfections distract from the most important result." },
  Libra: { constructive: "Cooperation and professional relationships can help useful openings develop into stronger opportunities.", balanced: "Good judgment around people and priorities can help you move forward without overcommitting.", demanding: "Professional choices may require firmer boundaries, particularly when keeping everyone satisfied would weaken your priorities." },
  Scorpio: { constructive: "Focused determination can help you make meaningful progress when you commit energy to the right professional target.", balanced: "Selective effort can be more powerful than constant activity, especially when priorities are still developing.", demanding: "Avoid turning professional pressure into a contest; strategic patience can protect your position." },
  Sagittarius: { constructive: "A broader view can reveal worthwhile professional possibilities, especially when enthusiasm is matched with follow-through.", balanced: "Keep the larger goal in view while giving today's most practical step enough attention.", demanding: "Ambition may run ahead of circumstances, so check the practical conditions before committing to expansion." },
  Capricorn: { constructive: "Long-term results, responsibility and professional credibility benefit from disciplined progress.", balanced: "Steady structure can help you distinguish lasting priorities from pressures that only feel urgent.", demanding: "Professional pressure is best handled through patience, measurable results and responsible use of authority." },
  Aquarius: { constructive: "Fresh approaches and useful possibilities can create progress when you remain flexible about how the work gets done.", balanced: "Innovation is most valuable when it serves a clear professional purpose rather than change for its own sake.", demanding: "Unconventional ideas may need practical grounding before they can produce dependable professional results." },
  Pisces: { constructive: "Intuition can help you notice useful possibilities, provided you translate impressions into practical action.", balanced: "A clear priority can help you balance sensitivity to changing circumstances with consistent professional effort.", demanding: "Unclear expectations can drain momentum, so verify important assumptions before investing too much effort." }
};

function careerSignContext(sunSign, dynamic, seed) {
  return CAREER_SIGN_CONTEXT[sunSign]?.[dynamic] ||
    CAREER_SIGN_CONTEXT.Pisces.mixed;
}

function careerStrongestAreaSentence(career, seed) {
  const strongest = career.strongestDimension;
  if (!strongest?.dimension) return "";

  const label =
    CAREER_DIMENSION_LABELS[strongest.dimension] ??
    strongest.dimension;

  const influence =
    strongest.influence === "supportive" || strongest.tone === "supportive"
      ? "supportive"
      : strongest.influence === "challenging" || strongest.tone === "challenging"
        ? "challenging"
        : "balanced";

  const detail = careerDimensionSentence(
    strongest.dimension,
    career.dimensions?.[strongest.dimension],
    `${seed}:career:strongest-detail`
  );

  const lead =
    influence === "supportive"
      ? `${capitalize(label)} is the clearest constructive career theme today.`
      : influence === "challenging"
        ? `${capitalize(label)} is the career area most likely to require patience today.`
        : `${capitalize(label)} is the most noticeable career theme today.`;

  return [lead, detail].filter(Boolean).join(" ");
}

/*
 * -------------------------------------------------------
 * STRONGEST PLANET
 * -------------------------------------------------------
 */

const CAREER_PLANET_LABELS = {
  Sun: "the Sun",
  Moon: "the Moon",
  Mercury: "Mercury",
  Venus: "Venus",
  Mars: "Mars",
  Jupiter: "Jupiter",
  Saturn: "Saturn",
  Uranus: "Uranus",
  Neptune: "Neptune",
  Pluto: "Pluto"
};

const CAREER_PLANET_THEMES = {
  Sun: [
    "leadership and professional visibility",
    "confidence and recognition",
    "leadership and purposeful visibility"
  ],

  Moon: [
    "workplace awareness and changing professional needs",
    "professional sensitivity and responsiveness",
    "awareness of the working environment"
  ],

  Mercury: [
    "planning, analysis and communication",
    "professional communication and clear thinking",
    "planning and practical decision-making"
  ],

  Venus: [
    "cooperation, relationships and professional value",
    "diplomacy and constructive working relationships",
    "professional harmony and value"
  ],

  Mars: [
    "initiative and decisive action",
    "motivation and competitive drive",
    "direct professional action"
  ],

  Jupiter: [
    "growth and opportunity",
    "professional expansion and possibility",
    "development and wider opportunity"
  ],

  Saturn: [
    "discipline, responsibility and patience",
    "structure and professional responsibility",
    "discipline and long-term progress"
  ],

  Uranus: [
    "innovation and unconventional approaches",
    "change and new professional methods",
    "innovation and flexibility"
  ],

  Neptune: [
    "intuition and unclear professional expectations",
    "imagination and sensitivity around work",
    "intuition and the need for clearer expectations"
  ],

  Pluto: [
    "professional transformation and power dynamics",
    "strategic change and deeper professional shifts",
    "transformation and professional influence"
  ]
};

const CAREER_PLANET_DIMENSION_LINKS = {
  Sun: {
    professionalDrive: "confidence can help turn motivation into purposeful action",
    careerDirection: "confidence can help clarify the direction you want to pursue",
    workPerformance: "focused confidence can strengthen the quality of execution",
    recognition: "visibility can grow when confidence is supported by tangible results",
    growth: "confidence can encourage you to develop beyond familiar limits",
    authority: "leadership is strongest when confidence is matched by accountability",
    opportunity: "confidence can help you recognize a useful opening without overreaching"
  },

  Moon: {
    professionalDrive: "awareness of your changing needs can help direct your effort",
    careerDirection: "professional instincts can help you notice which priorities feel sustainable",
    workPerformance: "awareness of your working rhythm can improve consistency",
    recognition: "sensitivity to the professional environment can help you respond appropriately",
    growth: "awareness of what you genuinely need can guide useful development",
    authority: "responsiveness can make leadership more considerate and effective",
    opportunity: "intuition can help you notice possibilities that fit your circumstances"
  },

  Mercury: {
    professionalDrive: "clear thinking can turn motivation into organized action",
    careerDirection: "analysis can help separate important priorities from distractions",
    workPerformance: "planning and attention to detail can strengthen execution",
    recognition: "clear communication can make your work easier for others to recognize",
    growth: "learning and information can open practical paths for development",
    authority: "well-reasoned communication can strengthen professional leadership",
    opportunity: "useful information can make a promising opening easier to evaluate"
  },

  Venus: {
    professionalDrive: "cooperation can make effort more productive",
    careerDirection: "professional relationships can help clarify which direction has lasting value",
    workPerformance: "a cooperative environment can make consistent execution easier",
    recognition: "professional goodwill can support reputation and visibility",
    growth: "useful relationships can contribute to development and advancement",
    authority: "diplomacy can make responsibility easier to exercise effectively",
    opportunity: "cooperation can turn an opening into something more useful"
  },

  Mars: {
    professionalDrive: "initiative can turn motivation into direct progress",
    careerDirection: "decisive action can help move a clear professional priority forward",
    workPerformance: "direct effort can strengthen execution when it remains focused",
    recognition: "visible initiative can help demonstrate what you can accomplish",
    growth: "ambition can push you toward useful professional development",
    authority: "decisive leadership can be effective when it remains measured",
    opportunity: "timely initiative can help turn a promising opening into progress"
  },

  Jupiter: {
    professionalDrive: "optimism can expand your willingness to pursue meaningful goals",
    careerDirection: "a broader perspective can help you see where professional growth is leading",
    workPerformance: "a larger perspective can help connect daily work with meaningful progress",
    recognition: "growth and visibility can reinforce each other when expectations remain realistic",
    growth: "expansion can support meaningful development and advancement",
    authority: "confidence can broaden your willingness to take responsible leadership",
    opportunity: "a wider perspective can help you recognize worthwhile possibilities"
  },

  Saturn: {
    professionalDrive: "discipline can turn effort into dependable progress",
    careerDirection: "long-term structure can help clarify which direction is worth pursuing",
    workPerformance: "discipline and consistency can strengthen execution",
    recognition: "reliable results can build professional credibility over time",
    growth: "patient development can create stronger long-term progress",
    authority: "responsibility can strengthen authority when expectations are handled steadily",
    opportunity: "careful evaluation can help distinguish lasting opportunities from temporary openings"
  },

  Uranus: {
    professionalDrive: "a fresh approach can redirect motivation toward something more effective",
    careerDirection: "new possibilities can challenge an established professional path",
    workPerformance: "innovation can improve how established work is approached",
    recognition: "an unconventional contribution may make your work more noticeable",
    growth: "change can create new room for professional development",
    authority: "flexibility can make leadership more effective during change",
    opportunity: "an unexpected opening may become useful if you remain adaptable"
  },

  Neptune: {
    professionalDrive: "intuition can inspire effort, but practical priorities should remain clear",
    careerDirection: "intuition may offer direction while clearer facts are still needed",
    workPerformance: "imagination can help, provided important details are verified",
    recognition: "professional impressions matter, but substance should remain the foundation",
    growth: "inspiration can encourage development when expectations stay grounded",
    authority: "sensitivity can help you lead thoughtfully, but boundaries still matter",
    opportunity: "an appealing possibility deserves practical verification before commitment"
  },

  Pluto: {
    professionalDrive: "focused determination can support meaningful professional change",
    careerDirection: "deeper priorities may reshape the direction you want to take",
    workPerformance: "strategic focus can improve how you approach demanding work",
    recognition: "lasting professional influence can come from substantive change",
    growth: "transformation can create deeper forms of professional development",
    authority: "power is most constructive when used strategically rather than defensively",
    opportunity: "a significant opening may require changing an established approach"
  }
};

function careerPlanetSentence(career, seed) {
  const planet =
    career.strongestPlanet;

  if (!planet?.planet) {
    return "";
  }

  const name =
    CAREER_PLANET_LABELS[planet.planet] ??
    planet.planet;

  const strongestDimension =
    career.strongestDimension?.dimension;

  const linkedMeaning =
    CAREER_PLANET_DIMENSION_LINKS[
      planet.planet
    ]?.[strongestDimension];

  const theme =
    chooseVariation(
      CAREER_PLANET_THEMES[planet.planet],
      `${seed}:career:planet:theme:${planet.planet}`
    );

  if (!theme) {
    return "";
  }

  /*
   * Context-aware wording is preferred when the strongest
   * dimension has a defined planetary relationship.
   */
  if (linkedMeaning) {
    if (planet.influence === "challenging") {
      return chooseVariation(
        [
          `${capitalize(name)} is the strongest challenging professional influence today; ${linkedMeaning}.`,
          `The strongest planetary pressure comes from ${capitalize(name)}, so ${linkedMeaning}.`
        ],
        `${seed}:career:planet:${planet.planet}:linked:challenging`
      );
    }

    if (
      planet.influence === "supportive" ||
      planet.tone === "supportive"
    ) {
      return chooseVariation(
        [
          `${capitalize(name)} is the strongest supportive professional influence today; ${linkedMeaning}.`,
          `${capitalize(name)} reinforces the main career theme today, and ${linkedMeaning}.`
        ],
        `${seed}:career:planet:${planet.planet}:linked:supportive`
      );
    }

    return chooseVariation(
      [
        `${capitalize(name)} is a noticeable professional influence today; ${linkedMeaning}.`,
        `${capitalize(name)} also speaks to the main career theme today, and ${linkedMeaning}.`
      ],
      `${seed}:career:planet:${planet.planet}:linked:balanced`
    );
  }

  if (planet.influence === "challenging") {
    return chooseVariation(
      [
        `${capitalize(name)} carries the strongest challenging professional influence today, so its themes deserve extra awareness.`,
        `${capitalize(name)} is the most significant source of professional pressure today, making ${theme} especially worth handling carefully.`
      ],
      `${seed}:career:planet:${planet.planet}:challenging`
    );
  }

  if (
    planet.influence === "supportive" ||
    planet.tone === "supportive"
  ) {
    return chooseVariation(
      [
        `${capitalize(name)} is the strongest supportive professional influence today, emphasizing ${theme}.`,
        `The career picture is particularly responsive to ${capitalize(name)}, whose influence supports ${theme}.`
      ],
      `${seed}:career:planet:${planet.planet}:supportive`
    );
  }

  return chooseVariation(
    [
      `${capitalize(name)} is a noticeable professional influence today, emphasizing ${theme}.`,
      `The professional picture also responds to ${capitalize(name)}, bringing attention to ${theme}.`
    ],
    `${seed}:career:planet:${planet.planet}:balanced`
  );
}

/*
 * -------------------------------------------------------
 * CAREER WEATHER
 * -------------------------------------------------------
 *
 * Secondary shared-aspect context. It does not contribute
 * another score and never replaces the seven dimensions.
 * -------------------------------------------------------
 */

function careerWeatherSentence(career, seed) {
  const weather =
    career.careerWeather;

  if (!weather) {
    return "";
  }

  const aspect =
    weather.strongestAspect;

  if (
    !aspect?.planets?.length ||
    !aspect.aspect
  ) {
    return "";
  }

  const pair =
    aspect.planets
      .map(
        planet =>
          CAREER_PLANET_LABELS[planet] ??
          planet
      )
      .join("–");

  const aspectName =
    aspect.aspect.toLowerCase();

  if (aspectName === "square") {
    return chooseVariation(
      [
        `The broader professional climate carries some friction through the ${pair} square, so patience can prevent temporary pressure from becoming a larger issue.`,
        `A ${pair} square adds some professional pressure today, making flexibility more useful than forcing an immediate result.`
      ],
      `${seed}:career:weather:square`
    );
  }

  if (
    aspectName === "trine" ||
    aspectName === "sextile"
  ) {
    return chooseVariation(
      [
        `The broader professional climate is helped by the ${pair} ${aspectName}, supporting constructive movement.`,
        `A ${pair} ${aspectName} adds a constructive undertone to professional matters today.`
      ],
      `${seed}:career:weather:${aspectName}`
    );
  }

  if (aspectName === "opposition") {
    return chooseVariation(
      [
        `The ${pair} opposition highlights a need to balance competing professional priorities.`,
        `A ${pair} opposition makes balance especially useful in the broader professional climate.`
      ],
      `${seed}:career:weather:opposition`
    );
  }

  if (aspectName === "conjunction") {
    return chooseVariation(
      [
        `The ${pair} conjunction makes professional themes especially noticeable today.`,
        `A ${pair} conjunction intensifies the broader professional atmosphere.`
      ],
      `${seed}:career:weather:conjunction`
    );
  }

  return "";
}

/*
 * -------------------------------------------------------
 * DIMENSION-AWARE GUIDANCE
 * -------------------------------------------------------
 *
 * The practical closing follows the strongest dimension,
 * preventing the same generic sentence from appearing
 * across many signs.
 * -------------------------------------------------------
 */

const CAREER_GUIDANCE = {

  professionalDrive: [
    "Put your strongest energy behind one clear priority instead of scattering effort across too many tasks.",
    "Use today's motivation deliberately; focused effort will carry further than constant activity.",
    "Let ambition move one important task forward rather than trying to solve everything at once."
  ],

  careerDirection: [
    "Use today's momentum to clarify which priorities genuinely deserve your attention.",
    "Keep longer-term direction in view when choosing between competing professional demands.",
    "A clear priority can make the next professional step easier to recognize."
  ],

  workPerformance: [
    "Focus on execution and finish important work before taking on additional commitments.",
    "Reliable results matter more than maximum activity today, so give important tasks your full attention.",
    "Protect the quality of your work by keeping the workload realistic and organized."
  ],

  recognition: [
    "Let measurable results strengthen your professional visibility rather than trying to force recognition.",
    "Allow consistent work to build your reputation while keeping external acknowledgment in perspective.",
    "Professional credibility grows more reliably when confidence is supported by tangible results."
  ],

  growth: [
    "Choose development that supports your longer-term direction rather than expanding simply for the sake of expansion.",
    "Use opportunities to build skills and experience gradually instead of expecting immediate results.",
    "A thoughtful investment in growth today can strengthen your professional position over time."
  ],

  authority: [
    "Take responsibility where your judgment can make a practical difference, without turning leadership into control.",
    "Use authority to create clarity and progress rather than to manage every surrounding detail.",
    "Lead through accountability and sound judgment, especially where professional expectations are high."
  ],

  opportunity: [
    "Choose the opening that best supports your longer-term direction, then follow through consistently.",
    "Stay open to useful possibilities while checking which ones have genuine practical value.",
    "Turn a promising opening into progress by combining timely initiative with careful judgment."
  ]
};

function careerGuidanceSentence(career, seed) {
  const strongestDimension =
    career.strongestDimension?.dimension;

  return chooseVariation(
    CAREER_GUIDANCE[strongestDimension] ??
    CAREER_GUIDANCE.professionalDrive,
    `${seed}:career:guidance:${strongestDimension ?? "professionalDrive"}`
  );
}

/*
 * -------------------------------------------------------
 * SEMANTIC DUPLICATE PROTECTION
 * -------------------------------------------------------
 *
 * Different sentences can express the same idea with
 * different wording. Career prose should not repeat the
 * same concept merely because the strings differ.
 * -------------------------------------------------------
 */

const CAREER_CONCEPT_GROUPS = [
  [
    "opportunity",
    "opportunities",
    "opening",
    "openings",
    "possibility",
    "possibilities",
    "potential"
  ],

  [
    "growth",
    "develop",
    "development",
    "advancement",
    "expand",
    "expansion",
    "skills",
    "experience"
  ],

  [
    "direction",
    "priorities",
    "priority",
    "path",
    "focus",
    "longer-term"
  ],

  [
    "initiative",
    "motivation",
    "drive",
    "momentum",
    "action",
    "effort",
    "ambition"
  ],

  [
    "execution",
    "work",
    "productivity",
    "results",
    "performance",
    "complete",
    "finish"
  ],

  [
    "recognition",
    "visibility",
    "acknowledgment",
    "acknowledgement",
    "reputation",
    "credibility"
  ],

  [
    "leadership",
    "authority",
    "responsibility",
    "control",
    "accountability"
  ],

  [
    "discipline",
    "structure",
    "consistency",
    "organized",
    "organization",
    "planning"
  ],

  [
    "patience",
    "pressure",
    "restraint",
    "careful",
    "caution",
    "flexibility"
  ],

  [
    "communication",
    "communication",
    "clarity",
    "information",
    "wording",
    "conversation"
  ],

  [
    "change",
    "changing",
    "innovation",
    "innovative",
    "adapt",
    "adaptable",
    "transformation"
  ]
];

function normalizeCareerProse(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function careerConceptGroups(value) {
  const text =
    normalizeCareerProse(value);

  const groups =
    new Set();

  for (let i = 0; i < CAREER_CONCEPT_GROUPS.length; i++) {
    if (
      CAREER_CONCEPT_GROUPS[i].some(
        phrase => text.includes(phrase)
      )
    ) {
      groups.add(i);
    }
  }

  return groups;
}

function careerSemanticOverlap(first, second) {
  if (!first || !second) {
    return 0;
  }

  const firstText =
    normalizeCareerProse(first);

  const secondText =
    normalizeCareerProse(second);

  if (firstText === secondText) {
    return 1;
  }

  const firstGroups =
    careerConceptGroups(firstText);

  const secondGroups =
    careerConceptGroups(secondText);

  if (
    firstGroups.size === 0 ||
    secondGroups.size === 0
  ) {
    return 0;
  }

  let shared = 0;

  for (const group of firstGroups) {
    if (secondGroups.has(group)) {
      shared++;
    }
  }

  const smaller =
    Math.min(
      firstGroups.size,
      secondGroups.size
    );

  return smaller > 0
    ? shared / smaller
    : 0;
}

function careerAddsDistinctIdea(
  sentence,
  existingParts
) {
  if (!sentence) {
    return false;
  }

  for (const existing of existingParts) {
    if (
      careerSemanticOverlap(
        existing,
        sentence
      ) >= 0.90
    ) {
      return false;
    }
  }

  return true;
}

/*
 * Add a sentence only when it contributes a genuinely
 * different concept.
 */
function addCareerPart(
  parts,
  sentence
) {
  if (!sentence) {
    return;
  }

  if (
    careerAddsDistinctIdea(
      sentence,
      parts
    )
  ) {
    parts.push(sentence);
  }
}

/*
 * -------------------------------------------------------
 * DIMENSION-PAIR PROSE
 * -------------------------------------------------------
 *
 * These combinations connect the two strongest Career
 * dimensions so the reading feels composed rather than
 * assembled from unrelated sentences.
 * -------------------------------------------------------
 */

const CAREER_DIMENSION_PAIR_PROSE = {

  "opportunity|growth": [
    "A useful opening can become more valuable when it also supports genuine professional development.",
    "The strongest possibilities are those that offer both immediate potential and room to grow."
  ],

  "opportunity|careerDirection": [
    "The most useful opening is likely to be the one that supports where you ultimately want your career to go.",
    "Choose possibilities that fit your broader professional direction rather than pursuing every available option."
  ],

  "opportunity|recognition": [
    "An opportunity can also improve professional visibility when your contribution is clear and measurable.",
    "A worthwhile opening may create visibility as well as progress, particularly when results are easy to demonstrate."
  ],

  "opportunity|professionalDrive": [
    "Turning possibility into progress will depend on timely initiative rather than waiting for perfect certainty.",
    "The value of an opening increases when you are willing to take practical action on it."
  ],

  "opportunity|workPerformance": [
    "A promising opening becomes more useful when strong execution can turn it into a measurable result.",
    "Practical follow-through will matter as much as recognizing the opportunity itself."
  ],

  "opportunity|authority": [
    "An emerging opportunity may also ask you to take greater responsibility for the outcome.",
    "A useful opening can become more significant when you are prepared to take ownership of what follows."
  ],

  "growth|careerDirection": [
    "Development is most useful when it strengthens the professional direction you actually want to pursue.",
    "Choose growth that builds toward a meaningful career path rather than expanding without a clear purpose."
  ],

  "growth|professionalDrive": [
    "Ambition can become productive growth when your effort is directed toward development with lasting value.",
    "Use your motivation to build something that strengthens your professional position over time."
  ],

  "growth|workPerformance": [
    "Development will be more valuable when it improves the quality of your everyday execution.",
    "Professional growth can be strengthened by turning new skills into reliable results."
  ],

  "growth|recognition": [
    "Development can strengthen professional visibility when new skills are translated into tangible results.",
    "Growth has greater professional value when it also builds credibility and recognition."
  ],

  "growth|authority": [
    "Professional development may also increase the responsibility you are ready to take on.",
    "Growth becomes more meaningful when it prepares you for greater responsibility and leadership."
  ],

  "careerDirection|professionalDrive": [
    "Clear priorities can give your motivation a more effective direction.",
    "Your drive will be most useful when it serves a clearly chosen professional priority."
  ],

  "careerDirection|workPerformance": [
    "Clear priorities can make execution more efficient and reduce wasted effort.",
    "A well-defined direction can help you decide which work deserves completion first."
  ],

  "careerDirection|recognition": [
    "A clear professional direction can make it easier for others to understand the value of your contribution.",
    "Visibility is more useful when it supports the professional path you actually want to build."
  ],

  "careerDirection|authority": [
    "Clear direction can make responsibility easier to exercise without unnecessary control.",
    "Leadership is stronger when your decisions are anchored in a clear professional purpose."
  ],

  "professionalDrive|workPerformance": [
    "Strong motivation is most productive when it is converted into focused execution.",
    "Direct your energy toward completing meaningful work rather than simply increasing activity."
  ],

  "professionalDrive|recognition": [
    "Visible initiative can strengthen recognition when effort produces results others can clearly see.",
    "Professional visibility grows more naturally when ambition is backed by demonstrable work."
  ],

  "professionalDrive|authority": [
    "Initiative can strengthen leadership when action is matched by responsibility.",
    "Use your drive to take ownership rather than trying to control every outcome."
  ],

  "workPerformance|recognition": [
    "Reliable execution can do more for professional visibility than trying to attract attention directly.",
    "Strong results can strengthen credibility and make recognition more natural."
  ],

  "workPerformance|authority": [
    "Consistent execution can strengthen the authority that comes from being dependable.",
    "Taking responsibility for important work can reinforce both performance and professional standing."
  ],

  "recognition|authority": [
    "Recognition carries more weight when it is supported by responsible leadership.",
    "Professional visibility can strengthen when others see both your contribution and your willingness to take responsibility."
  ]
};

function careerDimensionPairSentence(
  first,
  second,
  seed
) {
  if (!first || !second) {
    return "";
  }

  const key =
    [first, second].sort().join("|");

  return chooseVariation(
    CAREER_DIMENSION_PAIR_PROSE[key],
    `${seed}:career:pair:${key}`
  );
}

/*
 * -------------------------------------------------------
 * PUBLIC API
 * -------------------------------------------------------
 */

/*
 * -------------------------------------------------------
 * MINIMUM-LENGTH FALLBACKS
 * -------------------------------------------------------
 *
 * Semantic filtering should prevent repetition, not make
 * a reader-facing horoscope too short. These deterministic
 * sentences are used only when filtering removes too much.
 */

const CAREER_MINIMUM_FALLBACKS = {
  Aries: "Choose the clearest professional target and put your initiative behind it.",
  Taurus: "Favor the option that offers tangible value and sustainable progress.",
  Gemini: "Narrow the field to the priority that offers the clearest practical value.",
  Cancer: "Protect a sustainable working rhythm while deciding where your effort matters most.",
  Leo: "Let visible results give your ambition a stronger professional foundation.",
  Virgo: "Keep standards high, but direct your attention toward the result that matters most.",
  Libra: "Balance cooperation with a clear decision about what deserves your professional commitment.",
  Scorpio: "Use selective effort and strategic patience to protect the progress that matters.",
  Sagittarius: "Keep the larger opportunity in view, but give the next practical step enough attention.",
  Capricorn: "Let disciplined execution and measurable results strengthen your professional position.",
  Aquarius: "Give new approaches a clear purpose so innovation can translate into useful progress.",
  Pisces: "Turn your strongest professional impression into one clear and practical next step."
};

function careerMinimumFallback(career, sunSign) {
  return CAREER_MINIMUM_FALLBACKS[sunSign] ||
    CAREER_MINIMUM_FALLBACKS.Pisces;
}

export function generateCareerProse({
  sunSign,
  career,
  aspectSignals = [],
  dateUTC = null,
} = {}) {
  if (
    !sunSign ||
    typeof sunSign !== "string"
  ) {
    throw new Error(
      "generateCareerProse requires a Sun sign."
    );
  }

  if (!career) {
    throw new Error(
      "generateCareerProse requires a Career interpretation."
    );
  }

  /*
   * Date is optional for the modular prose contract.
   *
   * When supplied, it participates in the deterministic
   * seed. When omitted, the seed is derived from the
   * structured Career interpretation instead of new Date(),
   * so repeated calls produce exactly the same prose.
   */
  let dateKey = "";

  if (dateUTC !== null) {
    if (
      !(dateUTC instanceof Date) ||
      Number.isNaN(dateUTC.getTime())
    ) {
      throw new Error(
        "generateCareerProse requires a valid Date when dateUTC is supplied."
      );
    }

    dateKey =
      dateUTC.toISOString();
  }

  const interpretationKey =
    [
      career.engineVersion ?? "",
      career.combinedScore ?? "",
      career.strongestDimension?.dimension ?? "",
      career.strongestPlanet?.planet ?? "",
      career.careerDynamic?.type ?? "",
    ].join(":");

  const seed =
    `${sunSign}:${dateKey}:${interpretationKey}`;

  const parts = [];

  /*
   * 1. Career Dynamic / opening
   */
  parts.push(
    careerOpening(
      career,
      seed
    )
  );

  addCareerPart(
    parts,
    careerSignContext(
      sunSign,
      career.careerDynamic?.type ?? "mixed",
      seed
    )
  );

  /*
   * 2. Strongest career dimension
   */
  parts.push(
    careerStrongestAreaSentence(
      career,
      seed
    )
  );

  /*
   * 3. Two strongest dimensions
   *
   * The engine uses all seven dimensions, but prose
   * selects the two most meaningful for readability.
   */
  const rankedDimensions =
    CAREER_DIMENSION_ORDER
      .map(name => ({
        name,
        dimension:
          career.dimensions?.[name]
      }))
      .filter(item =>
        item.dimension &&
        Number.isFinite(
          item.dimension.score
        )
      )
      .sort(
        (a, b) =>
          Math.abs(b.dimension.score) -
          Math.abs(a.dimension.score)
      );

  const strongestDimension =
    career.strongestDimension?.dimension;

  const selectedDimensions =
    rankedDimensions
      .filter(
        item =>
          item.name !==
          strongestDimension
      )
      .slice(0, 1);

  /*
   * 4. Connect the strongest dimension with the
   *    strongest secondary dimension where a dedicated
   *    pair sentence exists.
   */
  const secondaryDimension =
    selectedDimensions[0];

  const pairSentence =
    careerDimensionPairSentence(
      strongestDimension,
      secondaryDimension?.name,
      seed
    );

  if (pairSentence) {
    addCareerPart(
      parts,
      pairSentence
    );
  } else if (secondaryDimension) {
    const secondarySentence =
      careerDimensionSentence(
        secondaryDimension.name,
        secondaryDimension.dimension,
        `${seed}:secondary`
      );

    addCareerPart(
      parts,
      secondarySentence
    );
  }

  /*
   * 5. Strongest planetary influence
   */
  const planetSentence =
    careerPlanetSentence(
      career,
      seed
    );

  addCareerPart(
    parts,
    planetSentence
  );

  /*
   * 6. Shared Career Weather
   */
  const weatherSentence =
    careerWeatherSentence(
      career,
      seed
    );

  addCareerPart(
    parts,
    weatherSentence
  );

  /*
   * 7. Dimension-aware practical guidance
   */
  const guidanceSentence =
    careerGuidanceSentence(
      career,
      seed
    );

  addCareerPart(
    parts,
    guidanceSentence
  );

  /*
   * Final exact-duplicate protection remains as a final
   * safety net after semantic filtering.
   */
  const finalParts = [
    ...new Set(
      parts.filter(Boolean)
    )
  ];

  /*
   * Reader-facing Career Prose should contain enough
   * interpretation to feel like a complete daily reading.
   * Add deterministic practical sentences only when the
   * semantic filter has made the result too short.
   */
  let fallbackIndex = 0;

  while (finalParts.length < 4 && fallbackIndex < 7) {
    const fallback = careerMinimumFallback(
      career,
      sunSign
    );

    if (
      fallback &&
      !finalParts.includes(fallback)
    ) {
      finalParts.push(fallback);
    }

    // Always advance the guard counter. Without this increment,
    // a sign-specific fallback that is already present can cause
    // an infinite loop in the browser.
    fallbackIndex += 1;

    // The sign-specific fallback is intentionally tried only once.
    // Remaining slots are filled by deterministic generic guidance.
    if (fallbackIndex === 1 && finalParts.length < 4) {
      const additionalFallbacks = [
        "Keep the next move specific so effort can translate into measurable professional progress.",
        "Let practical judgment determine which developing possibility deserves your attention first.",
        "A clear priority will help turn today's career pattern into useful action."
      ];

      for (const candidate of additionalFallbacks) {
        if (finalParts.length >= 4) break;
        if (!finalParts.includes(candidate)) {
          finalParts.push(candidate);
        }
      }
    }
  }

  return finalParts.join(" ");
}

/*
 * Modular-section alias.
 */
export const interpretCareerProse =
  generateCareerProse;


  