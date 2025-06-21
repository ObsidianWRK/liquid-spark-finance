import { cn } from '@/shared/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-vueni-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };
export default Skeleton;
