import React, { useState, useEffect } from 'react';
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
  Phone,
  MessageCircle,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Upload,
  AlertCircle,
  X,
  Globe,
  Smartphone,
  Cpu,
  RefreshCw,
  Eye,
  Star,
  HelpCircle,
  PackageCheck,
  BadgePercent,
  Download,
  History,
  TrendingUp,
  Save,
  Check,
  Bot,
  MessageSquare,
  MapPin,
  Send,
  Sliders,
  Calendar,
  UserCheck,
  Mic,
  Volume2,
  Clock,
  Mail,
  CheckCheck,
  Pause,
  Play,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildKnowledge } from '../lib/knowledgeBuilder';
import { DEFAULT_DESIGN_SETTINGS } from '../lib/api';

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

export default function AdminPage() {

  const { isAuthenticated, adminUser, login, logout, resetPassword, loading: authLoading } = useAdminAuth();
  const {
    domainsData,
    servicesData,
    projectsData,
    testimonialsData,
    faqsData,
    packagesData,
    settingsData,
    enquiries,
    overdueEnquiriesCount,
    isLiveConnected,
    priceHistory,
    updateDomainPrice,
    updatePackagePrice,
    saveAllPrices,
    exportEnquiriesCSV,
    formatINR,
    addServiceItem,
    editServiceItem,
    deleteServiceItem,
    reorderServiceItems,
    addProject,
    editProject,
    deleteProject,
    uploadProjectImage,
    updateEnquiryStatus,
    deleteEnquiry,
    persistSettings,
    addTestimonial,
    editTestimonial,
    deleteTestimonial,
    addFaq,
    editFaq,
    deleteFaq,
    addPackage,
    editPackage,
    deletePackage,
    chatbotSettings,
    adminChatbotSettings,
    serviceAreas,
    chatSessions,
    loadAdminChatbot,
    persistChatbotSettings,
    loadServiceAreasList,
    addServiceArea,
    editServiceArea,
    deleteServiceArea,
    loadChatSessions,
    loadChatMessages,
    deleteChatSession,
    whatsappContacts,
    whatsappTemplates,
    loadWhatsAppContacts,
    loadWhatsAppMessages,
    takeOverWhatsAppChat,
    resumeWhatsAppChat,
    updateWhatsAppContactStatus,
    loadWhatsAppTemplates,
    sendWhatsAppMessage,
    designSettings,
    persistDesignSettings
  } = useData();

  // Navigation tab state: 'dashboard' | 'prices' | 'services' | 'packages' | 'portfolio' | 'testimonials' | 'faqs' | 'enquiries' | 'chatbot' | 'conversations' | 'whatsapp' | 'serviceAreas' | 'design' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Phase 2: Design & Motion Settings state
  const [designForm, setDesignForm] = useState(designSettings || DEFAULT_DESIGN_SETTINGS);
  const [savingDesign, setSavingDesign] = useState(false);

  useEffect(() => {
    if (designSettings) {
      setDesignForm(designSettings);
    }
  }, [designSettings]);

  // Login form state

  const [loginEmail, setLoginEmail] = useState('lingaswamymaddeboina@gmail.com');
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
      setLoginError('Please enter your admin email above first.');
      return;
    }
    setLoginError('');
    setResetLoading(true);
    const res = await resetPassword(loginEmail.trim());
    setResetLoading(false);
    if (res.success) {
      setResetMessage(`Password reset link sent to ${loginEmail}. Please check your inbox.`);
    } else {
      setLoginError(res.error || 'Failed to send reset link.');
    }
  };

  // -------------------------------------------------------------
  // 3. Enquiries State
  // -------------------------------------------------------------
  const [statusFilter, setStatusFilter] = useState('All');

  // -------------------------------------------------------------
  // 4. Settings State
  // -------------------------------------------------------------
  const [settingsForm, setSettingsForm] = useState(settingsData);

  useEffect(() => {
    if (settingsData) {
      setSettingsForm(settingsData);
    }
  }, [settingsData]);

  // -------------------------------------------------------------
  // 4D. Service Areas State
  // -------------------------------------------------------------
  const [serviceAreaModal, setServiceAreaModal] = useState({
    isOpen: false,
    mode: 'add',
    id: null,
    name: '',
    notes: '',
    sort_order: 0,
    is_active: true
  });


  // -------------------------------------------------------------
  // Handler: Login
  // -------------------------------------------------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await login(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials. Only admin email is authorized.');
    } else {
      showToast('Welcome, Lingaswamy! Logged in to Admin Suite.');
    }
  };

  // -------------------------------------------------------------
  // Render: Login Screen (if not authenticated)
  // -------------------------------------------------------------
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
              <label className="form-label" htmlFor="admin-email">
                Admin Email / Username
              </label>
              <input
                id="admin-email"
                type="text"
                required
                className="form-input"
                placeholder="lingaswamymaddeboina@gmail.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
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

  // -------------------------------------------------------------
  // Computed Counts for Dashboard
  // -------------------------------------------------------------
  const totalServicesCount = (servicesData || []).reduce(
    (acc, d) => acc + (d.mainServices?.length || 0) + (d.moreServices?.length || 0),
    0
  );
  const totalProjectsCount = (projectsData || []).length;
  const newEnquiriesCount = (enquiries || []).filter((e) => e.status === 'New').length;
  const totalEnquiriesCount = (enquiries || []).length;

  // -------------------------------------------------------------
  // Settings Actions
  // -------------------------------------------------------------
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    persistSettings(settingsForm);
    showToast('Site settings updated successfully!');
  };

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
            zIndex: 9998,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '420px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
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

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: SETTINGS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div>
            <div style={{ marginBottom: '1.75rem' }}>
              <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
                Site &amp; Contact Settings
              </h1>
              <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
                Configure phone numbers, WhatsApp routing, prefilled message text, and company taglines.
              </p>
            </div>

            <div className="card" style={{ maxWidth: '680px', padding: '2rem' }}>
              <form onSubmit={handleSaveSettings}>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Founder &amp; Solutions Architect Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsForm.founderName || 'Lingaswamy Maddeboina'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, founderName: e.target.value })}
                  />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                    Used across website badges, about pages, chatbot system prompt, and WhatsApp communications.
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number (Calling)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={settingsForm.phone || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Business WhatsApp Number (Bot Number)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={settingsForm.whatsappNumber || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Default WhatsApp Prefilled Greeting</label>
                  <textarea
                    rows={2}
                    className="form-input"
                    value={settingsForm.defaultWhatsAppMessage || 'Hi Lingaswamy, I would like to get a quote for my business.'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, defaultWhatsAppMessage: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Primary Brand Tagline</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsForm.tagline || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Secondary Tagline</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsForm.secondaryTagline || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, secondaryTagline: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Office Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsForm.location || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Instagram Profile URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://www.instagram.com/zippytechsystems"
                      value={settingsForm.instagramUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">YouTube Channel URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://www.youtube.com/@zippytechsystems"
                      value={settingsForm.youtubeUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Facebook Page URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://www.facebook.com/zippytechsystems"
                      value={settingsForm.facebookUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile / Company URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://www.linkedin.com/company/zippytechsystems"
                      value={settingsForm.linkedinUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                  <label className="form-label">Response Time Target</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="24 hours"
                    value={settingsForm.responseTimeText || '24 hours'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, responseTimeText: e.target.value })}
                  />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                    Used on customer confirmation banners and Project Builder (e.g. "We will contact you within 24 hours").
                  </div>
                </div>

                {/* Business Info (AI Chatbot Knowledge) */}
                <div style={{ marginTop: '1.75rem', marginBottom: '1.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#1d5cf0' }}>
                    Business Info (AI Chatbot Knowledge Base)
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    Leave any field blank if not applicable. The AI Chatbot will ONLY mention non-empty fields. If a client asks about an empty field, the chatbot will politely offer WhatsApp handoff.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">Working Hours / Timings</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Mon - Sat: 9:00 AM - 8:00 PM"
                        value={settingsForm.workingHours || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Support / Business Email</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="contact@zippysoftwares.in"
                        value={settingsForm.email || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Office / Physical Address</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Hyderabad, Telangana, India"
                      value={settingsForm.officeAddress || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, officeAddress: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">About ZippyTechSystems / Founder Note</label>
                    <textarea
                      rows={2}
                      className="form-input"
                      placeholder="Brief summary of founder Lingaswamy's focus on affordable web, app & AI solutions..."
                      value={settingsForm.aboutText || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">Languages Supported</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="English, Telugu, Hindi"
                        value={settingsForm.languagesSupported || 'English, Telugu, Hindi'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, languagesSupported: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Delivery &amp; Turnaround Note</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Websites delivered in 3-5 days"
                        value={settingsForm.deliveryNote || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, deliveryNote: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp & Email Automation Settings */}
                <div style={{ marginTop: '1.75rem', marginBottom: '1.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#12a150' }}>
                    WhatsApp &amp; Communication Automation
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    Manage the 24/7 AI WhatsApp chatbot, Coexistence app pauses, and notification alerts.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {/* Master WhatsApp Bot Switch */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input
                        type="checkbox"
                        checked={settingsForm.whatsappBotEnabled ?? true}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappBotEnabled: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: '#12a150' }}
                      />
                      <span><strong>Enable WhatsApp AI Chatbot</strong> (AI replies automatically to customer WhatsApp messages)</span>
                    </label>

                    {/* Email Alert (Primary) */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input
                        type="checkbox"
                        checked={settingsForm.notifyEmailEnabled ?? true}
                        onChange={(e) => setSettingsForm({ ...settingsForm, notifyEmailEnabled: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: '#1d5cf0' }}
                      />
                      <span><strong>Send Admin Email Alerts (Primary)</strong> (Instant notification via Resend when new enquiry arrives)</span>
                    </label>

                    {/* WhatsApp Admin Alert (Optional, OFF by default) */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(settingsForm.waAdminAlertEnabled)}
                        onChange={(e) => setSettingsForm({ ...settingsForm, waAdminAlertEnabled: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: '#12a150' }}
                      />
                      <span><strong>Optional: WhatsApp Admin Alert</strong> (Requires personal number below; never sends to bot number)</span>
                    </label>
                  </div>

                  {/* Personal Number for WA Alerts */}
                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Personal WhatsApp Number for Admin Alerts (WA_ADMIN_TO)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 9876543210 (your personal number, NOT 6302690251)"
                      value={settingsForm.waAdminTo || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, waAdminTo: e.target.value })}
                    />
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                      <strong>Important:</strong> Must NOT be {settingsForm.whatsappNumber || '6302690251'} because Meta does not allow the bot to message itself. If left blank, WhatsApp admin alerts are skipped silently.
                    </div>
                  </div>

                  {/* Coexistence Pause Duration */}
                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Coexistence Mode: Human Reply Pause Duration (Hours)</label>
                    <input
                      type="number"
                      min={1}
                      max={72}
                      className="form-input"
                      value={settingsForm.humanPauseHours ?? 2}
                      onChange={(e) => setSettingsForm({ ...settingsForm, humanPauseHours: e.target.value })}
                    />
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                      When you reply to a customer from the WhatsApp Business mobile app on your phone, the AI assistant will automatically pause for this contact for {settingsForm.humanPauseHours || 2} hours. You can resume AI at any time in the admin inbox.
                    </div>
                  </div>

                  {/* Additional WhatsApp Automation Toggles */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem', background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(settingsForm.whatsappAutoConfirm)}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappAutoConfirm: e.target.checked })}
                        style={{ accentColor: '#12a150' }}
                      />
                      <span>Enquiry Auto-Confirm</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(settingsForm.whatsappFollowups)}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappFollowups: e.target.checked })}
                        style={{ accentColor: '#12a150' }}
                      />
                      <span>Smart Follow-ups (24h)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(settingsForm.dailySummaryEnabled)}
                        onChange={(e) => setSettingsForm({ ...settingsForm, dailySummaryEnabled: e.target.checked })}
                        style={{ accentColor: '#12a150' }}
                      />
                      <span>Daily Summary (9 PM)</span>
                    </label>
                  </div>

                  {/* Quiet Hours */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.82rem' }}>Quiet Hours Start (No outbound automations)</label>
                      <input
                        type="time"
                        className="form-input"
                        value={settingsForm.quietHoursStart || '22:00'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, quietHoursStart: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.82rem' }}>Quiet Hours End</label>
                      <input
                        type="time"
                        className="form-input"
                        value={settingsForm.quietHoursEnd || '08:00'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, quietHoursEnd: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Multilingual WhatsApp Auto-reply Templates */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                      Customer WhatsApp Message Templates (By Customer Language)
                    </h4>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>English Template</label>
                      <textarea
                        rows={2}
                        className="form-input"
                        value={settingsForm.waTemplateEn || 'Thank you for contacting ZippyTechSystems. We received your enquiry and will contact you within 24 hours.'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, waTemplateEn: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Telugu (తెలుగు) Template</label>
                      <textarea
                        rows={2}
                        className="form-input"
                        value={settingsForm.waTemplateTe || 'ZippyTechSystems ను సంప్రదించినందుకు ధన్యవాదాలు. మీ విచారణ మాకు అందింది, మేము 24 గంటల్లో మిమ్మల్ని సంప్రదిస్తాము.'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, waTemplateTe: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Hindi (हिन्दी) Template</label>
                      <textarea
                        rows={2}
                        className="form-input"
                        value={settingsForm.waTemplateHi || 'ZippyTechSystems से संपर्क करने के लिए धन्यवाद। हमें आपकी पूछताछ मिल गई है और हम 24 घंटे के भीतर आपसे संपर्क करेंगे।'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, waTemplateHi: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-cta-yellow" style={{ padding: '0.75rem 1.75rem', fontWeight: 700 }}>
                  Save Site Settings
                </button>
              </form>
            </div>
          </div>
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

        {/* ------------------------------------------------------------- */}
        {/* TAB 8: SERVICE AREAS & OPERATING LOCATIONS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'serviceAreas' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Service Areas &amp; Locations ({serviceAreas.length})
                </h1>
                <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
                  Locations where ZippyTechSystems provides services. The AI Chatbot uses these real locations to answer customer enquiries.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-cta-yellow"
                onClick={() =>
                  setServiceAreaModal({
                    isOpen: true,
                    mode: 'add',
                    id: null,
                    name: '',
                    notes: '',
                    sort_order: serviceAreas.length,
                    is_active: true
                  })
                }
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
              >
                <Plus size={16} /> Add Location
              </button>
            </div>

            {serviceAreas.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                No service areas added yet. Click &quot;Add Location&quot; to define your service coverage.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {serviceAreas.map((area) => (
                  <div key={area.id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MapPin size={18} color="#1d5cf0" />
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{area.name}</h3>
                        </div>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            background: area.is_active ? 'rgba(18, 161, 80, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: area.is_active ? '#12a150' : '#ef4444'
                          }}
                        >
                          {area.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {area.notes && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: '0.5rem 0', lineHeight: 1.4 }}>
                          {area.notes}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem', marginTop: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Sort order: {area.sort_order}
                      </span>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.65rem' }}
                          onClick={() =>
                            setServiceAreaModal({
                              isOpen: true,
                              mode: 'edit',
                              id: area.id,
                              name: area.name,
                              notes: area.notes || '',
                              sort_order: area.sort_order,
                              is_active: area.is_active
                            })
                          }
                          title="Edit Location"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.65rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                          onClick={() => {
                            openConfirm(
                              'Delete Location',
                              `Are you sure you want to remove "${area.name}"?`,
                              async () => {
                                await deleteServiceArea(area.id);
                                showToast('Location removed.');
                              }
                            );
                          }}
                          title="Delete Location"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Service Area Modal */}
            {serviceAreaModal.isOpen && (
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                      {serviceAreaModal.mode === 'add' ? 'Add Service Area' : 'Edit Service Area'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setServiceAreaModal((prev) => ({ ...prev, isOpen: false }))}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!serviceAreaModal.name.trim()) return;

                      if (serviceAreaModal.mode === 'add') {
                        await addServiceArea({
                          name: serviceAreaModal.name.trim(),
                          notes: serviceAreaModal.notes.trim(),
                          sort_order: parseInt(serviceAreaModal.sort_order, 10) || 0,
                          is_active: serviceAreaModal.is_active
                        });
                        showToast('New location added successfully!');
                      } else {
                        await editServiceArea(serviceAreaModal.id, {
                          name: serviceAreaModal.name.trim(),
                          notes: serviceAreaModal.notes.trim(),
                          sort_order: parseInt(serviceAreaModal.sort_order, 10) || 0,
                          is_active: serviceAreaModal.is_active
                        });
                        showToast('Location updated successfully!');
                      }

                      setServiceAreaModal((prev) => ({ ...prev, isOpen: false }));
                    }}
                  >
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">City / Region Name</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Hyderabad, Secunderabad, Online (All India)"
                        value={serviceAreaModal.name}
                        onChange={(e) => setServiceAreaModal({ ...serviceAreaModal, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Notes (Optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. In-person meetings & remote delivery available"
                        value={serviceAreaModal.notes}
                        onChange={(e) => setServiceAreaModal({ ...serviceAreaModal, notes: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div className="form-group">
                        <label className="form-label">Sort Order</label>
                        <input
                          type="number"
                          className="form-input"
                          value={serviceAreaModal.sort_order}
                          onChange={(e) => setServiceAreaModal({ ...serviceAreaModal, sort_order: e.target.value })}
                        />
                      </div>

                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <label className="form-label">Status</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '6px' }}>
                          <input
                            type="checkbox"
                            checked={serviceAreaModal.is_active}
                            onChange={(e) => setServiceAreaModal({ ...serviceAreaModal, is_active: e.target.checked })}
                            style={{ width: '18px', height: '18px', accentColor: '#1d5cf0' }}
                          />
                          <span style={{ fontSize: '0.85rem' }}>Active Location</span>
                        </label>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setServiceAreaModal((prev) => ({ ...prev, isOpen: false }))}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {serviceAreaModal.mode === 'add' ? 'Add Location' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* DESIGN & MOTION SETTINGS TAB (PHASE 2) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'design' && (
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <SlidersHorizontal size={24} color="#1d5cf0" />
                  <span>Design &amp; Motion Settings</span>
                </h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                  Control dynamic visual effects and hardware performance tiers. Toggles apply immediately to live visitors.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setDesignForm(DEFAULT_DESIGN_SETTINGS);
                    showToast('Settings reset to system defaults. Click Save to publish.');
                  }}
                  className="btn btn-outline"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                >
                  <RefreshCw size={15} />
                  <span>Reset to Defaults</span>
                </button>

                <button
                  type="button"
                  disabled={savingDesign}
                  onClick={async () => {
                    setSavingDesign(true);
                    const res = await persistDesignSettings(designForm);
                    setSavingDesign(false);
                    if (res?.success) {
                      showToast('Design settings saved and live on Hostinger!', 'success');
                    } else {
                      showToast(res?.error || 'Failed to save design settings.', 'error');
                    }
                  }}
                  className="btn btn-primary"
                  style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <Save size={15} />
                  <span>{savingDesign ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </div>

            {/* Performance Tier Card */}
            <div className="card" style={{ padding: '1.75rem', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(29, 92, 240, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Compass size={18} color="#1d5cf0" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Device Quality Tier Override</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
                    Automatically detects visitor hardware capability, network data-saver, and prefers-reduced-motion.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {[
                  { value: 'auto', title: 'Auto (Recommended)', desc: 'Detects GPU, memory & data-saver mode' },
                  { value: 'full', title: 'Force Full Tier', desc: 'Enables all animations on desktop' },
                  { value: 'lite', title: 'Force Lite Tier', desc: 'Conserves mobile battery & data' },
                  { value: 'reduced', title: 'Force Reduced Motion', desc: 'Disables transitions & animations' }
                ].map((tierOpt) => {
                  const isSelected = designForm.quality_override === tierOpt.value;
                  return (
                    <div
                      key={tierOpt.value}
                      onClick={() => setDesignForm((prev) => ({ ...prev, quality_override: tierOpt.value }))}
                      style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #1d5cf0' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'rgba(29, 92, 240, 0.08)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? '#1d5cf0' : 'var(--text-main)' }}>
                          {tierOpt.title}
                        </span>
                        {isSelected && <CheckCircle2 size={16} color="#1d5cf0" />}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4, display: 'block' }}>
                        {tierOpt.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hero Section Visual Experience */}
            <div className="card" style={{ padding: '1.75rem', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(18, 161, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Eye size={18} color="#12a150" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Hero Section Visual Experience</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
                    Select the background style rendered behind the headline on the home page.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { value: 'mesh', title: 'Ambient Mesh Float', desc: 'Soft floating brand color orbs (Fast, zero layout shift)' },
                  { value: '3d', title: '3D Floating Objects', desc: 'Interactive brand geometric shapes (Full tier only)' },
                  { value: 'gradient', title: 'Clean Linear Gradient', desc: 'Ultra-lightweight static brand gradient' }
                ].map((styleOpt) => {
                  const isSelected = designForm.hero_style === styleOpt.value;
                  return (
                    <div
                      key={styleOpt.value}
                      onClick={() => setDesignForm((prev) => ({ ...prev, hero_style: styleOpt.value }))}
                      style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #12a150' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'rgba(18, 161, 80, 0.08)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? '#12a150' : 'var(--text-main)' }}>
                          {styleOpt.title}
                        </span>
                        {isSelected && <CheckCircle2 size={16} color="#12a150" />}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4, display: 'block' }}>
                        {styleOpt.desc}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Optional Video Background Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Optional Video Background URL (.mp4 / .webm)</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://.../video.mp4 (optional)"
                    value={designForm.video_background_url || ''}
                    onChange={(e) => setDesignForm((prev) => ({ ...prev, video_background_url: e.target.value }))}
                    style={{ fontSize: '0.88rem' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Video Poster Image URL (fallback image)</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://.../poster.webp (optional)"
                    value={designForm.video_poster_url || ''}
                    onChange={(e) => setDesignForm((prev) => ({ ...prev, video_poster_url: e.target.value }))}
                    style={{ fontSize: '0.88rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Individual Feature Toggles */}
            <div className="card" style={{ padding: '1.75rem', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(122, 47, 208, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SlidersHorizontal size={18} color="#7a2fd0" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Interactive Effects &amp; Micro-Animations</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
                    Enable or disable specific visual effects across the entire site with zero redeploy needed.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {[
                  { key: 'magnetic_buttons_enabled', label: 'Magnetic CTA Buttons', desc: 'Pulls primary buttons subtly toward mouse on desktop fine pointer' },
                  { key: 'particles_enabled', label: 'Ambient Particle Drift', desc: 'Floating micro-particles in hero and domain preview sections' },
                  { key: 'cursor_effect_enabled', label: 'Cursor Follower Glow', desc: 'Subtle glowing trail following pointer on capable desktop hardware' },
                  { key: 'parallax_enabled', label: 'Parallax Layer Depth', desc: 'Smooth multi-plane scroll depth on section backgrounds' },
                  { key: 'horizontal_portfolio_enabled', label: 'Horizontal Portfolio Reel', desc: 'Enhanced side-scrolling project reel on wide desktop screens' },
                  { key: 'lottie_enabled', label: 'Lottie Vector Icons', desc: 'Smooth animated SVG icons for domain headers and packages' },
                  { key: 'tooltip_enabled', label: 'Rich Floating Tooltips', desc: 'Interactive info hints on price tags and technology badges' }
                ].map((toggle) => {
                  const isChecked = Boolean(designForm[toggle.key]);
                  return (
                    <div
                      key={toggle.key}
                      onClick={() => setDesignForm((prev) => ({ ...prev, [toggle.key]: !prev[toggle.key] }))}
                      style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        border: isChecked ? '1px solid rgba(122, 47, 208, 0.35)' : '1px solid var(--border-subtle)',
                        background: isChecked ? 'rgba(122, 47, 208, 0.05)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent onClick
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#7a2fd0',
                          marginTop: '2px',
                          cursor: 'pointer'
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isChecked ? '#c084fc' : 'var(--text-main)', marginBottom: '2px' }}>
                          {toggle.label}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                          {toggle.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Save Reminder */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '2rem' }}>
              <button
                type="button"
                disabled={savingDesign}
                onClick={async () => {
                  setSavingDesign(true);
                  const res = await persistDesignSettings(designForm);
                  setSavingDesign(false);
                  if (res?.success) {
                    showToast('Design settings saved and live on Hostinger!', 'success');
                  } else {
                    showToast(res?.error || 'Failed to save design settings.', 'error');
                  }
                }}
                className="btn btn-primary"
                style={{ padding: '0.7rem 1.75rem', fontSize: '0.92rem' }}
              >
                <Save size={16} />
                <span>{savingDesign ? 'Saving Changes...' : 'Save Design Settings'}</span>
              </button>
            </div>
          </div>
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
