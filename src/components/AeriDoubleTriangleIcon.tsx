import React from 'react';

export interface AeriDoubleTriangleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * AeriDoubleTriangleIcon - Two overlapping rounded triangular message wings / send icon
 * Inspired by 910d5217-801a-482b-8551-c84da404a5aeh.png:
 * Back rounded triangle in solid black offset to top-right;
 * Front rounded triangle in solid grey offset to bottom-left with a crisp white separation border.
 */
export const AeriDoubleTriangleIcon: React.FC<AeriDoubleTriangleIconProps> = ({
  size = 24,
  className = '',
  ...props
}) => {
  // Base rounded triangle path centered at origin
  // Path for triangle: Top edge, right edge, left edge with smooth rounded corners
  const trianglePath = `
    M 9.5 12.0
    L 18.2 10.8
    C 20.4 10.5 21.6 12.0 20.6 14.0
    L 15.8 23.4
    C 14.8 25.4 12.8 25.4 11.8 23.4
    L 7.2 14.0
    C 6.2 12.0 7.4 10.5 9.5 12.0
    Z
  `;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      {/* 1. Back Triangle (Solid Black, offset to top-right) */}
      <path
        d="
          M 15.2 6.4
          L 24.2 5.2
          C 26.5 4.9 27.8 6.5 26.8 8.6
          L 21.8 18.2
          C 20.8 20.2 18.8 20.2 17.8 18.2
          L 12.8 8.6
          C 11.8 6.5 13.0 4.9 15.2 6.4
          Z
        "
        fill="#000000"
      />

      {/* 2. White Knockout Separation Border for Front Triangle */}
      <path
        d="
          M 9.2 12.2
          L 18.2 11.0
          C 20.5 10.7 21.8 12.3 20.8 14.4
          L 15.8 24.0
          C 14.8 26.0 12.8 26.0 11.8 24.0
          L 6.8 14.4
          C 5.8 12.3 7.0 10.7 9.2 12.2
          Z
        "
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* 3. Front Triangle (Solid Grey, offset to bottom-left) */}
      <path
        d="
          M 9.2 12.2
          L 18.2 11.0
          C 20.5 10.7 21.8 12.3 20.8 14.4
          L 15.8 24.0
          C 14.8 26.0 12.8 26.0 11.8 24.0
          L 6.8 14.4
          C 5.8 12.3 7.0 10.7 9.2 12.2
          Z
        "
        fill="#7F8287"
      />
    </svg>
  );
};

export default AeriDoubleTriangleIcon;
