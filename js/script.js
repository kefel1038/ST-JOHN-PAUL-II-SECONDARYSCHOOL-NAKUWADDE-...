/* ============================================================
   ST. JOHN PAUL II SECONDARY SCHOOL - NAKUWADDE
   Main JavaScript | Interactions, Animations, Dynamic Content
   ============================================================ */

'use strict';

/* ===== UTILITY ===== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function showToast(msg, duration = 3500) {
  const toast = $('#toast');
  const toastMsg = $('#toastMsg');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(100px)'; }, duration);
}

/* ===== NAVIGATION ===== */
const header = $('#header');
const hamburger = $('#hamburger');
const navMenu = $('#navMenu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header?.classList.add('scrolled');
    $('#backToTop')?.classList.add('visible');
  } else {
    header?.classList.remove('scrolled');
    $('#backToTop')?.classList.remove('visible');
  }
});

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu?.classList.toggle('open');
  document.body.style.overflow = navMenu?.classList.contains('open') ? 'hidden' : '';
});

// Close menu on nav link click (mobile)
$$('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Back to top
$('#backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== HERO SLIDER ===== */
(function initHeroSlider() {
  const slides = $$('.hero-slide');
  const controlsEl = $('#heroControls');
  if (!slides.length || !controlsEl) return;

  let current = 0;
  let autoTimer;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    controlsEl.appendChild(dot);
  });

  function goTo(idx) {
    slides[current].classList.remove('active');
    $$('.hero-dot')[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    $$('.hero-dot')[current]?.classList.add('active');
  }

  function next() { goTo(current + 1); }

  autoTimer = setInterval(next, 5500);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(autoTimer);
    else autoTimer = setInterval(next, 5500);
  });
})();

/* ===== HERO STAT COUNTERS (on load) ===== */
(function initHeroCounters() {
  const els = $$('.hero-stat-value[data-count]');
  els.forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + (el.dataset.suffix || '');
      if (current >= target) clearInterval(timer);
    }, 30);
  });
})();

/* ===== ANIMATED STAT COUNTERS (scroll reveal) ===== */
function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = 'true';
  const target = parseInt(el.dataset.target);
  const suffix = el.innerHTML.match(/<span[^>]*>(.*?)<\/span>/)?.[0] || '';
  let current = 0;
  const duration = 1800;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.innerHTML = Math.floor(current) + suffix;
    if (current >= target) { el.innerHTML = target + suffix; clearInterval(timer); }
  }, 16);
}

/* ===== SCROLL REVEAL ===== */
(function initScrollReveal() {
  const revealEls = $$('.reveal, .reveal-left, .reveal-right');
  const statEls = $$('.stat-number[data-target]');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.dataset.target) animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));
  statEls.forEach(el => io.observe(el));
})();

/* ===== ACADEMICS TABS ===== */
(function initAcademicsTabs() {
  const tabs = $$('.tab-btn[data-tab]');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      $$('.tab-content').forEach(c => c.classList.remove('active'));
      const target = $(`#tab-content-${btn.dataset.tab}`);
      target?.classList.add('active');
    });
  });
})();

/* ===== CAMPUS LIFE DATA & TABS ===== */
const campusData = {
  sports: [
    { emoji: '⚽', title: 'Football', desc: 'Our senior football team competes in district and national inter-school tournaments. Boys and girls teams are both active.' },
    { emoji: '🏐', title: 'Netball', desc: 'Netball is a flagship sport at our school. Our girls team has represented Wakiso District in national competitions.' },
    { emoji: '🏃', title: 'Athletics', desc: 'Track and field events including sprints, long jump, and cross-country running. Students compete at district level.' },
    { emoji: '🏐', title: 'Volleyball', desc: 'Indoor and outdoor volleyball for boys and girls, with regular practice sessions and inter-school friendly matches.' },
  ],
  clubs: [
    { emoji: '🎙️', title: 'Debate Club', desc: 'Sharpening critical thinking and public speaking. Our debaters have won district championships and represent the school nationally.' },
    { emoji: '💻', title: 'ICT Club', desc: 'Exploring technology, coding, and digital innovation. Members participate in national tech competitions and hackathons.' },
    { emoji: '✝️', title: 'Scripture Union', desc: 'A faith-based fellowship open to all Christian students for Bible study, prayer, and community service projects.' },
    { emoji: '🌿', title: 'Wildlife Club', desc: 'Environmental awareness, conservation projects, tree planting, and nature education for environmentally conscious students.' },
    { emoji: '💼', title: 'Entrepreneurship Club', desc: 'Students develop and pitch business ideas, run small school enterprises, and learn real-world financial skills.' },
    { emoji: '🎭', title: 'Drama & Arts Club', desc: 'Creative expression through drama, music, fine art, and cultural performances at school and community events.' },
  ],
  boarding: [
    { emoji: '🏠', title: 'Boys Dormitory', desc: 'Comfortable, supervised accommodation for boarding boys with separate study rooms, lockers, and recreational space.' },
    { emoji: '🏡', title: 'Girls Dormitory', desc: 'Safe, well-managed boarding for girls with house mothers on duty 24/7, ensuring a secure home away from home.' },
    { emoji: '🍽️', title: 'Dining Hall', desc: 'Three nutritious meals daily including breakfast, lunch, and supper. Balanced menus planned by our catering team.' },
    { emoji: '📚', title: 'Evening Studies', desc: 'Structured prep time every evening supervised by teachers. Students complete assignments and review daily lessons.' },
  ],
  leadership: [
    { emoji: '👑', title: 'Student Council', desc: 'Elected student government representing all classes. Organises events, mediates student concerns, and develops leadership skills.' },
    { emoji: '🌟', title: 'Prefect Body', desc: 'Class prefects, dormitory prefects, and senior prefects maintain order and bridge communication between students and staff.' },
    { emoji: '🤝', title: 'Community Service', desc: 'Regular outreach to the Nakuwadde community including cleaning drives, hospital visits, and support for vulnerable families.' },
    { emoji: '📣', title: 'Leadership Training', desc: 'Annual leadership camps, guest speakers, and workshops that develop confident, compassionate, and competent future leaders.' },
  ]
};

function renderCampusGrid(tab) {
  const grid = $('#campusGrid');
  if (!grid) return;
  const data = campusData[tab] || [];
  grid.innerHTML = data.map(item => `
    <div class="campus-card">
      <div class="campus-card-img">${item.emoji}</div>
      <div class="campus-card-body">
        <h4 class="campus-card-title">${item.title}</h4>
        <p class="campus-card-desc">${item.desc}</p>
      </div>
    </div>
  `).join('');
}

(function initCampusTabs() {
  renderCampusGrid('sports');
  const campusTabs = $$('[data-campus-tab]');
  campusTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      campusTabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      renderCampusGrid(btn.dataset.campusTab);
    });
  });
})();

/* ===== GALLERY DATA & FILTER ===== */
const galleryImages = [
  { src: 'img/assbly.jpeg', caption: 'School Assembly — Morning Devotion', cat: 'worship' },
  { src: 'img/phys.jpg', caption: 'Students in Physics Lesson', cat: 'academics' },
  { src: 'img/intro.jpg', caption: 'School Introduction Day', cat: 'events' },
  { src: 'img/intro 2.jpg', caption: 'Welcoming New Students', cat: 'events' },
  { src: 'img/hall.jpg', caption: 'School Hall — Gatherings & Events', cat: 'events' },
  { src: 'img/bo gams.jpg', caption: 'Board Games — Students at Play', cat: 'sports' },
  { src: 'img/kisuro.jpg', caption: 'Classroom Session — Kiswahili Lesson', cat: 'academics' },
  { src: 'img/st kibina.jpg', caption: 'St. Kizito Choir Performance', cat: 'worship' },
  { src: 'img/trs.webp', caption: 'Our Dedicated Teachers', cat: 'academics' },
  { src: 'img/tr st.webp', caption: 'Staff Meeting & Planning', cat: 'academics' },
  { src: 'img/spkg mi.webp', caption: 'Student Public Speaking', cat: 'academics' },
  { src: 'img/st para2.webp', caption: 'School Parade', cat: 'events' },
  { src: 'img/school compound.jpg', caption: 'School Compound — Beautiful Campus Views', cat: 'events' },
  { src: 'img/School logo.jpeg', caption: 'St. John Paul II School Logo', cat: 'events' },
  { src: 'img/library Image2.jpg', caption: 'School Library — A Space for Learning', cat: 'academics' },
];

let currentGalleryFilter = 'all';
let lightboxIndex = 0;
let filteredImages = [...galleryImages];

function renderGallery(filter) {
  const grid = $('#galleryGrid');
  if (!grid) return;
  filteredImages = filter === 'all' ? galleryImages : galleryImages.filter(img => img.cat === filter);
  grid.innerHTML = filteredImages.map((img, i) => `
    <div class="gallery-item" data-index="${i}" data-cat="${img.cat}">
      <img src="${img.src}" alt="${img.caption}" loading="lazy" onerror="this.src='hero_classroom.png'" />
      <div class="gallery-overlay">
        <div class="gallery-caption">${img.caption}</div>
      </div>
      <div class="gallery-zoom"><i class="fas fa-expand"></i></div>
    </div>
  `).join('');

  $$('.gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index)));
  });
}

function openLightbox(index) {
  lightboxIndex = index;
  const lb = $('#lightbox');
  const lbImg = $('#lightboxImg');
  const lbCap = $('#lightboxCaption');
  if (!lb || !lbImg) return;
  lbImg.src = filteredImages[index].src;
  lbImg.alt = filteredImages[index].caption;
  if (lbCap) lbCap.textContent = filteredImages[index].caption;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  $('#lightbox')?.classList.remove('active');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  lightboxIndex = (lightboxIndex + dir + filteredImages.length) % filteredImages.length;
  openLightbox(lightboxIndex);
}

(function initGallery() {
  renderGallery('all');

  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGalleryFilter = btn.dataset.filter;
      renderGallery(currentGalleryFilter);
    });
  });

  $('#lightboxClose')?.addEventListener('click', closeLightbox);
  $('#lightboxPrev')?.addEventListener('click', () => lightboxNav(-1));
  $('#lightboxNext')?.addEventListener('click', () => lightboxNav(1));

  $('#lightbox')?.addEventListener('click', e => {
    if (e.target === $('#lightbox')) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!$('#lightbox')?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
  });
})();

/* ===== TESTIMONIALS CAROUSEL ===== */
(function initTestimonials() {
  const track = $('#testimonialsTrack');
  const dotsContainer = $('#testimonialDots');
  if (!track) return;

  const cards = $$('.testimonial-card', track);
  let current = 0;
  let autoTimer;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer?.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    $$('.t-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  $('#testimonialNext')?.addEventListener('click', next);
  $('#testimonialPrev')?.addEventListener('click', prev);

  autoTimer = setInterval(next, 6000);

  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => { autoTimer = setInterval(next, 6000); });
})();

/* ===== FORMS ===== */
function handleForm(formId, successMsg) {
  const form = $(`#${formId}`);
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const origText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    fetch('/api/submit-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        btn.innerHTML = '<i class="fas fa-check"></i> Submitted!';
        btn.style.background = 'var(--success)';
        showToast(successMsg);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    })
    .catch(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Submitted!';
      btn.style.background = 'var(--success)';
      showToast(successMsg);
    })
    .finally(() => {
      setTimeout(() => {
        form.reset();
        btn.innerHTML = origText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    });
  });
}

handleForm('admissionForm', 'Application submitted! We will contact you within 24 hours.');
handleForm('contactForm', 'Message sent successfully! We\'ll be in touch soon.');

$('#newsletterForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const email = $('#newsletterEmail')?.value;
  if (!email) return;
  showToast('🎉 You\'re subscribed! Thank you for joining our community.');
  $('#newsletterForm').reset();
});

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sTop = section.offsetTop - 120;
      if (window.scrollY >= sTop) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href')?.includes(current)) link.classList.add('active');
    });
  });
})();

/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = $(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ===== IMAGE FALLBACKS ===== */
// Use school-provided photos where possible
document.addEventListener('DOMContentLoaded', () => {
  $$('img[src]').forEach(img => {
    img.addEventListener('error', function() {
      if (!this.dataset.fallbackApplied) {
        this.dataset.fallbackApplied = '1';
        this.src = 'hero_classroom.png';
      }
    });
  });
});

/* ===== TYPING ANIMATION FOR MOTTO ===== */
(function initTypingEffect() {
  const mottos = [
    '"A Creative Space for a Mind"',
    'Empowering Future Leaders',
    'Excellence · Faith · Innovation',
    'Skills for Life. Values for Eternity.'
  ];
  const els = $$('.nav-brand-motto');
  if (!els.length) return;
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % mottos.length;
    els.forEach(el => {
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = mottos[idx];
        el.style.opacity = '1';
        el.style.transition = 'opacity 0.5s ease';
      }, 250);
    });
  }, 4000);
})();

/* ===== PARALLAX HERO ===== */
window.addEventListener('scroll', () => {
  const heroSlides = $$('.hero-slide.active');
  heroSlides.forEach(slide => {
    const scrolled = window.scrollY;
    slide.style.transform = `translateY(${scrolled * 0.3}px)`;
  });
});

console.log('%c🎓 St. John Paul II Secondary School Nakuwadde', 'color:#0A2472;font-size:18px;font-weight:bold;');
console.log('%c"A Creative Space for a Mind"', 'color:#C9A84C;font-size:14px;font-style:italic;');
console.log('%cWebsite powered by modern web technology. Admissions: +256 703 262 686', 'color:#64748B;font-size:12px;');
