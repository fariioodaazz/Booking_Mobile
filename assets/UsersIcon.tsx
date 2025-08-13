import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export interface UsersIconProps extends SvgProps {
  size?: number;      // Controls width & height together
  color?: string;     // Stroke color
  strokeWidth?: number;
}

const UsersIcon: React.FC<UsersIconProps> = ({
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
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <Path d="M16 3.128a4 4 0 0 1 0 7.744" />
      <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <Circle cx="9" cy="7" r="4" />
    </Svg>
  );
};

export default React.memo(UsersIcon);
