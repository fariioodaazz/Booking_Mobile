import React from "react";
import styled from "styled-components/native";
import { TextInput } from "react-native";

type InputProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: any;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
  numberOfLines?: number;
  onKeyPress?: (e: any) => void;
};

const StyledTextInput = styled(TextInput)`
  background-color: #ffffff;
  border-width: 1px;
  border-color: #d1d5db;
  border-radius: 8px;
  padding-horizontal: 12px;
  padding-vertical: 10px;
  font-size: 16px;
  color: #1f2937;
  min-height: 44px;
`;

export function Input({
  placeholder,
  value,
  onChangeText,
  style,
  secureTextEntry = false,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  onKeyPress,
  ...props
}: InputProps) {
  return (
    <StyledTextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={style}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      placeholderTextColor="#9ca3af"
      onKeyPress={onKeyPress}
      {...props}
    />
  );
}
