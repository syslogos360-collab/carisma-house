// Mobile menu + smooth scroll for Carisma House
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#nav-links');
const header = document.querySelector('.site-header');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setMenu(open) {
  if (!toggle || !menu) return;
  menu.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
}

toggle?.addEventListener('click', () => {
  setMenu(toggle.getAttribute('aria-expanded') !== 'true');
});

// Close the menu when a link inside it is clicked
menu?.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

// Close with Escape or when leaving the mobile layout
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});
window.matchMedia('(min-width: 801px)').addEventListener('change', (event) => {
  if (event.matches) setMenu(false);
});

// Smooth scroll for in-page anchors, offset by the sticky header
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href');
  if (id.length < 2) return;
  const target = document.querySelector(id);
  if (!target) return;
  event.preventDefault();
  const offset = (header?.offsetHeight ?? 0) + 12;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
  history.pushState(null, '', id);
});
