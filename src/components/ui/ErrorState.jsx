import { AlertTriangle, VideoOff, ShieldOff, WifiOff } from 'lucide-react';

/**
 * ErrorState — Friendly error messages for various failure modes
 */
export default function ErrorState({ type = 'generic', message, onRetry }) {
  const configs = {
    'camera-denied': {
      icon: <ShieldOff size={28} />,
      title: 'Camera Access Denied',
      description: 'Please allow camera access in your browser settings to use facial expression analysis.',
      color: 'var(--warning)',
    },
    'camera-unavailable': {
      icon: <VideoOff size={28} />,
      title: 'No Camera Found',
      description: 'Please connect a camera to your device and try again.',
      color: 'var(--danger)',
    },
    'model-error': {
      icon: <WifiOff size={28} />,
      title: 'Models Failed to Load',
      description: 'AI models could not be loaded. Please check your connection and refresh.',
      color: 'var(--danger)',
    },
    'no-face': {
      icon: null,
      title: 'No Face Detected',
      description: 'Please position your face inside the camera frame.',
      color: 'var(--text-muted)',
    },
    generic: {
      icon: <AlertTriangle size={28} />,
      title: 'Something Went Wrong',
      description: message || 'An unexpected error occurred. Please try again.',
      color: 'var(--danger)',
    },
  };

  const config = configs[type] || configs.generic;
  if (message) config.description = message;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '40px 24px',
        textAlign: 'center',
      }}
    >
      {config.icon && (
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: `${config.color}12`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: config.color,
          }}
        >
          {config.icon}
        </div>
      )}
      <div>
        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '4px' }}>
          {config.title}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: 1.5 }}>
          {config.description}
        </p>
      </div>
      {onRetry && (
        <button className="btn-secondary" onClick={onRetry} style={{ marginTop: '8px', fontSize: '13px' }}>
          Try Again
        </button>
      )}
    </div>
  );
}
