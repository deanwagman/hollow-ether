/**
 * Three.js / R3F theme tokens — keep in sync with client/src/styles/tokens.css
 */
export const colors = {
  baseBlack: '#0a0a0a',
  baseCharcoal: '#1e1e1e',
  baseNavy: '#0c1440',
  textPrimary: '#f5f5f5',
  textSecondary: '#e0e0e0',
  textMuted: '#a8adb8',
  accent: '#6d7ba6',
  accentEther: '#7b6ba6',
  accentMuted: '#afafaf',
  highlightCyan: '#5eced4',
  background: '#0c1440',
} as const;

export const particles = {
  count: 280,
  size: 0.024,
  opacity: 0.48,
  driftSpeed: 0.18,
  driftAmount: 0.065,
} as const;

export const fog = {
  color: colors.baseNavy,
  density: 0.028,
} as const;

export type ThemeColors = typeof colors;
