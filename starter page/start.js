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

// Cookie logic

// document.addEventListener('DOMContentLoaded', () => {
//   const consentExpiry = localStorage.getItem('cookieconsent-expiry')
//   const onemin = 60 * 1000

//   if(consentExpiry && Date.now() > Number(consentExpiry)){
//     localStorage.removeItem('cookieconsent')
//     localStorage.removeItem('cookieconsent-expiry')
//   }

//   const cookieconsent = localStorage.getItem('cookieconsent')

//   if(cookieconsent !== '✓'){
//     openPopup('popupaskcookies');
//   }

//   const buttonpressed = document.querySelectorAll('#acceptall-button, #declineall-button, #declineall-button-closepopup, #acceptall-button-closepopup');
//   const closepopup = ['popupcookiesaccept', 'popupcookiesdecline', 'popupcookiesapplied', 'popupaskcookies'];

//   buttonpressed.forEach(button => {
//     button.addEventListener('click', () => {

//       localStorage.setItem('cookieconsent-expiry',Date.now() + onemin)

//       if(button.id === 'acceptall-button' || button.id === 'acceptall-button-closepopup'){
//         localStorage.setItem('cookieconsent','✓')
//       }

//       if(button.id === 'declineall-button' || button.id === 'declineall-button-closepopup'){
//         localStorage.setItem('cookieconsent','✗')
//       }

//       setTimeout(() => {
//         closepopup.forEach(id => closePopup(id));
//       }, 5000);
//     });
//   });
// });

document.addEventListener('DOMContentLoaded', () => {
  openPopup('popupsignup')
})

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

        // if your validator listens on .signup-email, keep them in sync
        const signupInput = document.querySelector('.signup-email');
        if (signupInput && signupInput !== input) {
          signupInput.value = newVal;
          signupInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

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

const emailinput = document.querySelector('.signup-email');
const statusicon = document.getElementById('emailStatusIcon');

let spinnerTimer = null;
let finalTimer = null;

function seticon(classes, spin = false) {
  if (!statusicon) return;
  statusicon.className = `signup-righticon ${classes}`;
  statusicon.classList.toggle('spin', !!spin);
}

function isValidEmail(v) {
  return /^(?!\.)(?!.*\.\.)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?<!\.)@(?=.{1,253}$)(?!-)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(?<!-)\.[a-zA-Z]{2,}$/.test(v);
}

if (emailinput) {
  emailinput.addEventListener('input', () => {
    const v = emailinput.value.trim();

    clearTimeout(spinnerTimer);
    clearTimeout(finalTimer);

    // empty
    if (!v) {
      seticon('fa-solid fa-square-xmark', false);
      statusicon.classList.toggle('valid', false);
      statusicon.classList.toggle('invalid', true);
      statusicon.classList.toggle('idle', false);
      statusicon.classList.toggle('loading', false);

      emptyTimer = setTimeout(() => {
        if(!emailinput.value.trim()){
          seticon('fa-regular fa-circle')
          statusicon.classList.toggle('valid', false);
          statusicon.classList.toggle('invalid', false);
          statusicon.classList.toggle('idle', true);
          statusicon.classList.toggle('loading', false);
            }
      }, 2500);
      return;
    }

    // spinner
    spinnerTimer = setTimeout(() => {
      seticon('fa-solid fa-circle-notch', true);
        statusicon.classList.toggle('valid', false);
        statusicon.classList.toggle('invalid', false);
        statusicon.classList.toggle('idle', false);
        statusicon.classList.toggle('loading', true);
    }, 190);

    // final
    finalTimer = setTimeout(() => {
      if (isValidEmail(v)) {
        seticon('fa-solid fa-square-check', false);
        statusicon.classList.toggle('valid', true);
        statusicon.classList.toggle('invalid', false);
        statusicon.classList.toggle('idle', false);
        statusicon.classList.toggle('loading', false);
      } else {
        seticon('fa-solid fa-square-xmark', false);
        statusicon.classList.toggle('valid', false);
        statusicon.classList.toggle('invalid', true);
        statusicon.classList.toggle('idle', false);
        statusicon.classList.toggle('loading', false);
      }
    }, 5000);
  });
}

// ---------------------------
