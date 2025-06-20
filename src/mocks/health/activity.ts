export interface ActivityRingData {
  id: 'move' | 'exercise' | 'stand';
  label: string;
  value: number;
  goal: number;
  color: string;
}

export const activityRings: ActivityRingData[] = [
  { id: 'move', label: 'Move', value: 420, goal: 500, color: '#ef4444' },
  { id: 'exercise', label: 'Exercise', value: 22, goal: 30, color: '#22c55e' },
  { id: 'stand', label: 'Stand', value: 10, goal: 12, color: '#3b82f6' }
];
