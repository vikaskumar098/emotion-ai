import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  Shield,
  ArrowUpRight,
} from 'lucide-react';
import { getSessions, calculateStatistics } from '../services/sessionService';
import { generatePDFReport } from '../utils/reportGenerator';
import {
  EXPRESSIONS,
  EXPRESSION_LABELS,
  EXPRESSION_COLORS,
  EMOJI_MAP,
  formatDuration,
} from '../utils/expressionUtils';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Reports() {
  const [sessions, setSessions] = useState(() => getSessions());
  const [timeFilter, setTimeFilter] = useState('ALL'); // 'ALL' | '30D' | '7D'

  // Filter sessions based on selected time window
  const filteredSessions = useMemo(() => {
    if (timeFilter === 'ALL') return sessions;
    const now = Date.now();
    const days = timeFilter === '7D' ? 7 : 30;
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return sessions.filter((s) => s.startTime >= cutoff);
  }, [sessions, timeFilter]);

  // Dynamic statistics from filtered sessions
  const stats = useMemo(() => {
    return calculateStatistics(filteredSessions);
  }, [filteredSessions]);

  // Aggregate distribution breakdown array
  const distributionRows = useMemo(() => {
    const total = Object.values(stats.expressionDistribution).reduce((a, b) => a + b, 0);
    return EXPRESSIONS.map((expr) => {
      const count = stats.expressionDistribution[expr] || 0;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      let category = 'Neutral';
      if (['happy', 'surprised'].includes(expr)) category = 'Positive';
      else if (['sad', 'angry', 'fearful', 'disgusted'].includes(expr)) category = 'Negative';

      return {
        key: expr,
        label: EXPRESSION_LABELS[expr],
        emoji: EMOJI_MAP[expr],
        color: EXPRESSION_COLORS[expr],
        category,
        count,
        pct,
      };
    }).sort((a, b) => b.count - a.count);
  }, [stats.expressionDistribution]);

  // Export Executive PDF Summary
  const handleExportExecutivePDF = () => {
    if (filteredSessions.length === 0) {
      toast.error('No session data available to generate report');
      return;
    }
    // Generate synthetic composite summary session to feed into PDF generator
    const compositeSession = {
      id: `report_${timeFilter}_${Date.now()}`,
      startTime: filteredSessions[filteredSessions.length - 1]?.startTime || Date.now(),
      endTime: filteredSessions[0]?.startTime || Date.now(),
      durationSeconds: stats.totalDurationSeconds,
      totalDetections: stats.totalDetections,
      averageConfidence: (stats.averageConfidence || 85) / 100,
      distribution: stats.expressionDistribution,
      dominantExpression: stats.dominantExpression || 'neutral',
      maxFaces: 1,
      timeline: [],
    };

    try {
      generatePDFReport(compositeSession);
      toast.success('Executive PDF report downloaded');
    } catch {
      toast.error('Failed to generate executive report');
    }
  };

  // Export raw JSON
  const handleExportJSON = () => {
    if (filteredSessions.length === 0) {
      toast.error('No session data available to export');
      return;
    }
    try {
      const blob = new Blob([JSON.stringify(filteredSessions, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotionai_report_${timeFilter.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('JSON export downloaded');
    } catch {
      toast.error('Failed to export JSON');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '1200px', padding: '24px' }}>
      {/* Top Header Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
            Analytical Reports
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Aggregated expression metrics, category breakdowns, and client-side exports
          </p>
        </div>

        {/* Time Filters & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Time range toggle */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px',
            }}
          >
            {['7D', '30D', 'ALL'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setTimeFilter(f)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: timeFilter === f ? 'var(--accent-glow)' : 'transparent',
                  color: timeFilter === f ? 'var(--accent-primary)' : 'var(--text-muted)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {f === 'ALL' ? 'All Time' : f}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleExportJSON}
            style={{ fontSize: '12px', padding: '8px 14px' }}
          >
            <Download size={13} />
            JSON
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleExportExecutivePDF}
            style={{ fontSize: '12px', padding: '8px 16px' }}
          >
            <FileText size={14} />
            Export Executive PDF
          </button>
        </div>
      </div>

      {/* When no sessions are available */}
      {sessions.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '60px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--accent-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <FileText size={28} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '8px' }}>
            No Analytical Reports Yet
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.5 }}>
            Executive summaries, expression breakdowns, and exportable documentation will be generated once you record your first live session.
          </p>
          <Link to="/live" style={{ textDecoration: 'none' }}>
            <button className="btn-primary">
              <Sparkles size={15} />
              Start Live Analysis
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Summary KPIs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            <div className="glass-card" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                Analyzed Sessions
              </p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', margin: '4px 0 0' }}>
                {stats.totalSessions}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                {formatDuration(stats.totalDurationSeconds)} total recording time
              </p>
            </div>

            <div className="glass-card" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                Avg Expression Score
              </p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)', margin: '4px 0 0' }}>
                {stats.averageScore} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ 100</span>
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Weighted emotional valence
              </p>
            </div>

            <div className="glass-card" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                Dominant Expression
              </p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{EMOJI_MAP[stats.dominantExpression] || '😐'}</span>
                <span>{EXPRESSION_LABELS[stats.dominantExpression] || 'Neutral'}</span>
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                {stats.dominantPercentage}% of detected samples
              </p>
            </div>

            <div className="glass-card" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                Detection Accuracy
              </p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--info)', margin: '4px 0 0' }}>
                {stats.averageConfidence}%
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Mean classifier confidence
              </p>
            </div>
          </div>

          {/* Expression Breakdown Table */}
          <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>
                  Expression Distribution Breakdown
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Relative share and frequency across all detected frames
                </p>
              </div>
              <span className="badge badge-info" style={{ fontSize: '11px' }}>
                {stats.totalDetections.toLocaleString()} Detections
              </span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '10px 12px' }}>Expression</th>
                  <th style={{ padding: '10px 12px' }}>Category</th>
                  <th style={{ padding: '10px 12px' }}>Detections</th>
                  <th style={{ padding: '10px 12px' }}>Distribution %</th>
                  <th style={{ padding: '10px 12px', minWidth: '160px' }}>Proportion</th>
                </tr>
              </thead>
              <tbody>
                {distributionRows.map((row) => (
                  <tr
                    key={row.key}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{row.emoji}</span>
                      <span style={{ fontWeight: 600 }}>{row.label}</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 500,
                          background:
                            row.category === 'Positive'
                              ? 'rgba(34, 197, 94, 0.1)'
                              : row.category === 'Negative'
                              ? 'rgba(239, 68, 68, 0.1)'
                              : 'rgba(148, 163, 184, 0.1)',
                          color:
                            row.category === 'Positive'
                              ? 'var(--success)'
                              : row.category === 'Negative'
                              ? 'var(--danger)'
                              : 'var(--text-muted)',
                        }}
                      >
                        {row.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontVariantNumeric: 'tabular-nums' }}>
                      {row.count.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600, color: row.color, fontVariantNumeric: 'tabular-nums' }}>
                      {row.pct}%
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div
                        style={{
                          width: '100%',
                          height: '6px',
                          background: 'var(--bg-glass)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${row.pct}%`,
                            height: '100%',
                            background: row.color,
                            borderRadius: '3px',
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Session Export List */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>
                  Included Sessions ({filteredSessions.length})
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Individual session reports available for download
                </p>
              </div>
              <Link to="/history" style={{ textDecoration: 'none' }}>
                <button className="btn-secondary" style={{ fontSize: '11px', padding: '5px 10px' }}>
                  Full History <ArrowUpRight size={13} />
                </button>
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredSessions.slice(0, 8).map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-primary)',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '16px' }}>{EMOJI_MAP[s.dominantExpression] || '😐'}</span>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
                        {new Date(s.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at{' '}
                        {new Date(s.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>
                        ({formatDuration(s.durationSeconds || 0)})
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => generatePDFReport(s)}
                    title="Download individual session PDF"
                    style={{ width: '30px', height: '30px' }}
                  >
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
