import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Scan,
  BarChart3,
  Clock,
  Shield,
  Sparkles,
  Activity,
  ChevronDown,
  ArrowRight,
  Eye,
  Cpu,
  Layers,
  TrendingUp,
  Play,
  Menu,
  X,
  CheckCircle2,
  Zap,
  Lock,
  Database,
  Globe,
} from 'lucide-react';

/* ── Animation Variants ─────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] } },
});
const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Section Wrapper ─────────────────────────────────── */
function Section({ children, style, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      style={style}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ── Data ────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Eye,
    color: '#6366f1',
    title: 'Live Expression Detection',
    desc: 'Detect 7 discrete facial expressions in real time using computer vision running entirely in your browser.',
  },
  {
    icon: BarChart3,
    color: '#8b5cf6',
    title: 'Real-Time Analytics',
    desc: 'Watch expression probabilities update live with interactive charts and instant visual feedback.',
  },
  {
    icon: TrendingUp,
    color: '#a78bfa',
    title: 'Expression Timeline',
    desc: 'See how detected expressions evolve and shift throughout an entire session on a live timeline.',
  },
  {
    icon: Activity,
    color: '#6366f1',
    title: 'Session Insights',
    desc: 'Automatically synthesize a completed session into understandable visual analytics and summaries.',
  },
  {
    icon: Sparkles,
    color: '#8b5cf6',
    title: 'Expression Score',
    desc: 'A weighted 0–100 score derived directly from detected expression data — updated every session.',
  },
  {
    icon: Clock,
    color: '#a78bfa',
    title: 'Session History',
    desc: 'Review, compare and export previous analysis sessions with complete expression reports.',
  },
];

const STEPS = [
  {
    num: '01',
    icon: Play,
    title: 'Start Your Camera',
    desc: 'Allow camera access and enter the live analysis experience with one click.',
  },
  {
    num: '02',
    icon: Cpu,
    title: 'AI Detects Expressions',
    desc: 'Computer vision analyzes visible facial geometry in real time to estimate expression states.',
  },
  {
    num: '03',
    icon: BarChart3,
    title: 'Explore Your Insights',
    desc: 'Review expression distribution, timelines, and session analytics instantly after each session.',
  },
];

const TECH = [
  { name: 'React 19', color: '#61dafb', dot: '#61dafb' },
  { name: 'face-api.js', color: '#a78bfa', dot: '#8b5cf6' },
  { name: 'Chart.js', color: '#ff6384', dot: '#ff6384' },
  { name: 'Framer Motion', color: '#f97316', dot: '#f97316' },
  { name: 'Vite', color: '#fbbf24', dot: '#fbbf24' },
  { name: 'jsPDF', color: '#22c55e', dot: '#22c55e' },
  { name: 'Web APIs', color: '#3b82f6', dot: '#3b82f6' },
  { name: 'WebGL', color: '#a855f7', dot: '#a855f7' },
];

/* ── Animated Hero Viz ───────────────────────────────── */
function HeroViz() {
  const [tick, setTick] = useState(0);
  const expressions = [
    { label: 'Happy', pct: 87, color: '#22c55e', emoji: '😊' },
    { label: 'Neutral', pct: 8, color: '#64748b', emoji: '😐' },
    { label: 'Surprised', pct: 5, color: '#f97316', emoji: '😮' },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % expressions.length), 3000);
    return () => clearInterval(id);
  }, []);

  const scanY = ((tick % 100) / 100) * 100;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
      }}
    >
      {/* Floating Card: Expression Score */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-24px',
          right: '-20px',
          background: 'rgba(15,15,30,0.95)',
          border: '1px solid rgba(99,102,241,0.35)',
          borderRadius: '12px',
          padding: '10px 16px',
          backdropFilter: 'blur(20px)',
          zIndex: 10,
          boxShadow: '0 8px 30px rgba(99,102,241,0.2)',
        }}
      >
        <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.06em', fontWeight: 600 }}>EXPRESSION SCORE</div>
        <div style={{ fontSize: '26px', fontWeight: 800, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>87</div>
        <div style={{ fontSize: '9px', color: '#22c55e', fontWeight: 600 }}>/ 100</div>
      </motion.div>

      {/* Floating Card: Faces */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '-28px',
          background: 'rgba(15,15,30,0.95)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: '12px',
          padding: '10px 14px',
          backdropFilter: 'blur(20px)',
          zIndex: 10,
          boxShadow: '0 8px 24px rgba(34,197,94,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '16px' }}>👤</span>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#f1f5f9' }}>1 Face</div>
          <div style={{ fontSize: '9px', color: '#22c55e', fontWeight: 600 }}>DETECTED</div>
        </div>
      </motion.div>

      {/* Floating Card: Confidence */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{
          position: 'absolute',
          bottom: '-12px',
          right: '10px',
          background: 'rgba(15,15,30,0.95)',
          border: '1px solid rgba(139,92,246,0.35)',
          borderRadius: '12px',
          padding: '10px 14px',
          backdropFilter: 'blur(20px)',
          zIndex: 10,
          boxShadow: '0 8px 24px rgba(139,92,246,0.15)',
        }}
      >
        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, letterSpacing: '0.06em' }}>CONFIDENCE</div>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#a78bfa' }}>92%</div>
      </motion.div>

      {/* Main Camera Frame */}
      <div
        style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(99,102,241,0.25)',
          background: 'rgba(10,10,20,0.9)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(99,102,241,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 10px rgba(34,197,94,0.8)',
                animation: 'pulse 1.5s infinite',
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#22c55e', letterSpacing: '0.08em' }}>
              AI VISION ACTIVE
            </span>
          </div>
          <div
            style={{
              fontSize: '10px',
              color: '#64748b',
              fontFamily: 'monospace',
              background: 'rgba(255,255,255,0.04)',
              padding: '3px 8px',
              borderRadius: '4px',
            }}
          >
            PREVIEW
          </div>
        </div>

        {/* Camera View Area */}
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(180deg, rgba(10,10,25,0.98) 0%, rgba(8,8,18,1) 100%)',
            height: '260px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Grid pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Radial glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Scan line */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '1px',
              top: `${scanY}%`,
              background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Face silhouette */}
          <div style={{ position: 'relative', zIndex: 3 }}>
            {/* Detection box */}
            <div
              style={{
                position: 'absolute',
                inset: '-20px',
                border: '1.5px solid rgba(99,102,241,0.6)',
                borderRadius: '4px',
                animation: 'detectPulse 2.5s ease-in-out infinite',
              }}
            />
            {/* Corner accents */}
            {[
              { top: '-22px', left: '-22px', borderTop: '2px solid #6366f1', borderLeft: '2px solid #6366f1' },
              { top: '-22px', right: '-22px', borderTop: '2px solid #6366f1', borderRight: '2px solid #6366f1' },
              { bottom: '-22px', left: '-22px', borderBottom: '2px solid #6366f1', borderLeft: '2px solid #6366f1' },
              { bottom: '-22px', right: '-22px', borderBottom: '2px solid #6366f1', borderRight: '2px solid #6366f1' },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '14px',
                  height: '14px',
                  borderRadius: '2px',
                  ...s,
                }}
              />
            ))}

            {/* Face emoji */}
            <div style={{ fontSize: '80px', lineHeight: 1, display: 'block', textAlign: 'center' }}>
              {expressions[active].emoji}
            </div>
          </div>

          {/* Expression label overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              zIndex: 4,
            }}
          >
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: expressions[active].color,
                textShadow: `0 0 20px ${expressions[active].color}80`,
              }}
            >
              {expressions[active].label.toUpperCase()}
            </motion.div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                background: 'rgba(0,0,0,0.5)',
                border: `1px solid ${expressions[active].color}30`,
                borderRadius: '20px',
              }}
            >
              <div
                style={{
                  width: `${expressions[active].pct * 0.6}px`,
                  height: '3px',
                  borderRadius: '2px',
                  background: expressions[active].color,
                  maxWidth: '52px',
                  transition: 'all 0.5s ease',
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 700, color: expressions[active].color }}>
                {expressions[active].pct}%
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
          {expressions.map((e, i) => (
            <div
              key={e.label}
              style={{
                flex: 1,
                background: i === active ? `${e.color}12` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${i === active ? `${e.color}30` : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '8px',
                padding: '8px',
                transition: 'all 0.4s ease',
              }}
            >
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{e.label}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: i === active ? e.color : '#334155' }}>
                {e.pct}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Product Preview Mock Dashboard ────────────────── */
function ProductPreview() {
  const [barTick, setBarTick] = useState(0);
  const emotions = [
    { label: 'Happy', pct: 42, color: '#22c55e' },
    { label: 'Neutral', pct: 30, color: '#64748b' },
    { label: 'Surprised', pct: 15, color: '#f97316' },
    { label: 'Sad', pct: 8, color: '#3b82f6' },
    { label: 'Angry', pct: 5, color: '#ef4444' },
  ];

  useEffect(() => {
    const id = setInterval(() => setBarTick((t) => (t + 1) % 60), 300);
    return () => clearInterval(id);
  }, []);

  const animatedPcts = emotions.map((e, i) => {
    const noise = Math.sin(barTick * 0.2 + i * 1.5) * 4;
    return Math.max(1, Math.round(e.pct + noise));
  });

  return (
    <div
      style={{
        background: 'rgba(10,10,20,0.9)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '20px',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      {/* Mock header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(99,102,241,0.05)',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#475569', fontWeight: 500 }}>
          Emotion AI — Live Analysis Preview
        </div>
        <div
          style={{
            padding: '3px 10px',
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#22c55e',
              animation: 'pulse 1.5s infinite',
            }}
          />
          DEMO
        </div>
      </div>

      {/* Mock content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0' }}>
        {/* Left: camera + expression */}
        <div style={{ padding: '20px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Fake camera */}
          <div
            style={{
              background: 'rgba(5,5,14,0.8)',
              borderRadius: '12px',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(99,102,241,0.15)',
              marginBottom: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            <span style={{ fontSize: '60px', position: 'relative', zIndex: 1 }}>😊</span>
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '11px',
                fontWeight: 700,
                color: '#22c55e',
                letterSpacing: '0.08em',
                background: 'rgba(0,0,0,0.6)',
                padding: '3px 10px',
                borderRadius: '4px',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              HAPPY · 87%
            </div>
          </div>

          {/* Mini stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { label: 'Expr. Score', val: '84', color: '#6366f1' },
              { label: 'Confidence', val: '87%', color: '#22c55e' },
            ].map(({ label, val, color }) => (
              <div
                key={label}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: bars */}
        <div style={{ padding: '20px' }}>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#64748b',
              letterSpacing: '0.08em',
              marginBottom: '14px',
              textTransform: 'uppercase',
            }}
          >
            Expression Distribution
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {emotions.map((e, i) => (
              <div key={e.label}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>{e.label}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: e.color }}>{animatedPcts[i]}%</span>
                </div>
                <div
                  style={{
                    height: '5px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${animatedPcts[i]}%`,
                      background: e.color,
                      borderRadius: '3px',
                      transition: 'width 0.3s ease',
                      boxShadow: `0 0 6px ${e.color}60`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '10px',
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.15)',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#94a3b8',
              lineHeight: 1.5,
            }}
          >
            💡 Positive expressions detected for 42% of sample frames.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Navbar ────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Technology', href: '#technology' },
    { label: 'About', href: '#about' },
  ];

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 clamp(20px, 5vw, 60px)',
          transition: 'all 0.3s ease',
          background: scrolled ? 'rgba(7,7,14,0.94)' : 'rgba(7,7,14,0.4)',
          backdropFilter: scrolled ? 'blur(24px)' : 'blur(8px)',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'blur(8px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}
          aria-label="Emotion AI home"
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#a78bfa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99,102,241,0.4)',
              flexShrink: 0,
            }}
          >
            <Activity size={18} color="white" />
          </div>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: '#f1f5f9',
            }}
          >
            EMOTION AI
          </span>
        </Link>

        {/* Desktop links */}
        <div
          className="nav-desktop-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            margin: '0 auto',
          }}
        >
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#94a3b8',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                transition: 'all 0.15s ease',
              }}
              className="nav-link"
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <Link to="/dashboard" className="nav-dash-link" style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#64748b',
                padding: '6px 14px',
              }}
              className="nav-link"
            >
              Dashboard
            </span>
          </Link>
          <Link to="/live" style={{ textDecoration: 'none' }}>
            <button
              className="btn-primary"
              style={{ padding: '9px 20px', fontSize: '13px', fontWeight: 600 }}
              aria-label="Try Live Analysis"
            >
              Try Live Analysis
              <ArrowRight size={14} />
            </button>
          </Link>
          {/* Mobile hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen((o) => !o)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
            }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            zIndex: 999,
            background: 'rgba(7,7,14,0.98)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '20px 24px 28px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#94a3b8',
                  textDecoration: 'none',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {label}
              </a>
            ))}
            <Link to="/live" style={{ textDecoration: 'none', marginTop: '16px' }}>
              <button
                className="btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: '15px', fontWeight: 600 }}
                onClick={() => setMobileOpen(false)}
              >
                Try Live Analysis →
              </button>
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .nav-link:hover { color: #f1f5f9 !important; background: rgba(255,255,255,0.05) !important; }
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-dash-link { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}

/* ── Main Landing Page ───────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--bg-primary)',
        overflowX: 'hidden',
        fontFamily: 'var(--font-family)',
      }}
    >
      {/* Skip nav for accessibility */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          top: '-100px',
          left: '20px',
          background: '#6366f1',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: '6px',
          zIndex: 9999,
          fontSize: '14px',
          textDecoration: 'none',
        }}
        className="skip-nav"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        {/* ── HERO ──────────────────────────────────────── */}
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            paddingTop: '80px',
          }}
        >
          {/* Background effects */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black 30%, transparent 100%)',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-200px',
              right: '-200px',
              width: '800px',
              height: '800px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 65%)',
              pointerEvents: 'none',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '-100px',
              left: '-150px',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 60px)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(40px, 6vw, 80px)',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
              width: '100%',
            }}
            className="hero-grid"
          >
            {/* Left: Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '20px',
                    marginBottom: '28px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#a78bfa',
                    letterSpacing: '0.04em',
                  }}
                >
                  <Sparkles size={12} />
                  AI-POWERED EXPRESSION INTELLIGENCE
                </div>

                <h1
                  style={{
                    fontSize: 'clamp(36px, 4.5vw, 62px)',
                    fontWeight: 800,
                    lineHeight: 1.08,
                    letterSpacing: '-0.03em',
                    color: '#f1f5f9',
                    marginBottom: '24px',
                  }}
                >
                  See What Your Face{' '}
                  <br />
                  Is Expressing —{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    In Real Time.
                  </span>
                </h1>

                <p
                  style={{
                    fontSize: 'clamp(15px, 1.6vw, 18px)',
                    color: '#94a3b8',
                    lineHeight: 1.7,
                    maxWidth: '480px',
                    marginBottom: '36px',
                  }}
                >
                  AI-powered facial expression analysis that turns live camera input into
                  clear, visual insights — running entirely in your browser.
                </p>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Link to="/live" style={{ textDecoration: 'none' }}>
                    <motion.button
                      className="btn-primary"
                      whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(99,102,241,0.4)' }}
                      whileTap={{ scale: 0.97 }}
                      style={{ padding: 'clamp(12px,1.5vw,14px) clamp(24px,2.5vw,32px)', fontSize: 'clamp(14px,1.3vw,16px)', fontWeight: 600 }}
                      aria-label="Start Live Analysis"
                    >
                      Start Live Analysis
                      <ArrowRight size={18} />
                    </motion.button>
                  </Link>
                  <a
                    href="#how-it-works"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#64748b',
                      textDecoration: 'none',
                      fontWeight: 500,
                      transition: 'color 0.15s',
                    }}
                    className="hero-secondary-cta"
                  >
                    Explore How It Works
                    <ChevronDown size={16} />
                  </a>
                </div>

                {/* Social proof strip */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginTop: '40px',
                    paddingTop: '28px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    flexWrap: 'wrap',
                  }}
                >
                  {[
                    { value: '7', label: 'Expression Classes' },
                    { value: '100%', label: 'Browser-Based' },
                    { value: 'Real-Time', label: 'Processing' },
                  ].map(({ value, label }) => (
                    <div key={label}>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9' }}>{value}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Hero Viz */}
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'relative' }}
            >
              <HeroViz />
            </motion.div>
          </div>
        </section>

        {/* ── TRUST STRIP ─────────────────────────────── */}
        <section
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.015)',
            padding: 'clamp(24px,4vw,36px) clamp(20px,5vw,60px)',
          }}
        >
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              { icon: Eye, label: 'Real-Time', sub: 'Facial Analysis', color: '#6366f1' },
              { icon: BarChart3, label: 'Visual', sub: 'AI Insights', color: '#8b5cf6' },
              { icon: Clock, label: 'Session', sub: 'Analytics', color: '#a78bfa' },
              { icon: Shield, label: 'Privacy-Conscious', sub: 'Processing', color: '#22c55e' },
            ].map(({ icon: Icon, label, sub, color }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${color}12`,
                    border: `1px solid ${color}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{label}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── WHY EMOTION AI ───────────────────────────── */}
        <Section
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,60px)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }} className="why-grid">
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#6366f1',
                  marginBottom: '16px',
                }}
              >
                Why Emotion AI?
              </div>
              <h2
                style={{
                  fontSize: 'clamp(26px,3vw,40px)',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  color: '#f1f5f9',
                  lineHeight: 1.15,
                  marginBottom: '24px',
                }}
              >
                Your Camera Sees a Face.{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Emotion AI Turns It Into Data.
                </span>
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  color: '#94a3b8',
                  lineHeight: 1.75,
                  maxWidth: '440px',
                  marginBottom: '28px',
                }}
              >
                Emotion AI uses computer vision and facial-expression classification to
                visualize detected expressions in real time. Every frame captured by your
                camera is analyzed locally — producing immediate, interpretable insights
                without any server-side processing.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Detects 7 discrete expression classes per frame',
                  'Aggregates data into timeline and session reports',
                  'Presents results as visual analytics — never raw coordinates',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle2 size={16} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: Scan, title: 'Detect', desc: 'Computer vision classifies visible facial expressions from live camera input.', color: '#6366f1' },
                { icon: BarChart3, title: 'Visualize', desc: 'Expression data is transformed into readable charts and probability scores.', color: '#8b5cf6' },
                { icon: TrendingUp, title: 'Understand', desc: 'Session analytics, timelines and AI insights help you explore the patterns.', color: '#a78bfa' },
              ].map(({ icon: Icon, title, desc, color }) => (
                <motion.div
                  key={title}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '18px 20px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: `${color}12`,
                      border: `1px solid ${color}25`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>{title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── FEATURES ─────────────────────────────────── */}
        <section
          id="features"
          style={{
            background: 'rgba(255,255,255,0.01)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,60px)',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              style={{ textAlign: 'center', marginBottom: '52px' }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: '#6366f1',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                Capabilities
              </div>
              <h2
                style={{
                  fontSize: 'clamp(26px,3vw,42px)',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  color: '#f1f5f9',
                  marginBottom: '14px',
                }}
              >
                Everything You Need to Understand the Moment.
              </h2>
              <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '520px', margin: '0 auto' }}>
                Purpose-built for real-time expression analysis, with every feature designed to turn detection data into visual insight.
              </p>
            </motion.div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
              }}
            >
              {FEATURES.map(({ icon: Icon, color, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger(i * 0.07)}
                  whileHover={{ y: -4, borderColor: `${color}40` }}
                  style={{
                    padding: '28px',
                    background: 'rgba(10,10,20,0.7)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(10px)',
                    cursor: 'default',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: `${color}12`,
                      border: `1px solid ${color}25`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '18px',
                    }}
                  >
                    <Icon size={20} color={color} />
                  </div>
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#f1f5f9',
                      marginBottom: '8px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCT PREVIEW ──────────────────────────── */}
        <Section
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,60px)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#6366f1',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              Product Preview
            </div>
            <h2
              style={{
                fontSize: 'clamp(26px,3vw,42px)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: '#f1f5f9',
                marginBottom: '14px',
              }}
            >
              Watch Intelligence Happen.
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '480px', margin: '0 auto' }}>
              A preview of the live analysis interface — showing real UI elements, expression probabilities, and detection analytics.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={scaleIn}
          >
            <ProductPreview />
          </motion.div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/live" style={{ textDecoration: 'none' }}>
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.04, boxShadow: '0 8px 40px rgba(99,102,241,0.45)' }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: '14px 36px', fontSize: '15px', fontWeight: 600 }}
              >
                Try It Yourself
                <ArrowRight size={17} />
              </motion.button>
            </Link>
          </div>
        </Section>

        {/* ── HOW IT WORKS ─────────────────────────────── */}
        <section
          id="how-it-works"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.01)',
            padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,60px)',
          }}
        >
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              style={{ textAlign: 'center', marginBottom: '60px' }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: '#6366f1',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                How It Works
              </div>
              <h2
                style={{
                  fontSize: 'clamp(26px,3vw,42px)',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  color: '#f1f5f9',
                }}
              >
                From Camera to Insight in Seconds.
              </h2>
            </motion.div>

            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="steps-grid">
              {/* Connection line */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '40px',
                  left: 'calc(16.66% + 16px)',
                  right: 'calc(16.66% + 16px)',
                  height: '1px',
                  background: 'linear-gradient(90deg, rgba(99,102,241,0.5), rgba(139,92,246,0.5))',
                  zIndex: 0,
                }}
                className="steps-line"
              />

              {STEPS.map(({ num, icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger(i * 0.15)}
                  style={{
                    textAlign: 'center',
                    padding: '32px 20px',
                    background: 'rgba(10,10,22,0.7)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: '18px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.15))',
                      border: '1px solid rgba(99,102,241,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      boxShadow: '0 0 20px rgba(99,102,241,0.15)',
                    }}
                  >
                    <Icon size={22} color="#8b5cf6" />
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#6366f1',
                      letterSpacing: '0.1em',
                      marginBottom: '8px',
                    }}
                  >
                    STEP {num}
                  </div>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#f1f5f9',
                      marginBottom: '10px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              style={{ textAlign: 'center', marginTop: '48px' }}
            >
              <Link to="/live" style={{ textDecoration: 'none' }}>
                <button
                  className="btn-primary"
                  style={{ padding: '13px 32px', fontSize: '15px', fontWeight: 600 }}
                >
                  Launch Live Analysis
                  <ArrowRight size={16} />
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── LIVE CTA BAND ────────────────────────────── */}
        <section
          style={{
            padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,60px)',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          {/* Background glow */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '20px',
                marginBottom: '24px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#a78bfa',
                letterSpacing: '0.06em',
              }}
            >
              <Zap size={11} />
              BROWSER-NATIVE AI
            </div>

            <h2
              style={{
                fontSize: 'clamp(32px,4vw,56px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#f1f5f9',
                lineHeight: 1.1,
                marginBottom: '20px',
              }}
            >
              Your Face.{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Your Data.
              </span>
              <br />
              Your Insights.
            </h2>

            <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.65, marginBottom: '36px' }}>
              Experience real-time facial expression analysis directly in your browser.
              No downloads, no accounts, no data leaving your device.
            </p>

            <Link to="/live" style={{ textDecoration: 'none' }}>
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.04, boxShadow: '0 12px 50px rgba(99,102,241,0.5)' }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: '16px 44px', fontSize: '16px', fontWeight: 700 }}
              >
                Launch Live Analysis
                <ArrowRight size={18} />
              </motion.button>
            </Link>
          </motion.div>
        </section>

        {/* ── PRIVACY SECTION ──────────────────────────── */}
        <Section
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.01)',
            padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,60px)',
          }}
        >
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '60px',
              alignItems: 'center',
            }}
            className="privacy-grid"
          >
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: '#22c55e',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                }}
              >
                Privacy Architecture
              </div>
              <h2
                style={{
                  fontSize: 'clamp(26px,3vw,40px)',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  color: '#f1f5f9',
                  lineHeight: 1.15,
                  marginBottom: '20px',
                }}
              >
                Built With Privacy in Mind.
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  color: '#94a3b8',
                  lineHeight: 1.75,
                  marginBottom: '30px',
                }}
              >
                Whenever supported by the current application architecture, camera
                processing happens locally in the browser. Your camera feed is not
                automatically uploaded simply because you use the interface.
                Detection runs client-side — your video stream stays with you.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { icon: Lock, color: '#22c55e', title: 'Browser-based processing', desc: 'AI inference runs in WebGL/WebAssembly inside your browser tab.' },
                  { icon: Shield, color: '#6366f1', title: 'Privacy-conscious design', desc: 'No automatic data collection or server-side storage by default.' },
                  { icon: Database, color: '#8b5cf6', title: 'User-controlled session data', desc: 'Session history is stored locally in your browser — you decide when to export or clear it.' },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '9px',
                        background: `${color}12`,
                        border: `1px solid ${color}25`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <Icon size={16} color={color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '3px' }}>{title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy visual */}
            <div
              style={{
                background: 'rgba(10,10,22,0.8)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 20px 60px rgba(34,197,94,0.06)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  margin: '0 auto 24px',
                  boxShadow: '0 0 30px rgba(34,197,94,0.2)',
                }}
              >
                <Shield size={28} color="#22c55e" />
              </div>
              <h3 style={{ textAlign: 'center', fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '24px' }}>
                Processing Architecture
              </h3>
              {[
                { step: '01', desc: 'Camera stream captured by Web API', color: '#6366f1' },
                { step: '02', desc: 'face-api.js processes frames in WebGL', color: '#8b5cf6' },
                { step: '03', desc: 'Expression scores generated in-browser', color: '#a78bfa' },
                { step: '04', desc: 'Results displayed — no external calls', color: '#22c55e' },
              ].map(({ step, desc, color }, i) => (
                <div key={step} style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: i < 3 ? '16px' : 0 }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: `${color}15`,
                      border: `1px solid ${color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 700,
                      color,
                      flexShrink: 0,
                    }}
                  >
                    {step}
                  </div>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── TECHNOLOGY ──────────────────────────────── */}
        <section
          id="technology"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,60px)',
          }}
        >
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: '#6366f1',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                Technology
              </div>
              <h2
                style={{
                  fontSize: 'clamp(26px,3vw,42px)',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  color: '#f1f5f9',
                  marginBottom: '14px',
                }}
              >
                Built With Modern Web AI.
              </h2>
              <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '480px', margin: '0 auto 48px' }}>
                Every technology in the stack is actually present in the codebase — no marketing fiction.
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {TECH.map(({ name, color, dot }, i) => (
                  <motion.div
                    key={name}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger(i * 0.06)}
                    whileHover={{ y: -3, borderColor: `${color}50` }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      background: `${color}08`,
                      border: `1px solid ${color}20`,
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color,
                      cursor: 'default',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: dot,
                        flexShrink: 0,
                      }}
                    />
                    {name}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── ABOUT / MISSION ──────────────────────────── */}
        <Section
          id="about"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.01)',
            padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,60px)',
          }}
        >
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))',
                border: '1px solid rgba(99,102,241,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 0 30px rgba(99,102,241,0.15)',
              }}
            >
              <Globe size={24} color="#8b5cf6" />
            </div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#6366f1',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              About
            </div>
            <h2
              style={{
                fontSize: 'clamp(24px,3vw,38px)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: '#f1f5f9',
                marginBottom: '20px',
                lineHeight: 1.15,
              }}
            >
              Making Facial-Expression Intelligence{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Accessible.
              </span>
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: '#94a3b8',
                lineHeight: 1.75,
                marginBottom: '24px',
              }}
            >
              Emotion AI focuses on turning computer-vision detection into a simple,
              understandable visual experience. It classifies detected facial expressions —
              not internal states, not intentions. The platform is a demonstration of
              what modern browser AI can accomplish without any backend infrastructure.
            </p>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.65, fontStyle: 'italic' }}>
              Note: This product classifies facial expressions as detected by computer vision.
              Detected expressions are estimates based on visible facial geometry, not
              psychological diagnoses or accurate representations of internal emotional states.
            </p>
          </div>
        </Section>

        {/* ── FINAL CTA ────────────────────────────────── */}
        <section
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            padding: 'clamp(80px,10vw,130px) clamp(20px,5vw,60px)',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          {/* Rich background */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-120px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}
          >
            <h2
              style={{
                fontSize: 'clamp(32px,4.5vw,60px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#f1f5f9',
                lineHeight: 1.08,
                marginBottom: '20px',
              }}
            >
              Curious What Your{' '}
              <br />
              Camera Can{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Detect?
              </span>
            </h2>
            <p
              style={{
                fontSize: 'clamp(15px,1.6vw,18px)',
                color: '#94a3b8',
                lineHeight: 1.65,
                marginBottom: '40px',
              }}
            >
              Start a live analysis and explore your expression data in seconds.
              No account required. No data leaves your browser.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/live" style={{ textDecoration: 'none' }}>
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.05, boxShadow: '0 14px 50px rgba(99,102,241,0.55)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{ padding: '16px 48px', fontSize: '16px', fontWeight: 700 }}
                >
                  Start Live Analysis
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <motion.button
                  className="btn-secondary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ padding: '16px 32px', fontSize: '16px', fontWeight: 600 }}
                >
                  Explore Dashboard
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER ───────────────────────────────────── */}
        <footer
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: 'clamp(40px,6vw,64px) clamp(20px,5vw,60px) clamp(28px,4vw,40px)',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '40px', marginBottom: '48px' }} className="footer-grid">
              {/* Brand */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 16px rgba(99,102,241,0.35)',
                    }}
                  >
                    <Activity size={16} color="white" />
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '0.04em' }}>
                    EMOTION AI
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.65, maxWidth: '280px' }}>
                  Real-time facial expression intelligence.
                  Browser-native AI analysis — no servers, no accounts.
                </p>
              </div>

              {/* Navigation */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
                  Platform
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Dashboard', to: '/dashboard' },
                    { label: 'Live Analysis', to: '/live' },
                    { label: 'History', to: '/history' },
                    { label: 'Reports', to: '/reports' },
                    { label: 'About', to: '/about' },
                  ].map(({ label, to }) => (
                    <Link
                      key={label}
                      to={to}
                      style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }}
                      className="footer-link"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Legal & Tech */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
                  More
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Technology', href: '#technology' },
                    { label: 'Privacy Architecture', href: '#' },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none', fontWeight: 500 }}
                      className="footer-link"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <p style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                © 2026 Emotion AI. Built with React &amp; face-api.js.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 6px rgba(34,197,94,0.6)',
                  }}
                />
                <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                  AI ENGINE OPERATIONAL
                </span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Global styles */}
      <style>{`
        @keyframes detectPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(99,102,241,0.3); }
          50% { opacity: 0.7; box-shadow: 0 0 12px 4px rgba(99,102,241,0.15); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(34,197,94,0); }
        }
        .hero-secondary-cta:hover { color: #f1f5f9 !important; }
        .footer-link:hover { color: #f1f5f9 !important; }
        .skip-nav:focus { top: 16px !important; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-grid > div:first-child { display: flex; flex-direction: column; align-items: center; }
          .why-grid { grid-template-columns: 1fr !important; }
          .privacy-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .steps-line { display: none !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
