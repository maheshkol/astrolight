/**
 * astrology/birth-chart.js
 * The single entry point the UI calls. Takes raw birth data, runs it
 * through every calculation step, and returns one structured result
 * object that both the Western and Vedic views render from.
 *
 * Pipeline (matches the architecture doc):
 *   Julian Day → planetary longitudes → tropical signs
 *     → [Vedic mode: sidereal longitudes → rashi + nakshatra]
 *     → Ascendant → house cusps → house placements → aspects
 */

import { localToJulianDayUTC, centuriesSinceJ2000 } from "./julian-day.js";
import { obliquityOfEcliptic, greenwichSiderealTime, localSiderealTime } from "./coordinates.js";
import { allPlanetLongitudes } from "./planets.js";
import { signFromLongitude } from "./zodiac.js";
import { toSidereal } from "./sidereal.js";
import { nakshatraFromSiderealLongitude } from "./nakshatra.js";
import { calculateAscendant, equalHouseCusps, housePlacement } from "./houses.js";
import { findAspects } from "./aspects.js";

/**
 * @param {Object} input
 * @param {number} input.year
 * @param {number} input.month     1-12
 * @param {number} input.day
 * @param {number} input.hour      0-23, local time (omit/0 if unknown — flagged in result)
 * @param {number} input.minute
 * @param {number} input.utcOffsetHours  e.g. 5.5 for IST, -5 for EST
 * @param {number} input.latitude  degrees, north positive
 * @param {number} input.longitude degrees, east positive
 * @param {"western"|"vedic"} input.mode
 */
export function generateBirthChart(input) {
  const {
    year, month, day, hour = 0, minute = 0,
    utcOffsetHours = 0, latitude = 0, longitude = 0,
    mode = "western",
  } = input;

  const jd = localToJulianDayUTC(year, month, day, hour, minute, utcOffsetHours);
  const T = centuriesSinceJ2000(jd);
  const dateUTC = new Date(Date.UTC(year, month - 1, day, hour - utcOffsetHours, minute));

  // 1. Planetary longitudes (tropical, from the real ephemeris library)
  const tropicalLongitudes = allPlanetLongitudes(dateUTC);

  // 2. Obliquity + sidereal time -> Ascendant -> house cusps
  const obliquity = obliquityOfEcliptic(T);
  const gst = greenwichSiderealTime(jd, T);
  const lst = localSiderealTime(gst, longitude);
  const ascendantTropical = calculateAscendant(lst, latitude, obliquity);
  const cusps = equalHouseCusps(ascendantTropical);

  // 3. Per-planet result, tropical (Western) sign + house placement
  const planets = {};
  for (const [name, lon] of Object.entries(tropicalLongitudes)) {
    const signInfo = signFromLongitude(lon);
    planets[name] = {
      longitude: lon,
      sign: signInfo.sign,
      symbol: signInfo.symbol,
      degreeInSign: signInfo.degreeInSign,
      house: housePlacement(lon, cusps),
    };
  }

  const ascendantSign = signFromLongitude(ascendantTropical);
  const aspects = findAspects(tropicalLongitudes);

  const result = {
    mode,
    julianDay: jd,
    ascendant: { longitude: ascendantTropical, sign: ascendantSign.sign, symbol: ascendantSign.symbol },
    houses: cusps,
    planets,
    aspects,
    warnings: [],
  };

  if (!hour && !minute) {
    result.warnings.push(
      "No birth time provided — Ascendant, houses and Moon sign/nakshatra accuracy depend on exact birth time. Sun sign is unaffected."
    );
  }

  // 4. Vedic overlay: sidereal longitudes, rashi (= sidereal sign), nakshatra
  if (mode === "vedic") {
    const vedicPlanets = {};
    for (const [name, lon] of Object.entries(tropicalLongitudes)) {
      const siderealLon = toSidereal(lon, year);
      const signInfo = signFromLongitude(siderealLon); // sidereal sign = "rashi"
      vedicPlanets[name] = {
        siderealLongitude: siderealLon,
        rashi: signInfo.sign,
        degreeInRashi: signInfo.degreeInSign,
      };
      if (name === "Moon") {
        vedicPlanets.Moon.nakshatra = nakshatraFromSiderealLongitude(siderealLon);
      }
    }
    const siderealAscendant = toSidereal(ascendantTropical, year);
    const siderealHouses = cusps.map(c => ({
      house: c.house,
      cuspLongitude: toSidereal(c.cuspLongitude, year),
    }));
    for (const planet of Object.values(vedicPlanets)) {
      planet.house = housePlacement(planet.siderealLongitude, siderealHouses);
    }
    result.vedic = {
      ayanamsaApplied: true,
      planets: vedicPlanets,
      ascendantSidereal: signFromLongitude(siderealAscendant).sign,
      ascendantSiderealLongitude: siderealAscendant,
      houses: siderealHouses,
    };
  }

  return result;
}
