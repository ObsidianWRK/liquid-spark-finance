/**
 * Vueni ContextMenu Component
 * 
 * Reusable context menu with glass morphism styling and accessibility features.
 * Built on Radix UI for full keyboard navigation and screen reader support.
 */

import React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { cn } from '@/shared/lib/utils';

// Context Menu Root
export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

// Menu Content with Vueni styling
interface ContextMenuContentProps extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> {
  children: React.ReactNode;
  className?: string;
}

export const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(({ children, className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        // Base glass morphism styling
        'bg-black/80 backdrop-blur-xl border border-white/10',
        'rounded-2xl p-2 shadow-2xl shadow-black/50',
        
        // Animation
        'animate-in fade-in-0 zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        
        // Z-index to appear above navigation
        'z-50',
        
        // Minimum width
        'min-w-[200px]',
        
        className
      )}
      {...props}
    >
      {children}
    </ContextMenuPrimitive.Content>
  </ContextMenuPrimitive.Portal>
));

ContextMenuContent.displayName = 'ContextMenuContent';

// Menu Item with glass styling
interface ContextMenuItemProps extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(({ children, className, icon, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      // Base styling
      'relative flex items-center gap-3 px-3 py-2.5 mx-1',
      'text-sm text-white/80 font-medium',
      'rounded-xl cursor-pointer',
      
      // Hover and focus states
      'hover:bg-white/10 hover:text-white',
      'focus:bg-white/10 focus:text-white focus:outline-none',
      
      // Disabled state
      'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
      
      // Transition
      'transition-all duration-200',
      
      className
    )}
    {...props}
  >
    {icon && (
      <div className="flex-shrink-0 w-4 h-4 text-white/60">
        {icon}
      </div>
    )}
    <span className="flex-1">{children}</span>
  </ContextMenuPrimitive.Item>
));

ContextMenuItem.displayName = 'ContextMenuItem';

// Menu Separator
export const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn(
      'h-px bg-white/10 mx-2 my-1',
      className
    )}
    {...props}
  />
));

ContextMenuSeparator.displayName = 'ContextMenuSeparator';

// Menu Label for grouping items
export const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-3 py-1.5 text-xs font-semibold text-white/50 uppercase tracking-wider',
      className
    )}
    {...props}
  />
));

ContextMenuLabel.displayName = 'ContextMenuLabel';

// Export all components
export {
  ContextMenuPrimitive,
}; 