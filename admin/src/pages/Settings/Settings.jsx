import { useState, useEffect } from 'react';
import api from '../../api/admin';
import './Settings.css';

export default function Settings() {
  const [form, setForm] = useState({
    smtpHost: '', smtpPort: '587', smtpUsername: '', smtpPassword: '',
    smtpFrom: '', smtpFromName: '',
    smsProvider: '', smsApiKey: '', smsApiUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get('/api/admin/ayarlar').then(data => {
      setForm(prev => ({ ...prev, ...data }));
    }).catch(() => {});
  }, []);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.put('/api/admin/ayarlar', form);
      setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Kaydetme hatası: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>E-posta & SMS Ayarları</h2>

      {message && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: 16 }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            <i className="fas fa-envelope" /> SMTP E-posta Ayarları
          </h3>
          <div className="settings-grid">
            <div className="form-group">
              <label>SMTP Sunucu</label>
              <input value={form.smtpHost} onChange={e => update('smtpHost', e.target.value)} placeholder="Örn: smtp.gmail.com" />
            </div>
            <div className="form-group">
              <label>Port</label>
              <input value={form.smtpPort} onChange={e => update('smtpPort', e.target.value)} placeholder="587" />
            </div>
            <div className="form-group">
              <label>Kullanıcı Adı</label>
              <input value={form.smtpUsername} onChange={e => update('smtpUsername', e.target.value)} placeholder="E-posta adresiniz" />
            </div>
            <div className="form-group">
              <label>Şifre</label>
              <input type="password" value={form.smtpPassword} onChange={e => update('smtpPassword', e.target.value)} placeholder="SMTP şifresi" />
            </div>
            <div className="form-group">
              <label>Gönderen Adresi</label>
              <input value={form.smtpFrom} onChange={e => update('smtpFrom', e.target.value)} placeholder="noreply@sor-ticaret.com" />
            </div>
            <div className="form-group">
              <label>Gönderen Adı</label>
              <input value={form.smtpFromName} onChange={e => update('smtpFromName', e.target.value)} placeholder="SOR Ticaret" />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            <i className="fas fa-sms" /> SMS Servis Ayarları
          </h3>
          <div className="settings-grid">
            <div className="form-group">
              <label>Sağlayıcı</label>
              <select value={form.smsProvider} onChange={e => update('smsProvider', e.target.value)}>
                <option value="">Konsol (geliştirme)</option>
                <option value="netgsm">NetGSM</option>
                <option value="twilio">Twilio</option>
                <option value="textbelt">TextBelt</option>
              </select>
            </div>
            <div className="form-group">
              <label>API Anahtarı</label>
              <input value={form.smsApiKey} onChange={e => update('smsApiKey', e.target.value)} placeholder="API anahtarınız" />
            </div>
            <div className="form-group full-width">
              <label>API URL</label>
              <input value={form.smsApiUrl} onChange={e => update('smsApiUrl', e.target.value)} placeholder="https://api.netgsm.com.tr/sms/send/get" />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? <><i className="fas fa-spinner fa-spin" /> Kaydediliyor...</> : <><i className="fas fa-save" /> Ayarları Kaydet</>}
          </button>
        </div>
      </form>
    </div>
  );
}
