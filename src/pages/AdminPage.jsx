import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useData } from '../context/DataContext';
import {
  Lock,
  LogOut,
  Phone,
  MessageCircle,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Layers,
  Settings,
  Briefcase,
  Inbox,
  Globe,
  ExternalLink,
  Shield,
  Smartphone,
  Cpu,
  RefreshCw,
  AlertCircle
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
    deleteServiceItem,
    addProject,
    deleteProject,
    updateEnquiryStatus,
    deleteEnquiry,
    persistSettings
  } = useData();

  // Login form state
  const [username, setUsername] = useState('lingaswamymaddeboina');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState('enquiries');

  // Enquiries Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');

  // New Service Modal/Form State
  const [showAddService, setShowAddService] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    domainSlug: 'web-development',
    type: 'main',
    title: '',
    desc: ''
  });

  // Price Edit State
  const [priceEditingDomain, setPriceEditingDomain] = useState(null);
  const [newStartingPrice, setNewStartingPrice] = useState('');

  // New Project Form State
  const [showAddProject, setShowAddProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    domain: 'web',
    clientCategory: 'Retail & Business',
    shortDescription: '',
    technologies: 'React, Node.js, Cloud',
    metrics: '',
    image: '/projects/clinic-web.svg'
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState(settingsData);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await login(username, password);
    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials');
    }
  };

  // If Not Authenticated: Render Clean Mobile-Friendly Login Screen
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
            maxWidth: '420px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
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
            <Lock size={26} />
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', marginBottom: '1.75rem' }}>
            ZippyTechSystems Management Suite
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
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label" htmlFor="admin-user">
                Username / Email
              </label>
              <input
                id="admin-user"
                type="text"
                required
                className="form-input"
                placeholder="lingaswamymaddeboina"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
              <label className="form-label" htmlFor="admin-pass">
                Password
              </label>
              <input
                id="admin-pass"
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="btn btn-cta-yellow"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
            >
              {authLoading ? 'Verifying...' : 'Sign In to Admin'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            <Link to="/" style={{ color: 'var(--text-body)' }}>
              ← Return to public website
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      (enq.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (enq.phone || '').includes(searchQuery) ||
      (enq.message || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || enq.status === statusFilter;
    const matchesService =
      serviceFilter === 'All' ||
      (enq.service || '').toLowerCase().includes(serviceFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <main
      style={{
        paddingTop: 'calc(var(--navbar-height) + 1rem)',
        paddingBottom: '5rem',
        minHeight: '90vh',
        background: 'var(--bg-canvas)'
      }}
    >
      <div className="container">
        
        {/* Top Admin Header Bar */}
        <div
          className="card"
          style={{
            padding: '1.25rem 1.75rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="badge badge-yellow" style={{ fontSize: '0.72rem' }}>
                ADMIN CONSOLE
              </span>
              {isLiveConnected ? (
                <span className="badge badge-app" style={{ fontSize: '0.72rem' }}>
                  ● Supabase Connected
                </span>
              ) : (
                <span className="badge badge-trust" style={{ fontSize: '0.72rem' }}>
                  Offline / Local Storage Mode
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.25rem 0 0 0' }}>
              Welcome, {adminUser?.name || 'Lingaswamy'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/" className="btn btn-outline" style={{ padding: '0.55rem 0.9rem', fontSize: '0.85rem' }}>
              <ExternalLink size={15} />
              <span>View Live Site</span>
            </Link>

            <button
              onClick={logout}
              className="btn btn-outline"
              style={{ padding: '0.55rem 0.9rem', fontSize: '0.85rem', color: '#ef4444' }}
              title="Logout"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Mobile-Friendly Horizontal Scroll) */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginBottom: '1.75rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
          role="tablist"
        >
          {[
            { id: 'enquiries', label: `Leads & Enquiries (${enquiries.length})`, icon: <Inbox size={16} /> },
            { id: 'services', label: 'Services & Pricing', icon: <Layers size={16} /> },
            { id: 'portfolio', label: `Projects (${projectsData.length})`, icon: <Briefcase size={16} /> },
            { id: 'settings', label: 'Contact Settings', icon: <Settings size={16} /> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="btn"
                role="tab"
                aria-selected={isActive}
                style={{
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--brand-blue)' : 'var(--bg-surface)',
                  color: isActive ? '#ffffff' : 'var(--text-main)',
                  border: isActive ? '1px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            TAB 1: ENQUIRIES & LEADS TABLE
            ========================================================================= */}
        {activeTab === 'enquiries' && (
          <div>
            {/* Search and Filters Bar */}
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
              {/* Search Box */}
              <div style={{ position: 'relative', flex: '1 0 240px' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
                />
                <input
                  type="text"
                  placeholder="Search lead by name, phone or message..."
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Status:</span>
                {['All', 'New', 'Contacted', 'Closed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className="btn"
                    style={{
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.82rem',
                      borderRadius: 'var(--radius-full)',
                      background: statusFilter === st ? 'var(--brand-navy)' : 'var(--bg-surface-elevated)',
                      color: statusFilter === st ? '#ffe500' : 'var(--text-body)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Enquiries List / Cards */}
            {filteredEnquiries.length === 0 ? (
              <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                <Inbox size={42} style={{ color: 'var(--text-dim)', margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>No enquiries found</h3>
                <p style={{ color: 'var(--text-body)', fontSize: '0.9rem' }}>
                  When visitors submit the quote form on your website, leads will appear here instantly.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredEnquiries.map((enq) => {
                  const dateStr = enq.created_at
                    ? new Date(enq.created_at).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })
                    : 'Just now';

                  const whatsappReplyUrl = `https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${enq.name}, I am Lingaswamy from ZippyTechSystems. Regarding your enquiry for ${enq.service}...`
                  )}`;

                  return (
                    <div
                      key={enq.id}
                      className="card"
                      style={{
                        padding: '1.5rem',
                        borderLeft: `5px solid ${
                          enq.status === 'New'
                            ? '#ffe500'
                            : enq.status === 'Contacted'
                            ? '#1d5cf0'
                            : '#12a150'
                        }`
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          marginBottom: '0.75rem'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>
                              {enq.name}
                            </h3>
                            <span
                              className={`badge ${
                                enq.status === 'New'
                                  ? 'badge-yellow'
                                  : enq.status === 'Contacted'
                                  ? 'badge-web'
                                  : 'badge-app'
                              }`}
                              style={{ fontSize: '0.75rem' }}
                            >
                              {enq.status}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                              {dateStr}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.92rem', color: 'var(--brand-blue)', fontWeight: 600, marginTop: '0.35rem' }}>
                            Needed: {enq.service}
                          </div>
                        </div>

                        {/* Status Change Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Status:</span>
                          <select
                            className="form-select"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
                            value={enq.status}
                            onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      </div>

                      {/* Message Content */}
                      {enq.message && (
                        <div
                          style={{
                            background: 'var(--bg-surface)',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.92rem',
                            color: 'var(--text-body)',
                            marginBottom: '1rem',
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          "{enq.message}"
                        </div>
                      )}

                      {/* Direct Lead Action Buttons */}
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.75rem',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid var(--border-subtle)'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <a
                            href={whatsappReplyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-whatsapp"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                          >
                            <MessageCircle size={15} />
                            <span>WhatsApp ({enq.phone})</span>
                          </a>

                          <a
                            href={`tel:${enq.phone}`}
                            className="btn btn-outline"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                          >
                            <Phone size={14} color="#12a150" />
                            <span>Call Phone</span>
                          </a>
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete enquiry from ${enq.name}?`)) {
                              deleteEnquiry(enq.id);
                            }
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: SERVICES & PRICING MANAGEMENT
            ========================================================================= */}
        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Domain Starting Prices Editor */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Domain Starting Prices
              </h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Edit starting rates displayed in the hero badges, service sections, and quote flows.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem'
                }}
              >
                {servicesData.map((dom) => (
                  <div
                    key={dom.slug}
                    style={{
                      background: 'var(--bg-surface)',
                      border: `1px solid ${dom.badgeColor}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: dom.badgeColor }}>{dom.domainLabel}</span>
                      <span className="badge badge-yellow" style={{ fontSize: '0.72rem' }}>Live</span>
                    </div>

                    {priceEditingDomain === dom.slug ? (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '0.4rem 0.65rem', fontSize: '0.9rem' }}
                          value={newStartingPrice}
                          onChange={(e) => setNewStartingPrice(e.target.value)}
                          placeholder="e.g. ₹8,000"
                        />
                        <button
                          onClick={() => {
                            if (newStartingPrice.trim()) {
                              updateDomainPrice(dom.slug, newStartingPrice.trim());
                            }
                            setPriceEditingDomain(null);
                          }}
                          className="btn btn-cta-yellow"
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                          {dom.startingPrice}
                        </div>
                        <button
                          onClick={() => {
                            setPriceEditingDomain(dom.slug);
                            setNewStartingPrice(dom.startingPrice);
                          }}
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                        >
                          <Edit2 size={13} />
                          <span>Change</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Services List Breakdown */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                    Services Catalog
                  </h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                    Categorized into "Our Main Services" (prominent) and "More Services" (secondary list)
                  </p>
                </div>

                <button
                  onClick={() => setShowAddService(true)}
                  className="btn btn-cta-yellow"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
                >
                  <Plus size={16} />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Add Service Inline Modal / Form */}
              {showAddService && (
                <div
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--brand-blue)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    marginBottom: '2rem'
                  }}
                >
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Add Service Item</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Domain</label>
                      <select
                        className="form-select"
                        value={serviceForm.domainSlug}
                        onChange={(e) => setServiceForm({ ...serviceForm, domainSlug: e.target.value })}
                      >
                        <option value="web-development">Web Development</option>
                        <option value="app-development">App Development</option>
                        <option value="ai-automation">AI Automation</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Service Type</label>
                      <select
                        className="form-select"
                        value={serviceForm.type}
                        onChange={(e) => setServiceForm({ ...serviceForm, type: e.target.value })}
                      >
                        <option value="main">Our Main Services (Prominent)</option>
                        <option value="more">More Services (Compact list)</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Service Title</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Restaurant Booking App"
                        value={serviceForm.title}
                        onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      />
                    </div>
                  </div>

                  {serviceForm.type === 'main' && (
                    <div className="form-group">
                      <label className="form-label">Short Description</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Brief summary of what this main service delivers..."
                        value={serviceForm.desc}
                        onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => {
                        if (serviceForm.title.trim()) {
                          addServiceItem(
                            serviceForm.domainSlug,
                            serviceForm.type,
                            serviceForm.title.trim(),
                            serviceForm.desc.trim()
                          );
                          setServiceForm({ ...serviceForm, title: '', desc: '' });
                          setShowAddService(false);
                        }
                      }}
                      className="btn btn-cta-yellow"
                    >
                      Save Service
                    </button>
                    <button onClick={() => setShowAddService(false)} className="btn btn-outline">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Service Tables by Domain */}
              {servicesData.map((dom) => (
                <div key={dom.slug} style={{ marginBottom: '2rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1rem',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                      borderLeft: `4px solid ${dom.badgeColor}`
                    }}
                  >
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: dom.badgeColor }}>
                      {dom.domainLabel}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                      (Starts {dom.startingPrice})
                    </span>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: '1rem', border: '1px solid var(--border-subtle)' }}>
                    {/* Main Services */}
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Main Services ({dom.mainServices.length}):
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                        {dom.mainServices.map((ms, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.5rem 0.75rem',
                              background: 'var(--bg-surface)',
                              borderRadius: 'var(--radius-sm)'
                            }}
                          >
                            <div>
                              <strong style={{ fontSize: '0.9rem' }}>{ms.title}</strong>
                              {ms.desc && (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{ms.desc}</div>
                              )}
                            </div>
                            <button
                              onClick={() => deleteServiceItem(dom.slug, 'main', idx)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                              title="Delete service"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* More Services */}
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        More Services ({dom.moreServices.length}):
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                        {dom.moreServices.map((moreTitle, oIdx) => (
                          <span
                            key={oIdx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-full)',
                              background: 'var(--bg-surface-elevated)',
                              fontSize: '0.82rem',
                              color: 'var(--text-body)'
                            }}
                          >
                            <span>{moreTitle}</span>
                            <button
                              onClick={() => deleteServiceItem(dom.slug, 'more', moreTitle)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: PORTFOLIO & PROJECTS MANAGEMENT
            ========================================================================= */}
        {activeTab === 'portfolio' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Portfolio Projects</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
                  Manage project cards shown on public portfolio and home page.
                </p>
              </div>

              <button
                onClick={() => setShowAddProject(true)}
                className="btn btn-cta-yellow"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
              >
                <Plus size={16} />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Add Project Form */}
            {showAddProject && (
              <div
                className="card"
                style={{
                  padding: '1.75rem',
                  marginBottom: '2rem',
                  border: '1px solid var(--brand-blue)'
                }}
              >
                <h4 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Create New Portfolio Project</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Project Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Grocery Store POS & App"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Domain *</label>
                    <select
                      className="form-select"
                      value={projectForm.domain}
                      onChange={(e) => setProjectForm({ ...projectForm, domain: e.target.value })}
                    >
                      <option value="web">Web Development (Blue)</option>
                      <option value="app">App Development (Green)</option>
                      <option value="ai">AI Automation (Purple)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Client Category</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Supermarket & Retail"
                      value={projectForm.clientCategory}
                      onChange={(e) => setProjectForm({ ...projectForm, clientCategory: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Impact Metric</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 50% Faster Daily Billing"
                      value={projectForm.metrics}
                      onChange={(e) => setProjectForm({ ...projectForm, metrics: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description *</label>
                  <textarea
                    rows="2"
                    className="form-textarea"
                    placeholder="Describe what was built for this client..."
                    value={projectForm.shortDescription}
                    onChange={(e) => setProjectForm({ ...projectForm, shortDescription: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Technologies (comma separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={projectForm.technologies}
                      onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Image Preview SVG / URL</label>
                    <select
                      className="form-select"
                      value={projectForm.image}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                    >
                      <option value="/projects/saree-app.svg">Saree App Mockup (Green)</option>
                      <option value="/projects/clinic-web.svg">Clinic Web Mockup (Blue)</option>
                      <option value="/projects/whatsapp-ai.svg">WhatsApp AI Mockup (Purple)</option>
                      <option value="/projects/ecommerce-web.svg">E-Commerce Web Mockup (Blue)</option>
                      <option value="/projects/staff-app.svg">Staff App Mockup (Green)</option>
                      <option value="/projects/invoice-ai.svg">Invoice AI Mockup (Purple)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      if (!projectForm.title.trim() || !projectForm.shortDescription.trim()) {
                        alert('Please fill in title and description.');
                        return;
                      }
                      addProject({
                        title: projectForm.title.trim(),
                        domain: projectForm.domain,
                        clientCategory: projectForm.clientCategory.trim(),
                        shortDescription: projectForm.shortDescription.trim(),
                        technologies: projectForm.technologies.split(',').map((t) => t.trim()),
                        metrics: projectForm.metrics.trim(),
                        image: projectForm.image
                      });
                      setShowAddProject(false);
                      setProjectForm({
                        title: '',
                        domain: 'web',
                        clientCategory: 'Retail',
                        shortDescription: '',
                        technologies: 'React, Node.js',
                        metrics: '',
                        image: '/projects/clinic-web.svg'
                      });
                    }}
                    className="btn btn-cta-yellow"
                  >
                    Save Project
                  </button>
                  <button onClick={() => setShowAddProject(false)} className="btn btn-outline">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Projects Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem'
              }}
            >
              {projectsData.map((proj) => (
                <div key={proj.id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', aspectRatio: '16/10', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.85rem' }}>
                    <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span
                      className={`badge ${
                        proj.domain === 'web' ? 'badge-web' : proj.domain === 'app' ? 'badge-app' : 'badge-ai'
                      }`}
                      style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '0.72rem' }}
                    >
                      {proj.domainLabel}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem' }}>{proj.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.45, flex: '1 0 auto', marginBottom: '1rem' }}>
                    {proj.shortDescription}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.78rem', color: '#ffe500', fontWeight: 600 }}>
                      ⚡ {proj.metrics || 'Custom build'}
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete project "${proj.title}"?`)) {
                          deleteProject(proj.id);
                        }
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      title="Delete project"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: SETTINGS & CONTACT CONFIGURATION
            ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="card" style={{ padding: '2rem', maxWidth: '680px' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Site &amp; Contact Settings
            </h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
              Updates phone number, WhatsApp contact info, and site taglines across all pages.
            </p>

            {settingsSaved && (
              <div
                style={{
                  background: 'rgba(18, 161, 80, 0.15)',
                  border: '1px solid #12a150',
                  color: '#12a150',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <CheckCircle2 size={18} />
                <span>Settings saved successfully!</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                persistSettings(settingsForm);
                setSettingsSaved(true);
                setTimeout(() => setSettingsSaved(false), 3000);
              }}
            >
              <div className="form-group">
                <label className="form-label">Contact Person / Founder</label>
                <input
                  type="text"
                  className="form-input"
                  value="Lingaswamy"
                  disabled
                  style={{ opacity: 0.7 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  className="form-input"
                  value={settingsForm.phone || '9542439498'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Number (e.g. 919542439498) *</label>
                <input
                  type="text"
                  className="form-input"
                  value={settingsForm.whatsappNumber || '919542439498'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={settingsForm.tagline || 'Build • Automate • Grow'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Secondary Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={settingsForm.secondaryTagline || 'Smart Technology for a Stronger Tomorrow'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, secondaryTagline: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-cta-yellow"
                style={{ padding: '0.85rem 1.6rem', fontSize: '0.95rem', marginTop: '0.75rem' }}
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

      </div>
    </main>
  );
}
