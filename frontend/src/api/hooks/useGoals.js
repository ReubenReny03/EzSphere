import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export const useGoals = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.goals(filters),
    queryFn: () => apiClient.get('/goals', { params: filters }),
  });

const invalidateGoals = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ['goals'] });
  queryClient.invalidateQueries({ queryKey: queryKeys.scoringOverview });
  queryClient.invalidateQueries({ queryKey: queryKeys.scoringDepartments });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.post('/goals', data),
    onSuccess: () => invalidateGoals(queryClient),
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiClient.patch(`/goals/${id}`, data),
    onSuccess: () => invalidateGoals(queryClient),
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/goals/${id}`),
    onSuccess: () => invalidateGoals(queryClient),
  });
};
