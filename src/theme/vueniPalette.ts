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
} as const;

export type VueniVariant = keyof typeof vueniPalette;
