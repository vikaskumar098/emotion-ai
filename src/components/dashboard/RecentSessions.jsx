import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  EMOJI_MAP,
  EXPRESSION_LABELS,
  EXPRESSION_COLORS,
  formatDuration,
  calculateExpressionScore,
} from '../../utils/expressionUtils';

function RecentSessions({ sessions = [] }) {
  const navigate = useNavigate();
  const recentList = sessions.slice(0, 5);

  const formatSessionDate = (timestamp) => {
    if (!timestamp) return { date: 'Recent', time: '' };
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateStr;
    if (date.toDateString() === today.toDateString()) {
      dateStr = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateStr = 'Yesterday';
    } else {
      dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return { date: dateStr, time: timeStr };
  };

  return (
    <div className="glass-card" style={{ padding: '22px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={15} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
              Recent Sessions
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            Latest logged telemetry and facial expression evaluations
          </p>
        </div>

        {sessions.length > 0 && (
          <Link to="/history" style={{ textDecoration: 'none' }}>
            <button
              className="btn-secondary"
              style={{
                fontSize: '11px',
                padding: '5px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              All History
              <ArrowUpRight size={13} />
            </button>
          </Link>
        )}
      </div>

      {/* Sessions list */}
      {recentList.length === 0 ? (
        <div
          style={{
            padding: '36px 16px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '13px',
          }}
        >
          <Clock size={28} style={{ color: 'var(--text-muted)', opacity: 0.5, margin: '0 auto 10px' }} />
          <p style={{ margin: 0, fontWeight: 500 }}>No sessions recorded yet.</p>
          <p style={{ fontSize: '11px', margin: '4px 0 0' }}>Completed sessions will appear here automatically.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentList.map((session) => {
            const { date, time } = formatSessionDate(session.startTime);
            const score = session.distribution
              ? calculateExpressionScore(session.distribution)
              : 50;
            const dominant = session.dominantExpression || 'neutral';
            const color = EXPRESSION_COLORS[dominant] || 'var(--text-primary)';

            return (
              <div
                key={session.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-primary)',
                  transition: 'border-color var(--transition-fast), background var(--transition-fast)',
                  gap: '12px',
                }}
                className="recent-session-row"
              >
                {/* Date & Time */}
                <div style={{ minWidth: '90px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>
                    {date}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                    {time}
                  </p>
                </div>

                {/* Duration */}
                <div style={{ minWidth: '60px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatDuration(session.durationSeconds || 0)}
                  </span>
                </div>

                {/* Dominant Expression */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flex: 1,
                    minWidth: '110px',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{EMOJI_MAP[dominant] || '😐'}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color }}>
                    {EXPRESSION_LABELS[dominant] || dominant}
                  </span>
                </div>

                {/* Score Pill */}
                <div style={{ minWidth: '70px', textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color:
                        score >= 70
                          ? 'var(--success)'
                          : score >= 45
                          ? 'var(--warning)'
                          : 'var(--danger)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {score}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/100</span>
                </div>

                {/* View Button */}
                <button
                  type="button"
                  onClick={() => navigate('/history')}
                  className="btn-icon"
                  style={{ width: '28px', height: '28px', flexShrink: 0 }}
                  title="View in History"
                  aria-label="View session details"
                >
                  <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .recent-session-row:hover {
          border-color: var(--border-hover) !important;
          background: var(--bg-glass-hover) !important;
        }
      `}</style>
    </div>
  );
}

export default memo(RecentSessions);
