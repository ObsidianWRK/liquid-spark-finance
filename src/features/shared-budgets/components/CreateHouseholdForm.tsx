import React, { useState } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { useSharedBudgetsStore } from '../store';
import { Users } from 'lucide-react';

export const CreateHouseholdForm: React.FC = () => {
  const create = useSharedBudgetsStore((s) => s.create);
  const loading = useSharedBudgetsStore((s) => s.loading);
  const [name, setName] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await create(name.trim());
    setName('');
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <Input
        placeholder="Household name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-56"
      />
      <Button
        type="submit"
        disabled={loading || !name.trim()}
        variant="secondary"
      >
        <Users className="mr-2" /> Create Household
      </Button>
    </form>
  );
};
