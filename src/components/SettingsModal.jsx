import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, Download, ShieldCheck, Cpu, HardDrive } from 'lucide-react';
import { getSessions, clearAllSessions } from '../services/sessionService';
import toast from 'react-hot-toast';

function SettingsModal({ isOpen, onClose, onDataCleared }) {
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    try {
      const data = getSessions();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotionai_export_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Session data exported as JSON');
    } catch {
      toast.error('Failed to export data');
    }
  };

  const handleClear = () => {
    clearAllSessions();
    setConfirmClear(false);
    toast.success('All local session history cleared');
    if (onDataCleared) onDataCleared();
    onClose();
  };

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
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
              Platform Settings
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Configure preferences and local data storage
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            aria-label="Close settings"
          >
            <X size={16} />
          </button>
        </div>

        {/* Section: Storage & Data */}
        <div style={{ marginBottom: '22px' }}>
          <p className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HardDrive size={13} style={{ color: 'var(--accent-primary)' }} />
            Local Data Storage
          </p>
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Export Session History
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Download all recorded session telemetry as JSON
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleExportJSON}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                <Download size={13} />
                Export
              </button>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border-primary)',
                paddingTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--danger)', margin: 0 }}>
                  Clear All History
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Permanently remove all recorded sessions from this browser
                </p>
              </div>
              {!confirmClear ? (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => setConfirmClear(true)}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  <Trash2 size={13} />
                  Clear
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={handleClear}
                    style={{ fontSize: '11px', padding: '5px 10px' }}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setConfirmClear(false)}
                    style={{ fontSize: '11px', padding: '5px 10px' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section: AI Engine Info */}
        <div style={{ marginBottom: '22px' }}>
          <p className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={13} style={{ color: 'var(--info)' }} />
            AI Pipeline Information
          </p>
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Face Detection Model:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>TinyFaceDetector (MobileNet)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Classifier:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>FaceExpressionNet (7 classes)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Runtime:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>WebGL / Client WebAssembly</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Inference Rate:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>~3.3 FPS (300ms throttling)</span>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div
          style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(34, 197, 94, 0.05)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <ShieldCheck size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Zero server uploads. Video stream data and detection buffers remain exclusively in local browser RAM.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default memo(SettingsModal);
