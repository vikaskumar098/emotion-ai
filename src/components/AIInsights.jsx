import { memo, useMemo } from 'react';
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateInsights } from '../utils/expressionUtils';

function AIInsights({ sessionSnapshot }) {
  const insights = useMemo(() => {
    if (!sessionSnapshot || sessionSnapshot.totalDetections === 0) return [];
    return generateInsights(sessionSnapshot);
  }, [sessionSnapshot]);

  if (insights.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '20px' }}>
        <p className="section-title">AI Insights</p>
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '13px',
          }}
        >
          Insights will be generated as expression data is collected during your session.
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Lightbulb size={14} style={{ color: 'var(--warning)' }} />
        <p className="section-title" style={{ marginBottom: 0 }}>AI Insights</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            style={{
              padding: '10px 14px',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            {insight}
          </motion.div>
        ))}
      </div>
      <p
        style={{
          marginTop: '12px',
          fontSize: '11px',
          color: 'var(--text-muted)',
          fontStyle: 'italic',
        }}
      >
        Insights are based on detected facial expressions, not psychological assessment.
      </p>
    </div>
  );
}

export default memo(AIInsights);
