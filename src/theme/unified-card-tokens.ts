// Unified Card Design Tokens
// Extracted from Financial Dashboard cards for consistent design system

export const unifiedCardTokens = {
  // Background & Glass Effects
  background: {
    default: 'bg-white/[0.02]',
    hover: 'hover:bg-white/[0.03]',
    solid: 'bg-black/80',
    gradient: {
      eco: 'bg-gradient-to-br from-green-500/10 to-emerald-600/10',
      wellness: 'bg-gradient-to-br from-blue-500/10 to-cyan-600/10',
      financial: 'bg-gradient-to-br from-purple-500/10 to-indigo-600/10'
    }
  },

  // Borders
  border: {
    default: 'border border-white/[0.08]',
    hover: 'hover:border-white/[0.12]',
    eco: 'border border-green-500/20',
    wellness: 'border border-blue-500/20',
    financial: 'border border-purple-500/20'
  },

  // Border Radius
  radius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl'
  },

  // Spacing
  padding: {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  },

  // Typography
  text: {
    title: 'font-medium text-white/80',
    metric: 'text-2xl font-bold text-white',
    delta: 'text-sm',
    label: 'text-white/60',
    subtitle: 'text-white/60 text-sm'
  },

  // Icon Chip
  iconChip: {
    container: 'w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center',
    icon: 'w-5 h-5'
  },

  // Trend Colors
  trend: {
    up: 'text-green-400',
    down: 'text-red-400',
    flat: 'text-gray-400'
  },

  // Shadows & Effects
  effects: {
    backdrop: 'backdrop-blur-md',
    transition: 'transition-all duration-300',
    hoverScale: 'hover:scale-[1.02]',
    shadow: 'shadow-lg hover:shadow-xl'
  },

  // Grid Layouts
  grid: {
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    desktop: 'lg:grid-cols-3',
    gap: 'gap-6'
  }
};

// Helper function to compose card classes
export const getCardClasses = (
  variant: 'default' | 'eco' | 'wellness' | 'financial' = 'default',
  size: 'sm' | 'md' | 'lg' | 'xl' = 'lg',
  interactive: boolean = false
) => {
  const background = variant === 'default' 
    ? unifiedCardTokens.background.default 
    : unifiedCardTokens.background.gradient[variant as keyof typeof unifiedCardTokens.background.gradient];
    
  const border = variant === 'default'
    ? unifiedCardTokens.border.default
    : unifiedCardTokens.border[variant as keyof typeof unifiedCardTokens.border];

  const interactiveClasses = interactive 
    ? `${unifiedCardTokens.background.hover} ${unifiedCardTokens.effects.hoverScale} cursor-pointer`
    : '';

  return [
    background,
    border,
    unifiedCardTokens.radius[size],
    unifiedCardTokens.padding[size],
    unifiedCardTokens.effects.backdrop,
    unifiedCardTokens.effects.transition,
    interactiveClasses
  ].filter(Boolean).join(' ');
}; 