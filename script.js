/**
 * Eliandani — Interactive behaviors & accessibility enhancements
 * Zero dependencies, keyboard accessible, robust fallback if JS is interrupted.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollReveal();
  initSpotlight();
  initClipboard();
  initLocalTime();
  initCurrentYear();
});

/**
 * 1. Sticky header elevation & section link tracking (aria-current)
 */
function initHeader() {
  const header = document.getElementById('siteHeader');
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!header) return;

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const y = window.scrollY;

        // Scrolled header border
        header.classList.toggle('is-scrolled', y > 24);

        // Section tracker
        let currentId = '';
        sections.forEach((section) => {
          const top = section.offsetTop - 120;
          const height = section.offsetHeight;
          if (y >= top && y < top + height) {
            currentId = section.getAttribute('id');
          }
        });

        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          const isCurrent = href === `#${currentId}`;
          if (isCurrent) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * 2. Mobile navigation drawer with ARIA disclosure state
 */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');

  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen);
  });

  // Close when tapping any nav link
  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      toggle.getAttribute('aria-expanded') === 'true' &&
      !nav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      setOpen(false);
    }
  });
}

/**
 * 3. Scroll reveal with IntersectionObserver
 */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // Immediate reveal for elements above or near the fold
  const revealIfInView = (el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight + 60) {
      el.classList.add('is-visible');
      return true;
    }
    return false;
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px 80px 0px'
  });

  items.forEach((el) => {
    if (!revealIfInView(el)) {
      observer.observe(el);
    }
  });
}

/**
 * 4. Radial card spotlight effect following the pointer
 */
function initSpotlight() {
  // Only activate on devices with fine pointer (mouse/trackpad), skips touchscreens
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.spotlight');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  });
}

/**
 * 5. One-click clipboard copy with toast confirmation
 */
function initClipboard() {
  const triggers = document.querySelectorAll('[data-copy]');
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const text = trigger.getAttribute('data-copy');
      if (!text) return;

      copyText(text)
        .then(() => showToast(`Copied ${text}`))
        .catch(() => showToast(text));
    });
  });
}

function copyText(str) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(str);
  }
  // Fallback for non-HTTPS or older browsers
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = str;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    } catch (err) {
      document.body.removeChild(ta);
      reject(err);
    }
  });
}

/**
 * 6. Polite floating toast feedback
 */
let toastTimeout;
function showToast(message) {
  const region = document.getElementById('toastRegion');
  if (!region) return;

  clearTimeout(toastTimeout);
  region.innerHTML = '';

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  region.appendChild(toast);

  // Trigger CSS transition
  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  toastTimeout = setTimeout(() => {
    toast.classList.remove('is-visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 2400);
}

/**
 * 7. Live WIB (UTC+7) clock in the portrait badge
 */
function initLocalTime() {
  const timeEl = document.querySelector('[data-local-time]');
  if (!timeEl) return;

  const update = () => {
    try {
      const now = new Date();
      // Formatter locked to Asia/Jakarta (WIB, UTC+7)
      const formatted = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(now);
      timeEl.textContent = `${formatted} WIB`;
    } catch {
      timeEl.textContent = 'UTC+7';
    }
  };

  update();
  setInterval(update, 30000);
}

/**
 * 8. Automatic current year in footer
 */
function initCurrentYear() {
  const yearEl = document.querySelector('[data-current-year]');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}
