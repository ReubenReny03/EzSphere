import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export const useEmissionFactors = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.emissionFactors(filters),
    queryFn: () => apiClient.get('/emission-factors', { params: filters }),
  });

export const useCreateEmissionFactor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.post('/emission-factors', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['emissionFactors'] }),
  });
};

export const useUpdateEmissionFactor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiClient.patch(`/emission-factors/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['emissionFactors'] }),
  });
};

export const useDeleteEmissionFactor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/emission-factors/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['emissionFactors'] }),
  });
};
