/* =========================================================
   Juan Quintero — Portfolio
   app.js
   ========================================================= */

import * as THREE from "three";

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
  document.querySelector(".click-hint")?.style.setProperty("display", "none");
}

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
   SCOPE — 3-phase 60 Hz sine wave
   ========================= */
const scopeCanvas = document.getElementById("scope-canvas");
const sctx = scopeCanvas.getContext("2d");

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

function drawScope(time) {
  const rect = scopeCanvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  sctx.clearRect(0, 0, w, h);

  // grid
  sctx.strokeStyle = "rgba(255, 184, 77, 0.06)";
  sctx.lineWidth = 1;
  const cols = 16;
  const rows = 6;
  for (let i = 0; i <= cols; i++) {
    const x = (i / cols) * w;
    sctx.beginPath();
    sctx.moveTo(x, 0);
    sctx.lineTo(x, h);
    sctx.stroke();
  }
  for (let j = 0; j <= rows; j++) {
    const y = (j / rows) * h;
    sctx.beginPath();
    sctx.moveTo(0, y);
    sctx.lineTo(w, y);
    sctx.stroke();
  }

  // axis center
  sctx.strokeStyle = "rgba(232, 230, 225, 0.15)";
  sctx.beginPath();
  sctx.moveTo(0, h / 2);
  sctx.lineTo(w, h / 2);
  sctx.stroke();

  // sine waves — 3 phases offset by 120°
  const amp = h * 0.36;
  const cycles = 3;
  const phaseShifts = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];

  phaseShifts.forEach((shift, i) => {
    sctx.strokeStyle = COLORS_PHASE[i];
    sctx.lineWidth = 1.8;
    sctx.shadowColor = COLORS_PHASE[i];
    sctx.shadowBlur = 8;
    sctx.beginPath();
    const points = 300;
    for (let p = 0; p <= points; p++) {
      const x = (p / points) * w;
      const t = (p / points) * cycles * Math.PI * 2;
      const y = h / 2 - Math.sin(t + shift - time * 0.003) * amp;
      if (p === 0) sctx.moveTo(x, y);
      else sctx.lineTo(x, y);
    }
    sctx.stroke();
    sctx.shadowBlur = 0;
  });

  // sweep cursor (right edge "now" indicator)
  const cursorX = w - 1;
  sctx.strokeStyle = "rgba(255, 184, 77, 0.4)";
  sctx.lineWidth = 1;
  sctx.beginPath();
  sctx.moveTo(cursorX, 0);
  sctx.lineTo(cursorX, h);
  sctx.stroke();
}

function scopeLoop(t) {
  drawScope(t);
  requestAnimationFrame(scopeLoop);
}
requestAnimationFrame(scopeLoop);

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
