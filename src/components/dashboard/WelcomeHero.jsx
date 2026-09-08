import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Video } from 'lucide-react';
import { motion } from 'framer-motion';

function WelcomeHero({ sessionCount = 0 }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div
      className="glass-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '24px 28px',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        background:
          'linear-gradient(135deg, rgba(20, 20, 42, 0.9) 0%, rgba(12, 12, 26, 0.95) 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Background ambient lighting element */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 9px',
              borderRadius: '20px',
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--success)',
                boxShadow: '0 0 6px var(--success)',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--success)',
                letterSpacing: '0.04em',
              }}
            >
              AI ENGINE READY
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(20px, 3vw, 26px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text-heading)',
              margin: '0 0 6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {greeting} 👋
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              margin: 0,
              maxWidth: '520px',
              lineHeight: 1.5,
            }}
          >
            {sessionCount > 0
              ? 'Your expression intelligence overview and real-time telemetry are synchronized.'
              : 'Real-time facial expression intelligence platform. Start a session to analyze micro-expressions.'}
          </p>
        </div>

        {/* CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/live" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
              style={{
                padding: '11px 22px',
                fontSize: '13px',
                fontWeight: 600,
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.35)',
              }}
            >
              <Video size={16} />
              Start Live Analysis
              <ArrowRight size={15} />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default memo(WelcomeHero);
