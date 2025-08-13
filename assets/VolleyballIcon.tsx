import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export interface VolleyballIconProps extends SvgProps {
  size?: number;      // Controls width & height together
  color?: string;     // Stroke color
  strokeWidth?: number;
}

const VolleyballIcon: React.FC<VolleyballIconProps> = ({
  size = 24,
  color = 'currentColor',
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
      <Path d="M11.1 7.1a16.55 16.55 0 0 1 10.9 4" />
      <Path d="M12 12a12.6 12.6 0 0 1-8.7 5" />
      <Path d="M16.8 13.6a16.55 16.55 0 0 1-9 7.5" />
      <Path d="M20.7 17a12.8 12.8 0 0 0-8.7-5 13.3 13.3 0 0 1 0-10" />
      <Path d="M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5" />
      <Circle cx="12" cy="12" r="10" />
    </Svg>
  );
};

export default React.memo(VolleyballIcon);
