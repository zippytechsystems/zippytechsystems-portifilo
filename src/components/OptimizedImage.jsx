import React, { useState } from 'react';
import imageManifest from '../data/imageManifest.json';

/**
 * OptimizedImage component:
 * - Uses responsive WebP with fallback to original
 * - Supports srcset for 1x and 2x displays
 * - Renders tiny blur-up placeholder while loading
 * - native lazy loading (eager when fetchpriority is high)
 * - Explicit width & height to eliminate CLS (Cumulative Layout Shift)
 */
export default function OptimizedImage({
  src,
  alt = '',
  width,
  height,
  priority = false,
  className = '',
  style = {},
  objectFit = 'cover',
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Clean relative path key to look up in manifest (e.g. "/images/logo.png" -> "images/logo.png")
  const manifestKey = typeof src === 'string' ? src.replace(/^\//, '') : '';
  const item = imageManifest[manifestKey];

  const resolvedWidth = width || item?.width;
  const resolvedHeight = height || item?.height;
  const webpSrc = item?.webp1x || src;
  const srcSet = item?.webp2x ? `${item.webp1x} 1x, ${item.webp2x} 2x` : undefined;

  return (
    <div
      className={`optimized-image-wrapper ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-block',
        width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
        ...style
      }}
    >
      {/* Tiny blur placeholder background */}
      {item?.blurPlaceholder && !isLoaded && (
        <img
          src={item.blurPlaceholder}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit,
            filter: 'blur(10px)',
            transform: 'scale(1.05)',
            transition: 'opacity 0.4s ease-out',
            opacity: isLoaded ? 0 : 1
          }}
        />
      )}

      {/* Main optimized picture/img */}
      <picture>
        {item?.webp1x && (
          <source type="image/webp" srcSet={srcSet || item.webp1x} />
        )}
        <img
          src={webpSrc}
          alt={alt}
          width={resolvedWidth}
          height={resolvedHeight}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setIsLoaded(true)}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit,
            transition: 'opacity 0.35s ease',
            opacity: isLoaded || !item?.blurPlaceholder ? 1 : 0
          }}
          {...props}
        />
      </picture>
    </div>
  );
}
