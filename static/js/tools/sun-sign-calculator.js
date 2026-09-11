/* =========================================================
   AstroLight — Sun Sign Calculator
   =========================================================
   Western / Tropical astrology.

   Calculation:
     Date
       ↓
     Astronomy Engine
       ↓
     Geocentric Sun longitude
       ↓
     Tropical zodiac
       ↓
     Sun Sign

   Date-only version:
     Uses 12:00 UTC as the calculation instant.

   Important:
     Exact birth time matters on sign-boundary dates.
   ========================================================= */


const SUN_SIGN_ENGINE_VERSION = "1.0.0";


/* =========================================================
   Zodiac
   ========================================================= */

const ZODIAC = [
  {
    name: "Aries",
    symbol: "♈",
    element: "Fire",
    modality: "Cardinal",
    ruler: "Mars",
    theme:
      "initiative, independence and direct self-expression"
  },

  {
    name: "Taurus",
    symbol: "♉",
    element: "Earth",
    modality: "Fixed",
    ruler: "Venus",
    theme:
      "stability, persistence and appreciation of tangible experience"
  },

  {
    name: "Gemini",
    symbol: "♊",
    element: "Air",
    modality: "Mutable",
    ruler: "Mercury",
    theme:
      "curiosity, communication and intellectual flexibility"
  },

  {
    name: "Cancer",
    symbol: "♋",
    element: "Water",
    modality: "Cardinal",
    ruler: "Moon",
    theme:
      "emotional awareness, belonging and protective instincts"
  },

  {
    name: "Leo",
    symbol: "♌",
    element: "Fire",
    modality: "Fixed",
    ruler: "Sun",
    theme:
      "creative expression, confidence and personal vitality"
  },

  {
    name: "Virgo",
    symbol: "♍",
    element: "Earth",
    modality: "Mutable",
    ruler: "Mercury",
    theme:
      "discernment, practical thinking and improvement"
  },

  {
    name: "Libra",
    symbol: "♎",
    element: "Air",
    modality: "Cardinal",
    ruler: "Venus",
    theme:
      "balance, cooperation and relationship awareness"
  },

  {
    name: "Scorpio",
    symbol: "♏",
    element: "Water",
    modality: "Fixed",
    ruler: "Mars",
    theme:
      "depth, determination and transformative awareness"
  },

  {
    name: "Sagittarius",
    symbol: "♐",
    element: "Fire",
    modality: "Mutable",
    ruler: "Jupiter",
    theme:
      "exploration, learning and search for meaning"
  },

  {
    name: "Capricorn",
    symbol: "♑",
    element: "Earth",
    modality: "Cardinal",
    ruler: "Saturn",
    theme:
      "discipline, responsibility and long-term development"
  },

  {
    name: "Aquarius",
    symbol: "♒",
    element: "Air",
    modality: "Fixed",
    ruler: "Saturn",
    theme:
      "independence, innovation and broader perspectives"
  },

  {
    name: "Pisces",
    symbol: "♓",
    element: "Water",
    modality: "Mutable",
    ruler: "Jupiter",
    theme:
      "imagination, sensitivity and compassionate awareness"
  }
];


/* =========================================================
   Traditional interpretations
   ========================================================= */

const SIGN_INTERPRETATIONS = {

  Aries: {
    title: "The Initiator",

    description:
      "Traditionally associated with initiative, independence, courage and direct self-expression.",

    strengths: [
      "Initiative",
      "Courage",
      "Independence",
      "Directness"
    ],

    mindful: [
      "Impatience",
      "Impulsive reactions",
      "Difficulty slowing down when reflection is useful"
    ]
  },


  Taurus: {
    title: "The Stabilizer",

    description:
      "Traditionally associated with steadiness, persistence, reliability and appreciation of tangible experience.",

    strengths: [
      "Persistence",
      "Reliability",
      "Patience",
      "Practicality"
    ],

    mindful: [
      "Stubbornness",
      "Resistance to change",
      "Over-attachment to comfort"
    ]
  },


  Gemini: {
    title: "The Communicator",

    description:
      "Traditionally associated with curiosity, communication, learning and intellectual flexibility.",

    strengths: [
      "Curiosity",
      "Communication",
      "Adaptability",
      "Learning"
    ],

    mindful: [
      "Scattered attention",
      "Overthinking",
      "Difficulty settling on one direction"
    ]
  },


  Cancer: {
    title: "The Protector",

    description:
      "Traditionally associated with emotional awareness, belonging, memory and protective instincts.",

    strengths: [
      "Sensitivity",
      "Nurturing",
      "Emotional awareness",
      "Protectiveness"
    ],

    mindful: [
      "Taking things personally",
      "Mood fluctuations",
      "Holding on to the past"
    ]
  },


  Leo: {
    title: "The Creator",

    description:
      "Traditionally associated with confidence, creativity, vitality and heartfelt self-expression.",

    strengths: [
      "Confidence",
      "Creativity",
      "Warmth",
      "Generosity"
    ],

    mindful: [
      "Sensitivity to recognition",
      "Pride",
      "Dependence on external validation"
    ]
  },


  Virgo: {
    title: "The Analyst",

    description:
      "Traditionally associated with discernment, practical intelligence, refinement and useful service.",

    strengths: [
      "Discernment",
      "Organization",
      "Practical intelligence",
      "Attention to detail"
    ],

    mindful: [
      "Over-analysis",
      "Perfectionism",
      "Excessive self-criticism"
    ]
  },


  Libra: {
    title: "The Harmonizer",

    description:
      "Traditionally associated with balance, cooperation, diplomacy and relationship awareness.",

    strengths: [
      "Diplomacy",
      "Cooperation",
      "Fairness",
      "Social awareness"
    ],

    mindful: [
      "Indecision",
      "Avoiding necessary conflict",
      "Depending too strongly on external harmony"
    ]
  },


  Scorpio: {
    title: "The Transformer",

    description:
      "Traditionally associated with depth, determination, emotional intensity and transformative awareness.",

    strengths: [
      "Determination",
      "Depth",
      "Resilience",
      "Perceptiveness"
    ],

    mindful: [
      "Holding emotions internally",
      "Suspicion",
      "Becoming fixed in intense reactions"
    ]
  },


  Sagittarius: {
    title: "The Explorer",

    description:
      "Traditionally associated with exploration, learning, optimism, freedom and the search for meaning.",

    strengths: [
      "Optimism",
      "Curiosity",
      "Exploration",
      "Broad perspective"
    ],

    mindful: [
      "Restlessness",
      "Overlooking details",
      "Moving ahead before completing what was started"
    ]
  },


  Capricorn: {
    title: "The Builder",

    description:
      "Traditionally associated with discipline, responsibility, endurance and long-term achievement.",

    strengths: [
      "Discipline",
      "Persistence",
      "Responsibility",
      "Long-term thinking"
    ],

    mindful: [
      "Excessive seriousness",
      "Overwork",
      "Being overly demanding of oneself"
    ]
  },


  Aquarius: {
    title: "The Visionary",

    description:
      "Traditionally associated with independence, innovation, intellectual freedom and broader social perspectives.",

    strengths: [
      "Originality",
      "Independence",
      "Innovation",
      "Objectivity"
    ],

    mindful: [
      "Emotional distance",
      "Stubbornness",
      "Prioritizing ideals over immediate needs"
    ]
  },


  Pisces: {
    title: "The Dreamer",

    description:
      "Traditionally associated with imagination, sensitivity, compassion and receptive awareness.",

    strengths: [
      "Imagination",
      "Empathy",
      "Compassion",
      "Intuition"
    ],

    mindful: [
      "Weak boundaries",
      "Escaping into imagination",
      "Absorbing surrounding emotions"
    ]
  }

};


/* =========================================================
   Astronomy validation
   ========================================================= */

function assertAstronomy() {

  if (
    !window.Astronomy ||
    typeof window.Astronomy.SunPosition !==
      "function"
  ) {

    throw new Error(
      "Astronomy Engine SunPosition() is not available."
    );

  }

}


/* =========================================================
   Date validation
   ========================================================= */

function parseDate(value) {

  if (!value) {

    throw new Error(
      "Please enter your birth date."
    );

  }


  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value
    );


  if (!match) {

    throw new Error(
      "Please enter a valid birth date."
    );

  }


  const year =
    Number(match[1]);

  const month =
    Number(match[2]);

  const day =
    Number(match[3]);


  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        12,
        0,
        0
      )
    );


  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {

    throw new Error(
      "The selected date is not valid."
    );

  }


  return {
    year,
    month,
    day,
    dateUTC: date
  };

}


/* =========================================================
   Tropical Sun calculation
   ========================================================= */

function calculateSunPosition(
  dateUTC
) {

  assertAstronomy();


  const sun =
    window.Astronomy.SunPosition(
      dateUTC
    );


  if (!sun) {

    throw new Error(
      "Astronomy Engine returned no Sun position."
    );

  }


  const longitude =
    Number(sun.elon);


  if (
    !Number.isFinite(longitude)
  ) {

    throw new Error(
      "Astronomy Engine returned an invalid solar longitude."
    );

  }


  const normalized =
    (
      longitude % 360 +
      360
    ) % 360;


  return {
    longitude: normalized
  };

}


/* =========================================================
   Determine sign
   ========================================================= */

function signFromLongitude(
  longitude
) {

  const index =
    Math.floor(
      longitude / 30
    );


  const sign =
    ZODIAC[index];


  if (!sign) {

    throw new Error(
      "Unable to determine the zodiac sign."
    );

  }


  const degreeInSign =
    longitude -
    index * 30;


  return {
    index,
    ...sign,
    degreeInSign
  };

}


/* =========================================================
   Formatting
   ========================================================= */

function formatDegree(
  value
) {

  const degrees =
    Math.floor(value);


  const minutes =
    Math.round(
      (value - degrees) * 60
    );


  if (minutes === 60) {

    return `${degrees + 1}° 00′`;

  }


  return (
    `${degrees}° ` +
    `${String(minutes).padStart(2, "0")}′`
  );

}


function formatDate({
  year,
  month,
  day
}) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    }
  ).format(
    new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    )
  );

}


/* =========================================================
   Render result
   ========================================================= */

function renderResult(
  container,
  birth,
  sun,
  sign
) {

  const interpretation =
    SIGN_INTERPRETATIONS[
      sign.name
    ];


  const strengths =
    interpretation.strengths
      .map(
        item =>
          `<li>${item}</li>`
      )
      .join("");


  const mindful =
    interpretation.mindful
      .map(
        item =>
          `<li>${item}</li>`
      )
      .join("");


  container.innerHTML = `

    <div class="sun-sign-result-header">

      <p class="eyebrow">
        WESTERN TROPICAL SUN
      </p>

      <div class="sun-sign-symbol">
        ${sign.symbol}
      </div>

      <h2>
        ${sign.name}
      </h2>

      <p class="sun-sign-degree">
        ${sign.degreeInSign.toFixed(6)}°
        ${sign.name}
        ·
        ${formatDegree(sign.degreeInSign)}
      </p>

      <p class="sun-sign-result-date">
        Birth date:
        ${formatDate(birth)}
      </p>

    </div>


    <section class="sun-sign-meaning">

      <div class="sun-sign-section-heading">

        <p class="eyebrow">
          TRADITIONAL WESTERN ASTROLOGY
        </p>

        <h3>
          ${interpretation.title}
        </h3>

      </div>


      <p class="sun-sign-theme">
        ${interpretation.description}
      </p>


      <div class="sun-sign-meaning-grid">

        <article>

          <h4>
            Traditional strengths
          </h4>

          <ul>
            ${strengths}
          </ul>

        </article>


        <article>

          <h4>
            Be mindful of
          </h4>

          <ul>
            ${mindful}
          </ul>

        </article>

      </div>

    </section>


    <section class="sun-sign-astronomy">

      <div class="sun-sign-section-heading">

        <p class="eyebrow">
          ASTRONOMICAL CALCULATION
        </p>

        <h3>
          Solar position
        </h3>

        <p>
          The result is based on the Sun's
          geocentric Tropical longitude.
        </p>

      </div>


      <div class="sun-sign-data-grid">

        <div class="sun-sign-data-item">

          <span>
            Tropical longitude
          </span>

          <strong>
            ${sun.longitude.toFixed(6)}°
          </strong>

        </div>


        <div class="sun-sign-data-item">

          <span>
            Zodiac sector
          </span>

          <strong>
            ${sign.name}
          </strong>

        </div>


        <div class="sun-sign-data-item">

          <span>
            Degree in sign
          </span>

          <strong>
            ${sign.degreeInSign.toFixed(6)}°
          </strong>

        </div>


        <div class="sun-sign-data-item">

          <span>
            Calculation time
          </span>

          <strong>
            12:00 UTC
          </strong>

        </div>

      </div>

    </section>


    <section class="sun-sign-framework">

      <div class="sun-sign-section-heading">

        <p class="eyebrow">
          SIGN FRAMEWORK
        </p>

        <h3>
          ${sign.name} characteristics
        </h3>

      </div>


      <div class="sun-sign-framework-grid">

        <div>
          <span>ELEMENT</span>
          <strong>${sign.element}</strong>
        </div>

        <div>
          <span>MODALITY</span>
          <strong>${sign.modality}</strong>
        </div>

        <div>
          <span>TRADITIONAL RULER</span>
          <strong>${sign.ruler}</strong>
        </div>

      </div>

    </section>


    <section class="sun-sign-pipeline">

      <div class="sun-sign-section-heading">

        <p class="eyebrow">
          CALCULATION PIPELINE
        </p>

        <h3>
          Astronomy → Tropical Zodiac
        </h3>

      </div>


      <div class="sun-sign-pipeline-grid">

        <div>
          <span>01</span>
          <strong>Birth date</strong>
          <small>Calendar input</small>
        </div>

        <div>
          <span>02</span>
          <strong>Sun position</strong>
          <small>Astronomy Engine</small>
        </div>

        <div>
          <span>03</span>
          <strong>Tropical longitude</strong>
          <small>0°–360°</small>
        </div>

        <div>
          <span>04</span>
          <strong>Sun Sign</strong>
          <small>12 × 30° sectors</small>
        </div>

      </div>

    </section>


    <div class="sun-sign-boundary-note">

      <strong>
        About sign boundaries
      </strong>

      <p>
        The Sun changes zodiac signs at a precise
        astronomical moment. Because this calculator
        uses 12:00 UTC for a date-only calculation,
        people born close to a sign boundary should
        use an exact birth time and location for
        a definitive result.
      </p>

    </div>


    <p class="sun-sign-result-disclaimer">
      The interpretation above reflects traditional
      Western astrology symbolism and is intended for
      educational and reflective use. It is not a
      scientific measurement or deterministic prediction.
    </p>

  `;

}


/* =========================================================
   Initialise
   ========================================================= */

const form =
  document.getElementById(
    "sun-sign-form"
  );


const result =
  document.getElementById(
    "sun-sign-result"
  );


if (
  form &&
  result
) {

  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      try {

        result.innerHTML = `
          <div class="sun-sign-calculating">
            Calculating the Sun's position…
          </div>
        `;


        const birth =
          parseDate(
            form.elements.date.value
          );


        const sun =
          calculateSunPosition(
            birth.dateUTC
          );


        const sign =
          signFromLongitude(
            sun.longitude
          );


        renderResult(
          result,
          birth,
          sun,
          sign
        );


        console.log(
          "AstroLight Sun Sign:",
          {
            engineVersion:
              SUN_SIGN_ENGINE_VERSION,

            birth,

            sun,

            sign
          }
        );

      } catch (error) {

        console.error(
          "Sun Sign calculation error:",
          error
        );


        result.innerHTML = `
          <div class="sun-sign-error">

            <strong>
              Unable to calculate Sun Sign
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