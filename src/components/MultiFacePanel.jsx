import { memo } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import {
  getDominantExpression,
  getDominantConfidence,
  EMOJI_MAP,
  EXPRESSION_LABELS,
  EXPRESSION_COLORS,
} from '../utils/expressionUtils';

function MultiFacePanel({ detections, embedded = false }) {
  if (!detections || detections.length <= 1) return null;

  const content = (
    <div>
      {!embedded && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Users size={14} style={{ color: 'var(--info)' }} />
          <p className="section-title" style={{ marginBottom: 0 }}>
            Multi-Face Detection ({detections.length} faces)
          </p>
        </div>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '10px',
        }}
      >
        {detections.map((detection, i) => {
          const expr = getDominantExpression(detection.expressions);
          const conf = getDominantConfidence(detection.expressions);

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="stat-card"
              style={{ textAlign: 'center' }}
            >
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Person {i + 1}
              </p>
              <span style={{ fontSize: '28px', display: 'block', marginBottom: '4px' }}>
                {EMOJI_MAP[expr] || '😐'}
              </span>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: EXPRESSION_COLORS[expr] || 'var(--text-heading)',
                }}
              >
                {EXPRESSION_LABELS[expr] || 'Unknown'}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {Math.round(conf * 100)}%
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      {content}
    </div>
  );
}

export default memo(MultiFacePanel);
