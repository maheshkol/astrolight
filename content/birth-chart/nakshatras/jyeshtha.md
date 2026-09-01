---
title: "Jyeshtha Nakshatra"
layout: "nakshatra-single"
nakshatra: "jyeshtha"
description: "Jyeshtha Nakshatra: degree range, ruling planet, four padas and the mathematics behind its sidereal position."
---

## Jyeshtha Nakshatra

**Jyeshtha** is the 18th of the traditional 27 Nakshatras, or lunar mansions, used in Vedic astrology. Its sidereal span is approximately **226.6667° to 240.0000°**, and its traditional ruling planet is **Mercury**.

The Nakshatra system divides the 360° sidereal zodiac into 27 equal sections:

`360° ÷ 27 = 13°20′`

Each Nakshatra is further divided into four padas:

`13°20′ ÷ 4 = 3°20′`

These divisions are mathematical coordinates. The symbolic interpretation attached to a Nakshatra belongs to the Vedic astrological tradition.

## How AstroLight finds a Nakshatra

The birth-chart engine first obtains the Moon's tropical ecliptic longitude from the astronomical ephemeris. In Vedic mode, it subtracts the selected Lahiri-style ayanamsa approximation to obtain a sidereal longitude.

Then:

`Nakshatra index = floor(sidereal longitude ÷ 13°20′)`

The remainder inside that Nakshatra is used to determine the pada:

`Pada = floor(remainder ÷ 3°20′) + 1`

This means a small change in the Moon's longitude can move the result from one pada to another, especially near a boundary.

## Jyeshtha and the Moon

Because the Moon moves quickly through the zodiac, its Nakshatra can be a useful demonstration of why exact birth time matters. A Moon position close to a Nakshatra boundary can change the result over a relatively short period.

AstroLight therefore displays the calculated sidereal longitude alongside the Nakshatra and pada instead of hiding the underlying number.

## Traditional interpretation

Traditional Vedic astrology associates Jyeshtha with qualities and themes derived from its ruling planet, symbolic imagery, deity and position in the lunar-mansion sequence. Interpretations can vary between schools and texts, so AstroLight treats these meanings as a reference framework rather than as objective personality tests.

The most useful way to read a Nakshatra is in context with the Moon's sign, its exact degree, the pada, house placement and other chart factors.

## Boundary awareness

The nominal span of this Nakshatra is about **226.67°–240.00°** sidereal longitude. At the exact boundaries, small differences in ephemeris conventions, ayanamsa calculation or input time can matter.

For that reason, AstroLight should always be transparent about the calculation method used for the chart.

> **Interpretation note:** Nakshatra descriptions are traditional Vedic astrology interpretations. They are not scientifically validated predictions of personality or life events.
