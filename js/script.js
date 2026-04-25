/* ============================================================
   Life Dashboard — script.js
   Features:
   ✅ Clock & time-based greeting
   ✅ Custom user name (LocalStorage)
   ✅ Focus Timer with custom duration (LocalStorage)
   ✅ To-Do List: add, edit, done, delete, filter, sort (LocalStorage)
   ✅ Prevent duplicate tasks
   ✅ Quick Links with favicon (LocalStorage)
   ✅ Light / Dark mode toggle (LocalStorage)
   ============================================================ */

'use strict';

/* ── Helpers ── */
const $ = (id) => document.getElementById(id);
const DAYS_ID  = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni',
                   'Juli','Agustus','September','Oktober','November','Desember'];

function showToast(msg, duration = 2500) {
  const toast = $('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 350);
  }, duration);
}

function openModal(id) { $(id).classList.remove('hidden'); }
function closeModal(id) { $(id).classList.add('hidden'); }

/* ── LocalStorage helpers ── */
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function load(key, fallback = null) {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

/* ============================================================
   1. CLOCK & GREETING
   ============================================================ */
function getGreeting(hour) {
  if (hour >= 4  && hour < 11) return 'Selamat Pagi ☀️';
  if (hour >= 11 && hour < 15) return 'Selamat Siang 🌤';
  if (hour >= 15 && hour < 19) return 'Selamat Sore 🌇';
  return 'Selamat Malam 🌙';
}

function tickClock() {
  const now  = new Date();
  const h    = String(now.getHours()).padStart(2, '0');
  const m    = String(now.getMinutes()).padStart(2, '0');
  const s    = String(now.getSeconds()).padStart(2, '0');
  $('clock').textContent = `${h}:${m}:${s}`;

  const day   = DAYS_ID[now.getDay()];
  const date  = now.getDate();
  const month = MONTHS_ID[now.getMonth()];
  const year  = now.getFullYear();
  $('dateText').textContent = `${day}, ${date} ${month} ${year}`;
  $('greetingText').textContent = getGreeting(now.getHours());
}

setInterval(tickClock, 1000);
tickClock();

/* ============================================================
   2. USER NAME
   ============================================================ */
function loadName() {
  const name = load('userName', 'Pengguna');
  $('userName').textContent = name;
}

$('btnChangeName').addEventListener('click', () => {
  $('nameInput').value = load('userName', '');
  openModal('modalName');
  setTimeout(() => $('nameInput').focus(), 50);
});

$('btnSaveName').addEventListener('click', () => {
  const name = $('nameInput').value.trim();
  if (!name) { showToast('Nama tidak boleh kosong!'); return; }
  save('userName', name);
  $('userName').textContent = name;
  closeModal('modalName');
  showToast('Nama berhasil disimpan!');
});

$('btnCancelName').addEventListener('click', () => closeModal('modalName'));

$('nameInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') $('btnSaveName').click();
  if (e.key === 'Escape') $('btnCancelName').click();
});

loadName();

/* ============================================================
   3. THEME TOGGLE
   ============================================================ */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  $('themeIcon').textContent = theme === 'dark' ? '☀️' : '🌙';
  save('theme', theme);
}

$('btnTheme').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

applyTheme(load('theme', 'dark'));

/* ============================================================
   4. FOCUS TIMER
   ============================================================ */
let timerInterval = null;
let timerSeconds  = 0;
let timerRunning  = false;

function loadTimerDuration() {
  const saved = load('timerDuration', 25);
  $('timerDuration').value = saved;
  timerSeconds = saved * 60;
  renderTimer();
}

function renderTimer() {
  const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const s = String(timerSeconds % 60).padStart(2, '0');
  $('timerDisplay').textContent = `${m}:${s}`;
}

function startTimer() {
  if (timerRunning) return;
  const dur = parseInt($('timerDuration').value, 10);
  if (!timerSeconds || timerSeconds <= 0) timerSeconds = dur * 60;
  timerRunning = true;
  $('btnStart').disabled = true;
  $('btnStop').disabled  = false;
  $('timerLabel').textContent = 'Sedang berjalan...';
  $('timerDisplay').classList.add('running');
  $('timerDisplay').classList.remove('finished');

  timerInterval = setInterval(() => {
    timerSeconds--;
    renderTimer();
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      $('btnStart').disabled = false;
      $('btnStop').disabled  = true;
      $('timerLabel').textContent = '✅ Waktu habis! Istirahat dulu.';
      $('timerDisplay').classList.remove('running');
      $('timerDisplay').classList.add('finished');
      showToast('⏰ Timer selesai! Waktu istirahat.');
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  $('btnStart').disabled = false;
  $('btnStop').disabled  = true;
  $('timerLabel').textContent = 'Dijeda';
  $('timerDisplay').classList.remove('running');
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  const dur = parseInt($('timerDuration').value, 10) || 25;
  timerSeconds = dur * 60;
  renderTimer();
  $('btnStart').disabled = false;
  $('btnStop').disabled  = true;
  $('timerLabel').textContent = 'Siap mulai';
  $('timerDisplay').classList.remove('running', 'finished');
}

$('btnStart').addEventListener('click', startTimer);
$('btnStop').addEventListener('click', stopTimer);
$('btnReset').addEventListener('click', resetTimer);

$('timerDuration').addEventListener('change', () => {
  const dur = parseInt($('timerDuration').value, 10);
  if (dur < 1 || isNaN(dur)) { $('timerDuration').value = 25; return; }
  save('timerDuration', dur);
  if (!timerRunning) {
    timerSeconds = dur * 60;
    renderTimer();
    $('timerLabel').textContent = 'Siap mulai';
  }
});

loadTimerDuration();

/* ============================================================
   5. TO-DO LIST
   ============================================================ */
let todos       = load('todos', []);
let currentFilter = 'semua';
let sortAsc     = true;
let editingId   = null;

function saveTodos() { save('todos', todos); }

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function renderTodos() {
  const list  = $('todoList');
  const empty = $('todoEmpty');
  list.innerHTML = '';

  let filtered = todos.filter(t => {
    if (currentFilter === 'aktif')   return !t.done;
    if (currentFilter === 'selesai') return  t.done;
    return true;
  });

  if (filtered.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');
    li.dataset.id = todo.id;

    const cb = document.createElement('input');
    cb.type    = 'checkbox';
    cb.checked = todo.done;
    cb.addEventListener('change', () => toggleTodo(todo.id));

    const span = document.createElement('span');
    span.className   = 'todo-text';
    span.textContent = todo.text;

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const btnEdit = document.createElement('button');
    btnEdit.className   = 'btn-todo-action';
    btnEdit.title       = 'Edit';
    btnEdit.textContent = '✏️';
    btnEdit.addEventListener('click', () => openEditModal(todo.id));

    const btnDel = document.createElement('button');
    btnDel.className   = 'btn-todo-action';
    btnDel.title       = 'Hapus';
    btnDel.textContent = '🗑️';
    btnDel.addEventListener('click', () => deleteTodo(todo.id));

    actions.append(btnEdit, btnDel);
    li.append(cb, span, actions);
    list.appendChild(li);
  });
}

function addTodo() {
  const input = $('todoInput');
  const text  = input.value.trim();
  if (!text) { showToast('Tugas tidak boleh kosong!'); return; }

  // Prevent duplicate tasks
  const duplicate = todos.some(t => t.text.toLowerCase() === text.toLowerCase());
  if (duplicate) {
    showToast('⚠️ Tugas ini sudah ada!');
    input.select();
    return;
  }

  todos.push({ id: genId(), text, done: false, createdAt: Date.now() });
  saveTodos();
  renderTodos();
  input.value = '';
  showToast('✅ Tugas ditambahkan!');
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) { todo.done = !todo.done; saveTodos(); renderTodos(); }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
  showToast('🗑️ Tugas dihapus.');
}

function openEditModal(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  editingId = id;
  $('editInput').value = todo.text;
  openModal('modalEdit');
  setTimeout(() => $('editInput').focus(), 50);
}

function saveEdit() {
  const text = $('editInput').value.trim();
  if (!text) { showToast('Tugas tidak boleh kosong!'); return; }

  // Prevent duplicate when editing (excluding current item)
  const duplicate = todos.some(t => t.id !== editingId && t.text.toLowerCase() === text.toLowerCase());
  if (duplicate) {
    showToast('⚠️ Tugas ini sudah ada!');
    return;
  }

  const todo = todos.find(t => t.id === editingId);
  if (todo) { todo.text = text; saveTodos(); renderTodos(); }
  closeModal('modalEdit');
  editingId = null;
  showToast('✏️ Tugas diperbarui!');
}

$('btnAddTodo').addEventListener('click', addTodo);
$('todoInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') addTodo(); });

$('btnSaveEdit').addEventListener('click', saveEdit);
$('btnCancelEdit').addEventListener('click', () => { closeModal('modalEdit'); editingId = null; });
$('editInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter')  saveEdit();
  if (e.key === 'Escape') { closeModal('modalEdit'); editingId = null; }
});

/* Filter buttons */
document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

/* Sort button */
$('btnSort').addEventListener('click', () => {
  sortAsc = !sortAsc;
  todos.sort((a, b) => {
    if (sortAsc) return a.text.localeCompare(b.text, 'id');
    return b.text.localeCompare(a.text, 'id');
  });
  saveTodos();
  renderTodos();
  showToast(sortAsc ? '↑ Diurutkan A–Z' : '↓ Diurutkan Z–A');
});

renderTodos();

/* ============================================================
   6. QUICK LINKS
   ============================================================ */
let links = load('links', []);

function saveLinks() { save('links', links); }

function getFavicon(url) {
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch { return '🔗'; }
}

function renderLinks() {
  const grid  = $('linksGrid');
  const empty = $('linksEmpty');
  grid.innerHTML = '';

  if (links.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  links.forEach((link, idx) => {
    const a = document.createElement('a');
    a.className = 'link-item';
    a.href      = link.url;
    a.target    = '_blank';
    a.rel       = 'noopener noreferrer';

    const img = document.createElement('img');
    img.src    = getFavicon(link.url);
    img.width  = 24;
    img.height = 24;
    img.className = 'link-icon';
    img.onerror = () => { img.style.display = 'none'; };

    const label = document.createElement('span');
    label.className   = 'link-label';
    label.textContent = link.label;

    const btnRm = document.createElement('button');
    btnRm.className   = 'btn-remove-link';
    btnRm.title       = 'Hapus';
    btnRm.textContent = '✕';
    btnRm.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      links.splice(idx, 1);
      saveLinks();
      renderLinks();
      showToast('Tautan dihapus.');
    });

    a.append(img, label, btnRm);
    grid.appendChild(a);
  });
}

$('btnAddLink').addEventListener('click', () => {
  $('linkLabel').value = '';
  $('linkUrl').value   = '';
  openModal('modalLink');
  setTimeout(() => $('linkLabel').focus(), 50);
});

$('btnSaveLink').addEventListener('click', () => {
  const label = $('linkLabel').value.trim();
  let   url   = $('linkUrl').value.trim();

  if (!label) { showToast('Nama tautan tidak boleh kosong!'); return; }
  if (!url)   { showToast('URL tidak boleh kosong!'); return; }

  // Auto-add https:// if missing
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  try { new URL(url); } catch {
    showToast('URL tidak valid!');
    return;
  }

  links.push({ label, url });
  saveLinks();
  renderLinks();
  closeModal('modalLink');
  showToast('🔗 Tautan ditambahkan!');
});

$('btnCancelLink').addEventListener('click', () => closeModal('modalLink'));

$('linkUrl').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') $('btnSaveLink').click();
  if (e.key === 'Escape') $('btnCancelLink').click();
});

renderLinks();

/* ── Close modals on overlay click ── */
['modalName', 'modalLink', 'modalEdit'].forEach(id => {
  $(id).addEventListener('click', (e) => {
    if (e.target === $(id)) {
      closeModal(id);
      if (id === 'modalEdit') editingId = null;
    }
  });
});
