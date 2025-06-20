import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface NavPillProps {
  /** Visible text label */
  label: string;
  /** Optional lucide-react icon component */
  icon?: LucideIcon;
  /** Whether this pill represents the currently active route */
  active?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Called when the pill is selected – keyboard or mouse */
  onSelect?: () => void;
  /** Additional className overrides */
  className?: string;
}

/**
 * Accessible, keyboard-navigable navigation pill.
 * Provides unified styling & behaviour for tabs / buttons across the app.
 */
export const NavPill: React.FC<NavPillProps> = ({
  label,
  icon: Icon,
  active = false,
  disabled = false,
  onSelect,
  className,
}) => {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={!disabled ? onSelect : undefined}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect?.();
        }
      }}
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50',
        active && 'bg-blue-500 text-white shadow',
        !active && 'text-white/70 hover:text-white hover:bg-white/10',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
      <span>{label}</span>
    </button>
  );
};

NavPill.displayName = 'NavPill';

export default NavPill;
