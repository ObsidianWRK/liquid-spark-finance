export const VueniCore = {
  primary: '#4A9EFF',
  success: '#4AFF88',
  danger: '#FF4A6A',
  warning: '#FFD700',
} as const;

export const VueniNeutral = {
  neutral: '#A0A0B8',
} as const;

export const VueniSemantic = {
  accent: VueniCore.primary,
  financial: {
    positive: VueniCore.success,
    negative: VueniCore.danger,
    neutral: VueniNeutral.neutral,
  },
  status: {
    success: VueniCore.success,
    error: VueniCore.danger,
    warning: VueniCore.warning,
    info: VueniCore.primary,
  },
  chart: {
    income: VueniCore.success,
    spending: VueniCore.danger,
    savings: VueniCore.primary,
    investments: '#9F4AFF',
    debt: VueniCore.warning,
  },
} as const;
