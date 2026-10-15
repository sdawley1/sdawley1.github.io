/* Page background layer manager.
 * Reads the configured layers from #page-bg data attributes (set by
 * layouts/_partials/hooks/body-end/page-background.html), applies runtime overrides
 * (?bg=a,b for a one-off; ?bglab for the interactive switcher persisted in localStorage),
 * mounts the layers, and keeps them in sync with theme changes. */

import { createField } from './field.js';
import { createRings } from './rings.js';

const LAYERS = ['field', 'relax', 'rings', 'aurora'];
const LS_KEY = 'bg-lab';
const MOTIONS = ['subtle', 'medium', 'lively'];
const normMotion = (m) => (MOTIONS.includes(m) ? m : 'subtle');

function createAurora(host) {
  const wrap = document.createElement('div');
  wrap.className = 'bg-aurora';
  wrap.setAttribute('aria-hidden', 'true');
  for (let i = 1; i <= 3; i++) {
    const orb = document.createElement('div');
    orb.className = 'bg-aurora-orb bg-aurora-orb--' + i;
    wrap.appendChild(orb);
  }
  const grain = document.createElement('div');
  grain.className = 'bg-grain';
  wrap.appendChild(grain);
  host.appendChild(wrap);
  return { name: 'aurora', recolor() {}, destroy() { wrap.remove(); } };
}

function parseConfig(el) {
  const cfg = {
    layers: (el.dataset.bgLayers || 'field').split(',').map((s) => s.trim()).filter((s) => LAYERS.includes(s)),
    motion: normMotion(el.dataset.bgMotion),
    interact: el.dataset.bgInteract !== 'false',
  };
  const q = new URLSearchParams(location.search);
  const lab = q.has('bglab');
  if (lab) {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
      if (saved && Array.isArray(saved.layers)) {
        cfg.layers = saved.layers.filter((s) => LAYERS.includes(s));
        cfg.motion = normMotion(saved.motion);
        cfg.interact = saved.interact !== false;
      }
    } catch (e) { /* ignore */ }
  }
  if (q.has('bg')) {
    const v = q.get('bg');
    cfg.layers = v === 'none' ? [] : v.split(',').map((s) => s.trim()).filter((s) => LAYERS.includes(s));
  }
  if (q.has('motion')) cfg.motion = normMotion(q.get('motion'));
  return { cfg, lab };
}

function init() {
  const host = document.getElementById('page-bg');
  if (!host) return;
  const { cfg, lab } = parseConfig(host);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = [];
  let current = cfg;

  function mount(c) {
    active.forEach((l) => l.destroy());
    active = [];
    host.className = '';
    host.dataset.bgMotion = c.motion;
    // aurora goes underneath; canvas/svg layers above it
    const order = ['aurora', 'rings', 'relax', 'field'];
    order.forEach((name) => {
      if (!c.layers.includes(name)) return;
      if (name === 'aurora') active.push(createAurora(host));
      else if (name === 'rings') active.push(createRings(host, { reduced }));
      else active.push(createField(host, { mode: name, motion: c.motion, interact: c.interact, reduced }));
      host.classList.add('has-' + name);
    });
    host.classList.add('bg-motion-' + c.motion);
    current = c;
  }

  mount(cfg);

  // Recolour when the theme toggles (html.dark)
  new MutationObserver(() => active.forEach((l) => l.recolor()))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  if (lab) buildLab(host, () => current, mount, () => active);
}

function buildLab(host, getCfg, mount, getActive) {
  const panel = document.createElement('div');
  panel.className = 'bg-lab';
  panel.innerHTML = `
    <div class="bg-lab-title">Background lab</div>
    <div class="bg-lab-group" data-group="layers">
      ${LAYERS.map((l) => `<label><input type="checkbox" value="${l}"> ${l}</label>`).join('')}
    </div>
    <div class="bg-lab-group" data-group="motion">
      ${MOTIONS.map((m) => `<label><input type="radio" name="bg-motion" value="${m}"> ${m}</label>`).join('')}
    </div>
    <div class="bg-lab-group" data-group="interact">
      <label><input type="checkbox" value="interact"> cursor repulsion</label>
    </div>
    <div class="bg-lab-stats"><span data-fps>–</span> fps · <span data-ms>–</span> ms/frame</div>
    <button type="button" class="bg-lab-copy">Copy params.yaml snippet</button>
    <textarea class="bg-lab-yaml" rows="5" readonly></textarea>
  `;
  document.body.appendChild(panel);

  function sync() {
    const c = getCfg();
    panel.querySelectorAll('[data-group="layers"] input').forEach((i) => { i.checked = c.layers.includes(i.value); });
    panel.querySelectorAll('[data-group="motion"] input').forEach((i) => { i.checked = i.value === c.motion; });
    panel.querySelector('[data-group="interact"] input').checked = c.interact;
    panel.querySelector('.bg-lab-yaml').value =
      'site_background:\n  layers: [' + c.layers.map((l) => '"' + l + '"').join(', ') + ']\n  motion: ' + c.motion + '\n  interact: ' + c.interact;
  }
  function read() {
    const layers = Array.from(panel.querySelectorAll('[data-group="layers"] input:checked')).map((i) => i.value);
    const motion = normMotion(panel.querySelector('[data-group="motion"] input:checked')?.value);
    const interact = panel.querySelector('[data-group="interact"] input').checked;
    return { layers, motion, interact };
  }
  panel.addEventListener('change', () => {
    const c = read();
    try { localStorage.setItem(LS_KEY, JSON.stringify(c)); } catch (e) { /* ignore */ }
    mount(c);
    sync();
  });
  panel.querySelector('.bg-lab-copy').addEventListener('click', () => {
    const ta = panel.querySelector('.bg-lab-yaml');
    ta.select();
    try { navigator.clipboard.writeText(ta.value); } catch (e) { document.execCommand('copy'); }
  });
  setInterval(() => {
    const f = getActive().find((l) => l.stats);
    panel.querySelector('[data-fps]').textContent = f ? f.stats.fps : '–';
    panel.querySelector('[data-ms]').textContent = f ? f.stats.ms.toFixed(1) : '–';
  }, 1000);
  sync();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
