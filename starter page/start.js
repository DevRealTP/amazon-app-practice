// Touch behaviour and movement
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
  const cookietimer = 60 * 10000;

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
      localStorage.setItem('cookieconsent-expiry', Date.now() + cookietimer);

      if (button.id === 'acceptall-button' || button.id === 'acceptall-button-closepopup') {
        localStorage.setItem('cookieconsent', '✓');
      }

      if (button.id === 'declineall-button' || button.id === 'declineall-button-closepopup') {
        localStorage.setItem('cookieconsent', '✗');
      }
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
// ---------------------------
// Shared: Continue + Next button gating
const continueButton = document.querySelector('.continue-button');
const nextbutton = document.querySelector('.next-button'); // ✅ FIXED selector

let emailcheck = false;
let phonecheck = false;
let passwordcheck = false;

// Continue button: depends on email + phone
function nextButtonAllowedOne() {
  if (!continueButton) return;

  const allowed = emailcheck && phonecheck;

  continueButton.disabled = !allowed;
  continueButton.setAttribute('aria-disabled', String(!allowed));
  continueButton.classList.toggle('is-enabled', allowed);
  continueButton.classList.toggle('enabled', allowed);
}

// Next button (password popup): depends on passwordcheck
function nextButtonAllowedTwo() {
  if (!nextbutton) return;

  const allowed = passwordcheck;

  nextbutton.disabled = !allowed;
  nextbutton.setAttribute('aria-disabled', String(!allowed));
  nextbutton.classList.toggle('is-enabled', allowed);
  nextbutton.classList.toggle('enabled', allowed);
}

// ✅ Single wrapper that updates BOTH (so old code can call it)
function nextButtonAllowed() {
  nextButtonAllowedOne();
  nextButtonAllowedTwo();
}

// Keep your dataset targeting
function updateNextButton() {
  if (!continueButton) return;
  if (!nextbutton) return;

  if (emailcheck && phonecheck) {
    continueButton.dataset.open = 'popuppassword';
  } else {
    continueButton.dataset.open = 'popupinvalid';
  }

  if (passwordcheck) {
    nextbutton.dataset.open = 'popupreview'
  } else{
    nextbutton.dataset.open = 'popupinvalidpassword'
  }
}

function updateContinueTarget() {
  updateNextButton();
}

// Open password popup when allowed, show invalid if not
if (continueButton) {
  continueButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (emailcheck && phonecheck) {
      openPopup('popuppassword');
    } else {
      if (typeof window.openInvalid === 'function') {
        window.openInvalid('signup');
      } else {
        openPopup('popupinvalid');
      }
    }
  });
}

// initial state
nextButtonAllowed();
updateNextButton();

// ---------------------------
// Password popup: Next button gating (ADDED)
// This is independent and does NOT modify your password section.
const passwordPopupNextBtn = document.querySelector('#popuppassword .next-button');

function passwordRulesLocal(v) {
  const letters = /[A-Z]/.test(v) && /[a-z]/.test(v);
  const digit = /\d/.test(v);
  const symbol = /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/.test(v);
  const len = (v || '').length >= 8;
  return letters && digit && symbol && len;
}

function nextButtonAllowedOnePassword() {
  if (!passwordPopupNextBtn) return;

  const v = document.getElementById('password')?.value || '';
  const allowed = passwordRulesLocal(v);

  passwordPopupNextBtn.disabled = !allowed;
  passwordPopupNextBtn.setAttribute('aria-disabled', String(!allowed));
  passwordPopupNextBtn.classList.toggle('is-enabled', allowed);
}

if (passwordPopupNextBtn) {
  passwordPopupNextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const v = document.getElementById('password')?.value || '';
    if (!passwordRulesLocal(v)) {
      if (typeof window.openInvalid === 'function') {
        window.openInvalid('password');
      } else {
        openPopup('popupinvalid');
      }
    } else {
      openPopup('popupreview');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const pwd = document.getElementById('password');
  pwd?.addEventListener('input', nextButtonAllowedOnePassword);
  nextButtonAllowedOnePassword();
});

// ---------------------------
// Email validation (spinner -> tick/cross)
const emailinput = document.getElementById('email');
const emailinput2 = document.getElementById('email2');
const emailstatusicon = document.getElementById('emailStatusIcon');
const emailstatusicon2 = document.getElementById('emailStatusIcon2');

let spinnerTimer = null;
let finalTimer = null;
let emptyTimer = null;

// SIGNUP email timers (separate)
let spinnerTimer_signup = null;
let finalTimer_signup = null;
let emptyTimer_signup = null;

// LOGIN email timers (separate)
let spinnerTimer_login = null;
let finalTimer_login = null;
let emptyTimer_login = null;

function seticon(iconClasses, spin = false) {
  if (!emailstatusicon) return;
  if (!emailstatusicon2) return;

  emailstatusicon.classList.remove(
    'fa-regular', 'fa-solid', 'fa-brands',
    'fa-circle', 'fa-circle-notch', 'fa-square-check', 'fa-square-xmark'
  );
  emailstatusicon2.classList.remove(
    'fa-regular', 'fa-solid', 'fa-brands',
    'fa-circle', 'fa-circle-notch', 'fa-square-check', 'fa-square-xmark'
  );

  iconClasses.split(' ').forEach(c => emailstatusicon.classList.add(c));
  emailstatusicon.classList.add('signup-righticon');
  emailstatusicon.classList.toggle('spin', !!spin);

  iconClasses.split(' ').forEach(c => emailstatusicon2.classList.add(c));
  emailstatusicon2.classList.add('signup-righticon');
  emailstatusicon2.classList.toggle('spin', !!spin);
}

// Signup-only email icon setter
function seticonSignup(iconClasses, spin = false) {
  if (!emailstatusicon) return;

  emailstatusicon.classList.remove(
    'fa-regular', 'fa-solid', 'fa-brands',
    'fa-circle', 'fa-circle-notch', 'fa-square-check', 'fa-square-xmark'
  );

  iconClasses.split(' ').forEach(c => emailstatusicon.classList.add(c));
  emailstatusicon.classList.add('signup-righticon');
  emailstatusicon.classList.toggle('spin', !!spin);
}

// Login-only email icon setter
function seticonLogin(iconClasses, spin = false) {
  if (!emailstatusicon2) return;

  emailstatusicon2.classList.remove(
    'fa-regular', 'fa-solid', 'fa-brands',
    'fa-circle', 'fa-circle-notch', 'fa-square-check', 'fa-square-xmark'
  );

  iconClasses.split(' ').forEach(c => emailstatusicon2.classList.add(c));
  emailstatusicon2.classList.add('signup-righticon');
  emailstatusicon2.classList.toggle('spin', !!spin);
}

function isValidEmail(v) {
  return /^(?!\.)(?!.*\.\.)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?<!\.)@(?=.{1,253}$)(?!-)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(?<!-)\.[a-zA-Z]{2,}$/.test(v);
}

if (emailinput && emailstatusicon) {
  // initial idle
  seticonSignup('fa-regular fa-circle', false);
  emailstatusicon.classList.toggle('idle', true);
  emailstatusicon.classList.toggle('valid', false);
  emailstatusicon.classList.toggle('invalid', false);
  emailstatusicon.classList.toggle('loading', false);

  emailinput.addEventListener('input', () => {
    const v = emailinput.value.trim();

    clearTimeout(spinnerTimer_signup);
    clearTimeout(finalTimer_signup);
    clearTimeout(emptyTimer_signup);

    // empty
    if (!v) {
      seticonSignup('fa-solid fa-square-xmark', false);
      emailstatusicon.classList.toggle('valid', false);
      emailstatusicon.classList.toggle('invalid', true);
      emailstatusicon.classList.toggle('idle', false);
      emailstatusicon.classList.toggle('loading', false);

      emailcheck = false;
      nextButtonAllowedOne();
      updateNextButton();

      emptyTimer_signup = setTimeout(() => {
        if (!emailinput.value.trim()) {
          seticonSignup('fa-regular fa-circle', false);
          emailstatusicon.classList.toggle('valid', false);
          emailstatusicon.classList.toggle('invalid', false);
          emailstatusicon.classList.toggle('idle', true);
          emailstatusicon.classList.toggle('loading', false);
        }
      }, 2500);

      return;
    }

    // spinner
    spinnerTimer_signup = setTimeout(() => {
      seticonSignup('fa-solid fa-circle-notch', true);
      emailstatusicon.classList.toggle('valid', false);
      emailstatusicon.classList.toggle('invalid', false);
      emailstatusicon.classList.toggle('idle', false);
      emailstatusicon.classList.toggle('loading', true);

      emailcheck = false;
      nextButtonAllowedOne();
      updateNextButton();
    }, 190);

    // final
    finalTimer_signup = setTimeout(() => {
      const ok = isValidEmail(v);

      seticonSignup(ok ? 'fa-solid fa-square-check' : 'fa-solid fa-square-xmark', false);
      emailstatusicon.classList.toggle('valid', ok);
      emailstatusicon.classList.toggle('invalid', !ok);
      emailstatusicon.classList.toggle('idle', false);
      emailstatusicon.classList.toggle('loading', false);

      emailcheck = ok;
      nextButtonAllowedOne();
      updateNextButton();
    }, 700);
  });
}

if (emailinput2 && emailstatusicon2) {
  // initial idle
  seticonLogin('fa-regular fa-circle', false);
  emailstatusicon2.classList.toggle('idle', true);
  emailstatusicon2.classList.toggle('valid', false);
  emailstatusicon2.classList.toggle('invalid', false);
  emailstatusicon2.classList.toggle('loading', false);

  emailinput2.addEventListener('input', () => {
    const v = emailinput2.value.trim();

    clearTimeout(spinnerTimer_login);
    clearTimeout(finalTimer_login);
    clearTimeout(emptyTimer_login);

    // empty
    if (!v) {
      seticonLogin('fa-solid fa-square-xmark', false);
      emailstatusicon2.classList.toggle('valid', false);
      emailstatusicon2.classList.toggle('invalid', true);
      emailstatusicon2.classList.toggle('idle', false);
      emailstatusicon2.classList.toggle('loading', false);

      emailcheck_login = false;
      loginButtonGating();

      emptyTimer_login = setTimeout(() => {
        if (!emailinput2.value.trim()) {
          seticonLogin('fa-regular fa-circle', false);
          emailstatusicon2.classList.toggle('valid', false);
          emailstatusicon2.classList.toggle('invalid', false);
          emailstatusicon2.classList.toggle('idle', true);
          emailstatusicon2.classList.toggle('loading', false);
        }
      }, 2500);

      return;
    }

    // spinner
    spinnerTimer_login = setTimeout(() => {
      seticonLogin('fa-solid fa-circle-notch', true);
      emailstatusicon2.classList.toggle('valid', false);
      emailstatusicon2.classList.toggle('invalid', false);
      emailstatusicon2.classList.toggle('idle', false);
      emailstatusicon2.classList.toggle('loading', true);

      emailcheck_login = false;
      loginButtonGating();
    }, 190);

    // final
    finalTimer_login = setTimeout(() => {
      const ok = isValidEmail(v);

      seticonLogin(ok ? 'fa-solid fa-square-check' : 'fa-solid fa-square-xmark', false);
      emailstatusicon2.classList.toggle('valid', ok);
      emailstatusicon2.classList.toggle('invalid', !ok);
      emailstatusicon2.classList.toggle('idle', false);
      emailstatusicon2.classList.toggle('loading', false);

      emailcheck_login = ok;
      loginButtonGating();
    }, 700);
  });
}

// ---------------------------
// Phone validation (spinner -> tick/cross)
const phoneInput = document.getElementById('phone');
const phoneCountry = document.getElementById('phoneCountry');
const phoneStatusIcon = document.getElementById('phoneStatusIcon');
const phoneInput2 = document.getElementById('phone2');
const phoneCountry2 = document.getElementById('phoneCountry2');
const phoneStatusIcon2 = document.getElementById('phoneStatusIcon2');

let phoneSpinnerTimer = null;
let phoneFinalTimer = null;
let phoneEmptyTimer = null;

// SIGNUP phone timers (separate)
let phoneSpinnerTimer_signup = null;
let phoneFinalTimer_signup = null;
let phoneEmptyTimer_signup = null;

// LOGIN phone timers (separate)
let phoneSpinnerTimer_login = null;
let phoneFinalTimer_login = null;
let phoneEmptyTimer_login = null;

function setPhoneIcon(iconClasses, spin = false) {
  if (!phoneStatusIcon) return;
  if (!phoneStatusIcon2) return;

  phoneStatusIcon.classList.remove(
    'fa-regular', 'fa-solid', 'fa-brands',
    'fa-circle', 'fa-circle-notch', 'fa-square-check', 'fa-square-xmark'
  );

  phoneStatusIcon2.classList.remove(
    'fa-regular', 'fa-solid', 'fa-brands',
    'fa-circle', 'fa-circle-notch', 'fa-square-check', 'fa-square-xmark'
  );

  iconClasses.split(' ').forEach(c => phoneStatusIcon.classList.add(c));
  phoneStatusIcon.classList.add('signup-righticon');
  phoneStatusIcon.classList.toggle('spin', !!spin);

  iconClasses.split(' ').forEach(c => phoneStatusIcon2.classList.add(c));
  phoneStatusIcon2.classList.add('signup-righticon');
  phoneStatusIcon2.classList.toggle('spin', !!spin);
}

// Signup-only icon setter
function setPhoneIconSignup(iconClasses, spin = false) {
  if (!phoneStatusIcon) return;

  phoneStatusIcon.classList.remove(
    'fa-regular', 'fa-solid', 'fa-brands',
    'fa-circle', 'fa-circle-notch', 'fa-square-check', 'fa-square-xmark'
  );

  iconClasses.split(' ').forEach(c => phoneStatusIcon.classList.add(c));
  phoneStatusIcon.classList.add('signup-righticon');
  phoneStatusIcon.classList.toggle('spin', !!spin);
}

// Login-only icon setter
function setPhoneIconLogin(iconClasses, spin = false) {
  if (!phoneStatusIcon2) return;

  phoneStatusIcon2.classList.remove(
    'fa-regular', 'fa-solid', 'fa-brands',
    'fa-circle', 'fa-circle-notch', 'fa-square-check', 'fa-square-xmark'
  );

  iconClasses.split(' ').forEach(c => phoneStatusIcon2.classList.add(c));
  phoneStatusIcon2.classList.add('signup-righticon');
  phoneStatusIcon2.classList.toggle('spin', !!spin);
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
  setPhoneIconSignup('fa-regular fa-circle', false);
  phoneStatusIcon.classList.toggle('idle', true);
  phoneStatusIcon.classList.toggle('valid', false);
  phoneStatusIcon.classList.toggle('invalid', false);
  phoneStatusIcon.classList.toggle('loading', false);

  function validatePhone() {
    const v = phoneInput.value.trim();
    const code = phoneCountry.value;

    clearTimeout(phoneSpinnerTimer_signup);
    clearTimeout(phoneFinalTimer_signup);
    clearTimeout(phoneEmptyTimer_signup);

    // empty
    if (!v) {
      setPhoneIconSignup('fa-solid fa-square-xmark', false);
      phoneStatusIcon.classList.toggle('valid', false);
      phoneStatusIcon.classList.toggle('invalid', true);
      phoneStatusIcon.classList.toggle('idle', false);
      phoneStatusIcon.classList.toggle('loading', false);

      phonecheck = false;
      nextButtonAllowedOne();
      updateNextButton();

      phoneEmptyTimer_signup = setTimeout(() => {
        if (!phoneInput.value.trim()) {
          setPhoneIconSignup('fa-regular fa-circle', false);
          phoneStatusIcon.classList.toggle('valid', false);
          phoneStatusIcon.classList.toggle('invalid', false);
          phoneStatusIcon.classList.toggle('idle', true);
          phoneStatusIcon.classList.toggle('loading', false);
        }
      }, 2500);

      return;
    }

    // spinner
    phoneSpinnerTimer_signup = setTimeout(() => {
      setPhoneIconSignup('fa-solid fa-circle-notch', true);
      phoneStatusIcon.classList.toggle('valid', false);
      phoneStatusIcon.classList.toggle('invalid', false);
      phoneStatusIcon.classList.toggle('idle', false);
      phoneStatusIcon.classList.toggle('loading', true);

      phonecheck = false;
      nextButtonAllowedOne();
      updateNextButton();
    }, 190);

    // final
    phoneFinalTimer_signup = setTimeout(() => {
      const valid = isPhoneNumberValid(v, code);

      setPhoneIconSignup(valid ? 'fa-solid fa-square-check' : 'fa-solid fa-square-xmark', false);
      phoneStatusIcon.classList.toggle('valid', valid);
      phoneStatusIcon.classList.toggle('invalid', !valid);
      phoneStatusIcon.classList.toggle('idle', false);
      phoneStatusIcon.classList.toggle('loading', false);

      phonecheck = valid;
      nextButtonAllowedOne();
      updateNextButton();
    }, 700);
  }

  phoneInput.addEventListener('input', validatePhone);
  phoneCountry.addEventListener('change', validatePhone);
}

if (phoneInput2 && phoneCountry2 && phoneStatusIcon2) {
  // initial idle
  setPhoneIconLogin('fa-regular fa-circle', false);
  phoneStatusIcon2.classList.toggle('idle', true);
  phoneStatusIcon2.classList.toggle('valid', false);
  phoneStatusIcon2.classList.toggle('invalid', false);
  phoneStatusIcon2.classList.toggle('loading', false);

  function validatePhone() {
    const v = phoneInput2.value.trim();
    const code = phoneCountry2.value;

    clearTimeout(phoneSpinnerTimer_login);
    clearTimeout(phoneFinalTimer_login);
    clearTimeout(phoneEmptyTimer_login);

    // empty
    if (!v) {
      setPhoneIconLogin('fa-solid fa-square-xmark', false);
      phoneStatusIcon2.classList.toggle('valid', false);
      phoneStatusIcon2.classList.toggle('invalid', true);
      phoneStatusIcon2.classList.toggle('idle', false);
      phoneStatusIcon2.classList.toggle('loading', false);

      phonecheck_login = false;
      loginButtonGating();

      phoneEmptyTimer_login = setTimeout(() => {
        if (!phoneInput2.value.trim()) {
          setPhoneIconLogin('fa-regular fa-circle', false);
          phoneStatusIcon2.classList.toggle('valid', false);
          phoneStatusIcon2.classList.toggle('invalid', false);
          phoneStatusIcon2.classList.toggle('idle', true);
          phoneStatusIcon2.classList.toggle('loading', false);
        }
      }, 2500);

      return;
    }

    // spinner
    phoneSpinnerTimer_login = setTimeout(() => {
      setPhoneIconLogin('fa-solid fa-circle-notch', true);
      phoneStatusIcon2.classList.toggle('valid', false);
      phoneStatusIcon2.classList.toggle('invalid', false);
      phoneStatusIcon2.classList.toggle('idle', false);
      phoneStatusIcon2.classList.toggle('loading', true);

      phonecheck_login = false;
      loginButtonGating();
    }, 190);

    // final
    phoneFinalTimer_login = setTimeout(() => {
      const valid = isPhoneNumberValid(v, code);

      setPhoneIconLogin(valid ? 'fa-solid fa-square-check' : 'fa-solid fa-square-xmark', false);
      phoneStatusIcon2.classList.toggle('valid', valid);
      phoneStatusIcon2.classList.toggle('invalid', !valid);
      phoneStatusIcon2.classList.toggle('idle', false);
      phoneStatusIcon2.classList.toggle('loading', false);

      phonecheck_login = valid;
      loginButtonGating();
    }, 700);
  }

  phoneInput2.addEventListener('input', validatePhone);
  phoneCountry2.addEventListener('change', validatePhone);
}

// ---------------------------
// Password validation (spinner -> tick/cross + rule icons)
// (UNCHANGED inside this section, per your instruction)
const passwordInput = document.getElementById('password');
const passwordStatusIcon = document.getElementById('passwordStatusIcon');

const passwordStatusIconOne = document.getElementById('passwordStatusIconOne');     // Upper
const passwordStatusIconTwo = document.getElementById('passwordStatusIconTwo');     // Lower
const passwordStatusIconThree = document.getElementById('passwordStatusIconThree'); // Symbol
const passwordStatusIconFour = document.getElementById('passwordStatusIconFour');   // Length

let passwordSpinnerTimer = null;
let passwordFinalTimer = null;
let passwordEmptyTimer = null;

passwordcheck = false;

// Unique helper (won’t clash with email’s seticon)
function setPwdIcon(el, iconClasses, spin = false) {
  if (!el) return;

  el.classList.remove(
    'fa-regular', 'fa-solid', 'fa-brands',
    'fa-circle', 'fa-circle-notch', 'fa-square-check', 'fa-square-xmark'
  );

  iconClasses
    .split(/\s+/)
    .filter(Boolean)
    .forEach(c => el.classList.add(c));

  el.classList.add('signup-righticon');
  el.classList.toggle('spin', !!spin);
}

// Optional but tidy: state classes for styling (idle/loading/valid/invalid)
function setPwdState(el, state) {
  if (!el) return;
  el.classList.toggle('idle', state === 'idle');
  el.classList.toggle('loading', state === 'loading');
  el.classList.toggle('valid', state === 'valid');
  el.classList.toggle('invalid', state === 'invalid');
}

function setPwdRuleIcon(el, pass) {
  setPwdIcon(el, pass ? 'fa-solid fa-square-check' : 'fa-solid fa-square-xmark', false);
  setPwdState(el, pass ? 'valid' : 'invalid');
}

function passwordRules(v) {
  const letters = /[A-Z]/.test(v) && /[a-z]/.test(v);
  const digit = /\d/.test(v);
  const symbol = /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/.test(v);
  const len = v.length >= 8;
  const all = letters && digit && symbol && len;
  return { letters, digit, symbol, len, all };
}

function updateRuleIcons(res) {
  setPwdRuleIcon(passwordStatusIconOne,   res.letters);
  setPwdRuleIcon(passwordStatusIconTwo,   res.digit);
  setPwdRuleIcon(passwordStatusIconThree, res.symbol);
  setPwdRuleIcon(passwordStatusIconFour,  res.len);
}

function resetRuleIconsIdle() {
  [passwordStatusIconOne, passwordStatusIconTwo, passwordStatusIconThree, passwordStatusIconFour].forEach(el => {
    setPwdIcon(el, 'fa-regular fa-circle', false);
    setPwdState(el, 'idle');
  });
}

if (passwordInput && passwordStatusIcon) {
  setPwdIcon(passwordStatusIcon, 'fa-regular fa-circle', false);
  setPwdState(passwordStatusIcon, 'idle');
  resetRuleIconsIdle();

  passwordInput.addEventListener('input', () => {
    const v = passwordInput.value; // keep raw (don’t trim passwords)

    clearTimeout(passwordSpinnerTimer);
    clearTimeout(passwordFinalTimer);
    clearTimeout(passwordEmptyTimer);

    // empty
    if (!v) {
      setPwdIcon(passwordStatusIcon, 'fa-solid fa-square-xmark', false);
      setPwdState(passwordStatusIcon, 'invalid');
      passwordcheck = false;

      resetRuleIconsIdle();

      // These two won’t hurt, but they currently only gate the main continue button
      if (typeof nextButtonAllowed === 'function') nextButtonAllowed();
      if (typeof updateContinueTarget === 'function') updateContinueTarget();

      passwordEmptyTimer = setTimeout(() => {
        if (!passwordInput.value) {
          setPwdIcon(passwordStatusIcon, 'fa-regular fa-circle', false);
          setPwdState(passwordStatusIcon, 'idle');
          resetRuleIconsIdle();
        }
      }, 2500);

      return;
    }

    passwordSpinnerTimer = setTimeout(() => {
      setPwdIcon(passwordStatusIcon, 'fa-solid fa-circle-notch', true);
      setPwdState(passwordStatusIcon, 'loading');

      // Rules go into loading too (nice feedback while user types)
      [passwordStatusIconOne, passwordStatusIconTwo, passwordStatusIconThree, passwordStatusIconFour].forEach(el => {
        setPwdIcon(el, 'fa-solid fa-circle-notch', true);
        setPwdState(el, 'loading');
      });

      passwordcheck = false;

      if (typeof nextButtonAllowed === 'function') nextButtonAllowed();
      if (typeof updateContinueTarget === 'function') updateContinueTarget();
    }, 170);

    // final
    passwordFinalTimer = setTimeout(() => {
      const res = passwordRules(v);

      setPwdIcon(passwordStatusIcon, res.all ? 'fa-solid fa-square-check' : 'fa-solid fa-square-xmark', false);
      setPwdState(passwordStatusIcon, res.all ? 'valid' : 'invalid');

      updateRuleIcons(res);

      passwordcheck = res.all;

      if (typeof nextButtonAllowed === 'function') nextButtonAllowed();
      if (typeof updateContinueTarget === 'function') updateContinueTarget();
    }, 1000);
  });
}

// ---------------------------
// LOGIN FORM VALIDATION (separate from signup)
// Validation states specific to login form
let emailcheck_login = false;
let phonecheck_login = false;
let passwordcheck_login = false;

// Gate login button based on all three fields
function loginButtonGating() {
  const loginBtn = document.querySelector('#popuplogin .next-two-button');
  if (!loginBtn) return;
  const allowed = emailcheck_login && phonecheck_login && passwordcheck_login;
  loginBtn.disabled = !allowed;
  loginBtn.setAttribute('aria-disabled', String(!allowed));
  loginBtn.classList.toggle('is-enabled', allowed);
  loginBtn.classList.toggle('enabled', allowed);
  if (allowed) {
    loginBtn.dataset.open = 'popupll';
    setTimeout(() => {
      openPopup('popuplc')
    }, 4250);
  } else {
    loginBtn.dataset.open = 'popupinvalidlogin';
  }
}

// Add click handler for login button to show invalid popup
const loginBtn = document.querySelector('#popuplogin .next-two-button');
if (loginBtn) {
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();          // stop global handler
    if (!(emailcheck_login && phonecheck_login && passwordcheck_login)) {
      openPopup('popupinvalidlogin');
    } else {
      openpopupllwaitthenopenpopuplc();
    }
  });
  loginButtonGating();           // initialise state
}

// Login password validation
const loginPasswordInput = document.getElementById('password2');
const loginPasswordStatusIcon = document.getElementById('passwordStatusIcon2');

let loginPasswordSpinnerTimer = null;
let loginPasswordFinalTimer = null;
let loginPasswordEmptyTimer = null;

if (loginPasswordInput && loginPasswordStatusIcon) {
  setPwdIcon(loginPasswordStatusIcon, 'fa-regular fa-circle', false);
  setPwdState(loginPasswordStatusIcon, 'idle');

  loginPasswordInput.addEventListener('input', () => {
    const v = loginPasswordInput.value; // keep raw (don't trim passwords)

    clearTimeout(loginPasswordSpinnerTimer);
    clearTimeout(loginPasswordFinalTimer);
    clearTimeout(loginPasswordEmptyTimer);

    // empty
    if (!v) {
      setPwdIcon(loginPasswordStatusIcon, 'fa-solid fa-square-xmark', false);
      setPwdState(loginPasswordStatusIcon, 'invalid');
      passwordcheck_login = false;
      loginButtonGating();

      loginPasswordEmptyTimer = setTimeout(() => {
        if (!loginPasswordInput.value) {
          setPwdIcon(loginPasswordStatusIcon, 'fa-regular fa-circle', false);
          setPwdState(loginPasswordStatusIcon, 'idle');
        }
      }, 2500);

      return;
    }

    loginPasswordSpinnerTimer = setTimeout(() => {
      setPwdIcon(loginPasswordStatusIcon, 'fa-solid fa-circle-notch', true);
      setPwdState(loginPasswordStatusIcon, 'loading');
      passwordcheck_login = false;
      loginButtonGating();
    }, 170);

    // final
    loginPasswordFinalTimer = setTimeout(() => {
      const res = passwordRules(v);

      setPwdIcon(loginPasswordStatusIcon, res.all ? 'fa-solid fa-square-check' : 'fa-solid fa-square-xmark', false);
      setPwdState(loginPasswordStatusIcon, res.all ? 'valid' : 'invalid');

      passwordcheck_login = res.all;
      loginButtonGating();
    }, 1000);
  });
}

// ---------------------------
// REVIEW POPUP: copy values + mask phone/password + eye toggles

(function reviewMasking() {
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const phoneCountry = document.getElementById('phoneCountry');
  const passwordInput = document.getElementById('password');

  const emailDisplay = document.getElementById('Emaildisplay');
  const phoneDisplay = document.getElementById('phonedisplay');
  const passwordDisplay = document.getElementById('passworddisplay');

  const togglePhoneBtn = document.getElementById('togglePhone');
  const togglePasswordBtn = document.getElementById('togglePassword');

  if (!emailInput || !phoneInput || !phoneCountry || !passwordInput) return;
  if (!emailDisplay || !phoneDisplay || !passwordDisplay) return;

  // Internal state: what we *could* show if user taps eye
  let phoneShown = false;
  let passwordShown = false;

  function digitsOnly(v) {
    return String(v || '').replace(/\D/g, '');
  }

  function maskPhone(code, rawPhone) {
    const digits = digitsOnly(rawPhone);
    if (!digits) return '';

    // If user starts with 0 (UK 07...), drop leading 0 for E.164 style display
    const normalised = digits.startsWith('0') ? digits.slice(1) : digits;

    // Need at least 2 digits to show first/last properly
    if (normalised.length === 1) return `${code} ${normalised}*`;
    const first = normalised[0];
    const lastone = normalised[normalised.length - 2]
    const lasttwo = normalised[normalised.length - 1];

    return `${code} ${first}${'•'.repeat(Math.max(4, normalised.length - 2))}${lastone}${lasttwo}`;
  }

  function fullPhone(code, rawPhone) {
    const digits = digitsOnly(rawPhone);
    if (!digits) return '';
    const normalised = digits.startsWith('0') ? digits.slice(1) : digits;
    return `${code} ${normalised}`;
  }

  function maskPassword(rawPwd) {
    if (!rawPwd) return '';
    // show fixed bullets length for privacy (or use rawPwd.length if you prefer)
    return '•'.repeat(Math.max(8, Math.min(100, rawPwd.length)));
  }

  function setEye(btn, isOn) {
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (!icon) return;
    icon.className = isOn ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
  }

  function refreshReviewFields() {
    // email full
    emailDisplay.value = (emailInput.value || '').trim();

    // phone masked by default
    const code = phoneCountry.value || '';
    const rawPhone = phoneInput.value || '';
    phoneDisplay.value = phoneShown ? fullPhone(code, rawPhone) : maskPhone(code, rawPhone);

    // password fully censored by default (unless shown)
    const rawPwd = passwordInput.value || '';
    passwordDisplay.value = passwordShown ? rawPwd : maskPassword(rawPwd);

    setEye(togglePhoneBtn, phoneShown);
    setEye(togglePasswordBtn, passwordShown);
  }

  // Keep review updated while typing (optional but nice)
  emailInput.addEventListener('input', refreshReviewFields);
  phoneInput.addEventListener('input', refreshReviewFields);
  phoneCountry.addEventListener('change', refreshReviewFields);
  passwordInput.addEventListener('input', refreshReviewFields);

  // Toggle phone
  togglePhoneBtn?.addEventListener('click', () => {
    phoneShown = !phoneShown;
    togglePhoneBtn.setAttribute('aria-label', phoneShown ? 'Hide phone number' : 'Show phone number');
    refreshReviewFields();
  });

  // Toggle password
  togglePasswordBtn?.addEventListener('click', () => {
    passwordShown = !passwordShown;
    togglePasswordBtn.setAttribute('aria-label', passwordShown ? 'Hide password' : 'Show password');
    refreshReviewFields();
  });

  // When review popup opens, refresh values (works even if opened later)
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open="popupreview"]');
    if (opener) {
      // reset to masked every time you open review (optional)
      phoneShown = false;
      passwordShown = false;
      refreshReviewFields();
    }
  });

  // If you force-open popupreview on DOMContentLoaded, update after load:
  document.addEventListener('DOMContentLoaded', () => {
    refreshReviewFields();
  });
})();

const editemailandphone = document.querySelectorAll('.edit-trigger')
const editpassword = document.getElementById('editpassword')

function ClosereviewOpensignup() {
  setTimeout(() => {
    closePopup('popupreview');
    openPopup('popupsignup');
  }, 500);
}

function ClosereviewOpenpassword() {
  setTimeout(() => {  
    closePopup('popupreview');
    openPopup('popuppassword');
  }, 500);
}

editemailandphone.forEach(btn => {
  btn.addEventListener('click', () => {
    ClosereviewOpensignup()
  })
})

editpassword.addEventListener('click', () => {
  ClosereviewOpenpassword()
})

const email = document.getElementById('email');
const phoneoptions = document.getElementById('phoneCountry');
const phone = document.getElementById('phone');

email?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter'){
    e.preventDefault();
    email.blur();
    phoneoptions?.focus();
  }
});

function opensignupclosemenu() {
  if (cmtflag) {
    closeMenu();
  }
  openPopup('popupsignup');
}

function openloginclosemenu() {
  if (cmtflag) {
    closeMenu();
  }
  openPopup('popuplogin');
}

function opencagclosemenu() {
  if (cmtflag) {
    closeMenu();
  }
  openPopup('popupcag');
}

function openaccessclosemenu() {
  if (cmtflag) {
    closeMenu();
  }
  openPopup('popupaccess');
}

function openpandsclosemenu() {
  if (cmtflag) {
    closeMenu();
  }
  openPopup('popuppands');
}

function opentosclosemenu() {
  if (cmtflag) {
    closeMenu();
  }
  openPopup('popuptos');
}

function opencookiesclosemenu() {
  if (cmtflag) {
    closeMenu();
  }
  openPopup('popupcookies');
}

function opencaaclosemenu() {
  if (cmtflag) {
    closeMenu();
  }
  openPopup('popupcaa');
}

function opensupportclosemenu() {
  if (cmtflag) {
    closeMenu();
  }
  openPopup('popupSupport');
}

function openCNSclosemenu() {
  if (cmtflag) {
    closeMenu();
  }
  openPopup('popupcns');
}

function openbrclosemenu() {
  if (cmtflag) {
    closeMenu();
  }
  openPopup('popuprab');
}

const closemenuToggle = document.getElementById('toggle-checkbox-acm')
let cmtflag = false

if (closemenuToggle) {
  closemenuToggle.addEventListener('change', () => {
    cmtflag = closemenuToggle.checked;
  });
}

const colourblindIndicator = document.getElementById('toggle-checkbox-ci');

const toggleiconON  = document.querySelectorAll('.toggle-icon-off');
const toggleiconOFF = document.querySelectorAll('.toggle-icon-on');

// 🔹 LOAD saved state on page start
const saved = localStorage.getItem('colourblind');

if (colourblindIndicator) {
  if (saved !== null) {
    const enabled = saved === 'true';
    colourblindIndicator.checked = enabled;
    [...toggleiconON, ...toggleiconOFF].forEach(icon => {
      icon.classList.toggle('enabled', enabled);
    });
  }

  // 🔹 SAVE when user changes toggle
  colourblindIndicator.addEventListener('change', (e) => {
    const enabled = e.target.checked;

    // Apply indicators
    [...toggleiconON, ...toggleiconOFF].forEach(icon => {
      icon.classList.toggle('enabled', enabled);
    });

    // Save to localStorage
    localStorage.setItem('colourblind', String(enabled));
  });
}

const createbutton = document.getElementById('create-button');
const passwordnextbutton = document.getElementById('password-button');

const createbuttontimer = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
console.log(createbuttontimer);

let createflag = false;

function waitcreatebutton() {
  if (!createbutton) {
    console.log("ERROR: Line 1293 — create-button not found");
    return;
  }

  setTimeout(() => {
    createbutton.classList.add('is-enabled');
    createbutton.disabled = false;
    createflag = true;
  }, 3000);
}

if (createbutton) {
  createbutton.addEventListener('click', () => {
    if (!createflag) return;

    openPopup('popupca');

    setTimeout(() => {
      aftercreation();
    }, createbuttontimer);
  });
}

function aftercreation() {
  const chanceofcreation = Math.floor(Math.random() * 10) + 1;

  if (chanceofcreation <= 9) {
    openPopup('popupcas');
    setTimeout(() => {
      creationredirect()
    }, 3000);
  } else {
    openPopup('popupcaf');
  }
}

function creationredirect(){
  openPopup('popuprl')
  setTimeout(() => {
    cagredirect()
  }, 1000);
}

function creationfail(){
  setTimeout(() => {
    openPopup('popupreview')
  }, 5000);
}

if (passwordnextbutton) {
  passwordnextbutton.addEventListener('click', () => {
    waitcreatebutton();
  });
} else {
  console.log("ERROR — password-button not found");
}

// document.addEventListener('DOMContentLoaded', () => {
//   openPopup('popuprab');
// });

// ---- Shake toggle ----
let shakeEnabled = false;
let motionListener = null;

function onShake() {
  console.log("🔥 SHAKE DETECTED!");
  alert("🎉 SHAKE DETECTED! Device shake is working!");
}

function buildMotionListener({ threshold = 18, timeout = 800 } = {}) {
  let lastTime = 0;

  return (event) => {
    const acc = event.accelerationIncludingGravity || event.acceleration;
    if (!acc) return;

    const x = acc.x || 0;
    const y = acc.y || 0;
    const z = acc.z || 0;

    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const now = Date.now();

    if (magnitude > threshold && now - lastTime > timeout) {
      lastTime = now;
      onShake();
    }
  };
}

async function requestIOSMotionPermission() {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    const permission = await DeviceMotionEvent.requestPermission();
    return permission === "granted";
  }
  return true; // non-iOS or older iOS
}

async function setShakeEnabled(enabled) {
  if (enabled === shakeEnabled) return;

  if (enabled) {
    const ok = await requestIOSMotionPermission();
    if (!ok) {
      console.error("Motion permission denied on iOS");
      openPopup('popupbrtf')
      return;
    }

    motionListener = buildMotionListener({ threshold: 14, timeout: 800 });
    window.addEventListener("devicemotion", motionListener, { passive: true });
    shakeEnabled = true;
    console.log("✅ Shake Detection: ENABLED (shake sensitivity: high)");
    alert("✅ Shake Detection: ON\n\nTry shaking your device to test it! => F");
  } else {
    if (motionListener) {
      window.removeEventListener("devicemotion", motionListener);
      motionListener = null;
    }
    shakeEnabled = false;
    console.log("❌ Shake Detection: DISABLED");
    alert("❌ Shake Detection: OFF");
  }
}

togglestobr = document.getElementById('toggle-checkbox-stobr')

if(togglestobr){
  togglestobr.addEventListener('change', async () => {
    await setShakeEnabled(togglestobr.checked);
    
    if(togglestobr.checked && !shakeEnabled){
      togglestobr.checked = false;
    }
  })
}

// ---- Bug Report Email Validation (FIXED like phone/email) ----
const bugReportEmailInput = document.getElementById('email-bugreport');
const bugReportEmailStatusIcon = document.getElementById('emailStatusIcon-bugreport');
const bugReportSendBtn = document.querySelector('#popuprab .accept-button-access');

let bugReportEmailSpinnerTimer = null;
let bugReportEmailFinalTimer = null;
let bugReportEmailEmptyTimer = null;
let bugReportEmailCheck = false;

// Generic icon setter (same behaviour style as your others)
function setBugIcon(iconEl, iconClasses, spin = false) {
  if (!iconEl) return;

  iconEl.classList.remove(
    'fa-regular', 'fa-solid', 'fa-brands',
    'fa-circle', 'fa-circle-notch', 'fa-square-check', 'fa-square-xmark',
    'spin'
  );

  iconClasses.split(/\s+/).filter(Boolean).forEach(c => iconEl.classList.add(c));
  iconEl.classList.toggle('spin', !!spin);
}

function setBugState(iconEl, state) {
  if (!iconEl) return;
  iconEl.classList.toggle('idle', state === 'idle');
  iconEl.classList.toggle('loading', state === 'loading');
  iconEl.classList.toggle('valid', state === 'valid');
  iconEl.classList.toggle('invalid', state === 'invalid');
}


function setBugSendEnabled(ok) {
  bugReportEmailCheck = !!ok;
  if (bugReportSendBtn) bugReportSendBtn.disabled = !ok;
}

if (bugReportEmailInput && bugReportEmailStatusIcon) {
  // initial idle
  setBugIcon(bugReportEmailStatusIcon, 'fa-regular fa-circle', false);
  setBugState(bugReportEmailStatusIcon, 'idle');
  setBugSendEnabled(false);

  bugReportEmailInput.addEventListener('input', () => {
    const v = bugReportEmailInput.value.trim();

    clearTimeout(bugReportEmailSpinnerTimer);
    clearTimeout(bugReportEmailFinalTimer);
    clearTimeout(bugReportEmailEmptyTimer);

    // empty
    if (!v) {
      setBugIcon(bugReportEmailStatusIcon, 'fa-solid fa-square-xmark', false);
      setBugState(bugReportEmailStatusIcon, 'invalid');
      setBugSendEnabled(false);

      bugReportEmailEmptyTimer = setTimeout(() => {
        if (!bugReportEmailInput.value.trim()) {
          setBugIcon(bugReportEmailStatusIcon, 'fa-regular fa-circle', false);
          setBugState(bugReportEmailStatusIcon, 'idle');
        }
      }, 2500);

      return;
    }

    // spinner
    bugReportEmailSpinnerTimer = setTimeout(() => {
      setBugIcon(bugReportEmailStatusIcon, 'fa-solid fa-circle-notch', true);
      setBugState(bugReportEmailStatusIcon, 'loading');
      setBugSendEnabled(false);
    }, 190);

    // final
    bugReportEmailFinalTimer = setTimeout(() => {
      const ok = isValidEmail(v);

      setBugIcon(
        bugReportEmailStatusIcon,
        ok ? 'fa-solid fa-square-check' : 'fa-solid fa-square-xmark',
        false
      );
      setBugState(bugReportEmailStatusIcon, ok ? 'valid' : 'invalid');
      setBugSendEnabled(ok);
    }, 700);
  });
}

// Firebase Firestore SendBug function
async function SendBug() {
  // Check if Firebase is initialized
  if (!window.firebaseDb) {
    console.error('❌ Firebase not initialized. Waiting for initialization...');
    alert('❌ Error: Firebase service initializing. Please wait a moment and try again.');
    return false;
  }

  // Wait a moment for Firebase to be fully ready if needed
  let retries = 0;
  while (!window.firebaseDb && retries < 5) {
    await new Promise(resolve => setTimeout(resolve, 500));
    retries++;
  }

  if (!window.firebaseDb || !window.addDoc || !window.collection || !window.serverTimestamp) {
    console.error('❌ Firebase initialization failed');
    alert('❌ Error: Firebase service not available. Please refresh the page.');
    return false;
  }

  try {
    const email = bugReportEmailInput?.value?.trim();
    const information = document.getElementById('info')?.value?.trim();

    // Validate inputs
    if (!email || !isValidEmail(email)) {
      alert('⚠️ Please enter a valid email address.');
      return false;
    }

    if (!information || information.length === 0) {
      alert('⚠️ Please provide bug information/recreation method.');
      return false;
    }

    console.log('📤 Sending bug report to Firebase...');

    // Prepare the bug report data
    const bugReportData = {
      email: email,
      information: information,
      userAgent: navigator.userAgent,
      timestamp: window.serverTimestamp(),
      url: window.location.href,
      language: navigator.language,
      platform: navigator.platform
    };

    // Add the document to 'bugReports' collection
    const docRef = await window.addDoc(window.collection(window.firebaseDb, 'bugReports'), bugReportData);
    
    console.log('✅ Bug report sent successfully! Document ID:', docRef.id);

    // Clear the form
    bugReportEmailInput.value = '';
    document.getElementById('info').value = '';
    setBugIcon(bugReportEmailStatusIcon, 'fa-regular fa-circle', false);
    setBugState(bugReportEmailStatusIcon, 'idle');
    setBugSendEnabled(false);

    // Show success popup
    openPopup('popupbrss');
    return true;

  } catch (error) {
    console.error('❌ Error sending bug report to Firebase:', error);
    alert(`❌ Error sending report: ${error.message}. Please try again.`);
    return false;
  }
}

// Make SendBug globally accessible
window.SendBug = SendBug;

// Update your event listener at the bottom of your script:
if (bugReportSendBtn) {
  bugReportSendBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation(); // Prevents the event from bubbling up or firing twice

    // Add a simple "isProcessing" check to prevent spam clicks
    if (bugReportSendBtn.dataset.loading === 'true') return;
    
    if (!bugReportEmailCheck) {
      alert('⚠️ Please enter a valid email address.');
      return;
    }

    bugReportSendBtn.dataset.loading = 'true'; // Lock the button
    await SendBug();
    bugReportSendBtn.dataset.loading = 'false'; // Unlock after completion
  });
}