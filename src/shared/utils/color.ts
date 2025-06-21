export const hexToRgb = (hex: string): string => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b}`;
};

export const hexToRgba = (hex: string, alpha: number): string => {
  return `rgba(${hexToRgb(hex)}, ${alpha})`;
};
