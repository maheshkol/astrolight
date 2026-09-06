/**
 * astrology/compatibility-prose.js
 * Deterministic interpretation engine for AstroLight Sun-sign compatibility.
 *
 * This module interprets the existing compatibility scoring model.
 * It does not calculate or alter the compatibility score.
 *
 * Western/Tropical Sun-sign scope only.
 * No randomization.
 * No scientific or predictive claims.
 */

export const COMPATIBILITY_PROSE_VERSION = "1.0.0";

const ELEMENTS = {
  Aries: "Fire",
  Leo: "Fire",
  Sagittarius: "Fire",

  Taurus: "Earth",
  Virgo: "Earth",
  Capricorn: "Earth",

  Gemini: "Air",
  Libra: "Air",
  Aquarius: "Air",

  Cancer: "Water",
  Scorpio: "Water",
  Pisces: "Water",
};

const MODALITIES = {
  Aries: "Cardinal",
  Cancer: "Cardinal",
  Libra: "Cardinal",
  Capricorn: "Cardinal",

  Taurus: "Fixed",
  Leo: "Fixed",
  Scorpio: "Fixed",
  Aquarius: "Fixed",

  Gemini: "Mutable",
  Virgo: "Mutable",
  Sagittarius: "Mutable",
  Pisces: "Mutable",
};

const SIGN_INDEX = {
  Aries: 0,
  Taurus: 1,
  Gemini: 2,
  Cancer: 3,
  Leo: 4,
  Virgo: 5,
  Libra: 6,
  Scorpio: 7,
  Sagittarius: 8,
  Capricorn: 9,
  Aquarius: 10,
  Pisces: 11,
};

const ELEMENT_PAIR_TONE = {
  "Fire-Fire": "energized",
  "Earth-Earth": "grounded",
  "Air-Air": "mentally active",
  "Water-Water": "emotionally receptive",

  "Fire-Air": "dynamic",
  "Air-Fire": "dynamic",

  "Earth-Water": "complementary",
  "Water-Earth": "complementary",

  "Fire-Earth": "practical but contrasting",
  "Earth-Fire": "practical but contrasting",

  "Fire-Water": "contrasting",
  "Water-Fire": "contrasting",

  "Earth-Air": "contrasting",
  "Air-Earth": "contrasting",

  "Air-Water": "different in style",
  "Water-Air": "different in style",
};

const ELEMENT_INTERPRETATION = {
  "Fire-Fire":
    "Both signs bring a Fire emphasis, which can support enthusiasm, initiative and a strong desire to act. The same intensity can also amplify impatience when both people want to lead at once.",

  "Earth-Earth":
    "Both signs bring an Earth emphasis, supporting practicality, consistency and attention to tangible results. The relationship can become overly fixed if neither person wants to adjust an established approach.",

  "Air-Air":
    "Both signs bring an Air emphasis, supporting conversation, ideas and intellectual exchange. The connection benefits from turning discussion into clear decisions when too much analysis becomes distracting.",

  "Water-Water":
    "Both signs bring a Water emphasis, which can support emotional awareness, sensitivity and intuitive understanding. Clear communication remains important because feelings may otherwise be assumed rather than expressed.",

  "Fire-Air":
    "Fire and Air can create an active exchange between initiative and ideas. Air can stimulate Fire's enthusiasm, while Fire can turn Air's concepts into action.",

  "Air-Fire":
    "Air and Fire can create an active exchange between ideas and initiative. Air can broaden possibilities, while Fire can provide momentum and direction.",

  "Earth-Water":
    "Earth and Water can complement one another through practicality and emotional depth. One side may provide stability while the other adds sensitivity and responsiveness.",

  "Water-Earth":
    "Water and Earth can complement one another through emotional depth and practicality. One side may bring sensitivity while the other provides steadiness and structure.",

  "Fire-Earth":
    "Fire and Earth approach life from different starting points: one emphasizes initiative and momentum, while the other emphasizes practicality and reliability. The difference can be useful when neither side tries to force the other's pace.",

  "Earth-Fire":
    "Earth and Fire approach life from different starting points: one emphasizes practicality and reliability, while the other emphasizes initiative and momentum. The difference can be useful when both approaches are given room.",

  "Fire-Water":
    "Fire and Water operate through contrasting styles of expression, with Fire tending toward direct action and Water toward emotional responsiveness. Understanding those different rhythms can reduce unnecessary friction.",

  "Water-Fire":
    "Water and Fire operate through contrasting styles of expression, with Water tending toward emotional responsiveness and Fire toward direct action. The relationship benefits when both rhythms are respected.",

  "Earth-Air":
    "Earth and Air can differ between practical focus and conceptual thinking. The pairing can work constructively when ideas are given practical form without dismissing exploration.",

  "Air-Earth":
    "Air and Earth can differ between conceptual thinking and practical focus. The pairing can work constructively when practical needs and new ideas are allowed to inform one another.",

  "Air-Water":
    "Air and Water often process experience differently, with Air emphasizing thought and Water emphasizing feeling. The relationship benefits from making room for both explanation and emotional acknowledgment.",

  "Water-Air":
    "Water and Air often process experience differently, with Water emphasizing feeling and Air emphasizing thought. The relationship benefits when emotional experience and rational discussion are both given space.",
};

const MODALITY_INTERPRETATION = {
  "Cardinal-Cardinal":
    "Both signs are Cardinal, so the relationship can contain strong initiative and a desire to set things in motion. Cooperation improves when leadership is shared rather than competed for.",

  "Fixed-Fixed":
    "Both signs are Fixed, supporting persistence and loyalty once a direction has been chosen. The main adjustment is flexibility: disagreements can last longer when both people hold their position.",

  "Mutable-Mutable":
    "Both signs are Mutable, creating adaptability and openness to changing circumstances. The relationship may benefit from deliberate follow-through when too many options remain open.",

  "Cardinal-Fixed":
    "Cardinal energy tends to initiate while Fixed energy tends to maintain. This can create a useful division between starting and sustaining, provided neither person interprets the difference as resistance or impatience.",

  "Fixed-Cardinal":
    "Fixed energy tends to maintain while Cardinal energy tends to initiate. The pairing can work well when persistence and forward movement are treated as complementary rather than competing priorities.",

  "Cardinal-Mutable":
    "Cardinal energy tends to initiate while Mutable energy tends to adapt. This can create momentum and flexibility, although expectations may need clarification when plans change.",

  "Mutable-Cardinal":
    "Mutable energy tends to adapt while Cardinal energy tends to initiate. The pairing can balance flexibility with momentum when both people remain clear about priorities.",

  "Fixed-Mutable":
    "Fixed energy tends to preserve direction while Mutable energy tends to adjust. This can provide both continuity and flexibility, but each side may need to respect the other's pace of change.",

  "Mutable-Fixed":
    "Mutable energy tends to adjust while Fixed energy tends to preserve direction. The relationship can balance flexibility and stability when neither side treats its preferred pace as the only valid one.",
};

const DISTANCE_TONE = {
  0: "concentrated",
  1: "adjacent",
  2: "cooperative",
  3: "dynamic",
  4: "harmonizing",
  5: "adjustment-oriented",
  6: "polarized",
};

const DISTANCE_INTERPRETATION = {
  0:
    "The signs occupy the same position on the zodiac wheel, so this model treats their sign relationship as concentrated around similar sign themes.",

  1:
    "The signs are adjacent on the zodiac wheel. This creates a close but less directly aligned relationship in the model, with differences that may require conscious adjustment.",

  2:
    "The signs are two steps apart on the zodiac wheel. This model treats the relationship as relatively cooperative, with differences that can complement one another.",

  3:
    "The signs are three steps apart on the zodiac wheel. This creates a more dynamic relationship in the model, where differences can become either productive or friction-producing.",

  4:
    "The signs are four steps apart on the zodiac wheel. This model treats the distance as comparatively harmonizing, allowing the two signs to approach one another through compatible patterns.",

  5:
    "The signs are five steps apart on the zodiac wheel. The relationship can require more adjustment because the two signs may approach priorities from noticeably different angles.",

  6:
    "The signs are opposite on the zodiac wheel. This model treats the relationship as polarized: the two signs can highlight complementary qualities while also exposing clear differences in approach.",
};

function signDistance(signA, signB) {
  const a = SIGN_INDEX[signA];
  const b = SIGN_INDEX[signB];

  if (a === undefined || b === undefined) return null;

  const difference = Math.abs(a - b);
  return Math.min(difference, 12 - difference);
}

function scoreTone(score, maximum) {
  const ratio = score / maximum;

  if (ratio >= 0.85) return "strong";
  if (ratio >= 0.65) return "supportive";
  if (ratio >= 0.50) return "mixed";
  if (ratio >= 0.35) return "challenging";

  return "more challenging";
}

function overallTone(score) {
  if (score >= 80) return "strong";
  if (score >= 65) return "supportive";
  if (score >= 50) return "mixed";
  if (score >= 35) return "challenging";
  return "more challenging";
}

function buildOverview(signA, signB, score, distance) {
  const tone = overallTone(score.total);
  const element = ELEMENTS[signA];
  const elementB = ELEMENTS[signB];
  const modality = MODALITIES[signA];
  const modalityB = MODALITIES[signB];

  let opening;

  if (tone === "strong") {
    opening =
      "This combination receives a strong result in AstroLight's educational scoring model.";
  } else if (tone === "supportive") {
    opening =
      "This combination receives a generally supportive result in AstroLight's educational scoring model.";
  } else if (tone === "mixed") {
    opening =
      "This combination produces a mixed result in AstroLight's educational scoring model, with some components working more easily than others.";
  } else if (tone === "challenging") {
    opening =
      "This combination produces a more challenging result in AstroLight's educational scoring model, pointing to areas that may require greater adjustment.";
  } else {
    opening =
      "This combination receives a lower result in AstroLight's educational scoring model. The score highlights areas of difference rather than predicting relationship success or failure.";
  }

  return `${opening} ${signA} brings ${element} and ${modality} qualities, while ${signB} brings ${elementB} and ${modalityB} qualities. The ${distance}-step sign-wheel distance adds another layer to how these differences and similarities are interpreted.`;
}

function buildThemes(signA, signB, distance) {
  const elementA = ELEMENTS[signA];
  const elementB = ELEMENTS[signB];
  const modalityA = MODALITIES[signA];
  const modalityB = MODALITIES[signB];

  const themes = [];

  if (elementA === elementB) {
    themes.push(`shared ${elementA} emphasis`);
  } else {
    themes.push(`${elementA}-${elementB} elemental contrast`);
  }

  if (modalityA === modalityB) {
    themes.push(`shared ${modalityA} modality`);
  } else {
    themes.push(`${modalityA}-${modalityB} pacing`);
  }

  if (distance === 6) {
    themes.push("opposite sign-wheel perspectives");
  } else if (distance === 4) {
    themes.push("harmonizing sign-wheel distance");
  } else if (distance === 3) {
    themes.push("dynamic sign-wheel interaction");
  } else if (distance === 2) {
    themes.push("cooperative sign-wheel distance");
  } else {
    themes.push(`${DISTANCE_TONE[distance]} sign-wheel distance`);
  }

  return themes;
}

export function generateCompatibilityProse(signA, signB, scoreResult) {
  if (!ELEMENTS[signA] || !ELEMENTS[signB]) {
    throw new Error(`Unknown compatibility sign: ${signA} or ${signB}`);
  }

  if (signA === signB) {
    throw new Error("Compatibility prose requires two different Sun signs.");
  }

  if (!scoreResult || !Array.isArray(scoreResult.breakdown)) {
    throw new Error("A valid scoreCompatibility() result is required.");
  }

  const distance = signDistance(signA, signB);

  const elementScore = scoreResult.breakdown.find(
    (item) => item.label === "Element compatibility"
  );

  const modalityScore = scoreResult.breakdown.find(
    (item) => item.label === "Modality compatibility"
  );

  const distanceScore = scoreResult.breakdown.find(
    (item) => item.label === "Sign-wheel distance"
  );

  if (!elementScore || !modalityScore || !distanceScore) {
    throw new Error("Compatibility score breakdown is incomplete.");
  }

  const overall = {
    score: scoreResult.total,
    tone: overallTone(scoreResult.total),
  };

  const element = {
    score: elementScore.points,
    outOf: elementScore.outOf,
    tone: scoreTone(elementScore.points, elementScore.outOf),
    text:
      ELEMENT_INTERPRETATION[
        `${ELEMENTS[signA]}-${ELEMENTS[signB]}`
      ],
    relationship:
      ELEMENT_PAIR_TONE[
        `${ELEMENTS[signA]}-${ELEMENTS[signB]}`
      ],
  };

  const modality = {
    score: modalityScore.points,
    outOf: modalityScore.outOf,
    tone: scoreTone(modalityScore.points, modalityScore.outOf),
    text:
      MODALITY_INTERPRETATION[
        `${MODALITIES[signA]}-${MODALITIES[signB]}`
      ],
  };

  const distanceSection = {
    distance,
    score: distanceScore.points,
    outOf: distanceScore.outOf,
    tone: scoreTone(distanceScore.points, distanceScore.outOf),
    relationship: DISTANCE_TONE[distance],
    text: DISTANCE_INTERPRETATION[distance],
  };

  return {
    version: COMPATIBILITY_PROSE_VERSION,
    signA,
    signB,
    overall,
    sections: {
      overview: buildOverview(signA, signB, scoreResult, distance),
      element,
      modality,
      distance: distanceSection,
    },
    themes: buildThemes(signA, signB, distance),
    methodology: {
      scoringEngine: "scoreCompatibility",
      components: [
        "element",
        "modality",
        "sign-wheel distance",
      ],
      randomization: false,
      scientificClaim: false,
    },
  };
}

export const interpretCompatibility = generateCompatibilityProse;

