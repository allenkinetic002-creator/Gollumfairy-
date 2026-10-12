import React from 'react';

export interface AeriStackedChairsIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

/**
 * AeriStackedChairsIcon - Stack of white plastic monobloc patio/lawn chairs
 * Inspired by Screenshot 2026-03-25 015702.png:
 * Characteristic curved backrest with vertical ventilation slats, looped armrests,
 * stacked nested seat frames, and stepped interlocking chair legs.
 */
export const AeriStackedChairsIcon: React.FC<AeriStackedChairsIconProps> = ({
  size = 24,
  strokeWidth = 2,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 48"
      width={size}
      height={typeof size === 'number' ? (size * 48) / 32 : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      {/* 1. Stacked Backrest Rims Behind (2nd & 3rd chairs) */}
      {/* 3rd Chair Outer Back Rim */}
      <path d="M 23.5 10.2 C 26.5 12.8 28.5 17.0 28.5 21.0 C 27.5 24.5 25.5 26.5 24.0 27.5" />
      {/* 2nd Chair Outer Back Rim */}
      <path d="M 21.5 7.8 C 24.8 10.5 26.8 14.8 26.5 18.8 C 25.5 22.0 23.5 24.0 21.8 25.0" />

      {/* 2. Top Chair Main Backrest Outer Contour */}
      <path
        d="
          M 9.5 7.5
          C 12.0 2.8 19.5 2.5 24.0 7.0
          C 26.5 9.8 26.5 14.2 24.2 18.0
          C 22.8 20.2 20.5 21.5 18.5 21.8
        "
      />

      {/* 3. Top Chair Backrest Vertical Slats */}
      <path d="M 13.5 6.5 L 14.2 15.5" />
      <path d="M 16.5 5.5 L 17.0 15.2" />
      <path d="M 19.5 5.8 L 19.8 14.8" />
      <path d="M 22.2 7.2 L 22.0 13.8" />

      {/* 4. Left Armrest & Side Rim of Top Chair */}
      <path
        d="
          M 11.0 9.0
          C 7.5 10.5 5.0 12.8 4.2 16.0
          C 3.5 19.0 4.2 21.5 5.5 23.2
        "
      />
      {/* Inner left armrest cutout / scoop */}
      <path
        d="
          M 7.5 15.5
          C 9.0 13.2 12.0 12.5 13.5 14.8
          C 14.2 16.5 13.0 18.5 10.2 18.8
          Z
        "
      />

      {/* 5. Right Armrest looping forward and down to front-right leg */}
      <path
        d="
          M 23.0 12.5
          C 21.5 16.0 21.2 20.5 21.5 26.0
          L 22.2 36.0
        "
      />

      {/* 6. Front Seat Skirt of Top Chair */}
      <path
        d="
          M 5.5 23.2
          C 8.0 22.2 16.5 22.8 21.5 24.2
        "
      />

      {/* 7. Front Seat Skirt of 2nd Chair (Stacked under) */}
      <path
        d="
          M 5.8 27.2
          C 9.0 26.0 17.0 26.8 21.0 28.2
        "
      />

      {/* 8. Front Seat Skirt of 3rd Chair (Stacked under) */}
      <path
        d="
          M 6.2 31.8
          C 9.5 30.5 16.8 31.2 20.5 32.8
        "
      />

      {/* 9. Front-Left Leg with 3 Stacked Notches / Steps */}
      <path
        d="
          M 5.2 23.0
          L 4.5 30.5
          C 4.2 31.5 3.2 32.2 3.2 33.5
          L 3.0 37.0
          C 2.8 38.0 2.2 38.8 2.2 40.2
          L 2.5 44.0
          C 2.8 45.2 4.5 45.5 5.2 44.2
          L 6.2 33.0
          L 6.8 23.5
        "
      />
      {/* Left leg notch dividing horizontal marks */}
      <path d="M 3.2 34.0 L 5.8 33.2" />
      <path d="M 2.4 40.5 L 5.2 39.8" />

      {/* 10. Front-Right Leg with Faceted Stacked Notches */}
      <path
        d="
          M 21.5 26.0
          L 22.2 35.8
          C 22.5 37.0 22.0 37.8 22.0 39.5
          L 22.5 45.0
          C 23.0 46.2 25.8 46.2 26.2 44.5
          L 25.5 35.0
          L 24.5 27.5
        "
      />
      {/* Triangular / faceted steps on front right leg */}
      <path d="M 22.0 36.5 L 24.0 35.2 L 25.5 36.8" />
      <path d="M 22.2 40.8 L 24.2 39.5 L 25.8 41.2" />

      {/* 11. Center Rear Leg visible underneath */}
      <path d="M 12.8 32.5 L 12.8 39.0 C 12.8 40.0 14.2 40.0 14.5 39.0 L 14.8 33.0" />

      {/* 12. Stacked Rear Right Legs */}
      <path d="M 25.0 24.5 L 27.0 35.0 L 28.5 42.0" />
      <path d="M 26.8 26.5 L 28.5 34.5 L 30.0 40.5" />
    </svg>
  );
};

export default AeriStackedChairsIcon;
