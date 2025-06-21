import { vueniTheme, getColor as unifiedGetColor } from './unified';

export const VueniCore = {
  primary: {
    cosmicOdyssey: '#9F4AFF',
  },
  secondary: {
    blueOblivion: '#4A9EFF',
  },
  success: {
    emeraldEuphoria: '#4AFF88',
  },
} as const;

export const vueniPalette = {
  eco: VueniCore.success.emeraldEuphoria,
  wellness: VueniCore.secondary.blueOblivion,
  financial: VueniCore.primary.cosmicOdyssey,
  ...vueniTheme.colors,
} as const;

export type VueniVariant = keyof typeof vueniPalette;

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