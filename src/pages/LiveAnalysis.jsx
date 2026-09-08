import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Square, PieChart, Activity, Users } from 'lucide-react';
import toast from 'react-hot-toast';

import useFaceDetection from '../hooks/useFaceDetection';
import useSession from '../hooks/useSession';

import CameraView from '../components/CameraView';
import AnalyticsPanel from '../components/AnalyticsPanel';
import EmotionChart from '../components/EmotionChart';
import TimelineChart from '../components/TimelineChart';
import AIInsights from '../components/AIInsights';
import MultiFacePanel from '../components/MultiFacePanel';
import SessionSummary from '../components/SessionSummary';
import SnapshotModal from '../components/SnapshotModal';

export default function LiveAnalysis({ onCameraChange, onSessionChange, onDurationChange }) {
  const detection = useFaceDetection();
  const session = useSession();

  const [activeTab, setActiveTab] = useState('distribution');
  const [snapshotData, setSnapshotData] = useState(null);
  const [sessionSnapshot, setSessionSnapshot] = useState(null);
  const snapshotIntervalRef = useRef(null);

  // Notify parent about camera/session state
  useEffect(() => {
    onCameraChange?.(detection.isCameraActive);
  }, [detection.isCameraActive, onCameraChange]);

  useEffect(() => {
    onSessionChange?.(session.isSessionActive);
  }, [session.isSessionActive, onSessionChange]);

  useEffect(() => {
    onDurationChange?.(session.sessionDuration);
  }, [session.sessionDuration, onDurationChange]);

  // Record detections into session
  useEffect(() => {
    if (session.isSessionActive && detection.detections.length > 0) {
      session.recordDetection(detection.detections);
    }
  }, [detection.detections, session.isSessionActive]);

  // Periodically refresh session snapshot for charts/insights (every 1s)
  useEffect(() => {
    if (session.isSessionActive) {
      snapshotIntervalRef.current = setInterval(() => {
        setSessionSnapshot(session.getSessionSnapshot());
      }, 1000);
    } else {
      if (snapshotIntervalRef.current) {
        clearInterval(snapshotIntervalRef.current);
        snapshotIntervalRef.current = null;
      }
    }

    return () => {
      if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
    };
  }, [session.isSessionActive, session.getSessionSnapshot]);

  // Handlers
  const handleStartSession = useCallback(() => {
    if (!detection.isCameraActive) {
      detection.startCamera().then(() => {
        session.startSession();
        toast.success('Session started');
      });
    } else {
      session.startSession();
      toast.success('Session started');
    }
  }, [detection, session]);

  const handleStopSession = useCallback(() => {
    session.stopSession();
    detection.stopCamera();
    setSessionSnapshot(null);
    toast.success('Session complete — Report generated');
  }, [session, detection]);

  const handleSnapshot = useCallback(() => {
    const data = detection.captureSnapshot();
    if (data) {
      setSnapshotData(data);
      toast.success('Snapshot captured');
    }
  }, [detection]);

  return (
    <div className="page-container live-page">
      {/* Session controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--text-heading)',
              margin: 0,
            }}
          >
            Live Analysis
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            Real-time facial expression detection and analytics
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {!session.isSessionActive ? (
            <button className="btn-primary" onClick={handleStartSession}>
              <Play size={15} />
              Start Session
            </button>
          ) : (
            <button className="btn-danger" onClick={handleStopSession}>
              <Square size={15} />
              Stop Session
            </button>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '12px',
          alignItems: 'start',
        }}
        className="live-grid"
      >
        {/* Left column — Camera + Tabbed Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <CameraView
            videoRef={detection.videoRef}
            canvasRef={detection.canvasRef}
            isCameraActive={detection.isCameraActive}
            isCameraLoading={detection.isCameraLoading}
            isModelLoading={detection.isModelLoading}
            isMirrored={detection.isMirrored}
            onToggleMirror={detection.toggleMirror}
            error={detection.error}
            detections={detection.detections}
            onStart={detection.startCamera}
            onStop={detection.stopCamera}
            onSnapshot={handleSnapshot}
            onError={detection.setError}
          />

          {/* Tabbed Secondary Analytics Card */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            {/* Tabs Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 12px',
                borderBottom: '1px solid var(--border-primary)',
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('distribution')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: activeTab === 'distribution' ? 'var(--accent-glow)' : 'transparent',
                    color: activeTab === 'distribution' ? 'var(--accent-primary)' : 'var(--text-muted)',
                    transition: 'all var(--transition-base)',
                  }}
                >
                  <PieChart size={13} />
                  Distribution
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: activeTab === 'timeline' ? 'var(--accent-glow)' : 'transparent',
                    color: activeTab === 'timeline' ? 'var(--accent-primary)' : 'var(--text-muted)',
                    transition: 'all var(--transition-base)',
                  }}
                >
                  <Activity size={13} />
                  Timeline
                </button>
                {detection.detections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('faces')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                      background: activeTab === 'faces' ? 'var(--accent-glow)' : 'transparent',
                      color: activeTab === 'faces' ? 'var(--accent-primary)' : 'var(--text-muted)',
                      transition: 'all var(--transition-base)',
                    }}
                  >
                    <Users size={13} />
                    Multi-Face ({detection.detections.length})
                  </button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div style={{ padding: '12px 16px' }}>
              {activeTab === 'distribution' && (
                <EmotionChart distribution={sessionSnapshot?.distribution} embedded={true} />
              )}
              {activeTab === 'timeline' && (
                <TimelineChart timeline={sessionSnapshot?.timeline} embedded={true} />
              )}
              {activeTab === 'faces' && (
                <MultiFacePanel detections={detection.detections} embedded={true} />
              )}
            </div>
          </div>
        </div>

        {/* Right column — Analytics + Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <AnalyticsPanel
            detections={detection.detections}
            sessionSnapshot={sessionSnapshot}
            sessionDuration={session.sessionDuration}
            isSessionActive={session.isSessionActive}
          />
          <AIInsights sessionSnapshot={sessionSnapshot} />

          {/* Privacy note */}
          <div
            className="glass-card"
            style={{
              padding: '10px 14px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}
          >
            <span style={{ fontSize: '15px', flexShrink: 0 }}>🔒</span>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
              Your camera feed is processed locally in your browser. No images are uploaded to any server.
              Expression data is based on detected facial patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Session Summary Modal */}
      <AnimatePresence>
        {session.sessionSummary && (
          <SessionSummary summary={session.sessionSummary} onDismiss={session.dismissSummary} />
        )}
      </AnimatePresence>

      {/* Snapshot Modal */}
      <AnimatePresence>
        {snapshotData && (
          <SnapshotModal imageData={snapshotData} onClose={() => setSnapshotData(null)} />
        )}
      </AnimatePresence>

      {/* Responsive grid + desktop viewport fit */}
      <style>{`
        @media (min-width: 901px) {
          .live-page {
            height: calc(100vh - 60px);
            max-height: calc(100vh - 60px);
            overflow-y: auto;
            box-sizing: border-box;
            padding-top: 12px;
            padding-bottom: 12px;
          }
        }
        @media (max-width: 900px) {
          .live-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
