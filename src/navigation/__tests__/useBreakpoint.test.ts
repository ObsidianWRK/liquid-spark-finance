import { renderHook, act } from '@testing-library/react';
import { useBreakpoint } from '@/shared/hooks/useBreakpoint';

// Mock window.innerWidth
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

// Mock window.addEventListener and removeEventListener
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: mockAddEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: mockRemoveEventListener,
});

describe('useBreakpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns mobile breakpoint for small screens', () => {
    mockInnerWidth(400);
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('mobile');
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isLargeDesktop).toBe(false);
  });

  it('returns tablet breakpoint for medium screens', () => {
    mockInnerWidth(800);
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('tablet');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isLargeDesktop).toBe(false);
  });

  it('returns desktop breakpoint for large screens', () => {
    mockInnerWidth(1200);
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('desktop');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isLargeDesktop).toBe(false);
  });

  it('returns large breakpoint for very large screens', () => {
    mockInnerWidth(1600);
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('large');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isLargeDesktop).toBe(true);
  });

  it('returns ultrawide breakpoint for ultra-wide screens', () => {
    mockInnerWidth(2000);
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('ultrawide');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isLargeDesktop).toBe(true);
  });

  it('adds resize event listener on mount', () => {
    mockInnerWidth(1200);
    renderHook(() => useBreakpoint());

    expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('removes resize event listener on unmount', () => {
    mockInnerWidth(1200);
    const { unmount } = renderHook(() => useBreakpoint());

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('updates breakpoint when window resizes', () => {
    mockInnerWidth(400); // Start mobile
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('mobile');

    // Simulate resize to desktop
    mockInnerWidth(1200);
    
    // Get the resize handler that was registered
    const resizeHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'resize'
    )?.[1];

    act(() => {
      resizeHandler?.();
    });

    expect(result.current.breakpoint).toBe('desktop');
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
  });

  it('handles SSR gracefully', () => {
    // Mock window as undefined (SSR environment)
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('mobile'); // Fallback

    // Restore window
    global.window = originalWindow;
  });
}); 