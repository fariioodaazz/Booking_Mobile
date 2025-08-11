export const theme = {
  colors: { bg: "#fff", text: "#111827", primary: "#1f6feb" },
  radii: { md: 12, lg: 20 },
  spacing: (n: number) => n * 4,
} as const;

export type AppTheme = typeof theme;