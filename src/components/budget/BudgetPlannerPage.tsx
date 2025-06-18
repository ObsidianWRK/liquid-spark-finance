import React, { useEffect, useState } from 'react';
import { budgetService } from '@/services/budgetService';
import { BudgetCategory } from '@/types/budget';
import {
  Plus,
  Trash2,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const BudgetPlannerPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatBudget, setNewCatBudget] = useState('');
  const [expandedCatIds, setExpandedCatIds] = useState<string[]>([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const cats = await budgetService.listCategories();
    setCategories(cats);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || Number(newCatBudget) <= 0) return;
    await budgetService.addCategory({ name: newCatName.trim(), budget: Number(newCatBudget), color: randomColor(), recurring: true });
    setNewCatName('');
    setNewCatBudget('');
    setShowAddForm(false);
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this budget category?')) {
      await budgetService.deleteCategory(id);
      fetch();
    }
  };

  const randomColor = () => {
    const palette = ['#4ade80', '#38bdf8', '#f97316', '#a855f7', '#facc15', '#ec4899', '#818cf8'];
    return palette[Math.floor(Math.random() * palette.length)];
  };

  const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);

  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amt);

  const progressColor = (percent: number) => {
    if (percent >= 100) return 'bg-red-500';
    if (percent >= 75) return 'bg-orange-500';
    if (percent >= 50) return 'bg-yellow-500';
    if (percent >= 25) return 'bg-lime-500';
    return 'bg-green-500';
  };

  const toggleExpand = (id: string) => {
    setExpandedCatIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="liquid-glass-button flex items-center gap-2 px-3 py-2 rounded-xl text-white/80 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Dashboard</span>
        </button>

        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <span>Budget Planner</span>
            </h1>
            <p className="text-white/70 mt-2">Plan and monitor your spending like a pro</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 transition-all px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>New Category</span>
          </button>
        </header>

        {/* Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6 space-y-4 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Budgets</h2>
            <div className="space-y-4">
              {categories.map((cat) => {
                const percent = (cat.spent / cat.budget) * 100;
                const over = cat.spent - cat.budget;
                const isExpanded = expandedCatIds.includes(cat.id);
                return (
                  <div key={cat.id} className="bg-white/[0.04] rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => toggleExpand(cat.id)}>
                        <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                        <span className="font-medium">{cat.name}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-white/60" /> : <ChevronDown className="w-4 h-4 text-white/60" />}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={cn('text-sm font-medium', over > 0 ? 'text-red-400' : 'text-white')}>{formatCurrency(cat.spent)}</span>
                        <span className="text-sm text-white/50">/ {formatCurrency(cat.budget)}</span>
                        <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-white/[0.1] rounded-full h-2 mt-3">
                      <div className={cn('h-2 rounded-full', progressColor(percent))} style={{ width: `${Math.min(percent, 100)}%` }} />
                    </div>
                    {isExpanded && (
                      <div className="mt-4 text-sm text-white/70 space-y-1">
                        <p>Remaining: {formatCurrency(Math.max(cat.budget - cat.spent, 0))}</p>
                        {over > 0 && <p className="text-red-400">Over budget by {formatCurrency(over)}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
              {categories.length === 0 && (
                <p className="text-white/60">No categories yet – add one to get started</p>
              )}
            </div>
          </div>
          {/* Pie chart */}
          <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Allocation</h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="budget"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {categories.map((entry) => (
                      <Cell key={entry.id} fill={entry.color ?? randomColor()} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={24} wrapperStyle={{ color: 'white' }} />
                  <ReTooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-white/80">
              <p>Total Budget: {formatCurrency(totalBudget)}</p>
              <p>Total Spent: {formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </div>

        {/* Add Category Drawer */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowAddForm(false)}>
            <div
              className="bg-black border border-white/10 rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">New Budget Category</h3>
              <form className="space-y-4" onSubmit={handleAddCategory}>
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input
                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Monthly Budget ($)</label>
                  <input
                    type="number"
                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    value={newCatBudget}
                    onChange={(e) => setNewCatBudget(e.target.value)}
                    required
                    min={1}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPlannerPage; 