import React from 'react';
import { AeriHorseIcon, AeriHorseIconProps } from './AeriHorseIcon';

export type AeriClawIconProps = AeriHorseIconProps;

/**
 * Replaced claw icon with horse icon inspired by first file2...1.png
 */
export const AeriClawIcon: React.FC<AeriClawIconProps> = (props) => {
  return <AeriHorseIcon {...props} />;
};

export default AeriClawIcon;
