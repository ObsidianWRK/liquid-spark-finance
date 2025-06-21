import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Apply padding classes. Can be boolean to use default padding or string to specify custom padding classes.
   */
  padding?: boolean | string;
}

const DEFAULT_PADDING = 'p-4 sm:p-6';

export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ children, className, padding, ...rest }, ref) => {
    const paddingClass =
      typeof padding === 'string'
        ? padding
        : padding
        ? DEFAULT_PADDING
        : undefined;

    return (
      <div
        ref={ref}
        className={cn('min-h-screen bg-black text-white', paddingClass, className)}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
PageContainer.displayName = 'PageContainer';

export default PageContainer; 