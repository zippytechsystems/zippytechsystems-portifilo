import React, { useEffect, useState, useRef } from 'react';
import { X, Check, Cpu, Layers, Sparkles, ArrowRight, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Share2, MessageCircle, CheckCircle2 } from 'lucide-react';
import { buildWhatsAppUrl } from '../data/content';

/**
 * ProjectModal Lightbox Viewer:
 * - Deep-link ready (/portfolio/:slug).
 * - Interactive Image Zoom (1x vs 1.6x).
 * - Keyboard navigation (Escape to close, Left/Right arrows to cycle projects).
 * - Touch swipe left/right to browse adjacent case studies.
 * - Shareable deep-link copy with toast confirmation.
 * - Direct WhatsApp inquiry pre-filled to founder Lingaswamy (6302690251).
 */
export default function ProjectModal({
  project,
  projects = [],
  onClose,
  onSelectProject,
  onStartSimilarProject
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const touchStartX = useRef(null);
  const modalContentRef = useRef(null);

  // Find index of current project for Prev / Next cycling
  const currentIndex = projects && projects.length > 0 && project
    ? projects.findIndex((p) => (p.id === project.id || p.slug === project.slug))
    : -1;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < projects.length - 1;

  const handlePrev = () => {
    if (hasPrev && onSelectProject) {
      setIsZoomed(false);
      onSelectProject(projects[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext && onSelectProject) {
      setIsZoomed(false);
      onSelectProject(projects[currentIndex + 1]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [currentIndex, projects, onClose]);

  // Touch swipe detection
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX.current;
    touchStartX.current = null;

    if (diffX > 60) {
      handlePrev(); // Swipe right -> Previous
    } else if (diffX < -60) {
      handleNext(); // Swipe left -> Next
    }
  };

  const handleCopyLink = async () => {
    if (!project) return;
    const slug = project.slug || project.id;
    const shareUrl = `${window.location.origin}/portfolio/${slug}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    } catch {
      setCopiedLink(false);
    }
  };

  if (!project) return null;

  const accentColor = project.accentColor || project.domainColor || '#1d5cf0';
  const type = project.type || project.domainLabel || 'Custom Solution';
  const category = project.category || project.clientCategory || 'Business Solution';
  const fullDescription = project.fullDescription || project.shortDescription || project.description || '';
  const highlights = project.keyHighlights || (project.technologies || []).map((t) => `Customized & engineered using ${t}`);
  const technologies = project.technologies || project.tech || [];
  const demoMetrics = project.demoMetrics || (project.metrics ? [{ label: 'Impact Metric', value: project.metrics }] : null);
  const architecture = project.architecture || `Modern responsive ${type} architecture tailored for high uptime, clean UI, and direct business impact.`;

  const whatsappInquiryUrl = buildWhatsAppUrl(
    `Hi Lingaswamy, I saw the "${project.title}" case study on your portfolio. Can you build a similar solution for my business?`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 'var(--z-modal, 100)',
        backgroundColor: 'rgba(5, 8, 15, 0.86)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeInUp 0.25s ease-out'
      }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Floating Side Prev Button (Desktop) */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="btn-icon-only hide-on-mobile"
          style={{
            position: 'absolute',
            left: '1.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(12, 18, 31, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            borderRadius: '50%',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
          }}
          title="Previous Project (Left Arrow)"
          aria-label="Previous Project"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Floating Side Next Button (Desktop) */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="btn-icon-only hide-on-mobile"
          style={{
            position: 'absolute',
            right: '1.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(12, 18, 31, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            borderRadius: '50%',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
          }}
          title="Next Project (Right Arrow)"
          aria-label="Next Project"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Main Lightbox Modal Window */}
      <div
        ref={modalContentRef}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: '#0c121f',
          borderColor: 'rgba(255, 255, 255, 0.16)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 45px rgba(29, 92, 240, 0.15)',
          padding: '0',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div
          style={{
            padding: '1.5rem 2rem 1.25rem 2rem',
            background: `radial-gradient(circle at top right, ${accentColor}25 0%, rgba(12, 18, 31, 0.98) 70%)`,
            borderBottom: '1px solid var(--border-glass)',
            position: 'relative'
          }}
        >
          {/* Action buttons (Share, Zoom, Close) */}
          <div style={{ position: 'absolute', top: '1.25rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Share Deep-Link button */}
            <button
              onClick={handleCopyLink}
              className="btn btn-sm btn-outline"
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.75rem',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: copiedLink ? '#12a15025' : 'rgba(255, 255, 255, 0.05)',
                borderColor: copiedLink ? '#12a150' : 'var(--border-glass)',
                color: copiedLink ? '#12a150' : 'var(--text-main)'
              }}
              title="Copy shareable link to this project"
            >
              {copiedLink ? <CheckCircle2 size={13} color="#12a150" /> : <Share2 size={13} />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="btn-icon-only"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
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
              <X size={18} />
            </button>
          </div>

          {/* Badges & Category */}
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
            {currentIndex >= 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', opacity: 0.8 }}>
                ({currentIndex + 1} of {projects.length})
              </span>
            )}
          </div>

          <h2 id="modal-project-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', color: '#ffffff', marginBottom: '0.5rem' }}>
            {project.title}
          </h2>

          <p style={{ fontSize: '0.96rem', color: 'var(--text-body)', lineHeight: 1.55, maxWidth: '640px', margin: 0 }}>
            {fullDescription}
          </p>
        </div>

        {/* Visual Graphic & Zoom Lightbox Strip */}
        {project.image && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              background: '#070b14',
              borderBottom: '1px solid var(--border-glass)',
              overflow: 'hidden',
              cursor: isZoomed ? 'zoom-out' : 'zoom-in'
            }}
            onClick={() => setIsZoomed(!isZoomed)}
            title="Click to Zoom / Toggle Lightbox Preview"
          >
            <div
              style={{
                width: '100%',
                maxHeight: isZoomed ? '540px' : '320px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 350ms cubic-bezier(0.25, 1, 0.5, 1)',
                padding: isZoomed ? '0.5rem' : '1.5rem',
                transform: isZoomed ? 'scale(1.15)' : 'scale(1)'
              }}
            >
              <img
                src={project.image}
                alt={`${project.title} diagram preview`}
                style={{
                  maxWidth: '100%',
                  maxHeight: isZoomed ? '520px' : '290px',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6)'
                }}
              />
            </div>

            {/* Zoom Toggle Pill */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '16px',
                background: 'rgba(12, 18, 31, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.74rem',
                color: 'var(--text-dim)',
                pointerEvents: 'none'
              }}
            >
              {isZoomed ? <ZoomOut size={13} color="#ffe500" /> : <ZoomIn size={13} />}
              <span>{isZoomed ? 'Zoom Out (1.6x Active)' : 'Click to Inspect Zoom'}</span>
            </div>
          </div>
        )}

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
                  Architecture &amp; Data Flow
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
            padding: '1.25rem 2rem',
            borderTop: '1px solid var(--border-glass)',
            background: 'rgba(7, 10, 17, 0.95)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          {/* Mobile Prev / Next Pager */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className="btn btn-sm btn-outline"
              style={{
                opacity: hasPrev ? 1 : 0.4,
                cursor: hasPrev ? 'pointer' : 'not-allowed',
                padding: '0.35rem 0.65rem'
              }}
              title="Previous project"
            >
              <ChevronLeft size={15} />
              <span>Prev</span>
            </button>
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="btn btn-sm btn-outline"
              style={{
                opacity: hasNext ? 1 : 0.4,
                cursor: hasNext ? 'pointer' : 'not-allowed',
                padding: '0.35rem 0.65rem'
              }}
              title="Next project"
            >
              <span>Next</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.6rem 1.1rem' }}>
              Close
            </button>
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-cta-yellow"
              style={{ padding: '0.6rem 1.25rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <MessageCircle size={16} color="#0b1b4a" />
              <span>Discuss on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
