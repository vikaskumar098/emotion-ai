import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Download, FileText, Award, BarChart3, Clock, Target, Users } from 'lucide-react';
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

function SessionSummary({ summary, onDismiss }) {
  if (!summary) return null;

  const score = useMemo(() => calculateExpressionScore(summary.distribution), [summary.distribution]);
  const categories = useMemo(() => getCategoryBreakdown(summary.distribution), [summary.distribution]);
  const insights = useMemo(() => generateInsights(summary), [summary]);
  const total = useMemo(
    () => Object.values(summary.distribution || {}).reduce((s, v) => s + v, 0),
    [summary.distribution]
  );

  const sorted = useMemo(() => {
    return EXPRESSIONS
      .map(e => ({
        key: e,
        label: EXPRESSION_LABELS[e],
        count: summary.distribution?.[e] || 0,
        pct: total > 0 ? Math.round(((summary.distribution?.[e] || 0) / total) * 100) : 0,
        color: EXPRESSION_COLORS[e],
      }))
      .sort((a, b) => b.count - a.count);
  }, [summary.distribution, total]);

  const handleDownload = () => {
    try {
      generatePDFReport(summary);
    } catch (err) {
      console.error('PDF generation failed:', err);
    }
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
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflow: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onDismiss();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '85vh',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={18} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                Session Report
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                {new Date(summary.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {' · '}
                {new Date(summary.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onDismiss} aria-label="Close report">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <Clock size={16} style={{ color: 'var(--text-muted)', marginBottom: '6px' }} />
              <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)' }}>
                {formatDuration(summary.durationSeconds)}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Duration</p>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <Target size={16} style={{ color: 'var(--text-muted)', marginBottom: '6px' }} />
              <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)' }}>
                {Math.round((summary.averageConfidence || 0) * 100)}%
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avg Confidence</p>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <Users size={16} style={{ color: 'var(--text-muted)', marginBottom: '6px' }} />
              <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)' }}>
                {summary.totalDetections}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Detections</p>
            </div>
          </div>

          {/* Expression Score */}
          <div className="stat-card" style={{ textAlign: 'center', padding: '20px' }}>
            <Award size={20} style={{ color: 'var(--accent-primary)', marginBottom: '8px' }} />
            <p style={{ fontSize: '32px', fontWeight: 800 }} className="gradient-text">
              {score} / 100
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Expression Score
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '12px' }}>
              <span style={{ color: 'var(--success)' }}>Positive {categories.positive}%</span>
              <span style={{ color: 'var(--text-muted)' }}>Neutral {categories.neutral}%</span>
              <span style={{ color: 'var(--danger)' }}>Negative {categories.negative}%</span>
            </div>
          </div>

          {/* Dominant Expression */}
          <div className="stat-card" style={{ textAlign: 'center', padding: '16px' }}>
            <span style={{ fontSize: '32px' }}>{EMOJI_MAP[summary.dominantExpression]}</span>
            <p style={{ fontSize: '16px', fontWeight: 700, color: EXPRESSION_COLORS[summary.dominantExpression], marginTop: '4px' }}>
              {EXPRESSION_LABELS[summary.dominantExpression]}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dominant Expression</p>
          </div>

          {/* Distribution */}
          <div>
            <p className="section-title">Expression Distribution</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sorted.map(({ key, label, pct, color }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '76px', fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
                  <div style={{ flex: 1, height: '6px', background: 'var(--bg-glass)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.4s ease-out' }} />
                  </div>
                  <span style={{ width: '36px', fontSize: '12px', fontWeight: 600, color, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div>
              <p className="section-title">Key Insights</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {insights.map((insight, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    {insight}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-primary)',
            display: 'flex',
            gap: '8px',
            justifyContent: 'flex-end',
          }}
        >
          <button className="btn-secondary" onClick={onDismiss}>
            Close
          </button>
          <button className="btn-primary" onClick={handleDownload}>
            <Download size={15} />
            Download PDF
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default memo(SessionSummary);
