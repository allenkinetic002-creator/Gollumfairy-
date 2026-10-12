import React from 'react';

export interface AeriMonoblocChairIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * AeriMonoblocChairIcon - Iconic solid plastic garden chair silhouette
 * Inspired by Screenshot 2026-03-10 052207.png:
 * Solid silhouette with arched backrest, oval handle cutout, 4 vertical ventilation slats,
 * contoured armrest with negative-space cutouts, and 4 tapered legs.
 */
export const AeriMonoblocChairIcon: React.FC<AeriMonoblocChairIconProps> = ({
  size = 24,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      {/* 1. Main Chair Solid Body Silhouette */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="
          M 11.2 5.2
          C 8.2 5.2 6.5 7.2 6.5 9.5
          C 6.5 11.5 7.8 14.5 8.2 16.2
          L 7.8 24.8
          C 7.8 25.5 8.4 26.0 9.2 26.0
          C 10.0 26.0 10.4 25.4 10.5 24.8
          L 11.2 17.5
          C 11.8 17.2 13.0 17.0 14.0 17.2
          L 13.5 25.5
          C 13.5 26.5 14.2 27.0 15.0 27.0
          C 15.8 27.0 16.5 26.2 16.5 25.2
          L 17.2 17.8
          C 18.5 17.6 21.0 17.5 22.8 17.2
          L 24.2 26.2
          C 24.4 27.0 25.2 27.2 25.8 26.8
          C 26.2 26.5 26.2 25.8 26.0 25.0
          L 24.8 15.8
          C 24.6 13.8 24.2 12.0 23.2 11.2
          C 21.8 10.5 19.5 10.5 17.5 10.2
          C 15.5 8.8 14.5 5.2 11.2 5.2
          Z

          M 9.6 6.8
          C 10.5 6.8 11.2 7.2 11.2 7.8
          C 11.2 8.5 10.5 8.8 9.6 8.8
          C 8.8 8.8 8.2 8.5 8.2 7.8
          C 8.2 7.2 8.8 6.8 9.6 6.8
          Z

          M 8.8 10.0
          H 9.6
          C 9.8 10.0 10.0 10.2 10.0 10.5
          L 10.4 14.5
          C 10.4 14.8 10.2 15.0 10.0 15.0
          H 9.2
          C 9.0 15.0 8.8 14.8 8.8 14.5
          L 8.5 10.5
          C 8.5 10.2 8.6 10.0 8.8 10.0
          Z

          M 10.5 9.8
          H 11.3
          C 11.5 9.8 11.7 10.0 11.7 10.3
          L 11.9 14.7
          C 11.9 15.0 11.7 15.2 11.5 15.2
          H 10.7
          C 10.5 15.2 10.3 15.0 10.3 14.7
          L 10.2 10.3
          C 10.2 10.0 10.3 9.8 10.5 9.8
          Z

          M 12.2 9.8
          H 13.0
          C 13.2 9.8 13.4 10.0 13.4 10.3
          L 13.5 14.8
          C 13.5 15.1 13.3 15.3 13.1 15.3
          H 12.3
          C 12.1 15.3 11.9 15.1 11.9 14.8
          L 11.9 10.3
          C 11.9 10.0 12.0 9.8 12.2 9.8
          Z

          M 13.9 10.2
          H 14.7
          C 14.9 10.2 15.1 10.4 15.1 10.7
          L 15.0 15.0
          C 15.0 15.3 14.8 15.5 14.6 15.5
          H 13.8
          C 13.6 15.5 13.4 15.3 13.4 15.0
          L 13.6 10.7
          C 13.6 10.4 13.7 10.2 13.9 10.2
          Z

          M 14.5 12.2
          C 16.5 12.2 18.0 12.5 18.8 13.2
          C 19.2 13.8 19.0 15.5 18.5 16.0
          C 17.0 16.2 15.0 16.0 14.0 15.5
          C 13.5 14.5 13.8 12.5 14.5 12.2
          Z

          M 19.8 12.8
          C 21.0 12.8 22.2 13.5 22.4 14.5
          C 22.5 15.5 22.0 16.0 20.8 16.2
          C 20.0 16.2 19.5 15.5 19.5 14.2
          C 19.5 13.5 19.6 13.0 19.8 12.8
          Z
        "
      />

      {/* 2. Far Rear Leg Slit / Strip (Perspective depth) */}
      <path
        d="M 25.5 16.8 L 26.8 25.8 C 26.9 26.4 27.2 26.4 27.5 25.8 L 26.4 16.5 Z"
      />
    </svg>
  );
};

export default AeriMonoblocChairIcon;
