/* ============================================================
   script.js — Portfolio for Rupesh Kapgate
   ============================================================ */

/* ── 1. MERMAID INIT ──────────────────────────────────────── */
mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  themeVariables: {
    primaryColor: '#e8f0f8',
    primaryTextColor: '#1a1612',
    primaryBorderColor: '#1b3a5c',
    lineColor: '#1b3a5c',
    secondaryColor: '#f0ece4',
    tertiaryColor: '#faf8f4',
    fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif",
  },
  flowchart: {
    curve: 'basis',
    padding: 20,
    nodeSpacing: 40,
    rankSpacing: 50,
  },
});

/* ── 2. NAVBAR SCROLL EFFECT + ACTIVE LINK ────────────────── */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-links a');
const sections  = document.querySelectorAll('section[id]');

function updateNav() {
  // Frosted glass on scroll
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlight
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav(); // run once on load

/* ── 3. HAMBURGER MENU ────────────────────────────────────── */
const hamburger   = document.getElementById('hamburger');
const navLinkList = document.getElementById('navLinks');
let menuOpen      = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  navLinkList.classList.toggle('open', menuOpen);

  // Animate hamburger → X
  const spans = hamburger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close on nav link click
navLinkList.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    if (menuOpen) hamburger.click();
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (menuOpen && !navbar.contains(e.target)) {
    hamburger.click();
  }
});

/* ── 4. SMOOTH SCROLL ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 72;
      window.scrollTo({
        top: target.offsetTop - offset + 1,
        behavior: 'smooth',
      });
    }
  });
});

/* ── 5. SCROLL REVEAL (IntersectionObserver) ──────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger timeline items
        if (entry.target.closest('.timeline')) {
          const items = [...document.querySelectorAll('.timeline-item.reveal')];
          const idx   = items.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 0.08}s`;
        }
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 6. ANIMATED COUNTERS ─────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1600; // ms
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ── 7. CHART.JS RADAR ────────────────────────────────────── */
function initRadarChart() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;

  // Resolve CSS variable colours
  const style      = getComputedStyle(document.documentElement);
  const accent     = style.getPropertyValue('--accent').trim()       || '#1b3a5c';
  const accentBg   = style.getPropertyValue('--accent-light').trim() || '#e8f0f8';
  const borderCol  = style.getPropertyValue('--border').trim()       || '#ddd7cc';
  const textSec    = style.getPropertyValue('--text-secondary').trim()|| '#6b6560';

  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        'Architecture',
        'Back-End',
        'Front-End',
        'Cloud / DevOps',
        'Data Engineering',
        'Leadership',
        'Agile Delivery',
      ],
      datasets: [{
        label: 'Competency',
        data: [95, 90, 80, 85, 78, 88, 90],
        backgroundColor: accentBg + 'cc',  // translucent
        borderColor: accent,
        borderWidth: 2,
        pointBackgroundColor: accent,
        pointRadius: 4,
        pointHoverRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: {
        duration: 1200,
        easing: 'easeOutQuart',
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            display: false,
          },
          grid: {
            color: borderCol,
          },
          angleLines: {
            color: borderCol,
          },
          pointLabels: {
            font: {
              family: "'DM Sans', sans-serif",
              size: 12,
              weight: '500',
            },
            color: textSec,
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.raw}%`,
          },
          backgroundColor: '#fff',
          borderColor: borderCol,
          borderWidth: 1,
          titleColor: accent,
          bodyColor: textSec,
          padding: 10,
        },
      },
    },
  });
}

// Initialize radar chart when the skills section is visible
const radarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initRadarChart();
        radarObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

const skillsSection = document.getElementById('skills');
if (skillsSection) radarObserver.observe(skillsSection);
