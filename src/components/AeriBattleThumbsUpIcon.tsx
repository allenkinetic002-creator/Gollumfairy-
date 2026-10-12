import React from 'react';

export interface AeriBattleThumbsUpIconProps {
  className?: string;
  size?: number;
  contrastColor?: string; // Contrasting color of the button (e.g. red or blue) so wrist lines are clearly visible
  facing?: 'left' | 'right';
  direction?: 'up' | 'down';
}

/**
 * Thumbs Up Icon with clear line to the wrist (cuff divider and wrist band line).
 * Supports facing='left' | 'right' and direction='up' | 'down'.
 */
export const AeriBattleThumbsUpIcon: React.FC<AeriBattleThumbsUpIconProps> = ({
  className = 'w-3.5 h-3.5',
  size = 14,
  contrastColor = '#E51E2B',
  facing = 'right',
  direction = 'up',
}) => {
  const isLeft = facing === 'left';
  const isDown = direction === 'down';

  let transform: string | undefined = undefined;
  if (isLeft && isDown) {
    transform = 'translate(24, 24) scale(-1, -1)';
  } else if (isLeft) {
    transform = 'translate(24, 0) scale(-1, 1)';
  } else if (isDown) {
    transform = 'translate(0, 24) scale(1, -1)';
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="white"
      stroke="white"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <g transform={transform}>
        {/* Hand & Thumb Silhouette */}
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />

        {/* Main dividing line on the wrist (separates wrist cuff from hand) */}
        <line
          x1="7"
          y1="10.5"
          x2="7"
          y2="21.5"
          stroke={contrastColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Accent crease line in the wrist */}
        <line
          x1="2.8"
          y1="18.2"
          x2="6.5"
          y2="18.2"
          stroke={contrastColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
