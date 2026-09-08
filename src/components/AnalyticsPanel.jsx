import { memo, useMemo } from 'react';
import { Smile, Target, TrendingUp, Crown, Users, Clock } from 'lucide-react';
import EmotionCard from './ui/EmotionCard';
import {
  getDominantExpression,
  getDominantConfidence,
  EMOJI_MAP,
  EXPRESSION_LABELS,
  EXPRESSION_COLORS,
  calculateExpressionScore,
  formatDuration,
} from '../utils/expressionUtils';

function AnalyticsPanel({ detections, sessionSnapshot, sessionDuration, isSessionActive }) {
  const primaryDetection = detections?.[0];
  const dominantExpr = primaryDetection ? getDominantExpression(primaryDetection.expressions) : null;
  const confidence = primaryDetection ? getDominantConfidence(primaryDetection.expressions) : 0;

  const score = useMemo(() => {
    if (sessionSnapshot?.distribution) {
      return calculateExpressionScore(sessionSnapshot.distribution);
    }
    return 0;
  }, [sessionSnapshot?.distribution]);

  // Find session dominant
  const sessionDominant = useMemo(() => {
    if (!sessionSnapshot?.distribution) return null;
    const entries = Object.entries(sessionSnapshot.distribution);
    let max = ['neutral', 0];
    for (const entry of entries) {
      if (entry[1] > max[1]) max = entry;
    }
    return max[1] > 0 ? max[0] : null;
  }, [sessionSnapshot?.distribution]);

  const cards = [
    {
      icon: <Smile size={18} />,
      label: 'Current Expression',
      value: dominantExpr
        ? `${EMOJI_MAP[dominantExpr]} ${EXPRESSION_LABELS[dominantExpr]}`
        : '—',
      color: dominantExpr ? EXPRESSION_COLORS[dominantExpr] : undefined,
    },
    {
      icon: <Target size={18} />,
      label: 'Confidence',
      value: dominantExpr ? `${Math.round(confidence * 100)}%` : '—',
      color: confidence > 0.7 ? 'var(--success)' : confidence > 0.4 ? 'var(--warning)' : undefined,
    },
    {
      icon: <TrendingUp size={18} />,
      label: 'Expression Score',
      value: isSessionActive && score > 0 ? `${score} / 100` : '—',
      subValue: isSessionActive
        ? score > 70 ? 'Positive trend' : score > 40 ? 'Balanced' : 'Observing...'
        : undefined,
      color: score > 70 ? 'var(--success)' : score > 40 ? 'var(--warning)' : undefined,
    },
    {
      icon: <Crown size={18} />,
      label: 'Dominant Expression',
      value: sessionDominant
        ? `${EMOJI_MAP[sessionDominant]} ${EXPRESSION_LABELS[sessionDominant]}`
        : '—',
      color: sessionDominant ? EXPRESSION_COLORS[sessionDominant] : undefined,
    },
    {
      icon: <Users size={18} />,
      label: 'Detected Faces',
      value: detections?.length > 0 ? String(detections.length) : '—',
      color: detections?.length > 1 ? 'var(--info)' : undefined,
    },
    {
      icon: <Clock size={18} />,
      label: 'Session Duration',
      value: isSessionActive ? formatDuration(sessionDuration) : '—',
      subValue: isSessionActive ? `${sessionSnapshot?.totalDetections || 0} detections` : undefined,
    },
  ];

  return (
    <div>
      <p className="section-title">Real-Time Analytics</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
        }}
      >
        {cards.map((card, i) => (
          <EmotionCard key={card.label} {...card} delay={i * 0.04} />
        ))}
      </div>
    </div>
  );
}

export default memo(AnalyticsPanel);
