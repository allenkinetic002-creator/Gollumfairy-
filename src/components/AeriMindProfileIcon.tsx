import React from 'react';

export interface AeriMindProfileIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

/**
 * AeriMindProfileIcon - Minimalist continuous-line mind profile logo
 * Inspired by Screenshot 2026-06-05 072001.png:
 * Profile of a human head with nose/chin, outer cranium arc,
 * inner neural conduit terminating in an eye node dot, central looped knot,
 * and angled neck collar.
 */
export const AeriMindProfileIcon: React.FC<AeriMindProfileIconProps> = ({
  size = 24,
  strokeWidth = 2.1,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 36"
      width={size}
      height={typeof size === 'number' ? (size * 36) / 32 : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      {/* 1. Outer Cranium Crescent (Back of skull arc) */}
      <path
        d="
          M 5.5 21.5
          C 1.8 16.2 1.8 8.8 7.5 3.8
          C 13.5 -0.8 22.0 1.0 26.2 6.5
          C 28.5 10.2 28.5 15.2 27.2 18.5
        "
      />

      {/* 2. Face Profile: Forehead, Nose, Chin, Jawline & Angled Collar */}
      <path
        d="
          M 27.2 18.5
          L 29.8 19.8
          L 26.8 21.2
          C 26.6 23.5 25.2 25.5 22.8 26.2
          C 18.8 27.0 14.0 25.8 5.5 17.5
          L 5.5 24.5
          L 19.5 33.5
          L 20.2 29.5
        "
      />

      {/* 3. Inner Cranium Neural Arc leading to Eye Node */}
      <path
        d="
          M 6.0 22.5
          L 6.0 14.2
          C 6.0 8.0 10.8 4.6 16.5 4.6
          C 21.5 4.6 24.2 8.5 24.2 13.5
        "
      />

      {/* 4. Solid Black Eye Node / Neural Dot */}
      <circle
        cx="24.0"
        cy="15.5"
        r="2.0"
        fill="currentColor"
        stroke="none"
      />

      {/* 5. Central Mind Loop (Brain knot) */}
      <path
        d="
          M 8.2 21.5
          C 12.8 21.5 16.8 19.0 17.5 14.2
          C 18.0 11.2 16.2 8.8 13.2 9.2
          C 10.8 9.6 10.0 12.5 10.8 15.8
          C 11.8 20.0 15.5 24.2 20.8 25.4
        "
      />

      {/* 6. Lower Jaw Connection Stem */}
      <path
        d="M 21.6 25.6 L 22.8 18.8"
      />
    </svg>
  );
};

export default AeriMindProfileIcon;
