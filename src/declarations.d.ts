import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryDark: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      card: string;
      text: string;
      textSecondary: string;
      textTertiary: string;
      border: string;
      borderLight: string;
      success: string;
      warning: string;
      error: string;
      info: string;
      overlay: string;
      disabled: string;
      placeholder: string;
    };
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    borderRadius: {
      small: number;
      medium: number;
      large: number;
      xlarge: number;
      full: number;
    };
    shadows: {
      small: {
        shadowColor: string;
        shadowOffset: { width: number; height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
      };
      medium: {
        shadowColor: string;
        shadowOffset: { width: number; height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
      };
      large: {
        shadowColor: string;
        shadowOffset: { width: number; height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
      };
    };
    typography: {
      fontFamily: {
        regular: string;
        medium: string;
        bold: string;
      };
      fontSize: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
        xxxl: number;
      };
      lineHeight: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
        xxxl: number;
      };
      fontWeight: {
        regular: '400';
        medium: '500';
        semiBold: '600';
        bold: '700';
      };
    };
    breakpoints: {
      phone: number;
      tablet: number;
      desktop: number;
    };
    zIndex: {
      base: number;
      dropdown: number;
      sticky: number;
      fixed: number;
      modal: number;
      popover: number;
      tooltip: number;
      toast: number;
    };
  }
}