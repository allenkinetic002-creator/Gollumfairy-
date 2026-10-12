import React from 'react';

export interface AeriToyGunIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
  filled?: boolean;
  facing?: 'left' | 'right';
}

/**
 * AeriToyGunIcon - Playful toy squirt gun / blaster icon
 * Defaults to facing right.
 */
export const AeriToyGunIcon: React.FC<AeriToyGunIconProps> = ({
  size = 24,
  strokeWidth = 1.8,
  filled = false,
  facing = 'right',
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <g transform={facing === 'right' ? 'translate(24, 0) scale(-1, 1)' : undefined}>
        {/* Front water nozzle */}
        <path d="M2 9.5h3" />
        
        {/* Main toy blaster body and handle */}
        <path d="M5 8h11.5a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H9.2l-2.2 7a1.5 1.5 0 0 1-1.4 1H3.6a1 1 0 0 1-1-1.3L4.8 12H5V8z" />
        
        {/* Top water tank / reservoir cartridge */}
        <path d="M11 5.5a2.5 2.5 0 0 1 5 0v2.5h-5V5.5z" />
        
        {/* Trigger & trigger guard */}
        <path d="M9.2 13.5v2.2a2 2 0 0 0 2 2h1.2" />
        
        {/* Cute body screw / accent dot */}
        <circle cx="7.2" cy="10" r="0.8" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
};
