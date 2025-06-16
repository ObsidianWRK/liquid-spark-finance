import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Activity, Moon, Utensils, Brain, Ear, Accessibility, Users, Droplet, Wind, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HealthKitMetrics {
  // Physical Activity
  activeEnergyBurned: number;
  basalEnergyBurned: number;
  stepCount: number;
  distanceWalkingRunning: number;
  flightsClimbed: number;
  exerciseTime: number;
  
  // Body Measurements
  bodyMass: number;
  height: number;
  bmi: number;
  bodyFatPercentage: number;
  leanBodyMass: number;
  waistCircumference: number;
  
  // Vital Signs
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  respiratoryRate: number;
  bodyTemperature: number;
  oxygenSaturation: number;
  
  // Nutrition
  dietaryWater: number;
  dietaryFiber: number;
  dietaryCalories: number;
  dietaryProtein: number;
  dietaryCarbohydrates: number;
  dietaryFat: number;
  dietarySugar: number;
  dietarySodium: number;
  
  // Sleep
  sleepAnalysis: number;
  timeInBed: number;
  sleepEfficiency: number;
  
  // Mindfulness
  mindfulMinutes: number;
  stressLevel: number;
  
  // Reproductive Health
  menstrualFlow: number;
  ovulationTestResult: number;
  
  // Lab Results
  bloodGlucose: number;
  cholesterolTotal: number;
  cholesterolLDL: number;
  cholesterolHDL: number;
  
  // Hearing
  audioExposure: number;
  environmentalAudioExposure: number;
  headphoneAudioExposure: number;
  
  // Vision
  
  // Mobility
  walkingAsymmetry: number;
  walkingDoubleSupportPercentage: number;
  sixMinuteWalkTestDistance: number;
  stairAscentSpeed: number;
  stairDescentSpeed: number;
  walkingSpeed: number;
  
  // Wheelchair Use
  wheelchairUse: number;
  
  // Respiratory
  peakExpiratoryFlowRate: number;
  forcedExpiratoryVolume1: number;
  
  // Symptoms
  symptomDiarrhea: number;
  symptomNausea: number;
  symptomHeadache: number;
  symptomFever: number;
  
  // Other
  uvExposure: number;
  electrodermalActivity: number;
  toothbrushingEvent: number;
  handwashingEvent: number;
}

interface WellnessCardProps {
  score: number;
  healthKitData: Partial<HealthKitMetrics>;
  spendingCategories: {
    fitness: number;
    nutrition: number;
    healthcare: number;
    wellness: number;
    supplements: number;
    mentalHealth: number;
  };
  trends: {
    exercise: 'up' | 'down' | 'stable';
    nutrition: 'up' | 'down' | 'stable';
    sleep: 'up' | 'down' | 'stable';
    stress: 'up' | 'down' | 'stable';
  };
}

const ComprehensiveWellnessCard: React.FC<WellnessCardProps> = ({
  score,
  healthKitData,
  spendingCategories,
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
    if (value >= 90) return 'Excellent';
    if (value >= 80) return 'Very Good';
    if (value >= 70) return 'Good';
    if (value >= 60) return 'Fair';
    return 'Needs Attention';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const healthCategories = [
    {
      id: 'activity',
      name: 'Physical Activity',
      icon: <Activity className="w-5 h-5" />,
      color: '#ef4444',
      metrics: [
        { key: 'stepCount', label: 'Steps', value: healthKitData.stepCount || 8542, unit: 'steps', target: 10000 },
        { key: 'activeEnergyBurned', label: 'Active Calories', value: healthKitData.activeEnergyBurned || 387, unit: 'cal', target: 500 },
        { key: 'exerciseTime', label: 'Exercise Time', value: healthKitData.exerciseTime || 45, unit: 'min', target: 60 },
        { key: 'distanceWalkingRunning', label: 'Distance', value: healthKitData.distanceWalkingRunning || 6.2, unit: 'km', target: 8 },
        { key: 'flightsClimbed', label: 'Flights Climbed', value: healthKitData.flightsClimbed || 12, unit: 'flights', target: 15 }
      ]
    },
    {
      id: 'vitals',
      name: 'Vital Signs',
      icon: <Heart className="w-5 h-5" />,
      color: '#dc2626',
      metrics: [
        { key: 'heartRate', label: 'Heart Rate', value: healthKitData.heartRate || 72, unit: 'bpm', target: 70 },
        { key: 'bloodPressureSystolic', label: 'Blood Pressure', value: `${healthKitData.bloodPressureSystolic || 120}/${healthKitData.bloodPressureDiastolic || 80}`, unit: 'mmHg', target: '120/80' },
        { key: 'respiratoryRate', label: 'Respiratory Rate', value: healthKitData.respiratoryRate || 16, unit: '/min', target: 16 },
        { key: 'bodyTemperature', label: 'Body Temperature', value: healthKitData.bodyTemperature || 98.6, unit: '°F', target: 98.6 },
        { key: 'oxygenSaturation', label: 'Oxygen Saturation', value: healthKitData.oxygenSaturation || 98, unit: '%', target: 98 }
      ]
    },
    {
      id: 'body',
      name: 'Body Measurements',
      icon: <Users className="w-5 h-5" />,
      color: '#7c3aed',
      metrics: [
        { key: 'bodyMass', label: 'Weight', value: healthKitData.bodyMass || 165, unit: 'lbs', target: 160 },
        { key: 'height', label: 'Height', value: healthKitData.height || 70, unit: 'inches', target: 70 },
        { key: 'bmi', label: 'BMI', value: healthKitData.bmi || 23.6, unit: '', target: 22 },
        { key: 'bodyFatPercentage', label: 'Body Fat', value: healthKitData.bodyFatPercentage || 18, unit: '%', target: 15 },
        { key: 'waistCircumference', label: 'Waist', value: healthKitData.waistCircumference || 32, unit: 'inches', target: 30 }
      ]
    },
    {
      id: 'nutrition',
      name: 'Nutrition',
      icon: <Utensils className="w-5 h-5" />,
      color: '#16a34a',
      metrics: [
        { key: 'dietaryCalories', label: 'Calories', value: healthKitData.dietaryCalories || 2150, unit: 'cal', target: 2000 },
        { key: 'dietaryProtein', label: 'Protein', value: healthKitData.dietaryProtein || 85, unit: 'g', target: 100 },
        { key: 'dietaryCarbohydrates', label: 'Carbs', value: healthKitData.dietaryCarbohydrates || 250, unit: 'g', target: 225 },
        { key: 'dietaryFat', label: 'Fat', value: healthKitData.dietaryFat || 75, unit: 'g', target: 65 },
        { key: 'dietaryFiber', label: 'Fiber', value: healthKitData.dietaryFiber || 22, unit: 'g', target: 25 },
        { key: 'dietaryWater', label: 'Water', value: healthKitData.dietaryWater || 2.1, unit: 'L', target: 2.5 },
        { key: 'dietarySugar', label: 'Sugar', value: healthKitData.dietarySugar || 45, unit: 'g', target: 25 },
        { key: 'dietarySodium', label: 'Sodium', value: healthKitData.dietarySodium || 2100, unit: 'mg', target: 2300 }
      ]
    },
    {
      id: 'sleep',
      name: 'Sleep Analysis',
      icon: <Moon className="w-5 h-5" />,
      color: '#3b82f6',
      metrics: [
        { key: 'sleepAnalysis', label: 'Sleep Duration', value: healthKitData.sleepAnalysis || 7.5, unit: 'hours', target: 8 },
        { key: 'timeInBed', label: 'Time in Bed', value: healthKitData.timeInBed || 8.2, unit: 'hours', target: 8.5 },
        { key: 'sleepEfficiency', label: 'Sleep Efficiency', value: healthKitData.sleepEfficiency || 89, unit: '%', target: 85 }
      ]
    },
    {
      id: 'mindfulness',
      name: 'Mental Health',
      icon: <Brain className="w-5 h-5" />,
      color: '#8b5cf6',
      metrics: [
        { key: 'mindfulMinutes', label: 'Mindful Minutes', value: healthKitData.mindfulMinutes || 15, unit: 'min', target: 20 },
        { key: 'stressLevel', label: 'Stress Level', value: healthKitData.stressLevel || 3, unit: '/10', target: 2 }
      ]
    },
    {
      id: 'hearing',
      name: 'Hearing Health',
      icon: <Ear className="w-5 h-5" />,
      color: '#f59e0b',
      metrics: [
        { key: 'audioExposure', label: 'Audio Exposure', value: healthKitData.audioExposure || 75, unit: 'dB', target: 70 },
        { key: 'headphoneAudioExposure', label: 'Headphone Exposure', value: healthKitData.headphoneAudioExposure || 68, unit: 'dB', target: 60 }
      ]
    },
    {
      id: 'mobility',
      name: 'Mobility',
      icon: <Accessibility className="w-5 h-5" />,
      color: '#06b6d4',
      metrics: [
        { key: 'walkingSpeed', label: 'Walking Speed', value: healthKitData.walkingSpeed || 1.2, unit: 'm/s', target: 1.3 },
        { key: 'walkingAsymmetry', label: 'Walking Asymmetry', value: healthKitData.walkingAsymmetry || 2.1, unit: '%', target: 2.0 },
        { key: 'sixMinuteWalkTestDistance', label: '6-Min Walk Test', value: healthKitData.sixMinuteWalkTestDistance || 550, unit: 'm', target: 600 },
        { key: 'stairAscentSpeed', label: 'Stair Ascent Speed', value: healthKitData.stairAscentSpeed || 0.8, unit: 'm/s', target: 1.0 }
      ]
    },
    {
      id: 'respiratory',
      name: 'Respiratory Health',
      icon: <Wind className="w-5 h-5" />,
      color: '#84cc16',
      metrics: [
        { key: 'peakExpiratoryFlowRate', label: 'Peak Flow Rate', value: healthKitData.peakExpiratoryFlowRate || 420, unit: 'L/min', target: 450 },
        { key: 'forcedExpiratoryVolume1', label: 'FEV1', value: healthKitData.forcedExpiratoryVolume1 || 3.2, unit: 'L', target: 3.5 }
      ]
    },
    {
      id: 'reproductive',
      name: 'Reproductive Health',
      icon: <Heart className="w-5 h-5" />,
      color: '#ec4899',
      metrics: [
        { key: 'menstrualFlow', label: 'Menstrual Flow', value: healthKitData.menstrualFlow || 2, unit: '/5', target: 2 },
        { key: 'ovulationTestResult', label: 'Ovulation Test', value: healthKitData.ovulationTestResult || 1, unit: '', target: 1 }
      ]
    },
    {
      id: 'lab',
      name: 'Lab Results',
      icon: <Droplet className="w-5 h-5" />,
      color: '#ef4444',
      metrics: [
        { key: 'bloodGlucose', label: 'Blood Glucose', value: healthKitData.bloodGlucose || 95, unit: 'mg/dL', target: 100 },
        { key: 'cholesterolTotal', label: 'Total Cholesterol', value: healthKitData.cholesterolTotal || 180, unit: 'mg/dL', target: 200 },
        { key: 'cholesterolLDL', label: 'LDL Cholesterol', value: healthKitData.cholesterolLDL || 110, unit: 'mg/dL', target: 100 },
        { key: 'cholesterolHDL', label: 'HDL Cholesterol', value: healthKitData.cholesterolHDL || 55, unit: 'mg/dL', target: 60 }
      ]
    }
  ];

  const getProgress = (value: number, target: number) => {
    return Math.min(100, (value / target) * 100);
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  if (!isExpanded) {
    return (
      <div 
        className="liquid-glass-card p-6 cursor-pointer transition-all duration-300 hover:scale-105 score-card-container"
        onClick={() => setIsExpanded(true)}
      >
        <div className="score-card-content">
          <div className="flex items-center justify-between mb-6">
            <div className="icon-text-row">
              <div className="icon">
                <Heart className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text collapsed-card-title text-white">Wellness Score</h3>
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
              Health-conscious spending habits
            </p>

            <div className="text-xs text-slate-500">
              Click to view detailed health metrics
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="liquid-glass-card p-6 equal-height-cards">
      <div className="flex items-center justify-between mb-6">
        <div className="icon-text-row">
          <div className="icon">
            <Heart className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text expanded-card-title text-white">Comprehensive Wellness</h3>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
        >
          <ChevronUp className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Category Navigation */}
      <div className="category-grid category-button-grid mb-6">
        <button
          onClick={() => setActiveCategory('overview')}
          className={`category-nav-button p-3 rounded-lg text-xs font-medium transition-all ${
            activeCategory === 'overview'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-slate-800/30 text-slate-400 hover:bg-slate-700/30'
          }`}
        >
          <div className="icon-wrapper">
            Overview
          </div>
        </button>
        {healthCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`category-nav-button p-3 rounded-lg text-xs font-medium transition-all ${
              activeCategory === category.id
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/30 text-slate-400 hover:bg-slate-700/30'
            }`}
            style={{
              backgroundColor: activeCategory === category.id ? `${category.color}20` : undefined,
              borderColor: activeCategory === category.id ? `${category.color}50` : undefined,
              color: activeCategory === category.id ? category.color : undefined
            }}
          >
            <div className="icon-wrapper">
              {category.icon}
            </div>
            <div className="text-wrapper">
              {category.name}
            </div>
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
                <span className="text-xs text-slate-400">Wellness Score</span>
              </div>
            </div>
            <div className="text-xl font-semibold text-white mb-2">
              {getScoreLabel(score)}
            </div>
          </div>

          {/* Spending Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Health Spending This Month</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(spendingCategories).map(([key, value]) => (
                <div key={key} className="bg-slate-800/30 p-4 rounded-lg">
                  <div className="text-sm text-slate-400 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="text-xl font-bold text-white">${value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trends */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Health Trends</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(trends).map(([key, trend]) => (
                <div key={key} className="flex items-center space-x-2">
                  {getTrendIcon(trend)}
                  <span className="text-sm text-slate-300 capitalize">{key}</span>
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
            const category = healthCategories.find(cat => cat.id === activeCategory);
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
                        <div className="text-xs text-slate-500">
                          Target: {typeof metric.target === 'number' ? metric.target.toLocaleString() : metric.target} {metric.unit}
                        </div>
                      </div>
                      
                      {typeof metric.value === 'number' && typeof metric.target === 'number' && (
                        <div className="w-full bg-slate-700/30 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-1000"
                            style={{
                              width: `${Math.min(100, getProgress(metric.value, metric.target))}%`,
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

export default ComprehensiveWellnessCard; 