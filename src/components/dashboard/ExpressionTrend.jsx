import { memo, useState, useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
} from 'chart.js';
import { TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EMOJI_MAP, EXPRESSION_LABELS, EXPRESSION_COLORS } from '../../utils/expressionUtils';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

function ExpressionTrend({ trendData = [] }) {
  const [filter, setFilter] = useState('ALL'); // '7D' | '30D' | 'ALL'
  const chartRef = useRef(null);

  // Filter trend points by range
  const filteredData = useMemo(() => {
    if (!trendData || trendData.length === 0) return [];
    if (filter === '7D') return trendData.slice(-7);
    if (filter === '30D') return trendData.slice(-30);
    return trendData;
  }, [trendData, filter]);

  const chartData = useMemo(() => {
    if (filteredData.length === 0) return { labels: [], datasets: [] };

    const labels = filteredData.map((d) => d.date || 'Session');
    const scores = filteredData.map((d) => d.score);
    const pointColors = filteredData.map(
      (d) => EXPRESSION_COLORS[d.dominant] || '#6366f1'
    );

    return {
      labels,
      datasets: [
        {
          label: 'Expression Score',
          data: scores,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: pointColors,
          pointBorderColor: '#0f0f1c',
          pointBorderWidth: 1.5,
        },
      ],
    };
  }, [filteredData]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          ticks: {
            color: '#64748b',
            font: { family: 'Inter', size: 10 },
          },
          border: { color: 'rgba(255, 255, 255, 0.06)' },
        },
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            color: '#64748b',
            font: { family: 'Inter', size: 10 },
            callback: (v) => `${v}`,
          },
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          border: { color: 'rgba(255, 255, 255, 0.06)' },
        },
      },
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
              const item = filteredData[ctx.dataIndex];
              const domEmoji = item ? EMOJI_MAP[item.dominant] || '' : '';
              const domLabel = item ? EXPRESSION_LABELS[item.dominant] || item.dominant : '';
              return [
                ` Score: ${ctx.raw} / 100`,
                ` Dominant: ${domEmoji} ${domLabel}`,
                ` Confidence: ${item?.confidence || 0}%`,
              ];
            },
          },
        },
      },
    }),
    [filteredData]
  );

  return (
    <div className="glass-card" style={{ padding: '22px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Title and Range Filters */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={15} style={{ color: 'var(--success)' }} />
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
              Expression Trend
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            Historical valence and performance trajectory
          </p>
        </div>

        {trendData.length >= 2 && (
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px',
            }}
          >
            {['7D', '30D', 'ALL'].map((btn) => (
              <button
                key={btn}
                type="button"
                onClick={() => setFilter(btn)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: filter === btn ? 'var(--accent-glow)' : 'transparent',
                  color: filter === btn ? 'var(--accent-primary)' : 'var(--text-muted)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {btn}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart Area or Clean Empty State */}
      {trendData.length < 2 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '36px 16px',
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
            <TrendingUp size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '4px' }}>
            {trendData.length === 1 ? 'Need 1 more session for trends' : 'No trend data yet'}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '300px', marginBottom: '18px', lineHeight: 1.5 }}>
            {trendData.length === 1
              ? 'Complete another session to compare expression score progression.'
              : 'Complete multiple live sessions to plot your emotional valence trajectory over time.'}
          </p>
          <Link to="/live" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ fontSize: '12px', padding: '7px 14px' }}>
              <Sparkles size={13} />
              Start Next Session
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ height: '220px', width: '100%', position: 'relative' }}>
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

export default memo(ExpressionTrend);
