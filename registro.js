/* ============================================================
   Registro mágico — capibara + confeti + anillo de progreso
   ============================================================ */

const HAS_GSAP = typeof window.gsap !== "undefined";

const nameInput = document.getElementById("reg-name");
const emailInput = document.getElementById("reg-email");
const passInput = document.getElementById("reg-pass");
const confirmInput = document.getElementById("reg-confirm");
const fields = [nameInput, emailInput, passInput, confirmInput];
const ring = document.getElementById("progress-ring");
const hint = document.getElementById("matchHint");
const statusEl = document.getElementById("regStatus");
const form = document.getElementById("registerForm");
const card = document.querySelector(".register-card");

/* ------------------------------------------------------------
   1. LIENZO DE PARTÍCULAS (confeti + magia ambiental)
   ------------------------------------------------------------ */
const canvas = document.getElementById("magicCanvas");
const ctx = canvas.getContext("2d");
const COLORS = ["#FF9124", "#E67E17", "#78B159", "#AEE1F5", "#FFD45E", "#FF9EB5", "#FFFFFF"];
const particles = [];
let W = 0, H = 0, dpr = 1;

function resizeCanvas() {
  dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function spawn(x, y, opts = {}) {
  const angle = opts.angle ?? Math.random() * Math.PI * 2;
  const speed = opts.speed ?? 1.5 + Math.random() * 4;
  const life = opts.life ?? 60 + Math.random() * 50;
  particles.push({
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - (opts.lift || 0),
    g: opts.g ?? 0.09,
    size: opts.size ?? 4 + Math.random() * 6,
    color: opts.color ?? COLORS[(Math.random() * COLORS.length) | 0],
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    life, max: life,
    round: opts.round ?? Math.random() < 0.35,
    drag: opts.drag ?? 0.992,
    ambient: !!opts.ambient,
  });
}

function burst(x, y, count = 40, opts = {}) {
  for (let i = 0; i < count; i++) spawn(x, y, opts);
}

/* Partículas que suben lentamente por toda la página */
function spawnAmbient() {
  spawn(Math.random() * W, H + 12, {
    angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.9,
    speed: 0.3 + Math.random() * 0.6,
    g: -0.004,
    life: 420 + Math.random() * 220,
    size: 2 + Math.random() * 3,
    round: true,
    drag: 1,
    ambient: true,
    color: Math.random() < 0.5 ? "#FFD45E" : "#FFFFFF",
  });
}
setInterval(spawnAmbient, 220);

function renderParticles() {
  ctx.clearRect(0, 0, W, H);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vx *= p.drag;
    p.vy = p.vy * p.drag + p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life--;

    if (p.life <= 0 || p.y > H + 60 || p.x < -60 || p.x > W + 60) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = Math.min(1, p.life / 30) * (p.ambient ? 0.55 : 1);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.round) {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
    }
    ctx.restore();
  }
  requestAnimationFrame(renderParticles);
}
requestAnimationFrame(renderParticles);

function orangeCenter() {
  const r = document.getElementById("orange-ball").getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/* ------------------------------------------------------------
   2. IDLE + MIRADA QUE SIGUE AL RATÓN
   ------------------------------------------------------------ */
let moveEyesX, moveEyesY, moveSnoutX, moveSnoutY, moveEarsX, moveEarsY, moveOrangeX, moveOrangeY, moveOrangeRot;

if (HAS_GSAP) {
  gsap.set("#body", { transformOrigin: "50% 100%" });
  gsap.to("#body", { scaleX: 1.012, scaleY: 1.018, duration: 2.1, ease: "sine.inOut", yoyo: true, repeat: -1 });

  gsap.set("#leaf", { rotation: -5, transformOrigin: "0% 100%" });
  gsap.to("#leaf", { rotation: 9, duration: 1.7, ease: "sine.inOut", yoyo: true, repeat: -1 });

  gsap.set("#orange-tilt", { transformOrigin: "50% 95%" });
  gsap.set("#ears-bounce", { transformOrigin: "50% 100%" });
  gsap.set("#orange", { transformOrigin: "50% 95%" });

  const q = (target, prop) => gsap.quickTo(target, prop, { duration: 0.45, ease: "power3.out" });
  moveEyesX = q("#eyes", "x");
  moveEyesY = q("#eyes", "y");
  moveSnoutX = q("#snout", "x");
  moveSnoutY = q("#snout", "y");
  moveEarsX = q("#ears", "x");
  moveEarsY = q("#ears", "y");
  moveOrangeX = q("#orange", "x");
  moveOrangeY = q("#orange", "y");
  moveOrangeRot = q("#orange", "rotation");

  function blink() {
    gsap.to("#eyes", {
      scaleY: 0.12,
      transformOrigin: "50% 50%",
      duration: 0.11,
      ease: "power1.inOut",
      yoyo: true,
      repeat: 1,
      onComplete: () => gsap.set("#eyes", { clearProps: "scaleY,transformOrigin" }),
    });
    setTimeout(blink, 2600 + Math.random() * 3800);
  }
  setTimeout(blink, 2200);
}

function look(nx, ny) {
  if (!HAS_GSAP) return;
  moveEyesX(nx * 14);
  moveEyesY(ny * 9);
  moveSnoutX(nx * 8);
  moveSnoutY(ny * 5);
  moveEarsX(nx * 6);
  moveEarsY(ny * 4);
  moveOrangeX(nx * 13);
  moveOrangeY(ny * 7);
  moveOrangeRot(nx * 7);
}

window.addEventListener("mousemove", (e) => {
  const cx = window.innerWidth / 2 || 1;
  const cy = window.innerHeight / 2 || 1;
  look(
    Math.max(-1, Math.min(1, (e.clientX - cx) / cx)),
    Math.max(-1, Math.min(1, (e.clientY - cy) / cy))
  );
});
document.documentElement.addEventListener("mouseleave", () => look(0, 0));

/* ------------------------------------------------------------
   3. SONRISA + ANILLO DE PROGRESO + CELEBRACIÓN
   ------------------------------------------------------------ */
let smiling = false;
let celebrated = false;
const RING_LENGTH = 1219;
const ringState = { offset: RING_LENGTH };

function updateSmile() {
  const typing = fields.some((f) => f.value.length > 0);
  if (typing === smiling) return;
  smiling = typing;

  if (!HAS_GSAP) {
    document.getElementById("mouth-idle").style.opacity = typing ? "0" : "1";
    document.getElementById("mouth-smile").style.opacity = typing ? "1" : "0";
    return;
  }

  gsap.to("#mouth-idle", { opacity: typing ? 0 : 1, duration: 0.25 });
  gsap.to("#mouth-smile", { opacity: typing ? 1 : 0, duration: 0.25 });
  if (typing) {
    gsap.fromTo("#mouth-smile", { scale: 0.6, transformOrigin: "50% 0%" },
      { scale: 1, duration: 0.5, ease: "back.out(2)" });
    gsap.fromTo("#snout", { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" },
      { scaleX: 1.05, scaleY: 0.96, duration: 0.18, yoyo: true, repeat: 1 });
  }
}

function updateProgress() {
  const filled = fields.filter((f) => f.value.trim().length > 0).length;
  const offset = RING_LENGTH * (1 - filled / fields.length);
  if (HAS_GSAP) {
    gsap.to(ringState, {
      offset,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => ring.setAttribute("stroke-dashoffset", ringState.offset),
    });
  } else {
    ring.setAttribute("stroke-dashoffset", offset);
  }
}

function celebrate() {
  const c = orangeCenter();
  burst(c.x, c.y, 75, { speed: 5.5, size: 7, life: 90 });
  burst(c.x, c.y, 28, { speed: 2, size: 3, round: true, life: 130, color: "#FFD45E" });

  if (!HAS_GSAP) return;
  gsap.timeline()
    .to("#body", { y: -26, rotation: -3, duration: 0.22, ease: "power2.out" })
    .to("#body", { y: 0, rotation: 0, duration: 0.6, ease: "bounce.out" });
  gsap.fromTo("#ears-bounce", { y: 0 }, { y: -14, duration: 0.18, yoyo: true, repeat: 1 });
  gsap.fromTo("#orange-tilt", { rotation: 0 }, { rotation: 14, duration: 0.25, yoyo: true, repeat: 1 });
}

function checkMatch() {
  const a = passInput.value;
  const b = confirmInput.value;
  if (a && b) {
    if (a === b) {
      hint.textContent = "¡Coinciden! La magia está lista 🎉";
      hint.className = "match-hint ok";
      if (!celebrated) {
        celebrated = true;
        celebrate();
      }
    } else {
      hint.textContent = "Las contraseñas aún no coinciden 🤔";
      hint.className = "match-hint warn";
      celebrated = false;
    }
  } else {
    hint.textContent = "";
    hint.className = "match-hint";
    celebrated = false;
  }
}

/* Chispitas que salen del caret mientras escribes */
function sparkleAtCaret(input) {
  const r = input.getBoundingClientRect();
  const style = getComputedStyle(input);
  const measurer = sparkleAtCaret.canvas || (sparkleAtCaret.canvas = document.createElement("canvas").getContext("2d"));
  measurer.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const textWidth = measurer.measureText(input.value.slice(0, input.selectionStart ?? input.value.length)).width;
  const x = Math.min(r.right - 10, r.left + parseFloat(style.paddingLeft) + textWidth);
  const y = r.top + r.height / 2;
  for (let i = 0; i < 4; i++) {
    spawn(x, y, {
      angle: -Math.PI / 2 + (Math.random() - 0.5) * 1.6,
      speed: 0.5 + Math.random() * 1.3,
      g: -0.01,
      life: 40 + Math.random() * 25,
      size: 2 + Math.random() * 3,
      round: true,
      color: Math.random() < 0.5 ? "#FFD45E" : "#FF9124",
    });
  }
}

fields.forEach((input) => {
  input.addEventListener("input", () => {
    updateSmile();
    updateProgress();
    checkMatch();
    sparkleAtCaret(input);
  });
  input.addEventListener("focus", () => {
    if (HAS_GSAP) gsap.fromTo(card, { y: 0 }, { y: -3, duration: 0.2, yoyo: true, repeat: 1 });
  });
});

/* Ojitos para mostrar/ocultar contraseña */
document.querySelectorAll(".toggle-pass").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const showing = input.type === "password";
    input.type = showing ? "text" : "password";
    btn.classList.toggle("is-visible", showing);
    btn.setAttribute("aria-label", showing ? "Ocultar contraseña" : "Mostrar contraseña");
    input.focus();
  });
});

/* Envío */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const allFilled = fields.every((f) => f.value.trim().length > 0);
  const match = passInput.value.length > 0 && passInput.value === confirmInput.value;

  if (allFilled && match) {
    const c = orangeCenter();
    burst(c.x, c.y, 130, { speed: 8, size: 9, life: 130 });
    const cr = card.getBoundingClientRect();
    burst(cr.left + cr.width * 0.25, cr.top + 50, 38, { speed: 5 });
    burst(cr.left + cr.width * 0.75, cr.top + 50, 38, { speed: 5 });
    statusEl.textContent = "¡Cuenta creada! Bienvenido a la manada 🐾";
    if (HAS_GSAP) gsap.fromTo(card, { y: 0 }, { y: -10, duration: 0.18, yoyo: true, repeat: 1 });
  } else {
    statusEl.textContent = "Revisa los campos y que las contraseñas coincidan 🍊";
    if (HAS_GSAP) gsap.fromTo(card, { x: 0 }, { x: -8, duration: 0.07, yoyo: true, repeat: 3 });
  }
});
