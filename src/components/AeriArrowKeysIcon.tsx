import React from 'react';

export interface AeriArrowKeysIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * AeriArrowKeysIcon - Classic Inverted-T Mechanical Keyboard Arrow Keys
 * Inspired by Screenshot 2026-04-19 024037.png:
 * Up, Left, Down, Right arrow keycaps with 3D beveled skirts,
 * white key faces, and centered directional arrow triangles.
 */
export const AeriArrowKeysIcon: React.FC<AeriArrowKeysIconProps> = ({
  size = 24,
  className = '',
  ...props
}) => {
  // Reusable keycap renderer
  const renderKey = (x: number, y: number, arrowType: 'up' | 'down' | 'left' | 'right') => {
    const w = 9.4;
    const h = 10.8;
    const topInset = 1.0;
    const botInset = 2.0;

    return (
      <g key={arrowType}>
        {/* Outer Keycap Base (Beveled Skirt) */}
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={2.2}
          fill="#D6D9DE"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* Diagonal Bevel Creases at Bottom Corners */}
        <line
          x1={x + 0.6}
          y1={y + h - 0.6}
          x2={x + 1.6}
          y2={y + h - botInset}
          stroke="currentColor"
          strokeWidth="0.9"
        />
        <line
          x1={x + w - 0.6}
          y1={y + h - 0.6}
          x2={x + w - 1.6}
          y2={y + h - botInset}
          stroke="currentColor"
          strokeWidth="0.9"
        />

        {/* Top Keycap Face (White Surface) */}
        <rect
          x={x + 0.8}
          y={y + 0.8}
          width={w - 1.6}
          height={h - botInset}
          rx={1.8}
          fill="#FFFFFF"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* Directional Arrowhead */}
        {arrowType === 'up' && (
          <path
            d={`
              M ${x + w / 2} ${y + 3.4}
              L ${x + w / 2 - 2.0} ${y + 6.4}
              L ${x + w / 2 + 2.0} ${y + 6.4}
              Z
            `}
            fill="currentColor"
          />
        )}
        {arrowType === 'down' && (
          <path
            d={`
              M ${x + w / 2} ${y + 7.2}
              L ${x + w / 2 - 2.0} ${y + 4.2}
              L ${x + w / 2 + 2.0} ${y + 4.2}
              Z
            `}
            fill="currentColor"
          />
        )}
        {arrowType === 'left' && (
          <path
            d={`
              M ${x + 2.7} ${y + 4.9}
              L ${x + 5.7} ${y + 3.0}
              L ${x + 5.7} ${y + 6.8}
              Z
            `}
            fill="currentColor"
          />
        )}
        {arrowType === 'right' && (
          <path
            d={`
              M ${x + w - 2.7} ${y + 4.9}
              L ${x + w - 5.7} ${y + 3.0}
              L ${x + w - 5.7} ${y + 6.8}
              Z
            `}
            fill="currentColor"
          />
        )}
      </g>
    );
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 34 26"
      width={size}
      height={typeof size === 'number' ? (size * 26) / 34 : undefined}
      fill="none"
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      {/* 1. Up Key (Top Row, Center) */}
      {renderKey(12.3, 1.2, 'up')}

      {/* 2. Left Key (Bottom Row, Left) */}
      {renderKey(1.2, 13.8, 'left')}

      {/* 3. Down Key (Bottom Row, Center) */}
      {renderKey(12.3, 13.8, 'down')}

      {/* 4. Right Key (Bottom Row, Right) */}
      {renderKey(23.4, 13.8, 'right')}
    </svg>
  );
};

export default AeriArrowKeysIcon;
