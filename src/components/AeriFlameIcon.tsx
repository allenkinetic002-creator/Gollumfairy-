import React from 'react';

export interface AeriFlameIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
  filled?: boolean;
}

/**
 * AeriFlameIcon - Stylized dynamic fire flame icon
 * Replaces the generic Flame icon
 */
export function AeriFlameIcon({
  size = 24,
  strokeWidth = 1.8,
  filled = false,
  className = '',
  ...props
}: AeriFlameIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Outer flame silhouette */}
      <path
        d="M 12 2 C 12 2 13.8 4.6 13.4 6.8 C 15 5.5 16.8 6.2 17.3 7.8 C 18.2 10.2 17.1 12.3 18.3 13.8 C 19.6 15.5 19.3 18 17.8 19.7 C 16.4 21.2 14.4 22 12 22 C 8.5 22 5.5 19.5 5.5 16 C 5.5 12.5 7.5 10.3 9.6 8.2 C 10.6 7.2 11.2 5.2 12 2 Z"
      />
      {/* Inner flame droplet / core */}
      <path
        d="M 12 12.8 C 13.3 14 14 15.4 13.6 17 C 13.2 18.2 12.2 19 11.2 19 C 9.9 19 9.1 17.9 9.4 16.5 C 9.7 14.8 11 13.8 12 12.8 Z"
        fill={filled ? '#FFFFFF' : 'currentColor'}
        fillOpacity={filled ? 0.88 : 0.28}
        stroke={filled ? '#FFFFFF' : 'currentColor'}
        strokeWidth={1.3}
      />
    </svg>
  );
}

export default AeriFlameIcon;
