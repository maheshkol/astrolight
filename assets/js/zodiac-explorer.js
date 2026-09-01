console.log("=== ASTROLIGHT NEW ZODIAC JS LOADED ===");

const data = window.ASTROLIGHT_ZODIAC_DATA || {};

const signs = Object.entries(data)
  .map(([slug, sign]) => ({
    slug,
    ...sign
  }))
  .sort((a, b) => a.index - b.index);

const wheel = document.getElementById("zodiac-wheel");
const grid = document.getElementById("zodiac-sign-grid");

if (!wheel || !grid || !signs.length) {
  throw new Error("AstroLight Zodiac Explorer: required elements missing.");
}

const SVG_NS = "http://www.w3.org/2000/svg";

const state = {
  selected: 0
};

function polar(cx, cy, radius, degrees) {
  const angle = (degrees - 90) * Math.PI / 180;

  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle)
  };
}

function describeArc(cx, cy, radius, start, end) {
  const p1 = polar(cx, cy, radius, start);
  const p2 = polar(cx, cy, radius, end);

  const largeArc = end - start > 180 ? 1 : 0;

  return [
    `M ${cx} ${cy}`,
    `L ${p1.x} ${p1.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    "Z"
  ].join(" ");
}

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  return element;
}


/* =========================================================
   WHEEL
   ========================================================= */

function renderWheel() {
  wheel.innerHTML = "";

  const size = 620;
  const cx = size / 2;
  const cy = size / 2;

  const svg = createSvgElement("svg", {
    viewBox: `0 0 ${size} ${size}`,
    class: "zodiac-explorer-svg",
    role: "img",
    "aria-label": "Interactive 12 sign zodiac wheel"
  });


  /* Outer rings */

  [270, 245, 205, 155].forEach((radius, index) => {
    svg.appendChild(
      createSvgElement("circle", {
        cx,
        cy,
        r: radius,
        class: `explorer-ring explorer-ring-${index + 1}`
      })
    );
  });


  /* Zodiac sectors */

  signs.forEach((sign, index) => {
    const start = index * 30;
    const end = start + 30;

    const group = createSvgElement("g", {
      class: `zodiac-sector ${
        index === state.selected ? "is-selected" : ""
      }`,
      tabindex: "0",
      role: "button",
      "aria-label": `${sign.name}, ${start} to ${end} degrees`
    });

    const sector = createSvgElement("path", {
      d: describeArc(cx, cy, 270, start + 0.6, end - 0.6),
      class: "zodiac-sector-fill"
    });

    const dividerStart = polar(cx, cy, 155, start);
    const dividerEnd = polar(cx, cy, 270, start);

    const divider = createSvgElement("line", {
      x1: dividerStart.x,
      y1: dividerStart.y,
      x2: dividerEnd.x,
      y2: dividerEnd.y,
      class: "zodiac-sector-divider"
    });

    const labelPosition = polar(cx, cy, 225, start + 15);

    const symbol = createSvgElement("text", {
      x: labelPosition.x,
      y: labelPosition.y,
      class: "zodiac-sector-symbol",
      "text-anchor": "middle",
      "dominant-baseline": "middle"
    });

    symbol.textContent = sign.symbol;

    const degreePosition = polar(cx, cy, 184, start + 15);

    const degree = createSvgElement("text", {
      x: degreePosition.x,
      y: degreePosition.y,
      class: "zodiac-sector-degree",
      "text-anchor": "middle",
      "dominant-baseline": "middle"
    });

    degree.textContent = `${start}°`;

    group.appendChild(sector);
    group.appendChild(divider);
    group.appendChild(symbol);
    group.appendChild(degree);

    group.addEventListener("click", () => {
      selectSign(index);
    });

    group.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectSign(index);
      }
    });

    svg.appendChild(group);
  });


  /* Degree ticks */

  for (let degree = 0; degree < 360; degree += 5) {
    const outer = polar(cx, cy, 282, degree);

    const inner = polar(
      cx,
      cy,
      degree % 30 === 0 ? 266 : 274,
      degree
    );

    svg.appendChild(
      createSvgElement("line", {
        x1: inner.x,
        y1: inner.y,
        x2: outer.x,
        y2: outer.y,
        class:
          degree % 30 === 0
            ? "degree-tick degree-tick-major"
            : "degree-tick"
      })
    );
  }


  /* North marker */

  const north = polar(cx, cy, 302, 0);

  const northText = createSvgElement("text", {
    x: north.x,
    y: north.y,
    class: "wheel-direction",
    "text-anchor": "middle"
  });

  northText.textContent = "0°";

  svg.appendChild(northText);


  /* =======================================================
   CENTER ARTWORK
   Image-based zodiac figures
   ======================================================= */

const centerGroup = createSvgElement("g", {
  class: "zodiac-center-art"
});

const selectedSign = signs[state.selected];

/*
 * Atmospheric center glow
 */
centerGroup.appendChild(
  createSvgElement("circle", {
    cx,
    cy,
    r: 108,
    class: "zodiac-center-glow"
  })
);

/*
 * Subtle rotating orbit
 */
centerGroup.appendChild(
  createSvgElement("circle", {
    cx,
    cy,
    r: 96,
    class: "zodiac-center-orbit"
  })
);

/*
 * Zodiac artwork
 *
 * Files live in:
 *
 * static/zodiac/
 *
 * Therefore they are available at:
 *
 * /zodiac/aries.png
 * /zodiac/taurus.png
 * etc.
 */
const figure = createSvgElement("image", {
  x: cx - 82,
  y: cy - 82,
  width: 164,
  height: 164,
  class: "zodiac-center-figure",
  preserveAspectRatio: "xMidYMid meet"
});

figure.setAttributeNS(
  "http://www.w3.org/1999/xlink",
  "href",
  `${window.ASTROLIGHT_ZODIAC_BASE_URL || ""}/${selectedSign.slug}.png`
);

figure.setAttribute(
  "aria-label",
  `${selectedSign.name} zodiac illustration`
);

centerGroup.appendChild(figure);

/*
 * Sign name
 */
const name = createSvgElement("text", {
  x: cx,
  y: cy + 105,
  class: "zodiac-center-name",
  "text-anchor": "middle"
});

name.textContent = selectedSign.name.toUpperCase();

centerGroup.appendChild(name);

/*
 * Degree range
 */
const range = createSvgElement("text", {
  x: cx,
  y: cy + 122,
  class: "zodiac-center-range",
  "text-anchor": "middle"
});

range.textContent =
  `${state.selected * 30}° — ${(state.selected + 1) * 30}°`;

centerGroup.appendChild(range);

svg.appendChild(centerGroup);

wheel.appendChild(svg);
  
}


/* =========================================================
   CARDS
   ========================================================= */

function renderCards() {
  grid.innerHTML = "";

  signs.forEach((sign, index) => {
    const start = index * 30;
    const end = start + 30;

    const link = document.createElement("a");

    link.href =
      `${window.ASTROLIGHT_ZODIAC_BASE_URL || ""}/${sign.slug}/`;

    link.className =
      `zodiac-explorer-card ${
        index === state.selected ? "is-selected" : ""
      }`;

    link.innerHTML = `
      <div class="explorer-card-top">
        <span class="explorer-symbol">${sign.symbol}</span>
        <span class="explorer-degree">${start}°</span>
      </div>

      <h3>${sign.name}</h3>

      <p class="explorer-dates">${sign.dates}</p>

      <div class="explorer-meta">
        <span>${sign.element}</span>
        <span>${sign.modality}</span>
      </div>

      <div class="explorer-ruler">
        Ruled by <strong>${sign.ruling_planet}</strong>
      </div>
    `;


    grid.appendChild(link);
  });
}


/* =========================================================
   SIGN SELECTION
   ========================================================= */

function selectSign(index) {

  state.selected = index;

  const sign = signs[index];

  const start = index * 30;
  const end = start + 30;


  document.getElementById("selected-title").textContent =
    `${sign.symbol} ${sign.name}`;

  document.getElementById("selected-dates").textContent =
    sign.dates;

  document.getElementById("selected-range").textContent =
    `${start}° — ${end}°`;

  document.getElementById("selected-element").textContent =
    sign.element;

  document.getElementById("selected-modality").textContent =
    sign.modality;

  document.getElementById("selected-ruler").textContent =
    sign.ruling_planet;


  document.getElementById("selected-description").textContent =
    `${sign.name} occupies ${start}° to ${end}° of the traditional zodiac. ` +
    `It is associated with the ${sign.element} element, ` +
    `${sign.modality.toLowerCase()} modality and ${sign.ruling_planet} ` +
    `as its traditional data-set ruler.`;


  const link =
    document.getElementById("selected-link");

  link.href =
    `${window.ASTROLIGHT_ZODIAC_BASE_URL || ""}/${sign.slug}/`;

  link.textContent =
    `Explore ${sign.name} →`;


  const progress =
    document.getElementById("degree-progress");

  progress.style.width =
    `${((index + 1) / 12) * 100}%`;


  renderWheel();

  renderCards();


  const selectedCard =
    grid.querySelector(
      ".zodiac-explorer-card.is-selected"
    );

  if (selectedCard) {

    selectedCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest"
    });

  }
}


/* =========================================================
   INITIALIZE
   ========================================================= */

renderWheel();

renderCards();

selectSign(0);