import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Phone, MessageCircle, ChevronRight, Shield } from 'lucide-react';
import { content, buildWhatsAppUrl } from '../data/content';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import MagneticButton from './MagneticButton';
import OptimizedImage from './OptimizedImage';

export default function Navbar({ onOpenQuoteModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { settingsData } = useData() || {};
  const location = useLocation();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  const rawPhone = settingsData?.phone || content.founder.phone || '6302690251';
  const cleanPhone = String(rawPhone).replace(/[^0-9]/g, '').replace(/^91/, '');
  const activePhoneFormatted = cleanPhone.length === 10
    ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`
    : (settingsData?.phoneFormatted || content.founder.phoneFormatted || `+91 ${cleanPhone}`);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section spy for active nav indicator
      if (location.pathname === '/') {
        const sections = ['#hero', '#services', '#projects', '#packages', '#about', '#reviews', '#contact'];
        for (const sec of sections) {
          const el = document.querySelector(sec);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 120 && rect.bottom >= 120) {
              setActiveHash(sec);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Lock body scroll and handle Escape key for Mobile Drawer
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
        // Basic focus trap inside mobile drawer
        if (e.key === 'Tab' && drawerRef.current) {
          const focusableElements = drawerRef.current.querySelectorAll(
            'a, button, input, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length > 0) {
            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              last.focus();
              e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  // Close drawer upon route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (path, e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (path.includes('#')) {
      const [pagePath, hash] = path.split('#');
      if (location.pathname === pagePath || (pagePath === '/' && location.pathname === '')) {
        const el = document.getElementById(hash);
        if (el) {
          if (window.__lenis) {
            window.__lenis.scrollTo(el, { offset: -80 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
          setActiveHash(`#${hash}`);
          setMobileMenuOpen(false);
        }
      } else {
        navigate(path);
        setMobileMenuOpen(false);
      }
    } else {
      navigate(path);
      setMobileMenuOpen(false);
    }
  };

  const whatsappNavUrl = buildWhatsAppUrl(
    'Hi Lingaswamy, I visited ZippyTechSystems website and would like to get a quote for my business.'
  );

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: isScrolled ? '68px' : '78px',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          backgroundColor: 'var(--nav-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--nav-border)',
          boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.15)' : 'none'
        }}
      >
        <div
          className="container"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          {/* Brand Logo / Wordmark */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none'
            }}
            aria-label="ZippyTechSystems Home"
          >
            {/* Real Logo or Glowing Brand Icon */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#070e24',
                border: '1.5px solid rgba(255, 229, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 12px rgba(29, 92, 240, 0.35)',
                flexShrink: 0
              }}
            >
              <img
                src="/images/company-logo-2026.png?v=20261011"
                alt="ZippyTech Systems Logo"
                width={40}
                height={40}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/company-logo-2026.webp?v=20261011';
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  letterSpacing: '-0.02em',
                  color: 'var(--text-main)',
                  lineHeight: 1.15
                }}
              >
                ZippyTech<span style={{ color: '#1d5cf0' }}>Systems</span>
              </span>
              <span
                style={{
                  fontSize: '0.66rem',
                  color: 'var(--text-dim)',
                  letterSpacing: '0.04em',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}
              >
                Innovate • Develop • Deliver
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Frosted Glass Pill Container */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-glass)',
              backdropFilter: 'blur(12px)'
            }}
            className="desktop-nav"
            role="navigation"
            aria-label="Main Navigation"
          >
            {content.navLinks.map((link) => {
              const isContact = link.path === '/contact';
              const isAbout = link.path === '/about';
              const isPortfolio = link.path === '/portfolio' || link.path === '/projects';
              const linkHash = link.path.includes('#') ? `#${link.path.split('#')[1]}` : '';

              const isActive =
                (linkHash && activeHash === linkHash) ||
                (link.path === '/' && location.pathname === '/' && !location.hash) ||
                (isContact && location.pathname === '/contact') ||
                (isAbout && location.pathname === '/about') ||
                (isPortfolio && (location.pathname === '/portfolio' || location.pathname === '/projects'));

              return (
                <a
                  key={link.label}
                  href={link.path}
                  onClick={(e) => handleNavClick(link.path, e)}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.88rem',
                    color: isActive ? '#1d5cf0' : 'var(--text-main)',
                    backgroundColor: isActive ? 'rgba(29, 92, 240, 0.12)' : 'transparent',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '9999px',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  {link.label}
                </a>
              );
            })}

            {/* Subtle Admin Link (muted grey, non-distracting) */}
            <Link
              to="/admin"
              style={{
                fontSize: '12px',
                color: 'var(--text-dim)',
                textDecoration: 'none',
                fontWeight: 500,
                padding: '0.45rem 0.65rem',
                borderRadius: '9999px',
                transition: 'color 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1d5cf0')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
              title="Admin Portal"
            >
              <Shield size={12} />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Right Action Cluster */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            {/* Quick Call Link (Desktop/Tablet) */}
            <a
              href={`tel:+91${cleanPhone}`}
              className="btn btn-outline"
              style={{
                display: 'none',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                borderRadius: '9999px'
              }}
              id="nav-call-btn"
              title="Call Lingaswamy Maddeboina"
            >
              <Phone size={13} color="#12a150" />
              <span>{activePhoneFormatted}</span>
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline"
              style={{
                padding: '0.5rem',
                borderRadius: '50%',
                color: 'var(--text-main)',
                lineHeight: 1,
                minWidth: '40px',
                minHeight: '40px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={17} color="#ffe500" /> : <Moon size={17} color="#1d5cf0" />}
            </button>

            {/* WhatsApp Direct CTA Button with Magnetic Pull */}
            <MagneticButton>
              <a
                href={whatsappNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-cta-yellow"
                style={{
                  display: 'none',
                  padding: '0.55rem 1.15rem',
                  fontSize: '0.86rem',
                  borderRadius: '9999px',
                  fontWeight: 700
                }}
                id="nav-whatsapp-cta"
              >
                <MessageCircle size={15} color="#0b1b4a" />
                <span>Get Quote on WhatsApp</span>
              </a>
            </MagneticButton>

            {/* Mobile Hamburger Button (44px target) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="btn btn-outline"
              style={{
                display: 'inline-flex',
                padding: '0.55rem',
                borderRadius: '10px',
                minWidth: '44px',
                minHeight: '44px',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              id="mobile-menu-trigger"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* SLIDE-OUT MOBILE GLASS DRAWER (Full Accessibility & Scroll Lock) */}
      {/* ------------------------------------------------------------- */}
      <div
        aria-hidden={!mobileMenuOpen}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(5, 10, 24, 0.75)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '85%',
            maxWidth: '380px',
            backgroundColor: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-glass)',
            boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.5)',
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.5rem',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #ffe500' }}>
                  <img
                    src="/images/company-logo-2026.png?v=20261011"
                    alt="ZippyTech Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/company-logo-2026.webp?v=20261011';
                    }}
                  />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                  ZippyTech<span style={{ color: '#1d5cf0' }}>Systems</span>
                </span>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-outline"
                style={{ minWidth: '44px', minHeight: '44px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Links with 44px minimum tap targets */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {content.navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.path}
                  onClick={(e) => handleNavClick(link.path, e)}
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-main)',
                    padding: '0.75rem 1rem',
                    minHeight: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{link.label}</span>
                  <ChevronRight size={16} color="var(--text-dim)" />
                </a>
              ))}
            </nav>
          </div>

          {/* Drawer Footer Actions */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a
              href={whatsappNavUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-cta-yellow"
              style={{ width: '100%', minHeight: '48px', justifyContent: 'center', fontWeight: 700 }}
            >
              <MessageCircle size={17} />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href={`tel:+91${cleanPhone}`}
              className="btn btn-outline"
              style={{ width: '100%', minHeight: '48px', justifyContent: 'center', fontWeight: 600 }}
            >
              <Phone size={15} color="#12a150" />
              <span>Call: {activePhoneFormatted}</span>
            </a>

            {/* Subtle Admin Link */}
            <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '13px',
                  color: 'var(--text-dim)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 12px'
                }}
              >
                <Shield size={13} />
                <span>Admin Management Console</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive media queries */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          #nav-whatsapp-cta {
            display: inline-flex !important;
          }
          #nav-call-btn {
            display: inline-flex !important;
          }
          #mobile-menu-trigger {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
