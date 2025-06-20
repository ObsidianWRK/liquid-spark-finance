import { useEffect, useState } from 'react';
import { MENU_BAR_HEIGHT } from '@/shared/tokens/menuBar.tokens';

// Detect current screen orientation. Portrait is default fallback.
function getOrientation(): 'portrait' | 'landscape' {
  if (typeof window === 'undefined') return 'portrait';
  return window.matchMedia('(orientation: landscape)').matches
    ? 'landscape'
    : 'portrait';
}

/**
 * useMenuBarReveal – manages:
 * 1. Whether the menu bar is visible (top-edge magnet & bezel swipe).
 * 2. Current screen orientation (portrait / landscape).
 */
export function useMenuBarReveal() {
  const [visible, setVisible] = useState(true);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    getOrientation
  );

  // ----- Orientation listener -----
  useEffect(() => {
    const mq = window.matchMedia('(orientation: landscape)');
    const handle = () => setOrientation(mq.matches ? 'landscape' : 'portrait');
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  // ----- Edge magnet & swipe -----
  useEffect(() => {
    let startY: number | null = null;

    function pointerDown(e: PointerEvent) {
      // Only react if pointer starts within the top bezel (10px)
      if (e.clientY <= 10) {
        startY = e.clientY;
      }
    }

    function pointerMove(e: PointerEvent) {
      if (startY !== null) {
        const delta = e.clientY - startY;
        // Swipe down > 20px → reveal
        if (delta > 20) {
          setVisible(true);
          startY = null;
        }
        // Swipe up > 15px → hide if bar already visible
        if (delta < -15 && visible) {
          setVisible(false);
          startY = null;
        }
      } else {
        // Edge magnet: show when pointer is hovering top 4px
        if (e.clientY <= 4) {
          setVisible(true);
        }
      }
    }

    function pointerUp() {
      startY = null;
    }

    window.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);

    return () => {
      window.removeEventListener('pointerdown', pointerDown);
      window.removeEventListener('pointermove', pointerMove);
      window.removeEventListener('pointerup', pointerUp);
    };
  }, [visible]);

  // ----- Public interface -----
  const translateY = visible
    ? '0'
    : `calc(-1 * ${MENU_BAR_HEIGHT[orientation]}px)`;
  return { visible, orientation, translateY } as const;
}
