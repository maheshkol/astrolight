export function renderStarField(canvas, options = {}) {
  const { starCount = 160 } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let stars = [];

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.25 + .25,
      phase: Math.random() * Math.PI * 2,
      speed: .35 + Math.random() * 1.25,
      drift: (.08 + Math.random() * .22) * (Math.random() > .5 ? 1 : -1),
    }));
    draw(0);
  }

  function draw(timeMs) {
    ctx.clearRect(0, 0, width, height);
    const t = timeMs / 1000;
    for (const star of stars) {
      const twinkle = reduced ? .75 : .45 + .55 * Math.sin(t * star.speed + star.phase);
      const x = reduced ? star.x : (star.x + t * star.drift) % width;
      const alpha = .15 + twinkle * .65;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x < 0 ? x + width : x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduced) requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
}
