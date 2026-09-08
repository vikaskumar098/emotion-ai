import { motion } from 'framer-motion';
import { Activity, Shield, Code2, ExternalLink } from 'lucide-react';

const TECH = [
  { name: 'React', description: 'UI library for component-based architecture', version: '19' },
  { name: 'face-api.js', description: 'Face detection and expression recognition models', version: '0.22' },
  { name: 'Chart.js', description: 'Interactive data visualization for expression analytics', version: '4' },
  { name: 'Tailwind CSS', description: 'Utility-first CSS framework for styling', version: '4' },
  { name: 'Framer Motion', description: 'Production-ready animation library', version: '11' },
  { name: 'Vite', description: 'Next-generation frontend build tool', version: '8' },
  { name: 'jsPDF', description: 'Client-side PDF report generation', version: '2' },
];

export default function About() {
  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '40px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Activity size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
              EMOTION AI
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Real-Time Facial Expression Intelligence Platform
            </p>
          </div>
        </div>

        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
          Emotion AI uses computer vision and facial-expression classification to provide
          real-time expression analytics. The platform detects faces in live video feeds,
          classifies facial expressions across seven categories, and generates visual
          analytics and insights — all processed locally in your browser.
        </p>

        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Built as a demonstration of modern AI capabilities in the browser, Emotion AI
          combines TinyFaceDetector for efficient face detection with expression recognition
          models to deliver responsive, real-time analysis without any server-side processing.
        </p>
      </motion.div>

      {/* Technology Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ marginBottom: '40px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Code2 size={16} style={{ color: 'var(--accent-primary)' }} />
          <p className="section-title" style={{ marginBottom: 0 }}>Technology Stack</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {TECH.map((tech, i) => (
            <motion.div
              key={tech.name}
              className="glass-card"
              style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-heading)' }}>
                  {tech.name}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {tech.description}
                </p>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--accent-primary)',
                  background: 'var(--accent-glow)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  flexShrink: 0,
                }}
              >
                v{tech.version}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginBottom: '40px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Shield size={16} style={{ color: 'var(--success)' }} />
          <p className="section-title" style={{ marginBottom: 0 }}>Privacy & Ethics</p>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--text-heading)' }}>Local Processing:</strong>{' '}
              Your camera feed is processed entirely within your browser using client-side AI models.
              No images, video frames, or expression data are transmitted to any external server.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--text-heading)' }}>Expression Data:</strong>{' '}
              All session data, analytics, and reports are stored locally in your browser's storage
              and can be cleared at any time from the History section.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--text-heading)' }}>Ethical Use:</strong>{' '}
              This tool analyzes detected facial expressions — visible facial muscle patterns classified
              by AI models. It does not assess, diagnose, or infer psychological states, emotions,
              personality traits, or medical conditions. All insights are based on detected
              expression patterns, not psychological assessment.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div
          className="glass-card"
          style={{
            padding: '16px 20px',
            borderColor: 'rgba(245, 158, 11, 0.15)',
          }}
        >
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: 'var(--warning)' }}>Disclaimer:</strong>{' '}
            Facial expression classification is based on visual patterns detected by AI models
            and may not accurately represent a person's actual emotional state. Results should be
            interpreted as pattern observations, not emotional or psychological readings.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
