import { memo, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  EXPRESSIONS,
  EXPRESSION_LABELS,
  EXPRESSION_COLORS,
  EMOJI_MAP,
} from '../../utils/expressionUtils';
import { Link } from 'react-router-dom';
import { PieChart, Sparkles } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpressionOverview({ distribution = {} }) {
  const total = useMemo(() => {
    if (!distribution) return 0;
    return Object.values(distribution).reduce((s, v) => s + v, 0);
  }, [distribution]);

  const chartData = useMemo(() => {
    const labels = EXPRESSIONS.map((e) => EXPRESSION_LABELS[e]);
    const data = EXPRESSIONS.map((e) => distribution?.[e] || 0);
    const colors = EXPRESSIONS.map((e) => EXPRESSION_COLORS[e]);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.map((c) => `${c}dd`),
          borderColor: colors.map((c) => `${c}40`),
          borderWidth: 1,
          hoverOffset: 6,
        },
      ],
    };
  }, [distribution]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 15, 30, 0.95)',
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
              return ` ${pct}% (${val.toLocaleString()} detections)`;
            },
          },
        },
      },
    }),
    [total]
  );

  const sortedList = useMemo(() => {
    return EXPRESSIONS.map((expr) => {
      const count = distribution[expr] || 0;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return {
        key: expr,
        label: EXPRESSION_LABELS[expr],
        emoji: EMOJI_MAP[expr],
        color: EXPRESSION_COLORS[expr],
        count,
        pct,
      };
    }).sort((a, b) => b.count - a.count);
  }, [distribution, total]);

  return (
    <div className="glass-card" style={{ padding: '22px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Title & Subtitle */}
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
            <PieChart size={15} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
              Expression Overview
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            Your detected expression distribution
          </p>
        </div>

        {total > 0 && (
          <span className="badge badge-info" style={{ fontSize: '11px' }}>
            {total.toLocaleString()} total frames
          </span>
        )}
      </div>

      {/* Content or Empty State */}
      {total === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '32px 16px',
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
              marginBottom: '14px',
            }}
          >
            <PieChart size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '4px' }}>
            No expression data yet.
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '280px', marginBottom: '18px', lineHeight: 1.5 }}>
            Start a live analysis session to generate expression distribution insights.
          </p>
          <Link to="/live" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px' }}>
              <Sparkles size={14} />
              Start Analysis
            </button>
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr',
            gap: '20px',
            alignItems: 'center',
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          {/* Donut Chart */}
          <div style={{ width: '130px', height: '130px', margin: '0 auto', position: 'relative' }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>

          {/* Sorted Expression Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sortedList.map((item) => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', width: '18px', textAlign: 'center' }}>{item.emoji}</span>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    width: '64px',
                    flexShrink: 0,
                  }}
                >
                  {item.label}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '5px',
                    background: 'var(--bg-glass)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${item.pct}%`,
                      background: item.color,
                      borderRadius: '3px',
                      transition: 'width 0.4s ease-out',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: item.color,
                    width: '32px',
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {item.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ExpressionOverview);
