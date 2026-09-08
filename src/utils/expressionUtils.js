/**
 * Expression utility functions for Emotion AI
 * Maps, calculations, and insight generation from real detection data
 */

export const EXPRESSIONS = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'];

export const EMOJI_MAP = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  fearful: '😨',
  disgusted: '🤢',
  surprised: '😮',
  neutral: '😐',
};

export const EXPRESSION_COLORS = {
  happy: '#22c55e',
  sad: '#3b82f6',
  angry: '#ef4444',
  fearful: '#f59e0b',
  disgusted: '#a855f7',
  surprised: '#f97316',
  neutral: '#64748b',
};

export const EXPRESSION_LABELS = {
  happy: 'Happy',
  sad: 'Sad',
  angry: 'Angry',
  fearful: 'Fearful',
  disgusted: 'Disgusted',
  surprised: 'Surprised',
  neutral: 'Neutral',
};

/**
 * Classify expressions into positive, neutral, negative categories
 */
const POSITIVE = ['happy', 'surprised'];
const NEGATIVE = ['sad', 'angry', 'fearful', 'disgusted'];
const NEUTRAL_EXPRESSIONS = ['neutral'];

/**
 * Get the dominant expression from a detection result
 */
export function getDominantExpression(expressions) {
  if (!expressions) return null;
  let maxKey = null;
  let maxVal = -1;
  for (const key of EXPRESSIONS) {
    if (expressions[key] !== undefined && expressions[key] > maxVal) {
      maxVal = expressions[key];
      maxKey = key;
    }
  }
  return maxKey;
}

/**
 * Get the confidence of the dominant expression
 */
export function getDominantConfidence(expressions) {
  if (!expressions) return 0;
  const dominant = getDominantExpression(expressions);
  return dominant ? expressions[dominant] : 0;
}

/**
 * Calculate expression score (0-100) based on expression probabilities
 * Positive expressions increase score, negative decrease, neutral is middle
 */
export function calculateExpressionScore(distribution) {
  if (!distribution || Object.keys(distribution).length === 0) return 0;

  const total = Object.values(distribution).reduce((s, v) => s + v, 0);
  if (total === 0) return 0;

  let score = 50; // baseline

  for (const [expr, count] of Object.entries(distribution)) {
    const ratio = count / total;
    if (POSITIVE.includes(expr)) {
      score += ratio * 40;
    } else if (NEGATIVE.includes(expr)) {
      score -= ratio * 30;
    }
    // neutral keeps score near baseline
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate category breakdown from distribution
 */
export function getCategoryBreakdown(distribution) {
  if (!distribution) return { positive: 0, neutral: 0, negative: 0 };

  const total = Object.values(distribution).reduce((s, v) => s + v, 0);
  if (total === 0) return { positive: 0, neutral: 0, negative: 0 };

  let positive = 0, neutral = 0, negative = 0;

  for (const [expr, count] of Object.entries(distribution)) {
    const pct = (count / total) * 100;
    if (POSITIVE.includes(expr)) positive += pct;
    else if (NEGATIVE.includes(expr)) negative += pct;
    else if (NEUTRAL_EXPRESSIONS.includes(expr)) neutral += pct;
  }

  return {
    positive: Math.round(positive),
    neutral: Math.round(neutral),
    negative: Math.round(negative),
  };
}

/**
 * Generate AI insights from real session data
 * Uses ethical, expression-based wording — no psychological claims
 */
export function generateInsights(sessionData) {
  if (!sessionData) return [];
  const insights = [];
  const { distribution, averageConfidence, totalDetections, timeline, durationSeconds } = sessionData;

  if (!distribution || totalDetections === 0) {
    return ['Not enough detection data to generate insights.'];
  }

  const total = Object.values(distribution).reduce((s, v) => s + v, 0);
  if (total === 0) return ['No expression data collected during this session.'];

  // Dominant expression
  const sorted = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
  const [dominantExpr, dominantCount] = sorted[0];
  const dominantPct = Math.round((dominantCount / total) * 100);

  insights.push(
    `${EXPRESSION_LABELS[dominantExpr]} was the most frequently detected expression, appearing in ${dominantPct}% of detections.`
  );

  // Second most common
  if (sorted.length > 1 && sorted[1][1] > 0) {
    const [secondExpr, secondCount] = sorted[1];
    const secondPct = Math.round((secondCount / total) * 100);
    insights.push(
      `${EXPRESSION_LABELS[secondExpr]} was the second most common detected expression at ${secondPct}%.`
    );
  }

  // Category analysis
  const categories = getCategoryBreakdown(distribution);
  if (categories.positive > 50) {
    insights.push('Positive facial expressions were detected for the majority of the session.');
  } else if (categories.neutral > 50) {
    insights.push('Neutral facial expressions were detected for most of the session.');
  } else if (categories.negative > 40) {
    insights.push('A notable proportion of detected expressions fell into the negative category.');
  }

  // Confidence
  if (averageConfidence > 0) {
    const confPct = Math.round(averageConfidence * 100);
    if (confPct > 80) {
      insights.push(`Detection confidence was high throughout the session, averaging ${confPct}%.`);
    } else if (confPct > 60) {
      insights.push(`Detection confidence remained moderate, averaging ${confPct}%.`);
    } else {
      insights.push(`Detection confidence was relatively low at ${confPct}%. Consider improving lighting conditions.`);
    }
  }

  // Timeline patterns
  if (timeline && timeline.length > 10) {
    const halfIdx = Math.floor(timeline.length / 2);
    const firstHalf = timeline.slice(0, halfIdx);
    const secondHalf = timeline.slice(halfIdx);

    const countPositiveInSlice = (slice) =>
      slice.filter(e => POSITIVE.includes(e.expression)).length;

    const firstPositive = countPositiveInSlice(firstHalf) / firstHalf.length;
    const secondPositive = countPositiveInSlice(secondHalf) / secondHalf.length;

    if (secondPositive > firstPositive + 0.15) {
      insights.push('Detected expression patterns became more positive during the later part of the session.');
    } else if (firstPositive > secondPositive + 0.15) {
      insights.push('Detected expression patterns were more positive during the earlier part of the session.');
    }
  }

  // Session duration
  if (durationSeconds > 60) {
    const minutes = Math.floor(durationSeconds / 60);
    insights.push(`Session lasted ${minutes} minute${minutes !== 1 ? 's' : ''} with ${totalDetections} total detections.`);
  }

  return insights;
}

/**
 * Format duration in seconds to MM:SS
 */
export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Format time to HH:MM:SS
 */
export function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}
