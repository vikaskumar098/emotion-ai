import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Scan, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

function LiveAnalysisCard() {
  return (
    <div
      className="glass-card"
      style={{
        padding: '22px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(26, 26, 54, 0.95) 0%, rgba(13, 13, 30, 0.95) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      {/* Decorative radar/scan light effect */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div>
        {/* Header Tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                animation: 'pulse 2s infinite',
              }}
            />
            Real-Time Engine
          </span>

          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: 'var(--accent-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
            }}
          >
            <Scan size={20} />
          </div>
        </div>

        {/* Title & Description */}
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 8px' }}>
          Live Analysis
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
          Start real-time facial expression detection with sub-second latency and immediate visual overlays.
        </p>

        {/* Feature bullets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Zap size={13} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            <span>7 discrete expression classifications</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Layers size={13} style={{ color: 'var(--info)', flexShrink: 0 }} />
            <span>Simultaneous multi-face support</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={13} style={{ color: 'var(--success)', flexShrink: 0 }} />
            <span>100% private in-browser tensor processing</span>
          </div>
        </div>
      </div>

      {/* Button */}
      <Link to="/live" style={{ textDecoration: 'none' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '11px 16px',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          Start Analysis
          <ArrowRight size={15} />
        </motion.button>
      </Link>
    </div>
  );
}

export default memo(LiveAnalysisCard);
