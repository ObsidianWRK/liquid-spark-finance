/**
 * Vueni Color System - Utility Helpers
 * 
 * Helper functions to make color token usage easier throughout the app.
 * Provides semantic color access and theme integration utilities.
 */

import { vueniColorTheme, VueniCore, VueniSemantic, VueniNeutral, VueniSurfaces, VueniCharts } from './vueniPalette';

// Color getter utility with semantic mapping
export const getColor = (role: string, variant?: string): string => {
  const [category, ...parts] = role.split('.');
  const subRole = parts.join('.');

  switch (category) {
    case 'primary':
      return VueniCore.primary.sapphireDust;
    case 'secondary':
      return VueniCore.secondary.caramelEssence;
    case 'success':
      return VueniSemantic.success;
    case 'error':
    case 'danger':
      return VueniSemantic.error;
    case 'warning':
      return VueniSemantic.warning;
    case 'info':
      return VueniSemantic.info;
    case 'neutral':
      const level = parseInt(variant || '500');
      return VueniNeutral[level as keyof typeof VueniNeutral] || VueniNeutral[500];
    case 'surface':
      if (subRole === 'primary') return VueniSurfaces.background.primary;
      if (subRole === 'secondary') return VueniSurfaces.background.secondary;
      if (subRole === 'tertiary') return VueniSurfaces.background.tertiary;
      return VueniSurfaces.background.primary;
    case 'text':
      if (subRole === 'primary') return VueniSurfaces.text.primary;
      if (subRole === 'secondary') return VueniSurfaces.text.secondary;
      if (subRole === 'tertiary') return VueniSurfaces.text.tertiary;
      if (subRole === 'muted') return VueniSurfaces.text.muted;
      return VueniSurfaces.text.primary;
    case 'glass':
      if (subRole === 'subtle') return VueniSurfaces.glass.subtle;
      if (subRole === 'prominent') return VueniSurfaces.glass.prominent;
      if (subRole === 'border') return VueniSurfaces.glass.border;
      return VueniSurfaces.glass.default;
    default:
      return VueniCore.primary.sapphireDust;
  }
};

// Financial color helpers
export const getFinancialColor = (type: 'income' | 'expenses' | 'savings' | 'investments' | 'debt'): string => {
  return VueniCharts.financial[type];
};

// Status color helpers with WCAG AA compliance
export const getStatusColor = (status: 'success' | 'error' | 'warning' | 'info'): {
  color: string;
  background: string;
  border: string;
} => {
  const baseColor = VueniSemantic[status];
  
  // Convert hex to rgba with opacity
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  return {
    color: baseColor,
    background: hexToRgba(baseColor, 0.2), // 20% opacity
    border: hexToRgba(baseColor, 0.4),     // 40% opacity
  };
};

// Glass morphism color generator
export const getGlassStyles = (intensity: 'subtle' | 'default' | 'prominent' = 'default'): {
  background: string;
  border: string;
  backdropFilter: string;
} => {
  const backgroundMap = {
    subtle: VueniSurfaces.glass.subtle,
    default: VueniSurfaces.glass.default,
    prominent: VueniSurfaces.glass.prominent,
  };
  
  return {
    background: backgroundMap[intensity],
    border: VueniSurfaces.glass.border,
    backdropFilter: 'blur(12px)',
  };
};

// Chart color sequence generator
export const getChartColors = (count: number): string[] => {
  const colors = VueniCharts.primary;
  const result: string[] = [];
  
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  
  return result;
};

// Trend color helper
export const getTrendColor = (trend: 'up' | 'down' | 'stable' | number): string => {
  if (typeof trend === 'number') {
    return trend > 0 ? VueniCharts.trends.positive :
           trend < 0 ? VueniCharts.trends.negative :
           VueniCharts.trends.neutral;
  }
  
  switch (trend) {
    case 'up':
      return VueniCharts.trends.positive;
    case 'down':
      return VueniCharts.trends.negative;
    default:
      return VueniCharts.trends.neutral;
  }
};

// Tailwind class generators for easy migration
export const getTailwindClasses = (colorToken: string): {
  bg: string;
  text: string;
  border: string;
} => {
  // Map common Vueni colors to their closest Tailwind equivalents
  const colorMap: Record<string, string> = {
    [VueniCore.primary.sapphireDust]: 'blue-600',
    [VueniCore.secondary.caramelEssence]: 'amber-500',
    [VueniCore.secondary.blueOblivion]: 'blue-800',
    [VueniSemantic.success]: 'green-500',
    [VueniSemantic.error]: 'red-500',
    [VueniSemantic.warning]: 'amber-500',
  };
  
  const tailwindColor = colorMap[colorToken] || 'blue-600';
  
  return {
    bg: `bg-${tailwindColor}`,
    text: `text-${tailwindColor}`,
    border: `border-${tailwindColor}`,
  };
};

// CSS variable integration
export const getCSSVariableValue = (propertyName: string): string => {
  const cssProps = vueniColorTheme.css;
  const key = propertyName.startsWith('--') ? propertyName : `--vueni-${propertyName}`;
  return cssProps[key as keyof typeof cssProps] || '';
};

// Component variant color helpers
export const getCardVariantColors = (variant: 'default' | 'eco' | 'wellness' | 'financial'): {
  background: string;
  border: string;
  hover: {
    background: string;
    border: string;
  };
} => {
  // Helper function to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  switch (variant) {
    case 'eco':
      return {
        background: `linear-gradient(135deg, ${hexToRgba(VueniSemantic.success, 0.1)}, ${hexToRgba(VueniSemantic.success, 0.05)})`,
        border: hexToRgba(VueniSemantic.success, 0.2),
        hover: {
          background: `linear-gradient(135deg, ${hexToRgba(VueniSemantic.success, 0.15)}, ${hexToRgba(VueniSemantic.success, 0.08)})`,
          border: hexToRgba(VueniSemantic.success, 0.3),
        },
      };
    case 'wellness':
      return {
        background: `linear-gradient(135deg, ${hexToRgba(VueniCore.primary.sapphireDust, 0.1)}, ${hexToRgba(VueniCore.primary.sapphireDust, 0.05)})`,
        border: hexToRgba(VueniCore.primary.sapphireDust, 0.2),
        hover: {
          background: `linear-gradient(135deg, ${hexToRgba(VueniCore.primary.sapphireDust, 0.15)}, ${hexToRgba(VueniCore.primary.sapphireDust, 0.08)})`,
          border: hexToRgba(VueniCore.primary.sapphireDust, 0.3),
        },
      };
    case 'financial':
      return {
        background: `linear-gradient(135deg, ${hexToRgba(VueniCore.secondary.blueOblivion, 0.1)}, ${hexToRgba(VueniCore.secondary.blueOblivion, 0.05)})`,
        border: hexToRgba(VueniCore.secondary.blueOblivion, 0.2),
        hover: {
          background: `linear-gradient(135deg, ${hexToRgba(VueniCore.secondary.blueOblivion, 0.15)}, ${hexToRgba(VueniCore.secondary.blueOblivion, 0.08)})`,
          border: hexToRgba(VueniCore.secondary.blueOblivion, 0.3),
        },
      };
    default:
      return {
        background: VueniSurfaces.glass.default,
        border: VueniSurfaces.glass.border,
        hover: {
          background: VueniSurfaces.glass.prominent,
          border: hexToRgba(VueniCore.primary.sapphireDust, 0.3),
        },
      };
  }
};

// Export all helpers
export const vueniHelpers = {
  getColor,
  getFinancialColor,
  getStatusColor,
  getGlassStyles,
  getChartColors,
  getTrendColor,
  getTailwindClasses,
  getCSSVariableValue,
  getCardVariantColors,
};

export default vueniHelpers; 