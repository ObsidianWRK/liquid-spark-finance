import { vueniTheme, getColor as unifiedGetColor } from './unified';

export const vueniPalette = vueniTheme.colors;

export const getColor = (path: string) => unifiedGetColor(path);

export const applyOpacity = (hex: string, opacity: number): string => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default vueniPalette;
