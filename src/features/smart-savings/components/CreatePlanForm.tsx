import React, { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { useSmartSavingsStore } from "../store";
import { PlusCircle } from "lucide-react";

export const CreatePlanForm: React.FC = () => {
  const create = useSmartSavingsStore((s) => s.create);
  const loading = useSmartSavingsStore((s) => s.loading);
  const [amount, setAmount] = useState(10);
  const [cadence, setCadence] = useState<"daily" | "weekly" | "monthly">("weekly");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create({ accountId: "acc1", targetAmount: amount, cadence, isActive: true } as any);
    setAmount(10);
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <Input
        type="number"
        value={amount}
        min={1}
        step={1}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-24"
      />
      <Select value={cadence} onValueChange={(v) => setCadence(v as any)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={loading} variant="secondary">
        <PlusCircle className="mr-2" /> Create Plan
      </Button>
    </form>
  );
}; 