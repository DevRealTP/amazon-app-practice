// Stack and drag LOGIC
const overlay = document.getElementById("overlay");
const popups = [...document.querySelectorAll(".popup[data-popup]")];

let activePopup = null;
let startY = 0;
let currentY = 0;
let dragging = false;

function openPopup(id) {
  const el = document.getElementById(id);
  if (!el) return;

  popups.forEach(p => {
    p.classList.remove("active", "dragging");
    p.style.transform = "";
  });

  overlay.classList.add("active");
  el.classList.add("active");
  el.style.transform = "translateY(0)";
  overlay.style.background = "rgba(0,0,0,0.45)";

  document.body.style.overflow = "hidden";
  activePopup = el;
}

function closePopup() {
  if (activePopup) {
    activePopup.classList.remove("active", "dragging");
    activePopup.style.transform = "";
  }

  overlay.classList.remove("active");
  overlay.style.background = "rgba(0,0,0,0.45)";
  document.body.style.overflow = "";

  activePopup = null;
}

document.addEventListener("pointerup", (e) => {
  const openBtn = e.target.closest("[data-open]");
  if (openBtn) return openPopup(openBtn.dataset.open);

  const switchBtn = e.target.closest("[data-switch]");
  if (switchBtn) return openPopup(switchBtn.dataset.switch);

  if (e.target === overlay || e.target.closest("[data-close]")) {
    e.preventDefault();
    return closePopup();
  }
});

overlay.addEventListener("pointerup", closePopup);

function onDown(e) {
  if (!activePopup || !activePopup.classList.contains("active")) return;
  if (e.target.closest && e.target.closest("[data-close]")) return;

  dragging = true;
  activePopup.classList.add("dragging");
  startY = e.clientY;
  currentY = 0;
}

function onMove(e) {
  if (!dragging || !activePopup) return;

  currentY = Math.max(0, e.clientY - startY);
  activePopup.style.transform = `translateY(${currentY}px)`;

  const fade = Math.max(0, 0.45 - currentY / 500);
  overlay.style.background = `rgba(0,0,0,${fade})`;

  e.preventDefault();
}

function onUp() {
  if (!dragging || !activePopup) return;

  dragging = false;
  activePopup.classList.remove("dragging");
  overlay.style.background = "rgba(0,0,0,0.45)";

  if (currentY > 160) closePopup();
  else activePopup.style.transform = "translateY(0)";
}

popups.forEach(p => {
  p.addEventListener("pointerdown", onDown);
  p.addEventListener("pointermove", onMove, { passive: false });
  p.addEventListener("pointerup", onUp);
  p.addEventListener("pointercancel", onUp);
});
// ---------------------------