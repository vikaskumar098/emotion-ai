import { Loader2 } from 'lucide-react';

/**
 * LoadingState — Displays contextual loading states
 */
export default function LoadingState({ message = 'Loading...', type = 'default' }) {
  if (type === 'models') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '48px 24px',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'var(--accent-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loader2
            size={24}
            style={{
              color: 'var(--accent-primary)',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '4px' }}>
            Loading AI Models
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {message}
          </p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (type === 'camera') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '48px 24px',
        }}
      >
        <Loader2
          size={28}
          style={{
            color: 'var(--accent-primary)',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Initializing camera...
        </p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Default skeleton
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="skeleton" style={{ height: '20px', width: '60%' }} />
      <div className="skeleton" style={{ height: '14px', width: '80%' }} />
      <div className="skeleton" style={{ height: '14px', width: '45%' }} />
    </div>
  );
}
