import { memo } from 'react';
import { Clock, TrendingUp, Target, Crown, Users } from 'lucide-react';
import { EMOJI_MAP, EXPRESSION_LABELS, EXPRESSION_COLORS } from '../../utils/expressionUtils';

function MetricCards({ stats }) {
  const hasData = stats && stats.hasData && stats.totalSessions > 0;

  const cards = [
    {
      id: 'sessions',
      icon: <Clock size={18} />,
      label: 'Total Sessions',
      value: hasData ? stats.totalSessions.toString() : '0',
      supporting: hasData
        ? `${stats.totalDetections.toLocaleString()} total sample frames`
        : 'Awaiting first session',
      color: 'var(--accent-primary)',
      trend: hasData && stats.totalSessions > 1 ? `+${stats.totalSessions} logged` : null,
      trendPositive: true,
    },
    {
      id: 'score',
      icon: <TrendingUp size={18} />,
      label: 'Avg Expression Score',
      value: hasData && stats.averageScore !== null ? `${stats.averageScore} / 100` : '--',
      supporting: hasData
        ? stats.averageScore >= 70
          ? 'Predominantly positive valence'
          : stats.averageScore >= 45
          ? 'Balanced emotional range'
          : 'Subdued / neutral profile'
        : 'Calculated from detections',
      color:
        hasData && stats.averageScore >= 65
          ? 'var(--success)'
          : hasData && stats.averageScore >= 45
          ? 'var(--warning)'
          : undefined,
      trend:
        hasData && stats.recentTrend.length >= 2 && stats.scoreDelta !== 0
          ? `${stats.scoreDelta > 0 ? '+' : ''}${stats.scoreDelta} vs prev`
          : null,
      trendPositive: stats.scoreDelta >= 0,
    },
    {
      id: 'dominant',
      icon: <Crown size={18} />,
      label: 'Dominant Expression',
      value:
        hasData && stats.dominantExpression
          ? `${EMOJI_MAP[stats.dominantExpression] || ''} ${EXPRESSION_LABELS[stats.dominantExpression] || 'Neutral'}`
          : 'No data',
      supporting: hasData
        ? `${stats.dominantPercentage}% of all session frames`
        : 'Recorded across sessions',
      color:
        hasData && stats.dominantExpression
          ? EXPRESSION_COLORS[stats.dominantExpression]
          : undefined,
      badge: hasData && stats.dominantPercentage ? `${stats.dominantPercentage}% share` : null,
    },
    {
      id: 'confidence',
      icon: <Target size={18} />,
      label: 'Average Confidence',
      value: hasData && stats.averageConfidence !== null ? `${stats.averageConfidence}%` : '--',
      supporting: hasData
        ? stats.averageConfidence >= 75
          ? 'High detection reliability'
          : 'Moderate detection clarity'
        : 'Model precision score',
      color:
        hasData && stats.averageConfidence >= 70
          ? 'var(--info)'
          : hasData
          ? 'var(--warning)'
          : undefined,
      trend: hasData ? 'Tensor accuracy' : null,
      trendPositive: true,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
      }}
    >
      {cards.map((card) => (
        <div
          key={card.id}
          className="glass-card stat-card"
          style={{
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top row: Icon + Label + Trend Pill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  background: card.color ? `${card.color}15` : 'var(--accent-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color || 'var(--accent-primary)',
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                }}
              >
                {card.label}
              </span>
            </div>

            {/* Optional Trend Badge */}
            {card.trend && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '12px',
                  background: card.trendPositive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  color: card.trendPositive ? 'var(--success)' : 'var(--danger)',
                  border: `1px solid ${card.trendPositive ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                }}
              >
                {card.trend}
              </span>
            )}
            {card.badge && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '12px',
                  background: 'var(--bg-glass)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                {card.badge}
              </span>
            )}
          </div>

          {/* Value Row */}
          <div>
            <div
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: card.color || 'var(--text-heading)',
                lineHeight: 1.2,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
                marginBottom: '4px',
              }}
            >
              {card.value}
            </div>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {card.supporting}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(MetricCards);
