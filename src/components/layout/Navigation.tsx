import React, { useState } from 'react';
import { Home, CreditCard, FileText, PieChart, TrendingUp, Settings, User, Menu, X, Plus, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { routes } from '@/routes';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: routes.home },
    { id: 'accounts', label: 'Accounts', icon: CreditCard, path: routes.accounts },
    { id: 'transactions', label: 'Transactions', icon: FileText, path: routes.transactions },
    { id: 'insights', label: 'Insights', icon: PieChart, path: routes.insights },
    { id: 'reports', label: 'Reports', icon: TrendingUp, path: routes.reports },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-secondary lg:border-r lg:border-primary">
        <div className="flex h-16 items-center px-6 border-b border-primary">
          <h1 className="text-xl font-semibold text-primary">Vueni</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  active
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200'
                    : 'text-secondary hover:bg-tertiary hover:text-primary'
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-primary">
          <button
            onClick={() => navigate(routes.profile)}
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-tertiary"
          >
            <User className="mr-3 h-5 w-5" />
            Profile
          </button>
          <button
            onClick={() => navigate(routes.settings)}
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-tertiary"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-primary border-b border-primary z-header">
        <div className="flex items-center justify-between h-full px-4">
          <h1 className="text-lg font-semibold text-primary">Vueni</h1>
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile slide-out menu */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 right-0 bottom-0 w-72 bg-primary border-l border-primary transform transition-transform duration-300 z-modal',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-primary">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  'w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors',
                  active
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200'
                    : 'text-secondary hover:bg-secondary hover:text-primary'
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary">
          <button
            onClick={() => handleNavigation(routes.profile)}
            className="w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-secondary"
          >
            <User className="mr-3 h-5 w-5" />
            Profile
          </button>
          <button
            onClick={() => handleNavigation(routes.settings)}
            className="w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-secondary"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </button>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-primary border-t border-primary z-sticky">
        <div className="grid grid-cols-4 h-16">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  'flex flex-col items-center justify-center py-2 transition-colors',
                  active ? 'text-brand-600 dark:text-brand-400' : 'text-tertiary hover:text-primary'
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Floating action button */}
      <button
        onClick={() => navigate(routes.transactions + '/new')}
        className="fixed right-4 bottom-20 lg:bottom-8 w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center z-sticky"
        aria-label="Add transaction"
      >
        <Plus className="h-6 w-6" />
      </button>
    </>
  );
};

export default Navigation; 