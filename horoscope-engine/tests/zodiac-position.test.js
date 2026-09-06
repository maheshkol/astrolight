import {
  longitudeToZodiac,
  getZodiacSigns
} from "../calculations/zodiac-position.js";

const tests = [
  [0, "aries", 0],
  [15, "aries", 15],
  [29.999, "aries", 29.999],
  [30, "taurus", 0],
  [45, "taurus", 15],
  [90, "cancer", 0],
  [120, "leo", 0],
  [180, "libra", 0],
  [210, "scorpio", 0],
  [240, "sagittarius", 0],
  [270, "capricorn", 0],
  [300, "aquarius", 0],
  [330, "pisces", 0],
  [359.999, "pisces", 29.999]
];

for (const [longitude, expectedSign, expectedDegree] of tests) {
  const result = longitudeToZodiac(longitude);

  if (result.sign !== expectedSign) {
    throw new Error(
      `${longitude}° expected ${expectedSign}, got ${result.sign}`
    );
  }

  if (Math.abs(result.degree - expectedDegree) > 0.001) {
    throw new Error(
      `${longitude}° expected ${expectedDegree}°, got ${result.degree}°`
    );
  }
}

if (getZodiacSigns().length !== 12) {
  throw new Error("Expected exactly 12 zodiac signs.");
}

console.log("✓ Zodiac position tests passed");
