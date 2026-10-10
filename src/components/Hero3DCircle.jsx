import React, { useRef, useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, Award, Sparkles, PhoneCall } from 'lucide-react';
import { useQualityTier } from '../context/QualityTierContext';

/**
 * Hero3DCircle - Futuristic 3D Rotating Circle Widget
 * Features:
 * - Real-time 3D Fibonacci particle constellation rotating around an orbital axis
 * - Concentric dual 3D gyroscopic tech rings rotating in opposite directions
 * - Center glass lens floating in 3D depth holding Logo or Founder Photo
 * - High-contrast frosted glass verification badge attached below
 * - Fully responsive with touch / mouse 3D parallax tilt
 */
export default function Hero3DCircle({
  type = 'logo', // 'logo' | 'founder'
  imageSrc = '/images/logo.png',
  fallbackSrc = '/images/logo.png',
  title = 'ZippyTech Systems',
  subtitle = 'Official Agency Brand',
  badgeText = 'Verified Agency',
  phone = '',
  size = 180,
  accentColor = 'blue' // 'blue' | 'gold'
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { isFull, isReduced } = useQualityTier();

  // Color Schemes
  const isGold = accentColor === 'gold';
  const primaryGlow = isGold ? 'rgba(255, 229, 0, 0.5)' : 'rgba(0, 229, 255, 0.5)';
  const secondaryGlow = isGold ? 'rgba(18, 161, 80, 0.4)' : 'rgba(29, 92, 240, 0.4)';
  const ringBorder = isGold
    ? 'linear-gradient(135deg, rgba(255, 229, 0, 0.7), rgba(18, 161, 80, 0.5), rgba(255, 200, 0, 0.2))'
    : 'linear-gradient(135deg, rgba(0, 229, 255, 0.7), rgba(29, 92, 240, 0.6), rgba(122, 47, 208, 0.3))';

  const particleColors = isGold
    ? ['#ffe500', '#ffc800', '#12a150', '#ffffff', '#10b981']
    : ['#00e5ff', '#1d5cf0', '#7a2fd0', '#ffffff', '#38bdf8'];

  // 3D Particle Constellation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let isVisible = true;
    const count = isReduced ? 40 : 120;
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      const color = particleColors[i % particleColors.length];
      const baseSize = 1.0 + Math.random() * 1.5;
      points.push({ x, y, z, color, baseSize });
    }

    let angleX = 0.25;
    let angleY = 0;
    const speed = isReduced ? 0.0015 : 0.004;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        angleY += speed;
        angleX += speed * 0.4;

        const sphereRadius = (size * dpr * 0.44);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);

        // Sort by Z for proper depth rendering
        const transformed = [];
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          // Rotate Y
          const x1 = p.x * cosY + p.z * sinY;
          const z1 = -p.x * sinY + p.z * cosY;
          // Rotate X
          const y2 = p.y * cosX - z1 * sinX;
          const z2 = p.y * sinX + z1 * cosX;

          transformed.push({
            x: centerX + x1 * sphereRadius,
            y: centerY + y2 * sphereRadius,
            z: z2,
            color: p.color,
            baseSize: p.baseSize
          });
        }

        transformed.sort((a, b) => a.z - b.z);

        // Draw particles with 3D scale and alpha
        for (let i = 0; i < transformed.length; i++) {
          const pt = transformed[i];
          const scale = (pt.z + 1.2) / 2.2; // 0.1 to 1.0
          const alpha = Math.max(0.12, Math.min(0.9, scale));
          const radius = Math.max(0.6, pt.baseSize * scale * dpr * 0.7);

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = alpha;
          ctx.fill();

          // Subtle glow on foreground particles
          if (scale > 0.75) {
            ctx.shadowColor = pt.color;
            ctx.shadowBlur = 4 * dpr;
          } else {
            ctx.shadowBlur = 0;
          }
        }
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [size, accentColor, isReduced]);

  const handleMouseMove = (e) => {
    if (isReduced) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Optimized Avatar Dimension (Founder portrait gets higher visibility & prominence)
  const avatarSize = Math.floor(size * (type === 'founder' ? 0.65 : 0.52));

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        userSelect: 'none',
        perspective: '1000px',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(${isHovered ? 1.03 : 1})`,
        padding: '0.5rem'
      }}
    >
      {/* 3D Sphere & Concentric Orbital Rings Container */}
      <div
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Ambient Radial Backlight Glow */}
        <div
          style={{
            position: 'absolute',
            inset: '10%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryGlow} 0%, ${secondaryGlow} 50%, transparent 75%)`,
            filter: 'blur(22px)',
            opacity: isHovered ? 0.95 : 0.7,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none'
          }}
          aria-hidden="true"
        />

        {/* Outer 3D Gyro Orbit Ring (Clockwise Rotation) */}
        <div
          className="animate-spin-slow"
          style={{
            position: 'absolute',
            inset: '4px',
            borderRadius: '50%',
            border: '1.5px dashed rgba(255, 255, 255, 0.25)',
            boxShadow: `0 0 16px ${primaryGlow}, inset 0 0 12px ${secondaryGlow}`,
            pointerEvents: 'none'
          }}
          aria-hidden="true"
        />

        {/* Inner 3D Counter-Rotating Tech Ring */}
        <div
          className="animate-spin-reverse"
          style={{
            position: 'absolute',
            inset: '14px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderTopColor: isGold ? '#ffe500' : '#00e5ff',
            borderRightColor: isGold ? '#12a150' : '#1d5cf0',
            pointerEvents: 'none'
          }}
          aria-hidden="true"
        />

        {/* HTML5 Canvas 3D Particle Constellation */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${size}px`,
            height: `${size}px`,
            pointerEvents: 'none'
          }}
          aria-hidden="true"
        />

        {/* Center Floating Glass Avatar Disc (Logo or Founder Portrait) */}
        <div
          style={{
            position: 'relative',
            width: `${avatarSize}px`,
            height: `${avatarSize}px`,
            borderRadius: '50%',
            overflow: 'hidden',
            background: isGold
              ? 'linear-gradient(145deg, #0b142d, #070e24)'
              : 'linear-gradient(145deg, #070e24, #0b1b4a)',
            border: isGold
              ? '2px solid rgba(255, 229, 0, 0.85)'
              : '2px solid rgba(0, 229, 255, 0.85)',
            boxShadow: isGold
              ? '0 0 24px rgba(255, 229, 0, 0.4), inset 0 0 14px rgba(255, 229, 0, 0.2)'
              : '0 0 24px rgba(0, 229, 255, 0.4), inset 0 0 14px rgba(29, 92, 240, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            transition: 'transform 0.25s ease',
            transform: 'translateZ(18px)'
          }}
        >
          <img
            src={imageSrc}
            alt={title}
            onError={(e) => {
              if (fallbackSrc && e.target.src !== fallbackSrc) {
                e.target.src = fallbackSrc;
              }
            }}
            style={{
              width: type === 'logo' ? '88%' : '100%',
              height: type === 'logo' ? '88%' : '100%',
              objectFit: type === 'logo' ? 'contain' : 'cover',
              objectPosition: type === 'founder' ? 'center 12%' : 'center',
              imageRendering: '-webkit-optimize-contrast',
              filter: type === 'founder' ? 'contrast(1.03) brightness(1.02)' : 'none',
              borderRadius: '50%'
            }}
          />

          {/* Verification Active Beacon Dot */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid #070c1e',
              boxShadow: '0 0 8px #10b981'
            }}
            title="Verified Authenticity"
          />
        </div>
      </div>

      {/* Floating Verification Glass Badge Below 3D Circle */}
      <div
        style={{
          marginTop: '0.65rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: `${size + 30}px`,
          padding: '0.45rem 0.85rem',
          borderRadius: '14px',
          background: 'rgba(7, 14, 38, 0.82)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          zIndex: 3
        }}
      >
        {/* Top Tag Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.15rem 0.55rem',
            borderRadius: '9999px',
            background: isGold ? 'rgba(255, 229, 0, 0.15)' : 'rgba(0, 229, 255, 0.15)',
            border: isGold ? '1px solid rgba(255, 229, 0, 0.35)' : '1px solid rgba(0, 229, 255, 0.35)',
            marginBottom: '0.25rem'
          }}
        >
          {isGold ? (
            <Award size={11} color="#ffe500" />
          ) : (
            <ShieldCheck size={11} color="#00e5ff" />
          )}
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: isGold ? '#ffe500' : '#00e5ff'
            }}
          >
            {badgeText}
          </span>
        </div>

        {/* Primary Title (Crisp White Text) */}
        <span
          style={{
            fontSize: '0.92rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: '#ffffff',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)'
          }}
        >
          {title}
        </span>

        {/* Secondary Subtitle / Proof Line */}
        <span
          style={{
            fontSize: '0.72rem',
            color: '#cbd5e1',
            lineHeight: 1.3,
            marginTop: '0.15rem',
            fontWeight: 500
          }}
        >
          {subtitle}
        </span>

        {/* Optional Direct Contact Line */}
        {phone && (
          <div
            style={{
              marginTop: '0.35rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#22c55e',
              background: 'rgba(34, 197, 94, 0.12)',
              padding: '0.15rem 0.5rem',
              borderRadius: '6px'
            }}
          >
            <PhoneCall size={10} color="#22c55e" />
            <span>{phone}</span>
          </div>
        )}
      </div>
    </div>
  );
}
