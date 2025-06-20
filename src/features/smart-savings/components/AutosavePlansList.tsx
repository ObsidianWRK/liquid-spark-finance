import React, { useEffect } from 'react';
import { useSmartSavingsStore } from '../store';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { PiggyBank, Pause, Play } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export const AutosavePlansList: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { plans, loading, refresh, pause, resume } = useSmartSavingsStore(
    (s) => ({
      plans: s.plans,
      loading: s.loading,
      refresh: s.refresh,
      pause: s.pause,
      resume: s.resume,
    })
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading && plans.length === 0) {
    return (
      <p className={cn('text-muted-foreground', className)}>
        Loading savings plans…
      </p>
    );
  }

  if (plans.length === 0) {
    return (
      <p className={cn('text-muted-foreground', className)}>
        No savings plans yet.
      </p>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {plans.map((p) => (
        <Card key={p.id}>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <PiggyBank className="text-primary" />
            <CardTitle>
              ${p.targetAmount.toFixed(2)} {p.cadence}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Next transfer {new Date(p.nextTransferDate).toLocaleDateString()}
          </CardContent>
          <CardFooter>
            {p.isActive ? (
              <Button size="sm" onClick={() => pause(p.id)} variant="outline">
                <Pause className="mr-2" /> Pause
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => resume(p.id)}
                variant="secondary"
              >
                <Play className="mr-2" /> Resume
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
