import React from 'react';

export interface AeriOneEyeHatGuyIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * AeriOneEyeHatGuyIcon - Fedora silhouette character with one striking red eye
 * Inspired by unnamed (26).jpg: Creased hat crown, pointed brim, spiky cheek contours,
 * and single expressive eye with white sclera, vibrant red iris, and black pupil.
 */
export const AeriOneEyeHatGuyIcon: React.FC<AeriOneEyeHatGuyIconProps> = ({
  size = 32,
  className = '',
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
      {/* Solid black silhouette of the hat guy */}
      <path
        d="
          M 11.5 6.0
          L 8.0 3.2
          L 4.5 11.2
          L 1.2 12.8
          L 4.2 13.8
          L 2.4 15.5
          L 5.2 17.5
          L 3.2 20.0
          C 6.5 22.8 17.5 22.8 20.8 20.0
          L 18.8 17.5
          L 21.6 15.5
          L 19.8 13.8
          L 22.8 12.8
          L 19.5 11.2
          L 16.0 3.2
          Z
        "
        fill="currentColor"
      />

      {/* Large white eye with centered black pupil inspired by 701f3f23-167a-426a-940d-61599e15a6f7.png */}
      <circle
        cx="8.8"
        cy="13.4"
        r="2.8"
        fill="#FFFFFF"
        stroke="none"
      />

      {/* Solid black pupil in the center */}
      <circle
        cx="8.8"
        cy="13.4"
        r="1.25"
        fill="#000000"
        stroke="none"
      />
    </svg>
  );
};

export default AeriOneEyeHatGuyIcon;
