import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Clock,
  Shield,
  Menu,
  Sparkles,
  Radio,
} from 'lucide-react';
import { formatDuration } from '../utils/expressionUtils';

const PAGE_META = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Your facial expression intelligence overview',
  },
  '/': {
    title: 'Emotion AI',
    subtitle: 'Real-time facial expression intelligence',
  },
  '/live': {
    title: 'Live Analysis',
    subtitle: 'Real-time facial expression detection and analytics',
  },
  '/history': {
    title: 'Session History',
    subtitle: 'Review past sessions and analytical records',
  },
  '/reports': {
    title: 'Analytical Reports',
    subtitle: 'Aggregated expression metrics & client-side exports',
  },
  '/about': {
    title: 'About & Architecture',
    subtitle: 'System specifications, models, and privacy standards',
  },
};

function Header({
  isCameraActive = false,
  sessionDuration = 0,
  isSessionActive = false,
  onOpenPrivacy,
  onToggleMobileMenu,
}) {
  const location = useLocation();
  const currentMeta = PAGE_META[location.pathname] || {
    title: 'Emotion AI',
    subtitle: 'Facial Expression Intelligence',
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: '60px',
        background: 'rgba(9, 9, 18, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-primary)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        userSelect: 'none',
      }}
    >
      {/* Left: Mobile hamburger + Page Title & Subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="header-mobile-toggle"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--text-heading)',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {currentMeta.title}
          </h1>
          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              margin: '2px 0 0',
              lineHeight: 1,
            }}
            className="header-subtitle"
          >
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Telemetry, status & user profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Active Session Timer */}
        {isSessionActive && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--accent-primary)',
            }}
          >
            <Clock size={12} />
            <span>{formatDuration(sessionDuration)}</span>
          </div>
        )}

        {/* Live Camera Streaming Pill */}
        {isCameraActive && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--success)',
              letterSpacing: '0.04em',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--success)',
                animation: 'pulse 1.5s infinite',
              }}
            />
            LIVE
          </div>
        )}

        {/* System Status Indicator */}
        <div
          className="header-status-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--success)',
              boxShadow: '0 0 6px rgba(34, 197, 94, 0.5)',
            }}
          />
          <span style={{ letterSpacing: '0.02em' }}>AI SYSTEM READY</span>
        </div>

        {/* Privacy Action */}
        <button
          type="button"
          onClick={onOpenPrivacy}
          className="btn-icon"
          style={{ width: '32px', height: '32px' }}
          aria-label="View Privacy Architecture"
          title="100% Client-Side Private AI"
        >
          <Shield size={14} />
        </button>

        {/* User / Workspace Profile Area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px 4px 6px',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            EA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-heading)',
                lineHeight: 1.1,
              }}
            >
              Enterprise
            </span>
            <span
              style={{
                fontSize: '9px',
                color: 'var(--success)',
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              Workspace
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .header-mobile-toggle {
            display: flex !important;
          }
        }
        @media (max-width: 640px) {
          .header-subtitle {
            display: none !important;
          }
          .header-status-pill {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

export default memo(Header);
