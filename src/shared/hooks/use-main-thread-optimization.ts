/**
 * Main Thread Optimization Hook
 * Prevents blocking tasks and improves TTI by splitting heavy operations
 * Uses React 18 startTransition and scheduler features
 */

import { useCallback, useTransition, startTransition } from 'react';
import { flushSync } from 'react-dom';

interface TaskOptions {
  priority?: 'high' | 'normal' | 'low';
  timeout?: number;
  chunk?: boolean;
}

// Time slice for chunked operations (5ms to stay under 16ms frame budget)
const TIME_SLICE_MS = 5;

export const useMainThreadOptimization = () => {
  const [isPending, startTransitionInternal] = useTransition();

  // Split large tasks into smaller chunks to prevent blocking
  const chunkTask = useCallback(
    (
      task: () => void,
      onComplete?: () => void,
      maxChunkTime = TIME_SLICE_MS
    ) => {
      const startTime = performance.now();

      try {
        task();

        // If task completed within time budget, we're done
        if (performance.now() - startTime <= maxChunkTime) {
          onComplete?.();
          return;
        }
      } catch (error) {
        console.error('Task chunk failed:', error);
        onComplete?.();
        return;
      }

      // If we get here, task needs to be chunked further
      // Schedule continuation in next frame
      requestIdleCallback(
        () => {
          chunkTask(task, onComplete, maxChunkTime);
        },
        { timeout: 100 }
      );
    },
    []
  );

  // Optimized task scheduler with priority levels
  const scheduleTask = useCallback(
    (task: () => void | Promise<void>, options: TaskOptions = {}) => {
      const { priority = 'normal', timeout = 5000, chunk = false } = options;

      if (chunk) {
        // Use chunking for heavy synchronous tasks
        chunkTask(task as () => void, undefined, TIME_SLICE_MS);
        return;
      }

      switch (priority) {
        case 'high':
          // High priority: execute immediately but in transition
          startTransitionInternal(() => {
            const result = task();
            if (result instanceof Promise) {
              result.catch(console.error);
            }
          });
          break;

        case 'low':
          // Low priority: defer until idle
          requestIdleCallback(
            () => {
              startTransitionInternal(() => {
                const result = task();
                if (result instanceof Promise) {
                  result.catch(console.error);
                }
              });
            },
            { timeout }
          );
          break;

        default:
          // Normal priority: use transition
          startTransitionInternal(() => {
            const result = task();
            if (result instanceof Promise) {
              result.catch(console.error);
            }
          });
          break;
      }
    },
    [startTransitionInternal, chunkTask]
  );

  // Optimized data processing for large datasets
  const processLargeDataset = useCallback(
    <T>(data: T[], processor: (item: T) => void, batchSize = 100) => {
      let index = 0;

      const processBatch = () => {
        const startTime = performance.now();

        while (
          index < data.length &&
          performance.now() - startTime < TIME_SLICE_MS
        ) {
          processor(data[index]);
          index++;
        }

        if (index < data.length) {
          // Schedule next batch
          scheduleTask(processBatch, { priority: 'low' });
        }
      };

      scheduleTask(processBatch, { priority: 'normal' });
    },
    [scheduleTask]
  );

  // Defer heavy operations until after paint
  const deferUntilPaint = useCallback(
    (task: () => void) => {
      requestAnimationFrame(() => {
        scheduleTask(task, { priority: 'low' });
      });
    },
    [scheduleTask]
  );

  // Force synchronous update when needed (use sparingly)
  const urgentUpdate = useCallback((task: () => void) => {
    flushSync(() => {
      task();
    });
  }, []);

  // Monitor long tasks for debugging
  const monitorLongTasks = useCallback(() => {
    if (import.meta.env.DEV && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              console.warn(
                `🐌 Long task detected: ${entry.duration.toFixed(2)}ms`,
                entry
              );
            }
          });
        });

        observer.observe({ entryTypes: ['longtask'] });

        return () => observer.disconnect();
      } catch (error) {
        console.warn('Long task monitoring not supported:', error);
      }
    }
  }, []);

  return {
    isPending,
    scheduleTask,
    chunkTask,
    processLargeDataset,
    deferUntilPaint,
    urgentUpdate,
    monitorLongTasks,
  };
};

// Helper for React components to avoid blocking renders
export const useNonBlockingEffect = (
  effect: () => void | Promise<void>,
  deps: React.DependencyList,
  priority: TaskOptions['priority'] = 'normal'
) => {
  const { scheduleTask } = useMainThreadOptimization();

  React.useEffect(() => {
    scheduleTask(effect, { priority });
  }, deps);
};

// Performance budget checker
export const usePerformanceBudget = () => {
  const checkBudget = useCallback(
    (operationName: string, startTime: number) => {
      const duration = performance.now() - startTime;
      const budget = 16; // 16ms frame budget

      if (duration > budget) {
        console.warn(
          `⚠️ Performance budget exceeded: ${operationName} took ${duration.toFixed(2)}ms (budget: ${budget}ms)`
        );
      }

      return duration;
    },
    []
  );

  const measure = useCallback(
    <T>(operationName: string, operation: () => T): T => {
      const startTime = performance.now();
      const result = operation();
      checkBudget(operationName, startTime);
      return result;
    },
    [checkBudget]
  );

  return { checkBudget, measure };
};

export default useMainThreadOptimization;
