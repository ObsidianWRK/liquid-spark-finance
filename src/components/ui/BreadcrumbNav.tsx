import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ 
  items, 
  className,
  showHome = true 
}) => {
  const location = useLocation();

  // Auto-generate breadcrumbs based on current path if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (showHome) {
      breadcrumbs.push({ label: 'Home', href: '/' });
    }

    pathSegments.forEach((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const isLast = index === pathSegments.length - 1;
      
      // Capitalize and format segment
      const label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/([A-Z])/g, ' $1')
        .trim();

      breadcrumbs.push({
        label,
        href: isLast ? undefined : href,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs for home or single-level pages
  }

  return (
    <nav 
      aria-label="Breadcrumb navigation"
      className={cn('mb-6', className)}
    >
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight 
                className="w-4 h-4 text-white/40 mx-2" 
                aria-hidden="true"
              />
            )}
            
            {item.href ? (
              <Link
                to={item.href}
                className="text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black rounded-lg px-2 py-1"
                aria-label={index === 0 && item.label === 'Home' ? 'Return to home page' : `Go to ${item.label}`}
              >
                {index === 0 && item.label === 'Home' ? (
                  <div className="flex items-center space-x-1">
                    <Home className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">Home</span>
                  </div>
                ) : (
                  item.label
                )}
              </Link>
            ) : (
              <span 
                className="text-white font-medium"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNav; 