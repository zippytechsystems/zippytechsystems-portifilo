import React, { useRef, useState, useEffect } from 'react';
import { useQualityTier } from '../context/QualityTierContext';

export default function TiltCard({
  children,
  maxTilt = 7,
  perspective = 1000,
  scale = 1.018,
  speed = 300,
  glare = true,
  className = '',
  style = {},
  onClick,
  ...props
}) {
  const cardRef = useRef(null);
  const { isFull, isReduced } = useQualityTier();
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, isHovered: false });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsPointerFine(window.matchMedia('(pointer: fine)').matches);
    }
  }, []);

  // For touch devices, Lite tier, or reduced motion, render standard element
  if (!isFull || isReduced || !isPointerFine) {
    return (
      <div
        className={`tilt-card-fallback ${className}`}
        style={style}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    );
  }

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = Math.max(Math.min(((y - centerY) / centerY) * -maxTilt, maxTilt), -maxTilt);
    const rotateY = Math.max(Math.min(((x - centerX) / centerX) * maxTilt, maxTilt), -maxTilt);

    setTilt({ rotateX, rotateY, isHovered: true });

    if (glare) {
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.22
      });
    }
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, isHovered: false });
    if (glare) {
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  const transformStyle = tilt.isHovered
    ? `perspective(${perspective}px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    : `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

  return (
    <div
      ref={cardRef}
      className={`tilt-card-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: transformStyle,
        transition: tilt.isHovered
          ? 'transform 80ms ease-out'
          : `transform ${speed}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
        willChange: tilt.isHovered ? 'transform' : 'auto',
        ...style
      }}
      {...props}
    >
      {children}

      {/* Dynamic Sheen Glare Overlay */}
      {glare && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(29, 92, 240, 0.15) 30%, transparent 65%)`,
            opacity: glarePos.opacity,
            transition: 'opacity 250ms ease',
            mixBlendMode: 'overlay',
            zIndex: 10
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
