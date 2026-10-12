import React from 'react';

export interface AeriHydrantIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * AeriHydrantIcon - Classic red fire hydrant icon
 * Inspired by ripit2.png: Isometric 3D fire hydrant with vibrant red body,
 * bold black linework, operating dome nut, bolted upper flange, side nozzles,
 * prominent forward pumper nozzle, slotted base skirt, and bolted ground flange.
 */
export const AeriHydrantIcon: React.FC<AeriHydrantIconProps> = ({
  size = 28,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 70"
      width={size}
      height={typeof size === 'number' ? (size * 70) / 52 : undefined}
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      <defs>
        {/* Soft shadow & highlights */}
        <linearGradient id="hydrantRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF2A32" />
          <stop offset="55%" stopColor="#E51920" />
          <stop offset="100%" stopColor="#C91016" />
        </linearGradient>
        <linearGradient id="hydrantDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B30E14" />
          <stop offset="100%" stopColor="#8C080D" />
        </linearGradient>
      </defs>

      {/* ======================================================== */}
      {/* 1. BOTTOM BASE GROUND FLANGE & RIM                      */}
      {/* ======================================================== */}
      {/* Lowest Ground Base Plate */}
      <path
        d="
          M 10.5 54.0
          C 10.5 64.5 41.5 64.5 41.5 54.0
          L 41.5 57.5
          C 41.5 68.0 10.5 68.0 10.5 57.5
          Z
        "
        fill="#8C080D"
        stroke="#000000"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="
          M 10.5 57.5
          C 10.5 68.0 41.5 68.0 41.5 57.5
        "
        fill="none"
        stroke="#000000"
        strokeWidth="2.2"
      />

      {/* Base Stepped Collar */}
      <path
        d="
          M 11.5 51.5
          C 11.5 44.5 40.5 44.5 40.5 51.5
          L 41.5 55.0
          C 41.5 65.5 10.5 65.5 10.5 55.0
          Z
        "
        fill="url(#hydrantRed)"
        stroke="#000000"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Bottom Flange Upper Rim Line */}
      <path
        d="
          M 11.8 51.5
          C 11.8 61.5 40.2 61.5 40.2 51.5
        "
        fill="none"
        stroke="#000000"
        strokeWidth="1.8"
      />

      {/* Base Flange Bolts (hexagonal bolt heads along lower flange) */}
      {[
        { cx: 15.0, cy: 52.0 },
        { cx: 16.5, cy: 56.5 },
        { cx: 22.0, cy: 59.2 },
        { cx: 30.0, cy: 59.2 },
        { cx: 35.5, cy: 56.5 },
        { cx: 37.0, cy: 52.0 },
      ].map((b, i) => (
        <g key={`b-bolt-${i}`}>
          <polygon
            points={`
              ${b.cx - 1.6},${b.cy - 1.0}
              ${b.cx},${b.cy - 1.8}
              ${b.cx + 1.6},${b.cy - 1.0}
              ${b.cx + 1.6},${b.cy + 1.0}
              ${b.cx},${b.cy + 1.8}
              ${b.cx - 1.6},${b.cy + 1.0}
            `}
            fill="#FF4A50"
            stroke="#000000"
            strokeWidth="1.4"
          />
          <polygon
            points={`
              ${b.cx - 1.0},${b.cy - 0.7}
              ${b.cx},${b.cy - 1.3}
              ${b.cx + 1.0},${b.cy - 0.7}
              ${b.cx + 1.0},${b.cy + 0.7}
              ${b.cx},${b.cy + 1.3}
              ${b.cx - 1.0},${b.cy + 0.7}
            `}
            fill="#E51920"
          />
        </g>
      ))}

      {/* ======================================================== */}
      {/* 2. TAPERED BASE SKIRT & CAPSULE SLOTS                    */}
      {/* ======================================================== */}
      <path
        d="
          M 16.0 42.5
          L 13.5 50.5
          C 16.0 55.5 36.0 55.5 38.5 50.5
          L 36.0 42.5
          Z
        "
        fill="url(#hydrantRed)"
        stroke="#000000"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* 3 Vertical Oval / Capsule Slots on Base */}
      {[
        { x: 18.0, y: 44.5, w: 2.8, h: 6.2 },
        { x: 24.2, y: 45.2, w: 3.2, h: 6.6 },
        { x: 30.8, y: 44.5, w: 2.8, h: 6.2 },
      ].map((slot, i) => (
        <rect
          key={`slot-${i}`}
          x={slot.x}
          y={slot.y}
          width={slot.w}
          height={slot.h}
          rx="1.4"
          fill="#000000"
          stroke="#8C080D"
          strokeWidth="0.8"
        />
      ))}

      {/* Lower Barrel Collar Rings */}
      <path
        d="
          M 15.5 41.0
          C 15.5 45.5 36.5 45.5 36.5 41.0
          L 36.5 43.5
          C 36.5 48.0 15.5 48.0 15.5 43.5
          Z
        "
        fill="#8C080D"
        stroke="#000000"
        strokeWidth="2.0"
        strokeLinejoin="round"
      />

      {/* ======================================================== */}
      {/* 3. MAIN CYLINDRICAL BARREL                              */}
      {/* ======================================================== */}
      <path
        d="
          M 16.8 24.5
          L 16.8 41.5
          C 20.0 44.2 32.0 44.2 35.2 41.5
          L 35.2 24.5
          Z
        "
        fill="url(#hydrantRed)"
        stroke="#000000"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Left side barrel shadow contour */}
      <path
        d="
          M 16.8 24.5
          L 16.8 41.5
          C 18.2 42.5 19.5 42.8 20.5 42.6
          L 20.5 25.2
          Z
        "
        fill="#B30E14"
        opacity="0.6"
      />

      {/* ======================================================== */}
      {/* 4. LEFT SIDE NOZZLE                                     */}
      {/* ======================================================== */}
      {/* Base flange ring */}
      <path
        d="
          M 16.8 26.2
          C 14.8 26.0 14.8 33.5 16.8 33.2
          Z
        "
        fill="#B30E14"
        stroke="#000000"
        strokeWidth="2.0"
      />
      {/* Nozzle Neck */}
      <path
        d="
          M 15.2 27.0
          L 12.2 27.2
          L 12.2 32.2
          L 15.2 32.5
          Z
        "
        fill="url(#hydrantRed)"
        stroke="#000000"
        strokeWidth="1.8"
      />
      {/* Fluted / Ridged Cap */}
      <path
        d="
          M 12.2 26.0
          L 10.0 26.2
          L 9.6 27.5
          L 9.2 28.5
          L 9.2 31.0
          L 9.8 32.2
          L 12.2 33.5
          Z
        "
        fill="url(#hydrantRed)"
        stroke="#000000"
        strokeWidth="2.0"
        strokeLinejoin="round"
      />
      {/* Left Cap Grooves / Ridges */}
      <line x1="12.0" y1="27.5" x2="9.8" y2="27.5" stroke="#000000" strokeWidth="1.6" />
      <line x1="12.0" y1="29.5" x2="9.2" y2="29.5" stroke="#000000" strokeWidth="1.6" />
      <line x1="12.0" y1="31.5" x2="9.8" y2="31.5" stroke="#000000" strokeWidth="1.6" />
      {/* Left End Center Nut */}
      <rect
        x="7.6"
        y="28.4"
        width="2.0"
        height="2.6"
        rx="0.6"
        fill="#FF2A32"
        stroke="#000000"
        strokeWidth="1.5"
      />

      {/* ======================================================== */}
      {/* 5. RIGHT SIDE NOZZLE                                    */}
      {/* ======================================================== */}
      <path
        d="
          M 34.5 26.5
          C 37.0 26.2 37.5 32.5 34.8 32.8
          Z
        "
        fill="#B30E14"
        stroke="#000000"
        strokeWidth="2.0"
      />
      <path
        d="
          M 36.0 27.2
          L 39.5 28.0
          L 39.0 32.2
          L 35.8 31.8
          Z
        "
        fill="url(#hydrantRed)"
        stroke="#000000"
        strokeWidth="1.8"
      />
      <path
        d="
          M 39.2 28.0
          L 41.5 29.0
          L 41.0 31.5
          L 38.8 32.0
          Z
        "
        fill="#FF2A32"
        stroke="#000000"
        strokeWidth="1.8"
      />

      {/* ======================================================== */}
      {/* 6. FRONT PUMPER NOZZLE (LARGE STEPPED FORWARD NOZZLE)   */}
      {/* ======================================================== */}
      {/* Base collar mounting ring */}
      <path
        d="
          M 23.5 29.5
          C 22.5 37.5 30.5 44.5 37.0 38.5
          L 34.5 27.0
          Z
        "
        fill="#8C080D"
        opacity="0.4"
      />
      
      {/* Outward Ring 1 (Rear stepped collar) */}
      <ellipse
        cx="29.0"
        cy="33.5"
        rx="7.8"
        ry="8.2"
        fill="#B30E14"
        stroke="#000000"
        strokeWidth="2.2"
      />
      {/* Outward Ring 2 (Middle thick ring) */}
      <ellipse
        cx="30.5"
        cy="33.8"
        rx="7.0"
        ry="7.6"
        fill="url(#hydrantRed)"
        stroke="#000000"
        strokeWidth="2.2"
      />
      {/* Ring 3 (Outer lip rim) */}
      <ellipse
        cx="31.8"
        cy="34.0"
        rx="6.0"
        ry="6.6"
        fill="#FF2A32"
        stroke="#000000"
        strokeWidth="2.0"
      />
      {/* Ring 4 (Recessed inner cap face) */}
      <ellipse
        cx="32.5"
        cy="34.2"
        rx="4.8"
        ry="5.4"
        fill="url(#hydrantRed)"
        stroke="#000000"
        strokeWidth="1.8"
      />
      {/* Concentric inner grooved circle */}
      <ellipse
        cx="33.0"
        cy="34.4"
        rx="3.4"
        ry="3.8"
        fill="#B30E14"
        stroke="#000000"
        strokeWidth="1.6"
      />
      {/* Center Nut on Front Nozzle */}
      <polygon
        points="
          32.0,33.0
          33.6,32.2
          35.2,33.2
          35.0,35.2
          33.4,36.0
          31.8,35.0
        "
        fill="#FF4A50"
        stroke="#000000"
        strokeWidth="1.6"
      />

      {/* ======================================================== */}
      {/* 7. UPPER BONNET FLANGE & COLLAR                         */}
      {/* ======================================================== */}
      {/* Under-flange shadow lip */}
      <path
        d="
          M 14.5 21.0
          C 14.5 27.5 37.5 27.5 37.5 21.0
          L 37.5 24.0
          C 37.5 30.5 14.5 30.5 14.5 24.0
          Z
        "
        fill="#8C080D"
        stroke="#000000"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Upper Flange Ring Main Body */}
      <path
        d="
          M 14.0 18.5
          C 14.0 12.5 38.0 12.5 38.0 18.5
          L 38.0 22.5
          C 38.0 28.5 14.0 28.5 14.0 22.5
          Z
        "
        fill="url(#hydrantRed)"
        stroke="#000000"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Flange Upper Rim Line */}
      <path
        d="
          M 14.2 18.8
          C 14.2 25.5 37.8 25.5 37.8 18.8
        "
        fill="none"
        stroke="#000000"
        strokeWidth="1.8"
      />

      {/* Flange Hexagonal Bolts Around Perimeter */}
      {[
        { cx: 16.0, cy: 16.2 },
        { cx: 17.5, cy: 20.0 },
        { cx: 21.5, cy: 22.4 },
        { cx: 26.5, cy: 23.2 },
        { cx: 31.5, cy: 22.0 },
        { cx: 34.5, cy: 19.5 },
        { cx: 35.8, cy: 16.0 },
      ].map((b, i) => (
        <g key={`t-bolt-${i}`}>
          <polygon
            points={`
              ${b.cx - 1.4},${b.cy - 0.9}
              ${b.cx},${b.cy - 1.6}
              ${b.cx + 1.4},${b.cy - 0.9}
              ${b.cx + 1.4},${b.cy + 0.9}
              ${b.cx},${b.cy + 1.6}
              ${b.cx - 1.4},${b.cy + 0.9}
            `}
            fill="#FF4A50"
            stroke="#000000"
            strokeWidth="1.4"
          />
        </g>
      ))}

      {/* ======================================================== */}
      {/* 8. TOP DOME BONNET & OPERATING NUT                      */}
      {/* ======================================================== */}
      {/* Dome Bonnet Cap */}
      <path
        d="
          M 18.5 17.5
          C 18.5 7.5 33.5 7.5 33.5 17.5
          C 30.5 19.5 21.5 19.5 18.5 17.5
          Z
        "
        fill="url(#hydrantRed)"
        stroke="#000000"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Dome Top Cap Step */}
      <ellipse
        cx="26.0"
        cy="9.6"
        rx="5.2"
        ry="2.6"
        fill="#FF2A32"
        stroke="#000000"
        strokeWidth="1.8"
      />

      {/* Top Operating Nut (Pentagon/Hexagon in 3D perspective) */}
      <g>
        {/* Top Facet */}
        <polygon
          points="
            26.0,5.0
            28.4,6.2
            26.0,7.6
            23.6,6.2
          "
          fill="#FF6066"
          stroke="#000000"
          strokeWidth="1.6"
        />
        {/* Front Left Facet */}
        <polygon
          points="
            23.6,6.2
            26.0,7.6
            26.0,10.0
            23.6,8.5
          "
          fill="#E51920"
          stroke="#000000"
          strokeWidth="1.6"
        />
        {/* Front Right Facet */}
        <polygon
          points="
            26.0,7.6
            28.4,6.2
            28.4,8.5
            26.0,10.0
          "
          fill="#B30E14"
          stroke="#000000"
          strokeWidth="1.6"
        />
      </g>
    </svg>
  );
};

export default AeriHydrantIcon;
