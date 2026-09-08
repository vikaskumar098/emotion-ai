import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Scan,
  Clock,
  FileText,
  Info,
  Settings,
  Shield,
  Activity,
  X,
  Radio,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/live', label: 'Live Analysis', icon: Scan },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/about', label: 'About', icon: Info },
];

function Sidebar({
  isCameraActive = false,
  isSessionActive = false,
  onOpenSettings,
  onOpenPrivacy,
  mobileOpen = false,
  onCloseMobile,
}) {
  const location = useLocation();

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`saas-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: '240px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: 'linear-gradient(180deg, rgba(13, 13, 26, 0.98) 0%, rgba(8, 8, 16, 0.98) 100%)',
          borderRight: '1px solid var(--border-primary)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: '60px',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-primary)',
          }}
        >
          <NavLink
            to="/"
            onClick={handleNavClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(99, 102, 241, 0.35)',
              }}
            >
              <Activity size={18} color="white" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  color: 'var(--text-heading)',
                  lineHeight: 1.1,
                }}
              >
                EMOTION AI
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Enterprise Vision
              </span>
            </div>
          </NavLink>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="mobile-close-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'none',
              padding: '4px',
            }}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Status Banner (if active) */}
        {(isCameraActive || isSessionActive) && (
          <div
            style={{
              margin: '12px 14px 4px',
              padding: '8px 12px',
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--success)',
                  boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--success)' }}>
                {isSessionActive ? 'SESSION ACTIVE' : 'CAMERA STREAMING'}
              </span>
            </div>
            <Radio size={13} style={{ color: 'var(--success)', animation: 'pulse 1.5s infinite' }} />
          </div>
        )}

        {/* Navigation Links */}
        <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              padding: '0 10px',
              marginBottom: '8px',
            }}
          >
            Core Platform
          </p>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV_ITEMS.map(({ path, label, icon: Icon, exact }) => {
              const isActive = exact
                ? location.pathname === path
                : location.pathname.startsWith(path) && path !== '/';

              return (
                <NavLink
                  key={path}
                  to={path}
                  onClick={handleNavClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--text-heading)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--bg-glass-hover)' : 'transparent',
                    border: isActive
                      ? '1px solid rgba(99, 102, 241, 0.3)'
                      : '1px solid transparent',
                    boxShadow: isActive ? '0 0 12px rgba(99, 102, 241, 0.12)' : 'none',
                    transition: 'all var(--transition-fast)',
                    position: 'relative',
                  }}
                  className="sidebar-nav-link"
                >
                  <Icon
                    size={16}
                    style={{
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                      flexShrink: 0,
                    }}
                  />
                  <span>{label}</span>

                  {path === '/live' && isCameraActive && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--success)',
                        boxShadow: '0 0 6px var(--success)',
                      }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* System Status & Footer Actions */}
        <div
          style={{
            padding: '12px',
            borderTop: '1px solid var(--border-primary)',
            background: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Status Badge */}
          <div
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--success)',
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                AI ENGINE READY
              </span>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'monospace',
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2px 5px',
                borderRadius: '3px',
              }}
            >
              v2.4
            </span>
          </div>

          {/* Settings & Privacy Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button
              type="button"
              onClick={onOpenSettings}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '7px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              className="sidebar-action-btn"
            >
              <Settings size={13} />
              Settings
            </button>
            <button
              type="button"
              onClick={onOpenPrivacy}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '7px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              className="sidebar-action-btn"
            >
              <Shield size={13} />
              Privacy
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        .sidebar-nav-link:hover {
          color: var(--text-heading) !important;
          background: var(--bg-glass-hover) !important;
        }
        .sidebar-action-btn:hover {
          color: var(--text-primary) !important;
          border-color: var(--border-hover) !important;
          background: var(--bg-glass) !important;
        }
        @media (max-width: 900px) {
          .saas-sidebar {
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
            left: -240px !important;
            transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .saas-sidebar.mobile-open {
            left: 0 !important;
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}

export default memo(Sidebar);
