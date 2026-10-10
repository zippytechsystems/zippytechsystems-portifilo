import React, { useState, useEffect } from 'react';
import { Code2, Database, Cpu, Globe, Smartphone, Server, ShieldCheck, Zap } from 'lucide-react';
import { useQualityTier } from '../context/QualityTierContext';

const ORBIT_INNER = [
  { name: 'React 18', color: '#61dafb', icon: Code2, angle: 0 },
  { name: 'PHP 8', color: '#777bb4', icon: Database, angle: 90 },
  { name: 'MySQL', color: '#00758f', icon: Database, angle: 180 },
  { name: 'Node.js', color: '#68a063', icon: Server, angle: 270 }
];

const ORBIT_OUTER = [
  { name: 'Flutter Apps', color: '#02569b', icon: Smartphone, angle: 30 },
  { name: 'Python AI', color: '#ffd43b', icon: Cpu, angle: 102 },
  { name: 'Docker', color: '#2496ed', icon: Server, angle: 174 },
  { name: 'Razorpay UPI', color: '#0c2340', icon: ShieldCheck, angle: 246 },
  { name: 'Cloud VPS', color: '#673ab7', icon: Globe, angle: 318 }
];

export default function SkillsOrbitCloud() {
  const { isFull, isReduced } = useQualityTier();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!isFull || isReduced) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setMousePos({ x: x * 12, y: y * 12 });
  };

  return (
    <div
      className="skills-orbit-wrapper"
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '720px',
        height: '480px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      {/* Background Orbital Rings */}
      <div
        style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          border: '1px dashed rgba(29, 92, 240, 0.22)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '440px',
          height: '440px',
          borderRadius: '50%',
          border: '1px dashed rgba(122, 47, 208, 0.18)',
          pointerEvents: 'none'
        }}
      />

      {/* Center Core: ZippyTech Softwares Badge */}
      <div
        className="frosted-glass"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 30% 30%, #152766 0%, #070e24 100%)',
          border: '2px solid rgba(29, 92, 240, 0.5)',
          boxShadow: '0 0 35px rgba(29, 92, 240, 0.35)',
          transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`,
          transition: 'transform 150ms ease-out'
        }}
      >
        <img
          src="/images/logo.webp"
          alt="ZippyTech Softwares"
          style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'contain' }}
        />
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em', marginTop: '4px' }}>
          ZIPPYTECH
        </span>
      </div>

      {/* Orbit 1: Inner Orbiting Elements */}
      <div
        className="orbit-ring-inner"
        style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          animation: isReduced ? 'none' : 'spinOrbit 26s linear infinite'
        }}
      >
        {ORBIT_INNER.map((item, idx) => {
          const rad = (item.angle * Math.PI) / 180;
          const x = Math.cos(rad) * 140;
          const y = Math.sin(rad) * 140;
          const Icon = item.icon;

          return (
            <div
              key={idx}
              className="frosted-glass orbit-badge"
              style={{
                position: 'absolute',
                top: `calc(50% + ${y}px - 18px)`,
                left: `calc(50% + ${x}px - 50px)`,
                width: '100px',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: '1px solid var(--border-glass)',
                background: 'rgba(10, 18, 42, 0.88)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                animation: isReduced ? 'none' : 'counterSpin 26s linear infinite'
              }}
            >
              <Icon size={14} color={item.color} />
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Orbit 2: Outer Orbiting Elements */}
      <div
        className="orbit-ring-outer"
        style={{
          position: 'absolute',
          width: '440px',
          height: '440px',
          borderRadius: '50%',
          animation: isReduced ? 'none' : 'spinOrbitReverse 38s linear infinite'
        }}
      >
        {ORBIT_OUTER.map((item, idx) => {
          const rad = (item.angle * Math.PI) / 180;
          const x = Math.cos(rad) * 220;
          const y = Math.sin(rad) * 220;
          const Icon = item.icon;

          return (
            <div
              key={idx}
              className="frosted-glass orbit-badge"
              style={{
                position: 'absolute',
                top: `calc(50% + ${y}px - 18px)`,
                left: `calc(50% + ${x}px - 55px)`,
                width: '110px',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: '1px solid var(--border-glass)',
                background: 'rgba(8, 14, 34, 0.88)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                animation: isReduced ? 'none' : 'counterSpinReverse 38s linear infinite'
              }}
            >
              <Icon size={14} color={item.color} />
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spinOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counterSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes spinOrbitReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes counterSpinReverse {
          from { transform: rotate(-360deg); }
          to { transform: rotate(0deg); }
        }
        @media (max-width: 640px) {
          .skills-orbit-wrapper {
            height: 380px !important;
            transform: scale(0.85);
          }
        }
      `}</style>
    </div>
  );
}
