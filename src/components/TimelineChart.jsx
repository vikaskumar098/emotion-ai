import { memo, useMemo, useRef, useEffect } from 'react';
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
import { EXPRESSION_COLORS, EXPRESSION_LABELS } from '../utils/expressionUtils';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

// Map expressions to numeric values for the Y axis
const EXPRESSION_Y_MAP = {
  happy: 6,
  surprised: 5,
  neutral: 4,
  fearful: 3,
  sad: 2,
  disgusted: 1,
  angry: 0,
};

const Y_LABELS = ['Angry', 'Disgusted', 'Sad', 'Fearful', 'Neutral', 'Surprised', 'Happy'];

function TimelineChart({ timeline, embedded = false }) {
  const chartRef = useRef(null);

  // Limit to last 60 data points for performance
  const recentTimeline = useMemo(() => {
    if (!timeline || timeline.length === 0) return [];
    return timeline.slice(-60);
  }, [timeline]);

  const chartData = useMemo(() => {
    if (recentTimeline.length === 0) return { labels: [], datasets: [] };

    const labels = recentTimeline.map((entry) => {
      const d = new Date(entry.time);
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    });

    const data = recentTimeline.map((entry) => EXPRESSION_Y_MAP[entry.expression] ?? 4);
    const colors = recentTimeline.map((entry) => EXPRESSION_COLORS[entry.expression] || '#64748b');

    return {
      labels,
      datasets: [
        {
          data,
          borderColor: 'rgba(99, 102, 241, 0.6)',
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: colors,
          pointBorderColor: colors,
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [recentTimeline]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 200 },
      scales: {
        x: {
          display: true,
          ticks: {
            color: '#64748b',
            font: { family: 'Inter', size: 9 },
            maxRotation: 0,
            maxTicksLimit: 8,
          },
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          border: { color: 'rgba(255, 255, 255, 0.06)' },
        },
        y: {
          min: -0.5,
          max: 6.5,
          ticks: {
            callback: (val) => Y_LABELS[val] || '',
            stepSize: 1,
            color: '#64748b',
            font: { family: 'Inter', size: 10 },
          },
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          border: { color: 'rgba(255, 255, 255, 0.06)' },
        },
      },
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
            title: (items) => items[0]?.label || '',
            label: (ctx) => {
              const entry = recentTimeline[ctx.dataIndex];
              if (!entry) return '';
              const label = EXPRESSION_LABELS[entry.expression] || entry.expression;
              const conf = Math.round(entry.confidence * 100);
              return ` ${label} (${conf}% confidence)`;
            },
          },
        },
      },
    }),
    [recentTimeline]
  );

  if (!timeline || timeline.length === 0) {
    const emptyContent = (
      <div
        style={{
          padding: embedded ? '24px 16px' : '32px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '13px',
        }}
      >
        Timeline data will appear here as expressions are detected during your session.
      </div>
    );

    if (embedded) return emptyContent;

    return (
      <div className="glass-card" style={{ padding: '20px' }}>
        <p className="section-title">Expression Timeline</p>
        {emptyContent}
      </div>
    );
  }

  const chartContent = (
    <div style={{ height: embedded ? '150px' : '200px' }}>
      <Line ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );

  if (embedded) return chartContent;

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <p className="section-title">Expression Timeline</p>
      {chartContent}
    </div>
  );
}

export default memo(TimelineChart);
