/* ==================================================================
   PORTFOLIO — Houssous Nehla Baha
   script.js
   ------------------------------------------------------------------
   COMMENT AJOUTER DU CONTENU (aucune limite) :
   Dépose le fichier dans /assets avec le prochain numéro libre :
     Certificats → c16.png, c17.png ...   (les 15 premiers sont déjà prévus)
     Badges      → b11.png, b12.png ...   (les 10 premiers sont déjà prévus)
     Photos      → g21.png, g22.png ...   (les 20 premières sont déjà prévues)
     Projets     → ajoute une ligne dans PROJECT_TITLES ci-dessous,
                   puis dépose pN.png + pN.pdf
   Le fichier apparaît automatiquement, sans autre modification.
   Les emplacements "de base" restent toujours visibles (avec une
   icône de remplacement) même avant que tu aies déposé l'image —
   comme ça la section ne paraît jamais vide.
================================================================== */

const CERTS_BASE   = 15;  // emplacements certificats toujours affichés
const BADGES_BASE  = 10;  // emplacements badges toujours affichés
const GALLERY_BASE = 20;  // emplacements galerie toujours affichés
const PROJECTS_CLAIMED_MIN = 10; // total de projets réalisés (annoncé même si non tous démontrés ici)
const MAX_PROBE = 60; // plafond de sondage pour la détection au-delà des emplacements de base

/* ------------------------------------------------------------------
   LIEN GITHUB — à corriger une seule fois ici, il se propage partout
------------------------------------------------------------------ */
const GITHUB_URL = "https://github.com/nehla7"; // ⚠️ remplace par ton vrai lien GitHub si différent

document.querySelectorAll('[data-github]').forEach(el => {
  el.setAttribute('href', GITHUB_URL);
});

/* ------------------------------------------------------------------
   TITRES DES PROJETS
   Ajoute une ligne pour chaque nouveau projet démontré (numéro =
   nom du fichier assets/pN.png / assets/pN.pdf).
------------------------------------------------------------------ */
const PROJECT_TITLES = {
  1: "DZshop",
  2: "eConcoursDZ",
  3: "SafePath",
  4: "Petroleum Club Website",
  5: "Rani Hassal",
  6: "Smart Safety"
};

/* ------------------------------------------------------------------
   SONDAGE AUTOMATIQUE (pour les ajouts au-delà des emplacements de base)
------------------------------------------------------------------ */
function probeAssets(prefix, from, to) {
  const checks = [];
  for (let i = from; i <= to; i++) {
    const src = `assets/${prefix}${i}.png`;
    checks.push(new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(i);
      img.onerror = () => resolve(null);
      img.src = src;
    }));
  }
  return Promise.all(checks).then(results => results.filter(v => v !== null));
}

/* ---- RENDER PROJECTS ---- */
const projectsGrid = document.getElementById('projectsGrid');
const projectsListEl = document.getElementById('projectsList');
const projectsCountEls = document.querySelectorAll('[data-projects-count]');

const namedIndices = Object.keys(PROJECT_TITLES).map(Number).sort((a, b) => a - b);
const highestNamed = namedIndices.length ? Math.max(...namedIndices) : 0;

const projectsProbe = probeAssets('p', highestNamed + 1, MAX_PROBE).then(extra => {
  const allIndices = [...namedIndices, ...extra];

  projectsListEl.innerHTML = allIndices.map((num, i) => {
    const title = PROJECT_TITLES[num] || `Projet ${num}`;
    const idx = String(i + 1).padStart(2, '0');
    return `<li><span class="num">${idx}</span> ${title}</li>`;
  }).join('');

  allIndices.forEach((num, i) => {
    const title = PROJECT_TITLES[num] || `Projet ${num}`;
    const card = document.createElement('article');
    card.className = 'project-card reveal' + (i % 2 === 1 ? ' reveal-delay-1' : '');
    card.innerHTML = `
      <div class="project-thumb">
        <img src="assets/p${num}.png" alt="${title}"
             onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\\'project-thumb-placeholder\\'>🖥️</div>'">
      </div>
      <div class="project-body">
        <h3>${title}</h3>
        <p style="font-size:0.82rem;color:var(--muted);margin-bottom:16px;">Pour plus de détails, contactez-moi.</p>
        <div class="project-actions">
          <a href="assets/p${num}.pdf" target="_blank" rel="noopener" class="proj-btn solid">📄 Voir PDF</a>
        </div>
      </div>
    `;
    projectsGrid.appendChild(card);
    observeReveal(card);
    initTilt(card);
  });

  const total = Math.max(PROJECTS_CLAIMED_MIN, allIndices.length);
  projectsCountEls.forEach(el => { el.textContent = `+${total}`; });
});

/* ---- RENDER CERTIFICATES CAROUSEL ---- */
const certTrack = document.getElementById('certTrack');
const certCountEls = document.querySelectorAll('[data-certs-count]');
const certParaEl = document.getElementById('certsParagraph');

function renderCertCard(i) {
  const card = document.createElement('div');
  card.className = 'cert-card';
  card.style.cursor = 'pointer';
  card.innerHTML = `
    <div class="cert-thumb" style="aspect-ratio:4/3;background:var(--surface2);overflow:hidden;">
      <img src="assets/c${i}.png" alt="Certificat ${i}" style="width:100%;height:100%;object-fit:cover;"
           onerror="this.parentElement.innerHTML='<div class=\\'cert-thumb-placeholder\\'><svg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'><path d=\\'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\\'/><polyline points=\\'14 2 14 8 20 8\\'/></svg><p style=\\'font-size:0.72rem;color:var(--muted);margin-top:8px;\\'>c${i}.png</p></div>'">
    </div>
  `;
  card.addEventListener('click', () => openLightbox(`assets/c${i}.png`));
  certTrack.appendChild(card);
  initTilt(card);
}

for (let i = 1; i <= CERTS_BASE; i++) renderCertCard(i);
buildDots('certTrack', 'certDots', 280 + 16);

const certsProbe = probeAssets('c', CERTS_BASE + 1, MAX_PROBE).then(extra => {
  extra.forEach(i => renderCertCard(i));
  const total = CERTS_BASE + extra.length;
  buildDots('certTrack', 'certDots', 280 + 16);
  certCountEls.forEach(el => { el.textContent = `+${total}`; });
  if (certParaEl) {
    certParaEl.textContent = `${total} certificats couvrant les réussites académiques, les formations, les stages et la participation à des événements nationaux et internationaux.`;
  }
});

/* ---- RENDER BADGES CAROUSEL ---- */
const badgeTrack = document.getElementById('badgeTrack');
const badgeCountEls = document.querySelectorAll('[data-badges-count]');
const badgeParaEl = document.getElementById('badgesParagraph');

function renderBadgeCard(i) {
  const card = document.createElement('div');
  card.className = 'badge-card';
  card.style.cursor = 'pointer';
  card.innerHTML = `
    <img src="assets/b${i}.png" alt="Badge ${i}"
         onerror="this.parentElement.innerHTML='<div class=\\'badge-placeholder\\' style=\\'padding:24px;text-align:center;color:var(--subtle);font-size:0.75rem;\\'>🏅<br>b${i}.png</div>'">
  `;
  card.addEventListener('click', () => openLightbox(`assets/b${i}.png`));
  badgeTrack.appendChild(card);
  initTilt(card);
}

for (let i = 1; i <= BADGES_BASE; i++) renderBadgeCard(i);
buildDots('badgeTrack', 'badgeDots', 220 + 16);

const badgesProbe = probeAssets('b', BADGES_BASE + 1, MAX_PROBE).then(extra => {
  extra.forEach(i => renderBadgeCard(i));
  const total = BADGES_BASE + extra.length;
  buildDots('badgeTrack', 'badgeDots', 220 + 16);
  badgeCountEls.forEach(el => { el.textContent = `+${total}`; });
  if (badgeParaEl) {
    badgeParaEl.textContent = `${total} badges liés à l'organisation, au leadership et à l'engagement étudiant.`;
  }
});

/* Une fois tous les comptages finalisés, on lance les compteurs animés */
Promise.all([projectsProbe, certsProbe, badgesProbe]).then(() => initCountUp());

/* ---- RENDER GALLERY CAROUSEL ---- */
const galleryTrack = document.getElementById('galleryTrack');

function renderGalleryCard(i) {
  const card = document.createElement('div');
  card.className = 'gallery-card';
  card.style.cursor = 'pointer';
  card.innerHTML = `
    <img src="assets/g${i}.png" alt="Photo ${i}"
         onerror="this.parentElement.innerHTML='<div class=\\'gallery-card-ph\\'>📷</div>'">
  `;
  card.addEventListener('click', () => openLightbox(`assets/g${i}.png`));
  galleryTrack.appendChild(card);
}

for (let i = 1; i <= GALLERY_BASE; i++) renderGalleryCard(i);
buildDots('galleryTrack', 'galleryDots', 340 + 16);

probeAssets('g', GALLERY_BASE + 1, MAX_PROBE).then(extra => {
  extra.forEach(i => renderGalleryCard(i));
  buildDots('galleryTrack', 'galleryDots', 340 + 16);
});

/* ---- CAROUSEL HELPERS ---- */
function buildDots(trackId, dotsId, itemW) {
  const track = document.getElementById(trackId);
  const dots  = document.getElementById(dotsId);
  const items = track.children.length;
  const visible = Math.floor(track.parentElement.clientWidth / itemW) || 1;
  const pages = Math.ceil(items / visible);
  dots.innerHTML = '';
  for (let i = 0; i < pages; i++) {
    const d = document.createElement('div');
    d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dots.appendChild(d);
  }
}

function updateDots(trackId, dotsId, itemW) {
  const track  = document.getElementById(trackId);
  const dots   = document.getElementById(dotsId);
  const page   = Math.round(track.scrollLeft / itemW);
  dots.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === page));
}

function scrollCarousel(trackId, dotsId, dir) {
  const track = document.getElementById(trackId);
  const w = track.firstElementChild?.offsetWidth || 280;
  track.scrollBy({ left: dir * (w + 16), behavior: 'smooth' });
}

['certTrack', 'badgeTrack', 'galleryTrack'].forEach(id => {
  const itemW = id === 'certTrack' ? 296 : id === 'badgeTrack' ? 236 : 356;
  document.getElementById(id).addEventListener('scroll', () => {
    updateDots(id, id.replace('Track', 'Dots'), itemW);
  }, { passive: true });
});

/* Drag to scroll */
document.querySelectorAll('.carousel-track').forEach(track => {
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => {
    isDown = true;
    track.classList.add('grabbing');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('grabbing'); });
  track.addEventListener('mouseup',    () => { isDown = false; track.classList.remove('grabbing'); });
  track.addEventListener('mousemove',  e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX);
  });
});

/* ---- LIGHTBOX ---- */
function openLightbox(src) {
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ---- NAV SCROLL EFFECT + SCROLL PROGRESS BAR ---- */
const nav = document.getElementById('nav');
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  if (progressBar) {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }
}, { passive: true });

/* ---- ACTIVE NAV LINK ---- */
const navAs   = document.querySelectorAll('#navLinks a');
const sections = document.querySelectorAll('section[id]');
const navObs  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => navObs.observe(s));

/* ---- REVEAL ANIMATIONS (statique + dynamique) ---- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
function observeReveal(el) { revealObs.observe(el); }

/* ---- MOBILE NAV ---- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});
function closeMobile() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}

/* ==================================================================
   EFFETS "WOW"
================================================================== */

/* ---- 1. TILT 3D AU SURVOL (cartes) ---- */
function initTilt(el) {
  if (window.matchMedia('(pointer: coarse)').matches) return; // pas sur mobile/tactile
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
}
document.querySelectorAll('.bento-card, .cv-card, .project-card').forEach(initTilt);

/* ---- 2. SPOTLIGHT QUI SUIT LE CURSEUR DANS LE HERO ---- */
const heroSection = document.getElementById('hero');
if (heroSection) {
  heroSection.addEventListener('mousemove', e => {
    const r = heroSection.getBoundingClientRect();
    heroSection.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
    heroSection.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
  });
}

/* ---- 3. COMPTEURS ANIMÉS (count-up) ---- */
const countedEls = new Set();
function initCountUp() {
  document.querySelectorAll('[data-certs-count], [data-badges-count], [data-projects-count]').forEach(el => {
    if (countedEls.has(el)) return;
    const raw = el.textContent.trim();
    const target = parseInt(raw.replace(/\D/g, ''), 10);
    if (isNaN(target)) return;
    countedEls.add(el);
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(el, target);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.6 });
    obs.observe(el);
  });
}
function animateCount(el, target) {
  const duration = 1100;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = `+${Math.round(eased * target)}`;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = `+${target}`;
  }
  requestAnimationFrame(step);
}
initCountUp();

/* ---- 4. LIGNE DE TIMELINE QUI SE DESSINE AU SCROLL ---- */
const timelineEl = document.querySelector('.timeline');
if (timelineEl) {
  const onScrollTimeline = () => {
    const r = timelineEl.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(Math.max((vh - r.top) / (r.height + vh * 0.3), 0), 1);
    timelineEl.style.setProperty('--tl-progress', progress);
  };
  window.addEventListener('scroll', onScrollTimeline, { passive: true });
  onScrollTimeline();
}

/* ---- 5. EFFET MAGNÉTIQUE SUR LES BOUTONS PRINCIPAUX ---- */
document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.3 - 2}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});
