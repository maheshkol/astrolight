/**
 * tools/moon-sign.js
 * Moon sign (Western) and Rashi + Nakshatra (Vedic) both need accurate
 * birth time, since the Moon moves ~13°/day (about 0.5° per hour) — this
 * form collects time and warns if it's left blank.
 */
import { allPlanetLongitudes } from "../astrology/planets.js";
import { signFromLongitude } from "../astrology/zodiac.js";
import { toSidereal } from "../astrology/sidereal.js";
import { nakshatraFromSiderealLongitude } from "../astrology/nakshatra.js";

export function initMoonSignTool(formEl, resultEl) {
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const dateVal = formEl.querySelector('[name="date"]').value;
    const timeVal = formEl.querySelector('[name="time"]').value;
    const utcOffset = parseFloat(formEl.querySelector('[name="utcOffset"]').value || "0");
    if (!dateVal) return;

    const [year, month, day] = dateVal.split("-").map(Number);
    const [hour, minute] = (timeVal || "12:00").split(":").map(Number);
    const dateUTC = new Date(Date.UTC(year, month - 1, day, hour - utcOffset, minute));

    const longitudes = allPlanetLongitudes(dateUTC);
    const westernMoon = signFromLongitude(longitudes.Moon);

    const siderealMoon = toSidereal(longitudes.Moon, year);
    const rashi = signFromLongitude(siderealMoon);
    const nakshatra = nakshatraFromSiderealLongitude(siderealMoon);

    resultEl.innerHTML = `
      <h3>Western Moon Sign: ${westernMoon.symbol} ${westernMoon.sign}</h3>
      <h3>Vedic Rashi: ${rashi.sign}</h3>
      <p>Nakshatra: <strong>${nakshatra.name}</strong>, Pada ${nakshatra.pada}</p>
      ${!timeVal ? '<p class="warning">No birth time entered — Moon sign accuracy improves significantly with exact time.</p>' : ""}
    `;
  });
}
