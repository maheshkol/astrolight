/* =========================================================
   AstroLight — Numerology Life Path Calculator
   =========================================================
   Traditional numerology calculation layer.

   - No astronomy dependencies
   - No randomization
   - Transparent arithmetic
   - Preserves Master Numbers 11, 22 and 33
   ========================================================= */

const NUMEROLOGY_ENGINE_VERSION = "1.0.0";


/* =========================================================
   Number interpretation
   ========================================================= */

const NUMBER_MEANINGS = {

  1: {
    title: "The Initiator",
    theme:
      "Traditionally associated with independence, initiative, individuality and leadership.",
    strengths: [
      "Independence",
      "Initiative",
      "Self-direction",
      "Determination"
    ],
    mindful: [
      "Impatience",
      "Excessive self-reliance",
      "Difficulty accepting other approaches"
    ]
  },


  2: {
    title: "The Harmonizer",
    theme:
      "Traditionally associated with cooperation, sensitivity, partnership and balance.",
    strengths: [
      "Cooperation",
      "Diplomacy",
      "Sensitivity",
      "Relationship awareness"
    ],
    mindful: [
      "Indecision",
      "Over-sensitivity",
      "Depending too strongly on approval"
    ]
  },


  3: {
    title: "The Communicator",
    theme:
      "Traditionally associated with creativity, expression, communication and optimism.",
    strengths: [
      "Creativity",
      "Communication",
      "Enthusiasm",
      "Self-expression"
    ],
    mindful: [
      "Scattered attention",
      "Inconsistency",
      "Avoiding difficult subjects through optimism"
    ]
  },


  4: {
    title: "The Builder",
    theme:
      "Traditionally associated with structure, discipline, practicality and steady development.",
    strengths: [
      "Discipline",
      "Reliability",
      "Practical thinking",
      "Persistence"
    ],
    mindful: [
      "Rigidity",
      "Overwork",
      "Resistance to change"
    ]
  },


  5: {
    title: "The Explorer",
    theme:
      "Traditionally associated with freedom, adaptability, experience, movement and variety.",
    strengths: [
      "Adaptability",
      "Curiosity",
      "Versatility",
      "Love of experience"
    ],
    mindful: [
      "Restlessness",
      "Impulsiveness",
      "Difficulty maintaining routines"
    ]
  },


  6: {
    title: "The Nurturer",
    theme:
      "Traditionally associated with responsibility, care, harmony, family and service.",
    strengths: [
      "Responsibility",
      "Care",
      "Loyalty",
      "Ability to create harmony"
    ],
    mindful: [
      "Taking on too much responsibility",
      "Over-protectiveness",
      "Neglecting personal needs"
    ]
  },


  7: {
    title: "The Seeker",
    theme:
      "Traditionally associated with introspection, analysis, spirituality, research and deeper understanding.",
    strengths: [
      "Analysis",
      "Introspection",
      "Research",
      "Independent thought"
    ],
    mindful: [
      "Isolation",
      "Over-analysis",
      "Difficulty sharing inner experiences"
    ]
  },


  8: {
    title: "The Executive",
    theme:
      "Traditionally associated with organization, authority, achievement, material responsibility and management.",
    strengths: [
      "Organization",
      "Leadership",
      "Strategic thinking",
      "Resource management"
    ],
    mindful: [
      "Overemphasis on control",
      "Work becoming overly dominant",
      "Measuring success only through external results"
    ]
  },


  9: {
    title: "The Humanitarian",
    theme:
      "Traditionally associated with compassion, completion, wisdom, generosity and broader humanitarian concerns.",
    strengths: [
      "Compassion",
      "Generosity",
      "Broad perspective",
      "Idealism"
    ],
    mindful: [
      "Difficulty letting go",
      "Over-giving",
      "Emotional attachment to unfinished matters"
    ]
  },


  11: {
    title: "The Inspired Messenger",
    theme:
      "Traditionally regarded as a Master Number associated with intuition, inspiration, insight and heightened sensitivity.",
    strengths: [
      "Intuition",
      "Inspiration",
      "Vision",
      "Sensitivity"
    ],
    mindful: [
      "Emotional overload",
      "Nervous tension",
      "Difficulty grounding inspiration into practical action"
    ]
  },


  22: {
    title: "The Master Builder",
    theme:
      "Traditionally regarded as a Master Number associated with large-scale practical creation, organization and turning vision into tangible results.",
    strengths: [
      "Long-term vision",
      "Organization",
      "Practical achievement",
      "Capacity to build"
    ],
    mindful: [
      "Excessive pressure",
      "Taking on unrealistic burdens",
      "Difficulty balancing vision with practical limits"
    ]
  },


  33: {
    title: "The Compassionate Teacher",
    theme:
      "Traditionally regarded as a Master Number associated with compassion, service, teaching and uplifting others.",
    strengths: [
      "Compassion",
      "Teaching",
      "Service",
      "Emotional generosity"
    ],
    mindful: [
      "Over-giving",
      "Carrying others' burdens",
      "Neglecting personal boundaries"
    ]
  }

};


/* =========================================================
   Validation
   ========================================================= */

function parseDate(value) {

  if (!value) {
    throw new Error(
      "Please enter your date of birth."
    );
  }


  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);


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
        day
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
    day
  };
}


/* =========================================================
   Digit reduction
   ========================================================= */

function digitSum(number) {

  return String(
    Math.abs(number)
  )
    .split("")
    .reduce(
      (sum, digit) =>
        sum + Number(digit),
      0
    );
}


function reduceNumber(
  number,
  preserveMaster = true
) {

  let value =
    Math.abs(
      Number(number)
    );


  while (
    value > 9 &&
    !(preserveMaster &&
      (
        value === 11 ||
        value === 22 ||
        value === 33
      ))
  ) {

    value =
      digitSum(value);

  }


  return value;
}


/* =========================================================
   Component calculation
   ========================================================= */

function calculateComponent(
  value,
  label
) {

  const original =
    Number(value);


  const digits =
    String(original)
      .split("")
      .map(Number);


  const sum =
    digits.reduce(
      (total, digit) =>
        total + digit,
      0
    );


    /*
   * Preserve Master Numbers when the original
   * component is already 11, 22 or 33.
   */
  const reduced =
    [11, 22, 33].includes(original)
      ? original
      : reduceNumber(
          sum,
          true
        );

  return {
    label,
    original,
    digits,
    sum,
    reduced
  };
}


/* =========================================================
   Life Path calculation
   ========================================================= */

function calculateLifePath({
  year,
  month,
  day
}) {

  const monthPart =
    calculateComponent(
      month,
      "Month"
    );


  const dayPart =
    calculateComponent(
      day,
      "Day"
    );


  const yearPart =
    calculateComponent(
      year,
      "Year"
    );


  const combinedTotal =
    monthPart.reduced +
    dayPart.reduced +
    yearPart.reduced;


  const lifePath =
    reduceNumber(
      combinedTotal,
      true
    );


  return {
    engineVersion:
      NUMEROLOGY_ENGINE_VERSION,

    date: {
      year,
      month,
      day
    },

    components: {
      month: monthPart,
      day: dayPart,
      year: yearPart
    },

    combinedTotal,

    lifePath,

    meaning:
      NUMBER_MEANINGS[lifePath]
  };
}


/* =========================================================
   Formatting
   ========================================================= */

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
   Render calculation
   ========================================================= */

function renderResult(
  container,
  calculation
) {

  const {
    date,
    components,
    combinedTotal,
    lifePath,
    meaning
  } = calculation;


  const componentHTML =
  Object.values(
    components
  )
    .map(component => {

      const digitText =
        component.digits.join(" + ");


      const isOriginalMasterNumber =
        [11, 22, 33].includes(
          component.original
        );


      const isReducedMasterNumber =
        [11, 22, 33].includes(
          component.reduced
        );


      let calculationText = "";
      let resultText = "";


      /*
       * If the component itself is already
       * a Master Number, preserve it directly.
       */
      if (isOriginalMasterNumber) {

        calculationText =
          `Master Number ${component.original} preserved`;

        resultText =
          `Master Number ${component.original}`;

      }


      /*
       * If the digit sum produces a Master Number,
       * show the arithmetic and explicitly explain
       * that the Master Number is preserved.
       */
      else if (isReducedMasterNumber) {

        calculationText =
          `${digitText} = ${component.sum}`;

        resultText =
          `Master Number ${component.reduced} preserved`;

      }


      /*
       * Ordinary component reduction.
       */
      else {

        calculationText =
          `${digitText} = ${component.sum}`;

        resultText =
          `Reduced value: ${component.reduced}`;

      }


      return `
        <div class="numerology-calculation-card">

          <span class="numerology-calculation-label">
            ${component.label}
          </span>

          <strong>
            ${component.original}
          </strong>

          <p>
            ${calculationText}
          </p>

          <small>
            ${resultText}
          </small>

        </div>
      `;

    })
    .join("");


  const strengthHTML =
    meaning.strengths
      .map(item =>
        `<li>${item}</li>`
      )
      .join("");


  const mindfulHTML =
    meaning.mindful
      .map(item =>
        `<li>${item}</li>`
      )
      .join("");


  container.innerHTML = `

    <div class="numerology-result-header">

      <p class="eyebrow">
        LIFE PATH NUMBER
      </p>

      <div class="numerology-number">
        ${lifePath}
      </div>

      <h2>
        ${meaning.title}
      </h2>

      <p class="numerology-result-date">
        Birth date:
        ${formatDate(date)}
      </p>

    </div>


    <section class="numerology-meaning">

      <div class="numerology-section-heading">

        <p class="eyebrow">
          TRADITIONAL NUMEROLOGY
        </p>

        <h3>
          What ${lifePath} represents
        </h3>

      </div>

      <p class="numerology-theme">
        ${meaning.theme}
      </p>


      <div class="numerology-meaning-grid">

        <article>

          <h4>
            Traditional strengths
          </h4>

          <ul>
            ${strengthHTML}
          </ul>

        </article>


        <article>

          <h4>
            Be mindful of
          </h4>

          <ul>
            ${mindfulHTML}
          </ul>

        </article>

      </div>

    </section>


    <section class="numerology-breakdown">

      <div class="numerology-section-heading">

        <p class="eyebrow">
          CALCULATION BREAKDOWN
        </p>

        <h3>
          How your number was calculated
        </h3>

      </div>


      <div class="numerology-calculation-grid">

        ${componentHTML}

      </div>


      <div class="numerology-final-calculation">

        <span>
          Combined calculation
        </span>

        <strong>
          ${components.month.reduced}
          +
          ${components.day.reduced}
          +
          ${components.year.reduced}
          =
          ${combinedTotal}
          →
          ${lifePath}
        </strong>

      </div>

    </section>


    <section class="numerology-master-note">

      <h3>
        About Master Numbers
      </h3>

      <p>
        AstroLight preserves 11, 22 and 33 during the
        reduction process. These are traditionally treated
        as Master Numbers in numerology rather than being
        immediately reduced to 2, 4 and 6.
      </p>

    </section>


    <p class="numerology-result-disclaimer">
      This interpretation reflects traditional numerology
      symbolism and is intended for educational and
      reflective use. It is not a scientific measurement
      or a deterministic prediction.
    </p>

  `;
}


/* =========================================================
   Initialise
   ========================================================= */

const form =
  document.getElementById(
    "numerology-form"
  );


const result =
  document.getElementById(
    "numerology-result"
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
          <div class="numerology-calculating">
            Calculating your Life Path Number…
          </div>
        `;


        const birthDate =
          parseDate(
            form.elements.date.value
          );


        const calculation =
          calculateLifePath(
            birthDate
          );


        renderResult(
          result,
          calculation
        );


        console.log(
          "AstroLight Numerology:",
          calculation
        );

      } catch (error) {

        console.error(
          "Numerology calculation error:",
          error
        );


        result.innerHTML = `
          <div class="numerology-error">

            <strong>
              Unable to calculate Life Path Number
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