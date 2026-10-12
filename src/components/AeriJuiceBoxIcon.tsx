import React from 'react';
import { AeriGuacamoleBowlIcon, AeriGuacamoleBowlIconProps } from './AeriGuacamoleBowlIcon';

export type AeriJuiceBoxIconProps = AeriGuacamoleBowlIconProps;

/**
 * Replaced juice box icon with guacamole bowl icon inspired by 61f6185e-7107-40ff-8eb6-0569d6090611.jpg.png
 */
export const AeriJuiceBoxIcon: React.FC<AeriJuiceBoxIconProps> = (props) => {
  return <AeriGuacamoleBowlIcon {...props} />;
};

export default AeriJuiceBoxIcon;
