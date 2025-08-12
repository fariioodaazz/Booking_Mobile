import React from "react";
import styled from "styled-components/native";

type BadgeProps = {
  children: React.ReactNode;
  style?: any;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
};

const BadgeContainer = styled.View<{ variant: string }>`
  background-color: ${(props: { variant: string }) => {
    switch (props.variant) {
      case 'secondary':
        return '#f3f4f6';
      case 'destructive':
        return '#ef4444';
      case 'outline':
        return 'transparent';
      default:
        return '#3b82f6';
    }
  }};
  border-radius: 12px;
  padding-horizontal: 8px;
  padding-vertical: 4px;
  align-self: flex-start;
  border-width: ${(props: { variant: string }) => props.variant === 'outline' ? '1px' : '0px'};
  border-color: ${(props: { variant: string }) => props.variant === 'outline' ? '#d1d5db' : 'transparent'};
`;

const BadgeText = styled.Text<{ variant: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${(props: { variant: string }) => {
    switch (props.variant) {
      case 'secondary':
        return '#374151';
      case 'destructive':
        return '#ffffff';
      case 'outline':
        return '#374151';
      default:
        return '#ffffff';
    }
  }};
`;

export function Badge({ children, style, variant = 'default' }: BadgeProps) {
  return (
    <BadgeContainer style={style} variant={variant}>
      <BadgeText variant={variant}>{children}</BadgeText>
    </BadgeContainer>
  );
}
