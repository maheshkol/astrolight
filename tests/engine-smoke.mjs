import assert from "node:assert/strict";
import { toJulianDay } from "../static/js/astrology/julian-day.js";
import { signFromLongitude } from "../static/js/astrology/zodiac.js";
import { nakshatraFromSiderealLongitude } from "../static/js/astrology/nakshatra.js";
import { lahiriAyanamsa, toSidereal } from "../static/js/astrology/sidereal.js";
import { calculateAscendant, equalHouseCusps, housePlacement } from "../static/js/astrology/houses.js";
import { findAspects } from "../static/js/astrology/aspects.js";
import { scoreCompatibility } from "../static/js/astrology/compatibility.js";

assert.equal(signFromLongitude(0).sign, "Aries");
assert.equal(signFromLongitude(29.999).sign, "Aries");
assert.equal(signFromLongitude(30).sign, "Taurus");
assert.equal(signFromLongitude(359.999).sign, "Pisces");

const jd = toJulianDay(2000, 1, 1, 12, 0, 0);
assert.ok(Math.abs(jd - 2451545.0) < 1e-9);

const ash = nakshatraFromSiderealLongitude(0);
assert.equal(ash.name, "Ashwini");
assert.equal(ash.pada, 1);

const secondPada = nakshatraFromSiderealLongitude(3.4);
assert.equal(secondPada.pada, 2);

assert.ok(lahiriAyanamsa(2026) > 23);
assert.ok(toSidereal(30, 2026) >= 0 && toSidereal(30, 2026) < 360);

const asc = calculateAscendant(90, 18.5, 23.4);
assert.ok(asc >= 0 && asc < 360);
const cusps = equalHouseCusps(asc);
assert.equal(cusps.length, 12);
assert.equal(housePlacement(asc, cusps), 1);

const aspects = findAspects({ Sun: 0, Moon: 60.5, Mars: 180 });
assert.equal(aspects.find(a => a.a === "Sun" && a.b === "Moon").aspect, "Sextile");
assert.equal(aspects.find(a => a.a === "Sun" && a.b === "Mars").aspect, "Opposition");

const compatibility = scoreCompatibility("Aries", "Leo");
assert.ok(compatibility.total >= 0 && compatibility.total <= 100);
assert.equal(compatibility.breakdown.reduce((sum, x) => sum + x.points, 0) <= 52, true);

console.log("AstroLight engine smoke tests: PASS");
