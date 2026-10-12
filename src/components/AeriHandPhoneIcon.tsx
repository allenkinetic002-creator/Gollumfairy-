import React from 'react';

export interface AeriHandPhoneIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

/**
 * AeriHandPhoneIcon - Hand holding smartphone icon
 * Inspired by icon fairyi png.jpg: bold outline of a smartphone held in hand with rounded corners,
 * speaker notch, extended grip finger, and stylized wrist contour.
 */
export const AeriHandPhoneIcon: React.FC<AeriHandPhoneIconProps> = ({
  size = 24,
  strokeWidth = 1.8,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
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
      {/* Top speaker notch on smartphone */}
      <rect
        x="13"
        y="3"
        width="4.4"
        height="1.4"
        rx="0.7"
        fill="currentColor"
        stroke="none"
      />

      {/* Smartphone outer shell */}
      <path
        d="
          M 9.2 10.2
          V 4.2
          C 9.2 3.1 10.1 2.2 11.2 2.2
          H 19.2
          C 20.3 2.2 21.2 3.1 21.2 4.2
          V 17.5
          C 21.2 18.6 20.3 19.5 19.2 19.5
          H 11.8
        "
      />

      {/* Extended thumb / grip finger pointing diagonally up-right */}
      <path
        d="
          M 3.6 14.2
          L 8.4 9.4
          C 9.2 8.6 10.6 8.8 11.2 9.8
          C 11.6 10.5 11.4 11.5 10.6 12.1
          L 7.2 14.6
        "
      />

      {/* Lower finger gripping the phone side bezel */}
      <path
        d="
          M 7.2 14.6
          C 8.2 15
          9.4 15.4 10.2 16.4
          C 10.7 17.1 10.4 18.1 9.6 18.5
          L 8.4 19
        "
      />

      {/* Outer curve of palm and heel of hand */}
      <path
        d="
          M 3.6 14.2
          C 2.2 15.8 2 18.2 3.4 19.8
        "
      />

      {/* Stylized wrist contour arc at the bottom */}
      <path
        d="
          M 11.4 19.8
          C 10.2 22 7.2 22.8 4.6 21.2
        "
      />
    </svg>
  );
};

// Compatibility aliases
export const AeriSmartphoneIcon = AeriHandPhoneIcon;
export default AeriHandPhoneIcon;
