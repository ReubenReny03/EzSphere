// A client-only "recent activity" cache fed directly by socket events (not
// backed by any endpoint). RecentActivity reads the same query key with a
// no-op queryFn + staleTime: Infinity, so it only ever changes via pushLiveFeedItem.
export const LIVE_FEED_KEY = ['liveFeed'];
const MAX_ITEMS = 15;

export const pushLiveFeedItem = (queryClient, item) => {
  queryClient.setQueryData(LIVE_FEED_KEY, (old = []) => [
    { id: `${Date.now()}-${Math.random()}`, createdAt: new Date().toISOString(), ...item },
    ...old,
  ].slice(0, MAX_ITEMS));
};
