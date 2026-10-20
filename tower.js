/* =========================================================
   Torre de transmisión que se ensambla con el scroll
   tower.js — módulo independiente (quitar = borrar la <section id="tower"> y este <script>)
   ========================================================= */

import * as THREE from "three";

const section = document.getElementById("tower");
const mount = document.getElementById("tower-canvas");
const pctEl = document.getElementById("tower-pct");
const stageEl = document.getElementById("tower-stage");

if (section && mount) initTower();

function initTower() {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LOW = window.matchMedia("(hover: none), (max-width: 820px)").matches;
  const ACCENT = 0xffb84d;
  const DIM = 0x6f4a1a;
  const WIRE = 0xe8e6e1;

  const renderer = new THREE.WebGLRenderer({ antialias: !LOW, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, LOW ? 1.25 : 2));
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);

  /* ---------- geometría de la torre (celosía) ---------- */
  const segs = [];
  const add = (a, b, main = true) => segs.push({ a: new THREE.Vector3(...a), b: new THREE.Vector3(...b), main });

  const half = (y) => 1.8 - y * 0.12;
  const levels = [0, 1.6, 3.2, 4.8, 6.4, 8, 9.6, 11.2];
  for (let i = 0; i < levels.length - 1; i++) {
    const y0 = levels[i], y1 = levels[i + 1], a = half(y0), b = half(y1);
    const c0 = [[-a, y0, -a], [a, y0, -a], [a, y0, a], [-a, y0, a]];
    const c1 = [[-b, y1, -b], [b, y1, -b], [b, y1, b], [-b, y1, b]];
    for (let k = 0; k < 4; k++) {
      add(c0[k], c1[k], true);
      add(c0[k], c1[(k + 1) % 4], false);
      add(c0[(k + 1) % 4], c1[k], false);
      add(c1[k], c1[(k + 1) % 4], true);
    }
  }
  // crucetas (dos niveles) + cadenas de aisladores
  const arms = [{ y: 6.4, L: 4 }, { y: 9.6, L: 2.9 }];
  const attach = [];
  arms.forEach(({ y, L }) => {
    const d = half(y);
    [-1, 1].forEach((s) => {
      add([s * d, y, -d], [s * L, y, 0], true);
      add([s * d, y, d], [s * L, y, 0], true);
      add([s * d, y - 1.1, -d], [s * L, y, 0], false);
      add([s * d, y - 1.1, d], [s * L, y, 0], false);
      add([s * L, y, 0], [s * L, y - 0.9, 0], true);
      attach.push(new THREE.Vector3(s * L, y - 0.9, 0));
    });
  });
  // cable de guarda
  add([-0.4, 11.2, 0], [0, 12.3, 0], true);
  add([0.4, 11.2, 0], [0, 12.3, 0], true);
  attach.push(new THREE.Vector3(0, 12.3, 0));

  const N = segs.length;
  const pos = new Float32Array(N * 6);
  const col = new Float32Array(N * 6);
  const cMain = new THREE.Color(ACCENT), cDim = new THREE.Color(DIM);
  segs.forEach((s, i) => {
    const c = s.main ? cMain : cDim;
    for (let j = 0; j < 2; j++) col.set([c.r, c.g, c.b], i * 6 + j * 3);
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const tower = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true }));
  scene.add(tower);

  // punta de construcción (chispa que va soldando)
  const spark = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  scene.add(spark);

  /* ---------- conductores con catenaria ---------- */
  const span = 16, sag = 1.1;
  const wires = attach.map((p) => {
    const pts = [];
    for (let z = -span; z <= span; z += 0.5) {
      const t = z / span;
      pts.push(new THREE.Vector3(p.x, p.y - sag * (1 - t * t) + sag, z));
    }
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: WIRE, transparent: true, opacity: 0 })
    );
    scene.add(line);
    return line;
  });

  // pulsos de corriente sobre los conductores de fase
  const pulses = [];
  attach.slice(0, 4).forEach((p, i) => {
    for (let k = 0; k < 3; k++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0 }));
      m.userData = { p, t: k / 3 + i * 0.11 };
      scene.add(m);
      pulses.push(m);
    }
  });

  // retícula del suelo
  const grid = new THREE.GridHelper(40, 40, 0x3a3a36, 0x1d1d1b);
  grid.material.transparent = true;
  grid.material.opacity = 0.6;
  scene.add(grid);

  /* ---------- estado ---------- */
  let target = REDUCED ? 1 : 0, prog = target, visible = false, raf = 0, last = 0;
  const STAGES = ["CIMENTACIÓN", "CUERPO PRINCIPAL", "CRUCETAS", "AISLADORES", "TENDIDO", "ENERGIZADA"];

  function readScroll() {
    if (REDUCED) return;
    const r = section.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    target = Math.min(1, Math.max(0, -r.top / (total * 0.85)));
  }

  function resize() {
    const w = mount.clientWidth, h = mount.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (LOW && t - last < 33) return; // ~30 fps en móvil
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
    last = t;

    prog += (target - prog) * (REDUCED ? 1 : Math.min(1, dt * 6));
    if (Math.abs(target - prog) < 0.006) prog = target;
    const build = Math.min(1, prog / 0.82);       // 0–82 %: celosía
    const wireP = Math.max(0, (prog - 0.82) / 0.18); // 82–100 %: tendido

    const n = N * build;
    for (let i = 0; i < N; i++) {
      const f = Math.max(0, Math.min(1, n - i));
      const s = segs[i];
      const ex = s.a.x + (s.b.x - s.a.x) * f, ey = s.a.y + (s.b.y - s.a.y) * f, ez = s.a.z + (s.b.z - s.a.z) * f;
      pos.set([s.a.x, s.a.y, s.a.z, ex, ey, ez], i * 6);
      if (f > 0 && f < 1) spark.position.set(ex, ey, ez);
    }
    geo.attributes.position.needsUpdate = true;
    spark.visible = build > 0.002 && build < 0.999;

    wires.forEach((w) => (w.material.opacity = wireP * 0.55));
    pulses.forEach((m) => {
      m.material.opacity = wireP >= 1 ? 1 : 0;
      m.userData.t = (m.userData.t + dt * 0.18) % 1;
      const z = -span + m.userData.t * span * 2, tt = z / span, p = m.userData.p;
      m.position.set(p.x, p.y - sag * (1 - tt * tt) + sag, z);
    });

    const ang = 0.7 + prog * 1.6 + t * 0.00005;
    const narrow = mount.clientWidth < 700;
    const dist = narrow ? 34 : 22;
    const lookY = (narrow ? 8.5 : 5.5) + prog * 0.6;
    camera.position.set(Math.sin(ang) * dist, 4 + prog * 4, Math.cos(ang) * dist);
    camera.lookAt(0, lookY, 0);

    const pct = Math.round(prog * 100);
    if (pctEl) pctEl.textContent = String(pct).padStart(3, "0");
    if (stageEl) stageEl.textContent = STAGES[Math.min(STAGES.length - 1, Math.floor(prog * (STAGES.length - 1) + 0.02))];
    section.classList.toggle("tower-live", wireP >= 1);

    renderer.render(scene, camera);
  }

  const start = () => { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  new IntersectionObserver((es) => es.forEach((e) => { visible = e.isIntersecting; visible ? start() : stop(); }), { rootMargin: "120px" }).observe(section);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("resize", () => { resize(); readScroll(); });

  resize();
  readScroll();
}
