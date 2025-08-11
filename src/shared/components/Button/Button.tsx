import React from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import styled, { useTheme } from "styled-components/native";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const sizes = {
  sm: { pv: 8,  ph: 12, fs: 14, gap: 6 },
  md: { pv: 12, ph: 16, fs: 16, gap: 8 },
  lg: { pv: 16, ph: 20, fs: 18, gap: 10 },
} as const;

const getColors = (variant: Variant, theme: any) => {
  const base = {
    primary: theme?.colors?.primary ?? "#1f6feb",
    text: theme?.colors?.text ?? "#111827",
    bg: theme?.colors?.bg ?? "#fff",
    border: "#e5e7eb",
    danger: "#ef4444",
  };
  switch (variant) {
    case "primary":  return { bg: base.primary, border: base.primary, text: "#fff",      ripple: "#ffffff33" };
    case "secondary":return { bg: "#f3f4f6",     border: base.border, text: base.text,   ripple: "#00000014" };
    case "outline":  return { bg: "transparent", border: base.primary, text: base.primary, ripple: "#1f6feb22" };
    case "ghost":    return { bg: "transparent", border: "transparent", text: base.text, ripple: "#00000014" };
    case "danger":   return { bg: base.danger,   border: base.danger,  text: "#fff",     ripple: "#ffffff33" };
    default:         return { bg: base.primary,  border: base.primary, text: "#fff",      ripple: "#ffffff33" };
  }
};

const SButton = styled.Pressable<{
  $variant: Variant; $size: Size; $fullWidth?: boolean; $disabled?: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${(p: { $fullWidth?: boolean }) => (p.$fullWidth ? "width: 100%;" : "")}
  padding-vertical: ${(p: { $size: Size }) => sizes[p.$size].pv}px;
  padding-horizontal: ${(p: { $size: Size }) => sizes[p.$size].ph}px;
  border-radius: ${(p: { theme: any }) => p.theme.radii.md}px;
  border-width: 1px;
  background-color: ${(p: { $variant: Variant; theme: any }) => getColors(p.$variant, p.theme).bg};
  border-color: ${(p: { $variant: Variant; theme: any }) => getColors(p.$variant, p.theme).border};
  opacity: ${(p: { $disabled?: boolean }) => (p.$disabled ? 0.5 : 1)};
`;

const Label = styled.Text<{ $variant: Variant; $size: Size }>`
  font-weight: 700;
  color: ${(p: { $variant: Variant; $size: Size; theme: any }) => getColors(p.$variant, p.theme).text};
  font-size: ${(p: { $variant: Variant; $size: Size; theme: any }) => sizes[p.$size].fs}px;
`;

const Gap = ({ size }: { size: Size }) => <View style={{ width: sizes[size].gap }} />;

export const Button: React.FC<{
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  testID?: string;
}> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  fullWidth,
  disabled,
  loading,
  leftIcon,
  rightIcon,
  testID,
}) => {
  const theme = useTheme(); // ✅ get the real theme

  const ripple = Platform.OS === "android" ? { color: getColors(variant, theme).ripple } : undefined;

  return (
    <SButton
      testID={testID}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $disabled={disabled || loading}
      onPress={disabled || loading ? undefined : onPress}
      android_ripple={ripple}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          {leftIcon}
          {leftIcon && <Gap size={size} />}
          <Label $variant={variant} $size={size}>{title}</Label>
          {rightIcon && <Gap size={size} />}
          {rightIcon}
        </>
      )}
    </SButton>
  );
};

export default Button;
