import React from 'react';

export interface AeriPhoneIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
  filled?: boolean;
}

/**
 * AeriPhoneIcon - Classic retro telephone icon
 * Inspired by i1 png.jpg
 */
export const AeriPhoneIcon: React.FC<AeriPhoneIconProps> = ({
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
      {/* Handset receiver at the top */}
      <path d="M4 4.5c0-1.1 2.2-2 8-2s8 0.9 8 2c0 1.2-1.8 1.8-3.2 2-0.8 0.1-1.6-0.3-2.1-1h-5.4c-0.5 0.7-1.3 1.1-2.1 1C5.8 6.3 4 5.7 4 4.5z" />
      
      {/* Telephone body / cradle base */}
      <path d="M7 6v2c0 0.8-0.6 1.5-1.4 1.7C4.1 10 3 11.4 3 13.5v4c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4v-4c0-2.1-1.1-3.5-2.6-3.8C17.6 9.5 17 8.8 17 8V6" />
      
      {/* Rotary dial / button center */}
      <circle cx="12" cy="15.5" r="3.2" />
      {/* Dial dots */}
      <circle cx="12" cy="13.8" r="0.65" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="14.8" r="0.65" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="16.5" r="0.65" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17.2" r="0.65" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="16.5" r="0.65" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="14.8" r="0.65" fill="currentColor" stroke="none" />
    </svg>
  );
};
