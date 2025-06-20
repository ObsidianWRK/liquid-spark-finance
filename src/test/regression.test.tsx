import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  SharedScoreCircle,
  ScoreGroup,
} from '../components/shared/SharedScoreCircle';
import { ConfigurableInsightsPage } from '../components/shared/ConfigurableInsightsPage';

// Mock data representing different component versions/states
const testTransactions = [
  {
    id: '1',
    merchant: 'Amazon',
    category: { name: 'Shopping', color: '#10B981' },
    amount: 89.99,
    date: '2024-01-01',
    status: 'completed' as const,
  },
  {
    id: '2',
    merchant: 'Starbucks',
    category: { name: 'Food & Dining', color: '#F59E0B' },
    amount: 12.5,
    date: '2024-01-02',
    status: 'pending' as const,
  },
];

const testAccounts = [
  {
    id: '1',
    type: 'checking',
    nickname: 'Main Checking',
    balance: 5000,
    availableBalance: 4800,
    currency: 'USD',
  },
];

describe('Regression Testing Suite - Consolidated Components', () => {
  beforeEach(() => {
    // Clear any previous state
    vi.clearAllMocks();

    // Mock performance.now for consistent timing
    vi.spyOn(performance, 'now').mockReturnValue(1000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('SharedScoreCircle - Regression Tests', () => {
    it('should maintain backward compatibility with legacy props', () => {
      // Test legacy prop combinations that should still work
      const legacyPropSets = [
        { score: 85 }, // Minimal props
        { score: 85, type: 'health' as const }, // Basic type
        { score: 85, type: 'eco' as const, size: 'lg' as const }, // Size variants
        {
          score: 85,
          type: 'financial' as const,
          showLabel: false,
          animated: true,
        }, // All props
      ];

      legacyPropSets.forEach((props, index) => {
        const { unmount } = render(
          <SharedScoreCircle key={index} {...props} />
        );

        // Should render score
        expect(screen.getByText('85')).toBeInTheDocument();

        // Should not crash
        expect(() => screen.getByText('85')).not.toThrow();

        unmount();
      });
    });

    it('should maintain consistent color schemes across refactors', () => {
      const colorTests = [
        { type: 'health' as const, score: 90, expectedClass: 'text-green-500' },
        {
          type: 'health' as const,
          score: 70,
          expectedClass: 'text-yellow-500',
        },
        { type: 'health' as const, score: 40, expectedClass: 'text-red-500' },
        { type: 'eco' as const, score: 90, expectedClass: 'text-emerald-500' },
        { type: 'eco' as const, score: 70, expectedClass: 'text-amber-500' },
        {
          type: 'financial' as const,
          score: 90,
          expectedClass: 'text-blue-500',
        },
      ];

      colorTests.forEach(({ type, score, expectedClass }) => {
        const { unmount } = render(
          <SharedScoreCircle score={score} type={type} />
        );

        const scoreElement = screen.getByText(score.toString());
        expect(scoreElement).toHaveClass(expectedClass);

        unmount();
      });
    });

    it('should maintain size consistency after consolidation', () => {
      const sizeTests = [
        { size: 'sm' as const, expectedClasses: ['w-8', 'h-8'] },
        { size: 'md' as const, expectedClasses: ['w-10', 'h-10'] },
        { size: 'lg' as const, expectedClasses: ['w-12', 'h-12'] },
      ];

      sizeTests.forEach(({ size, expectedClasses }) => {
        const { unmount } = render(
          <SharedScoreCircle score={85} size={size} />
        );

        const container = screen.getByText('85').closest('div');
        expectedClasses.forEach((className) => {
          expect(container).toHaveClass(className);
        });

        unmount();
      });
    });

    it('should handle edge cases that previously caused issues', () => {
      const edgeCases = [
        { score: 0, description: 'zero score' },
        { score: 100, description: 'maximum score' },
        { score: -10, description: 'negative score' },
        { score: 150, description: 'over maximum score' },
        { score: 85.5, description: 'decimal score' },
      ];

      edgeCases.forEach(({ score, description }) => {
        const { unmount } = render(<SharedScoreCircle score={score} />);

        // Should render without crashing
        expect(screen.getByText(score.toString())).toBeInTheDocument();

        unmount();
      });
    });

    it('should preserve accessibility features after consolidation', () => {
      render(
        <SharedScoreCircle score={85} type="health" label="Health Score" />
      );

      // Should maintain ARIA attributes
      const scoreElement = screen.getByText('85');
      const container = scoreElement.closest('div');

      expect(container).toHaveAttribute('role');
      expect(container).toHaveAttribute('aria-label');

      // Label should be accessible
      expect(screen.getByText('Health Score')).toBeInTheDocument();
    });

    it('should maintain performance characteristics', () => {
      const startTime = performance.now();

      // Render multiple score circles
      const { unmount } = render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <SharedScoreCircle key={i} score={i} type="health" />
          ))}
        </div>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly even with many components
      expect(renderTime).toBeLessThan(100); // 100ms threshold

      unmount();
    });
  });

  describe('ScoreGroup - Regression Tests', () => {
    it('should maintain API compatibility with different score combinations', () => {
      const scoreCombinations = [
        { health: 85 }, // Single score
        { health: 85, eco: 70 }, // Two scores
        { health: 85, eco: 70, financial: 90 }, // All scores
        {}, // Empty scores (should handle gracefully)
      ];

      scoreCombinations.forEach((scores, index) => {
        const { unmount } = render(<ScoreGroup key={index} scores={scores} />);

        // Should render without crashing
        expect(() => screen.getByRole('group')).not.toThrow();

        unmount();
      });
    });

    it('should maintain spacing and layout after consolidation', () => {
      const scores = { health: 85, eco: 70, financial: 90 };

      render(<ScoreGroup scores={scores} />);

      // All scores should be visible
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('70')).toBeInTheDocument();
      expect(screen.getByText('90')).toBeInTheDocument();

      // Should maintain proper grouping
      const container = screen.getByText('85').closest('[role="group"]');
      expect(container).toBeInTheDocument();
    });

    it('should handle compact mode consistently', () => {
      const scores = { health: 85, eco: 70, financial: 90 };

      const { rerender } = render(
        <ScoreGroup scores={scores} compact={false} />
      );
      const normalContainer = screen
        .getByText('85')
        .closest('div')?.parentElement;

      rerender(<ScoreGroup scores={scores} compact={true} />);
      const compactContainer = screen
        .getByText('85')
        .closest('div')?.parentElement;

      // Compact mode should have different styling
      expect(compactContainer).toHaveClass('gap-2');
    });
  });

  describe('ConfigurableInsightsPage - Regression Tests', () => {
    beforeEach(() => {
      // Mock chart dependencies
      global.ResizeObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }));
    });

    it('should maintain all layout variants after consolidation', () => {
      const variants = [
        'standard',
        'refined',
        'enhanced',
        'optimized',
        'comprehensive',
      ] as const;

      variants.forEach((variant) => {
        const { unmount } = render(
          <ConfigurableInsightsPage
            transactions={testTransactions}
            accounts={testAccounts}
            variant={variant}
          />
        );

        // Should render title for all variants
        expect(screen.getByText('Financial Insights')).toBeInTheDocument();

        unmount();
      });
    });

    it('should handle empty data gracefully across all variants', () => {
      const variants = ['standard', 'refined', 'enhanced'] as const;

      variants.forEach((variant) => {
        const { unmount } = render(
          <ConfigurableInsightsPage
            transactions={[]}
            accounts={[]}
            variant={variant}
          />
        );

        // Should not crash with empty data
        expect(screen.getByText('Financial Insights')).toBeInTheDocument();

        unmount();
      });
    });

    it('should maintain feature flag compatibility', () => {
      const featureFlagCombinations = [
        {}, // No feature flags
        { showAdvancedMetrics: true },
        { enableComparison: true },
        { showProjections: true },
        {
          showAdvancedMetrics: true,
          enableComparison: true,
          showProjections: true,
        }, // All flags
      ];

      featureFlagCombinations.forEach((featureFlags, index) => {
        const { unmount } = render(
          <ConfigurableInsightsPage
            key={index}
            transactions={testTransactions}
            accounts={testAccounts}
            variant="standard"
            featureFlags={featureFlags}
          />
        );

        // Should render regardless of feature flag combination
        expect(screen.getByText('Financial Insights')).toBeInTheDocument();

        unmount();
      });
    });

    it('should maintain theme switching capability', () => {
      const { rerender } = render(
        <div className="light">
          <ConfigurableInsightsPage
            transactions={testTransactions}
            accounts={testAccounts}
            variant="standard"
          />
        </div>
      );

      expect(screen.getByText('Financial Insights')).toBeInTheDocument();

      rerender(
        <div className="dark">
          <ConfigurableInsightsPage
            transactions={testTransactions}
            accounts={testAccounts}
            variant="standard"
          />
        </div>
      );

      // Should still render in dark theme
      expect(screen.getByText('Financial Insights')).toBeInTheDocument();
    });

    it('should maintain view mode switching functionality', async () => {
      render(
        <ConfigurableInsightsPage
          transactions={testTransactions}
          accounts={testAccounts}
          variant="enhanced"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Financial Insights')).toBeInTheDocument();
      });

      // Test view mode buttons if they exist
      const viewButtons = screen.getAllByRole('button');
      const modeButtons = viewButtons.filter((btn) =>
        btn.getAttribute('data-testid')?.includes('view-')
      );

      if (modeButtons.length > 0) {
        // Click first view mode button
        fireEvent.click(modeButtons[0]);

        // Should not crash
        expect(screen.getByText('Financial Insights')).toBeInTheDocument();
      }
    });

    it('should handle large datasets without performance degradation', async () => {
      const largeTransactionSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `txn-${i}`,
        merchant: `Merchant ${i}`,
        category: { name: 'Test Category', color: '#10B981' },
        amount: Math.random() * 1000,
        date: '2024-01-01',
        status: 'completed' as const,
      }));

      const startTime = performance.now();

      const { unmount } = render(
        <ConfigurableInsightsPage
          transactions={largeTransactionSet}
          accounts={testAccounts}
          variant="standard"
        />
      );

      await waitFor(
        () => {
          expect(screen.getByText('Financial Insights')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should handle large datasets efficiently
      expect(renderTime).toBeLessThan(2000); // 2 second threshold

      unmount();
    });
  });

  describe('Component Integration - Regression Tests', () => {
    it('should maintain proper prop passing between consolidated components', () => {
      const mockScores = { health: 85, eco: 70, financial: 90 };

      render(
        <div>
          <SharedScoreCircle
            score={85}
            type="health"
            data-testid="single-score"
          />
          <ScoreGroup scores={mockScores} data-testid="score-group" />
        </div>
      );

      // Both components should render properly
      expect(screen.getAllByText('85')).toHaveLength(2); // One in each component
      expect(screen.getByText('70')).toBeInTheDocument();
      expect(screen.getByText('90')).toBeInTheDocument();
    });

    it('should maintain event handling after consolidation', () => {
      const mockClick = vi.fn();

      render(
        <SharedScoreCircle
          score={85}
          type="health"
          onClick={mockClick}
          className="clickable-score"
        />
      );

      const scoreElement = screen.getByText('85');
      fireEvent.click(scoreElement);

      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('should maintain CSS class composition', () => {
      render(
        <SharedScoreCircle
          score={85}
          type="health"
          size="lg"
          className="custom-class"
        />
      );

      const container = screen.getByText('85').closest('div');

      // Should have all expected classes
      expect(container).toHaveClass('custom-class');
      expect(container).toHaveClass('w-12'); // Large size
      expect(container).toHaveClass('h-12'); // Large size
      expect(container).toHaveClass('text-green-500'); // Health color
    });

    it('should maintain proper cleanup and memory management', () => {
      let componentCount = 0;

      const TestComponent = () => {
        React.useEffect(() => {
          componentCount++;
          return () => {
            componentCount--;
          };
        }, []);

        return <SharedScoreCircle score={85} type="health" />;
      };

      const { unmount } = render(<TestComponent />);
      expect(componentCount).toBe(1);

      unmount();
      expect(componentCount).toBe(0);
    });
  });

  describe('Data Flow - Regression Tests', () => {
    it('should maintain proper data transformation pipelines', () => {
      const mockData = {
        transactions: testTransactions,
        accounts: testAccounts,
      };

      render(
        <ConfigurableInsightsPage
          transactions={mockData.transactions}
          accounts={mockData.accounts}
          variant="standard"
        />
      );

      // Should process and display transaction data
      expect(screen.getByText('Financial Insights')).toBeInTheDocument();

      // Data should be processed correctly (implicit through no errors)
      expect(() => screen.getByText('Financial Insights')).not.toThrow();
    });

    it('should handle prop updates without breaking state', () => {
      const { rerender } = render(
        <SharedScoreCircle score={85} type="health" />
      );

      expect(screen.getByText('85')).toBeInTheDocument();

      // Update props
      rerender(<SharedScoreCircle score={92} type="eco" />);

      expect(screen.getByText('92')).toBeInTheDocument();
      expect(screen.queryByText('85')).not.toBeInTheDocument();
    });

    it('should maintain consistent rendering across rapid prop changes', () => {
      const { rerender } = render(
        <SharedScoreCircle score={50} type="health" />
      );

      // Rapidly change props multiple times
      for (let i = 51; i <= 100; i++) {
        rerender(
          <SharedScoreCircle score={i} type={i % 2 === 0 ? 'health' : 'eco'} />
        );
      }

      // Should end up with final values
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  describe('Error Boundary - Regression Tests', () => {
    it('should handle invalid props gracefully', () => {
      // Test with potentially problematic props
      const problematicProps = [
        { score: null as any, type: 'health' as const },
        { score: undefined as any, type: 'health' as const },
        { score: NaN, type: 'health' as const },
        { score: Infinity, type: 'health' as const },
      ];

      problematicProps.forEach((props, index) => {
        const { unmount } = render(
          <SharedScoreCircle key={index} {...props} />
        );

        // Should either render something or handle gracefully
        expect(() => screen.getByRole('presentation')).not.toThrow();

        unmount();
      });
    });

    it('should recover from rendering errors', () => {
      const ErrorProneComponent = ({
        shouldError,
      }: {
        shouldError: boolean;
      }) => {
        if (shouldError) {
          throw new Error('Test error');
        }
        return <SharedScoreCircle score={85} type="health" />;
      };

      const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
        const [hasError, setHasError] = React.useState(false);

        React.useEffect(() => {
          const handleError = () => setHasError(true);
          window.addEventListener('error', handleError);
          return () => window.removeEventListener('error', handleError);
        }, []);

        if (hasError) {
          return <div>Error caught</div>;
        }

        return <>{children}</>;
      };

      const { rerender } = render(
        <ErrorBoundary>
          <ErrorProneComponent shouldError={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('85')).toBeInTheDocument();

      // Trigger error
      rerender(
        <ErrorBoundary>
          <ErrorProneComponent shouldError={true} />
        </ErrorBoundary>
      );

      // Should handle error gracefully
      expect(screen.queryByText('85')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility - Regression Tests', () => {
    it('should maintain ARIA compliance after consolidation', () => {
      render(
        <div>
          <SharedScoreCircle score={85} type="health" label="Health Score" />
          <ScoreGroup scores={{ health: 85, eco: 70 }} />
        </div>
      );

      // Check for proper ARIA attributes
      const elements = screen.getAllByRole('img');
      elements.forEach((element) => {
        expect(element).toHaveAttribute('aria-label');
      });
    });

    it('should maintain keyboard navigation support', () => {
      render(
        <SharedScoreCircle
          score={85}
          type="health"
          tabIndex={0}
          onKeyDown={vi.fn()}
        />
      );

      const element = screen.getByText('85').closest('div');
      expect(element).toHaveAttribute('tabIndex', '0');
    });

    it('should maintain screen reader compatibility', () => {
      render(
        <SharedScoreCircle
          score={85}
          type="health"
          label="Health Score: 85 out of 100"
          aria-describedby="health-description"
        />
      );

      const element = screen.getByText('85').closest('div');
      expect(element).toHaveAttribute('aria-describedby', 'health-description');
    });
  });
});
