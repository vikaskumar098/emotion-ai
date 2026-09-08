import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSessions, calculateStatistics } from '../services/sessionService';

import WelcomeHero from '../components/dashboard/WelcomeHero';
import MetricCards from '../components/dashboard/MetricCards';
import ExpressionOverview from '../components/dashboard/ExpressionOverview';
import ExpressionTrend from '../components/dashboard/ExpressionTrend';
import LiveAnalysisCard from '../components/dashboard/LiveAnalysisCard';
import RecentSessions from '../components/dashboard/RecentSessions';
import AIInsightsCard from '../components/dashboard/AIInsightsCard';
import QuickActions from '../components/dashboard/QuickActions';
import SystemStatus from '../components/dashboard/SystemStatus';
import OnboardingDashboard from '../components/dashboard/OnboardingDashboard';

export default function Dashboard() {
  const [sessions, setSessions] = useState(() => getSessions());

  // Reload session data whenever dashboard mounts
  useEffect(() => {
    setSessions(getSessions());
  }, []);

  // Calculate statistics across real sessions
  const stats = useMemo(() => {
    return calculateStatistics(sessions);
  }, [sessions]);

  const hasSessions = sessions.length > 0;

  return (
    <div
      className="page-container dashboard-page"
      style={{
        maxWidth: '1400px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* 1. Welcome / Hero Section */}
      <WelcomeHero sessionCount={sessions.length} />

      {/* 2. Key Metric Cards (4 cards) */}
      <MetricCards stats={stats} />

      {/* 3. Main Analytics / Onboarding */}
      {!hasSessions ? (
        /* Zero-state onboarding walkthrough */
        <OnboardingDashboard />
      ) : (
        <>
          {/* Expression Analytics Grid: Overview + Trend */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.2fr)',
              gap: '16px',
              alignItems: 'stretch',
            }}
            className="dashboard-analytics-grid"
          >
            <ExpressionOverview distribution={stats.expressionDistribution} />
            <ExpressionTrend trendData={stats.recentTrend} />
          </div>

          {/* Secondary Grid: Live Analysis CTA + AI Insights */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.2fr)',
              gap: '16px',
              alignItems: 'stretch',
            }}
            className="dashboard-secondary-grid"
          >
            <LiveAnalysisCard />
            <AIInsightsCard stats={stats} />
          </div>

          {/* Recent Sessions List */}
          <RecentSessions sessions={sessions} />
        </>
      )}

      {/* Quick Actions (always visible) */}
      <QuickActions />

      {/* Verified System Status Bar */}
      <SystemStatus />

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 1024px) {
          .dashboard-analytics-grid,
          .dashboard-secondary-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
