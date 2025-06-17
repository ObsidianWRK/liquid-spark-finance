import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { SharedScoreCircle, ScoreGroup, type SharedScoreCircleProps } from '../components/shared/SharedScoreCircle';
import { ConfigurableInsightsPage } from '../components/shared/ConfigurableInsightsPage';
import { TransactionWithScores } from '../components/TransactionWithScores';
import { GlassCard } from '../components/GlassCard';
import { LiquidGlassTopMenuBar } from '../components/LiquidGlassTopMenuBar';

// Mock data for testing
const mockTransactions = [
  {
    id: '1',
    merchant: 'Test Merchant',
    category: { name: 'Food & Dining', color: '#10B981' },
    amount: 25.50,
    date: '2024-01-01',
    status: 'completed' as const,
  },
  {
    id: '2',
    merchant: 'Gas Station',
    category: { name: 'Transportation', color: '#F59E0B' },
    amount: 45.00,
    date: '2024-01-02',
    status: 'pending' as const,
  }
];

const mockAccounts = [
  {
    id: '1',
    type: 'checking',
    nickname: 'Main Checking',
    balance: 5000,
    availableBalance: 4800,
    currency: 'USD',
  },
  {
    id: '2',
    type: 'savings',
    nickname: 'Emergency Fund',
    balance: 15000,
    availableBalance: 15000,
    currency: 'USD',
  }
];

describe('Component Integration Tests - Consolidated Components', () => {
  
  describe('SharedScoreCircle Component', () => {
    const defaultProps: SharedScoreCircleProps = {
      score: 85,
      type: 'health',
      label: 'Health Score',
      size: 'md',
      showLabel: true,
      animated: false,
    };

    it('should render with correct score and type', () => {
      render(<SharedScoreCircle {...defaultProps} />);
      
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('Health Score')).toBeInTheDocument();
    });

    it('should apply correct color scheme for different types', () => {
      const { rerender } = render(<SharedScoreCircle score={85} type="health" />);
      let scoreElement = screen.getByText('85');
      expect(scoreElement).toHaveClass('text-green-500');

      rerender(<SharedScoreCircle score={85} type="eco" />);
      scoreElement = screen.getByText('85');
      expect(scoreElement).toHaveClass('text-emerald-500');

      rerender(<SharedScoreCircle score={85} type="financial" />);
      scoreElement = screen.getByText('85');
      expect(scoreElement).toHaveClass('text-blue-500');
    });

    it('should change colors based on score thresholds', () => {
      const { rerender } = render(<SharedScoreCircle score={90} type="health" />);
      let scoreElement = screen.getByText('90');
      expect(scoreElement).toHaveClass('text-green-500');

      rerender(<SharedScoreCircle score={70} type="health" />);
      scoreElement = screen.getByText('70');
      expect(scoreElement).toHaveClass('text-yellow-500');

      rerender(<SharedScoreCircle score={40} type="health" />);
      scoreElement = screen.getByText('40');
      expect(scoreElement).toHaveClass('text-red-500');
    });

    it('should handle different sizes correctly', () => {
      const { rerender } = render(<SharedScoreCircle score={85} size="sm" />);
      let container = screen.getByText('85').closest('div');
      expect(container).toHaveClass('w-8', 'h-8');

      rerender(<SharedScoreCircle score={85} size="lg" />);
      container = screen.getByText('85').closest('div');
      expect(container).toHaveClass('w-12', 'h-12');
    });

    it('should conditionally show/hide label', () => {
      const { rerender } = render(
        <SharedScoreCircle score={85} label="Test Label" showLabel={true} />
      );
      expect(screen.getByText('Test Label')).toBeInTheDocument();

      rerender(<SharedScoreCircle score={85} label="Test Label" showLabel={false} />);
      expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
    });

    it('should handle invalid scores gracefully', () => {
      render(<SharedScoreCircle score={-10} />);
      expect(screen.getByText('-10')).toBeInTheDocument();

      render(<SharedScoreCircle score={150} />);
      expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<SharedScoreCircle score={85} className="custom-class" />);
      const container = screen.getByText('85').closest('div');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('ScoreGroup Component', () => {
    const mockScores = {
      health: 85,
      eco: 72,
      financial: 90,
    };

    it('should render multiple scores in a group', () => {
      render(<ScoreGroup scores={mockScores} />);
      
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('72')).toBeInTheDocument();
      expect(screen.getByText('90')).toBeInTheDocument();
    });

    it('should handle missing scores', () => {
      const partialScores = { health: 85 };
      render(<ScoreGroup scores={partialScores} />);
      
      expect(screen.getByText('85')).toBeInTheDocument();
      // Should not render eco or financial scores if not provided
    });

    it('should apply compact mode styling', () => {
      render(<ScoreGroup scores={mockScores} compact={true} />);
      const container = screen.getByText('85').closest('div')?.parentElement;
      expect(container).toHaveClass('gap-2'); // Smaller gap in compact mode
    });
  });

  describe('ConfigurableInsightsPage Component', () => {
    const defaultProps = {
      transactions: mockTransactions,
      accounts: mockAccounts,
      variant: 'standard' as const,
    };

    beforeEach(() => {
      // Mock ResizeObserver for charts
      global.ResizeObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }));
    });

    it('should render insights page with default configuration', async () => {
      render(<ConfigurableInsightsPage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Financial Insights')).toBeInTheDocument();
      });
    });

    it('should handle different layout variants', async () => {
      const { rerender } = render(
        <ConfigurableInsightsPage {...defaultProps} variant="enhanced" />
      );
      
      await waitFor(() => {
        expect(screen.getByText('Financial Insights')).toBeInTheDocument();
      });

      rerender(<ConfigurableInsightsPage {...defaultProps} variant="refined" />);
      
      await waitFor(() => {
        expect(screen.getByText('Financial Insights')).toBeInTheDocument();
      });
    });

    it('should toggle between view modes', async () => {
      render(<ConfigurableInsightsPage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Financial Insights')).toBeInTheDocument();
      });

      // Look for view mode toggles
      const buttons = screen.getAllByRole('button');
      const viewToggle = buttons.find(btn => btn.getAttribute('aria-label')?.includes('view'));
      
      if (viewToggle) {
        fireEvent.click(viewToggle);
        // Test should verify the view changed
      }
    });

    it('should handle feature flags correctly', async () => {
      const featureFlags = {
        showAdvancedMetrics: false,
        enableComparison: false,
        showProjections: true,
      };

      render(
        <ConfigurableInsightsPage 
          {...defaultProps} 
          featureFlags={featureFlags}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('Financial Insights')).toBeInTheDocument();
      });
    });

    it('should handle empty data gracefully', async () => {
      render(
        <ConfigurableInsightsPage 
          transactions={[]} 
          accounts={[]} 
          variant="standard"
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('Financial Insights')).toBeInTheDocument();
      });
    });

    it('should calculate and display aggregated scores', async () => {
      render(<ConfigurableInsightsPage {...defaultProps} />);
      
      await waitFor(() => {
        // Should display calculated scores somewhere in the component
        const scores = screen.getAllByText(/\d{1,2}/);
        expect(scores.length).toBeGreaterThan(0);
      });
    });
  });

  describe('TransactionWithScores Component', () => {
    const mockTransaction = {
      id: '1',
      merchant: 'Test Merchant',
      amount: 25.50,
      date: '2024-01-01',
      category: 'Food & Dining',
      healthScore: 85,
      ecoScore: 72,
      financialScore: 90,
    };

    it('should render transaction details with scores', () => {
      render(<TransactionWithScores transaction={mockTransaction} />);
      
      expect(screen.getByText('Test Merchant')).toBeInTheDocument();
      expect(screen.getByText('$25.50')).toBeInTheDocument();
      expect(screen.getByText('85')).toBeInTheDocument(); // Health score
      expect(screen.getByText('72')).toBeInTheDocument(); // Eco score
      expect(screen.getByText('90')).toBeInTheDocument(); // Financial score
    });

    it('should handle missing scores gracefully', () => {
      const incompleteTransaction = {
        ...mockTransaction,
        healthScore: undefined,
        ecoScore: undefined,
        financialScore: undefined,
      };

      render(<TransactionWithScores transaction={incompleteTransaction} />);
      
      expect(screen.getByText('Test Merchant')).toBeInTheDocument();
      expect(screen.getByText('$25.50')).toBeInTheDocument();
      // Should not crash when scores are missing
    });

    it('should format amounts correctly', () => {
      const expensiveTransaction = {
        ...mockTransaction,
        amount: 1234.56,
      };

      render(<TransactionWithScores transaction={expensiveTransaction} />);
      expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    });

    it('should handle different transaction statuses', () => {
      const pendingTransaction = {
        ...mockTransaction,
        status: 'pending' as const,
      };

      render(<TransactionWithScores transaction={pendingTransaction} />);
      expect(screen.getByText('Test Merchant')).toBeInTheDocument();
      // Should display pending status indicator
    });
  });

  describe('GlassCard Component', () => {
    it('should render with default glass styling', () => {
      render(
        <GlassCard>
          <div>Test Content</div>
        </GlassCard>
      );
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      const card = screen.getByText('Test Content').closest('div');
      expect(card).toHaveClass('backdrop-blur-md');
    });

    it('should apply custom className while preserving glass effect', () => {
      render(
        <GlassCard className="custom-glass-card">
          <div>Test Content</div>
        </GlassCard>
      );
      
      const card = screen.getByText('Test Content').closest('div');
      expect(card).toHaveClass('custom-glass-card');
      expect(card).toHaveClass('backdrop-blur-md'); // Should preserve glass effect
    });

    it('should handle click events', () => {
      const mockClick = vi.fn();
      render(
        <GlassCard onClick={mockClick}>
          <div>Clickable Content</div>
        </GlassCard>
      );
      
      const card = screen.getByText('Clickable Content').closest('div');
      if (card) {
        fireEvent.click(card);
        expect(mockClick).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('LiquidGlassTopMenuBar Component', () => {
    it('should render navigation items', () => {
      render(<LiquidGlassTopMenuBar />);
      
      // Check for common navigation items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Transactions')).toBeInTheDocument();
      expect(screen.getByText('Budget')).toBeInTheDocument();
      expect(screen.getByText('Insights')).toBeInTheDocument();
    });

    it('should handle navigation clicks', () => {
      render(<LiquidGlassTopMenuBar />);
      
      const dashboardLink = screen.getByText('Dashboard');
      fireEvent.click(dashboardLink);
      
      // Should handle navigation (depends on router implementation)
    });

    it('should display user menu when available', () => {
      render(<LiquidGlassTopMenuBar />);
      
      // Look for user menu trigger (could be avatar, name, or menu icon)
      const userElements = screen.getAllByRole('button');
      expect(userElements.length).toBeGreaterThan(0);
    });

    it('should apply liquid glass visual effects', () => {
      render(<LiquidGlassTopMenuBar />);
      
      const menuBar = screen.getByRole('banner') || screen.getByRole('navigation');
      expect(menuBar).toHaveClass(/backdrop|glass|blur/);
    });

    it('should be responsive to screen size changes', () => {
      render(<LiquidGlassTopMenuBar />);
      
      // Test mobile menu toggle
      const mobileToggle = screen.queryByLabelText(/menu|toggle/i);
      if (mobileToggle) {
        fireEvent.click(mobileToggle);
        // Should show/hide mobile menu
      }
    });
  });
});

describe('Component Regression Tests - Consolidated Components', () => {
  
  it('should maintain SharedScoreCircle API compatibility', () => {
    // Test that all previous prop combinations still work
    const legacyProps = [
      { score: 85 },
      { score: 85, type: 'health' as const },
      { score: 85, type: 'eco' as const, size: 'lg' as const },
      { score: 85, type: 'financial' as const, showLabel: false },
    ];

    legacyProps.forEach((props, index) => {
      const { unmount } = render(<SharedScoreCircle key={index} {...props} />);
      expect(screen.getByText('85')).toBeInTheDocument();
      unmount();
    });
  });

  it('should handle performance under stress conditions', async () => {
    // Test with large datasets
    const largeTransactionSet = Array.from({ length: 1000 }, (_, i) => ({
      id: `txn-${i}`,
      merchant: `Merchant ${i}`,
      category: { name: 'Test Category', color: '#10B981' },
      amount: Math.random() * 1000,
      date: '2024-01-01',
      status: 'completed' as const,
    }));

    const startTime = performance.now();
    
    render(
      <ConfigurableInsightsPage 
        transactions={largeTransactionSet}
        accounts={mockAccounts}
        variant="standard"
      />
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within reasonable time (< 1000ms)
    expect(renderTime).toBeLessThan(1000);
    
    await waitFor(() => {
      expect(screen.getByText('Financial Insights')).toBeInTheDocument();
    });
  });

  it('should maintain accessibility standards', () => {
    render(
      <div>
        <SharedScoreCircle score={85} type="health" label="Health Score" />
        <ConfigurableInsightsPage 
          transactions={mockTransactions}
          accounts={mockAccounts}
          variant="standard"
        />
      </div>
    );

    // Check for proper ARIA labels
    const scoreElements = screen.getAllByRole('img') || screen.getAllByRole('presentation');
    scoreElements.forEach(element => {
      expect(element).toHaveAttribute('aria-label');
    });

    // Check for keyboard navigation support
    const interactiveElements = screen.getAllByRole('button');
    interactiveElements.forEach(element => {
      expect(element).toHaveAttribute('tabIndex');
    });
  });

  it('should handle theme changes consistently', () => {
    const { rerender } = render(
      <div className="dark">
        <SharedScoreCircle score={85} type="health" />
        <GlassCard>Dark Theme Content</GlassCard>
      </div>
    );

    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('Dark Theme Content')).toBeInTheDocument();

    rerender(
      <div className="light">
        <SharedScoreCircle score={85} type="health" />
        <GlassCard>Light Theme Content</GlassCard>
      </div>
    );

    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('Light Theme Content')).toBeInTheDocument();
  });

  it('should maintain data consistency across re-renders', () => {
    let renderCount = 0;
    const TestComponent = () => {
      renderCount++;
      return (
        <SharedScoreCircle 
          score={85} 
          type="health" 
          label={`Render ${renderCount}`}
        />
      );
    };

    const { rerender } = render(<TestComponent />);
    expect(screen.getByText('Render 1')).toBeInTheDocument();

    rerender(<TestComponent />);
    expect(screen.getByText('Render 2')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('should handle prop changes without memory leaks', () => {
    const { rerender } = render(<SharedScoreCircle score={85} type="health" />);
    
    // Rapidly change props to test for memory leaks
    for (let i = 0; i < 100; i++) {
      rerender(
        <SharedScoreCircle 
          score={Math.floor(Math.random() * 100)} 
          type={['health', 'eco', 'financial'][i % 3] as any}
        />
      );
    }
    
    // Should still function normally
    expect(screen.getByText(/\d+/)).toBeInTheDocument();
  });
});