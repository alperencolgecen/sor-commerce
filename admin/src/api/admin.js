const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  const t = localStorage.getItem('sor-admin');
  if (!t) return null;
  try {
    const parsed = JSON.parse(t);
    return parsed.token || null;
  } catch {
    return null;
  }
}

function headers(isFormData) {
  const h = {};
  const token = getToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  if (!isFormData) h['Content-Type'] = 'application/json';
  return h;
}

function handle401(res) {
  if (res.status === 401) {
    localStorage.removeItem('sor-admin');
    window.location.href = '/admin/login';
  }
  return res;
}

async function get(endpoint) {
  const res = await fetch(`${BASE}${endpoint}`, { headers: headers() });
  handle401(res);
  if (!res.ok) throw new Error('API Error');
  return res.json();
}

async function post(endpoint, data) {
  const isFormData = data instanceof FormData;
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'POST',
    headers: headers(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  handle401(res);
  if (!res.ok) throw new Error('API Error');
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function put(endpoint, data) {
  const isFormData = data instanceof FormData;
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'PUT',
    headers: headers(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  handle401(res);
  if (!res.ok) throw new Error('API Error');
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function del(endpoint) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'DELETE',
    headers: headers(),
  });
  handle401(res);
  if (!res.ok) throw new Error('API Error');
  return res;
}

export default { get, post, put, del };
