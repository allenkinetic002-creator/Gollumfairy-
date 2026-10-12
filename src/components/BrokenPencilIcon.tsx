import React from 'react';

export interface BrokenPencilIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  width?: number | string;
  height?: number | string;
}

/**
 * BrokenPencilIcon - Handcrafted SVG of a yellow No. 2 pencil snapped in half,
 * with sharpened lead tip, faceted hexagonal barrel, jagged splintered break,
 * metal ferrule, pink eraser, and flying wood speckles.
 */
export const BrokenPencilIcon: React.FC<BrokenPencilIconProps> = ({
  size,
  width,
  height,
  className = '',
  ...props
}) => {
  const finalWidth = size || width || (className ? undefined : 240);
  const finalHeight = size || height || (className ? undefined : 80);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 80"
      width={finalWidth}
      height={finalHeight}
      fill="none"
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      <defs>
        {/* Ferrule metallic gradient */}
        <linearGradient id="ferrule-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E5E7EB" />
          <stop offset="35%" stopColor="#D1D5DB" />
          <stop offset="65%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#6B7280" />
        </linearGradient>

        {/* Eraser pink gradient */}
        <linearGradient id="eraser-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="35%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>

      <g>
        {/* ========================================================================= */}
        {/* 1. LEFT PIECE (Lead Tip -> Broken Splintered End) */}
        {/* ========================================================================= */}

        {/* Left Barrel - Top Facet (Light Golden Yellow) */}
        <polygon
          points="56,31 114,43 118,48 53,36"
          fill="#FBBF24"
          stroke="#1F1915"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Left Barrel - Middle Facet (Primary Warm Amber Yellow) */}
        <polygon
          points="53,36 118,48 114,53 52,43"
          fill="#F59E0B"
          stroke="#1F1915"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Left Barrel - Bottom Facet (Dark Shaded Amber) */}
        <polygon
          points="52,43 114,53 111,62 55,50"
          fill="#D97706"
          stroke="#1F1915"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Left Barrel - Jagged Splintered Break End (Wood Core Exposed) */}
        <path
          d="M 114,43 
             L 119,47 
             L 113,50 
             L 122,55 
             L 115,59 
             L 111,62 
             Z"
          fill="#FDE68A"
          stroke="#1F1915"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Left Wood Cone (Carved Tan Wood) */}
        <path
          d="M 33,35 
             L 15,39 
             L 33,43 
             L 55,50 
             C 52,47 51,44 52,43 
             C 53,40 52,38 53,36 
             C 55,34 54,32 56,31 
             Z"
          fill="#FDE68A"
          stroke="#1F1915"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Wood collar scallops and carved grain lines */}
        <path
          d="M 56,31 C 53,33 52,35 53,36 C 51,38 52,41 52,43 C 51,45 53,48 55,50"
          fill="none"
          stroke="#1F1915"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M 38,37 L 50,34"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 38,41 L 49,45"
          fill="none"
          stroke="#B45309"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Sharpened Lead Graphite Point */}
        <polygon
          points="15,39 33,35 33,43"
          fill="#1E293B"
          stroke="#1F1915"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Graphite highlight sheen */}
        <polygon
          points="16,39 32,36 32,38"
          fill="#475569"
          opacity="0.8"
        />

        {/* Facet separator ridge lines on left barrel */}
        <line x1="53" y1="36" x2="118" y2="48" stroke="#1F1915" strokeWidth="1.6" />
        <line x1="52" y1="43" x2="114" y2="53" stroke="#1F1915" strokeWidth="1.6" />

        {/* ========================================================================= */}
        {/* 2. FLYING SPLINTERS / DUST SPECKS IN THE BREAK GAP */}
        {/* ========================================================================= */}
        <circle cx="125" cy="38" r="1.3" fill="#D97706" />
        <circle cx="127" cy="48" r="1.1" fill="#F59E0B" />
        <circle cx="123" cy="56" r="1.4" fill="#D97706" />
        <polygon points="126,50 128,51 127,53 125,52" fill="#FDE68A" stroke="#1F1915" strokeWidth="0.8" />
        <circle cx="130" cy="43" r="1.2" fill="#FDE68A" />

        {/* ========================================================================= */}
        {/* 3. RIGHT PIECE (Broken Splintered End -> Ferrule & Eraser) */}
        {/* ========================================================================= */}

        {/* Right Barrel - Top Facet (Light Golden Yellow) */}
        <polygon
          points="137,55 191,33 194,40 134,61"
          fill="#FBBF24"
          stroke="#1F1915"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Right Barrel - Middle Facet (Primary Warm Amber Yellow) */}
        <polygon
          points="134,61 194,40 197,46 142,66"
          fill="#F59E0B"
          stroke="#1F1915"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Right Barrel - Bottom Facet (Dark Shaded Amber) */}
        <polygon
          points="142,66 197,46 200,53 136,73"
          fill="#D97706"
          stroke="#1F1915"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Right Barrel - Jagged Splintered Break End (Wood Core Exposed) */}
        <path
          d="M 137,55 
             L 133,59 
             L 142,64 
             L 135,68 
             L 143,71 
             L 136,73 
             Z"
          fill="#FDE68A"
          stroke="#1F1915"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Facet separator ridge lines on right barrel */}
        <line x1="134" y1="61" x2="194" y2="40" stroke="#1F1915" strokeWidth="1.6" />
        <line x1="142" y1="66" x2="197" y2="46" stroke="#1F1915" strokeWidth="1.6" />

        {/* Metal Ferrule Band */}
        <polygon
          points="191,33 208,26 217,46 200,53"
          fill="url(#ferrule-grad)"
          stroke="#1F1915"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Ferrule Ribbed Ring Grooves */}
        <line x1="196" y1="31" x2="205" y2="51" stroke="#4B5563" strokeWidth="1.4" opacity="0.85" />
        <line x1="202" y1="28.5" x2="211" y2="48.5" stroke="#4B5563" strokeWidth="1.4" opacity="0.85" />
        <line x1="200" y1="29" x2="209" y2="49" stroke="#F3F4F6" strokeWidth="1.2" opacity="0.9" />

        {/* Pink Rubber Eraser */}
        <path
          d="M 208,26 
             L 221,21 
             C 226,19 229,23 231,27 
             C 233,31 230,37 226,41 
             L 217,46 
             Z"
          fill="url(#eraser-grad)"
          stroke="#1F1915"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Eraser Top Highlight */}
        <path
          d="M 209,26 L 221,22 C 224,21 226,23 227,26"
          fill="none"
          stroke="#FCA5A5"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>
    </svg>
  );
};

export default BrokenPencilIcon;
