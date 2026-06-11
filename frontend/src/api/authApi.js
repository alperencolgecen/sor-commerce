const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function loginApi(email, password) {
  const res = await fetch(`${BASE}/api/kullanici/giris`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, sifreHash: password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Giriş başarısız');
  }
  return res.json();
}

export async function registerApi(name, email, password) {
  const res = await fetch(`${BASE}/api/kullanici/kayit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ad: name, email, sifreHash: password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Kayıt başarısız');
  }
  return res.json();
}
