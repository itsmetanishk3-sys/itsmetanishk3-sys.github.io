/* ═══════════════════════════════════════════════════════════
   MAIN JAVASCRIPT — main.js
   All interactivity: theme, cursor, typing, tilt, etc.
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ─── THEME TOGGLE ────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ─── CUSTOM CURSOR ────────────────────────────────────────────
const dot     = document.getElementById('cursorDot');
const outline = document.getElementById('cursorOutline');
let outX = 0, outY = 0, dotX = 0, dotY = 0;

document.addEventListener('mousemove', e => {
  dotX = e.clientX;
  dotY = e.clientY;
});

(function animateCursor() {
  outX += (dotX - outX) * 0.12;
  outY += (dotY - outY) * 0.12;
  if (dot) {
    dot.style.left = dotX + 'px';
    dot.style.top  = dotY + 'px';
  }
  if (outline) {
    outline.style.left = outX + 'px';
    outline.style.top  = outY + 'px';
  }
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, .tilt-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ─── NAVBAR SCROLL ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── MOBILE HAMBURGER ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ─── ACTIVE NAV LINK ON SCROLL ────────────────────────────────
const sections = document.querySelectorAll('section[id]');
function setActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}
window.addEventListener('scroll', setActiveNav);

// ─── TYPING ANIMATION ─────────────────────────────────────────
const phrases = [
  'Electrical Engineer',
  'Computer Engineer',
  'Embedded Systems Dev',
  'IoT Enthusiast',
  'Web Developer',
  'Problem Solver',
  'Open Source Contributor',
];
const typingEl = document.getElementById('typingText');
let pIdx = 0, cIdx = 0, deleting = false;

function typeLoop() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    typingEl.textContent = phrase.substring(0, ++cIdx);
    if (cIdx === phrase.length) {
      deleting = true;
      return setTimeout(typeLoop, 2000);
    }
  } else {
    typingEl.textContent = phrase.substring(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 50 : 90);
}
setTimeout(typeLoop, 1500);

// ─── SCROLL REVEAL ────────────────────────────────────────────
const revealEls = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObs.observe(el));

// ─── SKILL BAR ANIMATION ──────────────────────────────────────
const skillBars = document.querySelectorAll('.skill-fill');
const skillObs  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const pct = e.target.getAttribute('data-pct');
      e.target.style.width = pct + '%';
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(b => skillObs.observe(b));

// ─── COUNTER ANIMATION ────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const step   = Math.ceil(target / 40);
  let current  = 0;
  const timer  = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 40);
}

const counterEls = document.querySelectorAll('.stat-number');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObs.observe(el));

// ─── 3D TILT EFFECT ───────────────────────────────────────────
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const rotX   = -dy * 8;
    const rotY   =  dx * 8;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── PROJECT FILTER ───────────────────────────────────────────
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      const cats = card.getAttribute('data-category') || '';
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !show);
    });
  });
});

// ─── BACK TO TOP ──────────────────────────────────────────────
const bttBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  bttBtn.classList.toggle('visible', window.scrollY > 400);
});
bttBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── CONTACT FORM ─────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const btnText     = document.getElementById('btnText');
const btnLoading  = document.getElementById('btnLoading');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  btnText.classList.add('hidden');
  btnLoading.classList.remove('hidden');
  submitBtn.disabled = true;

  const formData = new FormData(contactForm);

  // ⚠️ Replace 'YOUR_FORMSPREE_ID' with your actual Formspree form ID
  // Visit https://formspree.io to create a free form and get your ID
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_ID';

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      showFormFeedback('✅ Message sent! I\'ll get back to you soon.', 'success');
      contactForm.reset();
    } else {
      throw new Error('Server error');
    }
  } catch {
    showFormFeedback('❌ Something went wrong. Please email me directly.', 'error');
  } finally {
    btnText.classList.remove('hidden');
    btnLoading.classList.add('hidden');
    submitBtn.disabled = false;
  }
});

function showFormFeedback(msg, type) {
  let fb = document.getElementById('formFeedback');
  if (!fb) {
    fb = document.createElement('p');
    fb.id = 'formFeedback';
    fb.style.cssText = 'text-align:center;font-size:.85rem;padding:.75rem;border-radius:8px;margin-top:.5rem;';
    contactForm.appendChild(fb);
  }
  fb.textContent = msg;
  fb.style.background = type === 'success'
    ? 'rgba(0,245,255,.1)' : 'rgba(239,68,68,.1)';
  fb.style.color = type === 'success'
    ? 'var(--accent)' : '#ef4444';
  fb.style.border = `1px solid ${type === 'success' ? 'var(--accent)' : '#ef4444'}`;
  setTimeout(() => fb.remove(), 6000);
}

// ─── FOOTER YEAR ──────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ─── SMOOTH SCROLL FOR ALL ANCHOR LINKS ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── GLITCH ON HOVER (Logo) ───────────────────────────────────
document.querySelectorAll('.glitch').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  });
});

console.log(
  '%c⚡ Tanishk Srivastava — Portfolio\n%c Built with HTML, CSS & JS | Hosted on GitHub Pages',
  'font-size:16px;font-weight:bold;color:#00f5ff;',
  'font-size:11px;color:#94a3b8;'
);
