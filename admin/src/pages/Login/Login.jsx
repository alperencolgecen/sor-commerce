import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuth';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) { setError('Kullanıcı adı ve şifre gerekli'); return; }
    if (login(username, password)) navigate('/admin');
    else setError('Kullanıcı adı veya şifre hatalı');
  };

  return (
    <div className="login-page-admin">
      <div className="login-card-admin">
        <div className="login-logo-admin">
          <img src="/IMG/bg/SORGUN-Ticaret_logo.png" alt="" />
          <h2>SOR<span>-</span>Admin</h2>
          <p>Yönetim Paneli</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <input type="text" placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="login-error-admin">{error}</div>}
          <button type="submit" className="btn btn-primary login-btn-admin">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}
