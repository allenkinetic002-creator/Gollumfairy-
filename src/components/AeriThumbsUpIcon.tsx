import React from 'react';

export interface AeriThumbsUpIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
  filled?: boolean;
}

/**
 * AeriThumbsUpIcon - Bold cartoon thumbs-up hand icon
 * Inspired by image.png:
 * Prominent upright thumb with backward curve, horizontal wrist,
 * rounded 4-finger curled fist on the right with vertical inner fold line
 * and distinct knuckle dividers, and bold graphic comic linework.
 */
export const AeriThumbsUpIcon: React.FC<AeriThumbsUpIconProps> = ({
  size = 24,
  strokeWidth = 2.2,
  filled = false,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
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
      {/* Hand Outer Silhouette (Filled with White / Clear) */}
      <path
        d="
          M 4.2 14.0
          L 8.8 14.0
          C 9.2 12.0 10.2 8.5 11.8 6.0
          C 13.2 3.8 14.8 2.2 16.8 2.2
          C 18.8 2.2 20.2 3.8 20.2 6.5
          C 20.2 9.0 19.5 10.8 18.2 12.0
          L 23.2 12.0
          C 25.4 12.0 26.8 13.2 26.6 15.0
          C 26.5 16.0 25.8 16.8 24.8 17.2
          C 26.6 17.5 27.5 18.8 27.2 20.4
          C 27.0 21.6 26.0 22.4 24.8 22.6
          C 26.4 23.0 27.0 24.4 26.5 25.8
          C 26.0 27.0 24.8 27.6 23.5 27.8
          C 24.8 28.2 25.0 29.4 24.4 30.4
          C 23.5 31.5 21.8 31.4 19.5 30.8
          C 15.2 29.8 11.2 27.0 8.5 21.5
          L 4.2 21.5
          C 3.2 21.5 2.5 20.8 2.5 19.5
          L 2.5 16.0
          C 2.5 14.8 3.2 14.0 4.2 14.0
          Z
        "
        fill={filled ? 'currentColor' : '#FFFFFF'}
      />

      {/* Vertical inner fold line where curled fingers meet the palm */}
      <path d="M 18.2 12.0 C 17.0 15.8 17.0 25.5 18.8 29.5" />

      {/* Thumb crotch / thenar crease on the thumb mound */}
      <path d="M 18.2 12.0 C 15.5 13.8 13.8 16.5 14.2 19.5" />

      {/* Knuckle Divider 1 (between Index and Middle finger) */}
      <path d="M 17.5 17.2 L 24.8 17.2" />

      {/* Knuckle Divider 2 (between Middle and Ring finger) */}
      <path d="M 17.6 22.6 L 24.8 22.6" />

      {/* Knuckle Divider 3 (between Ring and Pinky finger) */}
      <path d="M 18.0 27.4 L 23.5 27.4" />
    </svg>
  );
};

export default AeriThumbsUpIcon;
