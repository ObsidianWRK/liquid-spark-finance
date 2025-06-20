import React, { useState, useMemo } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MultiLineChart } from '@/shared/ui/lightweight-charts';
import { CategoryTrend } from '@/features/mockHistoricalData';

interface CategoryTrendsChartProps {
  data: CategoryTrend[];
  type: 'health' | 'eco';
  title: string;
}

const CategoryTrendsChart: React.FC<CategoryTrendsChartProps> = ({ data, type, title }) => {
  const healthCategories = ['fitness', 'nutrition', 'healthcare', 'wellness', 'supplements', 'mentalHealth'];
  const ecoCategories = ['sustainableFood', 'renewableEnergy', 'ecoTransport', 'greenProducts', 'carbonOffset', 'conservation'];
  
  const categories = type === 'health' ? healthCategories : ecoCategories;
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(new Set(categories.slice(0, 4))); // Show first 4 by default
  
  const categoryColors = {
    // Health categories
    fitness: '#10b981',
    nutrition: '#f59e0b',
    healthcare: '#3b82f6',
    wellness: '#ef4444',
    supplements: '#8b5cf6',
    mentalHealth: '#06b6d4',
    // Eco categories
    sustainableFood: '#10b981',
    renewableEnergy: '#f59e0b',
    ecoTransport: '#3b82f6',
    greenProducts: '#8b5cf6',
    carbonOffset: '#059669',
    conservation: '#0d9488'
  };

  const categoryLabels = {
    fitness: 'Fitness',
    nutrition: 'Nutrition',
    healthcare: 'Healthcare',
    wellness: 'Wellness',
    supplements: 'Supplements',
    mentalHealth: 'Mental Health',
    sustainableFood: 'Sustainable Food',
    renewableEnergy: 'Renewable Energy',
    ecoTransport: 'Eco Transport',
    greenProducts: 'Green Products',
    carbonOffset: 'Carbon Offset',
    conservation: 'Conservation'
  };

  // Create lines configuration for visible categories
  const lines = useMemo(() => {
    return Array.from(visibleCategories).map(category => ({
      dataKey: category,
      stroke: categoryColors[category as keyof typeof categoryColors],
      label: categoryLabels[category as keyof typeof categoryLabels]
    }));
  }, [visibleCategories]);

  const toggleCategory = (category: string) => {
    const newVisible = new Set(visibleCategories);
    if (newVisible.has(category)) {
      newVisible.delete(category);
    } else {
      newVisible.add(category);
    }
    setVisibleCategories(newVisible);
  };

  return (
    <div className="liquid-glass-fallback rounded-2xl p-6">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{title}</h3>
      
      {/* Category Toggle Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
              visibleCategories.has(category)
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
            style={visibleCategories.has(category) ? {
              borderColor: categoryColors[category as keyof typeof categoryColors],
              boxShadow: `0 0 10px ${categoryColors[category as keyof typeof categoryColors]}20`
            } : {}}
          >
            {categoryLabels[category as keyof typeof categoryLabels]}
          </button>
        ))}
      </div>

      <div className="h-80">
        <MultiLineChart
          data={data as any[]}
          lines={lines}
          width={600}
          height={300}
          xAxisKey="date"
          showLegend={false} // We have our own category toggles
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default CategoryTrendsChart; 