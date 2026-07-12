import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export const useCarbonList = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.carbonList(filters),
    queryFn: () => apiClient.get('/carbon', { params: filters }),
  });

export const useCarbonTrend = (months = 12) =>
  useQuery({
    queryKey: queryKeys.carbonTrend(months),
    queryFn: () => apiClient.get('/carbon/trend', { params: { months } }),
  });

export const useCarbonByDepartment = () =>
  useQuery({
    queryKey: queryKeys.carbonByDepartment,
    queryFn: () => apiClient.get('/carbon/by-department'),
  });

export const useGenerateCarbonTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.post('/carbon/generate', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['carbon'] }),
  });
};
