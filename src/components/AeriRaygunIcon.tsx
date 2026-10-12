import React from 'react';

export interface AeriRaygunIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
  facing?: 'left' | 'right';
}

/**
 * AeriRaygunIcon - Retro atomic sci-fi raygun / space blaster icon
 * Features concentric ribbed emitter rings, bullet chamber with panel divisions,
 * horizontal needle rail, ergonomic finger grip, and trigger guard.
 * Defaults to facing right.
 */
export const AeriRaygunIcon: React.FC<AeriRaygunIconProps> = ({
  size = 24,
  strokeWidth = 1.3,
  facing = 'right',
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 22"
      width={size}
      height={typeof size === 'number' ? (size * 22) / 28 : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      <g transform={facing === 'right' ? 'translate(28, 0) scale(-1, 1)' : undefined}>
        {/* 1. Emitter rings at the front barrel */}
        {/* Small front nozzle tip */}
        <path d="M 2.2 7.0 C 1.4 7.0 1.4 6.2 2.2 6.2 C 2.8 6.2 2.8 7.0 2.2 7.0 Z" />

        {/* 1st small saucer ring */}
        <path d="M 3.2 5.0 C 2.4 5.8 2.4 7.4 3.2 8.2 C 3.8 8.0 4.0 5.2 3.2 5.0 Z" />

        {/* 2nd medium saucer ring */}
        <path d="M 4.8 4.0 C 3.6 5.0 3.6 8.2 4.8 9.2 C 5.6 9.0 5.8 4.2 4.8 4.0 Z" />

        {/* 3rd large flared emitter disc */}
        <path d="M 7.2 3.0 C 5.4 4.5 5.4 9.0 7.2 10.5 C 8.2 10.2 8.5 3.2 7.2 3.0 Z" />

        {/* 2. Top Bullet Chamber & Body Contour */}
        <path
          d="
            M 8.2 3.4
            C 10.8 3.0 14.5 3.0 17.5 3.5
            C 20.2 4.0 22.0 5.2 22.5 6.8
            C 22.8 7.6 22.2 8.5 20.5 9.2
            C 18.5 9.8 17.2 9.5 16.5 11.2
          "
        />

        {/* Horizontal central needle rail extending past the rear */}
        <path d="M 8.0 7.0 L 23.5 7.0" />
        <path d="M 8.0 7.8 L 22.5 7.8" />

        {/* Panel divider lines on top chamber */}
        <line x1="11.2" y1="3.2" x2="11.2" y2="7.0" />
        <line x1="15.2" y1="3.4" x2="15.2" y2="7.0" />

        {/* Rear crescent accent on top dome */}
        <path d="M 18.2 4.8 C 19.2 5.2 19.8 6.0 19.6 6.8" />

        {/* 3. Trigger Guard & Trigger */}
        <path
          d="
            M 8.5 8.8
            C 8.5 11.5 10.2 13.0 12.8 12.8
            C 14.0 12.6 14.5 11.2 14.0 9.8
            C 13.5 8.8 10.5 8.5 8.5 8.8
            Z
          "
        />
        {/* Trigger hook inside guard */}
        <path d="M 10.8 9.5 C 10.8 11.0 11.8 11.2 12.2 11.0" />

        {/* 4. Ergonomic Grip Handle with finger grooves */}
        <path
          d="
            M 12.8 12.8
            C 13.5 13.6 14.2 14.5 13.8 15.5
            C 13.4 16.5 14.5 17.8 14.8 19.0
            C 15.0 20.2 16.8 20.5 18.0 19.6
            C 19.2 18.6 19.2 16.5 18.4 14.2
            C 17.6 12.2 17.2 10.5 18.5 9.4
          "
        />
      </g>
    </svg>
  );
};

export default AeriRaygunIcon;
