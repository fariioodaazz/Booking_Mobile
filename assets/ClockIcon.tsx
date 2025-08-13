import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export interface ClockIconProps extends SvgProps {
  size?: number;      // Controls width & height together
  color?: string;     // Stroke color
  strokeWidth?: number;
}

const ClockIcon: React.FC<ClockIconProps> = ({
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
      <Path d="M12 6v6l4 2" />
      <Circle cx="12" cy="12" r="10" />
    </Svg>
  );
};

export default React.memo(ClockIcon);
