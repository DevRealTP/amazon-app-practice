const timer = Math.floor(Math.random() * (1000 - 100 + 1)) + 1000;

function supportemailredirect() {
  openPopup('popuprl');
  setTimeout(() => {
    window.location.href = "https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=508510";
  }, timer);
}

function pandsredirect() {
  openPopup('popuprl');
  setTimeout(() => {
    window.location.href = "https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=201909010&ref_=footer_privacy";
  }, timer);
}

function tosredirect() {
  openPopup('popuprl');
  setTimeout(() => {
    window.location.href = "https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=202140280";
  }, timer);
}

function cookieredirect() {
  openPopup('popuprl');
  setTimeout(() => {
    window.location.href = "https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=201890250&ref_=footer_cookies_notice";
  }, timer);
}

function cagredirect() {
  openPopup('popuprl');
  setTimeout(() => {
    window.location.assign("../main/index.html");
  }, timer);
}

function socialredirect() {
  openPopup('popuprl');
  setTimeout(() => {
    window.location.href = "https://linktr.ee/amazonuk";
  }, timer);
}

function caaredirect() {
  openPopup('popuprl');
  setTimeout(() => {
    window.location.href = "https://www.amazon.jobs/en";
  }, timer);
}


function coperateredirect() {
  openPopup('popuprl');
  setTimeout(() => {
    window.location.href = "https://www.aboutamazon.com/workplace/corporate-offices";
  }, timer);
}

function faceidhttpsredirect() {
  openPopup('popuprl')
  setTimeout(() => {
    window.location.href = "https://devrealtp.github.io/amazon-app-practice/starter%20page/start.html";
  }, timer);
}

(() => {
  const REDIRECTS = {
    pands: {
      label: 'amazon.co.uk/privacy-and-safety',
      url: 'https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=201909010'
    },
    tos: {
      label: 'amazon.co.uk/terms-of-service',
      url: 'https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=201909000'
    },
    cookies: {
      label: 'amazon.co.uk/cookies-and-usage',
      url: 'https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=201909150'
    },
    careers: {
      label: 'amazon.co.uk/careers',
      url: 'https://www.amazon.jobs/'
    },
    supportEmail: {
      label: 'amazon.co.uk/support',
      url: 'https://www.amazon.co.uk/gp/help/customer/contact-us'
    },
    social: {
      label: 'amazon.co.uk/social',
      url: 'https://www.amazon.co.uk/'
    },
    corporate: {
      label: 'amazon.com/investor-relations',
      url: 'https://ir.aboutamazon.com/'
    }
  };

  const redirectToText = document.getElementById('redirectToText');
  const acceptBtn = document.getElementById('redirectAcceptBtn');

  let pendingUrl = null;

  function openRedirect(key) {
    const item = REDIRECTS[key];
    if (!item) return;

    pendingUrl = item.url;
    redirectToText.textContent = item.label;

    openPopup('popupRedirect');
  }

  acceptBtn.addEventListener('click', () => {
    if (!pendingUrl) return;

    openPopup('popuprl');

    setTimeout(() => {
      window.location.href = pendingUrl;
    }, 900);
  });

  document.addEventListener('click', (e) => {
    const goEl = e.target.closest('[data-go]');
    if (!goEl) return;

    e.preventDefault();

    const key = goEl.getAttribute('data-go');
    if (!key) return;

    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    if (sideMenu && menuOverlay) {
      sideMenu.classList.remove('open');
      menuOverlay.classList.remove('show');
      sideMenu.setAttribute('aria-hidden', 'true');
      menuOverlay.setAttribute('aria-hidden', 'true');
    }

    openRedirect(key);
  });
})();