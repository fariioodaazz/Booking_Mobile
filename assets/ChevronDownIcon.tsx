import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export interface ChevronDownIconProps extends SvgProps {
  size?: number;      // controls width & height together
  color?: string;     // stroke color
  strokeWidth?: number;
}

const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({
  size,
  color,
  strokeWidth = 2,
  ...props
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Path d="m6 9 6 6 6-6" />
    </Svg>
  );
};

export default React.memo(ChevronDownIcon);
