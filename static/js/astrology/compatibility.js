/**
 * astrology/compatibility.js
 * A transparent, rule-based compatibility score between two sun signs
 * (extendable later to full charts using moon/Venus/Mars once two full
 * birth charts are available). Every component of the score is exposed,
 * not just a single opaque number — this is explicitly an AstroLight
 * scoring model for entertainment/reflection, not a scientific claim,
 * and every page displaying it should say so.
 */

import { ZODIAC_SIGNS } from "./zodiac.js";

const ELEMENTS = {
  Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
  Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
  Gemini: "Air", Libra: "Air", Aquarius: "Air",
  Cancer: "Water", Scorpio: "Water", Pisces: "Water",
};

const MODALITIES = {
  Aries: "Cardinal", Cancer: "Cardinal", Libra: "Cardinal", Capricorn: "Cardinal",
  Taurus: "Fixed", Leo: "Fixed", Scorpio: "Fixed", Aquarius: "Fixed",
  Gemini: "Mutable", Virgo: "Mutable", Sagittarius: "Mutable", Pisces: "Mutable",
};

// Compatible/neutral/challenging pairings by element (a simple, disclosed model)
const ELEMENT_COMPATIBILITY = {
  "Fire-Fire": 18, "Earth-Earth": 18, "Air-Air": 18, "Water-Water": 18,
  "Fire-Air": 16, "Air-Fire": 16,
  "Earth-Water": 16, "Water-Earth": 16,
  "Fire-Earth": 10, "Earth-Fire": 10,
  "Fire-Water": 8, "Water-Fire": 8,
  "Earth-Air": 8, "Air-Earth": 8,
  "Air-Water": 10, "Water-Air": 10,
};

const MODALITY_COMPATIBILITY = {
  "Cardinal-Cardinal": 10, "Fixed-Fixed": 10, "Mutable-Mutable": 14,
  "Cardinal-Fixed": 12, "Fixed-Cardinal": 12,
  "Cardinal-Mutable": 12, "Mutable-Cardinal": 12,
  "Fixed-Mutable": 10, "Mutable-Fixed": 10,
};

function signDistance(signA, signB) {
  const a = ZODIAC_SIGNS.indexOf(signA);
  const b = ZODIAC_SIGNS.indexOf(signB);
  let d = Math.abs(a - b);
  return Math.min(d, 12 - d); // shortest distance around the wheel, 0-6
}

// Classical "ruling planet relationship" proxy, scored by wheel distance
const DISTANCE_SCORE = { 0: 20, 1: 12, 2: 14, 3: 8, 4: 16, 5: 10, 6: 6 };

export function scoreCompatibility(signA, signB) {
  const elemKey = `${ELEMENTS[signA]}-${ELEMENTS[signB]}`;
  const modKey = `${MODALITIES[signA]}-${MODALITIES[signB]}`;
  const dist = signDistance(signA, signB);

  const elementScore = ELEMENT_COMPATIBILITY[elemKey] ?? 12;
  const modalityScore = MODALITY_COMPATIBILITY[modKey] ?? 10;
  const planetaryScore = DISTANCE_SCORE[dist] ?? 10;

  const total = elementScore + modalityScore + planetaryScore;
  // Maximum possible component total in this v1 model: 18 + 14 + 20 = 52.
  const scaled = Math.round((total / 52) * 100);

  return {
    total: scaled,
    breakdown: [
      { label: "Element compatibility", points: elementScore, outOf: 18 },
      { label: "Modality compatibility", points: modalityScore, outOf: 14 },
      { label: "Sign-wheel relationship", points: planetaryScore, outOf: 20 },
    ],
    disclaimer: "AstroLight educational scoring model — a structured reflection tool, not a scientific or predictive claim.",
  };
}
