import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export const useCompliance = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.compliance(filters),
    queryFn: () => apiClient.get('/compliance', { params: filters }),
  });

export const useAudits = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.audits(filters),
    queryFn: () => apiClient.get('/audits', { params: filters }),
  });

const invalidateCompliance = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ['compliance'] });
  queryClient.invalidateQueries({ queryKey: queryKeys.scoringOverview });
};

export const useCreateComplianceIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.post('/compliance', data),
    onSuccess: () => invalidateCompliance(queryClient),
  });
};

export const useUpdateComplianceIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiClient.patch(`/compliance/${id}`, data),
    onSuccess: () => invalidateCompliance(queryClient),
  });
};

export const useDeleteComplianceIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/compliance/${id}`),
    onSuccess: () => invalidateCompliance(queryClient),
  });
};
