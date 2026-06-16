import { useState, useEffect } from 'react';
import api from '../../api/admin';

export default function Users() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/api/admin/kullanici').then(res => setData(res.items || res)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Kullanıcılar</h2>

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr><th>ID</th><th>Ad Soyad</th><th>E-posta</th></tr>
          </thead>
          <tbody>
            {data.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td style={{ fontWeight: 500 }}>{u.ad}</td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
