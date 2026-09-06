/**
 * tools/compatibility.js
 * Interactive Sun-sign compatibility calculator.
 *
 * Uses the shared AstroLight compatibility engine so the calculator
 * and individual compatibility pages always use the same scoring model.
 */

import { scoreCompatibility } from "../astrology/compatibility.js?v=2";

import {
  generateCompatibilityProse,
  COMPATIBILITY_PROSE_VERSION
} from "../astrology/compatibility-prose.js";

import { ZODIAC_SIGNS } from "../astrology/zodiac.js";

export function initCompatibilityTool(formEl, resultEl) {
  if (!formEl || !resultEl) return;

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();

    const signA = formEl.querySelector('[name="signA"]').value;
    const signB = formEl.querySelector('[name="signB"]').value;

    if (!signA || !signB) {
      resultEl.innerHTML = `
        <p class="warning">Please select both Sun signs.</p>
      `;
      return;
    }

    if (signA === signB) {
      resultEl.innerHTML = `
        <h3>${signA} + ${signB}</h3>
        <p>This calculator compares two different Sun signs. Please choose two different signs.</p>
      `;
      return;
    }

    const result = scoreCompatibility(signA, signB);

const prose = generateCompatibilityProse(
  signA,
  signB,
  result
);

resultEl.innerHTML = `
  <div class="compatibility-result-header">
    <h3>${signA} + ${signB}</h3>

    <div class="score-total">
      Overall Compatibility: ${result.total}%
    </div>

    <p class="compatibility-tone">
      ${prose.overall.tone}
    </p>
  </div>

  <section class="compatibility-overview">
    <h3>Overall interpretation</h3>
    <p>${prose.sections.overview}</p>
  </section>

  <section class="compatibility-section">
    <h3>Element</h3>

    <p>
      <strong>${prose.sections.element.score}/${prose.sections.element.outOf}</strong>
      — ${prose.sections.element.tone}
    </p>

    <p>${prose.sections.element.text}</p>
  </section>

  <section class="compatibility-section">
    <h3>Modality</h3>

    <p>
      <strong>${prose.sections.modality.score}/${prose.sections.modality.outOf}</strong>
      — ${prose.sections.modality.tone}
    </p>

    <p>${prose.sections.modality.text}</p>
  </section>

  <section class="compatibility-section">
    <h3>Sign-wheel distance</h3>

    <p>
      <strong>${prose.sections.distance.score}/${prose.sections.distance.outOf}</strong>
      — ${prose.sections.distance.tone}
    </p>

    <p>${prose.sections.distance.text}</p>
  </section>

  <section class="compatibility-themes">
    <h3>Relationship themes</h3>

    <ul>
      ${prose.themes
        .map(theme => `<li>${theme}</li>`)
        .join("")}
    </ul>
  </section>

  <p class="score-disclaimer">
    <em>${result.disclaimer}</em>
  </p>

  <p class="compatibility-engine-note">
    Interpretation engine ${COMPATIBILITY_PROSE_VERSION}
  </p>
`;
});
}

export function populateCompatibilitySigns(formEl) {
  const signA = formEl.querySelector('[name="signA"]');
  const signB = formEl.querySelector('[name="signB"]');

  if (!signA || !signB) return;

  const options = ZODIAC_SIGNS
    .map((sign) => `<option value="${sign}">${sign}</option>`)
    .join("");

  signA.innerHTML = options;
  signB.innerHTML = options;

  signA.value = "Aries";
  signB.value = "Taurus";
}