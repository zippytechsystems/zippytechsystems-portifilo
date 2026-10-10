import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Globe,
  Smartphone,
  Cpu,
  Sparkles,
  Check,
  Plus,
  MessageCircle,
  Phone,
  ShieldCheck,
  Clock,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { buildWhatsAppUrl } from '../data/content';
import { useQualityTier } from '../context/QualityTierContext';
import TiltCard from './TiltCard';

const CORE_DOMAINS = [
  {
    id: 'web',
    title: 'Web Development Services',
    subtitle: 'Business websites, showcase catalogs, e-commerce stores & custom domains',
    basePrice: 6500,
    timeline: '48h to 7 days',
    icon: Globe,
    accent: '#1d5cf0',
    inclusions: [
      'Business Websites / Landing Page',
      'Services / Products Showcase Website',
      'E-commerce Store & Online Ordering',
      'Custom Domain, Cloud Hosting & Free SSL'
    ]
  },
  {
    id: 'app',
    title: 'App Development Services',
    subtitle: 'Custom shop management, billing, staff attendance & accountant apps',
    basePrice: 20000,
    timeline: '2 to 3 weeks',
    icon: Smartphone,
    accent: '#12a150',
    popular: true,
    inclusions: [
      'Accountant App (Save Full-Time Accountant Salary!)',
      'Business Management & POS Billing App',
      'Stock Inventory, Barcode Scanner & Udhar Khata',
      'Staff Management & GPS Selfie Attendance'
    ]
  },
  {
    id: 'ai',
    title: 'AI Agent Development Services',
    subtitle: '24×7 smart customer support AI chatbots & WhatsApp lead automation',
    basePrice: 7500,
    timeline: '24 to 48 hours',
    icon: Cpu,
    accent: '#7a2fd0',
    inclusions: [
      'Smart Support 24×7 AI Chatbot on Website',
      'WhatsApp Automation & Instant Replies',
      'Lead Management Automation & Phone Capture',
      'Follow-up Reminders & Customer Support'
    ]
  }
];

const ADDONS = [
  {
    id: 'ecommerce',
    title: 'E-Commerce Store & Online Ordering',
    price: 8000,
    domains: ['web'],
    desc: 'Product catalog, shopping cart, customer checkout, order alerts'
  },
  {
    id: 'payments',
    title: 'UPI & Razorpay Payment Gateway',
    price: 2500,
    domains: ['web', 'app'],
    desc: 'Instant QR code, PhonePe, Google Pay & Card bank settlement'
  },
  {
    id: 'gst_billing',
    title: 'Automated GST Billing & PDF Invoices',
    price: 3500,
    domains: ['app', 'ai'],
    desc: 'Auto invoice generation, HSN codes, and WhatsApp PDF dispatch'
  },
  {
    id: 'inventory',
    title: 'Barcode Scanner & Stock Alerts',
    price: 4000,
    domains: ['app'],
    desc: 'Camera barcode lookup, low-stock notifications, supplier records'
  },
  {
    id: 'attendance',
    title: 'Staff Selfie Attendance & Salary Slips',
    price: 3000,
    domains: ['app'],
    desc: 'GPS location verification, shift timings, auto monthly payslips'
  },
  {
    id: 'voice_agent',
    title: 'AI Voice Call Answering Agent',
    price: 5000,
    domains: ['ai'],
    desc: 'Answers inbound customer calls with natural voice & logs enquiries'
  },
  {
    id: 'seo_maps',
    title: 'Google Business Profile & Local SEO',
    price: 1500,
    domains: ['web'],
    desc: 'Google Maps verification, local keyword ranking, review showcase'
  },
  {
    id: 'cloud_backup',
    title: 'Automated Daily Cloud Backups & Care',
    price: 1500,
    domains: ['web', 'app', 'ai'],
    desc: 'Tamper-proof off-site backup, SSL maintenance & 1-year priority care'
  }
];

export default function CostEstimator() {
  const [selectedDomainId, setSelectedDomainId] = useState('web');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const { tier } = useQualityTier();
  const isReduced = tier === 'reduced';

  const selectedDomain = useMemo(() => {
    return CORE_DOMAINS.find((d) => d.id === selectedDomainId) || CORE_DOMAINS[0];
  }, [selectedDomainId]);

  // Filter available add-ons for the chosen domain
  const availableAddons = useMemo(() => {
    return ADDONS.filter((addon) => addon.domains.includes(selectedDomainId));
  }, [selectedDomainId]);

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDomainChange = (domainId) => {
    setSelectedDomainId(domainId);
    // Keep only add-ons compatible with new domain
    const compatibleAddonIds = ADDONS.filter((a) => a.domains.includes(domainId)).map((a) => a.id);
    setSelectedAddons((prev) => prev.filter((id) => compatibleAddonIds.includes(id)));
  };

  const resetAll = () => {
    setSelectedDomainId('web');
    setSelectedAddons([]);
  };

  // Calculations
  const addonsTotal = useMemo(() => {
    return selectedAddons.reduce((sum, addonId) => {
      const addon = ADDONS.find((a) => a.id === addonId);
      return sum + (addon ? addon.price : 0);
    }, 0);
  }, [selectedAddons]);

  const totalEstimate = selectedDomain.basePrice + addonsTotal;

  // Format currency
  const formatINR = (val) => `₹${val.toLocaleString('en-IN')}`;

  // Build customized WhatsApp URL
  const whatsappUrl = useMemo(() => {
    const chosenAddonTitles = selectedAddons
      .map((id) => {
        const item = ADDONS.find((a) => a.id === id);
        return item ? `+ ${item.title} (${formatINR(item.price)})` : null;
      })
      .filter(Boolean);

    let message = `Hi Lingaswamy, I calculated a project estimate on ZippyTechSystems website:\n\n`;
    message += `• Core Service: ${selectedDomain.title} (${formatINR(selectedDomain.basePrice)})\n`;
    if (chosenAddonTitles.length > 0) {
      message += `• Selected Modules:\n  ${chosenAddonTitles.join('\n  ')}\n`;
    }
    message += `\nEstimated Total: ${formatINR(totalEstimate)}\n`;
    message += `Estimated Timeline: ${selectedDomain.timeline}\n\n`;
    message += `Could we schedule a quick discussion to finalize the scope?`;

    return buildWhatsAppUrl(message);
  }, [selectedDomain, selectedAddons, totalEstimate]);

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        borderRadius: '24px',
        border: '1px solid var(--border-subtle)',
        padding: 'clamp(1.5rem, 3.5vw, 2.75rem)',
        boxShadow: 'var(--card-shadow)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background ambient gradient glow */}
      <div
        style={{
          position: 'absolute',
          top: '-25%',
          right: '-15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${selectedDomain.accent}12 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />

      {/* Header with Title and Reset */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0b1b4a 0%, #1d5cf0 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(29, 92, 240, 0.3)'
            }}
          >
            <Calculator size={22} />
          </div>
          <div>
            <h3
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: 0,
                fontFamily: 'var(--font-display)'
              }}
            >
              Instant Project Cost Estimator
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
              Select your service and optional add-ons to see live transparent pricing in INR.
            </p>
          </div>
        </div>

        {selectedAddons.length > 0 && (
          <button
            type="button"
            onClick={resetAll}
            className="btn btn-outline"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <RotateCcw size={13} />
            <span>Reset Selections</span>
          </button>
        )}
      </div>

      {/* Step 1: Choose Core Domain */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.85rem'
          }}
        >
          Step 1: Choose Core Digital Service
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}
        >
          {CORE_DOMAINS.map((domain) => {
            const IconComp = domain.icon;
            const isSelected = selectedDomainId === domain.id;

            return (
              <div
                key={domain.id}
                onClick={() => handleDomainChange(domain.id)}
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  border: isSelected ? `2px solid ${domain.accent}` : '1px solid var(--border-subtle)',
                  background: isSelected ? `${domain.accent}0d` : 'var(--bg-surface)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 8px 24px ${domain.accent}20` : 'none',
                  transform: isSelected && !isReduced ? 'translateY(-2px)' : 'none'
                }}
              >
                {domain.popular && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '14px',
                      background: '#ffe500',
                      color: '#0b1b4a',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    Best Value
                  </span>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem'
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isSelected ? `${domain.accent}20` : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? domain.accent : 'var(--text-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconComp size={18} />
                  </div>

                  <span
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: isSelected ? domain.accent : 'var(--text-main)',
                      fontFamily: 'var(--font-display)'
                    }}
                  >
                    {formatINR(domain.basePrice)}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    color: isSelected ? '#ffffff' : 'var(--text-main)',
                    marginBottom: '0.35rem'
                  }}
                >
                  {domain.title}
                </div>

                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-dim)',
                    lineHeight: 1.4,
                    margin: '0 0 0.85rem 0'
                  }}
                >
                  {domain.subtitle}
                </p>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.74rem',
                    color: 'var(--text-dim)'
                  }}
                >
                  <Clock size={12} />
                  <span>{domain.timeline}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Choose Optional Add-Ons */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem'
          }}
        >
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}
          >
            Step 2: Add-On Features &amp; Modules (Optional)
          </div>

          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            {selectedAddons.length} module{selectedAddons.length !== 1 ? 's' : ''} added
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '0.85rem'
          }}
        >
          {availableAddons.map((addon) => {
            const isChecked = selectedAddons.includes(addon.id);

            return (
              <div
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                style={{
                  padding: '1rem 1.15rem',
                  borderRadius: '14px',
                  border: isChecked ? `1px solid ${selectedDomain.accent}` : '1px solid var(--border-subtle)',
                  background: isChecked ? `${selectedDomain.accent}0a` : 'var(--bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: isChecked ? `2px solid ${selectedDomain.accent}` : '2px solid var(--border-subtle)',
                    background: isChecked ? selectedDomain.accent : 'transparent',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isChecked && <Check size={13} strokeWidth={3} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      marginBottom: '2px'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: isChecked ? '#ffffff' : 'var(--text-main)',
                        lineHeight: 1.3
                      }}
                    >
                      {addon.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        color: isChecked ? selectedDomain.accent : 'var(--text-dim)',
                        flexShrink: 0
                      }}
                    >
                      +{formatINR(addon.price)}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-dim)',
                      lineHeight: 1.35,
                      margin: 0
                    }}
                  >
                    {addon.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 3: Real-Time Investment Summary & WhatsApp Handoff */}
      <div
        className="glass-card"
        style={{
          padding: 'clamp(1.5rem, 3vw, 2rem)',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(11, 27, 74, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: `1px solid ${selectedDomain.accent}40`,
          boxShadow: `0 15px 35px rgba(0, 0, 0, 0.3), 0 0 25px ${selectedDomain.accent}15`
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '1.25rem'
          }}
        >
          {/* Left Summary Details */}
          <div>
            <span
              style={{
                fontSize: '0.76rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 700,
                color: selectedDomain.accent,
                display: 'block',
                marginBottom: '4px'
              }}
            >
              Estimated Investment Breakdown
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  fontWeight: 800,
                  color: '#ffe500',
                  fontFamily: 'var(--font-display)',
                  lineHeight: 1
                }}
              >
                {formatINR(totalEstimate)}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                transparent estimate in INR
              </span>
            </div>

            <div
              style={{
                fontSize: '0.84rem',
                color: '#94a3b8',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flexWrap: 'wrap'
              }}
            >
              <span>Base: {formatINR(selectedDomain.basePrice)}</span>
              {addonsTotal > 0 && <span>+ Add-ons: {formatINR(addonsTotal)}</span>}
              <span>• Delivery: {selectedDomain.timeline}</span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-cta-yellow"
              style={{
                padding: '0.85rem 1.6rem',
                fontSize: '0.98rem'
              }}
            >
              <MessageCircle size={18} />
              <span>Send Estimate to Founder on WhatsApp</span>
            </a>

            <a
              href="tel:+916302690251"
              className="btn btn-outline"
              style={{
                padding: '0.85rem 1.25rem',
                fontSize: '0.92rem',
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }}
            >
              <Phone size={16} color="#12a150" />
              <span>Call Direct</span>
            </a>
          </div>
        </div>

        {/* Guaranteed Inclusions Footer Strip */}
        <div
          style={{
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.78rem',
            color: '#94a3b8'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={14} color="#12a150" />
            <span>Includes 30 Days Free Post-Launch Guarantee</span>
          </div>
          <div>✓ Direct communication with Founder Lingaswamy (Zero middlemen)</div>
          <div>✓ No recurring agency markups or hidden fees</div>
        </div>
      </div>
    </div>
  );
}
