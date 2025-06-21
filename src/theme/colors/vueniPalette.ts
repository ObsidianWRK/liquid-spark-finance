export const VueniCore = {
  sapphire: {
    50: '#e0efff',
    100: '#b3d1ff',
    200: '#80b3ff',
    300: '#4d94ff',
    400: '#267dff',
    500: '#4A9EFF',
    600: '#1f83f4',
    700: '#1567d9',
    800: '#0b4db4',
    900: '#053789',
  },
  caramel: {
    50: '#fffaf3',
    100: '#fdeedc',
    200: '#fbd8b9',
    300: '#f8c196',
    400: '#f5a973',
    500: '#f39028',
    600: '#d6781b',
    700: '#b45f16',
    800: '#8c4911',
    900: '#66340c',
  },
} as const;

export const VueniNeutral = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
} as const;

export const VueniSemantic = {
  primary: VueniCore.sapphire[500],
  primaryHover: VueniCore.sapphire[600],
  accent: VueniCore.caramel[500],
  accentHover: VueniCore.caramel[600],
  text: {
    base: VueniNeutral[900],
    inverted: VueniNeutral[50],
  },
} as const;

const buildVars = (vars: Record<string, string>) =>
  Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

const generateVariables = () => {
  const vars: Record<string, string> = {};

  Object.entries(VueniCore.sapphire).forEach(([step, color]) => {
    vars[`--vueni-core-sapphire-${step}`] = color;
  });
  Object.entries(VueniCore.caramel).forEach(([step, color]) => {
    vars[`--vueni-core-caramel-${step}`] = color;
  });
  Object.entries(VueniNeutral).forEach(([step, color]) => {
    vars[`--vueni-neutral-${step}`] = color;
  });

  vars['--vueni-semantic-primary'] = VueniSemantic.primary;
  vars['--vueni-semantic-primary-hover'] = VueniSemantic.primaryHover;
  vars['--vueni-semantic-accent'] = VueniSemantic.accent;
  vars['--vueni-semantic-accent-hover'] = VueniSemantic.accentHover;
  vars['--vueni-text-base'] = VueniSemantic.text.base;
  vars['--vueni-text-inverted'] = VueniSemantic.text.inverted;

  return vars;
};

const allVars = generateVariables();

export const VueniPaletteCSS = `:root {\n${buildVars(allVars)}\n}\n\n[data-theme="dark"] {\n${buildVars(allVars)}\n}`;

export default {
  VueniCore,
  VueniSemantic,
  VueniNeutral,
  VueniPaletteCSS,
};
