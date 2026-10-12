import React from 'react';

export interface AeriDiggingDogIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
  filled?: boolean;
}

/**
 * AeriDiggingDogIcon - Playful digging puppy icon
 * Inspired by baaaedf1-1133-4bbf-9fe6-512d4d136a33.jpg.png:
 * Cute puppy digging down into a hole with hindquarters in the air, wagging tail,
 * sturdy back leg and paw, and ground burrow oval.
 */
export const AeriDiggingDogIcon: React.FC<AeriDiggingDogIconProps> = ({
  size = 24,
  strokeWidth = 1.8,
  filled = false,
  className = '',
  fill,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      {/* Ground hole / burrow oval */}
      <ellipse
        cx="7.5"
        cy="19.2"
        rx="5.5"
        ry="1.8"
        fill="currentColor"
        fillOpacity={0.22}
        stroke="none"
      />

      {/* Solid white body underlay */}
      <path
        d="
          M 7.2 20.0
          L 13.8 10.8
          C 14.8 9.2 15.0 6.6 15.6 4.8
          C 15.8 4.0 16.4 3.5 17.0 3.8
          C 17.6 4.2 17.8 5.6 17.8 7.4
          C 17.8 9.4 17.6 11.2 17.5 12.0
          C 18.6 13.4 19.2 15.2 18.8 17.2
          C 18.6 18.2 19.0 19.0 18.8 20.4
          C 18.8 21.2 16.8 21.2 16.8 20.4
          V 19.2
          C 16.8 18.0 15.6 15.4 15.2 15.6
          C 14.8 16.2 15.2 18.2 14.0 20.0
          Z
        "
        fill={fill && fill !== 'none' ? fill : filled ? 'currentColor' : 'white'}
      />

      {/* Bold expressive outline */}
      <path
        d="
          M 7.2 20.0
          L 13.8 10.8
          C 14.8 9.2 15.0 6.6 15.6 4.8
          C 15.8 4.0 16.4 3.5 17.0 3.8
          C 17.6 4.2 17.8 5.6 17.8 7.4
          C 17.8 9.4 17.6 11.2 17.5 12.0
          C 18.6 13.4 19.2 15.2 18.8 17.2
          C 18.6 18.2 19.0 19.0 18.8 20.4
          C 18.8 21.2 16.8 21.2 16.8 20.4
          V 19.2
          C 16.8 18.0 15.6 15.4 15.2 15.6
          C 14.8 16.2 15.2 18.2 14.0 20.0
        "
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Aliases for compatibility
export const AeriDogIcon = AeriDiggingDogIcon;
export const AeriHorseIcon = AeriDiggingDogIcon;
export const AeriClawIcon = AeriDiggingDogIcon;
export default AeriDiggingDogIcon;
