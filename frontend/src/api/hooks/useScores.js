import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export const useScoringOverview = () =>
  useQuery({
    queryKey: queryKeys.scoringOverview,
    queryFn: () => apiClient.get('/scoring/overview'),
  });

export const useScoringDepartments = () =>
  useQuery({
    queryKey: queryKeys.scoringDepartments,
    queryFn: () => apiClient.get('/scoring/departments'),
  });
