import React, { useEffect } from 'react';
import { X, Check, Cpu, Layers, Sparkles, ArrowRight } from 'lucide-react';

export default function ProjectModal({ project, onClose, onStartSimilarProject }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!project) return null;

  const accentColor = project.accentColor || project.domainColor || '#1d5cf0';
  const type = project.type || project.domainLabel || 'Custom Solution';
  const category = project.category || project.clientCategory || 'Business Solution';
  const fullDescription = project.fullDescription || project.shortDescription || project.description || '';
  const highlights = project.keyHighlights || (project.technologies || []).map((t) => `Customized & engineered using ${t}`);
  const technologies = project.technologies || project.tech || [];
  const demoMetrics = project.demoMetrics || (project.metrics ? [{ label: 'Impact Metric', value: project.metrics }] : null);
  const architecture = project.architecture || `Modern responsive ${type} architecture tailored for high uptime, clean UI, and direct business impact.`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 'var(--z-modal)',
        backgroundColor: 'rgba(5, 8, 15, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeInUp 0.25s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#0c121f',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.12)',
          padding: '0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Banner */}
        <div
          style={{
            padding: '2rem',
            background: `radial-gradient(circle at top right, ${accentColor}20 0%, rgba(12, 18, 31, 0.98) 70%)`,
            borderBottom: '1px solid var(--border-glass)',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="btn-icon-only"
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px'
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span
              className="badge"
              style={{
                background: `${accentColor}18`,
                color: accentColor,
                border: `1px solid ${accentColor}35`,
                fontSize: '0.75rem',
                fontWeight: '700'
              }}
            >
              {type}
            </span>
            <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
              {category}
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', color: '#ffffff', marginBottom: '0.5rem' }}>
            {project.title}
          </h2>

          <p style={{ fontSize: '1rem', color: 'var(--text-body)', lineHeight: 1.6, maxWidth: '640px' }}>
            {fullDescription}
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Key Metrics Strip */}
          {demoMetrics && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              {demoMetrics.map((metric, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    {metric.label}
                  </div>
                  <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: accentColor }}>
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Key Engineering Highlights */}
          {highlights && highlights.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color={accentColor} />
                <span>Key Technical Highlights</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {highlights.map((highlight, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div
                      style={{
                        marginTop: '3px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: `${accentColor}20`,
                        color: accentColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Architecture Summary */}
          {architecture && (
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 23, 38, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Layers size={16} color="var(--brand-blue)" />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-dim)' }}>
                  Architecture & Data Flow
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                {architecture}
              </p>
            </div>
          )}

          {/* Technology Tags */}
          {technologies && technologies.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={18} color="var(--brand-blue)" />
                <span>Engineered With</span>
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      color: 'var(--text-main)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderTop: '1px solid var(--border-glass)',
            background: 'rgba(7, 10, 17, 0.95)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            Interested in a similar system for your business?
          </span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.6rem 1.1rem' }}>
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onStartSimilarProject) {
                  onStartSimilarProject(project);
                } else {
                  const inquiryUrl = `https://wa.me/916302690251?text=${encodeURIComponent(
                    `Hi Lingaswamy, I am interested in building a solution similar to "${project.title}". Please share quotation & timeline.`
                  )}`;
                  window.open(inquiryUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              className="btn btn-cta-yellow"
              style={{ padding: '0.6rem 1.25rem' }}
            >
              <span>Discuss Similar Project</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
