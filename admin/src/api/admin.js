import { products } from '../../frontend/src/data/products';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function get(endpoint) {
  const token = localStorage.getItem('sor-admin');
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: token ? { Authorization: `Bearer ${JSON.parse(token).token}` } : {},
  });
  if (!res.ok) throw new Error('API Error');
  return res.json();
}

async function post(endpoint, data) {
  const token = localStorage.getItem('sor-admin');
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${JSON.parse(token).token}` } : {}) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('API Error');
  return res.json();
}

async function put(endpoint, data) {
  const token = localStorage.getItem('sor-admin');
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${JSON.parse(token).token}` } : {}) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('API Error');
  return res.json();
}

async function del(endpoint) {
  const token = localStorage.getItem('sor-admin');
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${JSON.parse(token).token}` } : {},
  });
  if (!res.ok) throw new Error('API Error');
  return res.json();
}

export { BASE, products };
export default { get, post, put, del };
