import React from 'react';

export interface AeriSearchIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

/**
 * AeriSearchIcon - Chunky, bold magnifying glass search icon
 * Inspired by Screenshot 2026-02-19 132252.png:
 * Prominent circular lens with heavy bold stroke and stout rounded 45-degree handle.
 */
export const AeriSearchIcon: React.FC<AeriSearchIconProps> = ({
  size = 24,
  strokeWidth = 3.4,
  className = '',
  ...props
}) => {
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
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      {/* Bold Circular Lens */}
      <circle cx="10.5" cy="10.5" r="6.8" />
      {/* Stout 45° Rounded Handle */}
      <path d="M 15.4 15.4 L 19.8 19.8" />
    </svg>
  );
};

export default AeriSearchIcon;
