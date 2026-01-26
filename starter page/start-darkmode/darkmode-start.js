// ===== DARK MODE (Light by default) =====
const screenToggle = document.getElementById('screenModeToggle');
const screenLabel  = document.getElementById('screenModeLabel');

const logoTop  = document.getElementById('amazonLogo');
const logoMenu = document.getElementById('amazonLogoMenu');

function setMode(isDark){
  document.body.classList.toggle('dark', isDark);

  if (screenLabel){
    screenLabel.textContent = isDark ? 'Dark mode' : 'Light mode';
  }

  // ✅ Swap images based on mode
  if (logoTop)  logoTop.src  = isDark ? "../images/amazon_white.webp" : "../images/amazon_black.png";
  if (logoMenu) logoMenu.src = isDark ? "../images/amazon_white.webp" : "../images/amazon_black.png";

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Default = LIGHT (unless user previously picked dark)
const savedTheme = localStorage.getItem('theme');
const initialDark = savedTheme ? (savedTheme === 'dark') : false;

setMode(initialDark);

if (screenToggle){
  screenToggle.checked = initialDark;

  // When user clicks the actual switch
  screenToggle.addEventListener('change', () => {
    setMode(screenToggle.checked);
  });
}

// When user clicks anywhere on the "Screen mode" row (not just the switch)
document.querySelectorAll('.side-menu-toggle').forEach(row => {
  row.addEventListener('click', (e) => {
    // If user clicked the switch itself, let it handle it
    if (e.target.closest('label.switch')) return;
    if (!screenToggle) return;

    screenToggle.checked = !screenToggle.checked;
    setMode(screenToggle.checked);
  });

  row.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!screenToggle) return;

      screenToggle.checked = !screenToggle.checked;
      setMode(screenToggle.checked);
    }
  });
});