import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export const useSettings = () =>
  useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => apiClient.get('/settings'),
  });

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.patch('/settings', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.settings }),
  });
};
