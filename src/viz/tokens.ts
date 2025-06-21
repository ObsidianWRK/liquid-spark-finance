/**
 * @fileoverview Viz Design Tokens
 * @description Centralized design tokens for MetricIQ components
 * Follows Apple corner radius scale and grayscale neutrals
 */

export interface VizTokens {
  /** Border radius values */
  radius: {
    /** 24px - Primary container radius */
    LG: string;
    /** Card internal elements */
    MD: string;
    /** Small elements */
    SM: string;
  };
  /** Shadow tiers */
  shadows: {
    /** 2dp default shadow for cards */
    CARD: string;
    /** 4dp hover shadow for interaction */
    CARD_HOVER: string;
  };
  /** Dot sizing */
  dots: {
    /** Uniform 3px diameter for all dot matrix */
    DIAMETER: number;
  };
  /** Animation durations */
  timing: {
    /** Fast interactions */
    FAST: string;
    /** Standard transitions */
    STANDARD: string;
    /** Slow chart animations */
    SLOW: string;
  };
  /** Grayscale palette */
  colors: {
    /** Pure white for text */
    WHITE: string;
    /** 95% white for secondary text */
    WHITE_95: string;
    /** 80% white for tertiary */
    WHITE_80: string;
    /** 60% white for placeholders */
    WHITE_60: string;
    /** 40% white for disabled */
    WHITE_40: string;
    /** 20% white for borders */
    WHITE_20: string;
    /** 10% white for subtle backgrounds */
    WHITE_10: string;
    /** 5% white for cards */
    WHITE_05: string;
    /** Pure black for backgrounds */
    BLACK: string;
    /** 10% black for overlays */
    BLACK_10: string;
  };
}

export const VIZ_TOKENS: VizTokens = {
  radius: {
    LG: '24px',
    MD: '12px', 
    SM: '6px',
  },
  shadows: {
    CARD: '0 2px 4px rgba(0,0,0,.05)',
    CARD_HOVER: '0 4px 12px rgba(0,0,0,.08)',
  },
  dots: {
    DIAMETER: 3,
  },
  timing: {
    FAST: '150ms',
    STANDARD: '250ms', 
    SLOW: '400ms',
  },
  colors: {
    WHITE: '#ffffff',
    WHITE_95: 'rgba(255,255,255,0.95)',
    WHITE_80: 'rgba(255,255,255,0.80)',
    WHITE_60: 'rgba(255,255,255,0.60)',
    WHITE_40: 'rgba(255,255,255,0.40)',
    WHITE_20: 'rgba(255,255,255,0.20)',
    WHITE_10: 'rgba(255,255,255,0.10)',
    WHITE_05: 'rgba(255,255,255,0.05)',
    BLACK: '#000000',
    BLACK_10: 'rgba(0,0,0,0.10)',
  },
}; 