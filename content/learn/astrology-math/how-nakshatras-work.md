---
title: "How Nakshatra and Pada Are Calculated"
description: "The math behind the 27 lunar mansions of Vedic astrology, with a worked example."
---

In Vedic astrology, the Moon's position isn't just described by one of 12 signs (rashis) — it's further divided into 27 **nakshatras** (lunar mansions), each of which is split into 4 **padas** (quarters).

## The division

The full 360° sidereal zodiac is divided evenly by 27:

```
360° ÷ 27 = 13°20′ per nakshatra
```

Each nakshatra is then divided into 4 equal padas:

```
13°20′ ÷ 4 = 3°20′ per pada
```

## Finding the nakshatra and pada

Given the Moon's **sidereal** longitude (tropical longitude minus the ayanamsa — see [sidereal vs tropical](/learn/astrology-math/sidereal-vs-tropical/)):

```
nakshatraIndex = floor(moonSiderealLongitude / 13.3333)
remainder      = moonSiderealLongitude - (nakshatraIndex × 13.3333)
pada           = floor(remainder / 3.3333) + 1
```

## Worked example

Suppose the Moon's sidereal longitude works out to **142.5°**.

- `nakshatraIndex = floor(142.5 / 13.3333) = floor(10.6875) = 10`
- Counting from index 0 (Ashwini), index 10 is **Purva Phalguni**
- `remainder = 142.5 - (10 × 13.3333) = 142.5 - 133.333 = 9.167°`
- `pada = floor(9.167 / 3.3333) + 1 = floor(2.75) + 1 = 3`

So this Moon placement is **Purva Phalguni, Pada 3**.

This exact calculation runs in `static/js/astrology/nakshatra.js` — it's what powers the [Moon Sign & Nakshatra Calculator](/tools/moon-sign-calculator/) and the Vedic mode of the [birth chart tool](/birth-chart/).

## Why nakshatras matter

Each of the 27 nakshatras has a ruling planet, a symbol, and traditional meanings used in Vedic astrology for personality analysis and matchmaking (Nakshatra Porutham). See the [full nakshatra reference](/birth-chart/nakshatras/) for all 27.

*Presented as a cultural/reflective framework, not a scientific or predictive claim.*
