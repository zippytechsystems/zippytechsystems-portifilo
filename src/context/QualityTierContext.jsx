import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useData } from './DataContext';

const QualityTierContext = createContext();

/**
 * Detect hardware/environment tier dynamically.
 * Requirement 1:
 * - treat navigator.deviceMemory, navigator.connection and saveData as optional.
 * - if deviceMemory is undefined (Safari, Firefox), do NOT downgrade the device;
 *   decide using screen width, pointer type, hardwareConcurrency and prefers-reduced-motion only.
 */
export function detectHardwareTier() {
  if (typeof window === 'undefined') return 'lite';

  // 1. Check system prefers-reduced-motion
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'reduced';
    }
  } catch {}

  // 2. Check browser data saver (optional: only downgrade if explicitly true)
  try {
    if (typeof navigator !== 'undefined' && navigator.connection?.saveData === true) {
      return 'reduced';
    }
  } catch {}

  // 3. Hardware & viewport checks for Full vs Lite
  try {
    const isDesktopPointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    const isWideScreen = (window.matchMedia && window.matchMedia('(min-width: 768px)').matches) || window.innerWidth >= 768;
    
    // Concurrency: default gracefully to 4 if undefined
    const concurrency = (typeof navigator !== 'undefined' && typeof navigator.hardwareConcurrency === 'number')
      ? navigator.hardwareConcurrency
      : 4;
    const isLowConcurrency = concurrency < 4;

    // Device memory: if undefined (Safari, Firefox), do NOT downgrade!
    // Only downgrade if deviceMemory is explicitly defined AND less than 4.
    const isLowMemory = (typeof navigator !== 'undefined' && typeof navigator.deviceMemory === 'number')
      ? navigator.deviceMemory < 4
      : false;

    if (isDesktopPointer && isWideScreen && !isLowConcurrency && !isLowMemory) {
      return 'full';
    }
  } catch {}

  return 'lite';
}

function resolveEffectiveTier(userOverride, serverOverride) {
  // Visitor's local preference takes highest priority for accessibility
  if (userOverride === 'reduced' || userOverride === 'full' || userOverride === 'lite') {
    return userOverride;
  }
  // Server-side quality override from Admin Design Settings
  if (serverOverride === 'reduced' || serverOverride === 'full' || serverOverride === 'lite') {
    return serverOverride;
  }
  return detectHardwareTier();
}

export function QualityTierProvider({ children }) {
  const { designSettings } = useData() || {};
  const serverOverride = designSettings?.quality_override;

  const [userOverride, setUserOverride] = useState(() => {
    try {
      return localStorage.getItem('zippy_motion_preference') || 'auto';
    } catch {
      return 'auto';
    }
  });

  const [tier, setTier] = useState(() => resolveEffectiveTier(
    (() => {
      try {
        return localStorage.getItem('zippy_motion_preference') || 'auto';
      } catch {
        return 'auto';
      }
    })(),
    serverOverride
  ));

  // Sync DOM attributes whenever tier changes
  useEffect(() => {
    document.documentElement.setAttribute('data-quality-tier', tier);
    document.documentElement.setAttribute(
      'data-reduced-motion',
      tier === 'reduced' ? 'true' : 'false'
    );
  }, [tier]);

  // React to hardware changes, media queries, and server quality override updates
  useEffect(() => {
    const evaluateLiveTier = () => {
      const currentOverride = (() => {
        try {
          return localStorage.getItem('zippy_motion_preference') || 'auto';
        } catch {
          return userOverride;
        }
      })();

      const nextTier = resolveEffectiveTier(currentOverride, serverOverride);
      setTier(nextTier);
    };

    evaluateLiveTier();

    // Media Queries to monitor
    const mqlReducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const mqlPointerFine = window.matchMedia ? window.matchMedia('(pointer: fine)') : null;
    const mqlMinWidth = window.matchMedia ? window.matchMedia('(min-width: 768px)') : null;

    const addMqlListener = (mql, handler) => {
      if (!mql) return;
      if (mql.addEventListener) {
        mql.addEventListener('change', handler);
      } else if (mql.addListener) {
        mql.addListener(handler);
      }
    };

    const removeMqlListener = (mql, handler) => {
      if (!mql) return;
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handler);
      } else if (mql.removeListener) {
        mql.removeListener(handler);
      }
    };

    // Attach MQL listeners
    addMqlListener(mqlReducedMotion, evaluateLiveTier);
    addMqlListener(mqlPointerFine, evaluateLiveTier);
    addMqlListener(mqlMinWidth, evaluateLiveTier);

    // Also monitor window resize for screen width shifts
    let resizeTimer = null;
    const handleResize = () => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(evaluateLiveTier);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Also monitor storage changes across tabs
    const handleStorage = (e) => {
      if (e.key === 'zippy_motion_preference') {
        const newOverride = e.newValue || 'auto';
        setUserOverride(newOverride);
        setTier(resolveEffectiveTier(newOverride, serverOverride));
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      removeMqlListener(mqlReducedMotion, evaluateLiveTier);
      removeMqlListener(mqlPointerFine, evaluateLiveTier);
      removeMqlListener(mqlMinWidth, evaluateLiveTier);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('storage', handleStorage);
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
    };
  }, [userOverride, serverOverride]);

  const setMotionPreference = useCallback((pref) => {
    // pref: 'auto' | 'reduced' | 'full' | 'lite'
    setUserOverride(pref);
    try {
      localStorage.setItem('zippy_motion_preference', pref);
    } catch {}

    const resolved = resolveEffectiveTier(pref, serverOverride);
    setTier(resolved);
  }, [serverOverride]);

  const toggleReducedMotion = useCallback(() => {
    // Live toggle from footer or settings
    if (tier === 'reduced') {
      // Revert to live automatic hardware detection
      setMotionPreference('auto');
    } else {
      // Switch directly to reduced motion
      setMotionPreference('reduced');
    }
  }, [tier, setMotionPreference]);

  return (
    <QualityTierContext.Provider
      value={{
        tier,
        isFull: tier === 'full',
        isLite: tier === 'lite',
        isReduced: tier === 'reduced',
        userOverride,
        setMotionPreference,
        toggleReducedMotion
      }}
    >
      {children}
    </QualityTierContext.Provider>
  );
}

export function useQualityTier() {
  const context = useContext(QualityTierContext);
  if (!context) {
    return {
      tier: 'lite',
      isFull: false,
      isLite: true,
      isReduced: false,
      userOverride: 'auto',
      setMotionPreference: () => {},
      toggleReducedMotion: () => {}
    };
  }
  return context;
}
