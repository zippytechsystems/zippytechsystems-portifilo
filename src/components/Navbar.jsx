import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Phone, MessageCircle, ChevronRight, Shield, ArrowLeft } from 'lucide-react';
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

  // Screen Back Motion & History Popstate integration for Mobile Menu Drawer
  useEffect(() => {
    if (mobileMenuOpen) {
      window.history.pushState({ zippyMobileMenu: true }, '');

      const handlePopState = () => {
        setMobileMenuOpen(false);
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [mobileMenuOpen]);

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
    if (window.history.state && window.history.state.zippyMobileMenu) {
      window.history.back();
    }
  };

  // Lock body scroll and handle Escape key for Mobile Drawer
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          handleCloseMobileMenu();
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
    'Hi Lingaswamy, I visited Zippy Enterprises website and would like to get a quote for my business.'
  );

  return (
    <>
      <header
        className="main-navbar-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          height: isScrolled ? '66px' : '76px',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          backgroundColor: isScrolled ? 'rgba(7, 12, 30, 0.94)' : 'rgba(7, 12, 30, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.35)' : 'none'
        }}
      >
        <div
          className="container nav-container-inner"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}
        >
          {/* Brand Logo / Wordmark (Locked on Left: Unshrinkable, Full Visibility) */}
          <Link
            to="/"
            className="nav-brand-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              flexShrink: 0,
              minWidth: 'max-content',
              zIndex: 10
            }}
            aria-label="Zippy Enterprises Home"
          >
            {/* Real Logo Box */}
            <div
              className="nav-brand-logo-box"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#070e24',
                border: '1.5px solid rgba(255, 229, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 14px rgba(29, 92, 240, 0.4)',
                flexShrink: 0
              }}
            >
              <img
                src="/images/company-logo-2026.png?v=20261011"
                alt="Zippy Enterprises Logo"
                width={42}
                height={42}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/company-logo-2026.webp?v=20261011';
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 'max-content' }}>
              <span
                className="nav-brand-title"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  lineHeight: 1.15,
                  whiteSpace: 'nowrap'
                }}
              >
                Zippy<span style={{ color: '#1d5cf0' }}>Enterprises</span>
              </span>
              <span
                className="nav-brand-subtitle"
                style={{
                  fontSize: '0.64rem',
                  color: '#94a3b8',
                  letterSpacing: '0.04em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}
              >
                Innovate • Develop • Deliver
              </span>
            </div>
          </Link>

          {/* Right Header Cluster: Desktop Nav Options + Action Buttons Shifted Cleanly to the Right Side */}
          <div
            className="nav-right-cluster"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              marginLeft: 'auto',
              flexShrink: 0
            }}
          >
            {/* Desktop Navigation Links (Compact size, positioned on the right) */}
            <nav
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '0.2rem',
                padding: '0.22rem 0.4rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
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
                      fontSize: '0.80rem',
                      color: isActive ? '#1d5cf0' : 'var(--text-main)',
                      backgroundColor: isActive ? 'rgba(29, 92, 240, 0.12)' : 'transparent',
                      padding: '0.32rem 0.58rem',
                      borderRadius: '9999px',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {link.shortLabel || link.label}
                  </a>
                );
              })}

              {/* Subtle Admin Link */}
              <Link
                to="/admin"
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-dim)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  padding: '0.32rem 0.48rem',
                  borderRadius: '9999px',
                  transition: 'color 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1d5cf0')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                title="Admin Portal"
              >
                <Shield size={11} />
                <span>Admin</span>
              </Link>
            </nav>

            {/* Quick Call Link (Only on wide screens >= 1250px) */}
            <a
              href={`tel:+91${cleanPhone}`}
              className="btn btn-outline"
              style={{
                display: 'none',
                padding: '0.35rem 0.7rem',
                fontSize: '0.78rem',
                borderRadius: '9999px',
                whiteSpace: 'nowrap'
              }}
              id="nav-call-btn"
              title="Call Lingaswamy Maddeboina"
            >
              <Phone size={12} color="#12a150" />
              <span>{activePhoneFormatted}</span>
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                padding: '0.38rem',
                borderRadius: '50%',
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                lineHeight: 1,
                minWidth: '36px',
                minHeight: '36px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} color="#ffe500" /> : <Moon size={16} color="#38bdf8" />}
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
                  padding: '0.42rem 0.95rem',
                  fontSize: '0.82rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
                id="nav-whatsapp-cta"
              >
                <MessageCircle size={14} color="#0b1b4a" />
                <span>Get Quote</span>
              </a>
            </MagneticButton>

            {/* Mobile Hamburger Button (44px target) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="nav-mobile-menu-trigger"
              style={{
                display: 'inline-flex',
                padding: '0.5rem',
                borderRadius: '10px',
                minWidth: '42px',
                minHeight: '42px',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 229, 0, 0.15)',
                border: '1.5px solid rgba(255, 229, 0, 0.65)',
                color: '#ffe500',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(255, 229, 0, 0.25)',
                flexShrink: 0
              }}
              id="mobile-menu-trigger"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={22} color="#ffe500" strokeWidth={2.4} />
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
          zIndex: 10000,
          backgroundColor: 'rgba(5, 10, 24, 0.75)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={handleCloseMobileMenu}
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
          {/* Drawer Header with Back Button */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #ffe500' }}>
                  <img
                    src="/images/company-logo-2026.png?v=20261011"
                    alt="Zippy Enterprises Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/company-logo-2026.webp?v=20261011';
                    }}
                  />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                  Zippy<span style={{ color: '#1d5cf0' }}>Enterprises</span>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={handleCloseMobileMenu}
                  className="btn btn-sm btn-outline"
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                  aria-label="Back to website"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleCloseMobileMenu}
                  className="btn btn-outline"
                  style={{ minWidth: '40px', minHeight: '40px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Close navigation menu"
                >
                  <X size={18} />
                </button>
              </div>
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
            display: inline-flex !important;
          }
          #nav-whatsapp-cta {
            display: inline-flex !important;
          }
          #mobile-menu-trigger {
            display: none !important;
          }
        }
        @media (min-width: 1250px) {
          #nav-call-btn {
            display: inline-flex !important;
          }
        }
        @media (max-width: 899px) {
          .desktop-nav {
            display: none !important;
          }
          #nav-whatsapp-cta {
            display: none !important;
          }
          #nav-call-btn {
            display: none !important;
          }
          #mobile-menu-trigger {
            display: inline-flex !important;
          }
        }
        @media (max-width: 640px) {
          .main-navbar-header {
            height: 60px !important;
          }
          .nav-container-inner {
            padding-left: 10px !important;
            padding-right: 10px !important;
            gap: 0.35rem !important;
          }
          .nav-brand-logo-box {
            width: 32px !important;
            height: 32px !important;
            flex-shrink: 0 !important;
          }
          .nav-brand-title {
            font-size: 0.98rem !important;
          }
          .nav-brand-subtitle {
            display: none !important;
          }
          .nav-brand-link {
            gap: 0.4rem !important;
          }
        }
      `}</style>
    </>
  );
}
