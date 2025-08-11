export const theme = {
  colors: { bg: "#fff", text: "#111827", muted: "#6b7280", primary: "#1f6feb" },
  radii: { md: 12 },
} as const;

export type AppTheme = typeof theme;
