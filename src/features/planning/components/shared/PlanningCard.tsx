import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PlanningCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'highlight';
  onClick?: () => void;
}

const PlanningCard: React.FC<PlanningCardProps> = ({
  title,
  description,
  icon: Icon,
  iconColor = 'text-blue-400',
  children,
  className,
  variant = 'default',
  onClick
}) => {
  const baseClasses = "rounded-2xl border transition-all duration-200";
  
  const variantClasses = {
    default: "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.03]",
    gradient: "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20",
    highlight: "bg-white/[0.05] border-white/[0.12] hover:bg-white/[0.07]"
  };

  const cardClasses = cn(
    baseClasses,
    variantClasses[variant],
            onClick && "card-hover-subtle",
    className
  );

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {Icon && (
            <div className="flex-shrink-0">
              <Icon className={cn("w-6 h-6", iconColor)} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            {description && (
              <p className="text-white/60 text-sm">{description}</p>
            )}
          </div>
        </div>

        {/* Content */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanningCard; 