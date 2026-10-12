import React from 'react';

export interface AeriBellIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
  active?: boolean;
}

/**
 * AeriBellIcon (Notification Icon)
 * The vibrant orange flame character with warm golden-amber inner heart,
 * two floating spark embers, crisp dark outline, and cute squinting (> <) expression.
 */
export const AeriBellIcon: React.FC<AeriBellIconProps> = ({
  size = 24,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 34"
      width={size}
      height={typeof size === 'number' ? (size * 34) / 32 : undefined}
      fill="none"
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      {/* 1. Top Floating Ember */}
      <circle
        cx="17.0"
        cy="4.0"
        r="1.7"
        fill="#FF6D00"
        stroke="#1A2038"
        strokeWidth="1.1"
      />

      {/* 2. Upper-Left Tilted Ember */}
      <g transform="translate(6.6, 9.2) rotate(-22)">
        <ellipse
          cx="0"
          cy="0"
          rx="1.4"
          ry="2.1"
          fill="#FF6D00"
          stroke="#1A2038"
          strokeWidth="1.1"
        />
      </g>

      {/* 3. Main Outer Orange Flame Body */}
      <path
        d="
          M 6.8 29.5
          C 12.0 30.2 20.0 30.2 25.2 29.5
          C 27.6 29.2 29.0 27.2 28.8 24.2
          C 28.5 19.5 27.2 15.2 24.5 10.8
          C 23.2 8.8 21.0 9.2 19.8 11.8
          C 18.5 13.5 17.5 12.8 16.5 9.8
          C 15.2 5.8 13.2 6.5 11.2 10.5
          C 9.8 13.2 8.5 14.0 7.2 14.8
          C 4.2 16.8 2.8 20.5 3.2 24.5
          C 3.5 27.5 4.8 29.2 6.8 29.5
          Z
        "
        fill="#FF6D00"
        stroke="#1A2038"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* 4. Warm Golden-Amber Inner Glow */}
      <path
        d="
          M 7.2 28.6
          C 12.0 29.2 19.0 29.2 23.5 28.6
          C 24.0 24.5 22.0 20.2 18.5 17.0
          C 16.0 14.8 14.0 15.5 13.5 17.5
          C 11.2 19.0 8.0 22.0 7.2 28.6
          Z
        "
        fill="#FFA000"
      />

      {/* 5. Closed Squinting (> <) Anime Eyes */}
      {/* Left Eye (>) */}
      <path
        d="M 10.6 19.2 L 14.4 21.8 L 9.6 21.8"
        fill="none"
        stroke="#1A2038"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Eye (<) */}
      <path
        d="M 20.4 19.2 L 16.6 21.8 L 21.4 21.8"
        fill="none"
        stroke="#1A2038"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const AeriNotificationIcon = AeriBellIcon;
export default AeriBellIcon;
