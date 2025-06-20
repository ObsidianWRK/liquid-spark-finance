/**
 * Type definitions for Liquid Glass Navigation Tailwind Plugin
 */

declare module 'tailwindcss/plugin' {
  interface PluginAPI {
    addUtilities: (utilities: Record<string, any>, options?: any) => void;
    addComponents: (components: Record<string, any>, options?: any) => void;
    addBase: (base: Record<string, any>) => void;
    addVariant: (name: string, definition: string | string[] | (() => string)) => void;
    e: (className: string) => string;
    prefix: (selector: string) => string;
    theme: (path?: string, defaultValue?: any) => any;
    variants: (path?: string, defaultValue?: any) => any;
    config: (path?: string, defaultValue?: any) => any;
    corePlugins: (path: string) => boolean;
    matchUtilities: (utilities: Record<string, any>, options?: any) => void;
    matchComponents: (components: Record<string, any>, options?: any) => void;
  }

  interface PluginOptions {
    theme?: {
      extend?: {
        keyframes?: Record<string, Record<string, any>>;
        animation?: Record<string, string>;
        backdropBlur?: Record<string, string>;
        boxShadow?: Record<string, string>;
        backgroundColor?: Record<string, string>;
        borderColor?: Record<string, string>;
        textColor?: Record<string, string>;
      };
    };
  }

  function plugin(
    pluginFunction: (api: PluginAPI) => void,
    options?: PluginOptions
  ): any;

  export = plugin;
}

// Extend Tailwind's default theme types
declare module 'tailwindcss/types/config' {
  interface ThemeConfig {
    backdropBlur?: {
      'nav-sm'?: string;
      'nav-md'?: string;
      'nav-lg'?: string;
      'nav-xl'?: string;
    };
    
    boxShadow?: {
      'nav-sm'?: string;
      'nav-md'?: string;
      'nav-lg'?: string;
      'nav-xl'?: string;
    };
    
    backgroundColor?: {
      'glass-light'?: string;
      'glass-medium'?: string;
      'glass-strong'?: string;
      'glass-intense'?: string;
    };
    
    borderColor?: {
      'glass-light'?: string;
      'glass-medium'?: string;
      'glass-focus'?: string;
    };
    
    textColor?: {
      'glass-primary'?: string;
      'glass-secondary'?: string;
      'glass-tertiary'?: string;
    };
  }
}

// CSS Custom Properties type extensions
declare global {
  interface CSSStyleDeclaration {
    '--nav-glass-primary'?: string;
    '--nav-glass-secondary'?: string;
    '--nav-glass-tertiary'?: string;
    '--nav-glass-accent'?: string;
    '--nav-border-primary'?: string;
    '--nav-border-secondary'?: string;
    '--nav-border-focus'?: string;
    '--nav-text-primary'?: string;
    '--nav-text-secondary'?: string;
    '--nav-text-tertiary'?: string;
  }
}

export default {};