import { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * EmotionCard — Reusable stat card with icon, label, value
 */
function EmotionCard({ icon, label, value, subValue, color, delay = 0 }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        {icon && (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              background: color ? `${color}15` : 'var(--accent-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color || 'var(--accent-primary)',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '2px',
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: '17px',
              fontWeight: 700,
              color: color || 'var(--text-heading)',
              lineHeight: 1.2,
            }}
          >
            {value}
          </p>
          {subValue && (
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              {subValue}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(EmotionCard);
