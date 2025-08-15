import React from 'react';
import Svg, { Path, Polyline, Line } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export interface MailboxIconProps extends SvgProps {
  size?: number;      // Controls width & height together
  color?: string;     // Stroke color
  strokeWidth?: number;
}

const MailboxIcon: React.FC<MailboxIconProps> = ({
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
      <Path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
      <Polyline points="15,9 18,9 18,11" />
      <Path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2" />
      <Line x1="6" y1="10" x2="7" y2="10" />
    </Svg>
  );
};

export default React.memo(MailboxIcon);
