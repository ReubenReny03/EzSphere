import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export const useChallenges = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.challenges(filters),
    queryFn: () => apiClient.get('/challenges', { params: filters }),
  });

export const useChallengeParticipation = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.challengeParticipation(filters),
    queryFn: () => apiClient.get('/challenges/participation', { params: filters }),
  });

const invalidateChallenges = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ['challenges'] });
  queryClient.invalidateQueries({ queryKey: ['me'] });
  queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
  queryClient.invalidateQueries({ queryKey: queryKeys.scoringOverview });
};

export const useJoinChallenge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.post(`/challenges/${id}/join`),
    onSuccess: () => invalidateChallenges(queryClient),
  });
};

export const useSetChallengeStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => apiClient.patch(`/challenges/${id}/status`, { status }),
    onSuccess: () => invalidateChallenges(queryClient),
  });
};

// Optimistically drop the reviewed item from the (Pending-only) participation
// queue immediately, rolling back if the request fails.
const useReviewChallengeParticipation = (action) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.patch(`/challenges/participation/${id}/${action}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['challenges', 'participation'] });
      const previous = queryClient.getQueriesData({ queryKey: ['challenges', 'participation'] });

      previous.forEach(([key, value]) => {
        if (!value?.data) return;
        queryClient.setQueryData(key, { ...value, data: value.data.filter((p) => p._id !== id) });
      });

      return { previous };
    },
    onError: (err, id, context) => {
      context?.previous?.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
    onSettled: () => invalidateChallenges(queryClient),
  });
};

export const useApproveChallengeParticipation = () => useReviewChallengeParticipation('approve');
export const useRejectChallengeParticipation = () => useReviewChallengeParticipation('reject');
