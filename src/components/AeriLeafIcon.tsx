import React from 'react';

export interface AeriLeafIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

/**
 * AeriLeafIcon - Elegant organic botanical leaf icon
 * Replaces the 3rd icon beside the phone icon
 */
export function AeriLeafIcon({
  size = 24,
  strokeWidth = 1.8,
  className = '',
  ...props
}: AeriLeafIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Outer leaf blade contour */}
      <path
        d="M 5.5 18.5 C 5.8 14.5 7.8 9.8 12 5.8 C 15 2.8 18.8 2.2 20.2 2.8 C 20.8 4.2 20.2 8 17.2 11 C 13.2 15.2 8.5 17.2 5.5 18.5 Z"
      />
      {/* Central stem & midrib */}
      <path
        d="M 4 20 L 7 17 C 10.2 13.8 14.8 9.2 19.5 3.5"
      />
      {/* Upper side vein */}
      <path d="M 13 11 C 14.6 11.2 16.8 10.4 18 9" />
      {/* Mid side vein */}
      <path d="M 10.5 13.5 C 12 13.7 14.2 13 15.5 11.5" />
      {/* Lower side vein */}
      <path d="M 8.5 15.5 C 9.2 16.6 10.2 17.4 11.5 17.8" />
      {/* Mid left vein */}
      <path d="M 11 13 C 11.8 14.2 12.8 15.1 14.2 15.3" />
    </svg>
  );
}

export default AeriLeafIcon;
