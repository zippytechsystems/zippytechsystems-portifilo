import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useData } from '../context/DataContext';
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  Inbox,
  Settings,
  Lock,
  LogOut,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Eye,
  Star,
  HelpCircle,
  PackageCheck,
  BadgePercent,
  Bot,
  MessageSquare,
  MapPin,
  SlidersHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';

import DashboardTab from './admin/DashboardTab';
import PricesTab from './admin/PricesTab';
import ServicesTab from './admin/ServicesTab';
import PortfolioTab from './admin/PortfolioTab';
import PackagesTab from './admin/PackagesTab';
import TestimonialsTab from './admin/TestimonialsTab';
import FaqsTab from './admin/FaqsTab';
import EnquiriesTab from './admin/EnquiriesTab';
import ChatbotTab from './admin/ChatbotTab';
import ConversationsTab from './admin/ConversationsTab';
import WhatsAppTab from './admin/WhatsAppTab';
import ServiceAreasTab from './admin/ServiceAreasTab';
import DesignTab from './admin/DesignTab';
import SettingsTab from './admin/SettingsTab';

export default function AdminPage() {
  const { isAuthenticated, login, logout, resetPassword, loading: authLoading } = useAdminAuth();
  const {
    servicesData,
    projectsData,
    enquiries,
    isLiveConnected,
    whatsappContacts
  } = useData();

  // Navigation tab state: 'dashboard' | 'prices' | 'services' | 'packages' | 'portfolio' | 'testimonials' | 'faqs' | 'enquiries' | 'chatbot' | 'conversations' | 'whatsapp' | 'serviceAreas' | 'design' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Delete Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const openConfirm = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        await onConfirm();
      }
    });
  };

  const handleForgotPassword = async () => {
    if (!loginEmail.trim()) {
      setLoginError('Please enter your admin username above first.');
      return;
    }
    setLoginError('');
    setResetLoading(true);
    const res = await resetPassword(loginEmail.trim());
    setResetLoading(false);
    if (res.success) {
      setResetMessage('Password reset instructions sent. Please check your admin inbox.');
    } else {
      setLoginError(res.error || 'Failed to send reset link.');
    }
  };

  // Filter state passed between DashboardTab & EnquiriesTab
  const [statusFilter, setStatusFilter] = useState('All');

  // Handler: Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await login(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials. Please verify your admin username and password.');
    } else {
      showToast('Welcome, Lingaswamy! Logged in to Admin Suite.');
    }
  };

  // Render: Login Screen (if not authenticated)
  if (!isAuthenticated) {
    return (
      <main
        style={{
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.25rem',
          background: 'var(--bg-canvas)'
        }}
      >
        <div
          className="card"
          style={{
            width: '100%',
            maxWidth: '430px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
            border: '1px solid var(--border-glass-hover)'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0b1b4a 0%, #1d5cf0 100%)',
              color: '#ffe500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              border: '2px solid rgba(255, 229, 0, 0.4)'
            }}
          >
            <Lock size={28} />
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', marginBottom: '1.5rem' }}>
            ZippyTechSystems Pvt. Ltd. Management Console
          </p>

          {loginError && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#ef4444',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textAlign: 'left'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="admin-username">
                Admin Username
              </label>
              <input
                id="admin-username"
                type="text"
                required
                className="form-input"
                placeholder="Enter admin username"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="btn btn-cta-yellow"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
            >
              {authLoading ? 'Verifying...' : 'Sign In to Admin'}
            </button>
          </form>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            {resetMessage ? (
              <p style={{ color: '#12a150', fontSize: '0.82rem', fontWeight: 600 }}>{resetMessage}</p>
            ) : (
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {resetLoading ? 'Sending link...' : 'Forgot Password? Send Reset Link'}
              </button>
            )}
          </div>

          <div style={{ marginTop: '1.25rem', fontSize: '0.82rem' }}>
            <Link to="/" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
              ← Return to public website
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Computed Counts for Navigation Badges
  const newEnquiriesCount = (enquiries || []).filter((e) => e.status === 'New').length;

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'prices', label: 'Prices', icon: <BadgePercent size={18} /> },
    { id: 'services', label: 'Services', icon: <Layers size={18} /> },
    { id: 'packages', label: 'Packages', icon: <PackageCheck size={18} /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase size={18} /> },
    { id: 'testimonials', label: 'Reviews', icon: <Star size={18} /> },
    { id: 'faqs', label: 'FAQs', icon: <HelpCircle size={18} /> },
    {
      id: 'enquiries',
      label: 'Enquiries',
      icon: <Inbox size={18} />,
      badge: newEnquiriesCount > 0 ? newEnquiriesCount : null
    },
    { id: 'chatbot', label: 'AI Chatbot', icon: <Bot size={18} /> },
    { id: 'conversations', label: 'Chats', icon: <MessageSquare size={18} /> },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: <MessageCircle size={18} />,
      badge: (whatsappContacts || []).filter((c) => c.status === 'needs_human').length || null
    },
    { id: 'serviceAreas', label: 'Locations', icon: <MapPin size={18} /> },
    { id: 'design', label: 'Design & Motion', icon: <SlidersHorizontal size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-canvas)',
        color: 'var(--text-main)',
        position: 'relative'
      }}
    >
      {/* Toast Notification Banner */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: toast.type === 'error' ? '#ef4444' : '#12a150',
            color: '#ffffff',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 600,
            fontSize: '0.92rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmModal.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444', marginBottom: '1rem' }}>
              <AlertCircle size={24} />
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{confirmModal.title}</h3>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              {confirmModal.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                style={{ padding: '0.5rem 1rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn"
                onClick={confirmModal.onConfirm}
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.5rem 1.25rem',
                  fontWeight: 600
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP SIDEBAR (Visible >= 768px) */}
      {/* ------------------------------------------------------------- */}
      <aside
        className="admin-sidebar"
        style={{
          width: '240px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50
        }}
      >
        <div>
          {/* Brand header */}
          <div
            style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0b1b4a 0%, #1d5cf0 100%)',
                color: '#ffe500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}
            >
              Z
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.1 }}>
                Zippy<span style={{ color: '#1d5cf0' }}>Admin</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: isLiveConnected ? '#12a150' : '#eab308', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isLiveConnected ? '#12a150' : '#eab308' }} />
                {isLiveConnected ? 'Live Hostinger API' : 'Local Fallback'}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: active ? 'rgba(29, 92, 240, 0.12)' : 'transparent',
                    color: active ? '#1d5cf0' : 'var(--text-body)',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      style={{
                        background: '#ffe500',
                        color: '#0b1b4a',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '12px'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-dim)',
              fontSize: '0.85rem',
              textDecoration: 'none',
              padding: '0.4rem 0.5rem'
            }}
          >
            <Eye size={15} />
            <span>View Public Site</span>
          </Link>
          <button
            onClick={logout}
            className="btn btn-outline"
            style={{
              width: '100%',
              padding: '0.55rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              color: '#ef4444',
              borderColor: 'rgba(239, 68, 68, 0.3)'
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ------------------------------------------------------------- */}
      <main
        style={{
          flex: 1,
          padding: '1.75rem 1.5rem 5rem 1.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          overflowX: 'hidden'
        }}
      >
        {/* Mobile Header Bar */}
        <div className="mobile-admin-header" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0b1b4a 0%, #1d5cf0 100%)',
                color: '#ffe500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem'
              }}
            >
              Z
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
              Zippy<span style={{ color: '#1d5cf0' }}>Admin</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/" style={{ color: 'var(--text-body)', textDecoration: 'none', fontSize: '0.82rem' }}>
              Site
            </Link>
            <button
              onClick={logout}
              className="btn btn-outline"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', color: '#ef4444' }}
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>

        {/* BATCH 1 MODULAR TABS: DASHBOARD, PRICES, SERVICES, PORTFOLIO */}
        {activeTab === 'dashboard' && (
          <DashboardTab setActiveTab={setActiveTab} setStatusFilter={setStatusFilter} />
        )}

        {activeTab === 'prices' && (
          <PricesTab showToast={showToast} />
        )}

        {activeTab === 'services' && (
          <ServicesTab showToast={showToast} openConfirm={openConfirm} />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioTab showToast={showToast} openConfirm={openConfirm} />
        )}

        {/* BATCH 2 MODULAR TABS: PACKAGES, TESTIMONIALS, FAQS, ENQUIRIES */}
        {activeTab === 'packages' && (
          <PackagesTab showToast={showToast} openConfirm={openConfirm} />
        )}

        {activeTab === 'testimonials' && (
          <TestimonialsTab showToast={showToast} openConfirm={openConfirm} />
        )}

        {activeTab === 'faqs' && (
          <FaqsTab showToast={showToast} openConfirm={openConfirm} />
        )}

        {activeTab === 'enquiries' && (
          <EnquiriesTab
            showToast={showToast}
            openConfirm={openConfirm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}

        {/* BATCH 3 MODULAR TABS: CHATBOT, CONVERSATIONS, WHATSAPP */}
        {activeTab === 'chatbot' && (
          <ChatbotTab showToast={showToast} />
        )}

        {activeTab === 'conversations' && (
          <ConversationsTab showToast={showToast} openConfirm={openConfirm} />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppTab showToast={showToast} />
        )}

        {/* BATCH 4 MODULAR TABS: SERVICE AREAS, DESIGN, SETTINGS */}
        {activeTab === 'serviceAreas' && (
          <ServiceAreasTab showToast={showToast} openConfirm={openConfirm} />
        )}

        {activeTab === 'design' && (
          <DesignTab showToast={showToast} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab showToast={showToast} />
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE BOTTOM TAB BAR (Visible on mobile screens < 768px) */}
      {/* ------------------------------------------------------------- */}
      <nav
        className="admin-bottom-nav"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-glass)',
          zIndex: 1000,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.25)',
          overflowX: 'auto',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '8px',
          padding: '0 0.75rem',
          scrollbarWidth: 'none'
        }}
      >
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: active ? '#1d5cf0' : 'var(--text-dim)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.68rem',
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                position: 'relative',
                padding: '6px 8px',
                flexShrink: 0,
                minWidth: '56px'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '4px',
                    background: '#ffe500',
                    color: '#0b1b4a',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Responsive media styles for Sidebar vs Bottom Nav */}
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            display: none !important;
          }
          .admin-bottom-nav {
            display: flex !important;
          }
          .mobile-admin-header {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
