import React from 'react';
import { ArrowUp, ArrowDown, Plus } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      id: 'transfer',
      label: 'Transfer',
      icon: ArrowUp,
      color: 'text-blue-400',
    },
    {
      id: 'pay',
      label: 'Pay',
      icon: ArrowDown,
      color: 'text-green-400',
    },
    {
      id: 'deposit',
      label: 'Deposit',
      icon: Plus,
      color: 'text-orange-400',
    },
  ];

  return (
    <div
      className="stagger-item"
      style={{
        animationDelay: '100ms',
      }}
    >
      <div className="flex justify-between items-center space-x-4">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              className="liquid-glass-button flex-1 py-4 px-4 flex flex-col items-center space-y-2 cursor-pointer rounded-xl"
            >
              <IconComponent className={`w-6 h-6 ${action.color}`} />
              <span className="text-white text-sm font-medium">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
