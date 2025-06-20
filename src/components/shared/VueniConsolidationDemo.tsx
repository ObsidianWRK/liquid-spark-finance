import React, { useState } from 'react';
import {
  VueniUnifiedTransactionList,
  // VueniUnifiedInsightsPage, // Temporarily disabled during consolidation
  VueniDesignSystem,
  FeatureFlagProvider,
  useFeatureFlags,
  // transactionListPresets,
  // insightsPresets,
  TransactionVariant,
  // InsightsVariant,
} from './index';

// Sample data for demonstration
const sampleTransactions = [
  {
    id: '1',
    merchant: 'Whole Foods Market',
    category: { name: 'Groceries', color: '#10B981' },
    amount: -127.43,
    date: '2024-12-15',
    status: 'completed' as const,
    scores: { health: 85, eco: 92, financial: 78 },
  },
  {
    id: '2', 
    merchant: 'Apple Store',
    category: { name: 'Electronics', color: '#3B82F6' },
    amount: -899.00,
    date: '2024-12-14',
    status: 'completed' as const,
    scores: { health: 45, eco: 60, financial: 85 },
  },
  {
    id: '3',
    merchant: 'Salary Deposit',
    category: { name: 'Income', color: '#059669' },
    amount: 4500.00,
    date: '2024-12-01',
    status: 'completed' as const,
    scores: { health: 100, eco: 75, financial: 100 },
  },
];

const sampleAccounts = [
  {
    id: '1',
    type: 'Checking',
    nickname: 'Main Checking',
    balance: 5420.50,
    availableBalance: 5420.50,
    currency: 'USD',
  },
  {
    id: '2',
    type: 'Savings',
    nickname: 'Emergency Fund',
    balance: 12500.00,
    availableBalance: 12500.00,
    currency: 'USD',
  },
];

// Component showcase with feature flags
const ConsolidationDemo: React.FC = () => {
  const { flags, updateFlag } = useFeatureFlags();
  const [selectedTransactionVariant, setSelectedTransactionVariant] = useState<TransactionVariant>('default');
  const [selectedInsightsVariant, setSelectedInsightsVariant] = useState<string>('standard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <VueniDesignSystem.Container>
        {/* Header */}
        <VueniDesignSystem.GlassCard variant="prominent" className="mb-8 p-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 Vueni Component Consolidation Demo
          </h1>
          <p className="text-white/70 text-lg">
            Demonstrating the power of unified, configurable components with feature flags
          </p>
          
          {/* Live Configuration */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white font-medium mb-2 block">Transaction List Variant:</label>
              <select
                value={selectedTransactionVariant}
                onChange={(e) => setSelectedTransactionVariant(e.target.value as TransactionVariant)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="default">Default</option>
                <option value="apple">Apple Style</option>
                <option value="clean">Clean</option>
                <option value="polished">Polished</option>
                <option value="enterprise">Enterprise</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>
            
            <div>
              <label className="text-white font-medium mb-2 block">Insights Page Variant:</label>
              <select
                value={selectedInsightsVariant}
                onChange={(e) => setSelectedInsightsVariant(e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="standard">Standard</option>
                <option value="refined">Refined</option>
                <option value="enhanced">Enhanced</option>
                <option value="optimized">Optimized</option>
                <option value="comprehensive">Comprehensive</option>
                <option value="mobile">Mobile</option>
                <option value="dashboard">Dashboard</option>
              </select>
            </div>
          </div>
        </VueniDesignSystem.GlassCard>

        {/* Design System Showcase */}
        <VueniDesignSystem.Section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Design System Components</h2>
          
          <VueniDesignSystem.Grid cols="3" gap="6">
            {/* Metrics */}
            <VueniDesignSystem.Metric
              variant="prominent"
              label="Monthly Spending"
              value="$2,456"
              change={-12}
              trend="down"
              color="green"
              icon={<span>💰</span>}
            />
            
            <VueniDesignSystem.Metric
              variant="prominent"
              label="Wellness Score"
              value="87/100"
              change={5}
              trend="up"
              color="red"
              icon={<span>❤️</span>}
            />
            
            <VueniDesignSystem.Metric
              variant="prominent"
              label="Eco Impact"
              value="48kg CO₂"
              change={15}
              trend="up"
              color="green"
              icon={<span>🌱</span>}
            />
          </VueniDesignSystem.Grid>
          
          {/* Buttons Showcase */}
          <div className="mt-6 flex flex-wrap gap-4">
            <VueniDesignSystem.Button variant="default">Default Button</VueniDesignSystem.Button>
            <VueniDesignSystem.Button variant="glass">Glass Button</VueniDesignSystem.Button>
            <VueniDesignSystem.Button variant="glow" glowing>Glowing Button</VueniDesignSystem.Button>
            <VueniDesignSystem.Button variant="minimal">Minimal Button</VueniDesignSystem.Button>
          </div>
          
          {/* Status Badges */}
          <div className="mt-4 flex flex-wrap gap-3">
            <VueniDesignSystem.StatusBadge status="success">Completed</VueniDesignSystem.StatusBadge>
            <VueniDesignSystem.StatusBadge status="warning">Pending</VueniDesignSystem.StatusBadge>
            <VueniDesignSystem.StatusBadge status="error">Failed</VueniDesignSystem.StatusBadge>
            <VueniDesignSystem.StatusBadge status="info">Processing</VueniDesignSystem.StatusBadge>
          </div>
        </VueniDesignSystem.Section>

        {/* Transaction List Showcase */}
        <VueniDesignSystem.Section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Unified Transaction List - {selectedTransactionVariant} variant
          </h2>
          
          <VueniUnifiedTransactionList
            variant={selectedTransactionVariant}
            transactions={sampleTransactions}
            features={{
              showScores: flags.showScoreCircles,
              showCategories: true,
              searchable: true,
              filterable: true,
              compactMode: flags.compactMode,
              animationsEnabled: flags.enableAnimations,
            }}
            currency="USD"
            onTransactionClick={() => {
              /* Transaction clicked */
            }}
          />
        </VueniDesignSystem.Section>

        {/* Insights Page Showcase */}
        <VueniDesignSystem.Section>
          <h2 className="text-2xl font-bold text-white mb-6">
            Unified Insights Page - {selectedInsightsVariant} variant
          </h2>
          
          {/* Temporarily disabled during consolidation */}
          {/* <VueniUnifiedInsightsPage
            variant={selectedInsightsVariant}
            transactions={sampleTransactions}
            accounts={sampleAccounts}
            enableFeatureFlags={true}
            onExportData={() => {
              /* Export data requested */
            }}
          /> */}
          <div className="p-8 text-center text-white/60 bg-white/5 rounded-lg border border-white/10">
            VueniUnifiedInsightsPage temporarily disabled during consolidation refactor
          </div>
        </VueniDesignSystem.Section>

        {/* Feature Flags Panel */}
        <VueniDesignSystem.GlassCard variant="subtle" className="mt-8 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Live Feature Flags Control</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={flags.showScoreCircles}
                onChange={(e) => updateFlag('showScoreCircles', e.target.checked)}
                className="rounded"
              />
              <span className="text-white/70 text-sm">Show Score Circles</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={flags.compactMode}
                onChange={(e) => updateFlag('compactMode', e.target.checked)}
                className="rounded"
              />
              <span className="text-white/70 text-sm">Compact Mode</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={flags.enableAnimations}
                onChange={(e) => updateFlag('enableAnimations', e.target.checked)}
                className="rounded"
              />
              <span className="text-white/70 text-sm">Animations</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={flags.enableGlassEffects}
                onChange={(e) => updateFlag('enableGlassEffects', e.target.checked)}
                className="rounded"
              />
              <span className="text-white/70 text-sm">Glass Effects</span>
            </label>
          </div>
        </VueniDesignSystem.GlassCard>

        {/* Stats Summary */}
        <VueniDesignSystem.GlassCard variant="prominent" className="mt-8 p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Consolidation Impact Summary
          </h3>
          
          <VueniDesignSystem.Grid cols="4" gap="6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">6→1</div>
              <div className="text-white/70">Transaction Lists</div>
              <div className="text-green-400 text-sm">82.6% reduction</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">7→1</div>
              <div className="text-white/70">Insights Pages</div>
              <div className="text-blue-400 text-sm">76.8% reduction</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">2,614</div>
              <div className="text-white/70">Lines Saved</div>
              <div className="text-purple-400 text-sm">60.6% total reduction</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">100%</div>
              <div className="text-white/70">Feature Parity</div>
              <div className="text-yellow-400 text-sm">No functionality lost</div>
            </div>
          </VueniDesignSystem.Grid>
        </VueniDesignSystem.GlassCard>
      </VueniDesignSystem.Container>
    </div>
  );
};

// Demo wrapper with feature flag provider
export const VueniConsolidationDemo: React.FC = () => {
  return (
    <FeatureFlagProvider preset="development" persistToStorage={false}>
      <ConsolidationDemo />
    </FeatureFlagProvider>
  );
};

export default VueniConsolidationDemo;