import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@/shared/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Base iOS26 toggle styling - pill-shaped with proper size
      'peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-vueni-pill transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
      // Dark mode styling
      'data-[state=checked]:bg-vueni-sapphireDust data-[state=unchecked]:bg-vueni-n500/60',
      // Light mode styling
      'dark:data-[state=checked]:bg-vueni-sapphireDust dark:data-[state=unchecked]:bg-vueni-n500/40',
      // Border for better definition
      'border-2 border-transparent',
      // Smooth shadow for depth
      'shadow-inner',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        // iOS26 thumb styling - perfect circle with shadow
        'pointer-events-none block h-5 w-5 rounded-vueni-pill bg-white shadow-lg ring-0 transition-all duration-300 ease-out',
        // Transform for smooth sliding animation
        'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1',
        // Enhanced shadow for iOS26 look
        'shadow-[0_2px_8px_rgba(0,0,0,0.2)]',
        // Dark mode thumb styling
        'dark:bg-white dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]',
        // Light mode thumb styling
        'bg-white shadow-[0_2px_6px_rgba(0,0,0,0.15)]'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
