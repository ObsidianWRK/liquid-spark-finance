import React from 'react';
import { cn } from '@/shared/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';

interface DateSeparatorProps {
  date: Date;
  className?: string;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date, className }) => {
  const label = React.useMemo(() => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  }, [date]);

  return (
    <div
      role="presentation"
      className={cn(
        'sticky top-0 z-10 grid items-center gap-3 lg:gap-4',
        'grid-cols-[48px_1fr_96px_110px_96px]',
        'py-2 px-4 backdrop-blur-md bg-zinc-900/60 border-b border-white/10',
        className
      )}
      style={{ minHeight: '40px' }}
    >
      <div
        className="col-span-full text-sm font-medium text-white/80"
        data-testid="date-separator"
      >
        {label}
      </div>
    </div>
  );
};

export default DateSeparator;
