import React, { useEffect, useState } from 'react';
import { investmentService } from '@/services/investmentService';
import { Holding, PortfolioSnapshot } from '@/types/investments';
import {
  TrendingUp,
  Plus,
  DollarSign,
  PieChart as PieIcon
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { cn } from '@/lib/utils';

const InvestmentTrackerPage = () => {
  const [loading, setLoading] = useState(true);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [snapshots, setSnapshots] = useState<PortfolioSnapshot[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await investmentService.getPortfolio();
    setHoldings(data.holdings);
    setSnapshots(data.snapshots);
    setLoading(false);
  };

  const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.purchasePrice, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = (totalGain / totalCost) * 100;

  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amt);

  const palette = ['#4ade80', '#38bdf8', '#f97316', '#a855f7', '#facc15', '#ec4899', '#818cf8'];
  const getColor = (idx: number) => palette[idx % palette.length];

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <PieIcon className="w-8 h-8 text-yellow-400" />
              <span>Investment Tracker</span>
            </h1>
            <p className="text-white/70 mt-2">Visualise your portfolio performance and allocation</p>
          </div>
          {/* Future: add new holding */}
          <button className="bg-yellow-500 hover:bg-yellow-600 transition-all px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg">
            <Plus className="w-5 h-5" />
            <span>New Holding</span>
          </button>
        </header>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6 space-y-2">
            <p className="text-sm uppercase tracking-wide text-white/60">Portfolio Value</p>
            <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
          </div>
          <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6 space-y-2">
            <p className="text-sm uppercase tracking-wide text-white/60">Total Gain</p>
            <p className={cn('text-3xl font-bold', totalGain >= 0 ? 'text-green-400' : 'text-red-400')}>{formatCurrency(totalGain)}</p>
          </div>
          <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6 space-y-2">
            <p className="text-sm uppercase tracking-wide text-white/60">Return (%)</p>
            <p className={cn('text-3xl font-bold', totalGainPercent >= 0 ? 'text-green-400' : 'text-red-400')}>{totalGainPercent.toFixed(1)}%</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Growth line chart */}
          <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Growth</h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={snapshots} margin={{ right: 20 }}>
                  <XAxis dataKey="date" tick={{ fill: 'white', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'white', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <ReTooltip formatter={(value: number) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Allocation pie chart */}
          <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Allocation</h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={holdings} dataKey={(h: Holding) => h.shares * h.currentPrice} nameKey="symbol" innerRadius={50} outerRadius={80}>
                    {holdings.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={getColor(idx)} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={24} wrapperStyle={{ color: 'white' }} />
                  <ReTooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Holdings table */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Holdings</h2>
          <table className="min-w-full text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="text-left font-normal pb-2 pr-4">Symbol</th>
                <th className="text-left font-normal pb-2 pr-4">Shares</th>
                <th className="text-left font-normal pb-2 pr-4">Avg Cost</th>
                <th className="text-left font-normal pb-2 pr-4">Current Price</th>
                <th className="text-left font-normal pb-2 pr-4">Value</th>
                <th className="text-left font-normal pb-2 pr-4">Gain</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, idx) => {
                const value = h.currentPrice * h.shares;
                const cost = h.purchasePrice * h.shares;
                const gain = value - cost;
                return (
                  <tr key={h.id} className="border-t border-white/10">
                    <td className="py-3 pr-4 whitespace-nowrap">{h.symbol}</td>
                    <td className="py-3 pr-4">{h.shares}</td>
                    <td className="py-3 pr-4">{formatCurrency(h.purchasePrice)}</td>
                    <td className="py-3 pr-4">{formatCurrency(h.currentPrice)}</td>
                    <td className="py-3 pr-4">{formatCurrency(value)}</td>
                    <td className={cn('py-3 pr-4', gain >= 0 ? 'text-green-400' : 'text-red-400')}>{formatCurrency(gain)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvestmentTrackerPage; 