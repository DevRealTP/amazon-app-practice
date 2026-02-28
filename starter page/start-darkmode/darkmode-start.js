const screenToggle = document.getElementById('toggle-checkbox-screen-mode');
const logoTop = document.getElementById('amazonLogo');
const logoMenu = document.getElementById('amazonLogoMenu');
const screenmodetext = document.getElementById('screen-mode-text');

const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');


// ===== APPLY THEME =====
function applyTheme(isDark, savePreference = true) {
  document.body.classList.toggle('dark', isDark);

  const logoSrc = isDark
    ? '../images/amazon_white.webp'
    : '../images/amazon_black.png';

  if (logoTop) logoTop.src = logoSrc;
  if (logoMenu) logoMenu.src = logoSrc;

  // swap main slider graphic (light/dark versions)
  const slideImg = document.getElementById('slideMainImg');
  if (slideImg) {
    slideImg.src = isDark
      ? '../images/sliders/slide-main/Add a heading (3).png'
      : '../images/sliders/slide-main/Add a heading (2).png';
  }

  // 🔹 Update description text
  updateModeText(isDark);

  if (savePreference) {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}


// ===== INITIALIZE =====
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const hasUserChoice = savedTheme === 'dark' || savedTheme === 'light';

  const isDark = hasUserChoice
    ? savedTheme === 'dark'
    : systemThemeQuery.matches;

  applyTheme(isDark, false);

  if (screenToggle) {
    screenToggle.checked = isDark;
  }
}


// ===== MANUAL TOGGLE =====
function handleToggle() {
  if (!screenToggle) return;
  applyTheme(screenToggle.checked, true);
}


// ===== SYSTEM CHANGES =====
function listenForSystemChanges() {
  systemThemeQuery.addEventListener('change', (e) => {
    const saved = localStorage.getItem('theme');
    const lockedIn = saved === 'dark' || saved === 'light';

    // Ignore OS changes if user chose manually
    if (lockedIn) return;

    applyTheme(e.matches, false);

    if (screenToggle) {
      screenToggle.checked = e.matches;
    }
  });
}


// ===== SIDE MENU CLICK SUPPORT =====
document.querySelectorAll('.side-menu-toggle').forEach((row) => {
  const toggle = () => {
    if (!screenToggle) return;
    screenToggle.checked = !screenToggle.checked;
    handleToggle();
  };

  row.addEventListener('click', (e) => {
    if (e.target.closest('label.switch')) return;
    toggle();
  });

  row.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
});


// ===== TEXT SWITCHING =====
function updateModeText(isDark) {
  if (!screenmodetext) return;

  screenmodetext.innerHTML = isDark
    ? 'Switch the interface from <strong>Dark Mode</strong> to <strong>Light Mode</strong>. <strong>Data is saved.</strong>'
    : 'Switch the interface from <strong>Light Mode</strong> to <strong>Dark Mode</strong>. <strong>Data is saved.</strong>';
}


// ===== START =====
initializeTheme();

if (screenToggle) {
  screenToggle.addEventListener('change', handleToggle);
}

listenForSystemChanges();