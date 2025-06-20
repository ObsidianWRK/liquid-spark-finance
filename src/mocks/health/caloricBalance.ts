export interface CaloricBalanceEntry {
  date: string;
  surplus: number;
  impulseCount: number;
}

const now = new Date();
const days = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date(now);
  d.setDate(now.getDate() - (6 - i));
  return d.toISOString().slice(0, 10);
});

export const caloricBalanceData: CaloricBalanceEntry[] = [
  { date: days[0], surplus: 150, impulseCount: 0 },
  { date: days[1], surplus: 220, impulseCount: 1 },
  { date: days[2], surplus: -80, impulseCount: 0 },
  { date: days[3], surplus: 310, impulseCount: 2 },
  { date: days[4], surplus: 450, impulseCount: 1 },
  { date: days[5], surplus: 520, impulseCount: 3 },
  { date: days[6], surplus: 180, impulseCount: 0 },
];

export async function getCaloricBalance(): Promise<CaloricBalanceEntry[]> {
  await new Promise((r) => setTimeout(r, 200));
  return caloricBalanceData;
}
