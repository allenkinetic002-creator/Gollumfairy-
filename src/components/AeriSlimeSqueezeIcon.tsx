import React from 'react';
import fairyIconImg from '../assets/images/fairy_icon.png';

export interface AeriSlimeSqueezeIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number | string;
  className?: string;
}

/**
 * AeriSlimeSqueezeIcon / FairyIcon
 * Authentic hand squeezing slime brand icon from user's assets.
 */
export function AeriSlimeSqueezeIcon({
  size = 30,
  className = '',
  alt = 'Fairy Icon',
  style,
  ...props
}: AeriSlimeSqueezeIconProps) {
  const width = typeof size === 'number' ? `${size}px` : size;
  const height = typeof size === 'number' ? `${size * 1.12}px` : size;

  return (
    <img
      src={fairyIconImg}
      alt={alt}
      width={typeof size === 'number' ? size : undefined}
      height={typeof size === 'number' ? Math.round(size * 1.12) : undefined}
      className={`object-contain select-none pointer-events-auto shrink-0 ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      draggable={false}
      {...props}
    />
  );
}

export const FairyIcon = AeriSlimeSqueezeIcon;
export default AeriSlimeSqueezeIcon;
