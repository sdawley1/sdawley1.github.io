/* Particle engine for the "field" and "relax" background layers.
 *
 * field: a driven nonequilibrium hyperuniform state. Overdamped particles with a soft
 *        repulsion (keeps them evenly spread: suppressed large-scale density fluctuations),
 *        a slowly varying divergence-free flow (non-conservative drive, so the system
 *        never settles) and a little noise.
 * relax: the thesis story on loop. Seed a jittered lattice or a Poisson gas, relax under
 *        the repulsion into a disordered hyperuniform-like state, hold, fade, re-seed.
 */

const TAU = Math.PI * 2;

function gauss() {
  // Box-Muller
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

export function createField(host, opts) {
  const mode = opts.mode === 'relax' ? 'relax' : 'field';
  const motion = opts.motion === 'lively' ? 'lively' : opts.motion === 'medium' ? 'medium' : 'subtle';
  const reduced = !!opts.reduced;
  const interact = !!opts.interact && !reduced && window.matchMedia('(pointer: fine)').matches;
  const wavesOn = opts.waves !== false && !reduced;

  const canvas = document.createElement('canvas');
  canvas.className = 'bg-field' + (mode === 'relax' ? ' bg-field--relax' : '');
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });

  // ---- geometry -------------------------------------------------------------
  const EXTRA = 400; // extra height so the parallax shift never exposes an edge
  let W = 0, H = 0, dpr = 1;
  let N = 0, a = 0, rc = 0, rlink = 0, cell = 0, gw = 0, gh = 0;
  let px, py, pr, pc; // positions, radii, colour index
  let grid = null, gridCount = null;

  // ---- parameters -----------------------------------------------------------
  const K_REP = 70;                                  // px/s at contact
  const FLOW_AMP = { subtle: 6, medium: 11, lively: 18 }[motion];   // px/s
  const NOISE = { subtle: 1.5, medium: 2.2, lively: 3 }[motion];   // px/sqrt(s)
  const CURSOR_R = 120, CURSOR_F = 110;              // px, px/s
  // Acoustic wave emitted on click: a radial velocity pulse with a Gaussian front
  const WAVE_C = 420, WAVE_W = 55, WAVE_A = 110, WAVE_TAU = 2.4, WAVE_MAX = 6;
  const MAX_DT = 1 / 30;

  // Divergence-free flow: v = (dpsi/dy, -dpsi/dx), psi = sum_m sin(kx x + wx t) sin(ky y + wy t)
  const modes = [
    { lam: 700, ang: 0.3, w1: TAU / 61, w2: TAU / 47 },
    { lam: 1050, ang: 1.9, w1: TAU / 83, w2: TAU / 71 },
    { lam: 520, ang: 4.1, w1: TAU / 53, w2: TAU / 97 },
  ].map((m) => ({
    kx: (TAU / m.lam) * Math.cos(m.ang),
    ky: (TAU / m.lam) * Math.sin(m.ang),
    w1: m.w1, w2: m.w2,
    amp: (FLOW_AMP * m.lam) / (TAU * 3),
  }));

  function flow(x, y, t, out) {
    let vx = 0, vy = 0;
    for (const m of modes) {
      const A = m.kx * x + m.w1 * t;
      const B = m.ky * y + m.w2 * t;
      // psi = amp * sin(A) sin(B)
      vx += m.amp * Math.sin(A) * Math.cos(B) * m.ky;
      vy -= m.amp * Math.cos(A) * Math.sin(B) * m.kx;
    }
    out[0] = vx; out[1] = vy;
  }

  // ---- colours --------------------------------------------------------------
  let colours = ['#3b82f6', '#db2777', '#4d7c0f'];
  function recolor() {
    const cs = getComputedStyle(document.documentElement);
    const c1 = cs.getPropertyValue('--bg-c1').trim();
    const c2 = cs.getPropertyValue('--bg-c2').trim();
    const c3 = cs.getPropertyValue('--bg-c3').trim();
    if (c1) colours = [c1, c2 || c1, c3 || c1];
  }

  // ---- init -----------------------------------------------------------------
  function allocate() {
    W = Math.max(320, window.innerWidth);
    H = Math.max(320, window.innerHeight) + EXTRA;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const area = W * H;
    N = Math.max(120, Math.min(400, Math.round(area / (90 * 90))));
    a = Math.sqrt(area / N);
    rc = 1.6 * a;
    rlink = 1.25 * a;
    cell = rc;
    gw = Math.ceil(W / cell);
    gh = Math.ceil(H / cell);
    px = new Float32Array(N); py = new Float32Array(N);
    pr = new Float32Array(N); pc = new Uint8Array(N);
    grid = new Int32Array(gw * gh * 16);
    gridCount = new Int32Array(gw * gh);
    for (let i = 0; i < N; i++) {
      pr[i] = 1.4 + Math.random();
      const u = Math.random();
      pc[i] = u < 0.85 ? 0 : u < 0.93 ? 1 : 2;
    }
  }

  function seed(kind) {
    if (kind === 'lattice') {
      const cols = Math.round(Math.sqrt(N * W / H));
      const rows = Math.ceil(N / cols);
      const sx = W / cols, sy = H / rows;
      for (let i = 0; i < N; i++) {
        const c = i % cols, r = Math.floor(i / cols);
        px[i] = (c + 0.5) * sx + gauss() * 0.02 * sx;
        py[i] = (r + 0.5) * sy + gauss() * 0.02 * sy;
      }
    } else if (kind === 'gas') {
      for (let i = 0; i < N; i++) { px[i] = Math.random() * W; py[i] = Math.random() * H; }
    } else {
      // stratified: one point per cell of a sqrt(N) grid with jitter, then silent relaxation
      const cols = Math.round(Math.sqrt(N * W / H));
      const rows = Math.ceil(N / cols);
      const sx = W / cols, sy = H / rows;
      for (let i = 0; i < N; i++) {
        const c = i % cols, r = Math.floor(i / cols);
        px[i] = (c + Math.random()) * sx;
        py[i] = (r + Math.random()) * sy;
      }
      for (let s = 0; s < 150; s++) step(1 / 60, { drive: false, noise: 0.5, cursor: false, relaxBoost: 2 });
    }
  }

  // ---- neighbour grid ---------------------------------------------------------
  function rebuildGrid() {
    gridCount.fill(0);
    for (let i = 0; i < N; i++) {
      const cx = Math.min(gw - 1, Math.max(0, (px[i] / cell) | 0));
      const cy = Math.min(gh - 1, Math.max(0, (py[i] / cell) | 0));
      const g = cy * gw + cx;
      const n = gridCount[g];
      if (n < 16) { grid[g * 16 + n] = i; gridCount[g] = n + 1; }
    }
  }

  function forEachNeighbour(i, fn) {
    const cx = Math.min(gw - 1, Math.max(0, (px[i] / cell) | 0));
    const cy = Math.min(gh - 1, Math.max(0, (py[i] / cell) | 0));
    for (let dy = -1; dy <= 1; dy++) {
      let yy = cy + dy; let wy = 0;
      if (yy < 0) { yy += gh; wy = -H; } else if (yy >= gh) { yy -= gh; wy = H; }
      for (let dx = -1; dx <= 1; dx++) {
        let xx = cx + dx; let wx = 0;
        if (xx < 0) { xx += gw; wx = -W; } else if (xx >= gw) { xx -= gw; wx = W; }
        const g = yy * gw + xx;
        const n = gridCount[g];
        for (let k = 0; k < n; k++) {
          const j = grid[g * 16 + k];
          if (j !== i) fn(j, wx, wy);
        }
      }
    }
  }

  // ---- dynamics -------------------------------------------------------------
  const fx = { v: null }, fy = { v: null };
  const vout = [0, 0];
  let t = 0;
  const pointer = { x: -1e9, y: -1e9, active: false };
  const waves = []; // { x, y, age }
  let glow = null;  // per-point wave excitation (0..1) for rendering

  function waveFactor(dx, dy, age, out) {
    // Gaussian ring at radius c*age, amplitude decaying in time and with spreading
    const r = Math.sqrt(dx * dx + dy * dy) + 1e-6;
    const front = WAVE_C * age;
    const u = (r - front) / WAVE_W;
    if (u > 3 || u < -3) { out[0] = 0; return r; }
    const env = Math.exp(-age / WAVE_TAU) / Math.sqrt(1 + front / 300);
    out[0] = Math.exp(-u * u) * env;
    return r;
  }

  function step(dt, o) {
    if (!fx.v || fx.v.length !== N) { fx.v = new Float32Array(N); fy.v = new Float32Array(N); }
    const FX = fx.v, FY = fy.v;
    FX.fill(0); FY.fill(0);
    rebuildGrid();
    const krep = K_REP * (o.relaxBoost || 1);
    for (let i = 0; i < N; i++) {
      const xi = px[i], yi = py[i];
      forEachNeighbour(i, (j, wx, wy) => {
        if (j < i) return; // handle each pair once
        const dx = xi - (px[j] + wx), dy = yi - (py[j] + wy);
        const r2 = dx * dx + dy * dy;
        if (r2 >= rc * rc || r2 < 1e-6) return;
        const r = Math.sqrt(r2);
        const s = 1 - r / rc;
        const f = (krep * s * s) / r;
        FX[i] += f * dx; FY[i] += f * dy;
        FX[j] -= f * dx; FY[j] -= f * dy;
      });
    }
    const sq = Math.sqrt(dt) * (o.noise == null ? NOISE : o.noise);
    const hasWaves = waves.length > 0;
    if (hasWaves && (!glow || glow.length !== N)) glow = new Float32Array(N);
    if (hasWaves) glow.fill(0);
    const wf = [0];
    for (let i = 0; i < N; i++) {
      let vx = FX[i], vy = FY[i];
      if (hasWaves) {
        for (let k = 0; k < waves.length; k++) {
          const w = waves[k];
          const dx = px[i] - w.x, dy = py[i] - w.y;
          const r = waveFactor(dx, dy, w.age, wf);
          if (wf[0] > 0) {
            const a = WAVE_A * wf[0];
            vx += (a * dx) / r; vy += (a * dy) / r;
            if (wf[0] > glow[i]) glow[i] = wf[0];
          }
        }
      }
      if (o.drive) { flow(px[i], py[i], t, vout); vx += vout[0]; vy += vout[1]; }
      if (o.cursor && pointer.active) {
        const dx = px[i] - pointer.x, dy = py[i] - pointer.y;
        const r = Math.hypot(dx, dy);
        if (r < CURSOR_R && r > 0.5) {
          const s = 1 - r / CURSOR_R;
          const f = (CURSOR_F * s * s) / r;
          vx += f * dx; vy += f * dy;
        }
      }
      let x = px[i] + vx * dt + sq * gauss();
      let y = py[i] + vy * dt + sq * gauss();
      if (x < 0) x += W; else if (x >= W) x -= W;
      if (y < 0) y += H; else if (y >= H) y -= H;
      px[i] = x; py[i] = y;
    }
    t += dt;
    if (hasWaves) {
      const maxR = Math.hypot(W, H);
      for (let k = waves.length - 1; k >= 0; k--) {
        waves[k].age += dt;
        if (waves[k].age > 4 || WAVE_C * waves[k].age > maxR + 3 * WAVE_W) waves.splice(k, 1);
      }
      if (!waves.length && glow) glow.fill(0);
    }
  }

  function emitWave(x, y, age) {
    if (!wavesOn) return;
    if (waves.length >= WAVE_MAX) waves.shift();
    waves.push({ x, y, age: age || 0 });
  }

  // ---- drawing --------------------------------------------------------------
  const nb = new Int32Array(64), nd = new Float32Array(64);
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    rebuildGrid();
    // links (sparse: at most 3 per point, only to higher indices)
    ctx.lineWidth = 1;
    ctx.strokeStyle = colours[0];
    for (let i = 0; i < N; i++) {
      let cnt = 0;
      const xi = px[i], yi = py[i];
      forEachNeighbour(i, (j, wx, wy) => {
        if (j < i || cnt >= 64) return;
        const xj = px[j] + wx, yj = py[j] + wy;
        const d = Math.hypot(xi - xj, yi - yj);
        if (d < rlink) { nb[cnt] = j; nd[cnt] = d; cnt++; }
      });
      // pick the 3 nearest
      for (let k = 0; k < Math.min(3, cnt); k++) {
        let best = k;
        for (let m = k + 1; m < cnt; m++) if (nd[m] < nd[best]) best = m;
        const tj = nb[k], td = nd[k]; nb[k] = nb[best]; nd[k] = nd[best]; nb[best] = tj; nd[best] = td;
        const j = nb[k];
        // draw toward the wrapped image of j (recompute wrap offset cheaply)
        let xj = px[j], yj = py[j];
        if (xj - xi > W / 2) xj -= W; else if (xi - xj > W / 2) xj += W;
        if (yj - yi > H / 2) yj -= H; else if (yi - yj > H / 2) yj += H;
        const gl = glow ? Math.max(glow[i], glow[j]) : 0;
        ctx.globalAlpha = Math.min(1, 0.55 * (1 - nd[k] / rlink) + 0.8 * gl);
        ctx.lineWidth = 1 + 0.8 * gl;
        ctx.beginPath(); ctx.moveTo(xi, yi); ctx.lineTo(xj, yj); ctx.stroke();
      }
    }
    // points: soft halo + core
    for (let i = 0; i < N; i++) {
      const c = colours[pc[i]];
      const gl = glow ? glow[i] : 0;
      ctx.fillStyle = c;
      ctx.globalAlpha = 0.18 + 0.5 * gl;
      ctx.beginPath(); ctx.arc(px[i], py[i], pr[i] * (3 + 2.5 * gl), 0, TAU); ctx.fill();
      ctx.globalAlpha = 0.95;
      ctx.beginPath(); ctx.arc(px[i], py[i], pr[i] * (1 + 0.6 * gl), 0, TAU); ctx.fill();
    }
    // wave fronts: a faint expanding ring so the pulse reads even between points
    for (const w of waves) {
      const front = WAVE_C * w.age;
      const env = Math.exp(-w.age / WAVE_TAU) / Math.sqrt(1 + front / 300);
      ctx.strokeStyle = colours[0];
      ctx.lineWidth = WAVE_W * 0.6;
      ctx.globalAlpha = 0.12 * env;
      ctx.beginPath(); ctx.arc(w.x, w.y, front, 0, TAU); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
  }

  // ---- relax-mode schedule ----------------------------------------------------
  const phases = [
    { seed: 'lattice', relax: 12, hold: 8, fade: 1.5 },
    { seed: 'gas', relax: 12, hold: 8, fade: 1.5 },
  ];
  let phaseIdx = 0, phaseT = 0, phaseStage = 'relax';
  function relaxTick(dt) {
    const ph = phases[phaseIdx];
    phaseT += dt;
    if (phaseStage === 'relax') {
      step(dt, { drive: false, noise: NOISE * 0.6, cursor: interact, relaxBoost: 1.2 });
      if (phaseT >= ph.relax) { phaseStage = 'hold'; phaseT = 0; }
    } else if (phaseStage === 'hold') {
      step(dt, { drive: false, noise: NOISE * 0.3, cursor: interact });
      if (phaseT >= ph.hold) { phaseStage = 'fade'; phaseT = 0; canvas.style.opacity = '0'; }
    } else if (phaseStage === 'fade') {
      if (phaseT >= ph.fade) {
        phaseIdx = (phaseIdx + 1) % phases.length;
        seed(phases[phaseIdx].seed);
        phaseStage = 'relax'; phaseT = 0;
        canvas.style.opacity = '';
      }
    }
  }

  // ---- loop -----------------------------------------------------------------
  let raf = 0, last = 0, running = false;
  const stats = { ms: 0, fps: 0 };
  let frames = 0;
  function frame(now) {
    if (!running) return;
    const t0 = performance.now();
    let dt = last ? (now - last) / 1000 : 1 / 60;
    last = now;
    if (dt > 0.5) dt = 1 / 60; // tab was hidden: don't integrate the gap
    let steps = 0;
    while (dt > 0 && steps < 2) {
      const h = Math.min(dt, MAX_DT);
      if (mode === 'relax') relaxTick(h);
      else step(h, { drive: true, noise: NOISE, cursor: interact });
      dt -= h; steps++;
    }
    draw();
    const ms = performance.now() - t0;
    stats.ms = stats.ms * 0.9 + ms * 0.1;
    frames++;
    raf = requestAnimationFrame(frame);
  }
  // fps sampling
  let fpsLast = performance.now(), fpsFrames = 0;
  const fpsTimer = setInterval(() => {
    const now = performance.now();
    stats.fps = Math.round((frames - fpsFrames) * 1000 / (now - fpsLast));
    fpsFrames = frames; fpsLast = now;
  }, 1000);

  function start() {
    if (running || reduced) return;
    running = true; last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  // ---- events ---------------------------------------------------------------
  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  }
  function onPointerLeave() { pointer.active = false; }
  function onPointerDown(e) {
    if (e.button != null && e.button !== 0) return;
    const el = e.target;
    if (el && el.closest && el.closest('a, button, input, select, textarea, label, summary, .bg-lab, .hb-secnav')) return;
    const rect = canvas.getBoundingClientRect();
    emitWave(e.clientX - rect.left, e.clientY - rect.top);
    if (!running) start();
  }
  function onVisibility() { if (document.hidden) stop(); else start(); }
  let resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const oldW = W, oldH = H;
      const oldN = N;
      const oldPx = px, oldPy = py;
      allocate();
      if (Math.abs(N - oldN) / oldN > 0.25 || !oldPx) {
        seed(mode === 'relax' ? phases[phaseIdx].seed : 'stratified');
      } else {
        for (let i = 0; i < N; i++) {
          const j = i % oldN;
          px[i] = (oldPx[j] / oldW) * W; py[i] = (oldPy[j] / oldH) * H;
        }
      }
      if (reduced) draw();
    }, 150);
  }
  let scrollRaf = 0;
  function onScroll() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      const y = Math.min(EXTRA, window.scrollY * 0.05);
      canvas.style.transform = 'translate3d(0,' + (-y) + 'px,0)';
    });
  }

  // ---- mount ----------------------------------------------------------------
  recolor();
  allocate();
  seed(mode === 'relax' ? 'lattice' : 'stratified');
  draw();
  if (interact) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('mouseleave', onPointerLeave);
  }
  if (wavesOn) window.addEventListener('pointerdown', onPointerDown, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  start();

  return {
    name: mode,
    stats,
    emitWave,
    recolor() { recolor(); if (reduced) draw(); },
    destroy() {
      stop();
      clearInterval(fpsTimer);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      canvas.remove();
    },
  };
}
