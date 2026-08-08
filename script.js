window.addEventListener('load', () => document.body.classList.add('loaded'));

// ── Scroll Reveal ──
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('section, .stagger').forEach(el => revealObs.observe(el));

// ── Navbar ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  // Active nav
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  links.forEach(l => { l.classList.toggle('active', l.getAttribute('href') === `#${cur}`); });
});

// ── Mobile Nav ──
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => { navLinks.classList.toggle('open'); });
  document.querySelectorAll('.nav-links a').forEach(l => {
    l.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── Mouse Glow ──
document.addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--mx', (e.clientX / window.innerWidth * 100) + '%');
  document.documentElement.style.setProperty('--my', (e.clientY / window.innerHeight * 100) + '%');
});

// ── Typewriter ──
const twEl = document.querySelector('.typewriter');
if (twEl) {
  const texts = ['Backend Developer', 'Node.js Enthusiast', 'Problem Solver', 'Informatics Graduate'];
  let ti = 0, ci = 0, deleting = false;
  function tick() {
    const cur = texts[ti];
    ci += deleting ? -1 : 1;
    twEl.textContent = cur.substring(0, ci);
    let speed = deleting ? 35 : 70;
    if (!deleting && ci === cur.length) { speed = 2500; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ti = (ti + 1) % texts.length; speed = 400; }
    setTimeout(tick, speed);
  }
  tick();
}

// ── Counter Animation ──
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('[data-count]').forEach(c => {
      if (c.classList.contains('counted')) return;
      c.classList.add('counted');
      const target = parseFloat(c.dataset.count);
      const suffix = c.dataset.suffix || '';
      const dec = target % 1 !== 0;
      const start = performance.now();
      (function update(now) {
        const p = Math.min((now - start) / 2000, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        c.textContent = (dec ? (target * eased).toFixed(2) : Math.floor(target * eased)) + suffix;
        if (p < 1) requestAnimationFrame(update);
      })(start);
    });
  });
}, { threshold: 0.5 });
document.querySelectorAll('.hero-stats').forEach(el => statObs.observe(el));

// ── Smooth Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    const t = document.querySelector(this.getAttribute('href'));
    if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
  });
});

// ── Skill Tag Tilt ──
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mousemove', (e) => {
    const r = tag.getBoundingClientRect();
    const rx = (e.clientY - r.top - r.height / 2) / 10;
    const ry = (r.width / 2 - (e.clientX - r.left)) / 10;
    tag.style.transform = `translateY(-3px) perspective(500px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  tag.addEventListener('mouseleave', () => { tag.style.transform = ''; });
});



// ── Parallax Orbs ──
window.addEventListener('scroll', () => {
  document.querySelectorAll('.orb').forEach((o, i) => {
    o.style.transform = `translateY(${window.scrollY * (i + 1) * 0.03}px)`;
  });
});

// ── Floating Particles ──
const particleContainer = document.getElementById('particles');
if (particleContainer) {
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
    particleContainer.appendChild(p);
  }
}
