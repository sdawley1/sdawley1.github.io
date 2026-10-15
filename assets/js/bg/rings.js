/* Structure-factor rings: an SVG illustration behind the hero.
 * Inner empty disc = the stealthy S(k) = 0 exclusion region; outer concentric shells
 * with tapering stroke; a sparse ring of dots on the first shell. Rotation and opacity
 * breathing are CSS animations (assets/css/custom.css, .bg-rings*). */

const NS = 'http://www.w3.org/2000/svg';

export function createRings(host, opts) {
  const reduced = !!opts.reduced;
  const wrap = document.createElement('div');
  wrap.className = 'bg-rings' + (reduced ? ' bg-rings--static' : '');
  wrap.setAttribute('aria-hidden', 'true');

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '-620 -620 1240 1240');
  svg.setAttribute('width', '1240');
  svg.setAttribute('height', '1240');
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('class', 'bg-rings-spin');

  const add = (tag, attrs) => {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    g.appendChild(el);
    return el;
  };

  // exclusion disc
  add('circle', { r: 150, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.2, 'stroke-opacity': 0.5, 'stroke-dasharray': '2 7' });
  // shells
  const radii = [230, 310, 390, 470, 550, 610];
  radii.forEach((r, i) => {
    add('circle', { r, fill: 'none', stroke: 'currentColor', 'stroke-width': (2.2 - i * 0.28).toFixed(2), 'stroke-opacity': (0.9 - i * 0.11).toFixed(2) });
  });
  // dots on the first shell
  const n = 54;
  for (let i = 0; i < n; i++) {
    const th = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.05;
    const r = 230 + (Math.random() - 0.5) * 6;
    add('circle', { cx: (r * Math.cos(th)).toFixed(1), cy: (r * Math.sin(th)).toFixed(1), r: 2.2, fill: 'currentColor', 'fill-opacity': 0.9 });
  }
  // a few radial ticks between shells to suggest k-space structure
  for (let i = 0; i < 12; i++) {
    const th = (i / 12) * Math.PI * 2;
    add('line', { x1: (330 * Math.cos(th)).toFixed(1), y1: (330 * Math.sin(th)).toFixed(1), x2: (370 * Math.cos(th)).toFixed(1), y2: (370 * Math.sin(th)).toFixed(1), stroke: 'currentColor', 'stroke-width': 1, 'stroke-opacity': 0.5 });
  }

  svg.appendChild(g);
  wrap.appendChild(svg);
  host.appendChild(wrap);

  let raf = 0;
  function onScroll() {
    if (raf || reduced) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      wrap.style.transform = 'translate3d(-50%,' + (-window.scrollY * 0.15) + 'px,0)';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  return {
    name: 'rings',
    recolor() {},
    destroy() {
      window.removeEventListener('scroll', onScroll);
      wrap.remove();
    },
  };
}
