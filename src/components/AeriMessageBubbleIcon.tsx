import React from 'react';

export interface AeriMessageBubbleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  color?: string;
}

/**
 * AeriMessageBubbleIcon - Iconic solid chat bubble with 3 squircle cutouts
 * Inspired by Screenshot 2026-02-19 132343.png: Asymmetric chat bubble with
 * straight left tail flank, bulbous top/right curvature, and three horizontal
 * rounded-square typing indicator cutouts.
 */
export const AeriMessageBubbleIcon: React.FC<AeriMessageBubbleIconProps> = ({
  size = 24,
  className = '',
  color,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color || 'currentColor'}
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="
          M 3.6 8.5
          L 3.6 19.2
          C 3.6 20.6 4.6 21.2 5.8 20.4
          C 8.5 19.0 12.8 17.4 16.5 16.2
          C 18.8 15.5 20.4 14.0 20.4 11.8
          L 20.4 8.5
          C 20.4 4.5 16.8 2.2 12.0 2.2
          C 7.2 2.2 3.6 4.5 3.6 8.5
          Z
          M 6.7 8.2
          H 9.3
          C 9.8 8.2 10.2 8.6 10.2 9.1
          V 11.3
          C 10.2 11.8 9.8 12.2 9.3 12.2
          H 6.7
          C 6.2 12.2 5.8 11.8 5.8 11.3
          V 9.1
          C 5.8 8.6 6.2 8.2 6.7 8.2
          Z
          M 10.7 8.2
          H 13.3
          C 13.8 8.2 14.2 8.6 14.2 9.1
          V 11.3
          C 14.2 11.8 13.8 12.2 13.3 12.2
          H 10.7
          C 10.2 12.2 9.8 11.8 9.8 11.3
          V 9.1
          C 9.8 8.6 10.2 8.2 10.7 8.2
          Z
          M 14.7 8.2
          H 17.3
          C 17.8 8.2 18.2 8.6 18.2 9.1
          V 11.3
          C 18.2 11.8 17.8 12.2 17.3 12.2
          H 14.7
          C 14.2 12.2 13.8 11.8 13.8 11.3
          V 9.1
          C 13.8 8.6 14.2 8.2 14.7 8.2
          Z
        "
      />
    </svg>
  );
};

export default AeriMessageBubbleIcon;
