import React, { useEffect, useState } from 'react';
import { UniversalCard } from '@/components/ui/UniversalCard';
import { 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Heart, 
  Leaf, 
  PiggyBank,
  CreditCard,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';

// Consolidated data service that replaces multiple service imports
const useInsightsData = () => {
  const [data, setData] = useState({
    financial: {
      score: 78,
      trend: 'up' as const,
      trendValue: '+5%',
      metrics: [
        { label: 'Total Wealth', value: '$67,432', icon: DollarSign, color: '#10b981' },
        { label: 'Credit Score', value: '742', icon: Shield, color: '#3b82f6' },
        { label: 'Monthly Savings', value: '$1,245', icon: PiggyBank, color: '#8b5cf6' },
        { label: 'Investments', value: '$23,567', icon: TrendingUp, color: '#f59e0b' }
      ],
      trends: [
        { label: 'Income', trend: 'up' as const, value: '+12%' },
        { label: 'Expenses', trend: 'down' as const, value: '-3%' },
        { label: 'Savings Rate', trend: 'up' as const, value: '+8%' },
        { label: 'Debt Ratio', trend: 'down' as const, value: '-15%' }
      ]
    },
    wellness: {
      score: 85,
      trend: 'up' as const,
      trendValue: '+8%',
      metrics: [
        { label: 'Sleep Quality', value: '8.2/10', icon: Heart, color: '#ef4444' },
        { label: 'Exercise Days', value: '5/week', icon: Activity, color: '#10b981' },
        { label: 'Stress Level', value: 'Low', icon: Shield, color: '#3b82f6' },
        { label: 'Nutrition', value: 'Good', icon: Leaf, color: '#84cc16' }
      ],
      trends: [
        { label: 'Energy', trend: 'up' as const, value: '+15%' },
        { label: 'Mood', trend: 'up' as const, value: '+10%' },
        { label: 'Focus', trend: 'stable' as const, value: '0%' },
        { label: 'Recovery', trend: 'up' as const, value: '+7%' }
      ]
    },
    eco: {
      score: 72,
      trend: 'up' as const,
      trendValue: '+12%',
      metrics: [
        { label: 'Carbon Footprint', value: '2.1 tons', icon: Leaf, color: '#10b981' },
        { label: 'Recycling Rate', value: '87%', icon: Shield, color: '#3b82f6' },
        { label: 'Green Spending', value: '$234', icon: DollarSign, color: '#84cc16' },
        { label: 'Energy Saved', value: '34 kWh', icon: Activity, color: '#f59e0b' }
      ],
      spending: [
        { category: 'Sustainable Products', amount: 156 },
        { category: 'Public Transport', amount: 78 },
        { category: 'Renewable Energy', amount: 89 },
        { category: 'Local Food', amount: 234 }
      ]
    },
    spending: {
      trends: [
        { label: 'Groceries', trend: 'up' as const, value: '+5%' },
        { label: 'Entertainment', trend: 'down' as const, value: '-12%' },
        { label: 'Transport', trend: 'stable' as const, value: '0%' },
        { label: 'Utilities', trend: 'down' as const, value: '-8%' }
      ],
      spending: [
        { category: 'Groceries', amount: 678 },
        { category: 'Entertainment', amount: 234 },
        { category: 'Transport', amount: 156 },
        { category: 'Utilities', amount: 289 },
        { category: 'Healthcare', amount: 123 },
        { category: 'Shopping', amount: 445 }
      ]
    }
  });

  useEffect(() => {
    // Simulate data loading with proper cleanup
    const timeoutId = setTimeout(() => {
      // In a real app, this would fetch from APIs
      setData(prevData => ({
        ...prevData,
        // Add some randomization to simulate live data
        financial: {
          ...prevData.financial,
          score: Math.max(60, Math.min(100, prevData.financial.score + Math.random() * 4 - 2))
        }
      }));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  return data;
};

export const ConsolidatedInsightsPage: React.FC = () => {
  const data = useInsightsData();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Financial Insights Dashboard
        </h1>
        <p className="text-white/70">
          Comprehensive view of your financial wellness, eco impact, and spending patterns
        </p>
      </div>

      {/* Main Score Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UniversalCard
          variant="financial"
          title="Financial Health"
          icon={DollarSign}
          iconColor="#10b981"
          score={data.financial.score}
          trend={data.financial.trend}
          trendValue={data.financial.trendValue}
          data={{ metrics: data.financial.metrics.slice(0, 2) }}
          interactive
          onClick={() => console.log('Navigate to financial details')}
        />

        <UniversalCard
          variant="wellness"
          title="Wellness Score"
          icon={Heart}
          iconColor="#ef4444"
          score={data.wellness.score}
          trend={data.wellness.trend}
          trendValue={data.wellness.trendValue}
          data={{ metrics: data.wellness.metrics.slice(0, 2) }}
          interactive
          onClick={() => console.log('Navigate to wellness details')}
        />

        <UniversalCard
          variant="eco"
          title="Eco Impact"
          icon={Leaf}
          iconColor="#10b981"
          score={data.eco.score}
          trend={data.eco.trend}
          trendValue={data.eco.trendValue}
          data={{ metrics: data.eco.metrics.slice(0, 2) }}
          interactive
          onClick={() => console.log('Navigate to eco details')}
        />
      </div>

      {/* Detailed Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UniversalCard
          variant="glass"
          title="Financial Metrics"
          icon={BarChart3}
          iconColor="#6366f1"
          data={{ 
            metrics: data.financial.metrics,
            trends: data.financial.trends 
          }}
          size="lg"
        />

        <UniversalCard
          variant="glass"
          title="Wellness Tracking"
          icon={Activity}
          iconColor="#ef4444"
          data={{ 
            metrics: data.wellness.metrics,
            trends: data.wellness.trends 
          }}
          size="lg"
        />
      </div>

      {/* Spending Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UniversalCard
          variant="glass"
          title="Eco Spending"
          icon={Leaf}
          iconColor="#10b981"
          data={{ 
            metrics: data.eco.metrics.slice(2, 4),
            spending: data.eco.spending 
          }}
          size="lg"
        />

        <UniversalCard
          variant="glass"
          title="Category Spending"
          icon={CreditCard}
          iconColor="#8b5cf6"
          data={{ 
            trends: data.spending.trends,
            spending: data.spending.spending 
          }}
          size="lg"
        />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <UniversalCard
          variant="minimal"
          title="Savings Goal"
          icon={Target}
          iconColor="#f59e0b"
          value="78%"
          size="sm"
          interactive
          onClick={() => console.log('Navigate to savings goals')}
        />

        <UniversalCard
          variant="minimal"
          title="Credit Monitor"
          icon={Shield}
          iconColor="#3b82f6"
          value="742"
          trend="up"
          trendValue="+12"
          size="sm"
          interactive
          onClick={() => console.log('Navigate to credit monitoring')}
        />

        <UniversalCard
          variant="minimal"
          title="Investment Growth"
          icon={TrendingUp}
          iconColor="#10b981"
          value="+15.2%"
          trend="up"
          trendValue="This month"
          size="sm"
          interactive
          onClick={() => console.log('Navigate to investments')}
        />

        <UniversalCard
          variant="minimal"
          title="Budget Status"
          icon={PiggyBank}
          iconColor="#8b5cf6"
          value="On Track"
          trend="stable"
          size="sm"
          interactive
          onClick={() => console.log('Navigate to budget')}
        />
      </div>
    </div>
  );
};

export default ConsolidatedInsightsPage; 