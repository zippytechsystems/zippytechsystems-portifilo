import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { useQualityTier } from '../hooks/useQualityTier';

/**
 * SmoothScroll provider using Lenis:
 * - Disabled on touch devices ((pointer: coarse)) where native momentum scrolling is optimal.
 * - Disabled in 'reduced' motion tier for accessibility.
 * - Disabled on /admin routes to prevent interfering with tables and forms.
 * - Handles route changes (scroll to top) and anchor hash links with header offset.
 * - Exposes global window.__lenis for modal scroll-lock integration.
 */
export default function SmoothScroll({ children }) {
  const { tier } = useQualityTier();
  const location = useLocation();
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isReducedMotion = tier === 'reduced';

  useEffect(() => {
    // 1. Never enable on /admin or if reduced motion is preferred
    if (isAdminRoute || isReducedMotion) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        window.__lenis = null;
      }
      return;
    }

    // 2. Check touch screen: native touch scrolling feels better and uses less power
    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
      return;
    }

    // 3. Initialize Lenis for desktop fine pointer
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }
    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
    };
  }, [isAdminRoute, isReducedMotion]);

  // Handle route change: scroll to top or target hash
  useEffect(() => {
    if (isAdminRoute) return;

    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el, { offset: -80, duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
    }

    // Scroll to top on navigation
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash, isAdminRoute]);

  return <>{children}</>;
}
