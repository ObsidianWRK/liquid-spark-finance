import React from 'react';
import { Leaf } from 'lucide-react';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { 
  getMockEcoData, 
  getEcoCategories,
  getEcoScoreLabel,
  getEcoScoreColor,
  type EcoMetrics,
  type EcoSpendingCategories,
  type EcoMonthlyImpact,
  type EcoTrends
} from '@/services/ecoService';

interface RefactoredEcoCardProps {
  score?: number;
  ecoMetrics?: Partial<EcoMetrics>;
  spendingCategories?: EcoSpendingCategories;
  monthlyImpact?: EcoMonthlyImpact;
  trends?: EcoTrends;
}

const RefactoredEcoCard: React.FC<RefactoredEcoCardProps> = ({
  score,
  ecoMetrics,
  spendingCategories,
  monthlyImpact,
  trends
}) => {
  // Use mock data if no props provided (for demonstration)
  const mockData = getMockEcoData();
  const finalScore = score ?? mockData.score;
  const finalMetrics = ecoMetrics ?? mockData.ecoMetrics;
  const finalSpending = spendingCategories ?? mockData.spendingCategories;
  const finalImpact = monthlyImpact ?? mockData.monthlyImpact;
  const finalTrends = trends ?? mockData.trends;

  // Transform data for UniversalCard
  const cardData = {
    metrics: [
      { label: 'CO₂ Saved', value: `${finalImpact.co2Saved}kg`, color: '#22c55e' },
      { label: 'Trees Equivalent', value: finalImpact.treesEquivalent.toString(), color: '#22c55e' },
      { label: 'Water Saved', value: `${finalImpact.waterSaved}L`, color: '#06b6d4' },
      { label: 'Energy Saved', value: `${finalImpact.energySaved}kWh`, color: '#f59e0b' }
    ],
    trends: [
      { label: 'Carbon Footprint', trend: finalTrends.carbonFootprint },
      { label: 'Sustainability', trend: finalTrends.sustainability },
      { label: 'Renewable', trend: finalTrends.renewable },
      { label: 'Waste', trend: finalTrends.waste }
    ],
    spending: Object.entries(finalSpending).map(([category, amount]) => ({
      category: category.replace(/([A-Z])/g, ' $1').toLowerCase(),
      amount
    }))
  };

  return (
    <UniversalCard
      variant="eco"
      size="lg"
      title="Eco Impact"
      icon={Leaf}
      iconColor={getEcoScoreColor(finalScore)}
      score={finalScore}
      trend="up"
      trendValue={`${getEcoScoreLabel(finalScore)}`}
      data={cardData}
      interactive={true}
    />
  );
};

export default RefactoredEcoCard; 