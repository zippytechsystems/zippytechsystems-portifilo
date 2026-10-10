import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { QualityTierProvider } from './context/QualityTierContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ChatWidget from './components/ChatWidget';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';
import QuoteModal from './components/QuoteModal';
import SmoothScroll from './components/SmoothScroll';
import CursorFollower from './components/CursorFollower';

import HomePage from './pages/HomePage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

const AdminPage = React.lazy(() => import('./pages/AdminPage'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Application Error caught by ErrorBoundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b132b', color: '#fff', padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <div style={{ maxWidth: 500, background: 'rgba(255,255,255,0.05)', padding: '2.5rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ffe500' }}>Something went wrong</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>We apologize for the inconvenience. Please refresh or return to home.</p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
              style={{ background: '#1d5cf0', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteDefaultService, setQuoteDefaultService] = useState('Web Development');
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Enforce noindex, nofollow meta tag on admin routes
  React.useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (isAdminRoute) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else if (metaRobots) {
      metaRobots.setAttribute('content', 'index, follow');
    }
  }, [isAdminRoute]);

  const handleOpenQuoteModal = (service = 'Web Development') => {
    setQuoteDefaultService(service);
    setIsQuoteModalOpen(true);
  };

  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DataProvider>
          <QualityTierProvider>
            <AdminAuthProvider>
            <SmoothScroll>
              <CursorFollower />
              <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <ScrollProgress />
                <ScrollToTop />
                <Navbar onOpenQuoteModal={() => handleOpenQuoteModal('Web Development')} />

            <div style={{ flex: '1 0 auto' }}>
              <Routes>
                <Route
                  path="/"
                  element={<HomePage onOpenQuoteModal={() => handleOpenQuoteModal('Web Development')} />}
                />
                <Route
                  path="/services/:slug"
                  element={<ServiceDetailPage />}
                />
                <Route
                  path="/about"
                  element={<AboutPage />}
                />
                <Route
                  path="/projects"
                  element={<ProjectsPage />}
                />
                <Route
                  path="/projects/:slug"
                  element={<ProjectsPage />}
                />
                <Route
                  path="/portfolio"
                  element={<ProjectsPage />}
                />
                <Route
                  path="/portfolio/:slug"
                  element={<ProjectsPage />}
                />
                <Route
                  path="/contact"
                  element={<ContactPage />}
                />
                <Route
                  path="/privacy"
                  element={<PrivacyPage />}
                />
                <Route
                  path="/terms"
                  element={<TermsPage />}
                />
                <Route
                  path="/admin"
                  element={
                    <React.Suspense
                      fallback={
                        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: '0.95rem' }}>
                          Loading Admin Portal...
                        </div>
                      }
                    >
                      <AdminPage />
                    </React.Suspense>
                  }
                />
                <Route
                  path="*"
                  element={<NotFoundPage />}
                />
              </Routes>
            </div>

            <Footer />

            {/* Floating WhatsApp CTA button on public pages (hidden on /admin so it doesn't block admin controls) */}
            {!isAdminRoute && <FloatingWhatsApp />}

            {/* Floating AI Chatbot Assistant on public pages (Bottom-Left, no overlap with WhatsApp) */}
            {!isAdminRoute && <ChatWidget />}

            {/* Fast Quote Modal */}
            <QuoteModal
              isOpen={isQuoteModalOpen}
              onClose={handleCloseQuoteModal}
              defaultService={quoteDefaultService}
            />
          </div>
        </SmoothScroll>
      </AdminAuthProvider>
    </QualityTierProvider>
  </DataProvider>
</ThemeProvider>
</ErrorBoundary>
);

}
