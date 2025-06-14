
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
        animationDelay: '100ms',
        borderRadius: '16px'
      }}
    >
      <div className="flex justify-between items-center space-x-4">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              className="glass-interactive flex-1 py-3 px-4 flex flex-col items-center space-y-2 hover:bg-white/10 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px'
              }}
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
