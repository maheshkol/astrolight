/**
 * AstroLight — Birth Chart Calculator
 *
 * User provides:
 *   - birth date
 *   - birth time
 *   - birth place
 *
 * AstroLight resolves:
 *   - latitude
 *   - longitude
 *   - IANA timezone
 *   - historical UTC offset
 *
 * The existing birth-chart engine continues to receive:
 *   utcOffsetHours
 *   latitude
 *   longitude
 */

import { generateBirthChart } from "../astrology/birth-chart.js";
import {
  renderBirthChart,
  playCalculatingSequence
} from "../visualization/birth-chart-svg.js";
import { toDMS } from "../astrology/coordinates.js";

const PLANET_ORDER = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto"
];

const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";


/* =========================================================
   PLACE LOOKUP
   ========================================================= */

async function resolveBirthPlace(place) {

  const url = new URL(NOMINATIM_URL);

  url.searchParams.set(
    "format",
    "jsonv2"
  );

  url.searchParams.set(
    "q",
    place
  );

  url.searchParams.set(
    "limit",
    "1"
  );

  url.searchParams.set(
    "addressdetails",
    "1"
  );

  const response = await fetch(
    url.toString(),
    {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en"
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      `Location lookup failed (${response.status}).`
    );
  }

  const results =
    await response.json();

  if (
    !Array.isArray(results) ||
    results.length === 0
  ) {
    throw new Error(
      "We could not find that place. Try adding the state/province or country."
    );
  }

  const result = results[0];

  const latitude =
    Number(result.lat);

  const longitude =
    Number(result.lon);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    throw new Error(
      "The location service returned invalid coordinates."
    );
  }

  return {
    displayName:
      result.display_name,

    latitude,

    longitude
  };
}


/* =========================================================
   TIMEZONE
   ========================================================= */

/*
 * Uses the browser's IANA timezone database.
 *
 * We first convert coordinates into a timezone using the
 * timezone lookup library loaded by the page.
 *
 * Then Intl.DateTimeFormat determines the actual historical
 * offset for the supplied birth date/time.
 */

function getTimezoneFromCoordinates(
  latitude,
  longitude
) {

  if (
    typeof window.tzlookup !==
    "function"
  ) {
    throw new Error(
      "Timezone lookup is unavailable. Please refresh the page and try again."
    );
  }

  return window.tzlookup(
    latitude,
    longitude
  );
}


function getUtcOffsetHours(
  year,
  month,
  day,
  hour,
  minute,
  timezone
) {

  /*
   * Use two probes around the requested local time.
   *
   * This avoids relying on today's offset and lets the
   * browser's IANA timezone database handle historical DST.
   */

  const guess =
    Date.UTC(
      year,
      month - 1,
      day,
      hour,
      minute,
      0
    );

  function offsetFor(
    timestamp
  ) {

    const date =
      new Date(timestamp);

    const parts =
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone: timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hourCycle: "h23"
        }
      ).formatToParts(date);

    const values = {};

    parts.forEach((part) => {

      if (
        part.type !==
        "literal"
      ) {
        values[part.type] =
          Number(part.value);
      }

    });

    const localTimestamp =
      Date.UTC(
        values.year,
        values.month - 1,
        values.day,
        values.hour,
        values.minute,
        values.second
      );

    return (
      localTimestamp -
      timestamp
    ) / 3600000;
  }

  const first =
    offsetFor(guess);

  const second =
    offsetFor(
      guess - first * 3600000
    );

  return second;
}


/* =========================================================
   DISPLAY
   ========================================================= */

function formatUtcOffset(
  offset
) {

  const sign =
    offset >= 0
      ? "+"
      : "-";

  const absolute =
    Math.abs(offset);

  const hours =
    Math.floor(
      absolute
    );

  const minutes =
    Math.round(
      (absolute - hours) * 60
    );

  return `UTC ${sign}${String(
    hours
  ).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;
}


function formatCoordinate(
  value,
  positive,
  negative
) {

  return `${Math.abs(
    value
  ).toFixed(4)}° ${
    value >= 0
      ? positive
      : negative
  }`;
}


function setPlaceStatus(
  element,
  message,
  type = "info"
) {

  element.className =
    `birth-place-status birth-place-status--${type}`;

  element.innerHTML =
    message;
}


/* =========================================================
   MAIN INITIALIZER
   ========================================================= */

export function initChartGenerator({
  formEl,
  wheelEl,
  sequenceEl,
  tableEl,
  modeToggleEl
}) {

  let mode =
    "western";

  if (modeToggleEl) {

    modeToggleEl.addEventListener(
      "change",
      (event) => {

        mode =
          event.target.value;

      }
    );

  }


  const placeInput =
    formEl.querySelector(
      "#birth-place"
    );

  const resolveButton =
    formEl.querySelector(
      "#resolve-place"
    );

  const statusElement =
    formEl.querySelector(
      "#birth-place-status"
    );

  const latitudeInput =
    formEl.querySelector(
      '[name="latitude"]'
    );

  const longitudeInput =
    formEl.querySelector(
      '[name="longitude"]'
    );

  const utcOffsetInput =
    formEl.querySelector(
      '[name="utcOffset"]'
    );

  let resolvedPlace =
    null;


  /* =======================================================
     RESOLVE LOCATION
     ======================================================= */

  async function resolveLocation() {

    const place =
      placeInput.value.trim();

    if (!place) {

      setPlaceStatus(
        statusElement,
        "Please enter your birth place.",
        "error"
      );

      return false;
    }


    const dateValue =
      formEl.querySelector(
        '[name="date"]'
      ).value;

    const timeValue =
      formEl.querySelector(
        '[name="time"]'
      ).value;

    if (!dateValue) {

      setPlaceStatus(
        statusElement,
        "Enter your birth date before resolving the location.",
        "error"
      );

      return false;
    }


    resolveButton.disabled =
      true;

    resolveButton.textContent =
      "Finding…";


    setPlaceStatus(
      statusElement,
      "Resolving your birth place…",
      "info"
    );


    try {

      const location =
        await resolveBirthPlace(
          place
        );


      const timezone =
        getTimezoneFromCoordinates(
          location.latitude,
          location.longitude
        );


      const [
        year,
        month,
        day
      ] =
        dateValue
          .split("-")
          .map(Number);


      const [
        hour,
        minute
      ] =
        (
          timeValue ||
          "12:00"
        )
          .split(":")
          .map(Number);


      const utcOffset =
        getUtcOffsetHours(
          year,
          month,
          day,
          hour,
          minute,
          timezone
        );


      resolvedPlace = {
        ...location,
        timezone,
        utcOffset
      };


      latitudeInput.value =
        location.latitude;

      longitudeInput.value =
        location.longitude;

      utcOffsetInput.value =
        utcOffset;


      setPlaceStatus(
        statusElement,
        `
          <strong>✓ Location found</strong>

          <span>
            ${location.displayName}
          </span>

          <span>
            ${formatCoordinate(
              location.latitude,
              "N",
              "S"
            )}
            ·
            ${formatCoordinate(
              location.longitude,
              "E",
              "W"
            )}
          </span>

          <span>
            ${timezone}
            ·
            ${formatUtcOffset(
              utcOffset
            )}
          </span>
        `,
        "success"
      );


      return true;

    } catch (error) {

      resolvedPlace =
        null;

      latitudeInput.value =
        "";

      longitudeInput.value =
        "";

      utcOffsetInput.value =
        "";


      setPlaceStatus(
        statusElement,
        error.message ||
          "Unable to resolve this location.",
        "error"
      );


      return false;

    } finally {

      resolveButton.disabled =
        false;

      resolveButton.textContent =
        "Find place";

    }

  }


  /* =======================================================
     FIND PLACE BUTTON
     ======================================================= */

  resolveButton.addEventListener(
    "click",
    resolveLocation
  );


  /* =======================================================
     RE-RESOLVE WHEN DATE/TIME CHANGES
     ======================================================= */

  const dateInput =
    formEl.querySelector(
      '[name="date"]'
    );

  const timeInput =
    formEl.querySelector(
      '[name="time"]'
    );


  dateInput.addEventListener(
    "change",
    () => {

      if (resolvedPlace) {
        resolveLocation();
      }

    }
  );


  timeInput.addEventListener(
    "change",
    () => {

      if (resolvedPlace) {
        resolveLocation();
      }

    }
  );


  /* =======================================================
     GENERATE CHART
     ======================================================= */

  formEl.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const dateValue =
        formEl.querySelector(
          '[name="date"]'
        ).value;

      const timeValue =
        formEl.querySelector(
          '[name="time"]'
        ).value ||
        "12:00";


      if (!dateValue) {
        return;
      }


      /*
       * Automatically resolve the place if the user
       * went directly to Generate My Birth Chart.
       */

      if (!resolvedPlace) {

        const success =
          await resolveLocation();

        if (!success) {
          return;
        }

      }


      const [
        year,
        month,
        day
      ] =
        dateValue
          .split("-")
          .map(Number);


      const [
        hour,
        minute
      ] =
        timeValue
          .split(":")
          .map(Number);


      const utcOffset =
        Number(
          utcOffsetInput.value
        );

      const latitude =
        Number(
          latitudeInput.value
        );

      const longitude =
        Number(
          longitudeInput.value
        );


      if (
        !Number.isFinite(
          utcOffset
        ) ||
        !Number.isFinite(
          latitude
        ) ||
        !Number.isFinite(
          longitude
        )
      ) {

        setPlaceStatus(
          statusElement,
          "Please resolve your birth place before generating the chart.",
          "error"
        );

        return;

      }


      await playCalculatingSequence(
        sequenceEl,
        PLANET_ORDER
      );


      /*
       * EXISTING ASTROLIGHT ENGINE
       *
       * This part intentionally remains compatible
       * with the original calculator.
       */

      const chart =
        generateBirthChart({
          year,
          month,
          day,
          hour,
          minute,
          utcOffsetHours:
            utcOffset,
          latitude,
          longitude,
          mode
        });


      renderBirthChart(
        wheelEl,
        chart
      );

      renderPlanetTable(
        tableEl,
        chart
      );

    }
  );

}


/* =========================================================
   PLANET TABLE
   ========================================================= */

function renderPlanetTable(
  tableEl,
  chart
) {

  const rows =
    PLANET_ORDER
      .map((name) => {

        const p =
          chart.planets[name];

        const v =
          chart.vedic?.planets?.[name];

        const vedicCell =
          v
            ? `<td>${v.rashi} (${toDMS(
                v.degreeInRashi
              )}) · House ${v.house}</td>`
            : "";

        return `
          <tr>

            <td>
              ${name}
            </td>

            <td>
              ${p.sign}
              (${toDMS(
                p.degreeInSign
              )})
            </td>

            <td>
              House ${p.house}
            </td>

            ${vedicCell}

          </tr>
        `;

      })
      .join("");


  const vedicHeader =
    chart.vedic
      ? "<th>Rashi (Vedic)</th>"
      : "";


  tableEl.innerHTML = `

    <p>
      <strong>Ascendant:</strong>

      ${chart.ascendant.symbol}
      ${chart.ascendant.sign}

      ${
        chart.vedic
          ? ` · Vedic: ${chart.vedic.ascendantSidereal}`
          : ""
      }

    </p>


    ${chart.warnings
      .map(
        (warning) =>
          `<p class="warning">${warning}</p>`
      )
      .join("")}


    <table class="chart-table">

      <thead>

        <tr>

          <th>Planet</th>
          <th>Sign</th>
          <th>House</th>

          ${vedicHeader}

        </tr>

      </thead>


      <tbody>
        ${rows}
      </tbody>

    </table>


    ${
      chart.vedic &&
      chart.vedic.planets.Moon.nakshatra

        ? `
          <p>
            <strong>Moon Nakshatra:</strong>

            ${chart.vedic.planets.Moon.nakshatra.name},

            Pada
            ${chart.vedic.planets.Moon.nakshatra.pada}
          </p>
        `

        : ""
    }


    <h3>
      Aspects
    </h3>


    <ul>

      ${
        chart.aspects
          .map(
            (aspect) =>
              `<li>
                ${aspect.a}
                ${aspect.aspect}
                ${aspect.b}
                (orb ${aspect.exactOrb}°)
              </li>`
          )
          .join("")

        ||
        "<li>No major aspects within orb.</li>"
      }

    </ul>

  `;

}