import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export const useRedeemReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rewardId) => apiClient.post(`/gamification/rewards/${rewardId}/redeem`),
    onMutate: async (rewardId) => {
      await queryClient.cancelQueries({ queryKey: ['rewards'] });
      const previousRewards = queryClient.getQueriesData({ queryKey: ['rewards'] });

      previousRewards.forEach(([key, value]) => {
        if (!value?.data) return;
        queryClient.setQueryData(key, {
          ...value,
          data: value.data.map((r) => (r._id === rewardId ? { ...r, stock: Math.max(0, r.stock - 1) } : r)),
        });
      });

      return { previousRewards };
    },
    onError: (err, rewardId, context) => {
      context?.previousRewards?.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
