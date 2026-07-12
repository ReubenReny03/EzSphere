import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCarbonTrend } from '@/api/hooks/useCarbon';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const EmissionsTrendChart = () => {
  const { data, isLoading } = useCarbonTrend(12);
  const rows = (data?.data || []).map((d) => ({
    label: `${MONTH_NAMES[d._id.month - 1]} '${String(d._id.year).slice(2)}`,
    totalCO2: Math.round(d.totalCO2),
  }));

  return (
    <Card title="Emissions Trend (12 months)">
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : rows.length === 0 ? (
        <EmptyState message="No carbon transactions recorded yet" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3242" />
            <XAxis dataKey="label" stroke="#8b93a7" fontSize={12} />
            <YAxis stroke="#8b93a7" fontSize={12} />
            <Tooltip
              contentStyle={{ background: '#151922', border: '1px solid #2a3242', borderRadius: 8 }}
              labelStyle={{ color: '#e6e9ef' }}
            />
            <Line type="monotone" dataKey="totalCO2" name="kg CO₂e" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};
