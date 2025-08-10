import { createGlobalStyle, DefaultTheme } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      text: string;
      bg: string;
    };
  }
}

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0; font-family: system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.bg};
  }
`;
