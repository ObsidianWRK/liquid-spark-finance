import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SavingsGoal, SavingsInsight } from './types';
import { savingsGoalsService } from '@/services/savingsGoalsService';

const queryKeys = {
  goals: ['savings', 'goals'] as const,
  goal: (id: string) => ['savings', 'goals', id] as const,
  insights: ['savings', 'insights'] as const,
};

/**
 * Fetch all savings goals.
 */
export const useSavingsGoals = () =>
  useQuery<SavingsGoal[]>({
    queryKey: queryKeys.goals,
    queryFn: () => savingsGoalsService.getGoals(),
  });

/**
 * Fetch savings-related insights (milestones, suggestions, etc.).
 */
export const useSavingsInsights = () =>
  useQuery<SavingsInsight[]>({
    queryKey: queryKeys.insights,
    queryFn: () => savingsGoalsService.getSavingsInsights(),
  });

/**
 * Create a new savings goal.
 */
export const useCreateSavingsGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'contributions' | 'isCompleted'>) =>
      savingsGoalsService.createGoal(goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights });
    },
  });
};

/**
 * Add a contribution to a specific goal.
 */
export const useAddContribution = (goalId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contribution: Parameters<typeof savingsGoalsService.addContribution>[1]) =>
      savingsGoalsService.addContribution(goalId, contribution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights });
    },
  });
};

/**
 * Update an existing savings goal (e.g., rename, change target).
 */
export const useUpdateSavingsGoal = (goalId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<SavingsGoal>) =>
      savingsGoalsService.updateGoal(goalId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights });
    },
  });
};

/**
 * Delete a savings goal.
 */
export const useDeleteSavingsGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goalId: string) => savingsGoalsService.deleteGoal(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights });
    },
  });
};