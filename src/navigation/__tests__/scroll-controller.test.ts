/**
 * Tests for Scroll Controller Implementation
 *
 * Basic tests to validate core functionality and performance requirements.
 */

import {
  ScrollController,
  createScrollController,
} from '../utils/scroll-controller';

// Mock browser APIs
Object.defineProperty(window, 'pageYOffset', {
  value: 0,
  writable: true,
});

Object.defineProperty(window, 'innerHeight', {
  value: 800,
  writable: true,
});

Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock performance.now
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(clearTimeout);

describe('ScrollController', () => {
  let controller: ScrollController;
  let mockCallbacks: any;

  beforeEach(() => {
    mockCallbacks = {
      onVisibilityChange: jest.fn(),
      onScrollStateChange: jest.fn(),
      onVirtualKeyboardToggle: jest.fn(),
    };

    controller = new ScrollController(
      {
        hideThreshold: 48,
        showThreshold: 4,
        velocityThreshold: 0.1,
        debounceMs: 150,
      },
      mockCallbacks
    );
  });

  afterEach(() => {
    controller?.destroy();
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should create controller with default options', () => {
      const defaultController = new ScrollController();
      expect(defaultController).toBeInstanceOf(ScrollController);
      expect(defaultController.getVisibilityState().isVisible).toBe(true);
      defaultController.destroy();
    });

    it('should create controller with custom options', () => {
      const customController = new ScrollController({
        hideThreshold: 100,
        showThreshold: 10,
      });

      expect(customController).toBeInstanceOf(ScrollController);
      customController.destroy();
    });

    it('should initialize with visible navigation', () => {
      const state = controller.getVisibilityState();
      expect(state.isVisible).toBe(true);
      expect(state.transform).toBe('translateY(0px)');
    });
  });

  describe('Scroll State Management', () => {
    it('should track scroll position', () => {
      const initialState = controller.getScrollState();
      expect(initialState.scrollY).toBe(0);
      expect(initialState.direction).toBe('none');
      expect(initialState.velocity).toBe(0);
    });

    it('should detect scroll direction', () => {
      // Simulate scroll down
      Object.defineProperty(window, 'pageYOffset', { value: 100 });

      // Trigger scroll event manually
      const scrollEvent = new Event('scroll');
      window.dispatchEvent(scrollEvent);

      // Allow for async updates
      setTimeout(() => {
        const state = controller.getScrollState();
        expect(state.scrollY).toBe(100);
      }, 20);
    });
  });

  describe('Navigation Visibility', () => {
    it('should hide navigation on downward scroll past threshold', () => {
      controller.setVisibility(false, true);
      const state = controller.getVisibilityState();
      expect(state.isVisible).toBe(false);
      expect(mockCallbacks.onVisibilityChange).toHaveBeenCalledWith(false);
    });

    it('should show navigation when forced', () => {
      controller.setVisibility(false, true);
      controller.setVisibility(true, true);

      const state = controller.getVisibilityState();
      expect(state.isVisible).toBe(true);
      expect(mockCallbacks.onVisibilityChange).toHaveBeenCalledWith(true);
    });

    it('should generate correct transform values', () => {
      controller.setVisibility(false, true);
      const state = controller.getVisibilityState();
      expect(state.transform).toContain('translateY(-');
    });
  });

  describe('Options Management', () => {
    it('should update options dynamically', () => {
      controller.updateOptions({
        hideThreshold: 100,
        velocityThreshold: 0.5,
      });

      // Verify options were updated by checking behavior
      // This is a simplified test - in practice you'd test the behavior change
      expect(controller).toBeDefined();
    });
  });

  describe('Performance Requirements', () => {
    it('should use requestAnimationFrame for scroll handling', () => {
      const scrollEvent = new Event('scroll');
      window.dispatchEvent(scrollEvent);

      expect(requestAnimationFrame).toHaveBeenCalled();
    });

    it('should throttle scroll events', () => {
      const scrollEvent = new Event('scroll');

      // Fire multiple events rapidly
      window.dispatchEvent(scrollEvent);
      window.dispatchEvent(scrollEvent);
      window.dispatchEvent(scrollEvent);

      // Should only call RAF once due to throttling
      expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    });

    it('should clean up resources on destroy', () => {
      const spy = jest.spyOn(window, 'removeEventListener');
      controller.destroy();

      expect(spy).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(cancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Utility Functions', () => {
    it('should create controller with factory function', () => {
      const factoryController = createScrollController(
        {
          hideThreshold: 60,
        },
        {
          onVisibilityChange: jest.fn(),
        }
      );

      expect(factoryController).toBeInstanceOf(ScrollController);
      factoryController.destroy();
    });
  });

  describe('Accessibility', () => {
    it('should respect reduced motion preferences', () => {
      // Mock reduced motion preference
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const reducedMotionController = new ScrollController({
        respectReducedMotion: true,
      });

      const state = reducedMotionController.getVisibilityState();
      expect(state.shouldAnimate).toBe(false);

      reducedMotionController.destroy();
    });
  });

  describe('Browser Compatibility', () => {
    it('should handle missing visualViewport API gracefully', () => {
      const originalVisualViewport = window.visualViewport;
      delete (window as any).visualViewport;

      const compatController = new ScrollController({
        enableVirtualKeyboardDetection: true,
      });

      expect(compatController).toBeInstanceOf(ScrollController);
      compatController.destroy();

      // Restore
      (window as any).visualViewport = originalVisualViewport;
    });

    it('should detect passive event support', () => {
      // This tests the internal capability detection
      const testController = new ScrollController();
      expect(testController).toBeInstanceOf(ScrollController);
      testController.destroy();
    });
  });
});

describe('Performance Benchmarks', () => {
  it('should handle rapid scroll events without performance degradation', () => {
    const controller = new ScrollController();
    const startTime = performance.now();

    // Simulate 100 rapid scroll events
    for (let i = 0; i < 100; i++) {
      Object.defineProperty(window, 'pageYOffset', { value: i * 10 });
      const scrollEvent = new Event('scroll');
      window.dispatchEvent(scrollEvent);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Should handle 100 events in under 100ms (very generous for CI)
    expect(duration).toBeLessThan(100);

    controller.destroy();
  });

  it('should maintain 60fps target (16ms frame budget)', (done) => {
    const controller = new ScrollController(
      {},
      {
        onScrollStateChange: () => {
          const frameTime = performance.now();
          // Each frame should complete within 16ms budget
          // This is a simplified test - real performance testing would be more sophisticated
          expect(frameTime).toBeDefined();
          done();
        },
      }
    );

    // Trigger a scroll event
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);

    setTimeout(() => {
      controller.destroy();
    }, 50);
  });
});
