import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon | React.ComponentType<any>;
  emoji?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  emoji,
  title,
  description,
  action,
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      icon: 'w-12 h-12',
      emoji: 'text-4xl',
      title: 'text-lg',
      description: 'text-sm',
      button: 'px-4 py-2 text-sm'
    },
    md: {
      container: 'py-12 px-6',
      icon: 'w-16 h-16',
      emoji: 'text-6xl',
      title: 'text-xl',
      description: 'text-base',
      button: 'px-6 py-3 text-base'
    },
    lg: {
      container: 'py-16 px-8',
      icon: 'w-20 h-20',
      emoji: 'text-8xl',
      title: 'text-2xl',
      description: 'text-lg',
      button: 'px-8 py-4 text-lg'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn(
      'text-center',
      currentSize.container,
      className
    )}>
      {/* Icon or Emoji */}
      <div className="mb-4">
        {emoji ? (
          <div className={cn('mb-4', currentSize.emoji)}>{emoji}</div>
        ) : Icon ? (
          <div className={cn(
            'mx-auto mb-4 rounded-full bg-white/[0.05] flex items-center justify-center',
            currentSize.icon
          )}>
            <Icon className={cn('text-white/40', size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10')} />
          </div>
        ) : null}
      </div>

      {/* Title */}
      <h3 className={cn(
        'font-bold text-white mb-2',
        currentSize.title
      )}>
        {title}
      </h3>

      {/* Description */}
      <p className={cn(
        'text-white/60 mb-6 max-w-md mx-auto',
        currentSize.description
      )}>
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            'font-medium rounded-lg transition-all flex items-center space-x-2 mx-auto',
            currentSize.button,
            action.variant === 'secondary' 
              ? 'text-white/70 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/30'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
          )}
        >
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState; 