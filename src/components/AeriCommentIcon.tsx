import React from 'react';

export interface AeriCommentIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
  filled?: boolean;
}

/**
 * AeriCommentIcon - Stylized speech/comment bubble icon
 * Inspired by icon fairyi png.jpg
 */
export const AeriCommentIcon: React.FC<AeriCommentIconProps> = ({
  size = 24,
  strokeWidth = 1.8,
  filled = false,
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
      {/* Speech bubble contour with friendly tail */}
      <path d="M7.8 19.3L3.6 20.9a0.85 0.85 0 0 1-1.15-0.96l0.9-4.2C2.4 14.2 1.8 12.4 1.8 10.5 1.8 5.7 6.4 1.8 12 1.8s10.2 3.9 10.2 8.7c0 4.8-4.6 8.7-10.2 8.7a11.3 11.3 0 0 1-4.2-0.8z" />
      
      {/* Three gentle dialogue dots */}
      <circle cx="8" cy="10.5" r="1" fill={filled ? '#ffffff' : 'currentColor'} stroke="none" />
      <circle cx="12" cy="10.5" r="1" fill={filled ? '#ffffff' : 'currentColor'} stroke="none" />
      <circle cx="16" cy="10.5" r="1" fill={filled ? '#ffffff' : 'currentColor'} stroke="none" />
    </svg>
  );
};
