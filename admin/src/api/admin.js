const BASE = 'http://localhost:5000';

function getToken() {
  const t = localStorage.getItem('sor-admin');
  return t ? JSON.parse(t).token : null;
}

function headers(isFormData) {
  const h = {};
  const token = getToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  if (!isFormData) h['Content-Type'] = 'application/json';
  return h;
}

async function get(endpoint) {
  const res = await fetch(`${BASE}${endpoint}`, { headers: headers() });
  if (!res.ok) throw new Error('API Error');
  return res.json();
}

async function post(endpoint, data) {
  const isFormData = data instanceof FormData;
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'POST',
    headers: headers(isFormData),
    body: data,
  });
  if (!res.ok) throw new Error('API Error');
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function put(endpoint, data) {
  const isFormData = data instanceof FormData;
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'PUT',
    headers: headers(isFormData),
    body: data,
  });
  if (!res.ok) throw new Error('API Error');
  return res;
}

async function del(endpoint) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) throw new Error('API Error');
  return res;
}

export default { get, post, put, del };
