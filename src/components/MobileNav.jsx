import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Scan, Clock, FileText, Info } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/live', label: 'Live', icon: Scan },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/about', label: 'About', icon: Info },
];

function MobileNav() {
  const location = useLocation();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(7, 7, 14, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-primary)',
        display: 'none',
        padding: '6px 8px env(safe-area-inset-bottom, 6px)',
      }}
      className="mobile-nav"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                padding: '6px 12px',
                fontSize: '10px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                textDecoration: 'none',
                borderRadius: 'var(--radius-sm)',
                transition: 'color var(--transition-fast)',
              }}
              aria-label={label}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-nav {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}

export default memo(MobileNav);
