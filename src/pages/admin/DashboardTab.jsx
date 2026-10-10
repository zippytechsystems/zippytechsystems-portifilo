import React from 'react';
import { useData } from '../../context/DataContext';
import {
  Inbox,
  AlertCircle,
  Briefcase,
  Layers,
  Phone,
  PackageCheck,
  Star,
  HelpCircle,
  MessageCircle
} from 'lucide-react';

export default function DashboardTab({ setActiveTab, setStatusFilter }) {
  const {
    servicesData,
    enquiries,
    projectsData,
    packagesData,
    testimonialsData,
    faqsData,
    overdueEnquiriesCount
  } = useData();

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;
  const totalProjectsCount = projectsData.length;
  const totalServicesCount = servicesData.reduce(
    (acc, d) => acc + (d.mainServices?.length || 0) + (d.moreServices?.length || 0),
    0
  );
  const totalEnquiriesCount = enquiries.length;

  return (
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
          onClick={() => { setActiveTab('enquiries'); setStatusFilter && setStatusFilter('New'); }}
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

        {/* Overdue Enquiries Card (> 24h) */}
        <div
          className="card"
          onClick={() => { setActiveTab('enquiries'); setStatusFilter && setStatusFilter('Overdue'); }}
          style={{
            padding: '1.5rem',
            cursor: 'pointer',
            borderColor: overdueEnquiriesCount > 0 ? '#ef4444' : 'var(--border-glass)',
            background: overdueEnquiriesCount > 0 ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: overdueEnquiriesCount > 0 ? '#ef4444' : 'var(--text-dim)', fontWeight: 700 }}>
              OVERDUE (&gt; 24H)
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: overdueEnquiriesCount > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={18} color={overdueEnquiriesCount > 0 ? '#ef4444' : 'var(--text-dim)'} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: overdueEnquiriesCount > 0 ? '#ef4444' : 'var(--text-main)' }}>
            {overdueEnquiriesCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: overdueEnquiriesCount > 0 ? '#ef4444' : 'var(--text-dim)', marginTop: '0.35rem', fontWeight: overdueEnquiriesCount > 0 ? 600 : 400 }}>
            {overdueEnquiriesCount > 0 ? 'Exceeded 24-hr commitment!' : 'All enquiries on track'}
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

        {/* Total Packages */}
        <div
          className="card"
          onClick={() => setActiveTab('packages')}
          style={{ padding: '1.5rem', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              PRICING PACKAGES
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 229, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PackageCheck size={18} color="#ffe500" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {(packagesData || []).length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            Web, App &amp; AI packages
          </div>
        </div>

        {/* Total Testimonials */}
        <div
          className="card"
          onClick={() => setActiveTab('testimonials')}
          style={{ padding: '1.5rem', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              CLIENT REVIEWS
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 229, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={18} color="#ffe500" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {(testimonialsData || []).length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            5-star verified ratings
          </div>
        </div>

        {/* Total FAQs */}
        <div
          className="card"
          onClick={() => setActiveTab('faqs')}
          style={{ padding: '1.5rem', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              FAQS ANSWERED
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(29, 92, 240, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={18} color="#1d5cf0" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1d5cf0' }}>
            {(faqsData || []).length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            Pre-sales trust questions
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

      {/* Recent Enquiries Preview (Last 5) */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>
            Last 5 Customer Enquiries
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
            {enquiries.slice(0, 5).map((enq) => (
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
  );
}
