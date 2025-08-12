import React from "react";
import styled from "styled-components/native";

type ButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

const ButtonContainer = styled.TouchableOpacity<{ disabled?: boolean; variant: string; size: string }>`
  background-color: ${(props: { disabled?: boolean; variant: string; size: string }) => {
    if (props.disabled) return '#d1d5db';
    switch (props.variant) {
      case 'destructive':
        return '#ef4444';
      case 'outline':
        return 'transparent';
      case 'secondary':
        return '#f3f4f6';
      case 'ghost':
        return 'transparent';
      case 'link':
        return 'transparent';
      default:
        return '#3b82f6';
    }
  }};
  padding-horizontal: ${(props: { disabled?: boolean; variant: string; size: string }) => {
    switch (props.size) {
      case 'sm':
        return '12px';
      case 'lg':
        return '24px';
      case 'icon':
        return '0px';
      default:
        return '16px';
    }
  }};
  padding-vertical: ${(props: { disabled?: boolean; variant: string; size: string }) => {
    switch (props.size) {
      case 'sm':
        return '8px';
      case 'lg':
        return '12px';
      case 'icon':
        return '8px';
      default:
        return '10px';
    }
  }};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  border-width: ${(props: { disabled?: boolean; variant: string; size: string }) => props.variant === 'outline' ? '1px' : '0px'};
  border-color: ${(props: { disabled?: boolean; variant: string; size: string }) => props.variant === 'outline' ? '#d1d5db' : 'transparent'};
  min-height: ${(props: { disabled?: boolean; variant: string; size: string }) => {
    switch (props.size) {
      case 'sm':
        return '32px';
      case 'lg':
        return '44px';
      case 'icon':
        return '36px';
      default:
        return '40px';
    }
  }};
  opacity: ${(props: { disabled?: boolean; variant: string; size: string }) => props.disabled ? 0.5 : 1};
`;

const ButtonText = styled.Text<{ variant: string; disabled?: boolean }>`
  color: ${(props: { variant: string; disabled?: boolean }) => {
    if (props.disabled) return '#9ca3af';
    switch (props.variant) {
      case 'destructive':
        return '#ffffff';
      case 'outline':
        return '#374151';
      case 'secondary':
        return '#374151';
      case 'ghost':
        return '#374151';
      case 'link':
        return '#3b82f6';
      default:
        return '#ffffff';
    }
  }};
  font-weight: 500;
  font-size: 14px;
  text-decoration-line: ${(props: { variant: string; disabled?: boolean }) => props.variant === 'link' ? 'underline' : 'none'};
`;

export function Button({ 
  children, 
  onPress, 
  style, 
  disabled = false, 
  variant = 'default', 
  size = 'default' 
}: ButtonProps) {
  return (
    <ButtonContainer 
      onPress={onPress} 
      style={style} 
      disabled={disabled}
      variant={variant}
      size={size}
    >
      {typeof children === 'string' ? (
        <ButtonText variant={variant} disabled={disabled}>
          {children}
        </ButtonText>
      ) : (
        children
      )}
    </ButtonContainer>
  );
}
