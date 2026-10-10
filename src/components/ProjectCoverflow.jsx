import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, MessageCircle, ArrowUpRight } from 'lucide-react';
import { buildWhatsAppUrl } from '../data/content';
import { useQualityTier } from '../context/QualityTierContext';
import TiltCard from './TiltCard';

export default function ProjectCoverflow({ projects = [], onSelectProject }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isFull, isReduced } = useQualityTier();
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projects.length]);

  if (!projects || projects.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
  };

  // Mobile Native Scroll-Snap Layout
  if (isMobile || !isFull || isReduced) {
    return (
      <div className="coverflow-mobile-wrapper" style={{ width: '100%' }}>
        <div
          ref={containerRef}
          style={{
            display: 'flex',
            gap: '1.25rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '1.5rem',
            paddingTop: '0.5rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {projects.map((project, idx) => {
            const isWeb = project.domain === 'web';
            const isApp = project.domain === 'app';
            const tagClass = isWeb ? 'badge-web' : isApp ? 'badge-app' : 'badge-ai';
            const projectInquiryUrl = buildWhatsAppUrl(
              `Hi Lingaswamy, I saw the "${project.title}" project on your portfolio. Can you build a similar solution for my business?`
            );

            return (
              <div
                key={project.id || idx}
                style={{
                  flex: '0 0 88%',
                  maxWidth: '340px',
                  scrollSnapAlign: 'center',
                  borderRadius: 'var(--radius-xl)'
                }}
              >
                <div
                  className="card frosted-glass"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    padding: '1.5rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => onSelectProject && onSelectProject(project)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className={`badge ${tagClass}`}>{project.type || 'Custom Solution'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>{project.domain?.toUpperCase()}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{project.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.5, flex: '1 0 auto', marginBottom: '1rem' }}>
                    {project.shortDesc || project.description}
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {(project.technologies || project.tech || []).slice(0, 3).map((t, i) => (
                      <span key={i} style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      className="btn btn-outline"
                      style={{ flex: 1, padding: '0.55rem', fontSize: '0.85rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject && onSelectProject(project);
                      }}
                    >
                      <span>Details</span>
                      <ArrowUpRight size={15} />
                    </button>
                    <a
                      href={projectInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-cta-yellow"
                      style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle size={15} color="#0b1b4a" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '0.75rem' }}>
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (containerRef.current) {
                  const cardW = 340 + 20;
                  containerRef.current.scrollTo({ left: idx * cardW, behavior: 'smooth' });
                }
              }}
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                border: 'none',
                background: idx === currentIndex ? 'var(--brand-blue)' : 'var(--border-subtle)',
                cursor: 'pointer',
                padding: 0
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop 3D Perspective Coverflow
  return (
    <div
      className="coverflow-3d-container"
      style={{
        position: 'relative',
        width: '100%',
        perspective: '1200px',
        padding: '2.5rem 0',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'relative',
          height: '460px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {projects.map((project, idx) => {
          const offset = idx - currentIndex;
          const absOffset = Math.abs(offset);
          const isWeb = project.domain === 'web';
          const isApp = project.domain === 'app';
          const tagClass = isWeb ? 'badge-web' : isApp ? 'badge-app' : 'badge-ai';
          const projectInquiryUrl = buildWhatsAppUrl(
            `Hi Lingaswamy, I saw the "${project.title}" project on your portfolio. Can you build a similar solution for my business?`
          );

          // Only render immediate neighbors to conserve DOM nodes & GPU
          if (absOffset > 2) return null;

          const translateX = offset * 260; // Spread distance
          const translateZ = -absOffset * 150; // Depth back
          const rotateY = offset > 0 ? -28 : offset < 0 ? 28 : 0;
          const scale = offset === 0 ? 1.05 : 0.88;
          const opacity = offset === 0 ? 1 : 0.65 - absOffset * 0.15;
          const zIndex = 10 - absOffset;

          return (
            <div
              key={project.id || idx}
              onClick={() => {
                if (offset === 0) {
                  onSelectProject && onSelectProject(project);
                } else {
                  setCurrentIndex(idx);
                }
              }}
              style={{
                position: 'absolute',
                width: '360px',
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                transition: 'all 450ms cubic-bezier(0.25, 1, 0.5, 1)',
                cursor: offset === 0 ? 'pointer' : 'pointer',
                userSelect: 'none'
              }}
            >
              <TiltCard maxTilt={offset === 0 ? 6 : 0} glare={offset === 0}>
                <div
                  className="card frosted-glass"
                  style={{
                    height: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.75rem',
                    borderRadius: 'var(--radius-xl)',
                    border: offset === 0 ? '1.5px solid rgba(29, 92, 240, 0.45)' : '1px solid var(--border-glass)',
                    boxShadow: offset === 0 ? '0 18px 45px rgba(0, 0, 0, 0.35), 0 0 25px rgba(29, 92, 240, 0.15)' : 'none'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className={`badge ${tagClass}`}>{project.type || 'Custom Solution'}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>{project.domain?.toUpperCase()}</span>
                    </div>

                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                      {project.title}
                    </h3>

                    <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                      {project.shortDesc || project.description}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {(project.technologies || project.tech || []).slice(0, 4).map((t, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.74rem',
                            padding: '0.22rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-glass)',
                            color: 'var(--text-main)'
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button
                      className="btn btn-outline"
                      style={{ flex: 1, padding: '0.65rem', fontSize: '0.88rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject && onSelectProject(project);
                      }}
                    >
                      <span>View Case Study</span>
                      <ArrowUpRight size={16} />
                    </button>

                    <a
                      href={projectInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-cta-yellow"
                      style={{ padding: '0.65rem 0.95rem' }}
                      onClick={(e) => e.stopPropagation()}
                      title="Enquire on WhatsApp"
                    >
                      <MessageCircle size={16} color="#0b1b4a" />
                    </a>
                  </div>
                </div>
              </TiltCard>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
        <button
          onClick={handlePrev}
          className="btn btn-outline"
          style={{ width: '42px', height: '42px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label="Previous project"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Indicators */}
        <div style={{ display: 'flex', gap: '0.45rem' }}>
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: idx === currentIndex ? '22px' : '8px',
                height: '8px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: idx === currentIndex ? 'var(--brand-blue)' : 'var(--border-subtle)',
                transition: 'all 250ms ease',
                cursor: 'pointer',
                padding: 0
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="btn btn-outline"
          style={{ width: '42px', height: '42px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label="Next project"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
