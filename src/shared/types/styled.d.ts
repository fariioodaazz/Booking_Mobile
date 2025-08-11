// src/types/styled.d.ts
import "styled-components";
import "styled-components/native";
import type { AppTheme } from "../shared/styles/theme";

declare module "styled-components/native" {
  export interface DefaultTheme extends AppTheme {}
}
