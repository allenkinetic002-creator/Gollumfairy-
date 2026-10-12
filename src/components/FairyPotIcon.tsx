import React from 'react';

export interface FairyPotIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

/**
 * FairyPotIcon - Honey / Potion Pot with dripping liquid icon
 * Inspired by the fairy potion honey jar illustration with arched lid and liquid drip.
 */
export function FairyPotIcon({
  size = 24,
  strokeWidth = 2,
  className = '',
  ...props
}: FairyPotIconProps) {
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
      {/* Lid: Top Knob + Arched Cap */}
      <path
        d="
          M 4.6 8
          C 4.6 6.3 7.5 5.3 10.6 5.3
          C 10 3.9 10.4 2.2 12 2.2
          C 13.6 2.2 14 3.9 13.4 5.3
          C 16.5 5.3 19.4 6.3 19.4 8
          C 19.4 8.7 18.8 9 17.8 9
          L 6.2 9
          C 5.2 9 4.6 8.7 4.6 8
          Z
        "
      />

      {/* Pot Body: Collar Ears + Rounded Belly + Base + Dripping Honey / Potion */}
      <path
        d="
          M 5.4 11.2
          C 4 12 3.8 13.2 5 14.2
          C 3.4 17.2 4.4 21.8 6.8 21.8
          L 17.2 21.8
          C 19.6 21.8 20.6 17.2 19 14.2
          C 20.2 13.2 20 12 18.6 11.2
          C 16.6 11.2 15.6 12 15.2 14
          C 14.6 16.2 15.2 18 14 19
          C 13 19.7 11.8 19.2 11.5 18
          C 11 15.6 12.6 13.4 11.6 12
          C 10.5 11.2 7.8 11.2 5.4 11.2
          Z
        "
      />
    </svg>
  );
}

export default FairyPotIcon;
