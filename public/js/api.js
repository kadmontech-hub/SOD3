const REFLECTIONS_KEY = 'sod-reflections-v1';
const ADMIN_KEY = 'sod-admin-content-v1';
const DEFAULT_ADMIN = {
  dailyMessage: 'La realidad cambia cuando cambia la información desde la que decidís.',
  dailyKey: 'DISTINGUIR ANTES DE REACCIONAR',
  announcement: '',
};

function safeParse(value, fallback) {
  try { return JSON.parse(value); } catch { return fallback; }
}

function readLocal(key, fallback) {
  return safeParse(localStorage.getItem(key), structuredClone(fallback));
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function sanitize(value, max = 6_000) {
  return String(value ?? '').replace(/[<>]/g, '').trim().slice(0, max);
}

function uuid() {
  return globalThis.crypto?.randomUUID?.() || `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'content-type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Error ${response.status}`);
  return body;
}

function getReflections() {
  const items = readLocal(REFLECTIONS_KEY, []);
  return { items: items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) };
}

function createReflection(data) {
  const text = sanitize(data?.text);
  if (text.length < 2) throw new Error('Escribí una reflexión válida.');
  const now = new Date().toISOString();
  const item = {
    id: uuid(),
    title: sanitize(data?.title, 120) || 'Registro sin título',
    text,
    tags: Array.isArray(data?.tags) ? data.tags.map(tag => sanitize(tag, 30)).slice(0, 8) : [],
    createdAt: now,
    updatedAt: now,
  };
  const items = readLocal(REFLECTIONS_KEY, []);
  items.push(item);
  writeLocal(REFLECTIONS_KEY, items);
  return { item };
}

function updateReflection(id, data) {
  const items = readLocal(REFLECTIONS_KEY, []);
  const item = items.find(entry => entry.id === id);
  if (!item) throw new Error('Registro no encontrado.');
  item.title = sanitize(data?.title, 120) || item.title;
  item.text = sanitize(data?.text) || item.text;
  item.updatedAt = new Date().toISOString();
  writeLocal(REFLECTIONS_KEY, items);
  return { item };
}

function deleteReflection(id) {
  const items = readLocal(REFLECTIONS_KEY, []);
  const filtered = items.filter(entry => entry.id !== id);
  if (filtered.length === items.length) throw new Error('Registro no encontrado.');
  writeLocal(REFLECTIONS_KEY, filtered);
  return { ok: true };
}

function getAdmin() {
  return { content: readLocal(ADMIN_KEY, DEFAULT_ADMIN) };
}

function saveAdmin(data) {
  const content = {
    dailyMessage: sanitize(data?.dailyMessage, 1_200),
    dailyKey: sanitize(data?.dailyKey, 180),
    announcement: sanitize(data?.announcement, 500),
  };
  writeLocal(ADMIN_KEY, content);
  return { content };
}

export const api = {
  health: () => request('/api/health'),
  getState: async () => ({ adminContent: getAdmin().content, counts: { reflections: getReflections().items.length } }),
  getReflections: async () => getReflections(),
  createReflection: async data => createReflection(data),
  updateReflection: async (id, data) => updateReflection(id, data),
  deleteReflection: async id => deleteReflection(id),
  dialogue: message => request('/api/dialogue', { method: 'POST', body: JSON.stringify({ message }) }),
  getAdmin: async () => getAdmin(),
  saveAdmin: async data => saveAdmin(data),
};
