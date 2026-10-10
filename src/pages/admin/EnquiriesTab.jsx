import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Download,
  Search,
  AlertCircle,
  Clock,
  Sliders,
  Phone,
  Bot,
  BadgePercent,
  Send,
  Mail,
  Check,
  MessageCircle,
  Trash2
} from 'lucide-react';

export default function EnquiriesTab({
  showToast,
  openConfirm,
  statusFilter = 'All',
  setStatusFilter
}) {
  const {
    enquiries,
    overdueEnquiriesCount,
    updateEnquiryStatus,
    deleteEnquiry,
    exportEnquiriesCSV
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  // Filtered Enquiries
  const filteredEnquiries = (enquiries || []).filter((enq) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (enq.name || '').toLowerCase().includes(query) ||
      (enq.phone || '').includes(query) ||
      (enq.email || '').toLowerCase().includes(query) ||
      (enq.message || '').toLowerCase().includes(query) ||
      (enq.notes || '').toLowerCase().includes(query);

    let matchesStatus = false;
    if (statusFilter === 'All') {
      matchesStatus = true;
    } else if (statusFilter === 'Overdue') {
      matchesStatus =
        enq.status === 'New' &&
        (enq.isOverdue || (enq.created_at && Date.now() - new Date(enq.created_at).getTime() >= 24 * 60 * 60 * 1000));
    } else {
      matchesStatus = enq.status === statusFilter;
    }

    const matchesService =
      serviceFilter === 'All' || (enq.service || '').toLowerCase().includes(serviceFilter.toLowerCase());
    const matchesSource =
      sourceFilter === 'All' || (enq.source || 'contact') === sourceFilter;
    return matchesSearch && matchesStatus && matchesService && matchesSource;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
            Customer Enquiries ({(enquiries || []).length})
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
            Leads generated from the website form. Call or message them immediately on WhatsApp.
          </p>
        </div>

        <button
          type="button"
          onClick={exportEnquiriesCSV}
          className="btn btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 600 }}
        >
          <Download size={16} />
          <span>Export to CSV</span>
        </button>
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
          {['All', 'New', 'Overdue', 'Contacted', 'Closed'].map((st) => {
            const isOverdueTab = st === 'Overdue';
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter && setStatusFilter(st)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected
                    ? isOverdueTab ? '1px solid #ef4444' : '1px solid #1d5cf0'
                    : isOverdueTab && overdueEnquiriesCount > 0 ? '1px solid rgba(239,68,68,0.4)' : '1px solid var(--border-subtle)',
                  background: isSelected
                    ? isOverdueTab ? 'rgba(239,68,68,0.15)' : 'rgba(29,92,240,0.15)'
                    : 'transparent',
                  color: isSelected
                    ? isOverdueTab ? '#ef4444' : '#1d5cf0'
                    : isOverdueTab && overdueEnquiriesCount > 0 ? '#ef4444' : 'var(--text-body)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {st} {isOverdueTab && overdueEnquiriesCount > 0 ? `(${overdueEnquiriesCount})` : ''}
              </button>
            );
          })}
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

        {/* Source Filter Dropdown */}
        <select
          className="form-input"
          style={{ width: 'auto', minWidth: '150px' }}
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
        >
          <option value="All">All Sources</option>
          <option value="project">Project Builder</option>
          <option value="callback">Callback Request</option>
          <option value="contact">Contact Form</option>
          <option value="quote">Fast Quote</option>
          <option value="chatbot">AI Chatbot Leads</option>
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

            const isOverdue =
              enq.status === 'New' &&
              (enq.isOverdue ||
                (enq.created_at && Date.now() - new Date(enq.created_at).getTime() >= 24 * 60 * 60 * 1000));

            let servicesList = [];
            if (Array.isArray(enq.selected_services)) {
              servicesList = enq.selected_services;
            } else if (typeof enq.selected_services === 'string') {
              try {
                servicesList = JSON.parse(enq.selected_services);
              } catch (e) {
                servicesList = [];
              }
            }

            return (
              <div
                key={enq.id}
                className="card"
                style={{
                  padding: '1.25rem 1.5rem',
                  borderLeft: isOverdue
                    ? '4px solid #ef4444'
                    : enq.status === 'New'
                    ? '4px solid #ffe500'
                    : enq.status === 'Contacted'
                    ? '4px solid #1d5cf0'
                    : '4px solid #94a3b8'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                        {enq.name}
                      </h3>

                      {/* 24-Hour SLA / Status Badge */}
                      {isOverdue ? (
                        <span
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.35)',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <AlertCircle size={12} /> Overdue (&gt; 24h)
                        </span>
                      ) : enq.status === 'New' ? (
                        <span
                          style={{
                            background: 'rgba(18, 161, 80, 0.12)',
                            color: '#12a150',
                            border: '1px solid rgba(18, 161, 80, 0.3)',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Clock size={12} /> Within 24h
                        </span>
                      ) : null}

                      {/* Source Badge */}
                      {enq.source === 'project' ? (
                        <span
                          style={{
                            background: 'rgba(29, 92, 240, 0.15)',
                            color: '#60a5fa',
                            border: '1px solid rgba(96, 165, 250, 0.35)',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Sliders size={12} /> Project Builder
                        </span>
                      ) : enq.source === 'callback' ? (
                        <span
                          style={{
                            background: 'rgba(18, 161, 80, 0.15)',
                            color: '#4ade80',
                            border: '1px solid rgba(74, 222, 128, 0.35)',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Phone size={12} /> Callback Request
                        </span>
                      ) : enq.source === 'chatbot' ? (
                        <span
                          style={{
                            background: 'rgba(122, 47, 208, 0.15)',
                            color: '#c084fc',
                            border: '1px solid rgba(168, 85, 247, 0.35)',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Bot size={12} /> AI Chatbot
                        </span>
                      ) : enq.source === 'quote' ? (
                        <span
                          style={{
                            background: 'rgba(255, 229, 0, 0.12)',
                            color: '#ffe500',
                            border: '1px solid rgba(255, 229, 0, 0.3)',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <BadgePercent size={12} /> Fast Quote
                        </span>
                      ) : (
                        <span
                          style={{
                            background: 'rgba(148, 163, 184, 0.15)',
                            color: '#cbd5e1',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Send size={12} /> Contact Form
                        </span>
                      )}

                      <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                        • {new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: '#1d5cf0', fontWeight: 600, marginTop: '0.25rem' }}>
                      {enq.service}
                    </div>

                    {/* Email & Details */}
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '0.35rem', fontSize: '0.85rem' }}>
                      {enq.email && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-body)' }}>
                          <Mail size={13} color="#94a3b8" />
                          <a href={`mailto:${enq.email}`} style={{ color: '#1d5cf0', textDecoration: 'none' }}>
                            {enq.email}
                          </a>
                        </div>
                      )}
                      {enq.whatsapp_opt_in && (
                        <span style={{ color: '#12a150', fontSize: '0.78rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={13} /> WhatsApp opt-in confirmed
                        </span>
                      )}
                    </div>

                    {/* Selected Services Tags */}
                    {servicesList.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>Services:</span>
                        {servicesList.map((srv, sIdx) => (
                          <span
                            key={sIdx}
                            style={{
                              background: 'rgba(29, 92, 240, 0.1)',
                              color: '#60a5fa',
                              border: '1px solid rgba(29, 92, 240, 0.25)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {enq.notes && (
                      <div style={{ marginTop: '0.4rem', fontSize: '0.82rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                        <strong>Notes:</strong> {enq.notes}
                      </div>
                    )}
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
  );
}
