import React, { useEffect } from 'react';
import { useBankLinkingStore } from '../store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Banknote, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export const LinkedAccountsList: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { accounts, loading, refresh, unlink } = useBankLinkingStore((s) => ({
    accounts: s.accounts,
    loading: s.loading,
    refresh: s.refresh,
    unlink: s.unlink,
  }));

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading && accounts.length === 0) {
    return (
      <p className={cn('text-muted-foreground', className)}>
        Loading accounts…
      </p>
    );
  }

  if (accounts.length === 0) {
    return (
      <p className={cn('text-muted-foreground', className)}>
        No linked accounts yet.
      </p>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {accounts.map((acc) => (
        <Card key={acc.id}>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Banknote className="text-primary" />
              <CardTitle>{acc.displayName}</CardTitle>
            </div>
            <Button size="icon" variant="ghost" onClick={() => unlink(acc.id)}>
              <X className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {acc.institutionName} • ****{acc.lastFour}
            </p>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Linked {new Date(acc.createdAt).toLocaleDateString()}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
