import assert from "node:assert/strict";
import { generateHoroscopeProse } from "../static/js/horoscope/prose.js";

console.log("AstroLight horoscope prose validation");
console.log("====================================");

console.log("NOTE: prose.js requires a structured interpretation.");
console.log("The full daily-profile browser pipeline is validated separately.");

assert.equal(
  typeof generateHoroscopeProse,
  "function"
);

console.log("generateHoroscopeProse export: PASS");
console.log("====================================");
