
// Simple press feedback for header buttons
document.querySelectorAll('.topheader button').forEach(btn => {
  const down = () => btn.classList.add('pressed');
  const up = () => btn.classList.remove('pressed');
  btn.addEventListener('touchstart', down, { passive: true });
  btn.addEventListener('touchend', up);
  btn.addEventListener('touchcancel', up);
  btn.addEventListener('mousedown', down);
  btn.addEventListener('mouseup', up);
  btn.addEventListener('mouseleave', up);
});

const navItems = document.querySelectorAll(".bottomheader .nav-item");
const slider = document.querySelector(".bottomheader .active-slider");

function moveSliderTo(el) {
  const index = [...navItems].indexOf(el);
  slider.style.transform = `translateX(${index * 100}%)`;
}

navItems.forEach(item => {
  item.addEventListener("click", () => {
    document.querySelector(".bottomheader .nav-item.active")?.classList.remove("active");
    item.classList.add("active");
    moveSliderTo(item);
  });
});

// on load: position slider to whatever is .active
const active = document.querySelector(".bottomheader .nav-item.active");
if (active) moveSliderTo(active);
