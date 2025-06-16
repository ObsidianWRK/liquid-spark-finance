import React from 'react';
import { Button } from './button';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  emoji = "📭",
  title,
  description,
  action,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      emoji: 'text-4xl mb-2',
      title: 'text-lg font-semibold',
      description: 'text-sm',
      spacing: 'space-y-2'
    },
    md: {
      container: 'py-12',
      emoji: 'text-6xl mb-4',
      title: 'text-xl font-semibold',
      description: 'text-base',
      spacing: 'space-y-3'
    },
    lg: {
      container: 'py-16',
      emoji: 'text-8xl mb-6',
      title: 'text-2xl font-bold',
      description: 'text-lg',
      spacing: 'space-y-4'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`text-center ${classes.container} ${className}`}>
      <div className={`${classes.spacing}`}>
        <div className={classes.emoji} role="img" aria-hidden="true">
          {emoji}
        </div>
        <h3 className={`${classes.title} text-white`}>
          {title}
        </h3>
        {description && (
          <p className={`${classes.description} text-white/60 max-w-md mx-auto`}>
            {description}
          </p>
        )}
        {action && (
          <div className="pt-2">
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className="min-w-[120px]"
            >
              {action.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState; 