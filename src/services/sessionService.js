/**
 * sessionService.js — Centralized service for session storage, statistics, and trends
 */
import {
  EXPRESSIONS,
  calculateExpressionScore,
} from '../utils/expressionUtils';

const STORAGE_KEY = 'emotionai_sessions';

/**
 * Retrieve all saved sessions from localStorage (newest first)
 */
export function getSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Retrieve a specific session by ID
 */
export function getSessionById(id) {
  const sessions = getSessions();
  return sessions.find((s) => s.id === id) || null;
}

/**
 * Save a session to localStorage
 */
export function saveSession(session) {
  try {
    const sessions = getSessions();
    sessions.unshift(session);
    if (sessions.length > 50) sessions.length = 50;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete a session by ID
 */
export function deleteSession(id) {
  try {
    const sessions = getSessions().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear all sessions
 */
export function clearAllSessions() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Calculate comprehensive dashboard statistics across all saved sessions
 */
export function calculateStatistics(sessions = []) {
  if (!sessions || sessions.length === 0) {
    return {
      totalSessions: 0,
      totalDetections: 0,
      totalDurationSeconds: 0,
      averageDurationSeconds: 0,
      averageScore: null,
      averageConfidence: null,
      dominantExpression: null,
      dominantPercentage: 0,
      expressionDistribution: EXPRESSIONS.reduce((acc, e) => ({ ...acc, [e]: 0 }), {}),
      recentTrend: [],
      scoreDelta: 0,
      hasData: false,
    };
  }

  let totalDetections = 0;
  let totalDuration = 0;
  let scoreSum = 0;
  let confidenceSum = 0;
  let sessionsWithConfidence = 0;

  const distribution = EXPRESSIONS.reduce((acc, e) => ({ ...acc, [e]: 0 }), {});

  sessions.forEach((s) => {
    totalDuration += s.durationSeconds || 0;
    totalDetections += s.totalDetections || 0;

    const score = s.distribution ? calculateExpressionScore(s.distribution) : 50;
    scoreSum += score;

    if (s.averageConfidence !== undefined && s.averageConfidence > 0) {
      confidenceSum += s.averageConfidence;
      sessionsWithConfidence++;
    }

    if (s.distribution) {
      Object.entries(s.distribution).forEach(([expr, count]) => {
        if (distribution[expr] !== undefined) {
          distribution[expr] += count;
        }
      });
    }
  });

  const averageScore = Math.round(scoreSum / sessions.length);
  const averageConfidence =
    sessionsWithConfidence > 0
      ? Math.round((confidenceSum / sessionsWithConfidence) * 100)
      : null;

  // Find dominant expression across aggregated distribution
  let dominantExpression = 'neutral';
  let maxCount = -1;
  let totalExpressionCounts = 0;

  Object.entries(distribution).forEach(([expr, count]) => {
    totalExpressionCounts += count;
    if (count > maxCount) {
      maxCount = count;
      dominantExpression = expr;
    }
  });

  const dominantPercentage =
    totalExpressionCounts > 0 ? Math.round((maxCount / totalExpressionCounts) * 100) : 0;

  // Chronological trend data (oldest to newest for charts)
  const sortedSessions = [...sessions].sort((a, b) => a.startTime - b.startTime);
  const recentTrend = sortedSessions.map((s) => ({
    id: s.id,
    date: new Date(s.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: new Date(s.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    score: s.distribution ? calculateExpressionScore(s.distribution) : 50,
    dominant: s.dominantExpression || 'neutral',
    duration: s.durationSeconds || 0,
    confidence: Math.round((s.averageConfidence || 0) * 100),
  }));

  // Score delta (comparison between the latest session and the one before it)
  let scoreDelta = 0;
  if (recentTrend.length >= 2) {
    const latest = recentTrend[recentTrend.length - 1].score;
    const prev = recentTrend[recentTrend.length - 2].score;
    scoreDelta = latest - prev;
  }

  return {
    totalSessions: sessions.length,
    totalDetections,
    totalDurationSeconds: totalDuration,
    averageDurationSeconds: Math.round(totalDuration / sessions.length),
    averageScore,
    averageConfidence,
    dominantExpression: totalExpressionCounts > 0 ? dominantExpression : null,
    dominantPercentage,
    expressionDistribution: distribution,
    recentTrend,
    scoreDelta,
    hasData: true,
  };
}

/**
 * Generate ethical, data-driven aggregate insights from calculated stats
 */
export function generateAggregateInsights(stats) {
  if (!stats || !stats.hasData || stats.totalSessions === 0) {
    return [
      'Complete your first analysis session to unlock AI-driven insights.',
      'All facial pattern analysis is performed locally in your browser.',
      'Real-time confidence and valence metrics will appear here automatically.',
    ];
  }

  const insights = [];

  // Insight 1: Dominant expression
  if (stats.dominantExpression) {
    const capitalized =
      stats.dominantExpression.charAt(0).toUpperCase() + stats.dominantExpression.slice(1);
    insights.push(
      `${capitalized} was your most frequently detected expression (${stats.dominantPercentage}% of all detections) across ${stats.totalSessions} recorded sessions.`
    );
  }

  // Insight 2: Confidence
  if (stats.averageConfidence) {
    if (stats.averageConfidence >= 75) {
      insights.push(
        `Detection confidence has remained consistently high at ${stats.averageConfidence}%, ensuring reliable facial pattern tracking.`
      );
    } else {
      insights.push(
        `Average detection confidence is ${stats.averageConfidence}%. Good ambient lighting can enhance detection fidelity.`
      );
    }
  }

  // Insight 3: Trend
  if (stats.recentTrend.length >= 2) {
    if (stats.scoreDelta > 0) {
      insights.push(
        `Your latest session demonstrated a +${stats.scoreDelta} point increase in overall expression score compared to the prior session.`
      );
    } else if (stats.scoreDelta < 0) {
      insights.push(
        `Your recent session reflected a more subdued expression profile (${stats.scoreDelta} points) relative to earlier sessions.`
      );
    } else {
      insights.push(
        'Your expression score has remained remarkably steady across recent recording sessions.'
      );
    }
  }

  // Insight 4: Duration & engagement
  if (stats.totalDurationSeconds > 0) {
    const mins = Math.round(stats.totalDurationSeconds / 60);
    insights.push(
      `You have logged ${mins > 0 ? `${mins} min` : `${stats.totalDurationSeconds}s`} of active expression tracking with ${stats.totalDetections.toLocaleString()} total sample evaluations.`
    );
  }

  return insights;
}
