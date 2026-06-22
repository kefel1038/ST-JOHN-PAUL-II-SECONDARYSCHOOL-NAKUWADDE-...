'use strict';

const SUPABASE_URL = 'https://hwifjctgavrhnjqrrvkf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aWZqY3RnYXZyaG5qcXJydmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODc1MTAsImV4cCI6MjA2NDg2MzUxMH0.4X8fg0j6hnmhkNFHhTfM2rAu7kPwJ3_OABQ2vNMj3Pk';

const $ = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

let allResources = [];
let currentView = 'grid';
let favorites = JSON.parse(localStorage.getItem('jp2_library_favs') || '[]');

/* Curated external resources from free online libraries */
const externalResources = [
  { id: -1,  title: 'College Algebra (OpenStax)', author: 'OpenStax', subject: 'Mathematics', class_level: 'S.5', category: 'Textbook', description: 'Free, peer-reviewed textbook covering algebra fundamentals, equations, functions, and more.', file_url: 'https://openstax.org/details/books/college-algebra', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -2,  title: 'Algebra & Trigonometry (OpenStax)', author: 'OpenStax', subject: 'Mathematics', class_level: 'S.5', category: 'Textbook', description: 'Comprehensive textbook covering algebra and trigonometry for advanced secondary students.', file_url: 'https://openstax.org/details/books/algebra-and-trigonometry', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -3,  title: 'Precalculus (OpenStax)', author: 'OpenStax', subject: 'Mathematics', class_level: 'S.6', category: 'Textbook', description: 'Free precalculus textbook covering functions, trigonometry, sequences, and more.', file_url: 'https://openstax.org/details/books/precalculus', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -4,  title: 'Calculus Volume 1 (OpenStax)', author: 'OpenStax', subject: 'Mathematics', class_level: 'S.6', category: 'Textbook', description: 'First in a three-volume series covering limits, derivatives, integration, and applications.', file_url: 'https://openstax.org/details/books/calculus-volume-1', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -5,  title: 'College Physics (OpenStax)', author: 'OpenStax', subject: 'Physics', class_level: 'S.5', category: 'Textbook', description: 'Free physics textbook covering mechanics, thermodynamics, electromagnetism, optics, and modern physics.', file_url: 'https://openstax.org/details/books/college-physics', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -6,  title: 'University Physics Volume 1 (OpenStax)', author: 'OpenStax', subject: 'Physics', class_level: 'S.6', category: 'Textbook', description: 'Advanced physics covering mechanics, waves, acoustics, and thermodynamics.', file_url: 'https://openstax.org/details/books/university-physics-volume-1', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -7,  title: 'University Physics Volume 2 (OpenStax)', author: 'OpenStax', subject: 'Physics', class_level: 'S.6', category: 'Textbook', description: 'Electricity, magnetism, optics, and modern physics for advanced learners.', file_url: 'https://openstax.org/details/books/university-physics-volume-2', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -8,  title: 'University Physics Volume 3 (OpenStax)', author: 'OpenStax', subject: 'Physics', class_level: 'S.6', category: 'Textbook', description: 'Modern physics including quantum mechanics, atomic physics, and relativity.', file_url: 'https://openstax.org/details/books/university-physics-volume-3', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -9,  title: 'Chemistry 2e (OpenStax)', author: 'OpenStax', subject: 'Chemistry', class_level: 'S.5', category: 'Textbook', description: 'Free chemistry textbook covering atomic structure, bonding, reactions, thermodynamics, and more.', file_url: 'https://openstax.org/details/books/chemistry-2e', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -10, title: 'Chemistry: Atoms First 2e (OpenStax)', author: 'OpenStax', subject: 'Chemistry', class_level: 'S.5', category: 'Textbook', description: 'Atoms-first approach to general chemistry for advanced secondary students.', file_url: 'https://openstax.org/details/books/chemistry-atoms-first-2e', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -11, title: 'Biology 2e (OpenStax)', author: 'OpenStax', subject: 'Biology', class_level: 'S.5', category: 'Textbook', description: 'Comprehensive free biology textbook covering cell biology, genetics, evolution, ecology, and more.', file_url: 'https://openstax.org/details/books/biology-2e', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -12, title: 'Anatomy & Physiology (OpenStax)', author: 'OpenStax', subject: 'Biology', class_level: 'S.6', category: 'Textbook', description: 'Detailed coverage of human anatomy and physiology for health sciences.', file_url: 'https://openstax.org/details/books/anatomy-and-physiology', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -13, title: 'Microbiology (OpenStax)', author: 'OpenStax', subject: 'Biology', class_level: 'S.6', category: 'Textbook', description: 'Free microbiology textbook covering microbes, immunity, diseases, and applications.', file_url: 'https://openstax.org/details/books/microbiology', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -14, title: 'Introduction to Computer Science (OpenStax)', author: 'OpenStax', subject: 'ICT', class_level: 'S.5', category: 'Textbook', description: 'Free textbook covering computing fundamentals, programming, and problem solving.', file_url: 'https://openstax.org/details/books/introduction-computer-science', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -15, title: 'Principles of Economics 2e (OpenStax)', author: 'OpenStax', subject: 'Entrepreneurship', class_level: 'S.5', category: 'Textbook', description: 'Free economics textbook covering supply and demand, markets, macroeconomics, and trade.', file_url: 'https://openstax.org/details/books/principles-economics-2e', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -16, title: 'Principles of Microeconomics (OpenStax)', author: 'OpenStax', subject: 'Entrepreneurship', class_level: 'S.6', category: 'Textbook', description: 'Microeconomics textbook covering market theory, consumer behavior, and business strategy.', file_url: 'https://openstax.org/details/books/principles-microeconomics', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -17, title: 'Psychology 2e (OpenStax)', author: 'OpenStax', subject: 'CRE', class_level: 'S.5', category: 'Textbook', description: 'Free psychology textbook covering human behavior, development, and mental processes.', file_url: 'https://openstax.org/details/books/psychology-2e', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -18, title: 'U.S. History (OpenStax)', author: 'OpenStax', subject: 'History', class_level: 'S.5', category: 'Textbook', description: 'Comprehensive free US history textbook from colonization to modern era.', file_url: 'https://openstax.org/details/books/us-history', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -19, title: 'World History Volume 1 (OpenStax)', author: 'OpenStax', subject: 'History', class_level: 'S.5', category: 'Textbook', description: 'World history from prehistory to 1500 AD, covering major civilizations and global connections.', file_url: 'https://openstax.org/details/books/world-history-volume-1', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -20, title: 'World History Volume 2 (OpenStax)', author: 'OpenStax', subject: 'History', class_level: 'S.6', category: 'Textbook', description: 'World history from 1400 to present, covering global change, conflict, and connection.', file_url: 'https://openstax.org/details/books/world-history-volume-2', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -21, title: 'Geography (Internet Archive Collection)', author: 'Internet Archive', subject: 'Geography', class_level: 'All Levels', category: 'Textbook', description: 'Curated collection of free geography books and atlases from the Internet Archive.', file_url: 'https://archive.org/search?query=geography+textbook', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -22, title: 'Literature & Fiction (Gutenberg)', author: 'Project Gutenberg', subject: 'Literature', class_level: 'All Levels', category: 'Textbook', description: 'Over 70,000 free classic novels, poetry, drama, and literary works.', file_url: 'https://www.gutenberg.org/ebooks/bookshelf/215', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -23, title: 'English Literature (Gutenberg)', author: 'Project Gutenberg', subject: 'English', class_level: 'All Levels', category: 'Textbook', description: 'Free classic English novels, poetry, and plays from Project Gutenberg.', file_url: 'https://www.gutenberg.org/ebooks/subject/1', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -24, title: 'Agriculture Books (Internet Archive)', author: 'Internet Archive', subject: 'Agriculture', class_level: 'All Levels', category: 'Textbook', description: 'Free agriculture, farming, and agribusiness textbooks and resources.', file_url: 'https://archive.org/search?query=agriculture+textbook', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -25, title: 'Kiswahili Resources (Internet Archive)', author: 'Internet Archive', subject: 'Kiswahili', class_level: 'All Levels', category: 'Textbook', description: 'Free Kiswahili language learning books and dictionaries.', file_url: 'https://archive.org/search?query=kiswahili+language', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -26, title: 'C.R.E & Religious Studies (Archive)', author: 'Internet Archive', subject: 'CRE', class_level: 'All Levels', category: 'Textbook', description: 'Free religious studies and Christian education resources.', file_url: 'https://archive.org/search?query=religious+studies+textbook', file_type: 'external', cover_url: '', download_count: 0 },
  { id: -27, title: 'Science Textbooks (OpenStax)', author: 'OpenStax', subject: 'Physics', class_level: 'S.4', category: 'Textbook', description: 'Free introductory physics textbook covering basic mechanics, energy, waves, and electricity.', file_url: 'https://openstax.org/details/books/physics', file_type: 'external', cover_url: '', download_count: 0 },
];

/* Init */
document.addEventListener('DOMContentLoaded', () => {
  loadResources();
  setupFilters();
  setupSearch();
  setupViewToggle();
  setupModal();
  setupBackToTop();
});

/* Load resources from API and merge with external */
function loadResources() {
  showLoading(true);
  const params = new URLSearchParams();
  const subject = $('#filterSubject')?.value;
  const classLevel = $('#filterClass')?.value;
  const category = $('#filterCategory')?.value;
  const search = $('#librarySearch')?.value.trim();

  if (subject && subject !== 'all') params.set('subject', subject);
  if (classLevel && classLevel !== 'all') params.set('class_level', classLevel);
  if (category && category !== 'all') params.set('category', category);
  if (search) params.set('search', search);

  const url = `/api/library${params.toString() ? '?' + params.toString() : ''}`;

  Promise.all([
    fetch(url).then(r => r.json()).catch(() => []),
    Promise.resolve(filterExternal(subject, classLevel, category, search))
  ])
  .then(([dbResources, extResults]) => {
    allResources = [...extResults, ...(dbResources || [])];
    showLoading(false);
    renderResources(allResources);
  })
  .catch(err => {
    console.error('Library load error:', err);
    allResources = filterExternal(
      $('#filterSubject')?.value,
      $('#filterClass')?.value,
      $('#filterCategory')?.value,
      $('#librarySearch')?.value.trim()
    );
    showLoading(false);
    renderResources(allResources);
  });
}

/* Filter external resources */
function filterExternal(subject, classLevel, category, search) {
  let results = [...externalResources];

  if (subject && subject !== 'all') {
    results = results.filter(r => r.subject === subject);
  }
  if (classLevel && classLevel !== 'all') {
    results = results.filter(r => r.class_level === 'All Levels' || r.class_level === classLevel);
  }
  if (category && category !== 'all') {
    results = results.filter(r => r.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  }

  return results;
}

/* Render resources */
function renderResources(resources) {
  const grid = $('#libraryGrid');
  const empty = $('#libraryEmpty');
  const count = $('#libraryCount');

  if (!grid) return;

  if (!resources || resources.length === 0) {
    grid.innerHTML = '';
    showEmpty(true);
    count.textContent = '0 resources found';
    return;
  }

  showEmpty(false);
  count.textContent = `${resources.length} resource${resources.length !== 1 ? 's' : ''} found`;

  grid.innerHTML = resources.map(r => {
    const isExternal = r.file_type === 'external';
    const isFav = favorites.includes(r.id);
    const coverHtml = r.cover_url
      ? `<img src="${r.cover_url}" alt="${escapeHtml(r.title)}" loading="lazy" />`
      : `<i class="fas ${isExternal ? 'fa-external-link-alt' : 'fa-book'}"></i>`;

    return `
      <div class="library-card" data-id="${r.id}" ${isExternal ? 'data-external="true"' : ''}>
        <div class="library-card-cover">${coverHtml}</div>
        <div class="library-card-body">
          <div class="library-card-badges">
            <span class="library-card-badge subject">${escapeHtml(r.subject)}</span>
            <span class="library-card-badge class">${escapeHtml(r.class_level)}</span>
            <span class="library-card-badge ${isExternal ? 'external' : 'category'}">${isExternal ? 'Free Online' : escapeHtml(r.category)}</span>
          </div>
          <h3 class="library-card-title">${escapeHtml(r.title)}</h3>
          <p class="library-card-author">${escapeHtml(r.author)}</p>
          <p class="library-card-desc">${escapeHtml(r.description || 'No description available.')}</p>
          <div class="library-card-footer">
            <span class="library-card-downloads">${isExternal ? '<i class="fas fa-globe"></i> Free Online' : `<i class="fas fa-download"></i> ${r.download_count || 0}`}</span>
            <div class="library-card-actions">
              ${isExternal
                ? `<button class="library-card-btn external-link" data-external-link="${r.id}" title="Open in new tab"><i class="fas fa-external-link-alt"></i> Open</button>`
                : `<button class="library-card-btn fav ${isFav ? 'active' : ''}" data-fav="${r.id}" title="${isFav ? 'Remove from Favorites' : 'Save to Favorites'}">
                    <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                  </button>
                  <button class="library-card-btn preview" data-preview="${r.id}" title="Preview Online"><i class="fas fa-eye"></i></button>
                  <button class="library-card-btn download" data-download="${r.id}" title="Download"><i class="fas fa-download"></i></button>`
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  /* Attach events */
  $$('.library-card').forEach(card => {
    const id = parseInt(card.dataset.id);
    const isExternal = card.dataset.external === 'true';

    if (isExternal) {
      const linkBtn = card.querySelector('[data-external-link]');
      linkBtn?.addEventListener('click', e => {
        e.stopPropagation();
        openExternal(id);
      });
      card.addEventListener('click', () => openExternal(id));
    } else {
      const previewBtn = card.querySelector('[data-preview]');
      const downloadBtn = card.querySelector('[data-download]');
      const favBtn = card.querySelector('[data-fav]');

      previewBtn?.addEventListener('click', e => { e.stopPropagation(); openPreview(id); });
      downloadBtn?.addEventListener('click', e => { e.stopPropagation(); downloadResource(id); });
      favBtn?.addEventListener('click', e => { e.stopPropagation(); toggleFav(id, favBtn); });
      card.addEventListener('click', () => openPreview(id));
    }
  });
}

/* Open external resource in new tab */
function openExternal(id) {
  const resource = getResource(id);
  if (!resource || !resource.file_url) return;
  window.open(resource.file_url, '_blank', 'noopener');
}

/* Get resource by ID */
function getResource(id) {
  return allResources.find(r => r.id === id);
}

/* Open PDF preview modal */
function openPreview(id) {
  const resource = getResource(id);
  if (!resource || !resource.file_url) return;

  const modal = $('#pdfModal');
  const viewer = $('#pdfViewer');
  const title = $('#pdfModalTitle');
  const favBtn = $('#pdfModalFav');
  const downloadBtn = $('#pdfModalDownload');

  if (!modal || !viewer) return;

  title.textContent = resource.title;
  viewer.src = resource.file_url;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const isFav = favorites.includes(resource.id);
  favBtn.innerHTML = isFav ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
  favBtn.className = 'library-modal-btn' + (isFav ? ' fav-active' : '');
  favBtn.onclick = () => toggleFav(resource.id, favBtn);

  downloadBtn.className = 'library-modal-btn download-btn';
  downloadBtn.onclick = () => downloadResource(resource.id);
}

/* Close modal */
function closeModal() {
  const modal = $('#pdfModal');
  const viewer = $('#pdfViewer');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  if (viewer) viewer.src = '';
}

/* Download resource and track count */
function downloadResource(id) {
  const resource = getResource(id);
  if (!resource || !resource.file_url) return;

  fetch(`/api/library?id=${id}`, { method: 'PATCH' }).catch(() => {});

  const a = document.createElement('a');
  a.href = resource.file_url;
  a.download = resource.title.replace(/\s+/g, '_') + '.pdf';
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToast('Download started!');

  resource.download_count = (resource.download_count || 0) + 1;
  const card = $(`.library-card[data-id="${id}"]`);
  if (card) {
    const countEl = card.querySelector('.library-card-downloads');
    if (countEl) countEl.innerHTML = `<i class="fas fa-download"></i> ${resource.download_count}`;
  }
}

/* Favorites toggle */
function toggleFav(id, btn) {
  const idx = favorites.indexOf(id);
  if (idx > -1) {
    favorites.splice(idx, 1);
    if (btn) { btn.innerHTML = '<i class="far fa-heart"></i>'; btn.classList.remove('active'); }
  } else {
    favorites.push(id);
    if (btn) { btn.innerHTML = '<i class="fas fa-heart"></i>'; btn.classList.add('active'); }
  }
  localStorage.setItem('jp2_library_favs', JSON.stringify(favorites));
  showToast(idx > -1 ? 'Removed from Favorites' : 'Saved to Favorites');
}

/* Filters */
function setupFilters() {
  ['filterSubject', 'filterClass', 'filterCategory'].forEach(id => {
    $(`#${id}`)?.addEventListener('change', () => {
      showLoading(true);
      loadResources();
    });
  });

  $('#filterClear')?.addEventListener('click', () => {
    $('#filterSubject').value = 'all';
    $('#filterClass').value = 'all';
    $('#filterCategory').value = 'all';
    $('#librarySearch').value = '';
    loadResources();
  });
}

/* Search */
let searchTimeout;
function setupSearch() {
  $('#librarySearch')?.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      showLoading(true);
      loadResources();
    }, 400);
  });
}

/* View toggle */
function setupViewToggle() {
  $$('.library-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.library-view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      const grid = $('#libraryGrid');
      if (grid) {
        grid.classList.toggle('list-view', currentView === 'list');
      }
    });
  });
}

/* Modal controls */
function setupModal() {
  $('#pdfModalClose')?.addEventListener('click', closeModal);
  $('#pdfModalOverlay')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

/* Loading / Empty */
function showLoading(show) {
  const loading = $('#libraryLoading');
  const grid = $('#libraryGrid');
  const empty = $('#libraryEmpty');
  if (loading) loading.style.display = show ? 'block' : 'none';
  if (grid) grid.style.display = show ? 'none' : '';
  if (empty) empty.style.display = 'none';
}

function showEmpty(show) {
  const empty = $('#libraryEmpty');
  const grid = $('#libraryGrid');
  const loading = $('#libraryLoading');
  if (empty) empty.style.display = show ? 'block' : 'none';
  if (grid) grid.style.display = show ? 'none' : '';
  if (loading) loading.style.display = 'none';
}

/* Scroll */
function setupBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  });
  btn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* Toast */
function showToast(msg, duration = 3000) {
  const toast = $('#toast');
  const toastMsg = $('#toastMsg');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, duration);
}

/* Escape HTML */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
