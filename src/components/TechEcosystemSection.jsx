import React from 'react';
import SkillsOrbitCloud from './SkillsOrbitCloud';
import TechMarquee from './TechMarquee';

export default function TechEcosystemSection() {
  return (
    <section
      id="tech-stack"
      style={{
        padding: '5rem 0 3.5rem 0',
        background: 'var(--bg-canvas)',
        position: 'relative',
        overflow: 'hidden'
      }}
      aria-labelledby="tech-ecosystem-heading"
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem auto' }}>
          <span className="badge badge-ai" style={{ marginBottom: '1rem' }}>
            ENGINEERING EXCELLENCE
          </span>
          <h2 id="tech-ecosystem-heading" style={{ marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}>
            Battle-Tested <span style={{ color: '#1d5cf0' }}>Tech Ecosystem</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
            We engineer high-performance software with zero bloat. From instant mobile billing to cloud automation,
            our stack guarantees 99.9% uptime and lightning speed on Indian mobile networks.
          </p>
        </div>

        {/* 3D Orbiting Cloud */}
        <div style={{ marginBottom: '3rem' }}>
          <SkillsOrbitCloud />
        </div>

        {/* Dual Infinite Looping Marquee */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <TechMarquee speed={30} direction="left" />
          <TechMarquee speed={34} direction="right" />
        </div>
      </div>
    </section>
  );
}
