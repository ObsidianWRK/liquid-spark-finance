import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBreakpoint } from '../useBreakpoint';

// Mock window.innerWidth for testing
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

// Mock window.addEventListener and removeEventListener
const mockEventListeners: { [key: string]: EventListener[] } = {};
const mockAddEventListener = vi.fn((event: string, callback: EventListener) => {
  if (!mockEventListeners[event]) {
    mockEventListeners[event] = [];
  }
  mockEventListeners[event].push(callback);
});
const mockRemoveEventListener = vi.fn((event: string, callback: EventListener) => {
  if (mockEventListeners[event]) {
    const index = mockEventListeners[event].indexOf(callback);
    if (index > -1) {
      mockEventListeners[event].splice(index, 1);
    }
  }
});

// Helper to simulate resize event
const triggerResize = (width: number) => {
  mockInnerWidth(width);
  mockEventListeners.resize?.forEach(callback => callback(new Event('resize')));
};

describe('useBreakpoint', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    Object.keys(mockEventListeners).forEach(key => {
      mockEventListeners[key] = [];
    });
    
    // Mock DOM APIs
    window.addEventListener = mockAddEventListener as any;
    window.removeEventListener = mockRemoveEventListener as any;
  });

  describe('Desktop detection (≥1024px)', () => {
    test('should return isDesktop=true for width=1024px (minimum desktop)', () => {
      mockInnerWidth(1024);
      const { result } = renderHook(() => useBreakpoint());
      
      expect(result.current.breakpoint).toBe('desktop');
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
    });

    test('should return isDesktop=true for width=1440px (large desktop)', () => {
      mockInnerWidth(1440);
      const { result } = renderHook(() => useBreakpoint());
      
      expect(result.current.breakpoint).toBe('large');
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
    });

    test('should return isDesktop=true for width=1920px (ultrawide)', () => {
      mockInnerWidth(1920);
      const { result } = renderHook(() => useBreakpoint());
      
      expect(result.current.breakpoint).toBe('ultrawide');
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
    });

    test('should return isDesktop=false for width=1023px (just below desktop)', () => {
      mockInnerWidth(1023);
      const { result } = renderHook(() => useBreakpoint());
      
      expect(result.current.breakpoint).toBe('tablet');
      expect(result.current.isDesktop).toBe(false);
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
    });
  });

  describe('Tablet detection (768-1023px)', () => {
    test('should return isTablet=true for width=768px (minimum tablet)', () => {
      mockInnerWidth(768);
      const { result } = renderHook(() => useBreakpoint());
      
      expect(result.current.breakpoint).toBe('tablet');
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isDesktop).toBe(false);
    });

    test('should return isTablet=true for width=1023px (maximum tablet)', () => {
      mockInnerWidth(1023);
      const { result } = renderHook(() => useBreakpoint());
      
      expect(result.current.breakpoint).toBe('tablet');
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isDesktop).toBe(false);
    });
  });

  describe('Mobile detection (<768px)', () => {
    test('should return isMobile=true for width=375px (mobile)', () => {
      mockInnerWidth(375);
      const { result } = renderHook(() => useBreakpoint());
      
      expect(result.current.breakpoint).toBe('mobile');
      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);
    });

    test('should return isMobile=true for width=767px (maximum mobile)', () => {
      mockInnerWidth(767);
      const { result } = renderHook(() => useBreakpoint());
      
      expect(result.current.breakpoint).toBe('mobile');
      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);
    });
  });

  describe('Resize handling', () => {
    test('should update breakpoint when window is resized', () => {
      // Start with mobile
      mockInnerWidth(375);
      const { result, rerender } = renderHook(() => useBreakpoint());
      
      expect(result.current.isMobile).toBe(true);
      expect(result.current.isDesktop).toBe(false);
      
      // Simulate resize to desktop
      triggerResize(1024);
      rerender();
      
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isDesktop).toBe(true);
    });

    test('should register and cleanup resize event listener', () => {
      const { unmount } = renderHook(() => useBreakpoint());
      
      expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      
      unmount();
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('Server-side rendering (SSR)', () => {
    test('should handle undefined window gracefully', () => {
      // Mock SSR environment
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      const { result } = renderHook(() => useBreakpoint());
      
      expect(result.current.breakpoint).toBe('mobile');
      expect(result.current.isMobile).toBe(true);
      expect(result.current.isDesktop).toBe(false);
      
      // Restore window
      global.window = originalWindow;
    });
  });

  describe('Large desktop utilities', () => {
    test('should return isLargeDesktop=true for large and ultrawide breakpoints', () => {
      mockInnerWidth(1440);
      const { result } = renderHook(() => useBreakpoint());
      
      expect(result.current.isLargeDesktop).toBe(true);
      expect(result.current.isDesktop).toBe(true);
    });

    test('should return isLargeDesktop=false for desktop breakpoint', () => {
      mockInnerWidth(1024);
      const { result } = renderHook(() => useBreakpoint());
      
      expect(result.current.isLargeDesktop).toBe(false);
      expect(result.current.isDesktop).toBe(true);
    });
  });
}); 