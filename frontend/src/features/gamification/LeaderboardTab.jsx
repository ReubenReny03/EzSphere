import { Table } from '@/components/ui/Table';
import { useLeaderboard } from '@/api/hooks/useLeaderboard';

export const LeaderboardTab = () => {
  const { data, isLoading } = useLeaderboard({ scope: 'global', limit: 50 });
  const rows = (data?.data || []).map((row, i) => ({ ...row, rank: i + 1 }));

  const columns = [
    { key: 'rank', header: 'Rank', numeric: true },
    { key: 'name', header: 'Name' },
    { key: 'department', header: 'Department', renderCell: (row) => row.department?.name },
    { key: 'xp', header: 'XP', numeric: true },
  ];

  return <Table columns={columns} data={rows} loading={isLoading} emptyMessage="No leaderboard data yet" />;
};
