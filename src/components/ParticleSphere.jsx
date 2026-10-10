import React, { useRef, useEffect } from 'react';
import { useQualityTier } from '../context/QualityTierContext';

export default function ParticleSphere({
  radius = 160,
  speed = 0.0035,
  particleCount = 340,
  interactive = true,
  className = '',
  style = {}
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const { isFull, isReduced } = useQualityTier();

  // Mobile & Reduced Motion Fallback: Clean static CSS gradient sphere (Full tier only for canvas)
  if (!isFull || isReduced) {
    return (
      <div
        className={`particle-sphere-static-fallback ${className}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pointerEvents: 'none',
          ...style
        }}
        aria-hidden="true"
      >
        <div
          style={{
            width: `${radius * 1.8}px`,
            height: `${radius * 1.8}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(0, 229, 255, 0.25) 0%, rgba(29, 92, 240, 0.18) 45%, rgba(122, 47, 208, 0.08) 70%, transparent 85%)',
            boxShadow: '0 0 50px rgba(29, 92, 240, 0.2)',
            border: '1px solid rgba(29, 92, 240, 0.25)'
          }}
        />
      </div>
    );
  }

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;
    let animationFrameId = null;

    const count = particleCount;

    // Generate points on Fibonacci sphere
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle ~2.39996 rad

    // Curated Zippy brand color distribution
    const colors = [
      '#1d5cf0', // Primary Blue (50%)
      '#1d5cf0',
      '#00e5ff', // Electric Cyan (25%)
      '#7a2fd0', // Tech Purple (20%)
      '#12a150'  // Growth Green (5%)
    ];

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // y: 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const color = colors[i % colors.length];
      const baseSize = 1.4 + Math.random() * 1.6;

      points.push({ x, y, z, color, baseSize });
    }

    // 3D rotation angles & velocities
    let angleX = 0.2;
    let angleY = 0;
    let targetAngleX = 0.2;
    let targetAngleY = 0;
    let mouseOffsetX = 0;
    let mouseOffsetY = 0;

    const updateSize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      width = Math.max(rect.width, 180);
      height = Math.max(rect.height, 180);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => updateSize());
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Mouse movement interaction
    const handleMouseMove = (e) => {
      if (!interactive || isReduced) return;
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseOffsetX = (e.clientX - centerX) / (rect.width / 2);
      mouseOffsetY = (e.clientY - centerY) / (rect.height / 2);

      targetAngleY = mouseOffsetX * 0.8;
      targetAngleX = -mouseOffsetY * 0.8;
    };

    const handleMouseLeave = () => {
      targetAngleX = 0.2;
      targetAngleY = 0;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Main 3D Render Loop
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      // Auto rotation + interactive tilt
      if (!isReduced) {
        angleY += speed;
        // Smoothly interpolate towards mouse offset
        angleX += (targetAngleX - angleX) * 0.05;
        angleY += (targetAngleY * 0.01);
      }

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const centerX = width / 2;
      const centerY = height / 2;
      const currentRadius = Math.min(radius, Math.min(width, height) * 0.42);
      const fov = currentRadius * 2.8;

      // Project points to 2D
      const projected = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Rotate around Y axis
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate around X axis
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective scale (fov / (fov + z))
        const perspective = fov / (fov + z2 * currentRadius);
        const screenX = centerX + x1 * currentRadius * perspective;
        const screenY = centerY + y2 * currentRadius * perspective;

        projected.push({
          x: screenX,
          y: screenY,
          z: z2,
          perspective,
          color: p.color,
          baseSize: p.baseSize
        });
      }

      // Sort points by z2 so front points render on top of back points
      projected.sort((a, b) => a.z - b.z);

      // Draw faint constellation lines between nearby front particles
      const connectionDistance = currentRadius * 0.28;
      ctx.lineWidth = 0.75;

      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.z < -0.2) continue; // Only connect front-facing particles

        for (let j = i + 1; j < Math.min(i + 7, projected.length); j++) {
          const p2 = projected[j];
          if (p2.z < -0.2) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.18 * ((p1.z + 1) / 2);
            ctx.strokeStyle = `rgba(29, 92, 240, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles with depth shading and glow
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        // Normalized depth: z is roughly -1 to 1
        const depthNorm = (p.z + 1) / 2; // 0 (back) to 1 (front)
        const size = Math.max(p.baseSize * p.perspective, 0.8);
        const alpha = Math.max(Math.min(0.15 + depthNorm * 0.85, 1), 0.1);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Extra glowing halo for prominent front particles
        if (p.z > 0.4 && isFull) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha * 0.25;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;

      if (!isReduced) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [radius, speed, particleCount, interactive, isFull, isReduced]);

  return (
    <div
      ref={containerRef}
      className={`particle-sphere-wrapper ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: interactive ? 'auto' : 'none',
        ...style
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}
