import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export interface ShieldCheckIconProps extends SvgProps {
  size?: number;      // Controls width & height together
  color?: string;     // Stroke color
  strokeWidth?: number;
}

const ShieldCheckIcon: React.FC<ShieldCheckIconProps> = ({
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
      <Path d="M12 22s8-3 8-10V5l-4-2-4 2-4-2-4 2v7c0 7 8 10 8 10z" />
      <Path d="M9 12l2 2 4-4" />
    </Svg>
  );
};

export default React.memo(ShieldCheckIcon);
