import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        fontFamily: 'var(--font-mono)',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)' }}>404</h1>
      <p style={{ color: 'var(--text-muted)' }}>// route not found</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </div>
  );
}
