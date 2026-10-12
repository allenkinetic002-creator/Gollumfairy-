import React from 'react';
import { AeriMaskedEyesIcon, AeriMaskedEyesIconProps } from './AeriMaskedEyesIcon';

export type AeriFrogIconProps = AeriMaskedEyesIconProps;

/**
 * Replaced frog face icon with masked two eyes icon inspired by eyes.png
 */
export const AeriFrogIcon: React.FC<AeriFrogIconProps> = (props) => {
  return <AeriMaskedEyesIcon {...props} />;
};

export const AeriIcon = AeriFrogIcon;
export { AeriMaskedEyesIcon };
export { AeriHandPhoneIcon } from './AeriHandPhoneIcon';
export default AeriFrogIcon;
