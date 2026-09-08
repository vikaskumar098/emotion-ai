/**
 * LocalStorage wrapper for Emotion AI session history (proxies to sessionService)
 */
export {
  getSessions,
  saveSession,
  getSessionById,
  deleteSession,
  clearAllSessions,
} from '../services/sessionService';

/**
 * Generate a unique session ID
 */
export function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

