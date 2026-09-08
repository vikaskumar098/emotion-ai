import { memo } from 'react';
import { motion } from 'framer-motion';
import { X, Shield, Lock, EyeOff, ServerOff, CheckCircle } from 'lucide-react';

function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          background: 'rgba(15, 15, 28, 0.98)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-primary)',
            paddingBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'rgba(34, 197, 94, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success)',
              }}
            >
              <Shield size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                Privacy & Data Architecture
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Local-first, client-side intelligence
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close privacy modal">
            <X size={16} />
          </button>
        </div>

        {/* Guarantees List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <ServerOff size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>
                Zero Server Video Transmission
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: 1.5 }}>
                Your webcam video stream is fed directly into client-side WebGL tensors. Not a single video frame, picture, or video chunk is ever transmitted across the internet.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <Lock size={18} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>
                Isolated LocalStorage
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: 1.5 }}>
                Recorded session telemetry (aggregate percentages and timelines) is saved solely within your browser's private localStorage. You retain complete control to clear or export it anytime.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <EyeOff size={18} style={{ color: 'var(--info)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>
                No Facial Identification or Biometrics
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: 1.5 }}>
                Emotion AI does NOT extract, store, or verify biometric facial embeddings. It performs momentary geometric pattern categorization without tracking personal identities.
              </p>
            </div>
          </div>
        </div>

        {/* Ethical disclaimer */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            <strong>Ethical AI Statement:</strong> Facial expressions reflect dynamic physical muscle arrangements and do not constitute definitive psychological diagnosis or emotional truth.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default memo(PrivacyModal);
