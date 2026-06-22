'use strict';

const SUPABASE_URL = 'https://hwifjctgavrhnjqrrvkf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aWZqY3RnYXZyaG5qcXJydmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODc1MTAsImV4cCI6MjA2NDg2MzUxMH0.4X8fg0j6hnmhkNFHhTfM2rAu7kPwJ3_OABQ2vNMj3Pk';

const $ = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

let authToken = localStorage.getItem('jp2_admin_token');
let resources = [];

/* DOM Ready */
document.addEventListener('DOMContentLoaded', () => {
  if (authToken) {
    showDashboard();
    loadResources();
  }
  setupLogin();
  setupUpload();
  setupLogout();
});

/* Supabase client (direct fetch) */
function supabaseRequest(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(`${SUPABASE_URL}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
}

/* Login */
function setupLogin() {
  $('#loginForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const email = $('#loginEmail').value;
    const password = $('#loginPassword').value;
    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    btn.disabled = true;

    try {
      const res = await supabaseRequest('POST', '/auth/v1/token?grant_type=password', { email, password });
      const data = await res.json();

      if (data.access_token) {
        authToken = data.access_token;
        localStorage.setItem('jp2_admin_token', authToken);
        showDashboard();
        loadResources();
      } else {
        showLoginError(data.error_description || data.error || 'Invalid credentials');
      }
    } catch (err) {
      showLoginError('Connection error. Please try again.');
    }

    btn.innerHTML = orig;
    btn.disabled = false;
  });
}

function showLoginError(msg) {
  const el = $('#loginError');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

/* Dashboard */
function showDashboard() {
  $('#adminLogin').style.display = 'none';
  $('#adminDashboard').style.display = 'block';
  const email = localStorage.getItem('jp2_admin_email') || '';
  $('#adminUserEmail').textContent = email;
}

/* Logout */
function setupLogout() {
  $('#logoutBtn')?.addEventListener('click', () => {
    authToken = null;
    localStorage.removeItem('jp2_admin_token');
    localStorage.removeItem('jp2_admin_email');
    $('#adminDashboard').style.display = 'none';
    $('#adminLogin').style.display = 'flex';
    $('#loginEmail').value = '';
    $('#loginPassword').value = '';
  });
}

/* Upload */
function setupUpload() {
  $('#uploadForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = $('#uploadBtn');
    const msg = $('#uploadMsg');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    btn.disabled = true;
    msg.textContent = '';

    const title = $('#resTitle').value.trim();
    const author = $('#resAuthor').value.trim() || 'St. John Paul II SS Nakuwadde';
    const subject = $('#resSubject').value;
    const classLevel = $('#resClass').value;
    const category = $('#resCategory').value;
    const description = $('#resDesc').value.trim();
    const file = $('#resFile').files[0];

    if (!title || !subject || !file) {
      msg.textContent = 'Please fill required fields';
      btn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload Resource';
      btn.disabled = false;
      return;
    }

    try {
      /* Upload file to Supabase Storage */
      const filePath = `resources/${Date.now()}_${Math.random().toString(36).slice(2)}.pdf`;
      const fileFormData = new FormData();
      fileFormData.append('file', file);

      const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/library/${filePath}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'x-upsert': 'false'
        },
        body: file
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.error || 'File upload failed');
      }

      const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/library/${filePath}`;

      /* Upload cover if provided */
      let coverUrl = '';
      const coverFile = $('#resCover').files[0];
      if (coverFile) {
        const coverPath = `covers/${Date.now()}_${Math.random().toString(36).slice(2)}.${coverFile.name.split('.').pop()}`;
        const coverRes = await fetch(`${SUPABASE_URL}/storage/v1/object/library/${coverPath}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'x-upsert': 'false'
          },
          body: coverFile
        });
        if (coverRes.ok) {
          coverUrl = `${SUPABASE_URL}/storage/v1/object/public/library/${coverPath}`;
        }
      }

      /* Insert record via API */
      const apiRes = await fetch('/api/library', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title, author, subject,
          class_level: classLevel,
          category,
          description,
          file_url: fileUrl,
          file_type: 'pdf',
          cover_url: coverUrl
        })
      });

      const result = await apiRes.json();
      if (!apiRes.ok) throw new Error(result.error || 'Failed to create record');

      msg.textContent = 'Uploaded successfully!';
      msg.style.color = 'var(--success)';
      $('#uploadForm').reset();
      loadResources();

    } catch (err) {
      msg.textContent = err.message;
      msg.style.color = 'var(--danger)';
    }

    btn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload Resource';
    btn.disabled = false;
  });
}

/* Load resources */
function loadResources() {
  const loading = $('#adminLoading');
  const tableWrap = $('#adminTableWrap');
  const empty = $('#adminEmpty');
  const tbody = $('#resourcesBody');
  const count = $('#resourcesCount');

  if (loading) loading.style.display = 'block';
  if (tableWrap) tableWrap.style.display = 'none';
  if (empty) empty.style.display = 'none';

  fetch('/api/library')
    .then(res => res.json())
    .then(data => {
      resources = data || [];
      if (loading) loading.style.display = 'none';

      if (resources.length === 0) {
        if (empty) empty.style.display = 'block';
        if (tableWrap) tableWrap.style.display = 'none';
        if (count) count.textContent = '0 resources';
        return;
      }

      if (tableWrap) tableWrap.style.display = 'block';
      if (count) count.textContent = `${resources.length} resource${resources.length !== 1 ? 's' : ''}`;
      renderTable(resources);
    })
    .catch(err => {
      console.error('Load error:', err);
      if (loading) loading.textContent = 'Failed to load resources.';
    });
}

/* Render table */
function renderTable(data) {
  const tbody = $('#resourcesBody');
  if (!tbody) return;

  tbody.innerHTML = data.map(r => `
    <tr data-id="${r.id}">
      <td class="title-cell" title="${escapeHtml(r.title)}">${escapeHtml(r.title)}</td>
      <td class="badge-cell"><span class="badge-subject">${escapeHtml(r.subject)}</span></td>
      <td class="badge-cell"><span class="badge-class">${escapeHtml(r.class_level)}</span></td>
      <td class="badge-cell"><span class="badge-category">${escapeHtml(r.category)}</span></td>
      <td>${r.download_count || 0}</td>
      <td>${formatDate(r.created_at)}</td>
      <td class="actions-cell">
        <button class="action-btn" onclick="editResource(${r.id})"><i class="fas fa-edit"></i> Edit</button>
        <button class="action-btn danger" onclick="deleteResource(${r.id})"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

/* Edit */
function editResource(id) {
  const r = resources.find(x => x.id === id);
  if (!r) return;

  const title = prompt('Title:', r.title);
  if (!title) return;
  const subject = prompt('Subject:', r.subject);
  if (!subject) return;
  const classLevel = prompt('Class Level:', r.class_level);
  const category = prompt('Category:', r.category);
  const description = prompt('Description:', r.description || '');

  fetch('/api/library', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      id: r.id, title, subject,
      class_level: classLevel || r.class_level,
      category: category || r.category,
      description: description || r.description
    })
  })
  .then(res => res.json())
  .then(() => {
    showToast('Resource updated');
    loadResources();
  })
  .catch(err => showToast('Update failed: ' + err.message));
}

/* Delete */
function deleteResource(id) {
  if (!confirm('Delete this resource permanently?')) return;

  fetch(`/api/library?id=${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(res => res.json())
  .then(() => {
    showToast('Resource deleted');
    loadResources();
  })
  .catch(err => showToast('Delete failed: ' + err.message));
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

/* Helpers */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-UG', { month: 'short', day: 'numeric', year: 'numeric' });
}
