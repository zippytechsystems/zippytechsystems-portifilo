import React from 'react';
import { MessageCircle, ArrowRight, ShieldCheck, Zap, BadgePercent, Headphones, CheckCircle2 } from 'lucide-react';
import { content, buildWhatsAppUrl } from '../data/content';
import { useData } from '../context/DataContext';
import DomainPreviewCards from './DomainPreviewCards';
import MagneticButton from './MagneticButton';
import HeroLiquidMask from './HeroLiquidMask';
import Hero3DCircle from './Hero3DCircle';

export default function Hero({ onOpenQuoteModal, onExploreServices }) {
  const { settingsData, designSettings } = useData();
  const secondaryTagline = settingsData?.secondaryTagline || content.company.secondaryTagline;
  const rawWa = settingsData?.whatsappNumber || content.founder.whatsappNumber || '6302690251';
  const cleanWa = String(rawWa).replace(/[^0-9]/g, '');
  const whatsappNum = cleanWa.startsWith('91') ? cleanWa : `91${cleanWa}`;
  const phone = settingsData?.phoneFormatted || content.founder.phoneFormatted || '+91 63026 90251';

  const heroWhatsAppUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
    settingsData?.defaultWhatsAppMessage || 'Hi Lingaswamy, I would like to get a quote for a website / app / AI automation for my business.'
  )}`;

  return (
    <section
      style={{
        position: 'relative',
        paddingTop: 'calc(var(--navbar-height) + 2.5rem)',
        paddingBottom: '3.5rem',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 15%, #0b173e 0%, #070e24 70%, #050a1a 100%)',
        color: '#ffffff'
      }}
      aria-labelledby="hero-heading"
    >
      {/* 1. Dual-Layer Liquid Cursor-Mask Canvas (Background Layer) */}
      {designSettings?.liquid_mask_enabled !== false && <HeroLiquidMask />}

      {/* 2. Ambient Deep Glow Mesh */}
      <div
        className="animate-hero-mesh"
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          width: '900px',
          height: '600px',
          background: `radial-gradient(circle at 35% 35%, rgba(0, 229, 255, 0.12) 0%, transparent 60%),
                       radial-gradient(circle at 75% 45%, rgba(29, 92, 240, 0.14) 0%, transparent 55%),
                       radial-gradient(circle at 50% 80%, rgba(255, 229, 0, 0.08) 0%, transparent 60%)`,
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
        aria-hidden="true"
      />

      {/* 3. Optional Background Video Layer */}
      {designSettings?.video_background_url && (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={designSettings?.video_poster_url || undefined}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.2,
            pointerEvents: 'none',
            zIndex: 0
          }}
          aria-hidden="true"
        >
          <source src={designSettings.video_background_url} type="video/mp4" />
        </video>
      )}

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Top Pill Badge (Centered at top of Hero) */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            className="animate-float-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.45rem 1.25rem',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)'
            }}
          >
            <span
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 10px #10b981',
                display: 'inline-block'
              }}
            />
            <span
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#ffffff',
                letterSpacing: '0.01em',
                textShadow: '0 1px 4px rgba(0,0,0,0.5)'
              }}
            >
              Direct line to founder Lingaswamy:{' '}
              <a
                href={`tel:${rawWa}`}
                style={{
                  color: '#22c55e',
                  fontWeight: 700,
                  textDecoration: 'none',
                  marginLeft: '0.2rem'
                }}
              >
                {phone}
              </a>
            </span>
          </div>
        </div>

        {/* 
          MAIN HERO ROW: 
          [ Left 3D Circle: Logo ] 
          [ Center: Headline, Subtitle, CTAs ] 
          [ Right 3D Circle: Founder Photo ] 
        */}
        <div
          className="hero-3d-layout-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}
        >
          {/* LEFT WING: 3D Rotating Circle with Founder Lingaswamy (Desktop View) */}
          <div
            className="hero-wing-desktop hero-wing-left"
            style={{
              flex: '0 0 210px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Hero3DCircle
              type="founder"
              imageSrc="/images/founder-suit.webp"
              fallbackSrc="/images/founder-suit.jpg"
              title="Lingaswamy Maddeboina"
              subtitle="Founder & Tech Lead"
              badgeText="Founder Proof"
              phone={phone}
              accentColor="gold"
              size={185}
            />
          </div>

          {/* CENTER HERO CORE: Headline, Subtitle, Action Buttons */}
          <div
            style={{
              flex: '1 1 680px',
              maxWidth: '780px',
              textAlign: 'center',
              padding: '0 0.5rem'
            }}
          >
            {/* Main Headline - Ultra-crisp pure white in all modes */}
            <h1
              id="hero-heading"
              style={{
                marginBottom: '1.25rem',
                lineHeight: 1.15,
                fontWeight: 800,
                fontSize: 'clamp(2.3rem, 4.4vw, 3.6rem)',
                letterSpacing: '-0.025em',
                color: '#ffffff',
                textShadow: '0 4px 24px rgba(0, 0, 0, 0.9), 0 1px 4px rgba(0, 0, 0, 0.9)'
              }}
            >
              <span style={{ color: '#ffffff', display: 'inline' }}>
                Websites, apps and{' '}
              </span>
              <span
                style={{
                  color: '#ffffff',
                  display: 'inline',
                  textShadow: '0 0 25px rgba(255, 255, 255, 0.35), 0 3px 18px rgba(0, 0, 0, 0.8)'
                }}
              >
                AI for your business
              </span>
            </h1>

            {/* Subtitle / Positioning - High Contrast Pure White Text */}
            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                color: '#ffffff',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '680px',
                marginLeft: 'auto',
                marginRight: 'auto',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.75)'
              }}
            >
              {content.company.positioning}{' '}
              <strong style={{ color: '#ffffff', fontWeight: 700 }}>
                {secondaryTagline}.
              </strong>
            </p>

            {/* MOBILE & TABLET: Dual 3D Rotating Circles Showcase (Founder on Left, Logo on Right) */}
            <div
              className="hero-wing-mobile-dual"
              style={{
                display: 'none',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2rem',
                flexWrap: 'wrap'
              }}
            >
              <Hero3DCircle
                type="founder"
                imageSrc="/images/founder-suit.webp"
                fallbackSrc="/images/founder-suit.jpg"
                title="Lingaswamy"
                subtitle="Founded by ZippyTech"
                badgeText="Founder Proof"
                phone={phone}
                accentColor="gold"
                size={145}
              />
              <Hero3DCircle
                type="logo"
                imageSrc="/images/logo.png"
                fallbackSrc="/images/logo.webp"
                title="ZippyTech Systems"
                subtitle="Official Agency"
                badgeText="Verified Agency"
                accentColor="blue"
                size={145}
              />
            </div>

            {/* Primary Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '2.5rem'
              }}
            >
              <MagneticButton strength={0.25} maxDistance={8}>
                <a
                  href={heroWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-cta-yellow"
                  style={{
                    padding: '0.95rem 1.85rem',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    boxShadow: '0 8px 30px rgba(255, 229, 0, 0.35)'
                  }}
                >
                  <MessageCircle size={20} color="#0b1b4a" />
                  <span>Get a Quote on WhatsApp</span>
                </a>
              </MagneticButton>

              <MagneticButton strength={0.2} maxDistance={6}>
                <button
                  onClick={onExploreServices}
                  className="btn btn-outline"
                  style={{
                    padding: '0.95rem 1.65rem',
                    fontSize: '1rem',
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <span>Explore 3 Domains</span>
                  <ArrowRight size={17} />
                </button>
              </MagneticButton>
            </div>
          </div>

          {/* RIGHT WING: 3D Rotating Circle with ZippyTech Company Logo (Desktop View) */}
          <div
            className="hero-wing-desktop hero-wing-right"
            style={{
              flex: '0 0 210px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Hero3DCircle
              type="logo"
              imageSrc="/images/logo.png"
              fallbackSrc="/images/logo.webp"
              title="ZippyTech Systems"
              subtitle="Official Software Agency"
              badgeText="Verified Agency"
              accentColor="blue"
              size={185}
            />
          </div>
        </div>

        {/* Trust Points Grid (4 Pillars) - High Contrast Glass Cards with Crisp White Titles */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1rem',
            textAlign: 'left',
            marginBottom: '3.5rem',
            maxWidth: '1050px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          {content.trustPoints.map((trust) => {
            const iconMap = {
              Zap: <Zap size={18} color="#ffe500" />,
              ShieldCheck: <ShieldCheck size={18} color="#00e5ff" />,
              BadgePercent: <BadgePercent size={18} color="#10b981" />,
              Headphones: <Headphones size={18} color="#a855f7" />
            };

            return (
              <div
                key={trust.id}
                style={{
                  padding: '1.15rem',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    marginBottom: '0.35rem'
                  }}
                >
                  {iconMap[trust.icon] || <CheckCircle2 size={18} color="#10b981" />}
                  <h3
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 700,
                      margin: 0,
                      color: '#ffffff',
                      textShadow: '0 1px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    {trust.title}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: '0.84rem',
                    color: '#cbd5e1',
                    margin: 0,
                    lineHeight: 1.45
                  }}
                >
                  {trust.shortText}
                </p>
              </div>
            );
          })}
        </div>

        {/* 3 Domain Preview Cards linking directly to each stacked section */}
        <DomainPreviewCards />

      </div>
    </section>
  );
}
