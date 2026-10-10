document.documentElement.classList.add('js');

// Vercel serves this tracking script after Web Analytics is enabled.
// Keep local development visits out of the production visitor counts.
if (window.location.hostname === 'portfolioproject-coral-xi.vercel.app') {
  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };
  const analyticsScript = document.createElement('script');
  analyticsScript.defer = true;
  analyticsScript.src = '/_vercel/insights/script.js';
  document.head.appendChild(analyticsScript);
}

const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const yearEl = document.getElementById('year');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const closeMenu = (restoreFocus = false) => {
  if (!navToggle || !mainNav) return;
  mainNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
  if (restoreFocus) navToggle.focus();
};

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mainNav.classList.contains('open')) closeMenu(true);
  });

  document.addEventListener('click', (event) => {
    if (header && !header.contains(event.target)) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) closeMenu();
  });
}

const updateHeader = () => {
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 30);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealItems = [...document.querySelectorAll('[data-reveal]')];

if (reducedMotion.matches || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const sectionLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const sections = [...document.querySelectorAll('[data-section][id]')];

const updateActiveSection = () => {
  const marker = window.scrollY + window.innerHeight * 0.38;
  let current = sections[0];

  sections.forEach((section) => {
    if (section.offsetTop <= marker) current = section;
  });

  sectionLinks.forEach((link) => {
    const isCurrent = link.getAttribute('href') === `#${current.id}`;
    link.classList.toggle('active', isCurrent);
    if (isCurrent) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
};

updateActiveSection();
window.addEventListener('scroll', updateActiveSection, { passive: true });

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (finePointer.matches && !reducedMotion.matches) {
  document.querySelectorAll('[data-spotlight]').forEach((surface) => {
    surface.addEventListener('pointermove', (event) => {
      const bounds = surface.getBoundingClientRect();
      surface.style.setProperty('--mouse-x', `${event.clientX - bounds.left}px`);
      surface.style.setProperty('--mouse-y', `${event.clientY - bounds.top}px`);
    });
  });
}
