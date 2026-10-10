import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Star,
  Quote,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { content, buildWhatsAppUrl } from '../data/content';
import { useData } from '../context/DataContext';
import { useQualityTier } from '../context/QualityTierContext';
import TiltCard from './TiltCard';

export default function TestimonialsSection() {
  const { testimonialsData, loading } = useData();
  const { tier } = useQualityTier();
  const isReduced = tier === 'reduced';

  const testimonials =
    testimonialsData && testimonialsData.length > 0
      ? testimonialsData
      : content.testimonials || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const containerRef = useRef(null);

  const total = testimonials.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-rotation every 5 seconds (pausing on hover, touch, or manual pause)
  useEffect(() => {
    if (total <= 1 || isPaused || isHovered || isReduced) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [total, isPaused, isHovered, isReduced, nextSlide]);

  // Keyboard navigation when container is focused
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };

  // Touch swipe support
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      setIsHovered(true);
    }
  };

  const handleTouchEnd = (e) => {
    setIsHovered(false);
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : null;
    const endY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : null;
    if (endX !== null) {
      const deltaX = endX - touchStartXRef.current;
      const deltaY = endY !== null ? Math.abs(endY - touchStartYRef.current) : 0;
      // Only trigger if horizontal swipe is significantly greater than vertical scroll
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > deltaY) {
        if (deltaX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  return (
    <section
      id="testimonials"
      style={{
        padding: '5.5rem 0',
        background: 'var(--bg-canvas)',
        borderTop: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden'
      }}
      aria-labelledby="testimonials-heading"
    >
      {/* Ambient background glow accents */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '350px',
          background: 'radial-gradient(ellipse at center, rgba(29, 92, 240, 0.08) 0%, rgba(18, 161, 80, 0.03) 45%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-yellow" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} />
            CLIENT SUCCESS STORIES
          </span>
          <h2 id="testimonials-heading" style={{ marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}>
            Trusted by <span style={{ color: '#1d5cf0' }}>Indian Business Owners</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
            Real experiences from clinic owners, wholesale traders, and local enterprises who saved time, cut operational costs, and grew with our custom digital solutions.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (!testimonials || testimonials.length === 0) && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="card skeleton"
                style={{
                  height: '240px',
                  borderRadius: '16px',
                  opacity: 0.6
                }}
              />
            ))}
          </div>
        )}

        {/* Friendly Empty State */}
        {!loading && testimonials.length === 0 && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '550px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Be Our Next Success Story</h3>
            <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
              We are currently compiling fresh client reviews. Reach out to founder Lingaswamy on WhatsApp to discuss your project!
            </p>
            <a
              href={buildWhatsAppUrl("Hi Lingaswamy, I'd like to discuss a project and become a ZippyTechSystems client.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-cta-yellow"
            >
              <MessageCircle size={16} />
              <span>Chat with Founder on WhatsApp</span>
            </a>
          </div>
        )}

        {/* Testimonials 3D Circular Carousel */}
        {testimonials.length > 0 && (
          <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            aria-roledescription="carousel"
            aria-label="Client Testimonials Carousel"
            style={{
              position: 'relative',
              outline: 'none',
              maxWidth: '920px',
              margin: '0 auto'
            }}
          >
            {/* 3D Circular Stage Container */}
            <div
              style={{
                position: 'relative',
                minHeight: '380px',
                perspective: '1200px',
                perspectiveOrigin: 'center center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 0 2rem 0'
              }}
            >
              {testimonials.map((item, idx) => {
                // Compute cyclic difference relative to activeIndex
                let diff = (idx - activeIndex + total) % total;
                if (diff > total / 2) diff -= total;

                const isWeb = item.domain === 'web';
                const isApp = item.domain === 'app';
                const domainColor = isWeb ? '#1d5cf0' : isApp ? '#12a150' : '#7a2fd0';
                const domainLabel = isWeb
                  ? 'Web Development'
                  : isApp
                  ? 'App Development'
                  : 'AI Automation';

                const isActive = diff === 0;
                const isAdjacent = Math.abs(diff) === 1;

                // Calculate 3D transforms
                let transform = '';
                let opacity = 0;
                let zIndex = 1;
                let pointerEvents = 'none';

                if (isReduced) {
                  // Reduced motion fallback: single card visible without 3D transforms
                  opacity = isActive ? 1 : 0;
                  transform = 'none';
                  zIndex = isActive ? 10 : 1;
                  pointerEvents = isActive ? 'auto' : 'none';
                } else {
                  if (isActive) {
                    transform = 'translateX(0%) translateZ(0px) rotateY(0deg) scale(1)';
                    opacity = 1;
                    zIndex = 10;
                    pointerEvents = 'auto';
                  } else if (diff === 1) {
                    // Right card
                    transform = 'translateX(38%) translateZ(-90px) rotateY(-10deg) scale(0.88)';
                    opacity = 0.45;
                    zIndex = 5;
                    pointerEvents = 'auto';
                  } else if (diff === -1) {
                    // Left card
                    transform = 'translateX(-38%) translateZ(-90px) rotateY(10deg) scale(0.88)';
                    opacity = 0.45;
                    zIndex = 5;
                    pointerEvents = 'auto';
                  } else {
                    // Hidden cards in background
                    const dir = diff > 0 ? 60 : -60;
                    transform = `translateX(${dir}%) translateZ(-180px) scale(0.75)`;
                    opacity = 0;
                    zIndex = 1;
                    pointerEvents = 'none';
                  }
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!isActive) setActiveIndex(idx);
                    }}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${idx + 1} of ${total}: ${item.clientName}`}
                    aria-hidden={!isActive}
                    style={{
                      position: isActive ? 'relative' : 'absolute',
                      width: '100%',
                      maxWidth: '680px',
                      transform,
                      opacity,
                      zIndex,
                      pointerEvents,
                      transition: isReduced
                        ? 'opacity 0.25s ease'
                        : 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.55s ease',
                      cursor: !isActive ? 'pointer' : 'default',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <TiltCard maxTilt={isActive && !isReduced ? 5 : 0} glare={isActive && !isReduced}>
                      <div
                        className="card frosted-glass"
                        style={{
                          padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                          borderRadius: '24px',
                          borderTop: `4px solid ${domainColor}`,
                          borderColor: isActive ? 'var(--border-glass-bright)' : 'var(--border-subtle)',
                          background: isActive
                            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(246, 249, 255, 0.92) 100%)'
                            : 'var(--bg-card)',
                          boxShadow: isActive
                            ? `0 20px 40px rgba(0, 0, 0, 0.1), 0 0 25px ${domainColor}20`
                            : '0 8px 24px rgba(0, 0, 0, 0.05)',
                          position: 'relative'
                        }}
                      >
                        {/* Quote icon background watermark */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '1.25rem',
                            right: '1.5rem',
                            opacity: 0.12,
                            color: domainColor,
                            pointerEvents: 'none'
                          }}
                        >
                          <Quote size={52} />
                        </div>

                        {/* Top Meta: Stars + Domain Badge */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1.25rem',
                            position: 'relative',
                            zIndex: 1
                          }}
                        >
                          <div style={{ display: 'flex', gap: '4px', color: '#ffe500' }}>
                            {[...Array(item.rating || 5)].map((_, starI) => (
                              <Star
                                key={starI}
                                size={18}
                                fill="currentColor"
                                style={{ filter: 'drop-shadow(0 1px 2px rgba(255, 229, 0, 0.4))' }}
                              />
                            ))}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: domainColor,
                                background: `${domainColor}15`,
                                border: `1px solid ${domainColor}35`,
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                letterSpacing: '0.04em'
                              }}
                            >
                              {domainLabel}
                            </span>
                          </div>
                        </div>

                        {/* Testimonial Quote Content */}
                        <p
                          style={{
                            fontSize: 'clamp(0.98rem, 2vw, 1.12rem)',
                            color: 'var(--text-main)',
                            lineHeight: 1.65,
                            fontStyle: 'italic',
                            marginBottom: '1.75rem',
                            position: 'relative',
                            zIndex: 1
                          }}
                        >
                          "{item.content}"
                        </p>

                        {/* Client Info Lockup */}
                        <div
                          style={{
                            borderTop: '1px solid var(--border-subtle)',
                            paddingTop: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            position: 'relative',
                            zIndex: 1
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div
                              style={{
                                width: '46px',
                                height: '46px',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, #0b1b4a 0%, ${domainColor} 100%)`,
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '1.05rem',
                                flexShrink: 0,
                                boxShadow: `0 4px 12px ${domainColor}35`
                              }}
                            >
                              {item.clientName?.charAt(0) || 'C'}
                            </div>

                            <div>
                              <div
                                style={{
                                  fontSize: '1.02rem',
                                  fontWeight: 800,
                                  color: 'var(--text-main)',
                                  fontFamily: 'var(--font-display)'
                                }}
                              >
                                {item.clientName}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.82rem',
                                  color: 'var(--text-dim)',
                                  lineHeight: 1.35
                                }}
                              >
                                {item.roleOrCompany}
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              color: '#12a150',
                              background: 'rgba(18, 161, 80, 0.1)',
                              padding: '3px 8px',
                              borderRadius: 'var(--radius-full)'
                            }}
                          >
                            <CheckCircle2 size={13} strokeWidth={2.5} />
                            <span>Verified Client</span>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                );
              })}
            </div>

            {/* Controls Bar: Chevrons + Dots + Pause Indicator */}
            {total > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1.5rem',
                  marginTop: '1.5rem'
                }}
              >
                {/* Prev Chevron */}
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous testimonial"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1d5cf0';
                    e.currentTarget.style.transform = 'scale(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Dot Indicators */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {testimonials.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setActiveIndex(dotIdx)}
                      aria-label={`Go to testimonial ${dotIdx + 1}`}
                      style={{
                        width: activeIndex === dotIdx ? '28px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background:
                          activeIndex === dotIdx
                            ? '#1d5cf0'
                            : 'var(--border-subtle)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                        padding: 0
                      }}
                    />
                  ))}
                </div>

                {/* Next Chevron */}
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next testimonial"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1d5cf0';
                    e.currentTarget.style.transform = 'scale(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <ChevronRight size={20} />
                </button>

                {/* Auto-play pause toggle */}
                <button
                  type="button"
                  onClick={() => setIsPaused((prev) => !prev)}
                  aria-label={isPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
                  title={isPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginLeft: '0.25rem'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#1d5cf0')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                >
                  {isPaused ? <Play size={13} /> : <Pause size={13} />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom Direct Founder WhatsApp CTA Banner */}
        <div
          style={{
            marginTop: '3.5rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(11, 27, 74, 0.04) 0%, rgba(29, 92, 240, 0.06) 100%)',
            border: '1px solid rgba(29, 92, 240, 0.18)',
            borderRadius: '20px',
            padding: '2rem 1.5rem',
            maxWidth: '720px',
            margin: '3.5rem auto 0 auto'
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            Ready to upgrade your business systems?
          </h3>
          <p style={{ color: 'var(--text-body)', fontSize: '0.94rem', marginBottom: '1.25rem', maxWidth: '560px', margin: '0 auto 1.25rem auto' }}>
            Join our satisfied clients across Hyderabad, Bangalore, and Andhra Pradesh. Get a fixed-price quote with zero obligation.
          </p>
          <a
            href={buildWhatsAppUrl("Hi Lingaswamy, I saw your client reviews and would like to get a quote for my business.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-cta-yellow"
            style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem' }}
          >
            <MessageCircle size={18} />
            <span>Chat Directly on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
