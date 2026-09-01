// AstroLight horoscope selector.
// Content is pre-written and stored in a static JSON bank. The browser only
// selects the entry for the current sign/period; it does not generate claims.

document.addEventListener("DOMContentLoaded", async () => {
  const el = document.getElementById("horoscope-text");
  if (!el) return;

  const sign = el.dataset.sign;
  const period = el.dataset.period || "daily";

  try {
    const response = await fetch(new URL("js/horoscope-bank.json", document.baseURI));
    if (!response.ok) throw new Error("Horoscope bank unavailable");
    const bank = await response.json();
    const entries = bank?.[sign]?.[period];
    if (!Array.isArray(entries) || !entries.length) throw new Error("No horoscope entries");

    const now = new Date();
    let index;
    if (period === "daily") {
      const start = new Date(now.getFullYear(), 0, 1);
      index = Math.floor((now - start) / 86400000);
    } else if (period === "weekly") {
      index = Math.floor((Date.now() - Date.UTC(2020, 0, 1)) / (7 * 86400000));
    } else {
      index = now.getFullYear() * 12 + now.getMonth();
    }

    el.textContent = entries[Math.abs(index) % entries.length];
  } catch (error) {
    el.textContent = `The ${sign} ${period} horoscope is temporarily unavailable. Please try again later.`;
    console.error(error);
  }
});
