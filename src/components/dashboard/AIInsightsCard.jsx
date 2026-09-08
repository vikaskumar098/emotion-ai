import { memo, useMemo } from 'react';
import { Lightbulb, Sparkles, CheckCircle2 } from 'lucide-react';
import { generateAggregateInsights } from '../../services/sessionService';

function AIInsightsCard({ stats }) {
  const insights = useMemo(() => {
    return generateAggregateInsights(stats);
  }, [stats]);

  return (
    <div className="glass-card" style={{ padding: '22px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={16} style={{ color: 'var(--warning)' }} />
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
            AI Insights
          </h2>
        </div>
        <span className="badge badge-info" style={{ fontSize: '10px' }}>
          <Sparkles size={10} />
          Automated Synthesis
        </span>
      </div>

      {/* Insights List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {insights.map((text, i) => (
          <div
            key={i}
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <CheckCircle2 size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Ethical note */}
      <p
        style={{
          fontSize: '10px',
          color: 'var(--text-muted)',
          margin: '14px 0 0',
          lineHeight: 1.4,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '8px',
        }}
      >
        Insights synthesize detected geometric facial cues and session statistics without psychological diagnoses.
      </p>
    </div>
  );
}

export default memo(AIInsightsCard);
