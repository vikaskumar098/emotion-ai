import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import SettingsModal from './components/SettingsModal';
import PrivacyModal from './components/PrivacyModal';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LiveAnalysis from './pages/LiveAnalysis';
import History from './pages/History';
import Reports from './pages/Reports';
import About from './pages/About';

/* Routes that use the full SaaS shell (Sidebar + Header) */
const SHELL_ROUTES = ['/dashboard', '/live', '/history', '/reports', '/about'];

function AppShell({ children, isCameraActive, isSessionActive, sessionDuration, onOpenSettings, onOpenPrivacy }) {
  const location = useLocation();
  const useShell = SHELL_ROUTES.some(
    (r) => location.pathname === r || location.pathname.startsWith(r + '/')
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!useShell) {
    // Landing page: standalone, has its own Navbar
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Sidebar
        isCameraActive={isCameraActive}
        isSessionActive={isSessionActive}
        onOpenSettings={onOpenSettings}
        onOpenPrivacy={onOpenPrivacy}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <div
        className="app-main-viewport"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh',
          background: 'var(--bg-primary)',
        }}
      >
        <Header
          isCameraActive={isCameraActive}
          sessionDuration={sessionDuration}
          isSessionActive={isSessionActive}
          onOpenPrivacy={onOpenPrivacy}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        />
        <main style={{ flex: 1, minWidth: 0 }} className="main-content">
          {children}
        </main>
        <MobileNav />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .app-main-viewport { width: 100% !important; }
        }
        @media (max-width: 768px) {
          .main-content { padding-bottom: 74px !important; }
        }
      `}</style>
    </div>
  );
}

function App() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const handleCameraChange = useCallback((active) => setIsCameraActive(active), []);
  const handleSessionChange = useCallback((active) => setIsSessionActive(active), []);
  const handleDurationChange = useCallback((dur) => setSessionDuration(dur), []);

  return (
    <BrowserRouter>
      <AppShell
        isCameraActive={isCameraActive}
        isSessionActive={isSessionActive}
        sessionDuration={sessionDuration}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenPrivacy={() => setPrivacyOpen(true)}
      >
        <Routes>
          {/* Standalone marketing page — has its own Navbar, no shell */}
          <Route path="/" element={<Landing />} />

          {/* SaaS shell routes — Sidebar + Header applied */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/live"
            element={
              <LiveAnalysis
                onCameraChange={handleCameraChange}
                onSessionChange={handleSessionChange}
                onDurationChange={handleDurationChange}
              />
            }
          />
          <Route path="/history" element={<History />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AppShell>

      {/* Global Modals */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(15, 15, 30, 0.95)',
            color: '#e2e8f0',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            backdropFilter: 'blur(10px)',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#0d0d1a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0d0d1a' } },
        }}
      />
    </BrowserRouter>
  );
}

export default App;