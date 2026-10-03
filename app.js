/* =========================================================
   Juan Quintero — Portfolio
   app.js
   ========================================================= */

import * as THREE from "three";

/* =========================
   CV DROPDOWN
   ========================= */
const cvMenu = document.getElementById("cv-menu");
const cvTrigger = document.getElementById("cv-trigger");

cvTrigger?.addEventListener("click", (e) => {
  e.stopPropagation();
  const open = cvMenu.classList.toggle("open");
  cvTrigger.setAttribute("aria-expanded", open ? "true" : "false");
});

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!cvMenu?.contains(e.target)) {
    cvMenu?.classList.remove("open");
    cvTrigger?.setAttribute("aria-expanded", "false");
  }
});

// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cvMenu?.classList.remove("open");
    cvTrigger?.setAttribute("aria-expanded", "false");
  }
});

/* =========================
   CLOCK (HUD)
   ========================= */
const clockEl = document.getElementById("clock");
function tick() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  clockEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
tick();
setInterval(tick, 1000);

document.getElementById("year").textContent = new Date().getFullYear();

/* =========================
   THREE.JS HERO — wireframe muscle car (Hot Wheels easter egg)
   ========================= */

const canvas = document.getElementById("hero-canvas");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(7, 4.5, 9);
camera.lookAt(0, 0.8, 0);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// COLORS
const ACCENT = 0xffb84d;
const ACCENT_HOT = 0xff6b35;
const DIM = 0x6f6f68;

// Materials
const matLine = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.85 });
const matLineDim = new THREE.LineBasicMaterial({ color: DIM, transparent: true, opacity: 0.5 });

/* ---- BUILD THE CAR ---- */
const car = new THREE.Group();

function edgeMesh(geometry, material) {
  return new THREE.LineSegments(new THREE.EdgesGeometry(geometry), material);
}

// Main body — chassis (low and wide)
const bodyGeo = new THREE.BoxGeometry(4.2, 0.55, 1.9);
const body = edgeMesh(bodyGeo, matLine);
body.position.y = 0.55;
car.add(body);

// Hood (front lower box)
const hoodGeo = new THREE.BoxGeometry(1.6, 0.18, 1.7);
const hood = edgeMesh(hoodGeo, matLine);
hood.position.set(1.25, 0.92, 0);
car.add(hood);

// Cabin (greenhouse) — slightly trapezoidal feel via stacked boxes
const cabinGeo = new THREE.BoxGeometry(2.1, 0.6, 1.55);
const cabin = edgeMesh(cabinGeo, matLine);
cabin.position.set(-0.35, 1.13, 0);
car.add(cabin);

// Roof line accent
const roofGeo = new THREE.BoxGeometry(1.5, 0.04, 1.4);
const roof = edgeMesh(roofGeo, matLine);
roof.position.set(-0.35, 1.45, 0);
car.add(roof);

// Spoiler
const spoilerSupports = new THREE.Group();
for (const z of [-0.65, 0.65]) {
  const sup = edgeMesh(new THREE.BoxGeometry(0.12, 0.32, 0.08), matLine);
  sup.position.set(-1.85, 1.0, z);
  spoilerSupports.add(sup);
}
car.add(spoilerSupports);
const spoiler = edgeMesh(new THREE.BoxGeometry(0.6, 0.06, 1.7), matLine);
spoiler.position.set(-1.85, 1.18, 0);
car.add(spoiler);

// Front bumper / scoop
const bumper = edgeMesh(new THREE.BoxGeometry(0.25, 0.35, 1.7), matLine);
bumper.position.set(2.15, 0.5, 0);
car.add(bumper);

// Wheels
function makeWheel(x, z) {
  const w = new THREE.Group();
  const tire = edgeMesh(new THREE.CylinderGeometry(0.5, 0.5, 0.45, 18), matLine);
  tire.rotation.x = Math.PI / 2;
  w.add(tire);
  // hub detail
  const hub = edgeMesh(new THREE.CylinderGeometry(0.18, 0.18, 0.46, 6), matLine);
  hub.rotation.x = Math.PI / 2;
  w.add(hub);
  w.position.set(x, 0.5, z);
  return w;
}
const wheels = [
  makeWheel(1.3, 1.05),
  makeWheel(1.3, -1.05),
  makeWheel(-1.3, 1.05),
  makeWheel(-1.3, -1.05),
];
wheels.forEach((w) => car.add(w));

// Headlights (small points)
const lightGeo = new THREE.SphereGeometry(0.08, 8, 8);
const lightMat = new THREE.MeshBasicMaterial({ color: ACCENT });
for (const z of [-0.6, 0.6]) {
  const lite = new THREE.Mesh(lightGeo, lightMat);
  lite.position.set(2.3, 0.62, z);
  car.add(lite);
}

// Ground grid (subtle)
const grid = new THREE.GridHelper(14, 14, DIM, 0x1a1a1a);
grid.material.transparent = true;
grid.material.opacity = 0.18;
grid.position.y = 0;
scene.add(grid);

// Center indicator (under car)
const centerRingGeo = new THREE.RingGeometry(0.05, 2.5, 32);
const centerRingMat = new THREE.MeshBasicMaterial({
  color: ACCENT,
  transparent: true,
  opacity: 0.12,
  side: THREE.DoubleSide,
});
const centerRing = new THREE.Mesh(centerRingGeo, centerRingMat);
centerRing.rotation.x = -Math.PI / 2;
centerRing.position.y = 0.01;
scene.add(centerRing);

car.position.y = 0;
scene.add(car);

/* ---- INTERACTION: drag + click ---- */
let isDragging = false;
let lastX = 0;
let lastY = 0;
let targetRotY = 0;
let targetRotX = 0;
let easterActive = false;
let easterTimer = 0;
let autoRotateSpeed = 0.002;

canvas.addEventListener("pointerdown", (e) => {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  targetRotY += dx * 0.008;
  targetRotX += dy * 0.005;
  targetRotX = Math.max(-0.4, Math.min(0.4, targetRotX));
  lastX = e.clientX;
  lastY = e.clientY;
});

canvas.addEventListener("pointerup", () => {
  isDragging = false;
});
canvas.addEventListener("pointerleave", () => {
  isDragging = false;
});

// Click → easter egg
let clickStart = null;
canvas.addEventListener("pointerdown", (e) => {
  clickStart = { x: e.clientX, y: e.clientY, t: performance.now() };
});
canvas.addEventListener("pointerup", (e) => {
  if (!clickStart) return;
  const dx = Math.abs(e.clientX - clickStart.x);
  const dy = Math.abs(e.clientY - clickStart.y);
  const dt = performance.now() - clickStart.t;
  if (dx < 5 && dy < 5 && dt < 250) {
    triggerEasterEgg();
  }
  clickStart = null;
});

function triggerEasterEgg() {
  if (easterActive) return;
  trackPortfolioEvent("Easter egg", { name: "Hot Wheels" });
  easterActive = true;
  easterTimer = 0;
  autoRotateSpeed = 0.05;
  // Change colors to Hot Wheels hot
  matLine.color.setHex(ACCENT_HOT);
  lightMat.color.setHex(ACCENT_HOT);
  centerRingMat.color.setHex(ACCENT_HOT);
  centerRingMat.opacity = 0.3;

  // Show panel
  const panel = document.getElementById("easter-egg");
  panel.hidden = false;

  // Hide click hint
  const hint = document.querySelector(".click-hint");
  if (hint) hint.style.display = "none";
}

function closeEasterEgg() {
  easterActive = false;
  autoRotateSpeed = 0.002;
  // Revert colors
  matLine.color.setHex(ACCENT);
  lightMat.color.setHex(ACCENT);
  centerRingMat.color.setHex(ACCENT);
  centerRingMat.opacity = 0.12;

  // Hide panel
  const panel = document.getElementById("easter-egg");
  panel.hidden = true;

  // Show click hint again
  const hint = document.querySelector(".click-hint");
  if (hint) hint.style.display = "";
}

document.getElementById("ee-close")?.addEventListener("click", (e) => {
  e.stopPropagation();
  closeEasterEgg();
});

/* ---- RESIZE ---- */
function resize() {
  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();

/* ---- ANIMATION LOOP ---- */
const rpmEl = document.getElementById("rpm");
let rpmShown = 150;

function loop(t) {
  requestAnimationFrame(loop);

  // Auto-rotate the car group on Y
  car.rotation.y += autoRotateSpeed;
  car.rotation.y += (targetRotY - car.rotation.y) * 0.04;
  car.rotation.x += (targetRotX - car.rotation.x) * 0.06;

  // Spin wheels (visual)
  const spin = easterActive ? 0.5 : 0.05;
  wheels.forEach((w) => (w.rotation.z -= spin));

  // Subtle hover float
  car.position.y = Math.sin(t * 0.0015) * 0.05;

  // Easter timer — settle back to normal speed after a few seconds
  if (easterActive) {
    easterTimer += 16;
    if (easterTimer > 2500) {
      autoRotateSpeed += (0.004 - autoRotateSpeed) * 0.05;
    }
  }

  // Animated RPM
  const targetRpm = easterActive ? 7200 : 150 + Math.sin(t * 0.001) * 30;
  rpmShown += (targetRpm - rpmShown) * 0.05;
  if (rpmEl) rpmEl.textContent = String(Math.round(rpmShown)).padStart(4, "0");

  renderer.render(scene, camera);
}
requestAnimationFrame(loop);

/* =========================
   SKILLS — accordion
   ========================= */
document.querySelectorAll(".skill").forEach((skill) => {
  const head = skill.querySelector(".skill-head");
  head.addEventListener("click", () => {
    const open = skill.classList.toggle("open");
    head.setAttribute("aria-expanded", open ? "true" : "false");
  });
});

/* =========================
   SCROLL REVEAL — skill bars fill in on view
   ========================= */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);
document.querySelectorAll(".skill").forEach((s) => io.observe(s));


/* =========================
   NAV — active section highlight
   ========================= */
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const sectionMap = new Map(navLinks.map((link) => [link.getAttribute('href').slice(1), link]));
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (!visible.length) return;
    const id = visible[0].target.id;
    navLinks.forEach((link) => link.classList.toggle('active', link === sectionMap.get(id)));
  },
  {
    rootMargin: '-32% 0px -52% 0px',
    threshold: [0.2, 0.35, 0.55]
  }
);
['about','skills','scope','projects','contact'].forEach((id) => {
  const section = document.getElementById(id);
  if (section) sectionObserver.observe(section);
});


/* =========================
   VERCEL ANALYTICS — event helper
   Custom events appear when the plan supports them.
   ========================= */
function trackPortfolioEvent(name, data = {}) {
  try {
    if (typeof window.va === "function") {
      window.va("event", { name, data });
    }
  } catch (_) {
    // Analytics must never interfere with the portfolio UI.
  }
}

document.querySelectorAll("[data-track]").forEach((el) => {
  el.addEventListener("click", () => {
    const type = el.dataset.track || "interaction";
    const label = el.dataset.trackLabel || el.textContent.trim().slice(0, 80);
    trackPortfolioEvent("Portfolio interaction", { type, label });
  });
});

/* =========================
   RARE-UI INSPIRED — spotlight cards + magnetic controls
   ========================= */
document.querySelectorAll("[data-spotlight]").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.13;
      const y = (e.clientY - r.top - r.height / 2) * 0.13;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
}

/* =========================
   SCOPE — interactive 3-phase grid lab
   ========================= */
const scopeCanvas = document.getElementById("scope-canvas");
const sctx = scopeCanvas.getContext("2d");
const scopePanel = document.querySelector(".scope-panel");

let scopePaused = false;
let scopeTimeOffset = 0;
let lastRafTime = 0;
const phaseVisible = [true, true, true];
const disturbances = { fault: false, unbalance: false, sag: false };
let gridEasterTriggered = false;
let gridSequenceRunning = false;

const ctrlFreq  = document.getElementById("ctrl-freq");
const ctrlAmp   = document.getElementById("ctrl-amp");
const ctrlSpeed = document.getElementById("ctrl-speed");
const valFreq   = document.getElementById("val-freq");
const valAmp    = document.getElementById("val-amp");
const valSpeed  = document.getElementById("val-speed");
const metaFreq  = document.getElementById("meta-freq");
const metaVrms  = document.getElementById("meta-vrms");
const metaThd   = document.getElementById("meta-thd");
const gridStatus = document.getElementById("grid-status");
const btnPause  = document.getElementById("btn-pause");

function getScopeParams() {
  const freq  = parseInt(ctrlFreq.value, 10);
  const amp   = parseInt(ctrlAmp.value, 10) / 100;
  const speed = parseInt(ctrlSpeed.value, 10);
  return { freq, amp, speed };
}

function updateLabMeta() {
  const { freq } = getScopeParams();
  const active = Object.entries(disturbances).filter(([,v]) => v).map(([k]) => k);
  const thd = disturbances.fault ? 14.6 : disturbances.unbalance ? 4.8 : disturbances.sag ? 1.6 : 0.8;
  metaThd.textContent = thd.toFixed(1);

  scopePanel.classList.toggle("warning", active.length > 0 && !disturbances.fault);
  scopePanel.classList.toggle("trip", disturbances.fault);
  if (disturbances.fault) gridStatus.textContent = "FAULT_ACTIVE";
  else if (active.length) gridStatus.textContent = "GRID_DISTURBED";
  else gridStatus.textContent = "GRID_STABLE";

  // Hidden combination: three disturbances + under-frequency condition.
  if (disturbances.fault && disturbances.unbalance && disturbances.sag && freq <= 50 && !gridEasterTriggered) {
    gridEasterTriggered = true;
    triggerGridEasterEgg();
  }
}

ctrlFreq.addEventListener("input", () => {
  const f = ctrlFreq.value;
  valFreq.textContent  = `${f} Hz`;
  metaFreq.textContent = `${parseFloat(f).toFixed(2)}`;
  updateLabMeta();
});

ctrlAmp.addEventListener("input", () => {
  const a = ctrlAmp.value;
  const vrms = Math.round(a * 1.5);
  valAmp.textContent   = `${vrms} V`;
  metaVrms.textContent = `${vrms.toFixed(1)}`;
});

ctrlSpeed.addEventListener("input", () => {
  const sp = parseInt(ctrlSpeed.value, 10);
  valSpeed.textContent = sp === 0 ? "0× (stop)" : `${(sp / 5).toFixed(1)}×`;
});

document.querySelectorAll(".phase-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const idx = parseInt(btn.dataset.phase, 10);
    phaseVisible[idx] = !phaseVisible[idx];
    btn.classList.toggle("active", phaseVisible[idx]);
  });
});

btnPause.addEventListener("click", () => {
  scopePaused = !scopePaused;
  btnPause.textContent = scopePaused ? "▶ PLAY" : "⏸ PAUSE";
});

document.querySelectorAll("[data-disturbance]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.disturbance;
    disturbances[key] = !disturbances[key];
    btn.classList.toggle("active", disturbances[key]);
    updateLabMeta();
    trackPortfolioEvent("Grid lab", { action: key, enabled: disturbances[key] });
  });
});

document.getElementById("btn-reset")?.addEventListener("click", () => {
  Object.keys(disturbances).forEach(k => disturbances[k] = false);
  document.querySelectorAll("[data-disturbance]").forEach(b => b.classList.remove("active"));
  ctrlFreq.value = "60";
  ctrlAmp.value = "80";
  ctrlSpeed.value = "5";
  valFreq.textContent = "60 Hz";
  metaFreq.textContent = "60.00";
  valAmp.textContent = "120 V";
  metaVrms.textContent = "120.0";
  valSpeed.textContent = "1.0×";
  gridEasterTriggered = false;
  updateLabMeta();
});

function resizeScope() {
  const dpr = window.devicePixelRatio || 1;
  const rect = scopeCanvas.getBoundingClientRect();
  scopeCanvas.width = rect.width * dpr;
  scopeCanvas.height = rect.height * dpr;
  sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeScope();
window.addEventListener("resize", resizeScope);

const COLORS_PHASE = ["#ffb84d", "#7fb3d5", "#d97757"];

function phaseSample(theta, i, elapsed) {
  const shifts = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
  let phaseAmp = 1;
  let shift = shifts[i];

  if (disturbances.unbalance) {
    phaseAmp *= [1.0, 0.68, 0.86][i];
    shift += [0, 0.10, -0.08][i];
  }
  if (disturbances.sag) phaseAmp *= 0.53;

  let y = Math.sin(theta + shift) * phaseAmp;
  if (disturbances.fault) {
    if (i === 0) {
      // Phase-A fault: collapsed fundamental plus visible distortion/transient.
      y = Math.sin(theta + shift) * 0.13 + Math.sin(theta * 5 + elapsed * 0.01) * 0.08;
    } else {
      y *= 1.08;
    }
  }
  return y;
}

function drawScope(elapsed) {
  const { freq, amp, speed } = getScopeParams();
  const rect = scopeCanvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  sctx.clearRect(0, 0, w, h);

  sctx.strokeStyle = disturbances.fault ? "rgba(255,95,86,.07)" : "rgba(255,184,77,.06)";
  sctx.lineWidth = 1;
  const cols = 16, rows = 6;
  for (let i = 0; i <= cols; i++) {
    const x = (i / cols) * w;
    sctx.beginPath(); sctx.moveTo(x, 0); sctx.lineTo(x, h); sctx.stroke();
  }
  for (let j = 0; j <= rows; j++) {
    const y = (j / rows) * h;
    sctx.beginPath(); sctx.moveTo(0, y); sctx.lineTo(w, y); sctx.stroke();
  }

  sctx.strokeStyle = "rgba(232,230,225,.15)";
  sctx.beginPath(); sctx.moveTo(0, h / 2); sctx.lineTo(w, h / 2); sctx.stroke();

  sctx.fillStyle = disturbances.fault ? "rgba(255,95,86,.55)" : "rgba(255,184,77,.25)";
  sctx.font = "10px 'JetBrains Mono', monospace";
  sctx.fillText(`${freq} Hz / ${gridStatus.textContent}`, 8, h - 8);

  const drawAmp = h * 0.42 * amp;
  const cycles = 3;
  const speedMult = speed / 5;

  for (let i = 0; i < 3; i++) {
    if (!phaseVisible[i]) continue;
    sctx.strokeStyle = COLORS_PHASE[i];
    sctx.lineWidth = disturbances.fault && i === 0 ? 2.4 : 1.8;
    sctx.shadowColor = COLORS_PHASE[i];
    sctx.shadowBlur = disturbances.fault ? 12 : 8;
    sctx.beginPath();
    const points = 440;
    for (let p = 0; p <= points; p++) {
      const x = (p / points) * w;
      const freqScale = freq / 60;
      const theta = (p / points) * cycles * freqScale * Math.PI * 2 - elapsed * 0.003 * speedMult;
      const y = h / 2 - phaseSample(theta, i, elapsed) * drawAmp;
      if (p === 0) sctx.moveTo(x, y); else sctx.lineTo(x, y);
    }
    sctx.stroke();
    sctx.shadowBlur = 0;
  }

  sctx.strokeStyle = disturbances.fault ? "rgba(255,95,86,.65)" : "rgba(255,184,77,.4)";
  sctx.beginPath(); sctx.moveTo(w - 1, 0); sctx.lineTo(w - 1, h); sctx.stroke();
}

function scopeLoop(t) {
  requestAnimationFrame(scopeLoop);
  if (!scopePaused) scopeTimeOffset += t - lastRafTime;
  lastRafTime = t;
  drawScope(scopeTimeOffset);
}
requestAnimationFrame((t) => { lastRafTime = t; requestAnimationFrame(scopeLoop); });

/* =========================
   GRID FAILURE EASTER EGG
   FAULT + UNBALANCE + SAG + <= 50 Hz
   ========================= */
async function triggerGridEasterEgg() {
  if (gridSequenceRunning) return;
  gridSequenceRunning = true;
  trackPortfolioEvent("Easter egg", { name: "Grid failure" });

  const overlay = document.getElementById("grid-event");
  const title = document.getElementById("grid-event-title");
  const step = document.getElementById("grid-event-step");
  const progress = document.getElementById("grid-event-progress");
  overlay.hidden = false;
  document.body.classList.add("grid-blackout");

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const sequence = [
    ["GRID INSTABILITY DETECTED", "UNDER-FREQUENCY + MULTIPLE DISTURBANCES", "18%"],
    ["PROTECTION TRIP", "87 RELAY / PHASE_A ISOLATED", "42%"],
    ["ISLAND MODE", "CRITICAL BUSSES HOLDING", "66%"],
    ["BLACK START SEQUENCE", "SYNCHRONIZING SOURCES", "84%"],
    ["SYSTEM RESTORED", "GRID_STABLE / 60.00 Hz", "100%"],
  ];

  for (const [heading, detail, pct] of sequence) {
    title.textContent = heading;
    step.textContent = detail;
    progress.style.width = pct;
    await wait(850);
  }
  await wait(450);
  overlay.hidden = true;
  document.body.classList.remove("grid-blackout");
  gridSequenceRunning = false;
}

updateLabMeta();

/* =========================
   KONAMI EASTER EGG (extra) — type "race" to trigger
   ========================= */
let keyBuffer = "";
window.addEventListener("keydown", (e) => {
  keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-4);
  if (keyBuffer === "race") {
    triggerEasterEgg();
  }
});
