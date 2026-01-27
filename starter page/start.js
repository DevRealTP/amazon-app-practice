// Touch behavior and movement
document.querySelectorAll('.topheader button, .bottomheader button').forEach(btn => {
  btn.addEventListener('touchstart', () => btn.classList.add('pressed'), { passive: true });
  btn.addEventListener('touchend', () => btn.classList.remove('pressed'));
  btn.addEventListener('touchcancel', () => btn.classList.remove('pressed'));

  btn.addEventListener('mousedown', () => btn.classList.add('pressed'));
  btn.addEventListener('mouseup', () => btn.classList.remove('pressed'));
  btn.addEventListener('mouseleave', () => btn.classList.remove('pressed'));
});

// ---------------------------
// Side menu: OPEN & CLOSE
const menuBtn = document.querySelector('.topheader-menu');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const menuCloseBtn = document.getElementById('menuCloseBtn');

function openMenu() {
  sideMenu.classList.add('is-open');
  menuOverlay.classList.add('is-open');
  sideMenu.setAttribute('aria-hidden', 'false');
  menuOverlay.setAttribute('aria-hidden', 'false');
}
function closeMenu() {
  sideMenu.classList.remove('is-open');
  menuOverlay.classList.remove('is-open');
  sideMenu.setAttribute('aria-hidden', 'true');
  menuOverlay.setAttribute('aria-hidden', 'true');
}
menuBtn?.addEventListener('click', openMenu);
menuBtn?.addEventListener('touchend', (e) => { e.preventDefault(); openMenu(); }, { passive: false });

menuCloseBtn?.addEventListener('click', closeMenu);
menuOverlay?.addEventListener('click', closeMenu);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// ---------------------------
// Cookie logic
document.addEventListener('DOMContentLoaded', () => {
  const consentExpiry = localStorage.getItem('cookieconsent-expiry');
  const onemin = 60 * 1000;

  if (consentExpiry && Date.now() > Number(consentExpiry)) {
    localStorage.removeItem('cookieconsent');
    localStorage.removeItem('cookieconsent-expiry');
  }

  const cookieconsent = localStorage.getItem('cookieconsent');

  if (cookieconsent !== '✓') {
    openPopup('popupaskcookies');
  }

  const buttonpressed = document.querySelectorAll(
    '#acceptall-button, #declineall-button, #declineall-button-closepopup, #acceptall-button-closepopup'
  );
  const closepopup = ['popupcookiesaccept', 'popupcookiesdecline', 'popupcookiesapplied', 'popupaskcookies'];

  buttonpressed.forEach(button => {
    button.addEventListener('click', () => {
      localStorage.setItem('cookieconsent-expiry', Date.now() + onemin);

      if (button.id === 'acceptall-button' || button.id === 'acceptall-button-closepopup') {
        localStorage.setItem('cookieconsent', '✓');
      }

      if (button.id === 'declineall-button' || button.id === 'declineall-button-closepopup') {
        localStorage.setItem('cookieconsent', '✗');
      }

      setTimeout(() => {
        closepopup.forEach(id => closePopup(id));
      }, 5000);
    });
  });
});

// ---------------------------
// Email domain chips
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('email');
  const bar = document.getElementById('emailSuggest');
  if (!input || !bar) return;

  const domains = [
    { domain: 'amazon.com',  icon: 'fa-brands fa-amazon' },
    { domain: 'gmail.com',   icon: 'fa-brands fa-google' },
    { domain: 'yahoo.com',   icon: 'fa-brands fa-yahoo' },
    { domain: 'outlook.com', icon: 'fa-brands fa-microsoft' },
    { domain: 'icloud.com',  icon: 'fa-brands fa-apple' },
    { domain: 'hotmail.com', icon: 'fa-brands fa-microsoft' },
    { domain: 'live.com',    icon: 'fa-regular fa-cloud' },
    { domain: 'kevin.com',   icon: 'fa-solid fa-k' }
  ];

  const domainSet = new Set(domains.map(d => d.domain.toLowerCase()));
  let chipsIdleTimer = null;

  function stopIdleTimer() {
    clearTimeout(chipsIdleTimer);
    chipsIdleTimer = null;
  }

  function startIdleTimer() {
    stopIdleTimer();
    chipsIdleTimer = setTimeout(() => {
      closeBar();
    }, 3500);
  }

  function closeBar() {
    stopIdleTimer();
    bar.classList.remove('is-open');
    bar.innerHTML = '';
  }

  // Close if exact domain match after @
  function EMCB(v) {
    const at = v.indexOf('@');
    if (at === -1) return false;

    const user = v.slice(0, at).trim();
    const domain = v.slice(at + 1).trim().toLowerCase();

    if (!user) return true;
    if (domainSet.has(domain)) return true;
    return false;
  }

  function openChips(user, filteredItems) {
    if (!filteredItems.length) return closeBar();

    bar.innerHTML = '';

    filteredItems.forEach(({ domain, icon }) => {
      const btn = document.createElement('button');
      btn.type = 'button';

      btn.innerHTML = `<i class="${icon}" aria-hidden="true"></i><span><strong>@</strong>${domain}</span>`;

      let startX = 0, startY = 0, moved = false;

      btn.addEventListener('pointerdown', (e) => {
        startX = e.clientX;
        startY = e.clientY;
        moved = false;
      }, { passive: true });

      btn.addEventListener('pointermove', (e) => {
        if (Math.abs(e.clientX - startX) > 8 || Math.abs(e.clientY - startY) > 8) moved = true;
      }, { passive: true });

      btn.addEventListener('pointerup', () => {
        if (moved) return;

        const newVal = `${user}@${domain}`;
        input.value = newVal;
        input.dispatchEvent(new Event('input', { bubbles: true }));

        closeBar();
        input.focus({ preventScroll: true });
      });

      bar.appendChild(btn);
    });

    bar.classList.add('is-open');
    startIdleTimer();
  }

  input.addEventListener('input', () => {
    const v = input.value.trim();

    // close if exact match exists
    if (EMCB(v)) return closeBar();

    const at = v.indexOf('@');
    if (at === -1) return closeBar();

    const user = v.slice(0, at);
    const partial = v.slice(at + 1).toLowerCase();
    if (!user) return closeBar();

    const filtered = domains
      .filter(x => x.domain.toLowerCase().startsWith(partial))
      .slice(0, 8);

    openChips(user, filtered);

    // reset timer on every keystroke while open
    startIdleTimer();
  });

  // optional: interacting with the chip bar keeps it open
  bar.addEventListener('pointerdown', startIdleTimer, { passive: true });
  bar.addEventListener('touchstart', startIdleTimer, { passive: true });

  document.addEventListener('pointerdown', (e) => {
    if (e.target !== input && !bar.contains(e.target)) closeBar();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBar();
  });
});

// ---------------------------
// Shared: Continue button gating + password opening
const continueButton = document.querySelector('.continue-button');

// IMPORTANT: these must be let (you update them)
let emailcheck = false;
let phonecheck = false;

function nextButtonAllowed() {
  if (!continueButton) return;

  const allowed = emailcheck && phonecheck;

  continueButton.disabled = !allowed;
  continueButton.setAttribute('aria-disabled', String(!allowed));
  continueButton.classList.toggle('is-enabled', allowed);
}

function updateContinueTarget() {
  if (!continueButton) return;

  // This only works if your password popup is:
  // <div class="popup" id="popuppassword" data-popup="popuppassword">
  if (emailcheck && phonecheck) {
    continueButton.dataset.open = 'popuppassword';
  } else {
    delete continueButton.dataset.open;
  }
}

// Bullet-proof: open password directly when allowed (doesn't depend on dataset being re-read)
if (continueButton) {
  continueButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (emailcheck && phonecheck) {
      openPopup('popuppassword');
    } else {
      openPopup('popupinvaild');
    }
  });
} else {
  // continue button not found — nothing to attach
}

// set initial disabled + target state
nextButtonAllowed();
updateContinueTarget();

// ---------------------------
// Email validation (spinner -> tick/cross)
const emailinput = document.getElementById('email');
const emailstatusicon = document.getElementById('emailStatusIcon');

let spinnerTimer = null;
let finalTimer = null;
let emptyTimer = null;

function seticon(iconClasses, spin = false) {
  if (!emailstatusicon) return;

  emailstatusicon.classList.remove(
    'fa-regular', 'fa-solid', 'fa-brands',
    'fa-circle', 'fa-circle-notch', 'fa-square-check', 'fa-square-xmark'
  );

  iconClasses.split(' ').forEach(c => emailstatusicon.classList.add(c));
  emailstatusicon.classList.add('signup-righticon');
  emailstatusicon.classList.toggle('spin', !!spin);
}

function isValidEmail(v) {
  return /^(?!\.)(?!.*\.\.)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?<!\.)@(?=.{1,253}$)(?!-)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(?<!-)\.[a-zA-Z]{2,}$/.test(v);
}

if (emailinput && emailstatusicon) {
  // initial idle
  seticon('fa-regular fa-circle', false);
  emailstatusicon.classList.toggle('idle', true);
  emailstatusicon.classList.toggle('valid', false);
  emailstatusicon.classList.toggle('invalid', false);
  emailstatusicon.classList.toggle('loading', false);

  emailinput.addEventListener('input', () => {
    const v = emailinput.value.trim();

    clearTimeout(spinnerTimer);
    clearTimeout(finalTimer);
    clearTimeout(emptyTimer);

    // empty
    if (!v) {
      seticon('fa-solid fa-square-xmark', false);
      emailstatusicon.classList.toggle('valid', false);
      emailstatusicon.classList.toggle('invalid', true);
      emailstatusicon.classList.toggle('idle', false);
      emailstatusicon.classList.toggle('loading', false);

      emailcheck = false;
      nextButtonAllowed();
      updateContinueTarget();

      emptyTimer = setTimeout(() => {
        if (!emailinput.value.trim()) {
          seticon('fa-regular fa-circle', false);
          emailstatusicon.classList.toggle('valid', false);
          emailstatusicon.classList.toggle('invalid', false);
          emailstatusicon.classList.toggle('idle', true);
          emailstatusicon.classList.toggle('loading', false);
        }
      }, 2500);

      return;
    }

    // spinner
    spinnerTimer = setTimeout(() => {
      seticon('fa-solid fa-circle-notch', true);
      emailstatusicon.classList.toggle('valid', false);
      emailstatusicon.classList.toggle('invalid', false);
      emailstatusicon.classList.toggle('idle', false);
      emailstatusicon.classList.toggle('loading', true);

      emailcheck = false;
      nextButtonAllowed();
      updateContinueTarget();
    }, 190);

    // final
    finalTimer = setTimeout(() => {
      const ok = isValidEmail(v);

      seticon(ok ? 'fa-solid fa-square-check' : 'fa-solid fa-square-xmark', false);
      emailstatusicon.classList.toggle('valid', ok);
      emailstatusicon.classList.toggle('invalid', !ok);
      emailstatusicon.classList.toggle('idle', false);
      emailstatusicon.classList.toggle('loading', false);

      emailcheck = ok;
      nextButtonAllowed();
      updateContinueTarget();
    }, 700);
  });
}

// ---------------------------
// Phone validation (spinner -> tick/cross)
const phoneInput = document.getElementById('phone');
const phoneCountry = document.getElementById('phoneCountry');
const phoneStatusIcon = document.getElementById('phoneStatusIcon');

let phoneSpinnerTimer = null;
let phoneFinalTimer = null;
let phoneEmptyTimer = null;

function setPhoneIcon(iconClasses, spin = false) {
  if (!phoneStatusIcon) return;

  phoneStatusIcon.classList.remove(
    'fa-regular', 'fa-solid', 'fa-brands',
    'fa-circle', 'fa-circle-notch', 'fa-square-check', 'fa-square-xmark'
  );

  iconClasses.split(' ').forEach(c => phoneStatusIcon.classList.add(c));
  phoneStatusIcon.classList.add('signup-righticon');
  phoneStatusIcon.classList.toggle('spin', !!spin);
}

function isPhoneNumberValid(rawNumber, selectedCallingCode = '') {
  const n = String(rawNumber || '').trim();
  if (!n) return false;

  const digits = n.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return false;

  // If user typed +, validate E.164-ish
  const compact = n.replace(/[\s().-]/g, '');
  if (compact.startsWith('+')) {
    return /^\+[1-9]\d{6,14}$/.test(compact);
  }

  // Otherwise validate using selected calling code
  if (selectedCallingCode) {
    const normalised = digits.startsWith('0') ? digits.slice(1) : digits; // handy for UK-style 07...
    const full = `${selectedCallingCode}${normalised}`.replace(/\s/g, '');
    return /^\+[1-9]\d{6,14}$/.test(full);
  }

  // Fallback: digits only
  return /^\d{7,15}$/.test(digits);
}

if (phoneInput && phoneCountry && phoneStatusIcon) {
  // initial idle
  setPhoneIcon('fa-regular fa-circle', false);
  phoneStatusIcon.classList.toggle('idle', true);
  phoneStatusIcon.classList.toggle('valid', false);
  phoneStatusIcon.classList.toggle('invalid', false);
  phoneStatusIcon.classList.toggle('loading', false);

  function validatePhone() {
    const v = phoneInput.value.trim();
    const code = phoneCountry.value;

    clearTimeout(phoneSpinnerTimer);
    clearTimeout(phoneFinalTimer);
    clearTimeout(phoneEmptyTimer);

    // empty
    if (!v) {
      setPhoneIcon('fa-solid fa-square-xmark', false);
      phoneStatusIcon.classList.toggle('valid', false);
      phoneStatusIcon.classList.toggle('invalid', true);
      phoneStatusIcon.classList.toggle('idle', false);
      phoneStatusIcon.classList.toggle('loading', false);

      phonecheck = false;
      nextButtonAllowed();
      updateContinueTarget();

      phoneEmptyTimer = setTimeout(() => {
        if (!phoneInput.value.trim()) {
          setPhoneIcon('fa-regular fa-circle', false);
          phoneStatusIcon.classList.toggle('valid', false);
          phoneStatusIcon.classList.toggle('invalid', false);
          phoneStatusIcon.classList.toggle('idle', true);
          phoneStatusIcon.classList.toggle('loading', false);
        }
      }, 2500);

      return;
    }

    // spinner
    phoneSpinnerTimer = setTimeout(() => {
      setPhoneIcon('fa-solid fa-circle-notch', true);
      phoneStatusIcon.classList.toggle('valid', false);
      phoneStatusIcon.classList.toggle('invalid', false);
      phoneStatusIcon.classList.toggle('idle', false);
      phoneStatusIcon.classList.toggle('loading', true);

      phonecheck = false;
      nextButtonAllowed();
      updateContinueTarget();
    }, 190);

    // final
    phoneFinalTimer = setTimeout(() => {
      const valid = isPhoneNumberValid(v, code);

      setPhoneIcon(valid ? 'fa-solid fa-square-check' : 'fa-solid fa-square-xmark', false);
      phoneStatusIcon.classList.toggle('valid', valid);
      phoneStatusIcon.classList.toggle('invalid', !valid);
      phoneStatusIcon.classList.toggle('idle', false);
      phoneStatusIcon.classList.toggle('loading', false);

      phonecheck = valid;
      nextButtonAllowed();
      updateContinueTarget();
    }, 700);
  }

  phoneInput.addEventListener('input', validatePhone);
  phoneCountry.addEventListener('change', validatePhone);
}