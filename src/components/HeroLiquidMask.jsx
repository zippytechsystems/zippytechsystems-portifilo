import React, { useRef, useEffect, useState } from 'react';
import { useQualityTier } from '../context/QualityTierContext';

export default function HeroLiquidMask({
  baseSrc = '/images/hero-base.webp',
  revealSrc = '/images/hero-reveal.webp',
  fallbackBase = '/images/hero-base.jpg',
  fallbackReveal = '/images/hero-reveal.jpg',
  className = '',
  style = {}
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const { isFull, isReduced } = useQualityTier();
  
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imagesFailed, setImagesFailed] = useState(false);
  const baseImgRef = useRef(null);
  const revealImgRef = useRef(null);

  // Preload base and reveal images
  useEffect(() => {
    let isCancelled = false;
    const baseImg = new Image();
    const revealImg = new Image();
    let loadedCount = 0;

    const handleLoad = () => {
      loadedCount += 1;
      if (loadedCount === 2 && !isCancelled) {
        baseImgRef.current = baseImg;
        revealImgRef.current = revealImg;
        setImagesLoaded(true);
      }
    };

    const handleError = () => {
      if (!isCancelled) {
        // Attempt fallback to jpg if webp fails
        if (baseImg.src.endsWith('.webp')) {
          baseImg.src = fallbackBase;
          revealImg.src = fallbackReveal;
        } else {
          setImagesFailed(true);
        }
      }
    };

    baseImg.onload = handleLoad;
    baseImg.onerror = handleError;
    revealImg.onload = handleLoad;
    revealImg.onerror = handleError;

    baseImg.src = baseSrc;
    revealImg.src = revealSrc;

    return () => {
      isCancelled = true;
      baseImg.onload = null;
      baseImg.onerror = null;
      revealImg.onload = null;
      revealImg.onerror = null;
    };
  }, [baseSrc, revealSrc, fallbackBase, fallbackReveal]);

  // Canvas liquid mask interactive loop (Full tier only)
  useEffect(() => {
    if (!isFull || isReduced || !imagesLoaded || imagesFailed) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create an offscreen canvas for feathered composite masking
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;
    let animationFrameId = null;

    // Pointer tracking & lerp state
    let targetX = 0;
    let targetY = 0;
    let currX = 0;
    let currY = 0;
    let hasUserInteracted = false;
    let lastInteractionTime = Date.now();
    let idleAngle = 0;

    const updateSize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      width = Math.max(rect.width, 300);
      height = Math.max(rect.height, 300);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      offscreen.width = Math.floor(width * dpr);
      offscreen.height = Math.floor(height * dpr);

      // Default initial position to center
      if (!hasUserInteracted) {
        targetX = width / 2;
        targetY = height / 2;
        currX = targetX;
        currY = targetY;
      }
    };

    updateSize();

    // ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    // Visibility observer to pause RAF when out of view
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Pointer handlers
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      hasUserInteracted = true;
      lastInteractionTime = Date.now();
    };

    const handlePointerLeave = () => {
      // Revert to center when cursor leaves
      targetX = width / 2;
      targetY = height / 2;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);

    // Main 60fps render loop
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const now = Date.now();
      // If idle for more than 2 seconds, gently orbit the reveal light
      if (!hasUserInteracted || now - lastInteractionTime > 2500) {
        idleAngle += 0.015;
        const orbitRadiusX = width * 0.24;
        const orbitRadiusY = height * 0.18;
        targetX = width / 2 + Math.cos(idleAngle) * orbitRadiusX;
        targetY = height / 2 + Math.sin(idleAngle * 1.3) * orbitRadiusY;
      }

      // Smooth lerp easing
      currX += (targetX - currX) * 0.085;
      currY += (targetY - currY) * 0.085;

      const maskRadius = Math.max(Math.min(width * 0.2, 190), 90);

      // Reset transforms
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const baseImg = baseImgRef.current;
      const revealImg = revealImgRef.current;

      if (baseImg && revealImg) {
        // 1. Draw Base Image with aspect-ratio cover
        drawCover(ctx, baseImg, width, height);

        // 2. Prepare reveal image on offscreen canvas
        offCtx.setTransform(1, 0, 0, 1, 0, 0);
        offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
        offCtx.scale(dpr, dpr);

        drawCover(offCtx, revealImg, width, height);

        // 3. Composite liquid feathered mask
        offCtx.globalCompositeOperation = 'destination-in';
        const grad = offCtx.createRadialGradient(
          currX,
          currY,
          maskRadius * 0.15,
          currX,
          currY,
          maskRadius
        );
        grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
        grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.85)');
        grad.addColorStop(0.8, 'rgba(0, 0, 0, 0.35)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        offCtx.fillStyle = grad;
        offCtx.beginPath();
        offCtx.arc(currX, currY, maskRadius, 0, Math.PI * 2);
        offCtx.fill();
        offCtx.globalCompositeOperation = 'source-over';

        // 4. Draw feathered reveal layer onto main canvas
        ctx.drawImage(offscreen, 0, 0, width, height);

        // 5. Subtle luminous accent ring at perimeter of mask
        ctx.save();
        const ringGrad = ctx.createRadialGradient(
          currX,
          currY,
          maskRadius * 0.75,
          currX,
          currY,
          maskRadius * 1.15
        );
        ringGrad.addColorStop(0, 'rgba(29, 92, 240, 0)');
        ringGrad.addColorStop(0.5, 'rgba(0, 229, 255, 0.18)');
        ringGrad.addColorStop(1, 'rgba(29, 92, 240, 0)');
        ctx.fillStyle = ringGrad;
        ctx.beginPath();
        ctx.arc(currX, currY, maskRadius * 1.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [isFull, isReduced, imagesLoaded, imagesFailed]);

  // Helper to draw an image centered and scaled to cover
  const drawCover = (context, img, w, h) => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let renderW, renderH, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderW = w;
      renderH = w / imgRatio;
      offsetX = 0;
      offsetY = (h - renderH) / 2;
    } else {
      renderH = h;
      renderW = h * imgRatio;
      offsetX = (w - renderW) / 2;
      offsetY = 0;
    }

    context.drawImage(img, offsetX, offsetY, renderW, renderH);
  };

  return (
    <div
      ref={containerRef}
      className={`hero-liquid-mask-container ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        ...style
      }}
      aria-hidden="true"
    >
      {/* Fallback Static Layers for Lite / Reduced Tiers or before canvas loads */}
      {(!isFull || isReduced || !imagesLoaded || imagesFailed) ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 40%, rgba(29, 92, 240, 0.15) 0%, rgba(11, 27, 74, 0.95) 70%),
                         url(${baseSrc}) center/cover no-repeat`,
            opacity: 0.9
          }}
        >
          {/* Subtle CSS pulse for Lite tier when not in reduced motion */}
          {!isReduced && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.12) 0%, transparent 60%)`,
                animation: 'pulseGlow 6s ease-in-out infinite alternate'
              }}
            />
          )}
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            opacity: imagesLoaded ? 1 : 0,
            transition: 'opacity 0.6s ease'
          }}
        />
      )}

      {/* Dark vignette overlay for contrast and guaranteed text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(11, 27, 74, 0.45) 0%, rgba(7, 14, 36, 0.85) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
