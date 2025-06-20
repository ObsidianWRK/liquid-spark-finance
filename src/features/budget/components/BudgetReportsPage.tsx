import React, { useState } from 'react';
import { Calendar, Download, TrendingDown, TrendingUp, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockReportService, BudgetReport } from '@/services/mockReportService';
import { cn } from '@/shared/lib/utils';

const BudgetReportsPage = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [selectedYear, setSelectedYear] = useState(2024);
  
  const report = mockReportService.getBudgetReport(selectedMonth, selectedYear);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getVarianceColor = (spent: number, budget: number) => {
    const variance = ((spent - budget) / budget) * 100;
    if (variance > 10) return 'text-red-400';
    if (variance < -10) return 'text-green-400';
    return 'text-white';
  };

  const getProgressWidth = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100) return 'red';
    if (percentage > 80) return 'orange';
    return 'green';
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.05] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Dashboard</span>
      </button>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Budget Reports</h1>
          <p className="text-white/70">Track your spending against your budget goals</p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
          >
            {months.map(month => (
              <option key={month} value={month} className="bg-gray-800">
                {month}
              </option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
          >
            <option value={2024} className="bg-gray-800">2024</option>
            <option value={2023} className="bg-gray-800">2023</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 hover:bg-white/[0.03] transition-all duration-300" data-testid="budget-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(report.totalSpent)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 hover:bg-white/[0.03] transition-all duration-300" data-testid="budget-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Budget</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(report.totalBudget)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 hover:bg-white/[0.03] transition-all duration-300" data-testid="budget-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Remaining</p>
              <p className={cn(
                "text-2xl font-bold",
                report.totalBudget - report.totalSpent > 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {formatCurrency(report.totalBudget - report.totalSpent)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 hover:bg-white/[0.03] transition-all duration-300" data-testid="budget-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Category Breakdown</h2>
          <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>

        <div className="space-y-4">
          {report.categories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-white">{category.name}</h3>
                  <span className="text-white/60 text-sm">
                    {category.transactions} transactions
                  </span>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getVarianceColor(category.spent, category.budget)}`}>
                    {formatCurrency(category.spent)}
                  </p>
                  <p className="text-white/60 text-sm">of {formatCurrency(category.budget)}</p>
                </div>
              </div>
              
              <div className="w-full bg-white/[0.05] rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full transition-all duration-700",
                    getProgressColor(category.spent, category.budget) === 'red' ? 'bg-red-500' :
                    getProgressColor(category.spent, category.budget) === 'orange' ? 'bg-orange-500' : 'bg-green-500'
                  )}
                  style={{ width: `${getProgressWidth(category.spent, category.budget)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 hover:bg-white/[0.03] transition-all duration-300" data-testid="budget-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Monthly Insights</h2>
        </div>
        
        <div className="space-y-3">
          {report.insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-xl">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-white/80">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetReportsPage;
