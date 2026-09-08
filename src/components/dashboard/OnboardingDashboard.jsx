import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Scan, Sparkles, BarChart2, ShieldCheck, ArrowRight } from 'lucide-react';

function OnboardingDashboard() {
  const steps = [
    {
      step: '01',
      title: 'Initialize Camera',
      desc: 'Launch your webcam with secure, 100% on-device WebGL model inference.',
      icon: Video,
    },
    {
      step: '02',
      title: 'Detect Micro-Expressions',
      desc: 'Real-time classification across 7 discrete facial expression vectors.',
      icon: Scan,
    },
    {
      step: '03',
      title: 'Synthesize Intelligence',
      desc: 'Generate emotional valence scores, duration metrics, and executive summaries.',
      icon: BarChart2,
    },
  ];

  return (
    <div
      className="glass-card"
      style={{
        padding: '36px 32px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(20, 20, 42, 0.95) 0%, rgba(10, 10, 22, 0.98) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
      }}
    >
      {/* Decorative ambient background ring */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Onboarding Header */}
        <div style={{ maxWidth: '640px', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '20px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              marginBottom: '12px',
            }}
          >
            <Sparkles size={11} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '0.04em' }}>
              WELCOME TO EMOTION AI
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(22px, 3.5vw, 30px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text-heading)',
              margin: '0 0 10px',
              lineHeight: 1.2,
            }}
          >
            Your dashboard will come alive after your first analysis session.
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              margin: '0 0 24px',
            }}
          >
            Start your camera to begin collecting real-time expression insights. All facial telemetry is computed locally in your browser and securely organized into historical trends.
          </p>

          <Link to="/live" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
              style={{
                padding: '12px 26px',
                fontSize: '14px',
                fontWeight: 600,
                boxShadow: '0 0 24px rgba(99, 102, 241, 0.4)',
              }}
            >
              <Video size={16} />
              Start First Analysis
              <ArrowRight size={16} />
            </motion.button>
          </Link>
        </div>

        {/* 3 Step Process Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            borderTop: '1px solid var(--border-primary)',
            paddingTop: '24px',
          }}
        >
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--accent-glow)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)' }}>
                    {item.step}
                  </span>
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', margin: '0 0 4px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(OnboardingDashboard);
