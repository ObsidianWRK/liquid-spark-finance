export const colors = {
  background: {
    primary: '#0A0A0B',      // Deep black
    secondary: '#12121A',    // Slightly lighter
    card: '#1A1A24',        // Card backgrounds
    hover: '#22222E'        // Hover states
  },
  text: {
    primary: '#FFFFFF',      // Primary text
    secondary: '#A0A0B8',    // Secondary text
    muted: '#606074',        // Muted text
    accent: '#4A9EFF'        // Accent text
  },
  accent: {
    blue: '#4A9EFF',        // Primary accent
    green: '#4AFF88',       // Success/positive
    pink: '#FF69B4',        // Health score
    orange: '#FF9F4A',      // Warning
    purple: '#9F4AFF'       // Secondary accent
  },
  status: {
    success: '#4AFF88',     // Success states
    warning: '#FFD700',     // Warning states
    error: '#FF4A6A',       // Error states
    info: '#4A9EFF'         // Info states
  },
  financial: {
    positive: '#4AFF88',    // Positive amounts
    negative: '#FF4A6A',    // Negative amounts
    neutral: '#A0A0B8'      // Neutral amounts
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.06)',
    medium: 'rgba(255, 255, 255, 0.08)',
    heavy: 'rgba(255, 255, 255, 0.12)',
    border: 'rgba(255, 255, 255, 0.08)'
  }
} as const;

export type ColorTokens = typeof colors; 