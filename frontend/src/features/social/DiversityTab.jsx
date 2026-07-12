import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDepartments } from '@/api/hooks/useDepartments';

export const DiversityTab = () => {
  const { data, isLoading } = useDepartments({ limit: 100, status: 'active' });
  const rows = (data?.data || []).map((d) => ({ name: d.code, diversityScore: d.diversityScore }));

  return (
    <Card title="Diversity Score by Department">
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : rows.length === 0 ? (
        <EmptyState message="No department diversity data yet" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3242" />
            <XAxis dataKey="name" stroke="#8b93a7" fontSize={12} />
            <YAxis stroke="#8b93a7" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ background: '#151922', border: '1px solid #2a3242', borderRadius: 8 }}
              labelStyle={{ color: '#e6e9ef' }}
            />
            <Bar dataKey="diversityScore" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};
