// Scroll EXPAND or COLLSAPE Behavior

(() => {
  const popup = document.querySelectorAll('#popupcookiesoptions,#popupsignup');
  // ^ 
  // 1. if adding on more, replace ('','') --> ['#,#']
  // 2. Then rename getElementById --> querySelectorAll
  // 3. THEN Add the IDS in #
  if (!popup) return;

  const content = popup.querySelector('.content');
  if (!content) return;

  let expanded = false;
  const COLLAPSED = '300px';
  const EXPANDED = '80vh';

  content.style.maxHeight = COLLAPSED;
  content.style.overflowY = 'auto';
  content.style.transition = 'max-height 220ms ease';

  const expand = () => {
    if (expanded) return;
    expanded = true;
    content.classList.add('expanded');
    content.style.maxHeight = EXPANDED;
  };

  const resetCollapsed = () => {
    expanded = false;
    content.classList.remove('expanded');
    content.style.maxHeight = COLLAPSED;
    content.scrollTop = 0;
  };

  content.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) expand();
  }, { passive: true });

  content.addEventListener('touchstart', () => {
  }, { passive: true });

  content.addEventListener('touchmove', () => {
    expand();
  }, { passive: true });

  content.addEventListener('scroll', () => {
    if (content.scrollTop > 0) expand();
  }, { passive: true });

  const observer = new MutationObserver(() => {
    const isHidden = popup.getAttribute('aria-hidden') === 'true';
    const isOpen = popup.classList.contains('is-open') || popup.getAttribute('aria-hidden') === 'false';

    if (isHidden) resetCollapsed();
    
    if (isOpen && !expanded) {
      content.style.maxHeight = COLLAPSED;
      content.scrollTop = 0;
    }
  });

  observer.observe(popup, { attributes: true, attributeFilter: ['class', 'aria-hidden', 'style'] });
})();