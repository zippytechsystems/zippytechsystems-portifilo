import React, { useState } from 'react';
import { Check, Sparkles, MessageCircle, Calculator, ArrowRight } from 'lucide-react';
import { content, buildWhatsAppUrl } from '../data/content';
import { useData } from '../context/DataContext';
import CostEstimator from './CostEstimator';

export default function PackagesSection() {
  const { packagesData, loading } = useData();
  const packages = packagesData && packagesData.length > 0 ? packagesData : content.packages || [];

  const [viewMode, setViewMode] = useState('packages'); // 'packages' | 'estimator'
  const [activeDomain, setActiveDomain] = useState('all');

  const domainTabs = [
    { id: 'all', label: 'All 3 Services Packages' },
    { id: 'web', label: 'Web Development (From ₹6,500)' },
    { id: 'app', label: 'App Development (From ₹20,000)' },
    { id: 'ai', label: 'AI Agent Development (From ₹7,500)' }
  ];

  const filteredPackages =
    activeDomain === 'all'
      ? packages
      : packages.filter((p) => p.domain === activeDomain);

  return (
    <section
      id="packages"
      style={{
        padding: '5.5rem 0',
        background: 'var(--bg-canvas)',
        borderTop: '1px solid var(--border-subtle)',
        position: 'relative'
      }}
      aria-labelledby="packages-heading"
    >
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem auto' }}>
          <span className="badge badge-green" style={{ marginBottom: '1rem' }}>
            TRANSPARENT PRICING TIERS
          </span>
          <h2 id="packages-heading" style={{ marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}>
            Turnkey <span style={{ color: '#12a150' }}>Solutions & Pricing</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
            No surprise billing, hidden maintenance fees, or agency commissions. Choose a turnkey package or customize your exact estimate.
          </p>
        </div>

        {/* View Mode Toggle: Turnkey Packages vs Custom Cost Estimator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '3rem'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--bg-surface)',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--card-shadow)',
              gap: '6px'
            }}
            role="tablist"
            aria-label="Pricing view mode"
          >
            <button
              onClick={() => setViewMode('packages')}
              role="tab"
              aria-selected={viewMode === 'packages'}
              className="btn"
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.92rem',
                borderRadius: 'var(--radius-full)',
                background: viewMode === 'packages' ? '#12a150' : 'transparent',
                color: viewMode === 'packages' ? '#ffffff' : 'var(--text-main)',
                fontWeight: viewMode === 'packages' ? 700 : 500,
                boxShadow: viewMode === 'packages' ? '0 4px 14px rgba(18, 161, 80, 0.3)' : 'none',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Sparkles size={16} />
              <span>Turnkey Packages</span>
            </button>

            <button
              onClick={() => setViewMode('estimator')}
              role="tab"
              aria-selected={viewMode === 'estimator'}
              className="btn"
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.92rem',
                borderRadius: 'var(--radius-full)',
                background: viewMode === 'estimator' ? '#1d5cf0' : 'transparent',
                color: viewMode === 'estimator' ? '#ffffff' : 'var(--text-main)',
                fontWeight: viewMode === 'estimator' ? 700 : 500,
                boxShadow: viewMode === 'estimator' ? '0 4px 14px rgba(29, 92, 240, 0.3)' : 'none',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Calculator size={16} />
              <span>Custom Cost Estimator</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '10px',
                  background: viewMode === 'estimator' ? '#ffe500' : 'rgba(29, 92, 240, 0.15)',
                  color: viewMode === 'estimator' ? '#0b1b4a' : '#1d5cf0',
                  letterSpacing: '0.5px'
                }}
              >
                LIVE
              </span>
            </button>
          </div>
        </div>

        {/* View 1: Turnkey Packages Grid */}
        {viewMode === 'packages' && (
          <>
            {/* Filter Tabs */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                marginBottom: '3rem'
              }}
              role="tablist"
              aria-label="Filter packages by domain"
            >
              {domainTabs.map((tab) => {
                const isActive = activeDomain === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDomain(tab.id)}
                    className="btn"
                    role="tab"
                    aria-selected={isActive}
                    style={{
                      padding: '0.55rem 1.25rem',
                      fontSize: '0.9rem',
                      borderRadius: 'var(--radius-full)',
                      border: isActive ? '1px solid #12a150' : '1px solid var(--border-subtle)',
                      background: isActive ? '#12a150' : 'var(--bg-surface)',
                      color: isActive ? '#ffffff' : 'var(--text-main)',
                      fontWeight: isActive ? 700 : 500,
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

        {/* Loading Skeleton */}
        {loading && (!packages || packages.length === 0) && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }}
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="card skeleton"
                style={{ height: '420px', borderRadius: '16px', opacity: 0.6 }}
              />
            ))}
          </div>
        )}

        {/* Friendly Empty State */}
        {!loading && filteredPackages.length === 0 && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '550px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Packages Found</h3>
            <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
              We customize bespoke packages for unique enterprise requirements. Reach out directly on WhatsApp.
            </p>
            <a
              href={buildWhatsAppUrl("Hi Lingaswamy, I'd like to get a custom solution package quote.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-cta-yellow"
            >
              <MessageCircle size={16} />
              <span>Request Custom Package Quote</span>
            </a>
          </div>
        )}

        {/* Packages Grid */}
        {filteredPackages.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }}
          >
            {filteredPackages.map((pkg) => {
              const isWeb = pkg.domain === 'web';
              const isApp = pkg.domain === 'app';
              const domainColor = isWeb ? '#1d5cf0' : isApp ? '#12a150' : '#7a2fd0';
              const domainLabel = isWeb
                ? 'Web Development Services'
                : isApp
                ? 'App Development Services'
                : 'AI Agent Development Services';

              const quoteMsg = `Hi Lingaswamy, I am interested in the ${pkg.name} (${pkg.price}) for my business. Please share next steps!`;

              return (
                <div
                  key={pkg.id}
                  className="card"
                  style={{
                    padding: '2.25rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    border: pkg.popular ? `2px solid ${domainColor}` : '1px solid var(--border-glass)',
                    borderRadius: '18px',
                    boxShadow: pkg.popular ? `0 12px 35px ${domainColor}20` : '0 8px 30px rgba(0,0,0,0.06)'
                  }}
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-13px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: domainColor,
                        color: '#ffffff',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        padding: '4px 14px',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: `0 4px 12px ${domainColor}40`
                      }}
                    >
                      <Sparkles size={13} />
                      <span>Most Popular</span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: domainColor,
                          background: `${domainColor}15`,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)'
                        }}
                      >
                        {domainLabel}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        fontFamily: 'var(--font-display)',
                        color: 'var(--text-main)',
                        marginBottom: '0.5rem'
                      }}
                    >
                      {pkg.name}
                    </h3>

                    {pkg.tagline && (
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                        {pkg.tagline}
                      </p>
                    )}

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '1.75rem' }}>
                      <span
                        style={{
                          fontSize: '2.2rem',
                          fontWeight: 800,
                          fontFamily: 'var(--font-display)',
                          color: domainColor
                        }}
                      >
                        {pkg.price}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>all-inclusive start</span>
                    </div>

                    {/* Deliverables List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                      {pkg.deliverables?.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: `${domainColor}20`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px'
                            }}
                          >
                            <Check size={11} color={domainColor} strokeWidth={3} />
                          </div>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.4 }}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={buildWhatsAppUrl(quoteMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={pkg.popular ? 'btn btn-cta-yellow' : 'btn btn-outline'}
                    style={{ width: '100%', padding: '0.8rem', justifyContent: 'center' }}
                  >
                    <MessageCircle size={16} />
                    <span>Choose This Package</span>
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Quote Banner below Packages */}
          <div
            className="card"
            style={{
              marginTop: '3.5rem',
              padding: 'clamp(1.5rem, 3vw, 2.25rem)',
              background: 'linear-gradient(135deg, rgba(11, 27, 74, 0.7) 0%, rgba(29, 92, 240, 0.15) 100%)',
              border: '1px solid rgba(29, 92, 240, 0.3)',
              borderRadius: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem'
            }}
          >
            <div style={{ maxWidth: '600px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#ffe500',
                  letterSpacing: '1px',
                  display: 'block',
                  marginBottom: '0.35rem'
                }}
              >
                LOOKING FOR A HYBRID OR CUSTOM STACK?
              </span>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
                Build Your Own Custom Feature Package
              </h4>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.92rem', margin: 0, lineHeight: 1.5 }}>
                Select exact modules (E-commerce, UPI payments, barcode scanner, GST invoices, AI voice) and receive a calculated instant INR estimate.
              </p>
            </div>

            <button
              onClick={() => {
                setViewMode('estimator');
                const el = document.getElementById('packages');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-primary"
              style={{
                padding: '0.85rem 1.6rem',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <Calculator size={18} />
              <span>Open Cost Estimator</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}

      {/* View 2: Interactive Cost Estimator */}
      {viewMode === 'estimator' && (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <CostEstimator />
        </div>
      )}
    </div>
  </section>
  );
}
