import React from 'react';

export interface AeriSlimeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
  filled?: boolean;
}

/**
 * AeriSlimeIcon - Slime figure mopping up ooze
 * Inspired by slime.png: Slouching slime monster holding a mop,
 * with dripping ooze folds, melting feet puddle, mop clamp, and floor splatter.
 */
export function AeriSlimeIcon({
  size = 24,
  strokeWidth = 1.6,
  className = '',
  ...props
}: AeriSlimeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 38"
      width={size}
      height={typeof size === 'number' ? (size * 38) / 32 : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      {/* 1. Main Slime Body Outline (Head, Back, Outer Leg, Foot Puddle, Inner Leg, Chest) */}
      <path
        d="
          M 19.4 12.2
          C 19.5 8.2 17.2 5.2 14.2 5.2
          C 11.8 5.2 9.4 7.2 8.0 10.2
          C 7.0 12.4 6.6 14.5 6.6 16.2
          C 6.4 17.6 7.4 18.2 8.0 17.5
          C 7.2 19.2 7.6 20.8 8.6 20.4
          C 7.8 22.2 8.4 23.8 9.4 23.2
          C 9.2 25.2 8.8 28.0 9.0 30.5
          C 8.5 32.2 6.0 32.8 5.4 33.6
          C 4.8 34.6 5.8 35.4 8.2 35.4
          L 12.8 35.4
          C 14.2 35.4 14.5 34.4 13.6 33.6
          C 12.8 32.6 12.2 29.5 12.5 26.8
          C 12.8 24.8 13.2 23.2 13.6 21.0
          C 13.2 18.8 13.8 16.5 15.2 14.6
          C 15.8 14.2 16.6 14.5 17.0 13.4
          C 17.4 12.2 18.2 12.5 18.4 13.6
          C 18.8 14.4 19.4 14.0 19.4 12.2
          Z
        "
      />

      {/* 2. Forehead 3-Lobed Drip Fold */}
      <path d="M 15.6 7.6 C 15.6 9.4 16.6 9.4 17.0 8.4 C 17.5 9.4 18.5 9.4 18.5 7.6" />

      {/* 3. Back / Spine Dripping Creases */}
      {/* Upper back 'w' drip */}
      <path d="M 11.4 11.8 C 11.4 13.4 12.4 13.4 12.9 12.4 C 13.4 13.4 14.4 13.4 14.4 11.8" />
      {/* Mid back 'w' drip */}
      <path d="M 9.6 15.4 C 9.6 17.0 10.6 17.0 11.1 15.9 C 11.6 17.0 12.6 17.0 12.6 15.4" />
      {/* Lower torso 'w' drip */}
      <path d="M 9.5 18.8 C 9.5 20.4 10.5 20.4 11.0 19.3 C 11.5 20.4 12.5 20.4 12.5 18.8" />

      {/* 4. Dripping Accents on Back Leg */}
      <path d="M 10.8 23.2 C 10.2 24.8 11.4 25.2 11.6 24.0" />
      <path d="M 10.8 27.2 C 10.2 28.8 11.4 29.2 11.6 28.0" />

      {/* 5. Upper Arm & High Hand Gripping Mop Pole */}
      <path
        d="
          M 17.4 12.6
          C 18.2 14.0 19.2 14.8 19.6 16.0
          C 20.2 16.8 19.8 18.2 18.6 18.2
          C 17.8 18.2 17.4 17.2 18.0 16.2
        "
      />

      {/* 6. Lower Arm, Elbow Drip & Low Hand */}
      <path
        d="
          M 14.6 17.2
          C 14.2 19.2 15.2 21.0 16.6 20.4
          C 17.4 20.0 18.6 20.6 19.8 20.2
          C 20.5 20.0 20.8 18.8 19.6 18.5
        "
      />

      {/* 7. Mop Pole / Handle */}
      <path d="M 18.6 14.6 L 22.4 28.2" />

      {/* 8. Angled Mop Head Bracket / Clamp */}
      <path
        d="
          M 21.0 27.0
          L 23.2 26.2
          L 24.6 30.6
          L 22.4 31.4
          Z
        "
      />

      {/* 9. Mop Head Rag / Dripping Slime Puddle Being Mopped */}
      <path
        d="
          M 21.0 28.8
          C 19.4 29.8 18.8 31.4 19.4 32.8
          C 18.8 33.8 19.6 35.4 21.0 35.6
          C 22.8 35.8 25.4 35.6 26.4 34.6
          C 27.0 33.4 25.8 32.0 24.6 31.2
        "
      />

      {/* 10. Floor Splatter & Background Puddle Droplets */}
      {/* Dash under left foot */}
      <line x1="6.4" y1="32.0" x2="7.6" y2="32.0" />
      {/* Background puddle in the middle */}
      <path d="M 13.0 30.2 C 14.0 29.6 15.6 29.6 16.2 30.6 C 15.6 31.4 13.8 31.4 13.0 30.2 Z" />
      {/* Zigzag drip splash on ground between feet and mop */}
      <path d="M 14.6 34.8 H 16.2 L 15.4 35.8 H 17.2" />
    </svg>
  );
}

export default AeriSlimeIcon;
