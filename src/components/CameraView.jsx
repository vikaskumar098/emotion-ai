import { memo, useState } from 'react';
import { Camera, CameraOff, Download, Maximize, Scan, Users, FlipHorizontal2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingState from './ui/LoadingState';
import ErrorState from './ui/ErrorState';
import { getDominantExpression, getDominantConfidence, EMOJI_MAP, EXPRESSION_LABELS, EXPRESSION_COLORS } from '../utils/expressionUtils';

function CameraView({
  videoRef,
  canvasRef,
  isCameraActive,
  isCameraLoading,
  isModelLoading,
  isMirrored = true,
  onToggleMirror,
  error,
  detections,
  onStart,
  onStop,
  onSnapshot,
  onError,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoAspect, setVideoAspect] = useState(16 / 9);

  const faceCount = detections.length;
  const primaryDetection = detections[0];
  const dominantExpr = primaryDetection ? getDominantExpression(primaryDetection.expressions) : null;
  const confidence = primaryDetection ? getDominantConfidence(primaryDetection.expressions) : 0;

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.videoWidth && videoRef.current.videoHeight) {
      const w = videoRef.current.videoWidth;
      const h = videoRef.current.videoHeight;
      if (w > 0 && h > 0) {
        setVideoAspect(w / h);
      }
    }
  };

  const handleFullscreen = () => {
    const container = document.getElementById('camera-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      {/* Camera Header */}
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scan size={16} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
            Live Camera Feed
          </span>
          {isCameraActive && faceCount > 0 && (
            <span className="badge badge-info" style={{ marginLeft: '4px' }}>
              <Users size={10} />
              {faceCount} {faceCount === 1 ? 'face' : 'faces'}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {isCameraActive && (
            <>
              {onToggleMirror && (
                <button
                  className="btn-icon"
                  onClick={onToggleMirror}
                  aria-label={isMirrored ? 'Disable mirror mode' : 'Enable mirror mode'}
                  title={isMirrored ? 'Mirror: ON (Click to switch)' : 'Mirror: OFF (Click to mirror)'}
                  style={isMirrored ? { color: 'var(--accent-primary)', borderColor: 'rgba(99, 102, 241, 0.4)' } : {}}
                >
                  <FlipHorizontal2 size={15} />
                </button>
              )}
              <button
                className="btn-icon"
                onClick={onSnapshot}
                aria-label="Capture snapshot"
                title="Capture snapshot"
              >
                <Download size={15} />
              </button>
              <button
                className="btn-icon"
                onClick={handleFullscreen}
                aria-label="Toggle fullscreen"
                title="Toggle fullscreen"
              >
                <Maximize size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Camera Area */}
      <div
        id="camera-container"
        className="camera-area"
        style={{
          position: 'relative',
          background: '#050510',
          width: '100%',
          height: 'clamp(280px, 42vh, 420px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Video Stage: Exactly matches the webcam's native aspect ratio with zero cropping */}
        <div
          id="video-stage"
          style={{
            position: 'relative',
            height: '100%',
            maxWidth: '100%',
            aspectRatio: `${videoAspect}`,
            display: isCameraActive ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={handleLoadedMetadata}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transform: isMirrored ? 'scaleX(-1)' : 'none',
              transition: 'transform 0.15s ease',
              display: 'block',
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              display: 'block',
            }}
          />
        </div>

        {/* Empty State */}
        {!isCameraActive && !isCameraLoading && !isModelLoading && !error && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              padding: '20px 16px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--accent-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Scan size={22} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-heading)',
                  marginBottom: '4px',
                }}
              >
                AI Face Analysis
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  maxWidth: '280px',
                  lineHeight: 1.4,
                }}
              >
                Start your camera to begin real-time facial expression analysis.
              </p>
            </div>
          </div>
        )}

        {/* Loading States */}
        {isModelLoading && <LoadingState type="models" message="Preparing expression recognition..." />}
        {isCameraLoading && !isModelLoading && <LoadingState type="camera" />}

        {/* Error State */}
        {error && !isCameraLoading && !isModelLoading && (
          <ErrorState
            message={error}
            onRetry={() => {
              onError(null);
              onStart();
            }}
          />
        )}

        {/* No Face Overlay */}
        <AnimatePresence>
          {isCameraActive && faceCount === 0 && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '8px 16px',
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              No face detected — position your face in the camera frame
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Expression Overlay */}
        <AnimatePresence>
          {isCameraActive && dominantExpr && (
            <motion.div
              key={dominantExpr}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                padding: '10px 16px',
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${EXPRESSION_COLORS[dominantExpr]}30`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '24px' }}>{EMOJI_MAP[dominantExpr]}</span>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: EXPRESSION_COLORS[dominantExpr] }}>
                  {EXPRESSION_LABELS[dominantExpr]}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {Math.round(confidence * 100)}% confidence
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Camera Controls */}
      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {!isCameraActive ? (
          <button
            className="btn-primary"
            onClick={onStart}
            disabled={isCameraLoading || isModelLoading}
            style={{ minWidth: '160px' }}
          >
            <Camera size={16} />
            {isCameraLoading || isModelLoading ? 'Starting...' : 'Start Camera'}
          </button>
        ) : (
          <button
            className="btn-danger"
            onClick={onStop}
            style={{ minWidth: '160px' }}
          >
            <CameraOff size={16} />
            Stop Camera
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(CameraView);
