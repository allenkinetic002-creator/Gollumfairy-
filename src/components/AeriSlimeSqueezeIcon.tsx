import React from 'react';

export interface AeriSlimeSqueezeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * AeriSlimeSqueezeIcon
 * Stylized cartoon fist squeezing bright lime green slime with dripping ooze.
 * Ultra-faithful SVG vector rendition of the FAIRY brand logo mascot.
 */
export function AeriSlimeSqueezeIcon({
  size = 28,
  className = '',
  ...props
}: AeriSlimeSqueezeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 480 540"
      width={size}
      height={typeof size === 'number' ? (size * 540) / 480 : size}
      fill="none"
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
      {...props}
    >
      <defs>
        {/* Skin gradient tones */}
        <linearGradient id="fairySkinBase" x1="0%" y1="0%" x2="80%" y2="80%">
          <stop offset="0%" stopColor="#FFE5C8" />
          <stop offset="35%" stopColor="#FED2A4" />
          <stop offset="75%" stopColor="#F8BC7B" />
          <stop offset="100%" stopColor="#EAA063" />
        </linearGradient>

        {/* Slime gradient tones */}
        <linearGradient id="fairySlimeGrad" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#AFEF48" />
          <stop offset="30%" stopColor="#8EE435" />
          <stop offset="75%" stopColor="#78CE22" />
          <stop offset="100%" stopColor="#62AE17" />
        </linearGradient>
      </defs>

      <g stroke="#000000" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round">
        
        {/* 1. TOP SLIME BLOB (emerging above fist) */}
        <path
          d="
            M 298 78
            C 290 60 312 44 336 50
            C 356 55 368 70 384 64
            C 406 55 422 70 422 96
            C 422 116 408 126 388 130
            C 345 130 312 110 298 78
            Z
          "
          fill="url(#fairySlimeGrad)"
        />
        {/* Top Slime Highlight Lobe */}
        <path
          d="
            M 334 58
            C 352 64 366 74 384 70
            C 402 65 414 76 414 94
          "
          fill="none"
          stroke="#B5F458"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 2. FINGERS (curled on the right side) */}
        
        {/* Index Finger (top knuckle behind thumb) */}
        <path
          d="
            M 386 128
            C 410 126 430 142 430 166
            C 430 184 416 198 386 200
            L 340 200
          "
          fill="url(#fairySkinBase)"
        />

        {/* Middle Finger (curled segment) */}
        <path
          d="
            M 390 228
            C 424 234 432 260 424 286
            C 418 302 392 312 340 312
            L 272 312
          "
          fill="url(#fairySkinBase)"
        />
        {/* Middle Finger Crease Slit */}
        <path
          d="M 338 268 C 340 280 341 292 342 302"
          fill="none"
          stroke="#000000"
          strokeWidth="11"
        />

        {/* Bottom Finger (ring/pinky segment) */}
        <path
          d="
            M 385 318
            C 416 330 416 358 404 378
            C 390 400 345 406 280 408
            C 230 408 218 388 218 370
          "
          fill="url(#fairySkinBase)"
        />
        {/* Bottom Finger Crease Slit */}
        <path
          d="M 336 352 C 337 364 338 376 340 385"
          fill="none"
          stroke="#000000"
          strokeWidth="11"
        />

        {/* 3. HAND BACK, HEEL OF PALM & THUMB */}
        <path
          d="
            M 218 390
            C 185 388 150 366 120 354
            C 92 332 72 290 64 252
            C 56 214 72 170 98 132
            C 134 80 174 58 206 58
            C 242 58 286 78 320 114
            C 346 142 348 178 344 210
            C 338 230 320 236 296 232
            C 288 206 292 164 274 142
            C 256 120 230 114 230 114
          "
          fill="url(#fairySkinBase)"
        />

        {/* Palm Wrinkles / Creases on heel */}
        <path
          d="M 104 290 C 102 304 103 320 107 332"
          fill="none"
          stroke="#000000"
          strokeWidth="9"
        />
        <path
          d="M 124 286 C 122 302 123 318 128 332"
          fill="none"
          stroke="#000000"
          strokeWidth="9"
        />

        {/* Inner Thumb Muscular Crease */}
        <path
          d="M 235 114 C 250 130 268 150 278 170"
          fill="none"
          stroke="#000000"
          strokeWidth="11"
        />

        {/* 4. HORIZONTAL SLIME RIBBONS (oozing across knuckles) */}
        
        {/* Upper Slime Ribbon (between index and middle finger) */}
        <path
          d="
            M 264 212
            C 290 206 380 194 440 194
            C 446 212 432 232 410 232
            C 392 232 370 252 344 260
            C 322 252 306 262 286 260
            C 264 246 256 224 264 212
            Z
          "
          fill="url(#fairySlimeGrad)"
        />
        {/* Highlight on upper ribbon */}
        <path
          d="M 276 215 C 314 206 376 200 426 200"
          fill="none"
          stroke="#B5F458"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Lower Slime Ribbon (between middle and bottom finger) */}
        <path
          d="
            M 258 298
            C 290 294 372 284 410 290
            C 416 306 398 320 382 322
            C 362 346 334 340 314 330
            C 294 340 274 338 258 318
            Z
          "
          fill="url(#fairySlimeGrad)"
        />
        {/* Highlight on lower ribbon */}
        <path
          d="M 268 300 C 298 296 354 290 398 294"
          fill="none"
          stroke="#B5F458"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* 5. MAIN VERTICAL SLIME MASS & BOTTOM DRIP */}
        <path
          d="
            M 248 144
            C 228 174 214 220 210 256
            C 192 268 176 294 176 320
            C 176 342 198 352 218 334
            C 226 372 224 408 226 430
            C 234 444 252 440 256 458
            C 258 480 254 502 266 518
            C 278 520 288 512 292 496
            C 294 472 286 450 288 422
            C 304 412 300 386 296 358
            C 284 306 278 236 278 198
            C 278 164 268 148 248 144
            Z
          "
          fill="url(#fairySlimeGrad)"
        />

        {/* Highlight streak along the dripping ooze */}
        <path
          d="
            M 218 244
            C 214 274 216 312 224 346
            C 228 384 230 422 238 444
            C 244 462 248 482 254 502
          "
          fill="none"
          stroke="#C5F868"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Secondary small drop bubble accent near left contour */}
        <path
          d="M 184 316 C 182 328 184 336 188 340"
          fill="none"
          stroke="#B5F458"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export default AeriSlimeSqueezeIcon;
