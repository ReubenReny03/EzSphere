import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export const Table = ({ columns, data, loading, emptyMessage = 'No records found', keyField = '_id' }) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border shadow-soft">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface2">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted',
                  col.numeric && 'text-right',
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row[keyField] ?? i}
              className={cn(
                'border-t border-border transition-colors hover:bg-surface2/60',
                i % 2 === 1 && 'bg-surface2/20',
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-3 text-text', col.numeric && 'text-right tabular-nums')}>
                  {col.renderCell ? col.renderCell(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
