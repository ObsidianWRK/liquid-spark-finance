import React from 'react';
import { Factory, Zap, Car, Recycle, Droplet, Globe, TrendingUp, Leaf, Wind } from 'lucide-react';

export interface EcoMetrics {
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

export interface EcoSpendingCategories {
  sustainableFood: number;
  renewableEnergy: number;
  ecoTransport: number;
  greenProducts: number;
  carbonOffset: number;
  conservation: number;
}

export interface EcoMonthlyImpact {
  co2Saved: number;
  treesEquivalent: number;
  waterSaved: number;
  energySaved: number;
}

export interface EcoTrends {
  carbonFootprint: 'up' | 'down' | 'stable';
  sustainability: 'up' | 'down' | 'stable';
  renewable: 'up' | 'down' | 'stable';
  waste: 'up' | 'down' | 'stable';
}

export interface EcoCategory {
  id: string;
  name: string;
  iconName: string;
  color: string;
  metrics: Array<{
    key: string;
    label: string;
    value: number;
    unit: string;
    target: number;
    invert?: boolean;
  }>;
}

export const getEcoScoreLabel = (value: number): string => {
  if (value >= 90) return 'Eco Champion';
  if (value >= 80) return 'Very Green';
  if (value >= 70) return 'Eco Friendly';
  if (value >= 60) return 'Making Progress';
  return 'Room to Grow';
};

export const getEcoScoreColor = (value: number): string => {
  if (value >= 80) return '#22c55e'; // green-500
  if (value >= 60) return '#f59e0b'; // amber-500
  return '#ef4444'; // red-500
};

export const getProgress = (value: number, target: number, invert: boolean = false): number => {
  if (invert) {
    return Math.max(0, Math.min(100, ((target - value) / target) * 100));
  }
  return Math.min(100, (value / target) * 100);
};

export const getEcoCategories = (ecoMetrics: Partial<EcoMetrics>): EcoCategory[] => [
  {
    id: 'carbon',
    name: 'Carbon Footprint',
    iconName: 'Factory',
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
    iconName: 'Zap',
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
    iconName: 'Car',
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
    iconName: 'Recycle',
    color: '#16a34a',
    metrics: [
      { key: 'wasteGenerated', label: 'Waste Generated', value: ecoMetrics.wasteGenerated || 28, unit: 'lbs/week', target: 20, invert: true },
      { key: 'recyclingRate', label: 'Recycling Rate', value: ecoMetrics.recyclingRate || 72, unit: '%', target: 90 },
      { key: 'compostingRate', label: 'Composting Rate', value: ecoMetrics.compostingRate || 45, unit: '%', target: 70 },
      { key: 'plasticWasteReduction', label: 'Plastic Reduction', value: ecoMetrics.plasticWasteReduction || 60, unit: '%', target: 80 }
    ]
  }
];

// Mock data for demonstration
export const getMockEcoData = () => ({
  score: 78,
  ecoMetrics: {
    totalCO2Emissions: 12.5,
    transportationCO2: 4.2,
    energyCO2: 3.8,
    electricityUsage: 875,
    renewableEnergyPercentage: 65,
    recyclingRate: 72,
    waterConsumption: 3200,
    organicFoodPercentage: 42,
    ESGInvestments: 12500,
    treesPlanted: 8,
  } as Partial<EcoMetrics>,
  spendingCategories: {
    sustainableFood: 320,
    renewableEnergy: 180,
    ecoTransport: 240,
    greenProducts: 150,
    carbonOffset: 50,
    conservation: 75,
  } as EcoSpendingCategories,
  monthlyImpact: {
    co2Saved: 25,
    treesEquivalent: 3,
    waterSaved: 150,
    energySaved: 45,
  } as EcoMonthlyImpact,
  trends: {
    carbonFootprint: 'down' as const,
    sustainability: 'up' as const,
    renewable: 'up' as const,
    waste: 'down' as const,
  } as EcoTrends,
});
