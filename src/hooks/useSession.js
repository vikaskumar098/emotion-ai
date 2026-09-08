/**
 * useSession — Session management hook for Emotion AI
 *
 * Tracks session state: timer, expression accumulation, timeline, distribution.
 * Generates session summary on stop and saves to localStorage.
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { getDominantExpression, getDominantConfidence, EXPRESSIONS } from '../utils/expressionUtils';
import { saveSession, generateSessionId } from '../utils/storage';

export default function useSession() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionSummary, setSessionSummary] = useState(null);

  // Accumulated data (via refs to avoid re-renders)
  const sessionDataRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Start a new session
  const startSession = useCallback(() => {
    sessionDataRef.current = {
      id: generateSessionId(),
      startTime: Date.now(),
      distribution: {},
      timeline: [],
      totalDetections: 0,
      confidenceSum: 0,
      maxFaces: 0,
    };

    // Initialize distribution
    for (const expr of EXPRESSIONS) {
      sessionDataRef.current.distribution[expr] = 0;
    }

    startTimeRef.current = Date.now();
    setSessionDuration(0);
    setSessionSummary(null);
    setIsSessionActive(true);

    // Timer
    timerRef.current = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  }, []);

  // Record a detection into the session
  const recordDetection = useCallback((detections) => {
    if (!sessionDataRef.current || !detections || detections.length === 0) return;

    const data = sessionDataRef.current;
    data.totalDetections++;

    // Track max faces
    if (detections.length > data.maxFaces) {
      data.maxFaces = detections.length;
    }

    // Use the first face as primary for distribution/timeline
    const primary = detections[0];
    if (primary && primary.expressions) {
      const dominant = getDominantExpression(primary.expressions);
      const confidence = getDominantConfidence(primary.expressions);

      if (dominant && data.distribution[dominant] !== undefined) {
        data.distribution[dominant]++;
      }

      data.confidenceSum += confidence;

      // Timeline entry (limit to prevent memory growth)
      if (data.timeline.length < 500) {
        data.timeline.push({
          time: Date.now(),
          expression: dominant,
          confidence,
          faceCount: detections.length,
        });
      }
    }
  }, []);

  // Stop session and generate summary
  const stopSession = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsSessionActive(false);

    if (!sessionDataRef.current) return null;

    const data = sessionDataRef.current;
    const durationSeconds = Math.floor((Date.now() - data.startTime) / 1000);

    // Find dominant expression
    let dominantExpr = 'neutral';
    let maxCount = 0;
    for (const [expr, count] of Object.entries(data.distribution)) {
      if (count > maxCount) {
        maxCount = count;
        dominantExpr = expr;
      }
    }

    const summary = {
      id: data.id,
      startTime: data.startTime,
      endTime: Date.now(),
      durationSeconds,
      totalDetections: data.totalDetections,
      averageConfidence: data.totalDetections > 0 ? data.confidenceSum / data.totalDetections : 0,
      distribution: { ...data.distribution },
      timeline: data.timeline,
      dominantExpression: dominantExpr,
      maxFaces: data.maxFaces,
    };

    // Save to localStorage
    saveSession(summary);

    setSessionSummary(summary);
    sessionDataRef.current = null;

    return summary;
  }, []);

  // Get current session data snapshot (for live display)
  const getSessionSnapshot = useCallback(() => {
    if (!sessionDataRef.current) return null;
    const data = sessionDataRef.current;
    return {
      distribution: { ...data.distribution },
      totalDetections: data.totalDetections,
      averageConfidence: data.totalDetections > 0 ? data.confidenceSum / data.totalDetections : 0,
      timeline: data.timeline,
      maxFaces: data.maxFaces,
      durationSeconds: Math.floor((Date.now() - data.startTime) / 1000),
    };
  }, []);

  const dismissSummary = useCallback(() => {
    setSessionSummary(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    isSessionActive,
    sessionDuration,
    sessionSummary,
    startSession,
    stopSession,
    recordDetection,
    getSessionSnapshot,
    dismissSummary,
  };
}
