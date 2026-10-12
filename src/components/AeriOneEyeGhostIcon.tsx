import React from 'react';

export interface AeriOneEyeGhostIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

/**
 * AeriOneEyeGhostIcon - Cute one-eyed smiling ghost / speech-bubble mascot icon
 * Inspired by image.png: rounded ghost head with single solid oval eye,
 * open crescent smile, and playful bottom-right tail.
 */
export const AeriOneEyeGhostIcon: React.FC<AeriOneEyeGhostIconProps> = ({
  size = 24,
  strokeWidth = 2,
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
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      {/* Outer rounded ghost head with bottom-right tail */}
      <path
        d="
          M 16.8 18.8
          C 18.2 19.8 19.6 20.8 20.2 20.4
          C 20.8 20.0 20.4 18.4 19.8 16.8
          C 21.0 14.8 21.4 12.5 20.8 10.2
          C 19.8 6.2 16.2 3.0 12.0 3.0
          C 7.0 3.0 3.0 7.0 3.0 12.0
          C 3.0 17.0 7.0 21.0 12.0 21.0
          C 13.8 21.0 15.4 20.2 16.8 18.8
          Z
        "
        fill={fill ?? 'none'}
      />

      {/* Single large solid black oval eye on the left */}
      <ellipse
        cx="8.2"
        cy="9.8"
        rx="2.1"
        ry="3.2"
        fill="currentColor"
        stroke="none"
      />

      {/* Cheerful open crescent smile */}
      <path
        d="
          M 6.4 14.4
          Q 9.8 16.8 14.0 14.4
          Q 10.0 18.8 6.4 14.4
          Z
        "
        strokeWidth={Math.max(1.4, Number(strokeWidth) * 0.85)}
      />
    </svg>
  );
};

export const AeriGhostIcon = AeriOneEyeGhostIcon;
export default AeriOneEyeGhostIcon;
