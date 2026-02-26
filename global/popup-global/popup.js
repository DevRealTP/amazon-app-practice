// Scroll EXPAND or COLLSAPE Behavior

(() => {
  const popup = document.getElementById('popupcookiesoptions');
  const popup2 = document.getElementById('popuprab');
  if (!popup) return;
  if (!popup2) return;

  const content = popup.querySelector('.content');
  const content2 = popup2.querySelector('.content');
  if (!content) return;
  if (!content2) return;

  let expanded = false;
  let expanded2 = false;
  const COLLAPSED = '300px';
  const EXPANDED = '80vh';

  content.style.maxHeight = COLLAPSED;
  content.style.overflowY = 'auto';
  content.style.transition = 'max-height 220ms ease';
  content2.style.maxHeight = COLLAPSED;
  content2.style.overflowY = 'auto';
  content2.style.transition = 'max-height 220ms ease';

  const expand = () => {
    if (expanded) return;
    expanded = true;
    content.classList.add('expanded');
    content.style.maxHeight = EXPANDED;
  };

  const expand2 = () => {
    if (expanded2) return;
    expanded2 = true;
    content2.classList.add('expanded');
    content2.style.maxHeight = EXPANDED;
  };

  const resetCollapsed = () => {
    expanded = false;
    content.classList.remove('expanded');
    content.style.maxHeight = COLLAPSED;
    content.scrollTop = 0;
  };

  const resetCollapsed2 = () => {
    expanded2 = false;
    content2.classList.remove('expanded');
    content2.style.maxHeight = COLLAPSED;
    content2.scrollTop = 0;
  };

  content.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) expand();
  }, { passive: true });

  content.addEventListener('touchstart', () => {
  }, { passive: true });

  content.addEventListener('touchmove', () => {
    expand();
  }, { passive: true });

  content2.addEventListener('scroll', () => {
    if (content2.scrollTop > 0) expand2();
  }, { passive: true });

  content2.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) expand2();
  }, { passive: true });

  content2.addEventListener('touchstart', () => {
  }, { passive: true });

  content2.addEventListener('touchmove', () => {
    expand2();
  }, { passive: true });

  content2.addEventListener('scroll', () => {
    if (content.scrollTop > 0) expand2();
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

    const observer2 = new MutationObserver(() => {
    const isHidden2 = popup2.getAttribute('aria-hidden') === 'true';
    const isOpen2 = popup2.classList.contains('is-open') || popup2.getAttribute('aria-hidden') === 'false';

    if (isHidden2) resetCollapsed2();
    
    if (isOpen2 && !expanded2) {
      content2.style.maxHeight = COLLAPSED;
      content2.scrollTop = 0;
    }
  });

  observer2.observe(popup2, { attributes: true, attributeFilter: ['class', 'aria-hidden', 'style'] });
})();