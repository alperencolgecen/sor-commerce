import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: 48, color: '#f59e0b', marginBottom: 16 }}></i>
          <h2 style={{ marginBottom: 8 }}>Bir hata oluştu</h2>
          <p style={{ color: 'var(--text-sec)', marginBottom: 24 }}>
            Sayfa yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Sayfayı Yenile
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
