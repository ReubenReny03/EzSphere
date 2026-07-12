import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export const usePolicies = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.policies(filters),
    queryFn: () => apiClient.get('/policies', { params: filters }),
  });

export const usePolicyAcknowledgements = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.policyAcknowledgements(filters),
    queryFn: () => apiClient.get('/policies/acknowledgements', { params: filters }),
  });

export const useAcknowledgePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (policyId) => apiClient.post(`/policies/${policyId}/acknowledge`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['policyAcknowledgements'] }),
  });
};
