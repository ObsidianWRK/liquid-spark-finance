import React, { useState, useMemo } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MultiLineChart } from '@/shared/ui/lightweight-charts';
import { CategoryTrend } from '@/features/mockHistoricalData';
import { VueniCharts } from '@/theme/colors/vueniPalette';

interface CategoryTrendsChartProps {
  data: CategoryTrend[];
  type: 'health' | 'eco';
  title: string;
}

const CategoryTrendsChart: React.FC<CategoryTrendsChartProps> = ({
  data,
  type,
  title,
}) => {
  const healthCategories = [
    'fitness',
    'nutrition',
    'healthcare',
    'wellness',
    'supplements',
    'mentalHealth',
  ];
  const ecoCategories = [
    'sustainableFood',
    'renewableEnergy',
    'ecoTransport',
    'greenProducts',
    'carbonOffset',
    'conservation',
  ];

  const categories = type === 'health' ? healthCategories : ecoCategories;
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    new Set(categories.slice(0, 4))
  ); // Show first 4 by default

  const categoryColors = {
    // Health categories using VueniCharts
    fitness: VueniCharts.primary[0], // #516AC8 (Sapphire Dust)
    nutrition: VueniCharts.primary[1], // #E3AF64 (Caramel Essence)
    healthcare: VueniCharts.primary[2], // #26428B (Blue Oblivion)
    wellness: VueniCharts.primary[3], // #4ABA70 (Success)
    supplements: VueniCharts.primary[4], // #D64545 (Error)
    mentalHealth: VueniCharts.primary[5], // #8B8478 (Neutral)
    // Eco categories using VueniCharts
    sustainableFood: VueniCharts.primary[0], // #516AC8 (Sapphire Dust)
    renewableEnergy: VueniCharts.primary[1], // #E3AF64 (Caramel Essence)
    ecoTransport: VueniCharts.primary[2], // #26428B (Blue Oblivion)
    greenProducts: VueniCharts.primary[3], // #4ABA70 (Success)
    carbonOffset: VueniCharts.primary[4], // #D64545 (Error)
    conservation: VueniCharts.primary[5], // #8B8478 (Neutral)
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
    conservation: 'Conservation',
  };

  // Create lines configuration for visible categories
  const lines = useMemo(() => {
    return Array.from(visibleCategories).map((category) => ({
      dataKey: category,
      stroke: categoryColors[category as keyof typeof categoryColors],
      label: categoryLabels[category as keyof typeof categoryLabels],
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
    <div className="liquid-glass-fallback rounded-vueni-lg p-6">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{title}</h3>

      {/* Category Toggle Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-3 py-1 rounded-vueni-lg text-xs font-medium transition-all duration-200 ${
              visibleCategories.has(category)
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
            style={
              visibleCategories.has(category)
                ? {
                    borderColor:
                      categoryColors[category as keyof typeof categoryColors],
                    boxShadow: `0 0 10px ${categoryColors[category as keyof typeof categoryColors]}20`,
                  }
                : {}
            }
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
