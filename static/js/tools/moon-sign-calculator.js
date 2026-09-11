/**
 * AstroLight — Moon Sign & Nakshatra Calculator
 *
 * Integration/UI layer.
 *
 * IMPORTANT:
 * Vedic mathematical logic remains isolated in:
 *
 *   static/js/vedic/
 *
 * This file uses the proven AstroLight Birth Chart
 * place-resolution pattern:
 *
 *   Nominatim → coordinates → tzlookup → IANA timezone
 *   → historical UTC offset → local time → UTC
 *
 * Then:
 *
 *   Astronomy Engine → tropical geocentric Moon
 *   → independent Vedic engine → Rashi/Nakshatra/Pada
 */

const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";


/* ==================================================
   Independent Vedic engine
   ================================================== */

async function loadVedicEngine() {
  const mod =
    await import("../vedic/index.js?v=2");

  if (
    !mod ||
    typeof mod.calculateVedicMoon !== "function"
  ) {
    throw new Error(
      "The AstroLight Vedic engine could not be loaded."
    );
  }

  return mod;
}


/* ==================================================
   Traditional Vedic interpretation
   ================================================== */

async function loadVedicMoonInterpretation() {
  const mod =
    await import("../vedic/vedic-moon-interpretation.js?v=1");

  if (
    !mod ||
    typeof mod.interpretVedicMoon !== "function"
  ) {
    throw new Error(
      "The AstroLight Vedic Moon interpretation module could not be loaded."
    );
  }

  return mod;
}


/* ==================================================
   Astronomy Engine
   ================================================== */

function assertAstronomy() {
  if (
    !window.Astronomy ||
    typeof window.Astronomy.EclipticGeoMoon !==
      "function"
  ) {
    throw new Error(
      "Astronomy Engine EclipticGeoMoon() is not available."
    );
  }
}


function calculateAstronomicalMoon(dateUTC) {
  assertAstronomy();

  const moon =
    window.Astronomy.EclipticGeoMoon(
      dateUTC
    );

  if (!moon) {
    throw new Error(
      "Astronomy Engine returned no Moon position."
    );
  }

  const longitude =
    Number(moon.lon);

  const latitude =
    Number(moon.lat);

  const distanceAU =
    Number(moon.dist);

  if (!Number.isFinite(longitude)) {
    throw new Error(
      "Astronomy Engine returned an invalid Moon longitude."
    );
  }

  return {
    longitude,
    latitude,
    distanceAU
  };
}


/* ==================================================
   Birth data
   ================================================== */

function parseBirthDate(form) {
  const dateValue =
    form.elements.date?.value;

  const timeValue =
    form.elements.time?.value;

  if (!dateValue) {
    throw new Error(
      "Please enter your birth date."
    );
  }

  if (!timeValue) {
    throw new Error(
      "Please enter your birth time."
    );
  }

  const [year, month, day] =
    dateValue
      .split("-")
      .map(Number);

  const [hour, minute] =
    timeValue
      .split(":")
      .map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    !Number.isInteger(hour) ||
    !Number.isInteger(minute)
  ) {
    throw new Error(
      "Please enter a valid birth date and time."
    );
  }

  return {
    year,
    month,
    day,
    hour,
    minute
  };
}


/* ==================================================
   Proven historical UTC offset resolver
   ================================================== */

function getUtcOffsetHours(
  year,
  month,
  day,
  hour,
  minute,
  timezone
) {
  if (!timezone) {
    throw new Error(
      "No IANA timezone was returned for this location."
    );
  }

  const formatter =
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
    );


  function readLocalAsUTC(
    milliseconds
  ) {
    const parts =
      formatter.formatToParts(
        new Date(milliseconds)
      );

    const values = {};

    for (const part of parts) {
      if (part.type !== "literal") {
        values[part.type] =
          part.value;
      }
    }

    return Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      Number(values.hour),
      Number(values.minute),
      Number(values.second)
    );
  }


  /*
   * First probe.
   */
  const probe1 =
    Date.UTC(
      year,
      month - 1,
      day,
      hour,
      minute,
      0
    );


  const local1 =
    readLocalAsUTC(
      probe1
    );


  let offset =
    (local1 - probe1) /
    3600000;


  /*
   * Second probe using the estimated offset.
   *
   * This is the same two-pass approach used by
   * the working Birth Chart resolver.
   */
  const probe2 =
    probe1 -
    offset * 3600000;


  const local2 =
    readLocalAsUTC(
      probe2
    );


  offset =
    (local2 - probe2) /
    3600000;


  if (!Number.isFinite(offset)) {
    throw new Error(
      `Unable to determine historical UTC offset for ${timezone}.`
    );
  }


  return offset;
}


/* ==================================================
   Local birth time → UTC
   ================================================== */

function birthDateUTC(
  birth,
  utcOffsetHours
) {
  const milliseconds =
    Date.UTC(
      birth.year,
      birth.month - 1,
      birth.day,
      birth.hour,
      birth.minute,
      0
    ) -
    utcOffsetHours *
      3600000;


  const dateUTC =
    new Date(
      milliseconds
    );


  if (
    Number.isNaN(
      dateUTC.getTime()
    )
  ) {
    throw new Error(
      "Unable to construct the UTC birth time."
    );
  }


  return dateUTC;
}


/* ==================================================
   Nominatim place search
   ================================================== */

async function searchBirthPlace(
  place
) {
  const query =
    String(place || "").trim();


  if (!query) {
    throw new Error(
      "Please enter your birth place."
    );
  }


  const url =
    new URL(
      NOMINATIM_URL
    );


  url.searchParams.set(
    "format",
    "jsonv2"
  );

  url.searchParams.set(
    "q",
    query
  );

  url.searchParams.set(
    "limit",
    "1"
  );

  url.searchParams.set(
    "addressdetails",
    "1"
  );


  const response =
    await fetch(
      url.toString(),
      {
        method: "GET",

        headers: {
          Accept:
            "application/json",

          "Accept-Language":
            "en"
        }
      }
    );


  if (!response.ok) {
    throw new Error(
      `Place search failed (${response.status}).`
    );
  }


  const results =
    await response.json();


  if (
    !Array.isArray(results) ||
    results.length === 0
  ) {
    throw new Error(
      `No location found for "${query}".`
    );
  }


  const result =
    results[0];


  const latitude =
    Number(result.lat);


  const longitude =
    Number(result.lon);


  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    throw new Error(
      "The selected location has invalid coordinates."
    );
  }


  return {
    displayName:
      result.display_name,

    latitude,

    longitude
  };
}


/* ==================================================
   Coordinates → timezone
   ================================================== */

function getTimezoneFromCoordinates(
  latitude,
  longitude
) {
  if (
    typeof window.tzlookup !==
      "function"
  ) {
    throw new Error(
      "Timezone lookup library is not available."
    );
  }


  const timezone =
    window.tzlookup(
      latitude,
      longitude
    );


  if (!timezone) {
    throw new Error(
      "Unable to determine the timezone for this location."
    );
  }


  return timezone;
}


/* ==================================================
   Complete place resolver
   ================================================== */

async function resolveBirthPlace(
  place,
  birth
) {
  const location =
    await searchBirthPlace(
      place
    );


  location.timezone =
    getTimezoneFromCoordinates(
      location.latitude,
      location.longitude
    );


  location.utcOffsetHours =
    getUtcOffsetHours(
      birth.year,
      birth.month,
      birth.day,
      birth.hour,
      birth.minute,
      location.timezone
    );


  return location;
}


/* ==================================================
   Formatting
   ================================================== */

function formatCoordinate(
  value,
  positive,
  negative
) {
  return (
    `${Math.abs(value).toFixed(4)}° ` +
    `${value >= 0 ? positive : negative}`
  );
}


function formatUtcOffset(
  offset
) {
  if (
    Math.abs(offset) <
      0.000001
  ) {
    return "UTC ±00:00";
  }


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
      (absolute - hours) *
        60
    );


  return (
    `UTC ${sign}` +
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}`
  );
}


/* ==================================================
   Place status
   ================================================== */

function setPlaceStatus(
  element,
  type,
  html
) {
  if (!element) {
    return;
  }


  element.className =
    `birth-place-status birth-place-status--${type}`;


  element.innerHTML =
    html;
}


/* ==================================================
   Confirmation modal
   ================================================== */

function createPlaceConfirmationModal() {
  let modal =
    document.getElementById(
      "birth-place-confirmation"
    );


  if (modal) {
    return modal;
  }


  modal =
    document.createElement(
      "div"
    );


  modal.id =
    "birth-place-confirmation";


  modal.className =
    "birth-place-modal";


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  modal.innerHTML = `
    <div
      class="birth-place-modal-backdrop"
      data-place-modal-close
    ></div>

    <div
      class="birth-place-modal-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="birth-place-modal-title"
    >
      <div class="birth-place-modal-kicker">
        CONFIRM BIRTH PLACE
      </div>

      <h2 id="birth-place-modal-title">
        Is this your birth place?
      </h2>

      <p class="birth-place-modal-intro">
        AstroLight found the following location.
        Please confirm it before calculating your
        Moon Sign and Nakshatra.
      </p>

      <div
        id="birth-place-modal-details"
        class="birth-place-modal-details"
      ></div>

      <div class="birth-place-modal-actions">
        <button
          type="button"
          class="birth-place-modal-change"
          data-place-modal-change
        >
          Change place
        </button>

        <button
          type="button"
          class="birth-place-modal-confirm"
          data-place-modal-confirm
        >
          Confirm this place
        </button>
      </div>
    </div>
  `;


  document.body.appendChild(
    modal
  );


  return modal;
}


function showPlaceConfirmation(
  modal,
  location,
  onConfirm
) {
  const details =
    modal.querySelector(
      "#birth-place-modal-details"
    );


  details.innerHTML = `
    <div class="birth-place-confirm-row">
      <span>PLACE</span>
      <strong>
        ${location.displayName}
      </strong>
    </div>

    <div class="birth-place-confirm-row">
      <span>COORDINATES</span>
      <strong>
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
      </strong>
    </div>

    <div class="birth-place-confirm-row">
      <span>TIMEZONE</span>
      <strong>
        ${location.timezone}
      </strong>
    </div>

    <div class="birth-place-confirm-row">
      <span>UTC OFFSET</span>
      <strong>
        ${formatUtcOffset(
          location.utcOffsetHours
        )}
      </strong>
    </div>
  `;


  modal.classList.add(
    "is-open"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  const close =
    () => {
      modal.classList.remove(
        "is-open"
      );

      modal.setAttribute(
        "aria-hidden",
        "true"
      );
    };


  modal.querySelector(
    "[data-place-modal-confirm]"
  ).onclick =
    () => {
      close();
      onConfirm();
    };


  modal.querySelector(
    "[data-place-modal-change]"
  ).onclick =
    () => {
      close();

      document
        .getElementById(
          "moon-sign-place"
        )
        ?.focus();
    };


  modal.querySelector(
    "[data-place-modal-close]"
  ).onclick =
    close;
}


/* ==================================================
   Astronomy → Vedic
   ================================================== */

async function calculateMoonDetails(
  dateUTC
) {
  const astronomicalMoon =
    calculateAstronomicalMoon(
      dateUTC
    );


  const {
    calculateVedicMoon
  } =
    await loadVedicEngine();


  const vedicMoon =
    calculateVedicMoon({
      tropicalMoonLongitude:
        astronomicalMoon.longitude,

      dateUTC
    });


  return {
    astronomicalMoon,
    vedicMoon
  };
}


/* ==================================================
   Render detailed result
   ================================================== */

async function renderResult(
  container,
  calculation,
  location,
  dateUTC
) {
  const {
    formatDegreesDMS
  } =
    await loadVedicEngine();

  const {
  interpretVedicMoon
} =
  await loadVedicMoonInterpretation();


  const {
    astronomicalMoon,
    vedicMoon
  } =
    calculation;


  const rashi =
    vedicMoon.rashi;


  const nakshatra =
    vedicMoon.nakshatra;

  const interpretation =
  interpretVedicMoon({
    rashi,
    nakshatra,
    pada: vedicMoon.pada
  });


  container.innerHTML = `
    <div class="moon-result-hero">
      <div class="moon-result-kicker">
        VEDIC MOON
      </div>

      <div class="moon-result-symbol">
        ${rashi.symbol}
      </div>

      <h2>
        ${rashi.name}
        <span>
          ${rashi.sanskrit}
        </span>
      </h2>

      <p>
        ${rashi.degreeInSign.toFixed(6)}°
        in ${rashi.name}
      </p>
    </div>


    <div class="moon-result-grid">

      <div class="moon-result-card">
        <span class="moon-result-label">
          RASHI
        </span>

        <strong>
          ${rashi.name}
        </strong>

        <small>
          ${rashi.sanskrit}
        </small>
      </div>


      <div class="moon-result-card">
        <span class="moon-result-label">
          NAKSHATRA
        </span>

        <strong>
          ${nakshatra.name}
        </strong>

        <small>
          ${nakshatra.number}. Nakshatra
        </small>
      </div>


      <div class="moon-result-card">
        <span class="moon-result-label">
          PADA
        </span>

        <strong>
          ${vedicMoon.pada}
        </strong>

        <small>
          ${nakshatra.name} · Pada ${vedicMoon.pada}
        </small>
      </div>


      <div class="moon-result-card">
        <span class="moon-result-label">
          NAKSHATRA LORD
        </span>

        <strong>
          ${nakshatra.lord}
        </strong>

        <small>
          Traditional Vedic ruler
        </small>
      </div>

    </div>


    <section class="moon-result-section">

      <div class="moon-result-section-heading">
        <span>
          ASTRONOMICAL POSITION
        </span>

        <h3>
          Geocentric Moon
        </h3>

        <p>
          Astronomy Engine provides the geocentric
          tropical Moon position used by the
          independent Vedic engine.
        </p>
      </div>


      <div class="moon-data-grid">

        <div class="moon-data-item">
          <span>
            Tropical longitude
          </span>

          <strong>
            ${astronomicalMoon.longitude.toFixed(6)}°
          </strong>
        </div>


        <div class="moon-data-item">
          <span>
            Ecliptic latitude
          </span>

          <strong>
            ${astronomicalMoon.latitude.toFixed(6)}°
          </strong>
        </div>


        <div class="moon-data-item">
          <span>
            Moon distance
          </span>

          <strong>
            ${Number.isFinite(
              astronomicalMoon.distanceAU
            )
              ? astronomicalMoon.distanceAU.toFixed(8)
              : "—"}
            AU
          </strong>
        </div>

      </div>

    </section>


    <section class="moon-result-section">

      <div class="moon-result-section-heading">
        <span>
          SIDEREAL CONVERSION
        </span>

        <h3>
          Lahiri / Chitrapaksha
        </h3>

        <p>
          The independent AstroLight Vedic engine
          performs the tropical-to-sidereal conversion.
        </p>
      </div>


      <div class="moon-data-grid">

        <div class="moon-data-item">
          <span>
            Lahiri ayanamsha
          </span>

          <strong>
            ${vedicMoon.ayanamsha.toFixed(6)}°
          </strong>

          <small>
            ${formatDegreesDMS(
              vedicMoon.ayanamsha
            )}
          </small>
        </div>


        <div class="moon-data-item">
          <span>
            Tropical longitude
          </span>

          <strong>
            ${vedicMoon.tropicalLongitude.toFixed(6)}°
          </strong>
        </div>


        <div class="moon-data-item">
          <span>
            Sidereal longitude
          </span>

          <strong>
            ${vedicMoon.siderealLongitude.toFixed(6)}°
          </strong>
        </div>

      </div>


      <div class="moon-formula">

        <span>
          Conversion
        </span>

        <strong>
          ${vedicMoon.tropicalLongitude.toFixed(6)}°
          −
          ${vedicMoon.ayanamsha.toFixed(6)}°
          =
          ${vedicMoon.siderealLongitude.toFixed(6)}°
        </strong>

      </div>

    </section>


    <section class="moon-result-section">

      <div class="moon-result-section-heading">
        <span>
          VEDIC MOON POSITION
        </span>

        <h3>
          Rashi, Nakshatra & Pada
        </h3>

        <p>
          These values come directly from the
          independent AstroLight Vedic engine.
        </p>
      </div>


      <div class="moon-data-grid">

        <div class="moon-data-item">
          <span>
            Rashi
          </span>

          <strong>
            ${rashi.symbol}
            ${rashi.name}
          </strong>

          <small>
            ${rashi.sanskrit}
          </small>
        </div>


        <div class="moon-data-item">
          <span>
            Degree in Rashi
          </span>

          <strong>
            ${rashi.degreeInSign.toFixed(6)}°
          </strong>
        </div>


        <div class="moon-data-item">
          <span>
            Nakshatra
          </span>

          <strong>
            ${nakshatra.number}.
            ${nakshatra.name}
          </strong>
        </div>


        <div class="moon-data-item">
          <span>
            Nakshatra Lord
          </span>

          <strong>
            ${nakshatra.lord}
          </strong>
        </div>


        <div class="moon-data-item">
          <span>
            Pada
          </span>

          <strong>
            ${vedicMoon.pada}
          </strong>
        </div>

      </div>

    </section>

        <section class="moon-result-section">

      <div class="moon-result-section-heading">

        <span>
          TRADITIONAL JYOTISHA INTERPRETATION
        </span>

        <h3>
          Moon symbolism
        </h3>

        <p>
          The following interpretation is based on
          traditional Jyotisha symbolism and is kept
          separate from the astronomical calculation.
        </p>

      </div>


      <div class="moon-interpretation-grid">

        <article class="moon-interpretation-card">

          <span class="moon-result-label">
            RASHI
          </span>

          <h4>
            ${interpretation.rashi.name}
          </h4>

          <p>
            ${interpretation.rashi.theme}.
          </p>

          <strong>
            Traditional strengths
          </strong>

          <p>
            ${interpretation.rashi.strengths}.
          </p>

          <strong>
            Areas for reflection
          </strong>

          <p>
            ${interpretation.rashi.mindful}.
          </p>

        </article>


        <article class="moon-interpretation-card">

          <span class="moon-result-label">
            NAKSHATRA
          </span>

          <h4>
            ${interpretation.nakshatra.name}
          </h4>

          <p>
            Traditionally associated with
            ${interpretation.nakshatra.theme}.
          </p>

          <strong>
            Traditional emphasis
          </strong>

          <p>
            ${interpretation.nakshatra.strength}.
          </p>

        </article>


        <article class="moon-interpretation-card">

          <span class="moon-result-label">
            PADA ${interpretation.pada.number}
          </span>

          <h4>
            Pada interpretation
          </h4>

          <p>
            ${interpretation.pada.interpretation}
          </p>

        </article>

      </div>


      <p class="moon-interpretation-summary">
        ${interpretation.combinedSummary}
      </p>


      <p class="moon-interpretation-disclaimer">
        ${interpretation.disclaimer}
      </p>

    </section>


    <section class="moon-result-section">

      <div class="moon-result-section-heading">
        <span>
          BIRTH DATA USED
        </span>

        <h3>
          Calculation reference
        </h3>
      </div>


      <div class="moon-data-grid">

        <div class="moon-data-item">
          <span>
            Birth place
          </span>

          <strong>
            ${location.displayName}
          </strong>
        </div>


        <div class="moon-data-item">
          <span>
            Coordinates
          </span>

          <strong>
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
          </strong>
        </div>


        <div class="moon-data-item">
          <span>
            Timezone
          </span>

          <strong>
            ${location.timezone}
          </strong>
        </div>


        <div class="moon-data-item">
          <span>
            Historical UTC offset
          </span>

          <strong>
            ${formatUtcOffset(
              location.utcOffsetHours
            )}
          </strong>
        </div>


        <div class="moon-data-item">
          <span>
            Birth time UTC
          </span>

          <strong>
            ${dateUTC.toISOString()}
          </strong>
        </div>

      </div>

    </section>


    <section class="moon-result-section">

      <div class="moon-result-section-heading">
        <span>
          CALCULATION PIPELINE
        </span>

        <h3>
          Astronomy → Vedic
        </h3>

        <p>
          The astronomical and Vedic calculation
          layers remain independent.
        </p>
      </div>


      <div class="moon-pipeline">

        <div>
          <span>01</span>
          <strong>Tropical Moon</strong>
          <small>Astronomy Engine</small>
        </div>

        <div>
          <span>02</span>
          <strong>Lahiri Ayanamsha</strong>
          <small>Independent Vedic engine</small>
        </div>

        <div>
          <span>03</span>
          <strong>Sidereal Moon</strong>
          <small>Tropical − ayanamsha</small>
        </div>

        <div>
          <span>04</span>
          <strong>Rashi</strong>
          <small>30° sidereal sectors</small>
        </div>

        <div>
          <span>05</span>
          <strong>Nakshatra + Pada</strong>
          <small>27 Nakshatras / 4 Padas</small>
        </div>

      </div>

    </section>


    <p class="moon-result-note">
      AstroLight first determines the astronomical
      geocentric tropical Moon position. That longitude
      is then passed to the independent Vedic/Sidereal
      engine for Lahiri conversion, Rashi, Nakshatra
      and Pada resolution.
    </p>
  `;
}


/* ==================================================
   Initialise calculator
   ================================================== */

export function initMoonSignCalculator({
  formEl,
  resultEl,
  placeInputEl,
  resolvePlaceButtonEl,
  placeStatusEl
}) {
  if (!formEl) {
    throw new Error(
      "Moon Sign calculator form not found."
    );
  }

  if (!resultEl) {
    throw new Error(
      "Moon Sign calculator result element not found."
    );
  }

  let resolvedLocation = null;
  let locationConfirmed = false;

  const confirmationModal =
    createPlaceConfirmationModal();


  /* -----------------------------------------------
     Find Place
     ----------------------------------------------- */

  async function resolveLocation() {
    const place =
      (
        placeInputEl?.value ||
        formEl.elements.birthPlace?.value ||
        ""
      ).trim();


    if (!place) {
      throw new Error(
        "Please enter your birth place."
      );
    }


    const birth =
      parseBirthDate(
        formEl
      );


    setPlaceStatus(
      placeStatusEl,
      "info",
      `
        <strong>
          Finding location…
        </strong>

        <span>
          Searching for ${place}
        </span>
      `
    );


    const location =
      await resolveBirthPlace(
        place,
        birth
      );


    /*
     * Keep the resolved place pending until the
     * user explicitly confirms it.
     */
    resolvedLocation =
      location;

    locationConfirmed =
      false;


    showPlaceConfirmation(
      confirmationModal,
      location,
      () => {

        locationConfirmed =
          true;


        setPlaceStatus(
          placeStatusEl,
          "success",
          `
            <strong>
              ✓ Birth place confirmed
            </strong>

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
              ${location.timezone}
              ·
              ${formatUtcOffset(
                location.utcOffsetHours
              )}
            </span>
          `
        );

      }
    );


    return location;
  }


  if (resolvePlaceButtonEl) {
    resolvePlaceButtonEl.addEventListener(
      "click",
      async () => {

        try {

          await resolveLocation();

        } catch (error) {

          resolvedLocation =
            null;

          locationConfirmed =
            false;

          setPlaceStatus(
            placeStatusEl,
            "error",
            `
              <strong>
                Unable to find place
              </strong>

              <span>
                ${error.message}
              </span>
            `
          );

        }

      }
    );
  }


  /* -----------------------------------------------
     Editing place invalidates confirmation
     ----------------------------------------------- */

  if (placeInputEl) {
    placeInputEl.addEventListener(
      "input",
      () => {

        resolvedLocation =
          null;

        locationConfirmed =
          false;

        if (placeStatusEl) {
          placeStatusEl.innerHTML =
            "";

          placeStatusEl.className =
            "birth-place-status";
        }

      }
    );
  }


  /* -----------------------------------------------
     Calculate
     ----------------------------------------------- */

  formEl.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      try {

        resultEl.innerHTML = `
          <div class="moon-calculating">
            Calculating the astronomical Moon position…
          </div>
        `;


        const birth =
          parseBirthDate(
            formEl
          );


        /*
         * Never silently calculate against an
         * unconfirmed location.
         */
        if (
          !resolvedLocation ||
          !locationConfirmed
        ) {

          await resolveLocation();


          resultEl.innerHTML = `
            <div class="moon-calculating">
              Please confirm the birth place above,
              then click Calculate again.
            </div>
          `;


          return;
        }


        const location =
          resolvedLocation;


        /*
         * Recalculate historical offset for the
         * exact birth date/time.
         */
        location.utcOffsetHours =
          getUtcOffsetHours(
            birth.year,
            birth.month,
            birth.day,
            birth.hour,
            birth.minute,
            location.timezone
          );


        const utcOffsetField =
          formEl.elements.utcOffset ||
          document.getElementById(
            "birth-utc-offset"
          );


        const latitudeField =
          formEl.elements.latitude ||
          document.getElementById(
            "birth-latitude"
          );


        const longitudeField =
          formEl.elements.longitude ||
          document.getElementById(
            "birth-longitude"
          );


        if (utcOffsetField) {
          utcOffsetField.value =
            location.utcOffsetHours;
        }


        if (latitudeField) {
          latitudeField.value =
            location.latitude;
        }


        if (longitudeField) {
          longitudeField.value =
            location.longitude;
        }


        /*
         * Local birth time → UTC.
         */
        const dateUTC =
          birthDateUTC(
            birth,
            location.utcOffsetHours
          );


        /*
         * Astronomy → independent Vedic engine.
         */
        const calculation =
          await calculateMoonDetails(
            dateUTC
          );


        await renderResult(
          resultEl,
          calculation,
          location,
          dateUTC
        );


        console.group(
          "AstroLight Moon Sign & Nakshatra"
        );


        console.log(
          "Birth data:",
          birth
        );


        console.log(
          "Birth UTC:",
          dateUTC.toISOString()
        );


        console.log(
          "Resolved location:",
          location
        );


        console.log(
          "Astronomical Moon:",
          calculation.astronomicalMoon
        );


        console.log(
          "Vedic Moon:",
          calculation.vedicMoon
        );


        console.groupEnd();

      } catch (error) {

        console.error(
          "Moon Sign calculator error:",
          error
        );


        resultEl.innerHTML = `
          <div class="moon-calculation-error">

            <strong>
              Unable to calculate Moon Sign
            </strong>

            <p>
              ${error.message}
            </p>

          </div>
        `;

      }

    }
  );
}


/* ==================================================
   DOM initialisation
   ================================================== */

const moonSignForm =
  document.getElementById(
    "moon-sign-form"
  ) ||
  document.getElementById(
    "moon-sign-calculator-form"
  );


const moonSignResult =
  document.getElementById(
    "moon-sign-result"
  );


  const birthPlaceInput =
  document.getElementById(
    "moon-sign-place"
  ) ||
  moonSignForm?.elements?.birthPlace;


const findPlaceButton =
  document.getElementById(
    "resolve-moon-sign-place"
  );


const birthPlaceStatus =
  document.getElementById(
    "moon-sign-place-status"
  );


if (
  moonSignForm &&
  moonSignResult
) {

  initMoonSignCalculator({
    formEl:
      moonSignForm,

    resultEl:
      moonSignResult,

    placeInputEl:
      birthPlaceInput,

    resolvePlaceButtonEl:
      findPlaceButton,

    placeStatusEl:
      birthPlaceStatus
  });

} else {

  console.error(
    "AstroLight Moon Sign Calculator: required DOM elements were not found.",
    {
      form:
        Boolean(moonSignForm),

      result:
        Boolean(moonSignResult),

      birthPlace:
        Boolean(birthPlaceInput),

      findPlace:
        Boolean(findPlaceButton),

      status:
        Boolean(birthPlaceStatus)
    }
  );

}
