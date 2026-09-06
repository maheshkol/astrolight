import { generateAllDailyProfiles } from "../static/js/horoscope/daily-profile.js";

const dateUTC = new Date("2026-09-01T12:00:00Z");

const profiles = generateAllDailyProfiles(dateUTC);

console.log("\n# AstroLight — Reader-Facing Love Prose Test\n");

for (const sign of Object.keys(profiles)) {
  const love = profiles[sign]?.prose?.love;

  console.log(`\n========== ${sign.toUpperCase()} ==========`);

  if (!love) {
    console.log("❌ Love prose missing");
    continue;
  }

  console.log(love);
}

console.log("\n# Test complete\n");
