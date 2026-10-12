import React from 'react';

export interface AeriProfileUserIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

/**
 * AeriProfileUserIcon - Stylized cartoon profile avatar bust icon
 * Inspired by Screenshot 2026-04-05 151456.png:
 * Bold circular head, rounded white shoulders with scooped collar,
 * vertical arm separation slits, and thick curved crescent bottom base.
 */
export const AeriProfileUserIcon: React.FC<AeriProfileUserIconProps> = ({
  size = 24,
  strokeWidth = 2.4,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      {/* 1. Torso Base Body (White Fill with Bold Black Outline) */}
      <path
        d="
          M 11.2 17.4
          C 7.2 18.8 3.5 21.5 3.0 25.0
          C 2.6 27.8 7.5 29.5 16.0 29.5
          C 24.5 29.5 29.4 27.8 29.0 25.0
          C 28.5 21.5 24.8 18.8 20.8 17.4
          C 18.5 18.2 13.5 18.2 11.2 17.4
          Z
        "
        fill="#FFFFFF"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />

      {/* 2. Curved Crescent Solid Black Bottom Base Rim */}
      <path
        d="
          M 3.8 25.2
          C 7.5 27.8 12.0 28.6 16.0 28.6
          C 20.0 28.6 24.5 27.8 28.2 25.2
          C 28.8 26.6 25.5 29.5 16.0 29.5
          C 6.5 29.5 3.2 26.6 3.8 25.2
          Z
        "
        fill="currentColor"
      />

      {/* 3. Left Arm Separation Slit */}
      <path
        d="M 6.8 25.2 C 6.5 23.5 6.8 21.8 7.4 20.2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* 4. Right Arm Separation Slit */}
      <path
        d="M 25.2 25.2 C 25.5 23.5 25.2 21.8 24.6 20.2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* 5. Circular Head (White Fill with Bold Black Ring) */}
      <circle
        cx="16.0"
        cy="9.5"
        r="6.2"
        fill="#FFFFFF"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default AeriProfileUserIcon;
