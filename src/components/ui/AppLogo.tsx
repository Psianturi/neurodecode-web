'use client';

import React, { memo, useEffect, useMemo, useState } from 'react';
import AppIcon from './AppIcon';
import AppImage from './AppImage';

interface AppLogoProps {
  src?: string; // Image source (optional)
  text?: string; // Logo text (optional)
  iconName?: string; // Icon name when no image
  size?: number; // Size for icon/image
  className?: string; // Additional classes
  onClick?: () => void; // Click handler
}

const AppLogo = memo(function AppLogo({
  src = '/assets/images/app_logo.png',
  text,
  iconName = 'SparklesIcon',
  size = 64,
  className = '',
  onClick,
}: AppLogoProps) {
  const [resolvedSrc, setResolvedSrc] = useState(src);

  useEffect(() => {
    let cancelled = false;

    const shouldMakeTransparent =
      typeof src === 'string' && (src.endsWith('/app_logo.png') || src.endsWith('app_logo.png'));

    if (!shouldMakeTransparent) {
      setResolvedSrc(src);
      return () => {
        cancelled = true;
      };
    }

    const image = new Image();
    image.src = src;

    image.onload = () => {
      if (cancelled) return;

      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setResolvedSrc(src);
        return;
      }

      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Remove near-white pixels so logo follows page background in dark mode.
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > 245 && g > 245 && b > 245) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setResolvedSrc(canvas.toDataURL('image/png'));
    };

    image.onerror = () => {
      if (!cancelled) setResolvedSrc(src);
    };

    return () => {
      cancelled = true;
    };
  }, [src]);

  // Memoize className calculation
  const containerClassName = useMemo(() => {
    const classes = ['flex items-center gap-2'];
    if (onClick) classes.push('cursor-pointer hover:opacity-80 transition-opacity');
    if (className) classes.push(className);
    return classes.join(' ');
  }, [onClick, className]);

  return (
    <div className={containerClassName} onClick={onClick}>
      {/* Show image if src provided, otherwise show icon */}
      {src ? (
        <AppImage
          src={resolvedSrc}
          alt="Logo"
          width={size}
          height={size}
          className="flex-shrink-0"
          priority={true}
          unoptimized={src.endsWith('.svg')}
        />
      ) : (
        <AppIcon name={iconName} size={size} className="flex-shrink-0" />
      )}

      {/* Show text if provided */}
      {text && <span className="text-xl font-bold">{text}</span>}
    </div>
  );
});

export default AppLogo;
