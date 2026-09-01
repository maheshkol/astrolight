/**
 * tools/chart-generator.js
 * Wires the birth-chart form to the calculation engine + visualization
 * layer + the "calculating..." animation. This is the flagship feature
 * page (/birth-chart/).
 */
import { generateBirthChart } from "../astrology/birth-chart.js";
import { renderBirthChart, playCalculatingSequence } from "../visualization/birth-chart-svg.js";
import { toDMS } from "../astrology/coordinates.js";

const PLANET_ORDER = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

export function initChartGenerator({ formEl, wheelEl, sequenceEl, tableEl, modeToggleEl }) {
  let mode = "western";
  if (modeToggleEl) {
    modeToggleEl.addEventListener("change", (e) => { mode = e.target.value; });
  }

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dateVal = formEl.querySelector('[name="date"]').value;
    const timeVal = formEl.querySelector('[name="time"]').value;
    const utcOffset = parseFloat(formEl.querySelector('[name="utcOffset"]').value || "0");
    const latitude = parseFloat(formEl.querySelector('[name="latitude"]').value || "0");
    const longitude = parseFloat(formEl.querySelector('[name="longitude"]').value || "0");
    if (!dateVal) return;

    const [year, month, day] = dateVal.split("-").map(Number);
    const [hour, minute] = (timeVal || "12:00").split(":").map(Number);

    await playCalculatingSequence(sequenceEl, PLANET_ORDER);

    const chart = generateBirthChart({
      year, month, day, hour, minute, utcOffsetHours: utcOffset,
      latitude, longitude, mode,
    });

    renderBirthChart(wheelEl, chart);
    renderPlanetTable(tableEl, chart);
  });
}

function renderPlanetTable(tableEl, chart) {
  const rows = PLANET_ORDER.map((name) => {
    const p = chart.planets[name];
    const v = chart.vedic?.planets?.[name];
    const vedicCell = v
      ? `<td>${v.rashi} (${toDMS(v.degreeInRashi)}) · House ${v.house}</td>`
      : "";
    return `<tr>
      <td>${name}</td>
      <td>${p.sign} (${toDMS(p.degreeInSign)})</td>
      <td>House ${p.house}</td>
      ${vedicCell}
    </tr>`;
  }).join("");

  const vedicHeader = chart.vedic ? "<th>Rashi (Vedic)</th>" : "";

  tableEl.innerHTML = `
    <p><strong>Ascendant:</strong> ${chart.ascendant.symbol} ${chart.ascendant.sign}${chart.vedic ? ` · Vedic: ${chart.vedic.ascendantSidereal}` : ""}</p>
    ${chart.warnings.map((w) => `<p class="warning">${w}</p>`).join("")}
    <table class="chart-table">
      <thead><tr><th>Planet</th><th>Sign</th><th>House</th>${vedicHeader}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${chart.vedic && chart.vedic.planets.Moon.nakshatra
      ? `<p><strong>Moon Nakshatra:</strong> ${chart.vedic.planets.Moon.nakshatra.name}, Pada ${chart.vedic.planets.Moon.nakshatra.pada}</p>`
      : ""}
    <h3>Aspects</h3>
    <ul>${chart.aspects.map((a) => `<li>${a.a} ${a.aspect} ${a.b} (orb ${a.exactOrb}°)</li>`).join("") || "<li>No major aspects within orb.</li>"}</ul>
  `;
}
