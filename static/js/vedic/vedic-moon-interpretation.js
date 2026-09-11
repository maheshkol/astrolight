/*
 * AstroLight Vedic Moon Interpretation
 *
 * Version: 1.0.0
 *
 * Purpose:
 * Traditional Jyotisha interpretation for the
 * calculated Vedic Moon Rashi, Nakshatra and Pada.
 *
 * Important:
 * This module performs NO astronomical calculations.
 * It only maps already-calculated Vedic positions
 * to traditional interpretive text.
 *
 * Calculation remains in:
 *   ayanamsha.js
 *   rashi.js
 *   nakshatra.js
 */

export const VEDIC_MOON_INTERPRETATION_VERSION = "1.0.0";


const RASHI_INTERPRETATIONS = {

  Aries: {
    theme: "initiative, independence and direct emotional expression",
    strengths: "courage, decisiveness and willingness to act",
    mindful: "impulsiveness, impatience and reactive responses"
  },

  Taurus: {
    theme: "stability, comfort and emotional steadiness",
    strengths: "patience, persistence and practical judgment",
    mindful: "attachment to familiar patterns and resistance to change"
  },

  Gemini: {
    theme: "curiosity, communication and mental activity",
    strengths: "adaptability, observation and expressive ability",
    mindful: "restlessness, overthinking and scattered attention"
  },

  Cancer: {
    theme: "nurturing, sensitivity and emotional security",
    strengths: "empathy, care and strong emotional awareness",
    mindful: "mood fluctuations, defensiveness and excessive attachment"
  },

  Leo: {
    theme: "self-expression, dignity and creative confidence",
    strengths: "warmth, generosity and leadership",
    mindful: "pride, sensitivity to recognition and fixed expectations"
  },

  Virgo: {
    theme: "analysis, practical service and refinement",
    strengths: "discernment, organization and attention to detail",
    mindful: "excessive criticism, worry and perfectionism"
  },

  Libra: {
    theme: "harmony, relationship and balance",
    strengths: "diplomacy, cooperation and appreciation of fairness",
    mindful: "indecision, conflict avoidance and dependence on external balance"
  },

  Scorpio: {
    theme: "depth, intensity and emotional transformation",
    strengths: "determination, insight and emotional resilience",
    mindful: "suspicion, emotional extremes and difficulty releasing old patterns"
  },

  Sagittarius: {
    theme: "meaning, exploration and philosophical perspective",
    strengths: "optimism, openness and enthusiasm for learning",
    mindful: "restlessness, exaggeration and overlooking practical details"
  },

  Capricorn: {
    theme: "responsibility, structure and emotional self-control",
    strengths: "discipline, persistence and reliability",
    mindful: "excessive reserve, pressure and carrying responsibilities alone"
  },

  Aquarius: {
    theme: "independence, ideas and broader social perspective",
    strengths: "original thinking, objectivity and openness to new ideas",
    mindful: "emotional detachment, unpredictability and over-intellectualizing feelings"
  },

  Pisces: {
    theme: "imagination, sensitivity and emotional receptivity",
    strengths: "compassion, intuition and creative perception",
    mindful: "over-sensitivity, unclear boundaries and escapist tendencies"
  }

};


const NAKSHATRA_INTERPRETATIONS = {

  Ashwini: {
    theme: "beginnings, movement, healing and swift initiative",
    strength: "quick response and readiness to start"
  },

  Bharani: {
    theme: "responsibility, containment and transformation",
    strength: "capacity to carry responsibilities through difficult transitions"
  },

  Krittika: {
    theme: "discernment, purification and decisive action",
    strength: "ability to separate what is useful from what is not"
  },

  Rohini: {
    theme: "growth, beauty, nourishment and creativity",
    strength: "ability to cultivate stability and tangible results"
  },

  Mrigashira: {
    theme: "search, curiosity and exploration",
    strength: "persistent questioning and discovery"
  },

  Ardra: {
    theme: "intensity, inquiry, transformation and emotional clearing",
    strength: "ability to investigate difficult subjects and move through change"
  },

  Punarvasu: {
    theme: "renewal, restoration and return to balance",
    strength: "resilience and ability to begin again"
  },

  Pushya: {
    theme: "nourishment, protection, learning and support",
    strength: "capacity to sustain people, ideas and responsibilities"
  },

  Ashlesha: {
    theme: "perception, psychological depth and subtle influence",
    strength: "strong observational and intuitive awareness"
  },

  Magha: {
    theme: "ancestry, dignity, tradition and authority",
    strength: "respect for heritage and responsibility toward lineage"
  },

  Purva_Phalguni: {
    theme: "creativity, enjoyment, relationships and generosity",
    strength: "warmth, artistic expression and appreciation of life"
  },

  Uttara_Phalguni: {
    theme: "commitment, agreements, friendship and responsibility",
    strength: "reliability in long-term relationships and obligations"
  },

  Hasta: {
    theme: "skill, craftsmanship, organization and practical ability",
    strength: "capacity to shape circumstances through skill and effort"
  },

  Chitra: {
    theme: "beauty, design, individuality and refinement",
    strength: "creative vision and appreciation of form"
  },

  Swati: {
    theme: "independence, movement and self-directed growth",
    strength: "adaptability and ability to develop independently"
  },

  Vishakha: {
    theme: "purpose, determination and focused achievement",
    strength: "persistence toward a chosen objective"
  },

  Anuradha: {
    theme: "friendship, devotion, cooperation and disciplined effort",
    strength: "loyalty and ability to build lasting connections"
  },

  Jyeshtha: {
    theme: "maturity, protection, responsibility and seniority",
    strength: "resourcefulness and capacity to protect what matters"
  },

  Mula: {
    theme: "roots, investigation, release and fundamental change",
    strength: "willingness to examine matters at their foundation"
  },

  Purva_Ashadha: {
    theme: "confidence, conviction and renewal",
    strength: "enthusiasm and persistence in support of beliefs"
  },

  Uttara_Ashadha: {
    theme: "enduring achievement, responsibility and integrity",
    strength: "determination to complete meaningful commitments"
  },

  Shravana: {
    theme: "listening, learning, communication and tradition",
    strength: "ability to learn through observation and careful listening"
  },

  Dhanishtha: {
    theme: "rhythm, achievement, resources and social participation",
    strength: "coordination, ambition and practical accomplishment"
  },

  Shatabhisha: {
    theme: "independence, inquiry, healing and hidden processes",
    strength: "capacity for objective investigation and self-reliance"
  },

  Purva_Bhadrapada: {
    theme: "ideals, intensity, transformation and conviction",
    strength: "strong commitment to principles and deeper inquiry"
  },

  Uttara_Bhadrapada: {
    theme: "depth, patience, stability and inner wisdom",
    strength: "calm persistence and capacity for sustained reflection"
  },

  Revati: {
    theme: "completion, protection, guidance and transition",
    strength: "compassionate guidance and ability to bring cycles to completion"
  }

};


const PADA_INTERPRETATIONS = {

  1: "The first Pada traditionally emphasizes initiative, direct expression and the active development of the Nakshatra's qualities.",

  2: "The second Pada traditionally emphasizes practical development, stability and the constructive expression of the Nakshatra's qualities.",

  3: "The third Pada traditionally emphasizes communication, learning and social or intellectual expression of the Nakshatra's qualities.",

  4: "The fourth Pada traditionally emphasizes emotional depth, receptivity and inward integration of the Nakshatra's qualities."

};


function normalizeKey(value) {

  return String(value || "")
    .trim()
    .replace(/\s+/g, "_");

}


export function interpretVedicMoon({
  rashi,
  nakshatra,
  pada
}) {

  if (!rashi || !nakshatra) {

    throw new Error(
      "Rashi and Nakshatra are required for Vedic Moon interpretation."
    );

  }


  const rashiName =
    typeof rashi === "string"
      ? rashi
      : rashi.name;


  const nakshatraName =
    typeof nakshatra === "string"
      ? nakshatra
      : nakshatra.name;


  const rashiData =
    RASHI_INTERPRETATIONS[rashiName];


  const nakshatraData =
    NAKSHATRA_INTERPRETATIONS[
      normalizeKey(nakshatraName)
    ];


  if (!rashiData) {

    throw new Error(
      `No traditional Rashi interpretation is available for "${rashiName}".`
    );

  }


  if (!nakshatraData) {

    throw new Error(
      `No traditional Nakshatra interpretation is available for "${nakshatraName}".`
    );

  }


  const padaNumber =
    Number(pada);


  return {

    version:
      VEDIC_MOON_INTERPRETATION_VERSION,

    rashi: {

      name:
        rashiName,

      theme:
        rashiData.theme,

      strengths:
        rashiData.strengths,

      mindful:
        rashiData.mindful

    },

    nakshatra: {

      name:
        nakshatraName,

      theme:
        nakshatraData.theme,

      strength:
        nakshatraData.strength

    },

    pada: {

      number:
        padaNumber,

      interpretation:
        PADA_INTERPRETATIONS[padaNumber] ||
        "The Pada adds a more specific traditional layer to the Nakshatra interpretation."

    },

    combinedSummary:
      `Traditionally, a ${rashiName} Moon is associated with ${rashiData.theme}. ${nakshatraName} adds themes of ${nakshatraData.theme}. The Pada provides an additional traditional layer of expression.`,

    disclaimer:
      "Traditional Jyotisha interpretation is presented for cultural and reflective purposes. It is not a scientific prediction or guarantee."

  };

}