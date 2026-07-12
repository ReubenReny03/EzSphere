import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export const Spinner = ({ className }) => <Loader2 className={cn('h-5 w-5 animate-spin text-muted', className)} />;
