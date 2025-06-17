import React from 'react';
import { cn } from '@/lib/utils';
import Navigation from '@/components/layout/Navigation';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      <main className={cn('main-with-sidebar', className)}>
        <div className="container mx-auto py-6">{children}</div>
      </main>
    </div>
  );
};

// Page header component
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-primary">{title}</h1>
        {description && <p className="mt-2 text-secondary">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  </div>
);

// Content section wrapper
interface ContentSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({ title, children, className }) => (
  <section className={cn('mb-8', className)}>
    {title && (
      <h2 className="text-xl font-semibold text-primary mb-4">{title}</h2>
    )}
    {children}
  </section>
);

// Simple grid component
interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({ children, cols = 1, gap = 4, className }) => {
  const colsClass = `grid-cols-${cols}`;
  const gapClass = `gap-${gap}`;
  return (
    <div className={cn('grid', colsClass, gapClass, className)}>{children}</div>
  );
};

// Simple stack component
interface StackProps {
  children: React.ReactNode;
  spacing?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  children,
  spacing = 4,
  direction = 'vertical',
  className,
}) => {
  const spacingClass = `gap-${spacing}`;
  const directionClass = direction === 'vertical' ? 'flex-col' : 'flex-row';
  return (
    <div className={cn('flex', directionClass, spacingClass, className)}>
      {children}
    </div>
  );
}; 