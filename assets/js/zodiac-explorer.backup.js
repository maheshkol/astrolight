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
     CENTER
     ======================================================= */

  /*
 * Center artwork
 */

const centerGroup = createSvgElement("g", {
  class: "zodiac-center-art"
});

const selectedSign = signs[state.selected];

/*
 * =========================================================
 * ARIES
 * =========================================================
 */

if (selectedSign.slug === "aries") {

  const ram = createSvgElement("g", {
    class: "aries-ram"
  });

  /* Ram head */

  ram.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx} ${cy - 48}
        C ${cx - 28} ${cy - 48},
          ${cx - 45} ${cy - 28},
          ${cx - 43} ${cy - 2}
        C ${cx - 42} ${cy + 25},
          ${cx - 23} ${cy + 42},
          ${cx} ${cy + 43}
        C ${cx + 23} ${cy + 42},
          ${cx + 42} ${cy + 25},
          ${cx + 43} ${cy - 2}
        C ${cx + 45} ${cy - 28},
          ${cx + 28} ${cy - 48},
          ${cx} ${cy - 48}
        Z
      `,
      class: "aries-ram-body"
    })
  );

  /* Left horn */

  ram.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 35} ${cy - 30}
        C ${cx - 65} ${cy - 58},
          ${cx - 74} ${cy - 25},
          ${cx - 54} ${cy - 10}
      `,
      class: "aries-ram-detail"
    })
  );

  /* Right horn */

  ram.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx + 35} ${cy - 30}
        C ${cx + 65} ${cy - 58},
          ${cx + 74} ${cy - 25},
          ${cx + 54} ${cy - 10}
      `,
      class: "aries-ram-detail"
    })
  );

  /* Face */

  ram.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 17} ${cy - 3}
        C ${cx - 10} ${cy - 10},
          ${cx - 5} ${cy - 8},
          ${cx} ${cy - 2}

        M ${cx + 17} ${cy - 3}
        C ${cx + 10} ${cy - 10},
          ${cx + 5} ${cy - 8},
          ${cx} ${cy - 2}

        M ${cx} ${cy - 2}
        L ${cx} ${cy + 25}

        M ${cx - 12} ${cy + 30}
        C ${cx - 5} ${cy + 35},
          ${cx + 5} ${cy + 35},
          ${cx + 12} ${cy + 30}
      `,
      class: "aries-ram-detail"
    })
  );

  /* Eyes */

  ram.appendChild(
    createSvgElement("circle", {
      cx: cx - 17,
      cy: cy - 3,
      r: 2,
      class: "aries-ram-eye"
    })
  );

  ram.appendChild(
    createSvgElement("circle", {
      cx: cx + 17,
      cy: cy - 3,
      r: 2,
      class: "aries-ram-eye"
    })
  );

  centerGroup.appendChild(ram);

  const name = createSvgElement("text", {
    x: cx,
    y: cy + 114,
    class: "aries-center-name",
    "text-anchor": "middle"
  });

  name.textContent = "ARIES";

  centerGroup.appendChild(name);
}


/*
 * =========================================================
 * TAURUS
 * =========================================================
 */

if (selectedSign.slug === "taurus") {

  const bull = createSvgElement("g", {
    class: "taurus-bull"
  });

  /*
   * Bull head
   */

  bull.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 43} ${cy - 5}

        C ${cx - 43} ${cy - 38},
          ${cx - 25} ${cy - 55},
          ${cx} ${cy - 57}

        C ${cx + 25} ${cy - 55},
          ${cx + 43} ${cy - 38},
          ${cx + 43} ${cy - 5}

        C ${cx + 42} ${cy + 27},
          ${cx + 25} ${cy + 45},
          ${cx} ${cy + 48}

        C ${cx - 25} ${cy + 45},
          ${cx - 42} ${cy + 27},
          ${cx - 43} ${cy - 5}

        Z
      `,
      class: "taurus-bull-body"
    })
  );

  /*
   * Left horn
   */

  bull.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 34} ${cy - 35}

        C ${cx - 62} ${cy - 46},
          ${cx - 78} ${cy - 70},
          ${cx - 69} ${cy - 88}

        C ${cx - 63} ${cy - 67},
          ${cx - 49} ${cy - 51},
          ${cx - 27} ${cy - 43}
      `,
      class: "taurus-bull-detail"
    })
  );

  /*
   * Right horn
   */

  bull.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx + 34} ${cy - 35}

        C ${cx + 62} ${cy - 46},
          ${cx + 78} ${cy - 70},
          ${cx + 69} ${cy - 88}

        C ${cx + 63} ${cy - 67},
          ${cx + 49} ${cy - 51},
          ${cx + 27} ${cy - 43}
      `,
      class: "taurus-bull-detail"
    })
  );

  /*
   * Left ear
   */

  bull.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 38} ${cy - 27}

        C ${cx - 58} ${cy - 25},
          ${cx - 67} ${cy - 10},
          ${cx - 51} ${cy + 2}
      `,
      class: "taurus-bull-detail"
    })
  );

  /*
   * Right ear
   */

  bull.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx + 38} ${cy - 27}

        C ${cx + 58} ${cy - 25},
          ${cx + 67} ${cy - 10},
          ${cx + 51} ${cy + 2}
      `,
      class: "taurus-bull-detail"
    })
  );

  /*
   * Eyes
   */

  bull.appendChild(
    createSvgElement("circle", {
      cx: cx - 18,
      cy: cy - 5,
      r: 2.3,
      class: "taurus-bull-eye"
    })
  );

  bull.appendChild(
    createSvgElement("circle", {
      cx: cx + 18,
      cy: cy - 5,
      r: 2.3,
      class: "taurus-bull-eye"
    })
  );

  /*
   * Nose
   */

  bull.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 16} ${cy + 24}

        C ${cx - 8} ${cy + 31},
          ${cx + 8} ${cy + 31},
          ${cx + 16} ${cy + 24}
      `,
      class: "taurus-bull-detail"
    })
  );

  /*
   * Nose highlights
   */

  bull.appendChild(
    createSvgElement("circle", {
      cx: cx - 7,
      cy: cy + 25,
      r: 1.4,
      class: "taurus-bull-eye"
    })
  );

  bull.appendChild(
    createSvgElement("circle", {
      cx: cx + 7,
      cy: cy + 25,
      r: 1.4,
      class: "taurus-bull-eye"
    })
  );

  centerGroup.appendChild(bull);

  const name = createSvgElement("text", {
    x: cx,
    y: cy + 114,
    class: "aries-center-name taurus-center-name",
    "text-anchor": "middle"
  });

  name.textContent = "TAURUS";

  centerGroup.appendChild(name);
}


/*
 * =========================================================
 * GEMINI
 * =========================================================
 */

if (selectedSign.slug === "gemini") {

  const twins = createSvgElement("g", {
    class: "gemini-twins"
  });

  /* Top bar */

  twins.appendChild(
    createSvgElement("line", {
      x1: cx - 24,
      y1: cy - 46,
      x2: cx + 24,
      y2: cy - 46,
      class: "gemini-detail"
    })
  );

  /* Bottom bar */

  twins.appendChild(
    createSvgElement("line", {
      x1: cx - 24,
      y1: cy + 46,
      x2: cx + 24,
      y2: cy + 46,
      class: "gemini-detail"
    })
  );

  /* Left pillar */

  twins.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 14} ${cy - 44}
        C ${cx - 22} ${cy - 15},
          ${cx - 22} ${cy + 15},
          ${cx - 14} ${cy + 44}
      `,
      class: "gemini-body"
    })
  );

  /* Right pillar */

  twins.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx + 14} ${cy - 44}
        C ${cx + 22} ${cy - 15},
          ${cx + 22} ${cy + 15},
          ${cx + 14} ${cy + 44}
      `,
      class: "gemini-body"
    })
  );

  /* Corner studs */

  [
    [cx - 24, cy - 46],
    [cx + 24, cy - 46],
    [cx - 24, cy + 46],
    [cx + 24, cy + 46]
  ].forEach(([px, py]) => {
    twins.appendChild(
      createSvgElement("circle", {
        cx: px,
        cy: py,
        r: 3,
        class: "gemini-eye"
      })
    );
  });

  centerGroup.appendChild(twins);

  const name = createSvgElement("text", {
    x: cx,
    y: cy + 114,
    class: "aries-center-name gemini-center-name",
    "text-anchor": "middle"
  });

  name.textContent = "GEMINI";

  centerGroup.appendChild(name);
}


/*
 * =========================================================
 * CANCER
 * =========================================================
 */

if (selectedSign.slug === "cancer") {

  const crab = createSvgElement("g", {
    class: "cancer-crab"
  });

  /* Shell */

  crab.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 38} ${cy}
        C ${cx - 38} ${cy - 22},
          ${cx - 20} ${cy - 35},
          ${cx} ${cy - 35}
        C ${cx + 20} ${cy - 35},
          ${cx + 38} ${cy - 22},
          ${cx + 38} ${cy}
        C ${cx + 38} ${cy + 18},
          ${cx + 20} ${cy + 30},
          ${cx} ${cy + 30}
        C ${cx - 20} ${cy + 30},
          ${cx - 38} ${cy + 18},
          ${cx - 38} ${cy}
        Z
      `,
      class: "cancer-body"
    })
  );

  /* Left claw */

  crab.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 36} ${cy - 12}
        C ${cx - 58} ${cy - 26},
          ${cx - 68} ${cy - 46},
          ${cx - 54} ${cy - 58}
        C ${cx - 48} ${cy - 47},
          ${cx - 42} ${cy - 32},
          ${cx - 28} ${cy - 16}
      `,
      class: "cancer-detail"
    })
  );

  /* Right claw */

  crab.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx + 36} ${cy - 12}
        C ${cx + 58} ${cy - 26},
          ${cx + 68} ${cy - 46},
          ${cx + 54} ${cy - 58}
        C ${cx + 48} ${cy - 47},
          ${cx + 42} ${cy - 32},
          ${cx + 28} ${cy - 16}
      `,
      class: "cancer-detail"
    })
  );

  /* Legs */

  [-1, 1].forEach(side => {
    [0, 1, 2].forEach(i => {
      crab.appendChild(
        createSvgElement("line", {
          x1: cx + side * 30,
          y1: cy + 4 + i * 7,
          x2: cx + side * 46,
          y2: cy + 14 + i * 9,
          class: "cancer-detail"
        })
      );
    });
  });

  /* Eyes */

  crab.appendChild(
    createSvgElement("circle", {
      cx: cx - 9,
      cy: cy - 18,
      r: 2.3,
      class: "cancer-eye"
    })
  );

  crab.appendChild(
    createSvgElement("circle", {
      cx: cx + 9,
      cy: cy - 18,
      r: 2.3,
      class: "cancer-eye"
    })
  );

  centerGroup.appendChild(crab);

  const name = createSvgElement("text", {
    x: cx,
    y: cy + 114,
    class: "aries-center-name cancer-center-name",
    "text-anchor": "middle"
  });

  name.textContent = "CANCER";

  centerGroup.appendChild(name);
}


/*
 * =========================================================
 * LEO
 * =========================================================
 */

if (selectedSign.slug === "leo") {

  const lion = createSvgElement("g", {
    class: "leo-lion"
  });

  /* Mane */

  lion.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 46} ${cy}
        C ${cx - 52} ${cy - 30},
          ${cx - 30} ${cy - 56},
          ${cx} ${cy - 53}
        C ${cx + 30} ${cy - 56},
          ${cx + 52} ${cy - 30},
          ${cx + 46} ${cy}
        C ${cx + 52} ${cy + 30},
          ${cx + 30} ${cy + 56},
          ${cx} ${cy + 53}
        C ${cx - 30} ${cy + 56},
          ${cx - 52} ${cy + 30},
          ${cx - 46} ${cy}
        Z
      `,
      class: "leo-mane"
    })
  );

  /* Face */

  lion.appendChild(
    createSvgElement("circle", {
      cx,
      cy,
      r: 30,
      class: "leo-body"
    })
  );

  /* Ears */

  lion.appendChild(
    createSvgElement("circle", {
      cx: cx - 16,
      cy: cy - 27,
      r: 6,
      class: "leo-detail"
    })
  );

  lion.appendChild(
    createSvgElement("circle", {
      cx: cx + 16,
      cy: cy - 27,
      r: 6,
      class: "leo-detail"
    })
  );

  /* Eyes */

  lion.appendChild(
    createSvgElement("circle", {
      cx: cx - 11,
      cy: cy - 3,
      r: 2.3,
      class: "leo-eye"
    })
  );

  lion.appendChild(
    createSvgElement("circle", {
      cx: cx + 11,
      cy: cy - 3,
      r: 2.3,
      class: "leo-eye"
    })
  );

  /* Nose and whiskers */

  lion.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 5} ${cy + 8}
        L ${cx + 5} ${cy + 8}
        L ${cx} ${cy + 14}
        Z

        M ${cx} ${cy + 14}
        L ${cx} ${cy + 20}

        M ${cx - 26} ${cy + 6}
        L ${cx - 12} ${cy + 10}

        M ${cx - 26} ${cy + 14}
        L ${cx - 12} ${cy + 14}

        M ${cx + 26} ${cy + 6}
        L ${cx + 12} ${cy + 10}

        M ${cx + 26} ${cy + 14}
        L ${cx + 12} ${cy + 14}
      `,
      class: "leo-detail"
    })
  );

  centerGroup.appendChild(lion);

  const name = createSvgElement("text", {
    x: cx,
    y: cy + 114,
    class: "aries-center-name leo-center-name",
    "text-anchor": "middle"
  });

  name.textContent = "LEO";

  centerGroup.appendChild(name);
}


/*
 * =========================================================
 * VIRGO
 * =========================================================
 */

if (selectedSign.slug === "virgo") {

  const maiden = createSvgElement("g", {
    class: "virgo-glyph"
  });

  /* Stylized M with a closing loop, echoing the traditional glyph */

  maiden.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 34} ${cy + 40}
        L ${cx - 34} ${cy - 22}
        C ${cx - 34} ${cy - 38}, ${cx - 16} ${cy - 38}, ${cx - 16} ${cy - 22}
        L ${cx - 16} ${cy + 18}
        C ${cx - 16} ${cy - 38}, ${cx + 2} ${cy - 38}, ${cx + 2} ${cy - 22}
        L ${cx + 2} ${cy + 18}
        C ${cx + 2} ${cy - 38}, ${cx + 20} ${cy - 38}, ${cx + 20} ${cy - 18}
        C ${cx + 20} ${cy - 2}, ${cx + 8} ${cy + 4}, ${cx + 20} ${cy + 12}
        C ${cx + 30} ${cy + 18}, ${cx + 30} ${cy + 30}, ${cx + 20} ${cy + 34}
        C ${cx + 12} ${cy + 37}, ${cx + 4} ${cy + 34}, ${cx + 2} ${cy + 26}
      `,
      class: "virgo-detail"
    })
  );

  centerGroup.appendChild(maiden);

  const name = createSvgElement("text", {
    x: cx,
    y: cy + 114,
    class: "aries-center-name virgo-center-name",
    "text-anchor": "middle"
  });

  name.textContent = "VIRGO";

  centerGroup.appendChild(name);
}


/*
 * =========================================================
 * LIBRA
 * =========================================================
 */

if (selectedSign.slug === "libra") {

  const scales = createSvgElement("g", {
    class: "libra-scales"
  });

  /* Stand */

  scales.appendChild(
    createSvgElement("line", {
      x1: cx,
      y1: cy - 42,
      x2: cx,
      y2: cy + 36,
      class: "libra-detail"
    })
  );

  /* Base */

  scales.appendChild(
    createSvgElement("line", {
      x1: cx - 22,
      y1: cy + 36,
      x2: cx + 22,
      y2: cy + 36,
      class: "libra-detail"
    })
  );

  /* Beam */

  scales.appendChild(
    createSvgElement("line", {
      x1: cx - 42,
      y1: cy - 24,
      x2: cx + 42,
      y2: cy - 24,
      class: "libra-detail"
    })
  );

  /* Pivot */

  scales.appendChild(
    createSvgElement("circle", {
      cx,
      cy: cy - 42,
      r: 4,
      class: "libra-eye"
    })
  );

  /* Chains and pans */

  [-1, 1].forEach(side => {
    const chainX = cx + side * 42;

    scales.appendChild(
      createSvgElement("line", {
        x1: chainX,
        y1: cy - 24,
        x2: chainX,
        y2: cy + 4,
        class: "libra-detail"
      })
    );

    scales.appendChild(
      createSvgElement("path", {
        d: `
          M ${chainX - 16} ${cy + 4}
          C ${chainX - 16} ${cy + 16},
            ${chainX + 16} ${cy + 16},
            ${chainX + 16} ${cy + 4}
        `,
        class: "libra-detail"
      })
    );
  });

  centerGroup.appendChild(scales);

  const name = createSvgElement("text", {
    x: cx,
    y: cy + 114,
    class: "aries-center-name libra-center-name",
    "text-anchor": "middle"
  });

  name.textContent = "LIBRA";

  centerGroup.appendChild(name);
}


/*
 * =========================================================
 * SCORPIO
 * =========================================================
 */

if (selectedSign.slug === "scorpio") {

  const scorpion = createSvgElement("g", {
    class: "scorpio-scorpion"
  });

  /* Body */

  scorpion.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 26} ${cy - 20}
        C ${cx - 26} ${cy - 34},
          ${cx - 12} ${cy - 40},
          ${cx} ${cy - 38}
        C ${cx + 12} ${cy - 40},
          ${cx + 26} ${cy - 34},
          ${cx + 26} ${cy - 20}
        C ${cx + 26} ${cy - 6},
          ${cx + 10} ${cy},
          ${cx} ${cy}
        C ${cx - 10} ${cy},
          ${cx - 26} ${cy - 6},
          ${cx - 26} ${cy - 20}
        Z
      `,
      class: "scorpio-body"
    })
  );

  /* Claws */

  scorpion.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 24} ${cy - 28}
        C ${cx - 44} ${cy - 40},
          ${cx - 58} ${cy - 36},
          ${cx - 56} ${cy - 20}
        C ${cx - 48} ${cy - 22},
          ${cx - 40} ${cy - 22},
          ${cx - 30} ${cy - 26}
      `,
      class: "scorpio-detail"
    })
  );

  scorpion.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx + 24} ${cy - 28}
        C ${cx + 44} ${cy - 40},
          ${cx + 58} ${cy - 36},
          ${cx + 56} ${cy - 20}
        C ${cx + 48} ${cy - 22},
          ${cx + 40} ${cy - 22},
          ${cx + 30} ${cy - 26}
      `,
      class: "scorpio-detail"
    })
  );

  /* Curling tail with stinger */

  scorpion.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 4} ${cy}
        C ${cx - 4} ${cy + 26},
          ${cx + 22} ${cy + 30},
          ${cx + 28} ${cy + 52}
        C ${cx + 32} ${cy + 68},
          ${cx + 20} ${cy + 82},
          ${cx + 4} ${cy + 76}
      `,
      class: "scorpio-detail"
    })
  );

  scorpion.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx + 4} ${cy + 76}
        L ${cx - 6} ${cy + 68}
        M ${cx + 4} ${cy + 76}
        L ${cx + 2} ${cy + 64}
      `,
      class: "scorpio-detail"
    })
  );

  /* Eyes */

  scorpion.appendChild(
    createSvgElement("circle", {
      cx: cx - 8,
      cy: cy - 20,
      r: 2,
      class: "scorpio-eye"
    })
  );

  scorpion.appendChild(
    createSvgElement("circle", {
      cx: cx + 8,
      cy: cy - 20,
      r: 2,
      class: "scorpio-eye"
    })
  );

  centerGroup.appendChild(scorpion);

  const name = createSvgElement("text", {
    x: cx,
    y: cy + 114,
    class: "aries-center-name scorpio-center-name",
    "text-anchor": "middle"
  });

  name.textContent = "SCORPIO";

  centerGroup.appendChild(name);
}


/*
 * =========================================================
 * SAGITTARIUS
 * =========================================================
 */

if (selectedSign.slug === "sagittarius") {

  const archer = createSvgElement("g", {
    class: "sagittarius-arrow"
  });

  /* Shaft */

  archer.appendChild(
    createSvgElement("line", {
      x1: cx - 38,
      y1: cy + 38,
      x2: cx + 38,
      y2: cy - 38,
      class: "sagittarius-detail"
    })
  );

  /* Arrowhead */

  archer.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx + 38} ${cy - 38}
        L ${cx + 20} ${cy - 38}
        M ${cx + 38} ${cy - 38}
        L ${cx + 38} ${cy - 20}
      `,
      class: "sagittarius-detail"
    })
  );

  /* Crossbar / fletching */

  archer.appendChild(
    createSvgElement("line", {
      x1: cx - 26,
      y1: cy + 4,
      x2: cx - 6,
      y2: cy + 24,
      class: "sagittarius-detail"
    })
  );

  centerGroup.appendChild(archer);

  const name = createSvgElement("text", {
    x: cx,
    y: cy + 114,
    class: "aries-center-name sagittarius-center-name",
    "text-anchor": "middle"
  });

  name.textContent = "SAGITTARIUS";

  centerGroup.appendChild(name);
}


/*
 * =========================================================
 * CAPRICORN
 * =========================================================
 */

if (selectedSign.slug === "capricorn") {

  const seaGoat = createSvgElement("g", {
    class: "capricorn-seagoat"
  });

  /* Head */

  seaGoat.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 30} ${cy - 30}
        C ${cx - 30} ${cy - 46},
          ${cx - 10} ${cy - 52},
          ${cx + 2} ${cy - 40}
        C ${cx + 10} ${cy - 32},
          ${cx + 6} ${cy - 18},
          ${cx - 8} ${cy - 14}
        C ${cx - 20} ${cy - 12},
          ${cx - 30} ${cy - 18},
          ${cx - 30} ${cy - 30}
        Z
      `,
      class: "capricorn-body"
    })
  );

  /* Horn */

  seaGoat.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 24} ${cy - 40}
        C ${cx - 40} ${cy - 52},
          ${cx - 44} ${cy - 68},
          ${cx - 32} ${cy - 74}
        C ${cx - 30} ${cy - 62},
          ${cx - 24} ${cy - 50},
          ${cx - 14} ${cy - 42}
      `,
      class: "capricorn-detail"
    })
  );

  /* Beard */

  seaGoat.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 8} ${cy - 14}
        L ${cx - 14} ${cy}
      `,
      class: "capricorn-detail"
    })
  );

  /* Fish-tail curl */

  seaGoat.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 8} ${cy - 14}
        C ${cx + 10} ${cy},
          ${cx + 30} ${cy + 6},
          ${cx + 40} ${cy + 24}
        C ${cx + 48} ${cy + 40},
          ${cx + 38} ${cy + 56},
          ${cx + 20} ${cy + 52}
        C ${cx + 30} ${cy + 46},
          ${cx + 30} ${cy + 36},
          ${cx + 18} ${cy + 32}
      `,
      class: "capricorn-detail"
    })
  );

  /* Eye */

  seaGoat.appendChild(
    createSvgElement("circle", {
      cx: cx - 16,
      cy: cy - 28,
      r: 2.2,
      class: "capricorn-eye"
    })
  );

  centerGroup.appendChild(seaGoat);

  const name = createSvgElement("text", {
    x: cx,
    y: cy + 114,
    class: "aries-center-name capricorn-center-name",
    "text-anchor": "middle"
  });

  name.textContent = "CAPRICORN";

  centerGroup.appendChild(name);
}


/*
 * =========================================================
 * AQUARIUS
 * =========================================================
 */

if (selectedSign.slug === "aquarius") {

  const waterBearer = createSvgElement("g", {
    class: "aquarius-waves"
  });

  [-16, 16].forEach(offsetY => {
    waterBearer.appendChild(
      createSvgElement("path", {
        d: `
          M ${cx - 42} ${cy + offsetY - 12}
          C ${cx - 32} ${cy + offsetY - 26},
            ${cx - 12} ${cy + offsetY - 26},
            ${cx - 2} ${cy + offsetY - 12}
          C ${cx + 8} ${cy + offsetY + 2},
            ${cx + 28} ${cy + offsetY + 2},
            ${cx + 38} ${cy + offsetY - 12}
        `,
        class: "aquarius-detail"
      })
    );
  });

  centerGroup.appendChild(waterBearer);

  const name = createSvgElement("text", {
    x: cx,
    y: cy + 114,
    class: "aries-center-name aquarius-center-name",
    "text-anchor": "middle"
  });

  name.textContent = "AQUARIUS";

  centerGroup.appendChild(name);
}


/*
 * =========================================================
 * PISCES
 * =========================================================
 */

if (selectedSign.slug === "pisces") {

  const fish = createSvgElement("g", {
    class: "pisces-fish"
  });

  /* Left fish arc */

  fish.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx - 12} ${cy - 46}
        C ${cx - 48} ${cy - 30},
          ${cx - 48} ${cy + 30},
          ${cx - 12} ${cy + 46}
      `,
      class: "pisces-detail"
    })
  );

  /* Right fish arc */

  fish.appendChild(
    createSvgElement("path", {
      d: `
        M ${cx + 12} ${cy - 46}
        C ${cx + 48} ${cy - 30},
          ${cx + 48} ${cy + 30},
          ${cx + 12} ${cy + 46}
      `,
      class: "pisces-detail"
    })
  );

  /* Connecting bar */

  fish.appendChild(
    createSvgElement("line", {
      x1: cx - 12,
      y1: cy,
      x2: cx + 12,
      y2: cy,
      class: "pisces-detail"
    })
  );

  /* Small fin flicks at each tip */

  [-1, 1].forEach(side => {
    [-46, 46].forEach(y => {
      fish.appendChild(
        createSvgElement("line", {
          x1: cx + side * 12,
          y1: cy + y,
          x2: cx + side * 20,
          y2: cy + y + side * 0 + (y < 0 ? -8 : 8),
          class: "pisces-detail"
        })
      );
    });
  });

  centerGroup.appendChild(fish);

  const name = createSvgElement("text", {
    x: cx,
    y: cy + 114,
    class: "aries-center-name pisces-center-name",
    "text-anchor": "middle"
  });

  name.textContent = "PISCES";

  centerGroup.appendChild(name);
}

svg.appendChild(centerGroup);
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
  href: `${window.ASTROLIGHT_BASE_URL || ""}/zodiac/${selectedSign.slug}.png`,
  x: cx - 82,
  y: cy - 82,
  width: 164,
  height: 164,
  class: "zodiac-center-figure",
  preserveAspectRatio: "xMidYMid meet"
});

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
      `${window.ASTROLIGHT_BASE_URL || ""}/zodiac/${sign.slug}/`;

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

    link.addEventListener("click", event => {

      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return;
      }

      event.preventDefault();

      selectSign(index);
    });

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
    `${window.ASTROLIGHT_BASE_URL || ""}/zodiac/${sign.slug}/`;

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