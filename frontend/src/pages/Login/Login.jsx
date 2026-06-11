import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Lütfen tüm alanları doldurun'); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/IMG/bg/SORGUN-Ticaret_logo.png" alt="SOR-Ticaret" />
          <h2>SOR<span>-</span>Ticaret</h2>
        </div>
        <h3 className="login-title">Giriş Yap</h3>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-posta Adresi</label>
            <input type="email" placeholder="ornek@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="login-error"><i className="fas fa-exclamation-circle" /> {error}</div>}
          <div className="form-options">
            <label><input type="checkbox" defaultChecked /> Beni Hatırla</label>
            <a href="#">Şifremi Unuttum</a>
          </div>
          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin" /> Giriş yapılıyor...</> : 'Giriş Yap'}
          </button>
        </form>
        <div className="login-divider"><span>veya</span></div>
        <div className="social-login">
          <button className="social-btn"><i className="fab fa-google" /></button>
          <button className="social-btn"><i className="fab fa-facebook-f" /></button>
          <button className="social-btn"><i className="fab fa-twitter" /></button>
        </div>
        <p className="login-footer">
          Hesabın yok mu? <Link to="/kayit">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}
