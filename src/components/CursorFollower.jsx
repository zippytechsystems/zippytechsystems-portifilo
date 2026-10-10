import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQualityTier } from '../hooks/useQualityTier';
import { useData } from '../context/DataContext';

/**
 * CursorFollower component:
 * - Ultra-lightweight trailing cursor dot and smooth expanding ring.
 * - Desktop fine pointer only ((pointer: fine) and !touch).
 * - Automatically disabled on touch, in Reduced Motion tier, and on /admin routes.
 * - Scales over interactive elements (a, button, input submit, [role="button"]).
 * - Never hides native system pointer in forms or inputs.
 * - Zero dependency (uses standard requestAnimationFrame lerp physics).
 */
export default function CursorFollower() {
  const { tier } = useQualityTier();
  const location = useLocation();
  const { designSettings } = useData() || {};
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);

  const isAdmin = location.pathname.startsWith('/admin');
  const isReduced = tier === 'reduced';
  const isCursorAllowed = designSettings?.cursor_effect_enabled !== false;

  useEffect(() => {
    // 1. Guard against touch devices, reduced motion, admin portal, or disabled by admin
    const hasFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    if (!hasFinePointer || isTouch || isReduced || isAdmin || !isCursorAllowed) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target;
      if (target) {
        const isInteractive = Boolean(
          target.closest('a, button, [role="button"], .btn, input[type="submit"]')
        );
        setIsHoveringInteractive(isInteractive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Smooth animation loop using lerp
    const render = () => {
      // Ring follows mouse with smooth inertia (lerp factor 0.18)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isAdmin, isReduced, isCursorAllowed]);

  if (!isEnabled) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.25s ease'
      }}
    >
      {/* Center dot (instant position) */}
      <div
        ref={dotRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          marginLeft: '-3px',
          marginTop: '-3px',
          borderRadius: '50%',
          backgroundColor: '#ffe500',
          boxShadow: '0 0 8px rgba(255, 229, 0, 0.8)',
          willChange: 'transform'
        }}
      />

      {/* Trailing smooth expanding ring */}
      <div
        ref={ringRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: isHoveringInteractive ? '48px' : '32px',
          height: isHoveringInteractive ? '48px' : '32px',
          marginLeft: isHoveringInteractive ? '-24px' : '-16px',
          marginTop: isHoveringInteractive ? '-24px' : '-16px',
          borderRadius: '50%',
          border: isHoveringInteractive ? '2px solid #1d5cf0' : '1.5px solid rgba(255, 229, 0, 0.45)',
          backgroundColor: isHoveringInteractive ? 'rgba(29, 92, 240, 0.12)' : 'transparent',
          backdropFilter: isHoveringInteractive ? 'blur(2px)' : 'none',
          transition: 'width 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), margin 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.2s ease, border-color 0.2s ease',
          willChange: 'transform'
        }}
      />
    </div>
  );
}
