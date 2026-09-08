import { memo, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { EXPRESSIONS, EXPRESSION_LABELS, EXPRESSION_COLORS } from '../utils/expressionUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

function EmotionChart({ distribution, embedded = false }) {
  const total = useMemo(() => {
    if (!distribution) return 0;
    return Object.values(distribution).reduce((s, v) => s + v, 0);
  }, [distribution]);

  const chartData = useMemo(() => {
    const labels = EXPRESSIONS.map(e => EXPRESSION_LABELS[e]);
    const data = EXPRESSIONS.map(e => distribution?.[e] || 0);
    const colors = EXPRESSIONS.map(e => EXPRESSION_COLORS[e]);

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.map(c => `${c}cc`),
        borderColor: colors.map(c => `${c}40`),
        borderWidth: 1,
        hoverOffset: 6,
      }],
    };
  }, [distribution]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: true,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 30, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        titleFont: { family: 'Inter', weight: 600, size: 12 },
        bodyFont: { family: 'Inter', size: 11 },
        callbacks: {
          label: (ctx) => {
            const val = ctx.raw;
            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
            return ` ${pct}% (${val} detections)`;
          },
        },
      },
    },
  }), [total]);

  // Sorted distribution for bar list
  const sorted = useMemo(() => {
    if (!distribution) return [];
    return EXPRESSIONS
      .map(e => ({
        key: e,
        label: EXPRESSION_LABELS[e],
        count: distribution[e] || 0,
        pct: total > 0 ? Math.round(((distribution[e] || 0) / total) * 100) : 0,
        color: EXPRESSION_COLORS[e],
      }))
      .sort((a, b) => b.count - a.count);
  }, [distribution, total]);

  if (total === 0) {
    const emptyContent = (
      <div
        style={{
          padding: embedded ? '24px 16px' : '32px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '13px',
        }}
      >
        No expression data collected yet. Start a session to see distribution.
      </div>
    );

    if (embedded) return emptyContent;

    return (
      <div className="glass-card" style={{ padding: '24px' }}>
        <p className="section-title">Expression Distribution</p>
        {emptyContent}
      </div>
    );
  }

  const content = (
    <div
      style={{
        display: 'flex',
        gap: embedded ? '16px' : '20px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {/* Doughnut */}
      <div style={{ width: embedded ? '110px' : '140px', height: embedded ? '110px' : '140px', flexShrink: 0, margin: '0 auto' }}>
        <Doughnut data={chartData} options={chartOptions} />
      </div>

      {/* Bar list */}
      <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: embedded ? '5px' : '8px' }}>
        {sorted.map(({ key, label, pct, color }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '68px', fontSize: '11px', color: 'var(--text-secondary)', flexShrink: 0 }}>
              {label}
            </span>
            <div
              style={{
                flex: 1,
                height: embedded ? '5px' : '6px',
                background: 'var(--bg-glass)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: color,
                  borderRadius: '3px',
                  transition: 'width 0.4s ease-out',
                }}
              />
            </div>
            <span
              style={{
                width: '32px',
                fontSize: '11px',
                fontWeight: 600,
                color: color,
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <p className="section-title">Expression Distribution</p>
      {content}
    </div>
  );
}

export default memo(EmotionChart);
