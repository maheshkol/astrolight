import { allPlanetLongitudes, PLANET_SYMBOLS } from "./astrology/planets.js";
import { signFromLongitude, ZODIAC_SIGNS, ZODIAC_SYMBOLS } from "./astrology/zodiac.js";
import { renderStarField } from "./visualization/star-field.js";

const NS = "http://www.w3.org/2000/svg";
const $ = (selector) => document.querySelector(selector);

function polar(cx, cy, radius, degrees) {
  const angle = (180 - degrees) * Math.PI / 180;
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function formatDegree(value) {
  const normalized = ((value % 360) + 360) % 360;
  return `${normalized.toFixed(1)}°`;
}

function createSvgWheel(longitudes) {
  const size = 520;
  const cx = size / 2;
  const cy = size / 2;
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Animated zodiac wheel showing today's calculated planetary positions");
  svg.classList.add("landing-wheel-svg");

  const defs = document.createElementNS(NS, "defs");
  const gradient = document.createElementNS(NS, "radialGradient");
  gradient.id = "sun-gradient";
  gradient.innerHTML = '<stop offset="0%" stop-color="#fff7c8"/><stop offset="55%" stop-color="#f4d58d"/><stop offset="100%" stop-color="#c68b3d" stop-opacity="0"/>';
  defs.appendChild(gradient);
  svg.appendChild(defs);

  const background = document.createElementNS(NS, "circle");
  background.setAttribute("cx", cx); background.setAttribute("cy", cy); background.setAttribute("r", 245);
  background.classList.add("wheel-bg"); svg.appendChild(background);

  [226, 190, 126].forEach((r, index) => {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", cx); c.setAttribute("cy", cy); c.setAttribute("r", r);
    c.classList.add("wheel-ring", `ring-${index}`); svg.appendChild(c);
  });

  for (let i = 0; i < 12; i += 1) {
    const angle = i * 30;
    const inner = polar(cx, cy, 126, angle);
    const outer = polar(cx, cy, 226, angle);
    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", inner.x); line.setAttribute("y1", inner.y);
    line.setAttribute("x2", outer.x); line.setAttribute("y2", outer.y);
    line.classList.add("wheel-divider"); svg.appendChild(line);

    const label = polar(cx, cy, 207, angle + 15);
    const text = document.createElementNS(NS, "text");
    text.setAttribute("x", label.x); text.setAttribute("y", label.y);
    text.setAttribute("text-anchor", "middle"); text.setAttribute("dominant-baseline", "middle");
    text.classList.add("wheel-sign"); text.textContent = ZODIAC_SYMBOLS[ZODIAC_SIGNS[i]];
    const title = document.createElementNS(NS, "title"); title.textContent = ZODIAC_SIGNS[i]; text.appendChild(title);
    svg.appendChild(text);
  }

  const sunGlow = document.createElementNS(NS, "circle");
  sunGlow.setAttribute("cx", cx); sunGlow.setAttribute("cy", cy); sunGlow.setAttribute("r", 72);
  sunGlow.setAttribute("fill", "url(#sun-gradient)"); sunGlow.classList.add("sun-glow"); svg.appendChild(sunGlow);
  const sun = document.createElementNS(NS, "circle");
  sun.setAttribute("cx", cx); sun.setAttribute("cy", cy); sun.setAttribute("r", 23); sun.classList.add("sun-core"); svg.appendChild(sun);
  const sunText = document.createElementNS(NS, "text"); sunText.setAttribute("x", cx); sunText.setAttribute("y", cy + 7); sunText.setAttribute("text-anchor", "middle"); sunText.classList.add("sun-glyph"); sunText.textContent = "☉"; svg.appendChild(sunText);

  const featured = ["Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
  featured.forEach((planet, index) => {
    const lon = longitudes[planet];
    if (!Number.isFinite(lon)) return;
    const radius = index % 2 === 0 ? 155 : 174;
    const p = polar(cx, cy, radius, lon);
    const group = document.createElementNS(NS, "g");
    group.classList.add("planet-marker");
    group.style.setProperty("--delay", `${index * -1.1}s`);
    const dot = document.createElementNS(NS, "circle"); dot.setAttribute("cx", p.x); dot.setAttribute("cy", p.y); dot.setAttribute("r", index === 0 ? 5 : 4); dot.classList.add("planet-dot"); group.appendChild(dot);
    const text = document.createElementNS(NS, "text"); text.setAttribute("x", p.x); text.setAttribute("y", p.y - 11); text.setAttribute("text-anchor", "middle"); text.classList.add("planet-text"); text.textContent = PLANET_SYMBOLS[planet];
    const title = document.createElementNS(NS, "title"); title.textContent = `${planet}: ${formatDegree(lon)} · ${signFromLongitude(lon).sign}`; text.appendChild(title); group.appendChild(text);
    svg.appendChild(group);
  });

  return svg;
}

function phaseName(sunLon, moonLon) {
  const elongation = ((moonLon - sunLon) % 360 + 360) % 360;
  if (elongation < 22.5 || elongation >= 337.5) return "New Moon";
  if (elongation < 67.5) return "Waxing Crescent";
  if (elongation < 112.5) return "First Quarter";
  if (elongation < 157.5) return "Waxing Gibbous";
  if (elongation < 202.5) return "Full Moon";
  if (elongation < 247.5) return "Waning Gibbous";
  if (elongation < 292.5) return "Last Quarter";
  return "Waning Crescent";
}

function initRevealAnimations() {
  const items = [...document.querySelectorAll(".reveal:not(.is-visible)")];
  if (!items.length) return;

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  items.forEach((item) => item.classList.add("reveal-pending"));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      entry.target.classList.remove("reveal-pending");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  items.forEach((item) => observer.observe(item));
}

function renderFallbackWheel(wheel) {
  // No fake live planet data: render only the structural zodiac circle.
  wheel.replaceChildren(createSvgWheel({}));
  const caption = $("#sky-caption");
  if (caption) caption.textContent = "Zodiac reference wheel · live planetary data is temporarily unavailable";
}

export function renderLandingExperience() {
  initRevealAnimations();

  const canvas = $("#star-field");
  if (canvas) renderStarField(canvas, { starCount: 190 });

  const wheel = $("#landing-wheel");
  if (!wheel) return;

  if (typeof Astronomy === "undefined") {
    renderFallbackWheel(wheel);
    return;
  }

  const now = new Date();
  let longitudes;
  try {
    longitudes = allPlanetLongitudes(now);
  } catch (error) {
    console.warn("AstroLight landing calculation unavailable", error);
    renderFallbackWheel(wheel);
    return;
  }

  wheel.replaceChildren(createSvgWheel(longitudes));

  const sun = signFromLongitude(longitudes.Sun);
  const moon = signFromLongitude(longitudes.Moon);
  const caption = $("#sky-caption");
  if (caption) caption.textContent = `Sun in ${sun.sign} ${formatDegree(sun.degreeInSign)} · Moon in ${moon.sign} ${formatDegree(moon.degreeInSign)} · ${phaseName(longitudes.Sun, longitudes.Moon)}`;

  const date = $("#sky-date");
  if (date) date.textContent = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(now);

  const results = $("#sky-results");
  if (results) {
    const values = [
      ["☉ Sun", sun.sign, `${formatDegree(sun.degreeInSign)} in sign`],
      ["☽ Moon", moon.sign, `${formatDegree(moon.degreeInSign)} in sign`],
      ["♂ Mars", formatDegree(longitudes.Mars), "tropical longitude"],
      ["♃ Jupiter", formatDegree(longitudes.Jupiter), "tropical longitude"],
    ];
    results.innerHTML = values.map(([label, value, detail]) => `<div class="sky-result"><span>${label}</span><strong>${value}</strong><small>${detail}</small></div>`).join("");
  }
}
