/**
 * tools/sun-sign.js
 * Standalone quick tool: date -> Sun's real ecliptic longitude -> sign.
 * Wires into any page with a #sun-sign-form (see homepage / tools page).
 */
import { allPlanetLongitudes } from "../astrology/planets.js";
import { signFromLongitude } from "../astrology/zodiac.js";
import { toDMS } from "../astrology/coordinates.js";

export function initSunSignTool(formEl, resultEl) {
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const dateVal = formEl.querySelector('[name="date"]').value;
    if (!dateVal) return;
    const [year, month, day] = dateVal.split("-").map(Number);

    // Noon UTC is a safe default for a sun-sign-only calculation — the
    // Sun moves ~1°/day, so time-of-day barely matters here (it matters a
    // great deal for Moon sign and Ascendant, which need the full form).
    const dateUTC = new Date(Date.UTC(year, month - 1, day, 12, 0));
    const longitudes = allPlanetLongitudes(dateUTC);
    const signInfo = signFromLongitude(longitudes.Sun);

    resultEl.innerHTML = `
      <h3>${signInfo.symbol} ${signInfo.sign}</h3>
      <p>Sun's ecliptic longitude: ${longitudes.Sun.toFixed(2)}° (${toDMS(signInfo.degreeInSign)} into ${signInfo.sign})</p>
      <p><a href="${new URL(`zodiac/${signInfo.sign.toLowerCase()}/`, document.baseURI).href}">Read about ${signInfo.sign} →</a></p>
    `;
  });
}
