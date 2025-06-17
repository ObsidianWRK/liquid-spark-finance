import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BudgetCategory } from '@/types/budget';
import { budgetService } from '@/services/budgetService';

const queryKeys = {
  categories: ['budget', 'categories'] as const,
  category: (id: string) => ['budget', 'categories', id] as const,
};

export const useBudgetCategories = () =>
  useQuery<BudgetCategory[]>({
    queryKey: queryKeys.categories,
    queryFn: () => budgetService.listCategories(),
  });

export const useAddBudgetCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (partial: Omit<BudgetCategory, 'id' | 'spent'>) =>
      budgetService.addCategory(partial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

export const useDeleteBudgetCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => budgetService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

export const useUpdateBudgetCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; updates: Partial<BudgetCategory> }) =>
      budgetService.updateCategory(args.id, args.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}; 