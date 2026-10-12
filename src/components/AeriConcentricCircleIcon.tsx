import React from 'react';

export interface AeriConcentricCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * AeriConcentricCircleIcon - Concentric ring circle icon with solid black core
 * Inspired by Screenshot 2026-03-14 114918.png:
 * Bold outer black circular ring, white concentric gap, and solid black center disc.
 */
export const AeriConcentricCircleIcon: React.FC<AeriConcentricCircleIconProps> = ({
  size = 28,
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
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      {/* Outer bold black circular ring */}
      <circle
        cx="12"
        cy="12"
        r="9.5"
        stroke="currentColor"
        strokeWidth="2.1"
      />
      {/* Inner solid black circular core */}
      <circle
        cx="12"
        cy="12"
        r="6.5"
        fill="currentColor"
      />
    </svg>
  );
};

export default AeriConcentricCircleIcon;
