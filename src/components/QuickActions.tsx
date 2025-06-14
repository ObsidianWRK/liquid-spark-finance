
import React from 'react';
import GlassCard from './GlassCard';
import { ArrowUp, ArrowDown, Plus } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      id: 'transfer',
      label: 'Transfer',
      icon: ArrowUp,
      color: 'text-blue-400'
    },
    {
      id: 'pay',
      label: 'Pay',
      icon: ArrowDown,
      color: 'text-green-400'
    },
    {
      id: 'deposit',
      label: 'Deposit',
      icon: Plus,
      color: 'text-orange-400'
    }
  ];

  return (
    <GlassCard 
      className="p-4 mb-6 stagger-item"
      style={{ 
        animationDelay: '100ms'
      }}
    >
      <div className="flex justify-between items-center space-x-4">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              className="glass-interactive flex-1 py-3 px-4 flex flex-col items-center space-y-2 hover:bg-white/10"
            >
              <IconComponent className={`w-6 h-6 ${action.color}`} />
              <span className="text-white text-sm font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default QuickActions;
