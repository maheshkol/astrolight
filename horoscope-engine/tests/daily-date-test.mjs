import { generateDailyProfile } from "../static/js/horoscope/daily-profile.js";

const dates = [
  new Date("2026-09-06T12:00:00Z"),
  new Date("2026-09-07T12:00:00Z"),
];

for (const dateUTC of dates) {
  console.log("\n========================================");
  console.log(`DATE: ${dateUTC.toISOString()}`);
  console.log("========================================");

  const profile = generateDailyProfile("aries", dateUTC);

  console.log("Timestamp:", profile.timestampUTC);

  console.log(
    "Summary:",
    profile.summary ?? "N/A"
  );

  console.log(
    "Overall prose:",
    profile.prose?.overall ??
    profile.prose ??
    "N/A"
  );

  console.log(
    "Planetary positions:"
  );

  for (const [planet, data] of Object.entries(profile.planets ?? {})) {
    console.log(
      `  ${planet}: ${data.sign} ${data.degreeInSign?.toFixed?.(2) ?? data.degreeInSign}°`
    );
  }
}