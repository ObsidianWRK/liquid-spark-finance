import React, { useState, useEffect } from 'react';
import { Leaf, Recycle, Droplet, Zap, Car, Factory, Globe, Wind, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EcoMetrics {
  // Carbon Footprint
  totalCO2Emissions: number;
  transportationCO2: number;
  energyCO2: number;
  foodCO2: number;
  shoppingCO2: number;
  
  // Energy Consumption
  electricityUsage: number;
  naturalGasUsage: number;
  renewableEnergyPercentage: number;
  solarEnergyGenerated: number;
  
  // Transportation
  milesPerGallon: number;
  electricVehicleMiles: number;
  publicTransportUsage: number;
  cyclingMiles: number;
  walkingMiles: number;
  flightMiles: number;
  
  // Waste Management
  wasteGenerated: number;
  recyclingRate: number;
  compostingRate: number;
  plasticWasteReduction: number;
  
  // Water Usage
  waterConsumption: number;
  waterConservationEfforts: number;
  
  // Sustainable Shopping
  organicFoodPercentage: number;
  localProductsPercentage: number;
  sustainableBrandsPurchases: number;
  secondHandPurchases: number;
  
  // Green Investments
  ESGInvestments: number;
  greenBonds: number;
  renewableEnergyInvestments: number;
  
  // Biodiversity
  treesPlanted: number;
  wildlifeHabitatSupported: number;
  
  // Circular Economy
  productsRepaired: number;
  productsReused: number;
  sharingEconomyParticipation: number;
  
  // Environmental Certifications
  organicCertifiedProducts: number;
  fairTradeCertifiedProducts: number;
  forestStewardshipCouncilProducts: number;
  energyStarProducts: number;
  
  // Air Quality
  airQualityIndex: number;
  indoorPlants: number;
  
  // Digital Carbon Footprint
  dataUsage: number;
  cloudStorageOptimization: number;
  digitalDetoxHours: number;
}

interface EcoCardProps {
  score: number;
  ecoMetrics: Partial<EcoMetrics>;
  spendingCategories: {
    sustainableFood: number;
    renewableEnergy: number;
    ecoTransport: number;
    greenProducts: number;
    carbonOffset: number;
    conservation: number;
  };
  monthlyImpact: {
    co2Saved: number;
    treesEquivalent: number;
    waterSaved: number;
    energySaved: number;
  };
  trends: {
    carbonFootprint: 'up' | 'down' | 'stable';
    sustainability: 'up' | 'down' | 'stable';
    renewable: 'up' | 'down' | 'stable';
    waste: 'up' | 'down' | 'stable';
  };
}

const ComprehensiveEcoCard: React.FC<EcoCardProps> = ({
  score,
  ecoMetrics,
  spendingCategories,
  monthlyImpact,
  trends
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('overview');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (value: number) => {
    if (value >= 80) return '#22c55e'; // green-500
    if (value >= 60) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const getScoreLabel = (value: number) => {
    if (value >= 90) return 'Eco Champion';
    if (value >= 80) return 'Very Green';
    if (value >= 70) return 'Eco Friendly';
    if (value >= 60) return 'Making Progress';
    return 'Room to Grow';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const ecoCategories = [
    {
      id: 'carbon',
      name: 'Carbon Footprint',
      icon: <Factory className="w-5 h-5" />,
      color: '#ef4444',
      metrics: [
        { key: 'totalCO2Emissions', label: 'Total CO₂ Emissions', value: ecoMetrics.totalCO2Emissions || 12.5, unit: 'tons/year', target: 8, invert: true },
        { key: 'transportationCO2', label: 'Transportation CO₂', value: ecoMetrics.transportationCO2 || 4.2, unit: 'tons/year', target: 3, invert: true },
        { key: 'energyCO2', label: 'Energy CO₂', value: ecoMetrics.energyCO2 || 3.8, unit: 'tons/year', target: 2.5, invert: true },
        { key: 'foodCO2', label: 'Food CO₂', value: ecoMetrics.foodCO2 || 2.1, unit: 'tons/year', target: 1.5, invert: true },
        { key: 'shoppingCO2', label: 'Shopping CO₂', value: ecoMetrics.shoppingCO2 || 2.4, unit: 'tons/year', target: 1, invert: true }
      ]
    },
    {
      id: 'energy',
      name: 'Energy & Power',
      icon: <Zap className="w-5 h-5" />,
      color: '#f59e0b',
      metrics: [
        { key: 'electricityUsage', label: 'Electricity Usage', value: ecoMetrics.electricityUsage || 875, unit: 'kWh/month', target: 600, invert: true },
        { key: 'naturalGasUsage', label: 'Natural Gas', value: ecoMetrics.naturalGasUsage || 45, unit: 'therms/month', target: 30, invert: true },
        { key: 'renewableEnergyPercentage', label: 'Renewable Energy', value: ecoMetrics.renewableEnergyPercentage || 65, unit: '%', target: 100 },
        { key: 'solarEnergyGenerated', label: 'Solar Generated', value: ecoMetrics.solarEnergyGenerated || 320, unit: 'kWh/month', target: 500 }
      ]
    },
    {
      id: 'transport',
      name: 'Transportation',
      icon: <Car className="w-5 h-5" />,
      color: '#3b82f6',
      metrics: [
        { key: 'milesPerGallon', label: 'Vehicle Efficiency', value: ecoMetrics.milesPerGallon || 32, unit: 'MPG', target: 40 },
        { key: 'electricVehicleMiles', label: 'EV Miles', value: ecoMetrics.electricVehicleMiles || 450, unit: 'miles/month', target: 800 },
        { key: 'publicTransportUsage', label: 'Public Transport', value: ecoMetrics.publicTransportUsage || 120, unit: 'miles/month', target: 200 },
        { key: 'cyclingMiles', label: 'Cycling', value: ecoMetrics.cyclingMiles || 35, unit: 'miles/month', target: 60 },
        { key: 'walkingMiles', label: 'Walking', value: ecoMetrics.walkingMiles || 25, unit: 'miles/month', target: 40 },
        { key: 'flightMiles', label: 'Flight Miles', value: ecoMetrics.flightMiles || 2400, unit: 'miles/year', target: 1000, invert: true }
      ]
    },
    {
      id: 'waste',
      name: 'Waste Management',
      icon: <Recycle className="w-5 h-5" />,
      color: '#16a34a',
      metrics: [
        { key: 'wasteGenerated', label: 'Waste Generated', value: ecoMetrics.wasteGenerated || 28, unit: 'lbs/week', target: 20, invert: true },
        { key: 'recyclingRate', label: 'Recycling Rate', value: ecoMetrics.recyclingRate || 72, unit: '%', target: 90 },
        { key: 'compostingRate', label: 'Composting Rate', value: ecoMetrics.compostingRate || 45, unit: '%', target: 70 },
        { key: 'plasticWasteReduction', label: 'Plastic Reduction', value: ecoMetrics.plasticWasteReduction || 60, unit: '%', target: 80 }
      ]
    },
    {
      id: 'water',
      name: 'Water Conservation',
      icon: <Droplet className="w-5 h-5" />,
      color: '#06b6d4',
      metrics: [
        { key: 'waterConsumption', label: 'Water Usage', value: ecoMetrics.waterConsumption || 3200, unit: 'gallons/month', target: 2500, invert: true },
        { key: 'waterConservationEfforts', label: 'Conservation Score', value: ecoMetrics.waterConservationEfforts || 78, unit: '%', target: 90 }
      ]
    },
    {
      id: 'shopping',
      name: 'Sustainable Shopping',
      icon: <Globe className="w-5 h-5" />,
      color: '#84cc16',
      metrics: [
        { key: 'organicFoodPercentage', label: 'Organic Food', value: ecoMetrics.organicFoodPercentage || 42, unit: '%', target: 70 },
        { key: 'localProductsPercentage', label: 'Local Products', value: ecoMetrics.localProductsPercentage || 38, unit: '%', target: 60 },
        { key: 'sustainableBrandsPurchases', label: 'Sustainable Brands', value: ecoMetrics.sustainableBrandsPurchases || 156, unit: 'purchases/year', target: 200 },
        { key: 'secondHandPurchases', label: 'Second-hand Items', value: ecoMetrics.secondHandPurchases || 24, unit: 'items/year', target: 40 }
      ]
    },
    {
      id: 'investment',
      name: 'Green Investments',
      icon: <TrendingUp className="w-5 h-5" />,
      color: '#10b981',
      metrics: [
        { key: 'ESGInvestments', label: 'ESG Investments', value: ecoMetrics.ESGInvestments || 12500, unit: '$', target: 20000 },
        { key: 'greenBonds', label: 'Green Bonds', value: ecoMetrics.greenBonds || 3200, unit: '$', target: 5000 },
        { key: 'renewableEnergyInvestments', label: 'Renewable Energy', value: ecoMetrics.renewableEnergyInvestments || 1800, unit: '$', target: 3000 }
      ]
    },
    {
      id: 'biodiversity',
      name: 'Biodiversity',
      icon: <Leaf className="w-5 h-5" />,
      color: '#22c55e',
      metrics: [
        { key: 'treesPlanted', label: 'Trees Planted', value: ecoMetrics.treesPlanted || 8, unit: 'trees/year', target: 12 },
        { key: 'wildlifeHabitatSupported', label: 'Habitat Supported', value: ecoMetrics.wildlifeHabitatSupported || 125, unit: 'sq ft', target: 200 }
      ]
    },
    {
      id: 'circular',
      name: 'Circular Economy',
      icon: <Recycle className="w-5 h-5" />,
      color: '#8b5cf6',
      metrics: [
        { key: 'productsRepaired', label: 'Products Repaired', value: ecoMetrics.productsRepaired || 6, unit: 'items/year', target: 10 },
        { key: 'productsReused', label: 'Products Reused', value: ecoMetrics.productsReused || 18, unit: 'items/year', target: 25 },
        { key: 'sharingEconomyParticipation', label: 'Sharing Economy', value: ecoMetrics.sharingEconomyParticipation || 34, unit: 'uses/year', target: 50 }
      ]
    },
    {
      id: 'certification',
      name: 'Certifications',
      icon: <Globe className="w-5 h-5" />,
      color: '#059669',
      metrics: [
        { key: 'organicCertifiedProducts', label: 'Organic Certified', value: ecoMetrics.organicCertifiedProducts || 45, unit: '%', target: 70 },
        { key: 'fairTradeCertifiedProducts', label: 'Fair Trade', value: ecoMetrics.fairTradeCertifiedProducts || 32, unit: '%', target: 50 },
        { key: 'forestStewardshipCouncilProducts', label: 'FSC Certified', value: ecoMetrics.forestStewardshipCouncilProducts || 28, unit: '%', target: 60 },
        { key: 'energyStarProducts', label: 'Energy Star', value: ecoMetrics.energyStarProducts || 78, unit: '%', target: 90 }
      ]
    },
    {
      id: 'air',
      name: 'Air Quality',
      icon: <Wind className="w-5 h-5" />,
      color: '#0ea5e9',
      metrics: [
        { key: 'airQualityIndex', label: 'Local Air Quality', value: ecoMetrics.airQualityIndex || 42, unit: 'AQI', target: 30, invert: true },
        { key: 'indoorPlants', label: 'Indoor Plants', value: ecoMetrics.indoorPlants || 12, unit: 'plants', target: 20 }
      ]
    },
    {
      id: 'digital',
      name: 'Digital Footprint',
      icon: <Globe className="w-5 h-5" />,
      color: '#6366f1',
      metrics: [
        { key: 'dataUsage', label: 'Data Usage', value: ecoMetrics.dataUsage || 85, unit: 'GB/month', target: 60, invert: true },
        { key: 'cloudStorageOptimization', label: 'Cloud Optimization', value: ecoMetrics.cloudStorageOptimization || 67, unit: '%', target: 85 },
        { key: 'digitalDetoxHours', label: 'Digital Detox', value: ecoMetrics.digitalDetoxHours || 14, unit: 'hours/week', target: 20 }
      ]
    }
  ];

  const getProgress = (value: number, target: number, invert: boolean = false) => {
    if (invert) {
      return Math.max(0, Math.min(100, ((target - value) / target) * 100));
    }
    return Math.min(100, (value / target) * 100);
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  if (!isExpanded) {
    return (
      <div 
        className="liquid-glass-card p-6 cursor-pointer transition-all duration-300 hover:scale-105"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Leaf className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold text-white">Eco Impact</h3>
          </div>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </div>

        <div className="text-center">
          <div className="relative inline-block mb-4">
            <svg width="100" height="100" className="transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={getScoreColor(score)}
                strokeWidth="6"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{Math.round(animatedScore)}</span>
            </div>
          </div>

          <div className="text-lg font-semibold text-white mb-2">
            {getScoreLabel(score)}
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Environmental responsibility
          </p>

          <div className="text-xs text-slate-500">
            Click to view detailed eco metrics
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="liquid-glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Leaf className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Comprehensive Eco Impact</h3>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
        >
          <ChevronUp className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Category Navigation */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        <button
          onClick={() => setActiveCategory('overview')}
          className={`p-3 rounded-lg text-xs font-medium transition-all ${
            activeCategory === 'overview'
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-slate-800/30 text-slate-400 hover:bg-slate-700/30'
          }`}
        >
          Overview
        </button>
        {ecoCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`p-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center space-y-1 ${
              activeCategory === category.id
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-slate-800/30 text-slate-400 hover:bg-slate-700/30'
            }`}
            style={{
              backgroundColor: activeCategory === category.id ? `${category.color}20` : undefined,
              borderColor: activeCategory === category.id ? `${category.color}50` : undefined,
              color: activeCategory === category.id ? category.color : undefined
            }}
          >
            {category.icon}
            <span className="hidden md:block text-center leading-tight">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeCategory === 'overview' && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <svg width="120" height="120" className="transform -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="40"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="40"
                  stroke={getScoreColor(score)}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{Math.round(animatedScore)}</span>
                <span className="text-xs text-slate-400">Eco Score</span>
              </div>
            </div>
            <div className="text-xl font-semibold text-white mb-2">
              {getScoreLabel(score)}
            </div>
          </div>

          {/* Monthly Impact */}
          <div className="bg-slate-800/30 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-white mb-4">Monthly Environmental Impact</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{monthlyImpact.co2Saved}kg</div>
                <div className="text-sm text-slate-400">CO₂ Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{monthlyImpact.treesEquivalent}</div>
                <div className="text-sm text-slate-400">Trees Equivalent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{monthlyImpact.waterSaved}L</div>
                <div className="text-sm text-slate-400">Water Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{monthlyImpact.energySaved}kWh</div>
                <div className="text-sm text-slate-400">Energy Saved</div>
              </div>
            </div>
          </div>

          {/* Eco Spending */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Eco Spending This Month</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(spendingCategories).map(([key, value]) => (
                <div key={key} className="bg-slate-800/30 p-4 rounded-lg">
                  <div className="text-sm text-slate-400 capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div className="text-xl font-bold text-white">${value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trends */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Environmental Trends</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(trends).map(([key, trend]) => (
                <div key={key} className="flex items-center space-x-2">
                  {getTrendIcon(trend)}
                  <span className="text-sm text-slate-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Details */}
      {activeCategory !== 'overview' && (
        <div className="space-y-4">
          {(() => {
            const category = ecoCategories.find(cat => cat.id === activeCategory);
            if (!category) return null;

            return (
              <>
                <div className="flex items-center space-x-3 mb-6">
                  <div style={{ color: category.color }}>
                    {category.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-white">{category.name}</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.metrics.map((metric) => (
                    <div key={metric.key} className="bg-slate-800/30 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-sm text-slate-400">{metric.label}</div>
                          <div className="text-lg font-bold text-white">
                            {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value} {metric.unit}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 text-right">
                          Target: {typeof metric.target === 'number' ? metric.target.toLocaleString() : metric.target} {metric.unit}
                          {metric.invert && <div className="text-orange-400">(Lower is better)</div>}
                        </div>
                      </div>
                      
                      {typeof metric.value === 'number' && typeof metric.target === 'number' && (
                        <div className="w-full bg-slate-700/30 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-1000"
                            style={{
                              width: `${Math.min(100, getProgress(metric.value, metric.target, metric.invert))}%`,
                              backgroundColor: category.color
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default ComprehensiveEcoCard; 