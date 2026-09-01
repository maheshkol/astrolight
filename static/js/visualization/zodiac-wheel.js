/**
 * visualization/zodiac-wheel.js
 * Draws a 360° zodiac wheel as SVG and places planet glyphs at their
 * calculated longitudes. Pure DOM/SVG — no canvas, so it stays crisp at
 * any size and is easy to style with CSS.
 */

import { ZODIAC_SIGNS, ZODIAC_SYMBOLS } from "../astrology/zodiac.js";
import { PLANET_SYMBOLS } from "../astrology/planets.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function polarToXY(cx, cy, radius, angleDeg) {
  // Astrological convention: 0° Aries at the 9 o'clock (left) point,
  // increasing counter-clockwise.
  const rad = (180 - angleDeg) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

/**
 * @param container   DOM element to render into
 * @param options.planetLongitudes  { Sun: 137.4, Moon: 22.1, ... } (optional)
 * @param options.houseCusps        [{house, cuspLongitude}, ...] (optional)
 * @param options.size              pixel size of the (square) SVG, default 400
 */
export function renderZodiacWheel(container, options = {}) {
  const { planetLongitudes = {}, houseCusps = null, size = 400 } = options;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.46;
  const signRingR = size * 0.38;
  const innerR = size * 0.3;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("class", "zodiac-wheel");

  // Outer + inner circles
  [outerR, innerR].forEach((r) => {
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.setAttribute("class", "wheel-ring");
    svg.appendChild(circle);
  });

  // 12 sign divisions + glyphs
  ZODIAC_SIGNS.forEach((sign, i) => {
    const startAngle = i * 30;
    const midAngle = startAngle + 15;

    const p1 = polarToXY(cx, cy, innerR, startAngle);
    const p2 = polarToXY(cx, cy, outerR, startAngle);
    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", p1.x); line.setAttribute("y1", p1.y);
    line.setAttribute("x2", p2.x); line.setAttribute("y2", p2.y);
    line.setAttribute("class", "wheel-divider");
    svg.appendChild(line);

    const labelPos = polarToXY(cx, cy, signRingR, midAngle);
    const text = document.createElementNS(SVG_NS, "text");
    text.setAttribute("x", labelPos.x);
    text.setAttribute("y", labelPos.y);
    text.setAttribute("class", "wheel-sign-symbol");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = ZODIAC_SYMBOLS[sign];
    svg.appendChild(text);
  });

  // Optional house cusp lines (radial spokes at each cusp longitude)
  if (houseCusps) {
    houseCusps.forEach(({ house, cuspLongitude }) => {
      const p1 = polarToXY(cx, cy, innerR * 0.4, cuspLongitude);
      const p2 = polarToXY(cx, cy, innerR, cuspLongitude);
      const line = document.createElementNS(SVG_NS, "line");
      line.setAttribute("x1", p1.x); line.setAttribute("y1", p1.y);
      line.setAttribute("x2", p2.x); line.setAttribute("y2", p2.y);
      line.setAttribute("class", "house-cusp-line");
      svg.appendChild(line);

      const numPos = polarToXY(cx, cy, innerR * 0.55, cuspLongitude + 10);
      const numText = document.createElementNS(SVG_NS, "text");
      numText.setAttribute("x", numPos.x);
      numText.setAttribute("y", numPos.y);
      numText.setAttribute("class", "house-number");
      numText.textContent = house;
      svg.appendChild(numText);
    });
  }

  // Planet glyphs at their longitudes
  const planetRingR = size * 0.34;
  Object.entries(planetLongitudes).forEach(([name, lon]) => {
    const pos = polarToXY(cx, cy, planetRingR, lon);
    const glyph = document.createElementNS(SVG_NS, "text");
    glyph.setAttribute("x", pos.x);
    glyph.setAttribute("y", pos.y);
    glyph.setAttribute("class", `planet-glyph planet-${name.toLowerCase()}`);
    glyph.setAttribute("text-anchor", "middle");
    glyph.setAttribute("dominant-baseline", "middle");
    glyph.textContent = PLANET_SYMBOLS[name] || name[0];

    const title = document.createElementNS(SVG_NS, "title");
    title.textContent = `${name}: ${lon.toFixed(1)}°`;
    glyph.appendChild(title);

    svg.appendChild(glyph);
  });

  container.innerHTML = "";
  container.appendChild(svg);
  return svg;
}
