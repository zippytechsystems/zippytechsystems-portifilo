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
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  const { isAuthenticated, adminUser, login, logout, loading: authLoading } = useAdminAuth();
  const {
    servicesData,
    projectsData,
    settingsData,
    enquiries,
    isLiveConnected,
    updateDomainPrice,
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
    persistSettings
  } = useData();

  // Navigation tab state: 'dashboard' | 'services' | 'portfolio' | 'enquiries' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('lingaswamymaddeboina@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

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

  // -------------------------------------------------------------
  // 1. Services Management State
  // -------------------------------------------------------------
  const [selectedDomain, setSelectedDomain] = useState('web-development');
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [serviceModal, setServiceModal] = useState({
    isOpen: false,
    mode: 'add', // 'add' | 'edit'
    domainSlug: 'web-development',
    type: 'main', // 'main' | 'more'
    index: null,
    title: '',
    desc: ''
  });

  // -------------------------------------------------------------
  // 2. Portfolio Management State
  // -------------------------------------------------------------
  const [portfolioFilter, setPortfolioFilter] = useState('all');
  const [projectModal, setProjectModal] = useState({
    isOpen: false,
    mode: 'add', // 'add' | 'edit'
    id: null,
    title: '',
    domain: 'web',
    clientCategory: 'Retail & Business',
    shortDescription: '',
    technologies: 'React, Node.js, Cloud',
    metrics: '',
    image: '/projects/clinic-web.svg',
    imageFile: null
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // -------------------------------------------------------------
  // 3. Enquiries State
  // -------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');

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

          <div style={{ marginTop: '1.5rem', fontSize: '0.82rem' }}>
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

  // Filtered Enquiries
  const filteredEnquiries = (enquiries || []).filter((enq) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (enq.name || '').toLowerCase().includes(query) ||
      (enq.phone || '').includes(query) ||
      (enq.message || '').toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'All' || enq.status === statusFilter;
    const matchesService =
      serviceFilter === 'All' || (enq.service || '').toLowerCase().includes(serviceFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesService;
  });

  // Current selected domain for Services Tab
  const currentDomainData =
    servicesData.find((d) => d.slug === selectedDomain) || servicesData[0] || {};

  // -------------------------------------------------------------
  // Services Actions
  // -------------------------------------------------------------
  const handleSavePrice = async () => {
    if (!priceInput.trim()) return;
    await updateDomainPrice(selectedDomain, priceInput.trim());
    setEditingPrice(false);
    showToast(`Updated starting price for ${currentDomainData.domainLabel} to ${priceInput.trim()}`);
  };

  const handleOpenAddService = (type) => {
    setServiceModal({
      isOpen: true,
      mode: 'add',
      domainSlug: selectedDomain,
      type,
      index: null,
      title: '',
      desc: ''
    });
  };

  const handleOpenEditService = (type, index, serviceItem) => {
    setServiceModal({
      isOpen: true,
      mode: 'edit',
      domainSlug: selectedDomain,
      type,
      index,
      title: typeof serviceItem === 'string' ? serviceItem : serviceItem.title,
      desc: typeof serviceItem === 'string' ? '' : serviceItem.desc || ''
    });
  };

  const handleSaveServiceModal = async (e) => {
    e.preventDefault();
    if (!serviceModal.title.trim()) return;

    if (serviceModal.mode === 'add') {
      await addServiceItem(
        serviceModal.domainSlug,
        serviceModal.type,
        serviceModal.title.trim(),
        serviceModal.desc.trim()
      );
      showToast('New service added successfully!');
    } else {
      await editServiceItem(serviceModal.domainSlug, serviceModal.type, serviceModal.index, {
        title: serviceModal.title.trim(),
        desc: serviceModal.desc.trim()
      });
      showToast('Service updated successfully!');
    }
    setServiceModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDeleteService = (type, index, title) => {
    openConfirm(
      'Delete Service',
      `Are you sure you want to delete "${title}"? This will remove it from the public website.`,
      async () => {
        await deleteServiceItem(selectedDomain, type, index);
        showToast('Service deleted.', 'error');
      }
    );
  };

  // -------------------------------------------------------------
  // Portfolio Actions
  // -------------------------------------------------------------
  const filteredProjects =
    portfolioFilter === 'all'
      ? projectsData
      : projectsData.filter((p) => p.domain === portfolioFilter);

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const uploadedUrl = await uploadProjectImage(file);
      if (uploadedUrl) {
        setProjectModal((prev) => ({ ...prev, image: uploadedUrl }));
        showToast('Image uploaded successfully!');
      }
    } catch (err) {
      showToast('Image upload failed', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProjectModal = async (e) => {
    e.preventDefault();
    if (!projectModal.title.trim()) return;

    const projectPayload = {
      title: projectModal.title.trim(),
      domain: projectModal.domain,
      clientCategory: projectModal.clientCategory.trim(),
      shortDescription: projectModal.shortDescription.trim(),
      technologies: projectModal.technologies
        ? projectModal.technologies.split(',').map((t) => t.trim())
        : [],
      metrics: projectModal.metrics.trim(),
      image: projectModal.image || '/projects/clinic-web.svg'
    };

    if (projectModal.mode === 'add') {
      await addProject(projectPayload);
      showToast('New project created and published!');
    } else {
      await editProject(projectModal.id, projectPayload);
      showToast('Project updated successfully!');
    }
    setProjectModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDeleteProject = (id, title) => {
    openConfirm(
      'Delete Project',
      `Are you sure you want to delete project "${title}"?`,
      async () => {
        await deleteProject(id);
        showToast('Project deleted.', 'error');
      }
    );
  };

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
    { id: 'services', label: 'Services', icon: <Layers size={18} /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase size={18} /> },
    {
      id: 'enquiries',
      label: 'Enquiries',
      icon: <Inbox size={18} />,
      badge: newEnquiriesCount > 0 ? newEnquiriesCount : null
    },
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
                {isLiveConnected ? 'Live Supabase' : 'Local Fallback'}
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

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: DASHBOARD */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.4rem' }}>
                Admin Dashboard
              </h1>
              <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
                Welcome back, Lingaswamy. Here is an overview of your active services, portfolio, and customer enquiries.
              </p>
            </div>

            {/* Metric Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2.5rem'
              }}
            >
              {/* New Enquiries Card */}
              <div
                className="card"
                onClick={() => { setActiveTab('enquiries'); setStatusFilter('New'); }}
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  borderColor: newEnquiriesCount > 0 ? '#ffe500' : 'var(--border-glass)',
                  background: newEnquiriesCount > 0 ? 'rgba(255, 229, 0, 0.08)' : 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                    NEW ENQUIRIES
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 229, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Inbox size={18} color="#ffe500" />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: newEnquiriesCount > 0 ? '#ffe500' : 'var(--text-main)' }}>
                  {newEnquiriesCount}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                  {newEnquiriesCount > 0 ? 'Requires follow-up on WhatsApp' : 'All caught up!'}
                </div>
              </div>

              {/* Total Projects Card */}
              <div
                className="card"
                onClick={() => setActiveTab('portfolio')}
                style={{ padding: '1.5rem', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                    PORTFOLIO PROJECTS
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(29, 92, 240, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase size={18} color="#1d5cf0" />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1d5cf0' }}>
                  {totalProjectsCount}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                  Live showcase items
                </div>
              </div>

              {/* Total Services Card */}
              <div
                className="card"
                onClick={() => setActiveTab('services')}
                style={{ padding: '1.5rem', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                    ACTIVE SERVICES
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(122, 47, 208, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={18} color="#7a2fd0" />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#7a2fd0' }}>
                  {totalServicesCount}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                  Across Web, App &amp; AI
                </div>
              </div>

              {/* Total Enquiries Lifetime */}
              <div
                className="card"
                onClick={() => setActiveTab('enquiries')}
                style={{ padding: '1.5rem', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                    TOTAL LEADS
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(18, 161, 80, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={18} color="#12a150" />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#12a150' }}>
                  {totalEnquiriesCount}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                  Enquiries received to date
                </div>
              </div>
            </div>

            {/* Quick Domain Starting Prices Bar */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>
                  Current Starting Prices by Domain
                </h3>
                <button
                  onClick={() => setActiveTab('services')}
                  className="btn btn-outline"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                >
                  Edit in Services →
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {servicesData.map((d) => (
                  <div
                    key={d.slug}
                    style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.badgeColor }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{d.domainLabel}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: d.badgeColor }}>
                        {d.startingPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Enquiries Preview */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>
                  Recent Website Enquiries
                </h3>
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className="btn btn-outline"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                >
                  View All Enquiries ({totalEnquiriesCount}) →
                </button>
              </div>

              {enquiries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)' }}>
                  No customer enquiries yet. Submissions through your website contact form will appear here.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {enquiries.slice(0, 4).map((enq) => (
                    <div
                      key={enq.id}
                      style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>{enq.name}</span>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontWeight: 700,
                              background:
                                enq.status === 'New'
                                  ? 'rgba(255, 229, 0, 0.2)'
                                  : enq.status === 'Contacted'
                                  ? 'rgba(29, 92, 240, 0.2)'
                                  : 'rgba(148, 163, 184, 0.2)',
                              color:
                                enq.status === 'New'
                                  ? '#ffe500'
                                  : enq.status === 'Contacted'
                                  ? '#1d5cf0'
                                  : '#94a3b8'
                            }}
                          >
                            {enq.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginTop: '0.2rem' }}>
                          {enq.service} • {enq.phone}
                        </div>
                      </div>

                      {/* Direct Call & WhatsApp Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <a
                          href={`tel:${enq.phone}`}
                          className="btn btn-outline"
                          style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Phone size={14} color="#12a150" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/91${enq.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(enq.name)}%2C%20Lingaswamy%20from%20ZippyTechSystems%20here.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn"
                          style={{
                            background: '#12a150',
                            color: '#ffffff',
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            border: 'none',
                            textDecoration: 'none'
                          }}
                        >
                          <MessageCircle size={14} />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: SERVICES MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Services &amp; Pricing
                </h1>
                <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
                  Manage domains, starting prices, main services, and additional services.
                </p>
              </div>
            </div>

            {/* Domain Selector Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {servicesData.map((d) => {
                const isSelected = selectedDomain === d.slug;
                return (
                  <button
                    key={d.slug}
                    onClick={() => {
                      setSelectedDomain(d.slug);
                      setEditingPrice(false);
                    }}
                    style={{
                      padding: '0.65rem 1.25rem',
                      borderRadius: '8px',
                      border: isSelected ? `2px solid ${d.badgeColor}` : '1px solid var(--border-subtle)',
                      background: isSelected ? 'var(--bg-surface)' : 'transparent',
                      color: isSelected ? d.badgeColor : 'var(--text-body)',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.badgeColor }} />
                    <span>{d.domainLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Starting Price Editor Card */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', borderColor: currentDomainData.badgeColor }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                    STARTING PRICE FOR {currentDomainData.domainLabel?.toUpperCase()}
                  </div>
                  {!editingPrice ? (
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: currentDomainData.badgeColor, marginTop: '0.25rem' }}>
                      {currentDomainData.startingPrice}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        placeholder="e.g. ₹7,000"
                        style={{ width: '160px', padding: '0.45rem 0.75rem' }}
                      />
                      <button
                        onClick={handleSavePrice}
                        className="btn btn-cta-yellow"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPrice(false)}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {!editingPrice && (
                  <button
                    onClick={() => {
                      setPriceInput(currentDomainData.startingPrice || '');
                      setEditingPrice(true);
                    }}
                    className="btn btn-outline"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Edit2 size={14} />
                    <span>Edit Starting Price</span>
                  </button>
                )}
              </div>
            </div>

            {/* Main Services Block */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                    Our Main Services ({currentDomainData.mainServices?.length || 0})
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                    Prominently displayed with icons and detailed cards on the public website.
                  </div>
                </div>
                <button
                  onClick={() => handleOpenAddService('main')}
                  className="btn btn-outline"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={15} />
                  <span>Add Main Service</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(currentDomainData.mainServices || []).map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{s.title}</div>
                      {s.desc && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginTop: '0.2rem' }}>
                          {s.desc}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {/* Reorder Up */}
                      <button
                        title="Move Up"
                        disabled={idx === 0}
                        onClick={() => reorderServiceItems(selectedDomain, 'main', idx, 'up')}
                        className="btn btn-outline"
                        style={{ padding: '0.35rem', opacity: idx === 0 ? 0.3 : 1 }}
                      >
                        <ArrowUp size={14} />
                      </button>
                      {/* Reorder Down */}
                      <button
                        title="Move Down"
                        disabled={idx === currentDomainData.mainServices.length - 1}
                        onClick={() => reorderServiceItems(selectedDomain, 'main', idx, 'down')}
                        className="btn btn-outline"
                        style={{ padding: '0.35rem', opacity: idx === currentDomainData.mainServices.length - 1 ? 0.3 : 1 }}
                      >
                        <ArrowDown size={14} />
                      </button>
                      {/* Edit */}
                      <button
                        title="Edit"
                        onClick={() => handleOpenEditService('main', idx, s)}
                        className="btn btn-outline"
                        style={{ padding: '0.35rem 0.55rem' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      {/* Delete */}
                      <button
                        title="Delete"
                        onClick={() => handleDeleteService('main', idx, s.title)}
                        className="btn btn-outline"
                        style={{ padding: '0.35rem 0.55rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* More Services Block */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                    More Services We Provide ({currentDomainData.moreServices?.length || 0})
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                    Compact checklist items shown in the quieter block below main services.
                  </div>
                </div>
                <button
                  onClick={() => handleOpenAddService('more')}
                  className="btn btn-outline"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={15} />
                  <span>Add More Service</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {(currentDomainData.moreServices || []).map((title, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{title}</span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        title="Move Up"
                        disabled={idx === 0}
                        onClick={() => reorderServiceItems(selectedDomain, 'more', idx, 'up')}
                        className="btn btn-outline"
                        style={{ padding: '0.3rem', opacity: idx === 0 ? 0.3 : 1 }}
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        title="Move Down"
                        disabled={idx === currentDomainData.moreServices.length - 1}
                        onClick={() => reorderServiceItems(selectedDomain, 'more', idx, 'down')}
                        className="btn btn-outline"
                        style={{ padding: '0.3rem', opacity: idx === currentDomainData.moreServices.length - 1 ? 0.3 : 1 }}
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => handleOpenEditService('more', idx, title)}
                        className="btn btn-outline"
                        style={{ padding: '0.3rem 0.5rem' }}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDeleteService('more', idx, title)}
                        className="btn btn-outline"
                        style={{ padding: '0.3rem 0.5rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Modal (Add / Edit) */}
            {serviceModal.isOpen && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 9999,
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem'
                }}
              >
                <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                      {serviceModal.mode === 'add' ? 'Add Service' : 'Edit Service'}
                    </h3>
                    <button
                      onClick={() => setServiceModal((prev) => ({ ...prev, isOpen: false }))}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveServiceModal}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Service Type</label>
                      <select
                        className="form-input"
                        value={serviceModal.type}
                        onChange={(e) => setServiceModal((prev) => ({ ...prev, type: e.target.value }))}
                      >
                        <option value="main">Main Service (Feature Box)</option>
                        <option value="more">More Service (Compact List Item)</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Service Title / Name *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. GST Billing & Invoice POS App"
                        value={serviceModal.title}
                        onChange={(e) => setServiceModal((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    {serviceModal.type === 'main' && (
                      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label">Short Description</label>
                        <textarea
                          rows={3}
                          className="form-input"
                          placeholder="Brief summary of what this service delivers..."
                          value={serviceModal.desc}
                          onChange={(e) => setServiceModal((prev) => ({ ...prev, desc: e.target.value }))}
                        />
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setServiceModal((prev) => ({ ...prev, isOpen: false }))}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-cta-yellow">
                        {serviceModal.mode === 'add' ? 'Save Service' : 'Update Service'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: PORTFOLIO MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'portfolio' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Portfolio Projects ({projectsData.length})
                </h1>
                <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
                  Add, edit, and manage projects displayed in your client portfolio.
                </p>
              </div>

              <button
                onClick={() =>
                  setProjectModal({
                    isOpen: true,
                    mode: 'add',
                    id: null,
                    title: '',
                    domain: 'web',
                    clientCategory: 'Retail POS & Business',
                    shortDescription: '',
                    technologies: 'React, Node.js, Cloud',
                    metrics: '',
                    image: '/projects/saree-app.svg',
                    imageFile: null
                  })
                }
                className="btn btn-cta-yellow"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus size={16} />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'web', label: 'Web Development' },
                { id: 'app', label: 'App Development' },
                { id: 'ai', label: 'AI Automation' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPortfolioFilter(tab.id)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: portfolioFilter === tab.id ? '1px solid #1d5cf0' : '1px solid var(--border-subtle)',
                    background: portfolioFilter === tab.id ? 'rgba(29,92,240,0.15)' : 'transparent',
                    color: portfolioFilter === tab.id ? '#1d5cf0' : 'var(--text-body)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {filteredProjects.map((p) => (
                <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {/* Thumbnail */}
                  <div style={{ height: '170px', background: 'var(--bg-canvas)', position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={p.image}
                      alt={p.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/projects/clinic-web.svg'; }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(0,0,0,0.7)',
                        color: p.domainColor || '#ffe500'
                      }}
                    >
                      {p.domainLabel}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>
                        {p.clientCategory}
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {p.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                        {p.shortDescription}
                      </p>

                      {p.metrics && (
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#12a150', marginBottom: '0.75rem' }}>
                          ✓ {p.metrics}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        onClick={() =>
                          setProjectModal({
                            isOpen: true,
                            mode: 'edit',
                            id: p.id,
                            title: p.title,
                            domain: p.domain,
                            clientCategory: p.clientCategory || '',
                            shortDescription: p.shortDescription || '',
                            technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
                            metrics: p.metrics || '',
                            image: p.image || '/projects/clinic-web.svg',
                            imageFile: null
                          })
                        }
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProject(p.id, p.title)}
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Project Add / Edit Modal */}
            {projectModal.isOpen && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 9999,
                  background: 'rgba(0,0,0,0.7)',
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
                    maxWidth: '560px',
                    width: '100%',
                    padding: '2rem',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                      {projectModal.mode === 'add' ? 'Add Portfolio Project' : 'Edit Project'}
                    </h3>
                    <button
                      onClick={() => setProjectModal((prev) => ({ ...prev, isOpen: false }))}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProjectModal}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Project Title *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Retail POS & Inventory Billing App"
                        value={projectModal.title}
                        onChange={(e) => setProjectModal((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Domain *</label>
                        <select
                          className="form-input"
                          value={projectModal.domain}
                          onChange={(e) => setProjectModal((prev) => ({ ...prev, domain: e.target.value }))}
                        >
                          <option value="web">Web Development</option>
                          <option value="app">App Development</option>
                          <option value="ai">AI Automation</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Client Category</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Supermarket, Clinic"
                          value={projectModal.clientCategory}
                          onChange={(e) => setProjectModal((prev) => ({ ...prev, clientCategory: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Short Description *</label>
                      <textarea
                        rows={2}
                        required
                        className="form-input"
                        placeholder="Explain what the system does for the client..."
                        value={projectModal.shortDescription}
                        onChange={(e) => setProjectModal((prev) => ({ ...prev, shortDescription: e.target.value }))}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Key Metric / Result</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Saved ₹35,000/mo"
                          value={projectModal.metrics}
                          onChange={(e) => setProjectModal((prev) => ({ ...prev, metrics: e.target.value }))}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Technologies (comma separated)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="React, Flutter, PostgreSQL"
                          value={projectModal.technologies}
                          onChange={(e) => setProjectModal((prev) => ({ ...prev, technologies: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Image Upload / URL */}
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label className="form-label">Project Image / Screenshot</label>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', background: '#0b1b4a' }}>
                          <img
                            src={projectModal.image}
                            alt="Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = '/projects/clinic-web.svg'; }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label
                            className="btn btn-outline"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.45rem 0.85rem',
                              fontSize: '0.82rem',
                              cursor: 'pointer'
                            }}
                          >
                            <Upload size={14} />
                            <span>{isUploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={handleImageFileChange}
                              disabled={isUploadingImage}
                            />
                          </label>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                            Uploads to Supabase Storage bucket ('portfolio-images')
                          </div>
                        </div>
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Or enter image URL path (e.g. /projects/saree-app.svg)"
                        value={projectModal.image}
                        onChange={(e) => setProjectModal((prev) => ({ ...prev, image: e.target.value }))}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => setProjectModal((prev) => ({ ...prev, isOpen: false }))}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-cta-yellow">
                        {projectModal.mode === 'add' ? 'Save Project' : 'Update Project'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: ENQUIRIES / LEADS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'enquiries' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Customer Enquiries ({enquiries.length})
                </h1>
                <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
                  Leads generated from the website form. Call or message them immediately on WhatsApp.
                </p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div
              className="card"
              style={{
                padding: '1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by name, phone, or requirements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              {/* Status Filter Tabs */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {['All', 'New', 'Contacted', 'Closed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      border: statusFilter === st ? '1px solid #1d5cf0' : '1px solid var(--border-subtle)',
                      background: statusFilter === st ? 'rgba(29,92,240,0.15)' : 'transparent',
                      color: statusFilter === st ? '#1d5cf0' : 'var(--text-body)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Service Filter Dropdown */}
              <select
                className="form-input"
                style={{ width: 'auto', minWidth: '150px' }}
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="All">All Services</option>
                <option value="Web">Web Development</option>
                <option value="App">App Development</option>
                <option value="AI">AI Automation</option>
              </select>
            </div>

            {/* Enquiries List */}
            {filteredEnquiries.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                No enquiries match your search criteria.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredEnquiries.map((enq) => {
                  const whatsappUrl = `https://wa.me/91${enq.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(enq.name)}%2C%20Lingaswamy%20from%20ZippyTechSystems%20here.%20I%20received%20your%20quote%20request%20for%20${encodeURIComponent(enq.service || 'our services')}.`;

                  return (
                    <div
                      key={enq.id}
                      className="card"
                      style={{
                        padding: '1.25rem 1.5rem',
                        borderLeft:
                          enq.status === 'New'
                            ? '4px solid #ffe500'
                            : enq.status === 'Contacted'
                            ? '4px solid #1d5cf0'
                            : '4px solid #94a3b8'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                              {enq.name}
                            </h3>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                              • {new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.88rem', color: '#1d5cf0', fontWeight: 600, marginTop: '0.2rem' }}>
                            {enq.service}
                          </div>
                        </div>

                        {/* Status Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Status:</span>
                          <select
                            value={enq.status}
                            onChange={(e) => {
                              updateEnquiryStatus(enq.id, e.target.value);
                              showToast(`Lead status updated to ${e.target.value}`);
                            }}
                            className="form-input"
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              width: 'auto',
                              borderColor:
                                enq.status === 'New'
                                  ? '#ffe500'
                                  : enq.status === 'Contacted'
                                  ? '#1d5cf0'
                                  : 'var(--border-subtle)'
                            }}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      </div>

                      {/* Message Body */}
                      {enq.message && (
                        <div
                          style={{
                            background: 'var(--bg-surface)',
                            padding: '0.85rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            color: 'var(--text-body)',
                            lineHeight: 1.5,
                            marginBottom: '1rem'
                          }}
                        >
                          "{enq.message}"
                        </div>
                      )}

                      {/* Row Action Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          Phone: <a href={`tel:${enq.phone}`} style={{ color: '#1d5cf0', textDecoration: 'none' }}>{enq.phone}</a>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <a
                            href={`tel:${enq.phone}`}
                            className="btn btn-outline"
                            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <Phone size={14} color="#12a150" />
                            <span>Call</span>
                          </a>

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn"
                            style={{
                              background: '#12a150',
                              color: '#ffffff',
                              padding: '0.45rem 0.95rem',
                              fontSize: '0.82rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              border: 'none',
                              textDecoration: 'none'
                            }}
                          >
                            <MessageCircle size={14} />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            onClick={() =>
                              openConfirm(
                                'Delete Enquiry',
                                `Delete enquiry from ${enq.name}?`,
                                async () => {
                                  await deleteEnquiry(enq.id);
                                  showToast('Enquiry deleted.', 'error');
                                }
                              )
                            }
                            className="btn btn-outline"
                            style={{ padding: '0.45rem 0.65rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                            title="Delete Lead"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
                    <label className="form-label">WhatsApp Number</label>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
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

                <button type="submit" className="btn btn-cta-yellow" style={{ padding: '0.75rem 1.75rem', fontWeight: 700 }}>
                  Save Site Settings
                </button>
              </form>
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
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 0.5rem'
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
                padding: '6px 8px'
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
