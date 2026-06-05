import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirm) { setError('Lütfen tüm alanları doldurun'); return; }
    if (password.length < 6) { setError('Şifre en az 6 karakter olmalıdır'); return; }
    if (password !== confirm) { setError('Şifreler eşleşmiyor'); return; }
    register(name, email, password);
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/IMG/bg/SORGUN-Ticaret_logo.png" alt="SOR-Ticaret" />
          <h2>SOR<span>-</span>Ticaret</h2>
        </div>
        <h3 className="login-title">Kayıt Ol</h3>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ad Soyad</label>
            <input type="text" placeholder="Adınız Soyadınız" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>E-posta Adresi</label>
            <input type="email" placeholder="ornek@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" placeholder="En az 6 karakter" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Şifre Tekrar</label>
            <input type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          {error && <div className="login-error"><i className="fas fa-exclamation-circle" /> {error}</div>}
          <button type="submit" className="login-submit">Kayıt Ol</button>
        </form>
        <div className="login-divider"><span>veya</span></div>
        <div className="social-login">
          <button className="social-btn"><i className="fab fa-google" /></button>
          <button className="social-btn"><i className="fab fa-facebook-f" /></button>
          <button className="social-btn"><i className="fab fa-twitter" /></button>
        </div>
        <p className="login-footer">
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}
