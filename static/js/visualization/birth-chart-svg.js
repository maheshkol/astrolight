/**
 * visualization/birth-chart-svg.js
 * Wraps the zodiac wheel renderer specifically for a generated chart
 * result (from astrology/birth-chart.js), plus renders the "calculating..."
 * step animation described in the architecture doc.
 */

import { renderZodiacWheel } from "./zodiac-wheel.js";

export function renderBirthChart(container, chartResult, options = {}) {
  const longitudes = {};
  for (const [name, p] of Object.entries(chartResult.planets)) {
    longitudes[name] = chartResult.mode === "vedic" && chartResult.vedic
      ? chartResult.vedic.planets[name].siderealLongitude
      : p.longitude;
  }

  const houseCusps = chartResult.mode === "vedic" && chartResult.vedic
    ? chartResult.houses.map(h => ({
        ...h,
        cuspLongitude: ((h.cuspLongitude - (chartResult.vedic.planets.Sun.longitude - chartResult.vedic.planets.Sun.siderealLongitude)) + 360) % 360
      }))
    : chartResult.houses;

  renderZodiacWheel(container, {
    planetLongitudes: longitudes,
    houseCusps,
    size: options.size || 520,
  });
}

/**
 * Plays the "Calculating... Sun ✓ Moon ✓ ..." sequence into a target
 * element before the chart appears, per the architecture doc's animation
 * spec. Returns a Promise that resolves when the sequence finishes.
 */
export function playCalculatingSequence(targetEl, planetNames) {
  return new Promise((resolve) => {
    let i = 0;
    targetEl.innerHTML = "";
    const list = document.createElement("ul");
    list.className = "calculating-sequence";
    targetEl.appendChild(list);

    const step = () => {
      if (i >= planetNames.length) {
        const done = document.createElement("li");
        done.className = "calculating-done";
        done.textContent = "Your chart is ready.";
        list.appendChild(done);
        setTimeout(resolve, 300);
        return;
      }
      const li = document.createElement("li");
      li.textContent = `${planetNames[i]} \u2713`;
      list.appendChild(li);
      i++;
      setTimeout(step, 120);
    };
    step();
  });
}
