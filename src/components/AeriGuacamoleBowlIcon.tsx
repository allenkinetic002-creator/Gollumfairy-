import React from 'react';

export interface AeriGuacamoleBowlIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  monochrome?: boolean;
}

/**
 * AeriGuacamoleBowlIcon - Ceramic bowl of chunky guacamole with two crispy tortilla chips
 * Inspired by 61f6185e-7107-40ff-8eb6-0569d6090611.jpg.png:
 * Vibrant avocado green guacamole mounds with texture marks, two seasoned golden tortilla chips,
 * and a decorative striped ceramic bowl with sturdy pedestal base.
 */
export const AeriGuacamoleBowlIcon: React.FC<AeriGuacamoleBowlIconProps> = ({
  size = 28,
  monochrome = false,
  className = '',
  ...props
}) => {
  const chipFill = monochrome ? 'none' : '#F7B538';
  const guacFill = monochrome ? 'none' : '#A2D149';
  const bowlRimFill = monochrome ? 'none' : '#C4D4E0';
  const bowlBodyFill = monochrome ? 'none' : '#A4B6C6';
  const bowlBandFill = monochrome ? 'none' : '#6E8396';
  const bowlFootFill = monochrome ? 'none' : '#889CAE';
  const strokeColor = monochrome ? 'currentColor' : '#111111';

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
      {/* 1. Left Tortilla Chip */}
      <polygon
        points="6.2,2.0 13.5,2.6 10.2,10.8"
        fill={chipFill}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Left chip seasoning dots */}
      <rect x="8.5" y="4.2" width="1.1" height="1.1" fill={strokeColor} />
      <rect x="9.8" y="6.4" width="1.1" height="1.1" fill={strokeColor} />

      {/* 2. Right Tortilla Chip */}
      <polygon
        points="20.6,2.6 27.6,5.8 21.8,11.8"
        fill={chipFill}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right chip seasoning dots */}
      <rect x="22.5" y="5.8" width="1.1" height="1.1" fill={strokeColor} />
      <rect x="23.6" y="8.0" width="1.1" height="1.1" fill={strokeColor} />

      {/* 3. Guacamole Mound Contour */}
      <path
        d="
          M 4.5 16.5
          C 4.2 13.5 6.4 11.2 9.0 11.2
          C 9.4 8.5 12.0 7.2 14.5 7.8
          C 16.2 8.2 17.0 9.4 17.5 10.6
          C 18.2 8.6 20.8 7.8 23.0 8.8
          C 25.0 9.6 25.8 11.5 25.5 13.2
          C 26.8 13.5 27.8 14.8 27.5 16.5
          Z
        "
        fill={guacFill}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Guacamole texture markings (crescent curves & bits) */}
      <path
        d="M 11.0 11.6 C 11.0 10.2 13.2 10.2 13.2 11.6"
        stroke={strokeColor}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 7.4 14.2 C 7.4 15.4 9.6 15.4 9.6 14.2"
        stroke={strokeColor}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 17.0 14.8 C 17.0 13.4 19.2 13.4 19.2 14.8"
        stroke={strokeColor}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 20.0 12.0 C 20.0 13.2 22.2 13.2 22.2 12.0"
        stroke={strokeColor}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="12.2" y="13.2" width="1.1" height="1.1" fill={strokeColor} />
      <rect x="23.4" y="14.2" width="1.1" height="1.1" fill={strokeColor} />

      {/* 4. Ceramic Bowl Body */}
      <path
        d="
          M 4.5 19.7
          C 5.0 25.2 8.8 27.4 10.5 27.6
          H 21.5
          C 23.2 27.4 27.0 25.2 27.5 19.7
          Z
        "
        fill={bowlBodyFill}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Bowl decorative dark band stripe */}
      <path
        d="
          M 5.2 21.5
          C 8.5 23.2 23.5 23.2 26.8 21.5
          L 25.2 23.8
          C 22.5 25.0 9.5 25.0 6.8 23.8
          Z
        "
        fill={bowlBandFill}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* 5. Bowl Rim Rectangular Lip */}
      <rect
        x="3.0"
        y="16.5"
        width="26.0"
        height="3.2"
        rx="0.5"
        fill={bowlRimFill}
        stroke={strokeColor}
        strokeWidth="1.5"
      />

      {/* 6. Sturdy Bowl Pedestal Foot */}
      <rect
        x="9.5"
        y="27.6"
        width="13.0"
        height="2.8"
        rx="0.4"
        fill={bowlFootFill}
        stroke={strokeColor}
        strokeWidth="1.5"
      />
    </svg>
  );
};

// Aliases for compatibility
export const AeriGuacBowlIcon = AeriGuacamoleBowlIcon;
export const AeriJuiceBoxIcon = AeriGuacamoleBowlIcon;
export default AeriGuacamoleBowlIcon;
