import React from 'react';

export interface AeriHorseIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

/**
 * AeriHorseIcon - Stylized standing horse silhouette outline
 * Faithfully matches the uploaded illustration (first file.jpg):
 * - Monoline continuous black outline of a standing horse facing right
 * - Distinct alert ear at the poll and angled forehead with rounded snout & chin
 * - Throat indentation and proudly curved chest
 * - Four standing legs with rounded U-shaped hooves at ground plane
 * - Front inner leg standing slightly back with curved upper boundary
 * - Long arched tail hanging down to mid-flank with rounded U-turn bottom
 * - Smooth sway back with gentle withers and arched neck crest
 */
export const AeriHorseIcon: React.FC<AeriHorseIconProps> = ({
  size = 24,
  strokeWidth = 2.4,
  className = '',
  fill = '#FFFFFF',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
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
      {/* 1. Main Continuous Body Outline (Spine, Head, Chest, Front Outer Leg, Belly, Rear Legs, Tail) */}
      <path
        d="
          M 4.0 28.4
          L 4.2 21.0
          C 4.4 18.2 6.8 16.8 10.0 16.8
          C 13.5 16.8 16.5 17.6 20.0 17.6
          C 23.5 17.6 25.5 16.5 27.5 16.5
          C 30.5 13.2 33.2 9.6 36.2 7.4
          C 37.2 5.8 38.0 3.8 38.8 4.2
          C 39.6 4.8 38.6 7.2 37.8 8.6
          C 39.4 10.2 41.6 11.8 43.4 13.2
          C 44.8 14.4 44.6 15.8 43.2 16.6
          C 41.5 17.5 38.6 16.5 36.8 14.8
          C 35.6 15.6 35.4 17.8 35.5 20.0
          C 35.8 23.0 37.0 25.8 36.6 28.2
          C 36.2 30.2 34.6 31.4 33.2 31.8
          L 33.2 41.4
          C 33.2 43.4 30.0 43.4 30.0 41.4
          L 30.0 32.4
          C 25.5 33.8 20.5 34.2 16.0 33.6
          L 16.0 41.4
          C 16.0 43.4 12.8 43.4 12.8 41.4
          L 12.8 34.6
          C 12.8 32.8 11.0 32.8 11.0 34.6
          L 11.0 41.4
          C 11.0 43.4 7.8 43.4 7.8 41.4
          L 7.8 22.0
          C 7.8 20.5 7.2 20.5 7.2 22.0
          L 7.2 28.4
          C 7.2 30.4 4.0 30.4 4.0 28.4
          Z
        "
        fill={fill}
      />

      {/* 2. Inner Front Leg with Arched Top Boundary */}
      <path
        d="
          M 25.2 35.0
          C 26.2 35.7 27.4 35.7 28.4 35.0
          L 28.4 41.4
          C 28.4 43.4 25.2 43.4 25.2 41.4
          Z
        "
        fill={fill}
      />
    </svg>
  );
};

export default AeriHorseIcon;
