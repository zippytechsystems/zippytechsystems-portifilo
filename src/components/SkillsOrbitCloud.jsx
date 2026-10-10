import React, { useState, useEffect, useRef } from 'react';
import { Code2, Database, Cpu, Globe, Smartphone, Server, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';
import { useQualityTier } from '../context/QualityTierContext';

const ORBIT_INNER = [
  { name: 'React 18', category: 'Web', color: '#61dafb', icon: Code2, baseAngle: 0 },
  { name: 'PHP 8', category: 'Backend', color: '#777bb4', icon: Database, baseAngle: 90 },
  { name: 'MySQL', category: 'Database', color: '#00758f', icon: Database, baseAngle: 180 },
  { name: 'Node.js', category: 'API', color: '#68a063', icon: Server, baseAngle: 270 }
];

const ORBIT_OUTER = [
  { name: 'Flutter Apps', category: 'Mobile', color: '#02569b', icon: Smartphone, baseAngle: 30 },
  { name: 'Python AI', category: 'Automation', color: '#ffd43b', icon: Cpu, baseAngle: 102 },
  { name: 'Docker', category: 'DevOps', color: '#2496ed', icon: Server, baseAngle: 174 },
  { name: 'Razorpay UPI', category: 'Payments', color: '#0c2340', icon: ShieldCheck, baseAngle: 246 },
  { name: 'Cloud VPS', category: 'Hostinger', color: '#673ab7', icon: Globe, baseAngle: 318 }
];

const ALL_SKILLS = [...ORBIT_INNER, ...ORBIT_OUTER];

/**
 * SkillsOrbitCloud Component:
 * - Desktop Full Tier: Draggable interactive orbital constellation with levitating badges.
 * - Lite & Reduced Tier: Clean, accessible, responsive badge grid.
 * - Levitating CSS transform oscillations for organic floating feel.
 */
export default function SkillsOrbitCloud() {
  const { isFull, isReduced } = useQualityTier();
  const [rotationOffset, setRotationOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  const dragStartXRef = useRef(0);
  const rotationRef = useRef(0);

  // Desktop Mouse Tilt effect
  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartXRef.current;
      rotationRef.current += deltaX * 0.45;
      dragStartXRef.current = e.clientX;
      setRotationOffset(rotationRef.current);
      return;
    }

    if (!isFull || isReduced) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setMouseTilt({ x: x * 10, y: y * 10 });
  };

  // Drag interaction handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    dragStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - dragStartXRef.current;
    rotationRef.current += deltaX * 0.45;
    dragStartXRef.current = currentX;
    setRotationOffset(rotationRef.current);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 1. Accessibility & Mobile Fallback: Clean Responsive Badge Grid
  if (!isFull || isReduced) {
    return (
      <div
        className="skills-grid-fallback"
        style={{
          width: '100%',
          maxWidth: '820px',
          margin: '0 auto',
          padding: '1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}
      >
        {ALL_SKILLS.map((skill, idx) => {
          const Icon = skill.icon;
          return (
            <div
              key={idx}
              className="frosted-glass"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-glass)',
                background: 'rgba(10, 18, 42, 0.75)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: `${skill.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: skill.color,
                  flexShrink: 0
                }}
              >
                <Icon size={16} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                  {skill.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', lineHeight: 1 }}>
                  {skill.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 2. Full Tier: Interactive Draggable Orbiting Constellation with Levitating Badges
  return (
    <div
      className="skills-orbit-wrapper"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '720px',
        height: '490px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      title="Click and drag horizontally to spin tech orbit"
    >
      {/* Background Orbital Rings */}
      <div
        style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          border: '1px dashed rgba(29, 92, 240, 0.24)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          border: '1px dashed rgba(122, 47, 208, 0.2)',
          pointerEvents: 'none'
        }}
      />

      {/* Central Core: ZippyTech Softwares Official Badge */}
      <div
        className="frosted-glass"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '124px',
          height: '124px',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 30% 30%, #152766 0%, #070e24 100%)',
          border: '2px solid rgba(29, 92, 240, 0.55)',
          boxShadow: '0 0 35px rgba(29, 92, 240, 0.4), inset 0 0 15px rgba(29, 92, 240, 0.25)',
          transform: `translate3d(${mouseTilt.x * 0.4}px, ${mouseTilt.y * 0.4}px, 0)`,
          transition: isDragging ? 'none' : 'transform 180ms ease-out'
        }}
      >
        <img
          src="/images/company-logo-2026.png?v=20261011"
          alt="ZippyTech Softwares Logo"
          style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'contain' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/company-logo-2026.webp?v=20261011';
          }}
        />
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em', marginTop: '4px' }}>
          ZIPPYTECH
        </span>
      </div>

      {/* Orbit Ring 1: Inner Orbit (React, PHP, MySQL, Node) */}
      <div
        className="orbit-ring-inner"
        style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          transform: `rotate(${rotationOffset}deg)`,
          transition: isDragging ? 'none' : 'transform 100ms ease-out',
          animation: isDragging ? 'none' : 'spinOrbit 28s linear infinite'
        }}
      >
        {ORBIT_INNER.map((item, idx) => {
          const rad = (item.baseAngle * Math.PI) / 180;
          const x = Math.cos(rad) * 140;
          const y = Math.sin(rad) * 140;
          const Icon = item.icon;

          return (
            <div
              key={idx}
              className="frosted-glass orbit-badge levitate-badge"
              style={{
                position: 'absolute',
                top: `calc(50% + ${y}px - 18px)`,
                left: `calc(50% + ${x}px - 52px)`,
                width: '104px',
                padding: '0.38rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                border: '1px solid var(--border-glass)',
                background: 'rgba(10, 18, 42, 0.9)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.35)',
                animation: `counterSpin 28s linear infinite, levitateBadge ${3 + idx * 0.4}s ease-in-out infinite alternate`,
                animationDelay: `0s, ${idx * 0.3}s`
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

      {/* Orbit Ring 2: Outer Orbit (Flutter, Python, Docker, Razorpay, VPS) */}
      <div
        className="orbit-ring-outer"
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          transform: `rotate(${-rotationOffset * 0.8}deg)`,
          transition: isDragging ? 'none' : 'transform 100ms ease-out',
          animation: isDragging ? 'none' : 'spinOrbitReverse 38s linear infinite'
        }}
      >
        {ORBIT_OUTER.map((item, idx) => {
          const rad = (item.baseAngle * Math.PI) / 180;
          const x = Math.cos(rad) * 225;
          const y = Math.sin(rad) * 225;
          const Icon = item.icon;

          return (
            <div
              key={idx}
              className="frosted-glass orbit-badge levitate-badge"
              style={{
                position: 'absolute',
                top: `calc(50% + ${y}px - 18px)`,
                left: `calc(50% + ${x}px - 58px)`,
                width: '116px',
                padding: '0.38rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                border: '1px solid var(--border-glass)',
                background: 'rgba(8, 14, 34, 0.9)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.35)',
                animation: `counterSpinReverse 38s linear infinite, levitateBadge ${3.4 + idx * 0.3}s ease-in-out infinite alternate`,
                animationDelay: `0s, ${idx * 0.25}s`
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
        @keyframes levitateBadge {
          0% { transform: translateY(-4px); }
          100% { transform: translateY(4px); }
        }
        .orbit-badge:hover {
          border-color: #1d5cf0 !important;
          box-shadow: 0 0 20px rgba(29, 92, 240, 0.5) !important;
          z-index: 20;
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
