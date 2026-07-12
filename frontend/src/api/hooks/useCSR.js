import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export const useCSRActivities = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.csrActivities(filters),
    queryFn: () => apiClient.get('/csr', { params: filters }),
  });

export const useJoinCSRActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, proofFile }) => {
      const formData = new FormData();
      if (proofFile) formData.append('proof', proofFile);
      return apiClient.post(`/csr/${id}/join`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['csr'] }),
  });
};

export const useCSRQueue = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.csrQueue(filters),
    queryFn: () => apiClient.get('/csr/participation/queue', { params: filters }),
  });

const invalidateCSR = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ['csr'] });
  queryClient.invalidateQueries({ queryKey: ['me'] });
  queryClient.invalidateQueries({ queryKey: queryKeys.scoringOverview });
  queryClient.invalidateQueries({ queryKey: queryKeys.scoringDepartments });
};

// Shared optimistic-removal logic for approve/reject: the queue only ever
// shows Pending items, so a reviewed item should disappear immediately
// rather than wait for the round-trip.
const useReviewCSRParticipation = (action) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.patch(`/csr/participation/${id}/${action}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['csr', 'queue'] });
      const previousQueues = queryClient.getQueriesData({ queryKey: ['csr', 'queue'] });

      previousQueues.forEach(([key, value]) => {
        if (!value?.data) return;
        queryClient.setQueryData(key, { ...value, data: value.data.filter((p) => p._id !== id) });
      });

      return { previousQueues };
    },
    onError: (err, id, context) => {
      context?.previousQueues?.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
    onSettled: () => invalidateCSR(queryClient),
  });
};

export const useApproveCSRParticipation = () => useReviewCSRParticipation('approve');
export const useRejectCSRParticipation = () => useReviewCSRParticipation('reject');
