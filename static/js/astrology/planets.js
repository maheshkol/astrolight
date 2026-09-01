/**
 * astrology/planets.js
 * Geocentric ecliptic longitudes for the Sun, Moon and planets.
 *
 * IMPORTANT: this deliberately does NOT hand-roll orbital mechanics.
 * Approximating planetary positions ourselves is exactly what the review
 * warned against — once a site claims to calculate a real birth chart,
 * accuracy matters. Instead this wraps "Astronomy Engine"
 * (https://github.com/cosinekitty/astronomy), a well-tested, MIT-licensed
 * astronomy library (VSOP/ELP-based), loaded client-side via CDN in
 * baseof.html:
 *
 *   <script src="https://cdn.jsdelivr.net/npm/astronomy-engine@2/astronomy.browser.js"></script>
 *
 * which exposes a global `Astronomy` object that this module wraps.
 */

const BODY_NAMES = {
  Sun: "Sun",
  Moon: "Moon",
  Mercury: "Mercury",
  Venus: "Venus",
  Mars: "Mars",
  Jupiter: "Jupiter",
  Saturn: "Saturn",
  Uranus: "Uranus",
  Neptune: "Neptune",
  Pluto: "Pluto",
};

/**
 * Returns geocentric apparent ecliptic longitude (degrees, tropical,
 * date-of-birth equinox) for one body, at a given JS Date (UTC).
 */
function eclipticLongitudeOf(bodyKey, dateUTC) {
  if (typeof Astronomy === "undefined") {
    throw new Error(
      "Astronomy Engine not loaded — check the CDN <script> tag in baseof.html"
    );
  }
  const body = BODY_NAMES[bodyKey];
  if (!body) throw new Error(`Unknown body: ${bodyKey}`);

  if (body === "Moon") {
    const eq = Astronomy.GeoVector("Moon", dateUTC, true);
    const ecl = Astronomy.Ecliptic(eq);
    return ecl.elon;
  }

  const eq = Astronomy.GeoVector(body, dateUTC, true);
  const ecl = Astronomy.Ecliptic(eq);
  return ecl.elon;
}

/**
 * Computes ecliptic longitudes for all ten bodies at once.
 * Returns { Sun: 137.4, Moon: 22.1, ... } in tropical degrees.
 */
export function allPlanetLongitudes(dateUTC) {
  const result = {};
  for (const key of Object.keys(BODY_NAMES)) {
    result[key] = eclipticLongitudeOf(key, dateUTC);
  }
  return result;
}

export const PLANET_SYMBOLS = {
  Sun: "\u2609", Moon: "\u263D", Mercury: "\u263F", Venus: "\u2640",
  Mars: "\u2642", Jupiter: "\u2643", Saturn: "\u2644",
  Uranus: "\u2645", Neptune: "\u2646", Pluto: "\u2647",
};
