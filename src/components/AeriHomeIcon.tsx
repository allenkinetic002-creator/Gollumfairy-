import React from 'react';

export interface AeriHomeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
  filled?: boolean;
}

/**
 * AeriHomeIcon - Whimsical fairy cottage / home icon
 * Inspired by fairy 1 option png.png
 */
export const AeriHomeIcon: React.FC<AeriHomeIconProps> = ({
  size = 24,
  strokeWidth = 1.8,
  filled = false,
  className = '',
  ...props
}) => {
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
      {/* Chimney puffing on roof */}
      <path d="M17.5 7V3.8a0.8 0.8 0 0 1 0.8-0.8h1.4a0.8 0.8 0 0 1 0.8 0.8v4.8" />
      
      {/* Curved cottage roof */}
      <path d="M2.5 10.8C2.5 7.2 6.2 3.2 12 3.2s9.5 4 9.5 7.6c0 1.2-1 1.9-2.2 1.9H4.7c-1.2 0-2.2-0.7-2.2-1.9z" />
      
      {/* House walls */}
      <path d="M5 12.7V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6.3" />
      
      {/* Arched front cottage door */}
      <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
      
      {/* Round fairy attic window */}
      <circle cx="12" cy="7.8" r="1.5" />
    </svg>
  );
};
