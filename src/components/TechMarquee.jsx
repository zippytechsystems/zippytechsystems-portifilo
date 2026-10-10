import React from 'react';
import { Code2, Database, Cpu, Globe, Smartphone, Server, ShieldCheck, Zap } from 'lucide-react';
import { useQualityTier } from '../context/QualityTierContext';

const TECH_ITEMS = [
  { name: 'React 18', category: 'Frontend', color: '#61dafb', icon: Code2 },
  { name: 'PHP 8 & MySQL', category: 'Backend & DB', color: '#777bb4', icon: Database },
  { name: 'Node.js & Express', category: 'Backend API', color: '#68a063', icon: Server },
  { name: 'Flutter & Dart', category: 'Mobile Apps', color: '#02569b', icon: Smartphone },
  { name: 'Python & FastApi', category: 'AI Pipelines', color: '#ffd43b', icon: Cpu },
  { name: 'Razorpay & UPI', category: 'Payments', color: '#0c2340', icon: ShieldCheck },
  { name: 'Hostinger Cloud', category: 'High-speed Hosting', color: '#673ab7', icon: Globe },
  { name: 'Docker Containers', category: 'DevOps', color: '#2496ed', icon: Server },
  { name: 'Tailwind & Modern CSS', category: 'Styling', color: '#38bdf8', icon: Zap },
  { name: 'Vite & Rolldown', category: 'Fast Bundler', color: '#bd34fe', icon: Zap }
];

export default function TechMarquee({ speed = 32, direction = 'left' }) {
  const { isReduced } = useQualityTier();

  // Duplicate items for infinite seamless looping
  const items = [...TECH_ITEMS, ...TECH_ITEMS];

  return (
    <div
      className="tech-marquee-container"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        padding: '1.25rem 0',
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
      }}
      aria-label="Technologies and frameworks used by ZippyTech Softwares"
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
        .tech-marquee-container:hover .tech-marquee-track {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
