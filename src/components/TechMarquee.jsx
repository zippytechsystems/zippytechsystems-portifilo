import React from 'react';
import { Code2, Database, Cpu, Globe, Smartphone, Server, ShieldCheck, Zap, Building2, CheckCircle2 } from 'lucide-react';
import { useQualityTier } from '../context/QualityTierContext';

const TECH_ITEMS = [
  { name: 'React 18', category: 'Frontend', color: '#61dafb', icon: Code2 },
  { name: 'PHP 8 & MySQL', category: 'Backend & DB', color: '#777bb4', icon: Database },
  { name: 'Node.js & Express', category: 'Backend API', color: '#68a063', icon: Server },
  { name: 'Flutter & Dart', category: 'Mobile Apps', color: '#02569b', icon: Smartphone },
  { name: 'Python & FastAPI', category: 'AI Pipelines', color: '#ffd43b', icon: Cpu },
  { name: 'Razorpay & UPI', category: 'Payments', color: '#0c2340', icon: ShieldCheck },
  { name: 'Hostinger Cloud', category: 'High-speed VPS', color: '#673ab7', icon: Globe },
  { name: 'Docker Containers', category: 'DevOps', color: '#2496ed', icon: Server },
  { name: 'Tailwind & Modern CSS', category: 'Styling', color: '#38bdf8', icon: Zap },
  { name: 'Vite & Rolldown', category: 'Fast Bundler', color: '#bd34fe', icon: Zap }
];

const CLIENT_ITEMS = [
  { name: 'Reddy Multi-Specialty Dental', location: 'Hyderabad', category: 'Clinic Portal', color: '#1d5cf0' },
  { name: 'Patel Wholesale Electricals', location: 'Secunderabad', category: 'Billing & POS App', color: '#12a150' },
  { name: 'Varma Logistics & Transport', location: 'Vijayawada', category: '24/7 WhatsApp AI', color: '#7a2fd0' },
  { name: 'TrendBoutique Ethnic Studio', location: 'Bangalore', category: 'E-Commerce Website', color: '#1d5cf0' },
  { name: 'Sai Balaji Sarees & Silks', location: 'Kothapet', category: 'Accountant App', color: '#12a150' },
  { name: 'Sri Lakshmi Healthcare', location: 'Andhra Pradesh', category: 'Appointment System', color: '#1d5cf0' },
  { name: 'Deccan Engineering Works', location: 'Hyderabad', category: 'Staff Payroll App', color: '#12a150' },
  { name: 'Srinivasa Granites & Tiles', location: 'Karimnagar', category: 'Invoice Automation', color: '#7a2fd0' }
];

/**
 * TechMarquee Component:
 * - Dual Infinite Looping ticker (Tech Stack or Client Logos/Businesses).
 * - Pauses automatically on hover or focus for user readability.
 * - Hardware accelerated with CSS transforms.
 * - Respects prefers-reduced-motion.
 */
export default function TechMarquee({ speed = 32, direction = 'left', type = 'tech' }) {
  const { isReduced } = useQualityTier();

  const sourceItems = type === 'clients' ? CLIENT_ITEMS : TECH_ITEMS;
  // Duplicate items for seamless continuous looping
  const items = [...sourceItems, ...sourceItems];

  return (
    <div
      className="tech-marquee-container"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        padding: '0.85rem 0',
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)'
      }}
      aria-label={type === 'clients' ? 'Businesses and clients served by ZippyTechSoftwares' : 'Technologies and frameworks used by ZippyTech Softwares'}
    >
      <div
        className="tech-marquee-track"
        style={{
          display: 'flex',
          gap: '1.25rem',
          width: 'max-content',
          animation: isReduced
            ? 'none'
            : `marqueeLoop ${speed}s linear infinite ${direction === 'right' ? 'reverse' : 'normal'}`
        }}
      >
        {items.map((item, idx) => {
          if (type === 'clients') {
            return (
              <div
                key={idx}
                className="frosted-glass"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-glass)',
                  background: 'rgba(8, 14, 30, 0.85)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                  transition: 'transform 200ms ease, border-color 200ms ease'
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: `${item.color}18`,
                    border: `1px solid ${item.color}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color
                  }}
                >
                  <Building2 size={15} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                      {item.name}
                    </span>
                    <CheckCircle2 size={12} color="#12a150" />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', lineHeight: 1.1 }}>
                    {item.category} • <strong style={{ color: 'var(--text-body)' }}>{item.location}</strong>
                  </span>
                </div>
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="frosted-glass"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-glass)',
                background: 'var(--bg-glass)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                transition: 'transform 200ms ease, border-color 200ms ease'
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: `${item.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color
                }}
              >
                <Icon size={15} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                  {item.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1 }}>
                  {item.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes marqueeLoop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .tech-marquee-container:hover .tech-marquee-track,
        .tech-marquee-container:focus-within .tech-marquee-track {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
}
