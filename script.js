/* ============================================================
   Capibara Login — mecánica "Yeti Login" con GSAP
   ============================================================ */

const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const togglePass = document.getElementById("togglePass");
const loginForm = document.getElementById("loginForm");
const statusEl = document.getElementById("status");

const HAS_GSAP = typeof window.gsap !== "undefined";

/* ------------------------------------------------------------
   1. ANIMACIONES EN REPOSO (idle)
   ------------------------------------------------------------ */
if (HAS_GSAP) {
  gsap.set("#body", { transformOrigin: "50% 100%" });

  // Respiración suave del cuerpo
  gsap.to("#body", {
    scaleX: 1.012,
    scaleY: 1.018,
    duration: 2.1,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });

  // Balanceo de la hoja de la naranja
  gsap.set("#leaf", { rotation: -5, transformOrigin: "0% 100%" });
  gsap.to("#leaf", {
    rotation: 9,
    duration: 1.7,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });

  // Parpadeo aleatorio
  function blink() {
    gsap.to("#eye-left, #eye-right", {
      scaleY: 0.12,
      transformOrigin: "50% 50%",
      duration: 0.11,
      ease: "power1.inOut",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        gsap.set("#eye-left, #eye-right", { clearProps: "scaleY,transformOrigin" });
      },
    });
    setTimeout(blink, 2600 + Math.random() * 3800);
  }
  setTimeout(blink, 2200);
}

/* ------------------------------------------------------------
   2. MIRADA: SIGUE AL RATÓN (2 ejes) Y AL CARET
   ------------------------------------------------------------ */
let moveEyesX, moveEyesY, moveSnoutX, moveSnoutY;
let moveEarsX, moveEarsY, moveOrangeX, moveOrangeY, moveOrangeRot;

if (HAS_GSAP) {
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
}

/** nx, ny en -1..1. Mueve todos los rasgos como si "miraran". */
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

/* El capibara sigue el ratón desde cualquier punto de la página */
window.addEventListener("mousemove", (e) => {
  const cx = window.innerWidth / 2 || 1;
  const cy = window.innerHeight / 2 || 1;
  const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / cx));
  const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / cy));
  look(nx, ny);
});

/* Vuelve a mirar al frente si el ratón sale de la ventana */
document.documentElement.addEventListener("mouseleave", () => look(0, 0));

/** Devuelve 0..1 según el ancho del texto antes del caret. */
function caretRatio(input) {
  const style = getComputedStyle(input);
  const canvas = caretRatio.canvas || (caretRatio.canvas = document.createElement("canvas"));
  const ctx = canvas.getContext("2d");
  ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const caret = input.selectionStart ?? input.value.length;
  const textWidth = ctx.measureText(input.value.slice(0, caret)).width;
  const available = input.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  return Math.max(0, Math.min(1, textWidth / Math.max(available, 1)));
}

let hadAt = false;

function onEmailChange() {
  // Al escribir, el caret manda (el ratón retoma el control al moverse).
  look(caretRatio(emailInput) * 2 - 1, 0);

  // Reacción alegre al escribir "@"
  const hasAt = emailInput.value.includes("@");
  if (HAS_GSAP && hasAt && !hadAt) {
    gsap.fromTo(
      "#ears-bounce",
      { y: 0 },
      { y: -12, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" }
    );
    gsap.fromTo(
      "#orange-tilt",
      { rotation: 0 },
      { rotation: 11, duration: 0.28, yoyo: true, repeat: 1, ease: "power2.out" }
    );
  }
  hadAt = hasAt;
}

["input", "keyup", "click", "select", "focus"].forEach((evt) =>
  emailInput.addEventListener(evt, onEmailChange)
);

/* ------------------------------------------------------------
   2b. SONRISA AL EMPEZAR A ESCRIBIR
   ------------------------------------------------------------ */
let isSmiling = false;

function updateSmile() {
  const typing = emailInput.value.length > 0 || passInput.value.length > 0;
  if (typing === isSmiling) return;
  isSmiling = typing;

  if (!HAS_GSAP) {
    document.getElementById("mouth-idle").style.opacity = typing ? "0" : "1";
    document.getElementById("mouth-smile").style.opacity = typing ? "1" : "0";
    return;
  }

  gsap.to("#mouth-idle", { opacity: typing ? 0 : 1, duration: 0.25, ease: "power2.out" });
  gsap.to("#mouth-smile", { opacity: typing ? 1 : 0, duration: 0.25, ease: "power2.out" });

  if (typing) {
    gsap.fromTo(
      "#mouth-smile",
      { scale: 0.6, transformOrigin: "50% 0%" },
      { scale: 1, duration: 0.5, ease: "back.out(2)" }
    );
    gsap.fromTo(
      "#snout",
      { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" },
      { scaleX: 1.05, scaleY: 0.96, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }
    );
  }
}

[emailInput, passInput].forEach((input) => input.addEventListener("input", updateSmile));

/* ------------------------------------------------------------
   3. CUBRIRSE LOS OJOS EN LA CONTRASEÑA
   ------------------------------------------------------------ */
const PAW_DOWN = 330;

function lowerPaws() {
  if (!HAS_GSAP) return;
  gsap.to("#paw-left", { x: 0, y: PAW_DOWN, rotation: 0, duration: 0.45, ease: "power2.in" });
  gsap.to("#paw-right", { x: 0, y: PAW_DOWN, rotation: 0, duration: 0.45, ease: "power2.in" });
}

function raisePaws() {
  if (!HAS_GSAP) return;
  gsap.to("#paw-left", { x: 0, y: 0, rotation: 0, duration: 0.55, ease: "back.out(1.6)" });
  gsap.to("#paw-right", { x: 0, y: 0, rotation: 0, duration: 0.55, ease: "back.out(1.6)", delay: 0.05 });
}

let passFocused = false;

passInput.addEventListener("focus", () => {
  passFocused = true;
  raisePaws();
});

passInput.addEventListener("blur", () => {
  passFocused = false;
  // Si estaba espiando, vuelve a taparse antes de bajar
  if (HAS_GSAP) {
    gsap.set("#paw-right", { x: 0, rotation: 0 });
  }
  lowerPaws();
});

/* ------------------------------------------------------------
   4. BOTÓN VER / OCULTAR CONTRASEÑA → "ESPIAR"
   ------------------------------------------------------------ */
togglePass.addEventListener("click", () => {
  // El botón roba el foco al hacer clic: lo devolvemos antes de animar.
  passInput.focus();

  const showing = passInput.type === "password";
  passInput.type = showing ? "text" : "password";
  togglePass.classList.toggle("is-visible", showing);
  togglePass.setAttribute("aria-label", showing ? "Ocultar contraseña" : "Mostrar contraseña");

  if (HAS_GSAP && passFocused) {
    if (showing) {
      // Separa la patita derecha para espiar tiernamente
      gsap.to("#paw-right", {
        x: 26,
        rotation: -4,
        svgOrigin: "250 330", // gira desde el hombro, no desde la mano
        duration: 0.45,
        ease: "back.out(1.5)",
      });
      gsap.fromTo(
        "#eye-right",
        { scaleY: 1 },
        { scaleY: 1.25, transformOrigin: "50% 50%", duration: 0.25, yoyo: true, repeat: 1 }
      );
    } else {
      gsap.to("#paw-right", {
        x: 0,
        rotation: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }
});

/* ------------------------------------------------------------
   5. ENVÍO (solo feedback visual, sin backend)
   ------------------------------------------------------------ */
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const ok = emailInput.value.trim() !== "" && passInput.value.trim() !== "";
  statusEl.textContent = ok ? "¡Listo! Qué lindo capibara 🐾" : "Completa los campos, por favor 🍊";

  if (HAS_GSAP) {
    gsap.fromTo(statusEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 });
    gsap.fromTo(
      "#orange-tilt",
      { rotation: 0 },
      { rotation: -10, duration: 0.18, yoyo: true, repeat: 3, ease: "power2.inOut" }
    );
  }

  emailInput.blur();
  passInput.blur();
});
