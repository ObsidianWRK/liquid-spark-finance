import React from 'react';
import {
  Activity,
  Heart,
  Users,
  Utensils,
  Moon,
  Brain,
  Ear,
  Accessibility,
  Wind,
  Droplet,
} from 'lucide-react';

export interface HealthKitMetrics {
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

export interface WellnessSpendingCategories {
  fitness: number;
  nutrition: number;
  healthcare: number;
  wellness: number;
  supplements: number;
  mentalHealth: number;
}

export interface WellnessTrends {
  exercise: 'up' | 'down' | 'stable';
  nutrition: 'up' | 'down' | 'stable';
  sleep: 'up' | 'down' | 'stable';
  stress: 'up' | 'down' | 'stable';
}

export interface WellnessCategory {
  id: string;
  name: string;
  iconName: string;
  color: string;
  metrics: Array<{
    key: string;
    label: string;
    value: number | string;
    unit: string;
    target: number | string;
  }>;
}

export const getWellnessCategories = (
  healthKitData: Partial<HealthKitMetrics>
): WellnessCategory[] => [
  {
    id: 'activity',
    name: 'Physical Activity',
    iconName: 'Activity',
    color: '#ef4444',
    metrics: [
      {
        key: 'stepCount',
        label: 'Steps',
        value: healthKitData.stepCount || 8542,
        unit: 'steps',
        target: 10000,
      },
      {
        key: 'activeEnergyBurned',
        label: 'Active Calories',
        value: healthKitData.activeEnergyBurned || 387,
        unit: 'cal',
        target: 500,
      },
      {
        key: 'exerciseTime',
        label: 'Exercise Time',
        value: healthKitData.exerciseTime || 45,
        unit: 'min',
        target: 60,
      },
      {
        key: 'distanceWalkingRunning',
        label: 'Distance',
        value: healthKitData.distanceWalkingRunning || 6.2,
        unit: 'km',
        target: 8,
      },
      {
        key: 'flightsClimbed',
        label: 'Flights Climbed',
        value: healthKitData.flightsClimbed || 12,
        unit: 'flights',
        target: 15,
      },
    ],
  },
  {
    id: 'vitals',
    name: 'Vital Signs',
    iconName: 'Heart',
    color: '#dc2626',
    metrics: [
      {
        key: 'heartRate',
        label: 'Heart Rate',
        value: healthKitData.heartRate || 72,
        unit: 'bpm',
        target: 70,
      },
      {
        key: 'bloodPressure',
        label: 'Blood Pressure',
        value: `${healthKitData.bloodPressureSystolic || 120}/${healthKitData.bloodPressureDiastolic || 80}`,
        unit: 'mmHg',
        target: '120/80',
      },
      {
        key: 'respiratoryRate',
        label: 'Respiratory Rate',
        value: healthKitData.respiratoryRate || 16,
        unit: '/min',
        target: 16,
      },
      {
        key: 'bodyTemperature',
        label: 'Body Temperature',
        value: healthKitData.bodyTemperature || 98.6,
        unit: '°F',
        target: 98.6,
      },
      {
        key: 'oxygenSaturation',
        label: 'Oxygen Saturation',
        value: healthKitData.oxygenSaturation || 98,
        unit: '%',
        target: 98,
      },
    ],
  },
  {
    id: 'body',
    name: 'Body Measurements',
    iconName: 'Users',
    color: '#7c3aed',
    metrics: [
      {
        key: 'bodyMass',
        label: 'Weight',
        value: healthKitData.bodyMass || 165,
        unit: 'lbs',
        target: 160,
      },
      {
        key: 'height',
        label: 'Height',
        value: healthKitData.height || 70,
        unit: 'inches',
        target: 70,
      },
      {
        key: 'bmi',
        label: 'BMI',
        value: healthKitData.bmi || 23.6,
        unit: '',
        target: 22,
      },
      {
        key: 'bodyFatPercentage',
        label: 'Body Fat',
        value: healthKitData.bodyFatPercentage || 18,
        unit: '%',
        target: 15,
      },
      {
        key: 'waistCircumference',
        label: 'Waist',
        value: healthKitData.waistCircumference || 32,
        unit: 'inches',
        target: 30,
      },
    ],
  },
  {
    id: 'nutrition',
    name: 'Nutrition',
    iconName: 'Utensils',
    color: '#16a34a',
    metrics: [
      {
        key: 'dietaryCalories',
        label: 'Calories',
        value: healthKitData.dietaryCalories || 2150,
        unit: 'cal',
        target: 2000,
      },
      {
        key: 'dietaryProtein',
        label: 'Protein',
        value: healthKitData.dietaryProtein || 85,
        unit: 'g',
        target: 100,
      },
      {
        key: 'dietaryCarbohydrates',
        label: 'Carbs',
        value: healthKitData.dietaryCarbohydrates || 250,
        unit: 'g',
        target: 225,
      },
      {
        key: 'dietaryFat',
        label: 'Fat',
        value: healthKitData.dietaryFat || 75,
        unit: 'g',
        target: 65,
      },
      {
        key: 'dietaryFiber',
        label: 'Fiber',
        value: healthKitData.dietaryFiber || 22,
        unit: 'g',
        target: 25,
      },
      {
        key: 'dietaryWater',
        label: 'Water',
        value: healthKitData.dietaryWater || 2.1,
        unit: 'L',
        target: 2.5,
      },
      {
        key: 'dietarySugar',
        label: 'Sugar',
        value: healthKitData.dietarySugar || 45,
        unit: 'g',
        target: 25,
      },
      {
        key: 'dietarySodium',
        label: 'Sodium',
        value: healthKitData.dietarySodium || 2100,
        unit: 'mg',
        target: 2300,
      },
    ],
  },
  {
    id: 'sleep',
    name: 'Sleep Analysis',
    iconName: 'Moon',
    color: '#3b82f6',
    metrics: [
      {
        key: 'sleepAnalysis',
        label: 'Sleep Duration',
        value: healthKitData.sleepAnalysis || 7.5,
        unit: 'hours',
        target: 8,
      },
      {
        key: 'timeInBed',
        label: 'Time in Bed',
        value: healthKitData.timeInBed || 8.2,
        unit: 'hours',
        target: 8.5,
      },
      {
        key: 'sleepEfficiency',
        label: 'Sleep Efficiency',
        value: healthKitData.sleepEfficiency || 89,
        unit: '%',
        target: 85,
      },
    ],
  },
  {
    id: 'mindfulness',
    name: 'Mental Health',
    iconName: 'Brain',
    color: '#8b5cf6',
    metrics: [
      {
        key: 'mindfulMinutes',
        label: 'Mindful Minutes',
        value: healthKitData.mindfulMinutes || 15,
        unit: 'min',
        target: 20,
      },
      {
        key: 'stressLevel',
        label: 'Stress Level',
        value: healthKitData.stressLevel || 3,
        unit: '/10',
        target: 2,
      },
    ],
  },
  {
    id: 'hearing',
    name: 'Hearing Health',
    iconName: 'Ear',
    color: '#f59e0b',
    metrics: [
      {
        key: 'audioExposure',
        label: 'Audio Exposure',
        value: healthKitData.audioExposure || 75,
        unit: 'dB',
        target: 70,
      },
      {
        key: 'headphoneAudioExposure',
        label: 'Headphone Exposure',
        value: healthKitData.headphoneAudioExposure || 68,
        unit: 'dB',
        target: 60,
      },
    ],
  },
  {
    id: 'mobility',
    name: 'Mobility',
    iconName: 'Accessibility',
    color: '#06b6d4',
    metrics: [
      {
        key: 'walkingSpeed',
        label: 'Walking Speed',
        value: healthKitData.walkingSpeed || 1.2,
        unit: 'm/s',
        target: 1.3,
      },
      {
        key: 'walkingAsymmetry',
        label: 'Walking Asymmetry',
        value: healthKitData.walkingAsymmetry || 2.1,
        unit: '%',
        target: 2.0,
      },
      {
        key: 'sixMinuteWalkTestDistance',
        label: '6-Min Walk Test',
        value: healthKitData.sixMinuteWalkTestDistance || 550,
        unit: 'm',
        target: 600,
      },
      {
        key: 'stairAscentSpeed',
        label: 'Stair Ascent Speed',
        value: healthKitData.stairAscentSpeed || 0.8,
        unit: 'm/s',
        target: 1.0,
      },
    ],
  },
  {
    id: 'respiratory',
    name: 'Respiratory Health',
    iconName: 'Wind',
    color: '#84cc16',
    metrics: [
      {
        key: 'peakExpiratoryFlowRate',
        label: 'Peak Flow Rate',
        value: healthKitData.peakExpiratoryFlowRate || 420,
        unit: 'L/min',
        target: 450,
      },
      {
        key: 'forcedExpiratoryVolume1',
        label: 'FEV1',
        value: healthKitData.forcedExpiratoryVolume1 || 3.2,
        unit: 'L',
        target: 3.5,
      },
    ],
  },
  {
    id: 'reproductive',
    name: 'Reproductive Health',
    iconName: 'Heart',
    color: '#ec4899',
    metrics: [
      {
        key: 'menstrualFlow',
        label: 'Menstrual Flow',
        value: healthKitData.menstrualFlow || 2,
        unit: '/5',
        target: 2,
      },
      {
        key: 'ovulationTestResult',
        label: 'Ovulation Test',
        value: healthKitData.ovulationTestResult || 1,
        unit: '',
        target: 1,
      },
    ],
  },
  {
    id: 'lab',
    name: 'Lab Results',
    iconName: 'Droplet',
    color: '#ef4444',
    metrics: [
      {
        key: 'bloodGlucose',
        label: 'Blood Glucose',
        value: healthKitData.bloodGlucose || 95,
        unit: 'mg/dL',
        target: 100,
      },
      {
        key: 'cholesterolTotal',
        label: 'Total Cholesterol',
        value: healthKitData.cholesterolTotal || 180,
        unit: 'mg/dL',
        target: 200,
      },
      {
        key: 'cholesterolLDL',
        label: 'LDL Cholesterol',
        value: healthKitData.cholesterolLDL || 110,
        unit: 'mg/dL',
        target: 100,
      },
      {
        key: 'cholesterolHDL',
        label: 'HDL Cholesterol',
        value: healthKitData.cholesterolHDL || 55,
        unit: 'mg/dL',
        target: 60,
      },
    ],
  },
];

export const getWellnessScoreColor = (value: number): string => {
  if (value >= 80) return '#22c55e'; // green-500
  if (value >= 60) return '#f59e0b'; // amber-500
  return '#ef4444'; // red-500
};

export const getWellnessScoreLabel = (value: number): string => {
  if (value >= 90) return 'Excellent';
  if (value >= 80) return 'Very Good';
  if (value >= 70) return 'Good';
  if (value >= 60) return 'Fair';
  return 'Needs Attention';
};

export const getProgress = (value: number, target: number): number => {
  return Math.min(100, (value / target) * 100);
};

// Mock data for demonstration
export const getMockWellnessData = () => ({
  score: 78,
  healthKitData: {
    stepCount: 8542,
    activeEnergyBurned: 387,
    exerciseTime: 45,
    distanceWalkingRunning: 6.2,
    flightsClimbed: 12,
    heartRate: 72,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    respiratoryRate: 16,
    bodyTemperature: 98.6,
    oxygenSaturation: 98,
    bodyMass: 165,
    height: 70,
    bmi: 23.6,
    bodyFatPercentage: 18,
    waistCircumference: 32,
    dietaryCalories: 2150,
    dietaryProtein: 85,
    dietaryCarbohydrates: 250,
    dietaryFat: 75,
    dietaryFiber: 22,
    dietaryWater: 2.1,
    dietarySugar: 45,
    dietarySodium: 2100,
    sleepAnalysis: 7.5,
    timeInBed: 8.2,
    sleepEfficiency: 89,
    mindfulMinutes: 15,
    stressLevel: 3,
    audioExposure: 75,
    headphoneAudioExposure: 68,
    walkingSpeed: 1.2,
    walkingAsymmetry: 2.1,
    sixMinuteWalkTestDistance: 550,
    stairAscentSpeed: 0.8,
    peakExpiratoryFlowRate: 420,
    forcedExpiratoryVolume1: 3.2,
    menstrualFlow: 2,
    ovulationTestResult: 1,
    bloodGlucose: 95,
    cholesterolTotal: 180,
    cholesterolLDL: 110,
    cholesterolHDL: 55,
  } as HealthKitMetrics,
  spendingCategories: {
    fitness: 125,
    nutrition: 235,
    healthcare: 450,
    wellness: 89,
    supplements: 76,
    mentalHealth: 150,
  } as WellnessSpendingCategories,
  trends: {
    exercise: 'up',
    nutrition: 'stable',
    sleep: 'up',
    stress: 'down',
  } as WellnessTrends,
});

export default {
  getWellnessCategories,
  getWellnessScoreColor,
  getWellnessScoreLabel,
  getProgress,
  getMockWellnessData,
};
