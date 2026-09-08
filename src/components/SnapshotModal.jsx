import { memo } from 'react';
import { motion } from 'framer-motion';
import { X, Download } from 'lucide-react';

function SnapshotModal({ imageData, onClose }) {
  if (!imageData) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `emotionai-snapshot-${Date.now()}.png`;
    link.href = imageData;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        className="glass-card"
        style={{
          maxWidth: '640px',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
            Snapshot Preview
          </span>
          <button className="btn-icon" onClick={onClose} aria-label="Close snapshot">
            <X size={18} />
          </button>
        </div>

        {/* Image */}
        <div style={{ padding: '16px', background: '#050510' }}>
          <img
            src={imageData}
            alt="Captured snapshot with expression overlay"
            style={{
              width: '100%',
              borderRadius: 'var(--radius-md)',
              display: 'block',
            }}
          />
        </div>

        {/* Actions */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--border-primary)',
            display: 'flex',
            gap: '8px',
            justifyContent: 'flex-end',
          }}
        >
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary" onClick={handleDownload}>
            <Download size={15} />
            Download
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default memo(SnapshotModal);
