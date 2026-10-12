import React from 'react';
import { AeriJuiceBoxIcon, AeriJuiceBoxIconProps } from './AeriJuiceBoxIcon';

export type AeriManLineIconProps = AeriJuiceBoxIconProps;

/**
 * Replaced lined face icon with juice box icon inspired by Untitled-2.png
 */
export const AeriManLineIcon: React.FC<AeriManLineIconProps> = (props) => {
  return <AeriJuiceBoxIcon {...props} />;
};

export default AeriManLineIcon;
