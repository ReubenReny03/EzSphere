import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export const useProducts = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => apiClient.get('/products', { params: filters }),
  });
