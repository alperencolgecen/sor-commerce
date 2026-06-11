import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const colors = {
    success: { bg: '#22c55e', icon: 'fa-check-circle' },
    error: { bg: '#ef4444', icon: 'fa-exclamation-circle' },
    warning: { bg: '#f59e0b', icon: 'fa-exclamation-triangle' },
    info: { bg: '#3b82f6', icon: 'fa-info-circle' },
    favorite: { bg: '#ec4899', icon: 'fa-heart' },
    remove: { bg: '#6b7280', icon: 'fa-heart-broken' },
  };

  const c = colors[toast.type] || colors.success;

  return (
    <div style={{
      background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      width: 320, overflow: 'hidden',
      animation: 'slideInRight 0.35s ease-out',
    }}>
      <style>{`
        @keyframes slideInRight { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, display: 'flex',
          alignItems: 'center', justifyContent: 'center', background: c.bg, color: '#fff', fontSize: 14,
        }}>
          <i className={`fas ${c.icon}`} />
        </div>
        <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{toast.message}</span>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#94a3b8', padding: 2,
        }}><i className="fas fa-times" /></button>
      </div>
      <div style={{ height: 3, background: '#f1f5f9' }}>
        <div style={{
          height: '100%', background: c.bg, borderRadius: '0 2px 2px 0',
          animation: `shrink ${toast.duration}ms linear forwards`,
        }} />
      </div>
    </div>
  );
}

export const useToast = () => useContext(ToastContext);
