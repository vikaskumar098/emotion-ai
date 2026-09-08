import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, ChevronRight, FileText, BarChart3, Award, Download } from 'lucide-react';
import { getSessions, deleteSession, clearAllSessions } from '../utils/storage';
import {
  EMOJI_MAP,
  EXPRESSION_LABELS,
  EXPRESSION_COLORS,
  EXPRESSIONS,
  formatDuration,
  calculateExpressionScore,
  getCategoryBreakdown,
  generateInsights,
} from '../utils/expressionUtils';
import { generatePDFReport } from '../utils/reportGenerator';
import toast from 'react-hot-toast';

export default function History() {
  const [sessions, setSessions] = useState(() => getSessions());
  const [selectedId, setSelectedId] = useState(null);

  const selectedSession = useMemo(() => {
    return sessions.find(s => s.id === selectedId) || null;
  }, [sessions, selectedId]);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteSession(id);
    setSessions(getSessions());
    if (selectedId === id) setSelectedId(null);
    toast.success('Session deleted');
  };

  const handleClearAll = () => {
    clearAllSessions();
    setSessions([]);
    setSelectedId(null);
    toast.success('All sessions cleared');
  };

  const handleDownload = (session) => {
    try {
      generatePDFReport(session);
      toast.success('PDF report downloaded');
    } catch {
      toast.error('Failed to generate report');
    }
  };

  // Group sessions by date
  const grouped = useMemo(() => {
    const groups = {};
    for (const s of sessions) {
      const date = new Date(s.startTime);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let label;
      if (date.toDateString() === today.toDateString()) {
        label = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = 'Yesterday';
      } else {
        label = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(s);
    }
    return groups;
  }, [sessions]);

  if (sessions.length === 0) {
    return (
      <div className="page-container">
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '6px' }}>
          Session History
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '40px' }}>
          Review your past analysis sessions
        </p>
        <div
          className="glass-card"
          style={{
            padding: '60px 24px',
            textAlign: 'center',
          }}
        >
          <Clock size={36} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '6px' }}>
            No sessions yet
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Start a live analysis session to see your history here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
            Session History
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        <button className="btn-secondary" onClick={handleClearAll} style={{ fontSize: '12px' }}>
          <Trash2 size={14} />
          Clear All
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: selectedSession ? '1fr 1fr' : '1fr',
          gap: '16px',
          alignItems: 'start',
        }}
        className="history-grid"
      >
        {/* Session List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(grouped).map(([dateLabel, dateSessions]) => (
            <div key={dateLabel}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {dateLabel}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {dateSessions.map((s) => {
                  const score = calculateExpressionScore(s.distribution);
                  const isSelected = selectedId === s.id;

                  return (
                    <motion.div
                      key={s.id}
                      className="glass-card"
                      style={{
                        padding: '14px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        borderColor: isSelected ? 'var(--border-accent)' : undefined,
                        background: isSelected ? 'var(--bg-glass-hover)' : undefined,
                      }}
                      onClick={() => setSelectedId(isSelected ? null : s.id)}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <span style={{ fontSize: '24px', flexShrink: 0 }}>
                          {EMOJI_MAP[s.dominantExpression] || '😐'}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
                            {new Date(s.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </p>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {formatDuration(s.durationSeconds)} · {EXPRESSION_LABELS[s.dominantExpression]} · Score {score}/100
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <button
                          className="btn-icon"
                          onClick={(e) => handleDelete(s.id, e)}
                          aria-label="Delete session"
                          title="Delete session"
                          style={{ width: '30px', height: '30px' }}
                        >
                          <Trash2 size={13} />
                        </button>
                        <ChevronRight size={16} style={{ color: 'var(--text-muted)', transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Session Detail */}
        <AnimatePresence>
          {selectedSession && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="glass-card"
              style={{ padding: '20px', position: 'sticky', top: '80px' }}
            >
              <SessionDetail session={selectedSession} onDownload={handleDownload} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .history-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function SessionDetail({ session, onDownload }) {
  const score = calculateExpressionScore(session.distribution);
  const categories = getCategoryBreakdown(session.distribution);
  const insights = generateInsights(session);
  const total = Object.values(session.distribution || {}).reduce((s, v) => s + v, 0);

  const sorted = EXPRESSIONS
    .map(e => ({
      key: e,
      label: EXPRESSION_LABELS[e],
      count: session.distribution?.[e] || 0,
      pct: total > 0 ? Math.round(((session.distribution?.[e] || 0) / total) * 100) : 0,
      color: EXPRESSION_COLORS[e],
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-heading)' }}>Session Report</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {new Date(session.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {' · '}
            {new Date(session.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </p>
        </div>
        <button className="btn-secondary" onClick={() => onDownload(session)} style={{ fontSize: '12px', padding: '6px 12px' }}>
          <Download size={13} />
          PDF
        </button>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        <div className="stat-card" style={{ textAlign: 'center', padding: '12px' }}>
          <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)' }}>{formatDuration(session.durationSeconds)}</p>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Duration</p>
        </div>
        <div className="stat-card" style={{ textAlign: 'center', padding: '12px' }}>
          <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)' }}>{Math.round((session.averageConfidence || 0) * 100)}%</p>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Avg Confidence</p>
        </div>
      </div>

      {/* Score */}
      <div className="stat-card" style={{ textAlign: 'center', padding: '16px' }}>
        <p style={{ fontSize: '24px', fontWeight: 800 }} className="gradient-text">{score} / 100</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Expression Score</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', fontSize: '11px' }}>
          <span style={{ color: 'var(--success)' }}>+{categories.positive}%</span>
          <span style={{ color: 'var(--text-muted)' }}>~{categories.neutral}%</span>
          <span style={{ color: 'var(--danger)' }}>-{categories.negative}%</span>
        </div>
      </div>

      {/* Distribution */}
      <div>
        <p className="section-title">Distribution</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {sorted.filter(s => s.count > 0).map(({ key, label, pct, color }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '64px', fontSize: '11px', color: 'var(--text-secondary)' }}>{label}</span>
              <div style={{ flex: 1, height: '5px', background: 'var(--bg-glass)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px' }} />
              </div>
              <span style={{ width: '32px', fontSize: '11px', fontWeight: 600, color, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div>
          <p className="section-title">Insights</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {insights.slice(0, 3).map((insight, i) => (
              <p key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, padding: '8px 10px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
                {insight}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
