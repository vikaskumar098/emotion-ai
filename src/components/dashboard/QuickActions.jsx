import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Video, Clock, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ACTIONS = [
  {
    title: 'Start Live Analysis',
    desc: 'Launch camera feed & real-time expression detection',
    path: '/live',
    icon: Video,
    color: 'var(--accent-primary)',
  },
  {
    title: 'View Session History',
    desc: 'Browse and inspect past expression recordings',
    path: '/history',
    icon: Clock,
    color: 'var(--info)',
  },
  {
    title: 'Export Reports',
    desc: 'Download executive PDF summaries and JSON telemetry',
    path: '/reports',
    icon: FileText,
    color: 'var(--success)',
  },
];

function QuickActions() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <p
        style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-muted)',
          margin: 0,
        }}
      >
        Quick Actions
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px',
        }}
      >
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              to={action.path}
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                whileHover={{ y: -2 }}
                className="glass-card"
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: action.color,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>
                      {action.title}
                    </h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0', lineHeight: 1.3 }}>
                      {action.desc}
                    </p>
                  </div>
                </div>
                <ArrowRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default memo(QuickActions);
