import React from 'react';

export interface AeriMaskedEyesIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * AeriMaskedEyesIcon - Panoramic mask with twin expressive white eyes
 * Inspired by eyes.png: Stretched horizontal mask with enhanced vertical presence,
 * spacious eye apertures, and sideways-gazing circular pupils.
 */
export const AeriMaskedEyesIcon: React.FC<AeriMaskedEyesIconProps> = ({
  size = 32,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 22"
      width={size}
      height={typeof size === 'number' ? (size * 22) / 32 : undefined}
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      {/* Horizontal black mask shape with increased height */}
      <path
        d="
          M 10.0 1.0
          H 31.0
          V 11.0
          C 31.0 17.0 27.8 21.0 22.0 21.0
          H 10.0
          C 4.2 21.0 1.0 17.0 1.0 11.0
          C 1.0 5.0 4.2 1.0 10.0 1.0
          Z
        "
        fill="currentColor"
      />

      {/* Twin white eye apertures (figure-8 / goggles cutout) */}
      <circle cx="11.4" cy="11.0" r="5.8" fill="#FFFFFF" />
      <circle cx="20.6" cy="11.0" r="5.8" fill="#FFFFFF" />

      {/* Left black pupil looking sideways */}
      <circle cx="9.2" cy="11.0" r="2.9" fill="currentColor" />

      {/* Right black pupil looking sideways */}
      <circle cx="18.4" cy="11.0" r="2.9" fill="currentColor" />
    </svg>
  );
};

export const AeriFrogIcon = AeriMaskedEyesIcon;
export default AeriMaskedEyesIcon;
