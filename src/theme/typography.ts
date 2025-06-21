export const typography = {
  fontSize: {
    body: '1rem',
    bodySmall: '0.875rem',
    bodyLarge: '1.125rem',
    heading1: '2rem',
    heading2: '1.5rem',
    heading3: '1.25rem',
    heading4: '1.125rem',
    heading5: '1rem',
    heading6: '0.875rem',
  },
} as const;

export type Typography = typeof typography;
export default typography;
