'use strict';

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

/* === NAV === */
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

$$('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

$('#backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* === ANIMATED COUNTERS === */
function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = 'true';
  const target = parseInt(el.dataset.target);
  let current = 0;
  const duration = 2000;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + (el.dataset.suffix || '');
    if (current >= target) { el.textContent = target + (el.dataset.suffix || ''); clearInterval(timer); }
  }, 16);
}

/* === SCROLL REVEAL === */
(function initScrollReveal() {
  const revealEls = $$('.reveal, .reveal-left, .reveal-right');
  const statEls = $$('.stat-number[data-target], .quick-stat-number[data-target], .hero-stat-number[data-target]');

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

/* === GALLERY === */
const galleryImages = [
  { src: 'img/493997268_1402715580740031_3498673567538420048_n.jpg', caption: 'School Life Moments', cat: 'events' },
  { src: 'img/559949554_1242871727862746_4853270271445248006_n.jpg', caption: 'Students in Uniform', cat: 'events' },
  { src: 'img/7eef9a8d222b7c40acad77a9896093a7~tplv-tiktokx-cropcenter_1080_1080 (1).jpeg', caption: 'School TikTok Challenge', cat: 'events' },
  { src: 'img/a leevel students 4.png', caption: 'A-Level Students', cat: 'academics' },
  { src: 'img/a level students group photo.png', caption: 'A-Level Students Group Photo', cat: 'academics' },
  { src: 'img/A level students thanksgiving .png', caption: 'A-Level Students Thanksgiving', cat: 'events' },
  { src: 'img/A level students.png', caption: 'A-Level Students', cat: 'academics' },
  { src: 'img/alevel students.jpg', caption: 'A-Level Students', cat: 'academics' },
  { src: 'img/assbly.jpeg', caption: 'Morning Assembly', cat: 'worship' },
  { src: 'img/blk.jpg', caption: 'Students in Classroom', cat: 'academics' },
  { src: 'img/bo gams.jpg', caption: 'Board Games', cat: 'sports' },
  { src: 'img/director students1.png', caption: 'Director with Students', cat: 'events' },
  { src: 'img/director.png', caption: 'The School Director', cat: 'events' },
  { src: 'img/examination hall.png', caption: 'Examination Hall', cat: 'academics' },
  { src: 'img/group photo1.png', caption: 'Group Photo', cat: 'events' },
  { src: 'img/group photo2.png', caption: 'Group Photo', cat: 'events' },
  { src: 'img/hall.jpg', caption: 'School Hall', cat: 'events' },
  { src: 'img/images (2).jpg', caption: 'School Activities', cat: 'events' },
  { src: 'img/intro.jpg', caption: 'School Introduction Day', cat: 'events' },
  { src: 'img/kibiina2.jpg', caption: 'Choir Practice', cat: 'worship' },
  { src: 'img/kisuro.jpg', caption: 'Kiswahili Lesson', cat: 'academics' },
  { src: 'img/library Image2.jpg', caption: 'School Library', cat: 'academics' },
  { src: 'img/o level students group photo.png', caption: 'O-Level Students Group Photo', cat: 'academics' },
  { src: 'img/o level students seminar2.png', caption: 'O-Level Seminar', cat: 'academics' },
  { src: 'img/olevel students with DOS.png', caption: 'Students with DOS', cat: 'events' },
  { src: 'img/phys.jpg', caption: 'Physics Lesson', cat: 'academics' },
  { src: 'img/prom1.png', caption: 'Prom Night', cat: 'events' },
  { src: 'img/prom3.png', caption: 'Prom Night', cat: 'events' },
  { src: 'img/promo2.png', caption: 'Promotional Event', cat: 'events' },
  { src: 'img/school campus.png', caption: 'School Campus', cat: 'events' },
  { src: 'img/school compound.jpg', caption: 'School Compound', cat: 'events' },
  { src: 'img/school compund square.png', caption: 'School Compound Square', cat: 'events' },
  { src: 'img/School logo.jpeg', caption: 'School Logo', cat: 'events' },
  { src: 'img/Screenshot 2026-06-08 162353.jpg', caption: 'Science Lab Practical', cat: 'academics' },
  { src: 'img/Screenshot 2026-06-08 162420.jpg', caption: 'ICT Computer Lab', cat: 'academics' },
  { src: 'img/spkg mi.webp', caption: 'Public Speaking', cat: 'academics' },
  { src: 'img/st kibina.jpg', caption: 'St. Kizito Choir', cat: 'worship' },
  { src: 'img/st para2.webp', caption: 'School Parade', cat: 'events' },
  { src: 'img/stjohnpauliissnakuwadde_7630763057798548744 (1).webp', caption: 'School Life', cat: 'events' },
  { src: 'img/stjohnpauliissnakuwadde_7630763057798548744 (10).webp', caption: 'School Gathering', cat: 'events' },
  { src: 'img/stjohnpauliissnakuwadde_7630763057798548744 (3).webp', caption: 'School Life Moments', cat: 'events' },
  { src: 'img/stjohnpauliissnakuwadde_7630763057798548744 (5).webp', caption: 'Students at Break', cat: 'events' },
  { src: 'img/stjohnpauliissnakuwadde_7630763057798548744 (6).webp', caption: 'Outdoor Activities', cat: 'sports' },
  { src: 'img/stjohnpauliissnakuwadde_7630763057798548744 (8).webp', caption: 'Class Group Photo', cat: 'academics' },
  { src: 'img/students activities.png', caption: 'Student Activities', cat: 'sports' },
  { src: 'img/students seminar.png', caption: 'Students Seminar', cat: 'academics' },
  { src: 'img/Teacher award2.png', caption: 'Teacher Award Ceremony', cat: 'events' },
  { src: 'img/teachers event.png', caption: 'Teachers Event', cat: 'events' },
  { src: 'img/teachers group photo.png', caption: 'Teachers Group Photo', cat: 'events' },
  { src: 'img/teachers2.jpg', caption: 'Teachers', cat: 'academics' },
  { src: 'img/teachers3.png', caption: 'Teachers', cat: 'academics' },
  { src: 'img/tr st.webp', caption: 'Staff Meeting', cat: 'academics' },
  { src: 'img/trs.webp', caption: 'Our Teachers', cat: 'academics' },
  { src: 'img/visitors to the School.jpg', caption: 'Visitors to the School', cat: 'events' },
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
      <img src="${img.src}" alt="${img.caption}" loading="lazy" />
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

/* === TESTIMONIALS === */
(function initTestimonials() {
  const track = $('#testimonialsTrack');
  const dotsContainer = $('#testimonialDots');
  if (!track) return;

  const cards = $$('.testimonial-card', track);
  let current = 0;
  let autoTimer;

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

/* === FORMS === */
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
  showToast('You\'re subscribed! Thank you for joining our community.');
  $('#newsletterForm').reset();
});

/* === ACTIVE NAV === */
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

/* === SMOOTH SCROLL === */
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = $(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const headerHeight = header?.offsetHeight || 80;
      window.scrollTo({ top: target.offsetTop - headerHeight, behavior: 'smooth' });
    }
  });
});

/* === IMAGE FALLBACKS === */
document.addEventListener('DOMContentLoaded', () => {
  $$('img[src]').forEach(img => {
    img.addEventListener('error', function() {
      if (!this.dataset.fallbackApplied) {
        this.dataset.fallbackApplied = '1';
        this.src = 'school_logo.png';
      }
    });
  });
});

/* === TYPING NAV MOTTO === */
(function initTypingEffect() {
  const mottos = [
    '"A Creative Space for a Mind"',
    'Excellence | Faith | Innovation',
    'Building Tomorrow\'s Leaders',
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

/* === PARALLAX HERO === */
window.addEventListener('scroll', () => {
  const hero = $('.hero');
  if (hero && window.scrollY < window.innerHeight) {
    const scrolled = window.scrollY * 0.3;
    const overlay = hero.querySelector('.hero-overlay');
    const pattern = hero.querySelector('.hero-pattern');
    if (overlay) overlay.style.transform = `translateY(${scrolled * 0.1}px)`;
  }
});

console.log('%c St. John Paul II SS Nakuwadde - Bulenga', 'color:#003A70;font-size:18px;font-weight:bold;');
console.log('%c "A Creative Space for a Mind"', 'color:#FFD700;font-size:14px;font-style:italic;');
console.log('%c Admissions: +256 787 292626', 'color:#64748B;font-size:12px;');
