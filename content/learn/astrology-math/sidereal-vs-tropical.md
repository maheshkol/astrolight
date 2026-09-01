---
title: "Sidereal vs Tropical Zodiac: What's the Difference?"
description: "Why Western and Vedic astrology can place the same birth in two different signs, explained through precession."
---

If you've ever gotten a different "sign" from a Western horoscope site than from a Vedic astrologer for the exact same birth date, this is why — and it isn't an error on either side. They're using two different reference frames for the same sky.

## Tropical zodiac (Western astrology)

The tropical zodiac is anchored to the **seasons**. 0° Aries is defined as the moment of the spring equinox — wherever the Sun actually appears in the sky at that moment *is* 0° Aries, by definition, every year. This is why Western astrology's date ranges (e.g. "Aries: March 21 – April 19") stay fixed year after year.

## Sidereal zodiac (Vedic astrology)

The sidereal zodiac is anchored to the **fixed background stars** instead. 0° Aries is fixed to a specific point relative to the constellations.

## Why they drift apart: precession

Earth's axis slowly wobbles over a ~26,000-year cycle, called **axial precession**. Because of this wobble, the equinox point (where the tropical zodiac is anchored) slowly drifts backward relative to the fixed stars (where the sidereal zodiac is anchored) — by about **50.3 arcseconds per year**.

Over roughly 2,000 years, that drift has added up to about **24 degrees** — nearly a full zodiac sign's worth of difference. That accumulated offset is called the **ayanamsa**.

## Converting between them

```
sidereal longitude = tropical longitude − ayanamsa
```

The most widely used ayanamsa in Vedic astrology is the **Lahiri ayanamsa** (the Indian government's official standard, named after N. C. Lahiri). It's currently around 24°, and increasing by about 0.014° every year.

This is why this site's [Vedic mode](/birth-chart/) planetary positions are calculated by taking the same real ecliptic longitude used for the Western chart, and subtracting the Lahiri ayanamsa for your birth year — see `static/js/astrology/sidereal.js`.

*Presented as a cultural/reflective framework, not a scientific or predictive claim.*
