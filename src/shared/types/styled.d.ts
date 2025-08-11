// src/types/styled.d.ts
import "styled-components";
import type { AppTheme } from "../shared/styles/theme";

declare module "styled-components" {
  export interface DefaultTheme extends AppTheme {}
}
