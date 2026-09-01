# AstroLight — Hugo Astrology Platform

AstroLight is a Hugo-based astrology website designed around **calculation + visualization + editorial interpretation** rather than a collection of static horoscope pages.

## Architecture

```text
static/js/
├── astrology/            calculation engine
│   ├── julian-day.js
│   ├── coordinates.js
│   ├── zodiac.js
│   ├── planets.js
│   ├── sidereal.js
│   ├── nakshatra.js
│   ├── houses.js
│   ├── aspects.js
│   ├── compatibility.js
│   └── birth-chart.js
├── visualization/
│   ├── zodiac-wheel.js
│   ├── birth-chart-svg.js
│   └── star-field.js
└── tools/
    ├── sun-sign.js
    ├── moon-sign.js
    └── chart-generator.js
```

The calculation layer is intentionally independent from DOM rendering. The visualization layer receives calculated values and turns them into SVG/canvas experiences.

## Current calculation model

### Astronomical positions

Planetary positions are obtained from **Astronomy Engine**, an open-source astronomy library, rather than hand-written approximate planetary orbits.

The project uses the library in the browser through the CDN script in `layouts/_default/baseof.html`.

### Tropical zodiac

The tropical zodiac divides the ecliptic into twelve 30° sectors:

```text
sign index = floor(ecliptic longitude / 30°)
```

### Julian Day

The project implements the standard calendar-to-Julian-Day conversion directly. This is also documented in the Astrology Mathematics section.

### Ascendant

The Ascendant is calculated from local sidereal time, geographic latitude and the obliquity of the ecliptic.

### Houses

The current public chart uses **Equal Houses**:

```text
House N cusp = Ascendant + (N - 1) × 30°
```

This is an intentional, documented v1 choice. A future version can add Whole Sign, Placidus and other house systems.

### Vedic / sidereal mode

Vedic mode converts tropical longitude to sidereal longitude using a compact Lahiri-style ayanamsa approximation.

The project then calculates:

```text
sidereal longitude
        ↓
Rashi
        ↓
Nakshatra
        ↓
Pada
```

The Nakshatra engine divides:

```text
360° / 27 = 13°20′
13°20′ / 4 = 3°20′ per pada
```

### Aspects

The engine checks conjunction, sextile, square, trine and opposition using explicit angular orbs.

### Compatibility

Compatibility is a deterministic educational model based on:

- element relationship;
- modality relationship;
- shortest distance around the zodiac wheel.

The score is explicitly described as an AstroLight reflection model, not a scientific prediction.

## Content

The scaffold has now been populated with editorial first-pass content for:

- 12 zodiac signs;
- 10 planetary reference pages;
- 12 house pages;
- 27 Nakshatra pages;
- 66 compatibility combinations;
- astrology mathematics articles;
- birth-chart guide;
- About;
- Privacy Policy;
- Disclaimer;
- Contact.

The content should still receive a final human editorial pass before an AdSense application.

## Horoscope system

Horoscope pages use a static, pre-written content bank in:

```text
static/js/horoscope-bank.json
```

The browser selects an entry deterministically based on the sign, period and date. It does not generate arbitrary horoscope text.

This is intentionally different from an AI-generated horoscope-per-request system.

## Visual design

The current visual system includes:

- animated star-field hero;
- orbit-style background motion;
- reveal-on-scroll transitions;
- responsive zodiac cards;
- SVG zodiac wheel;
- animated calculation sequence;
- reduced-motion support;
- responsive mobile navigation;
- dark celestial editorial design.

The visual system uses CSS for presentation, SVG for information-rich graphics and JavaScript for interaction/calculation.

## Important deployment note

The default `baseURL` is still a placeholder:

```toml
baseURL = "https://yourusername.github.io/astrolight/"
```

Replace it with the actual GitHub Pages URL or custom domain before deployment.

The templates use Hugo `relURL` / `RelPermalink` patterns so the site can work correctly under a GitHub Pages project subpath.

## AdSense

The AdSense publisher ID is intentionally empty:

```toml
adsenseClientId = ""
```

Do not insert a placeholder publisher ID.

Ad slots are already wired into the templates but remain inactive until a real publisher ID is configured.

Before applying for AdSense, the site should have:

1. finished editorial content;
2. real contact information;
3. final privacy/disclaimer wording;
4. working navigation;
5. functioning calculators;
6. responsive/mobile testing;
7. Search Console and Analytics configured;
8. no placeholder text or domains;
9. no broken links;
10. a final quality review.

## Development

Hugo is required to build and preview the website:

```bash
hugo server -D
```

Node.js is used for calculation-engine smoke tests:

```bash
npm test
```

or:

```bash
npm run test:engine
```

The current smoke suite validates Julian Day, zodiac boundaries, Nakshatra/pada mapping, sidereal conversion, Ascendant range, house placement, aspects and compatibility scoring.

## Next engineering phases

### Phase 2 — Birth-chart UX

- city/location search;
- automatic coordinates;
- timezone lookup;
- historical DST handling;
- better birth-time validation;
- chart explanation cards;
- planet/house drill-down interactions.

### Phase 3 — Visualization

- animated planetary placement;
- aspect lines;
- interactive chart hover/click states;
- degree ruler;
- Nakshatra band;
- tropical/sidereal comparison mode;
- chart export.

### Phase 4 — Astronomy expansion

- Moon phase;
- planetary retrograde detection;
- planetary transits;
- sunrise/sunset;
- equinox/solstice events;
- transit timeline.

### Phase 5 — Content

Expand the educational library around actual calculations rather than publishing large volumes of repetitive pages.

## Project philosophy

AstroLight should answer two questions:

> **What did the calculation produce?**

and

> **What does the astrological tradition say about it?**

Keeping those questions separate is the core design principle of the project.
