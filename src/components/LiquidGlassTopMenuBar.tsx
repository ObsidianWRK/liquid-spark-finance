import React, { useState } from 'react';
import { 
  File, 
  Edit, 
  Eye, 
  Settings, 
  HelpCircle,
  User,
  Search,
  Bell,
  ChevronDown,
  Home,
  BarChart3,
  Wallet,
  TrendingUp
} from 'lucide-react';
import LiquidGlassSVGFilters from '@/components/ui/LiquidGlassSVGFilters';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface MenuBarProps {
  className?: string;
  onMenuItemClick?: (item: string) => void;
}

interface MenuItem {
  label: string;
  items: { label: string; shortcut?: string; separator?: boolean }[];
}

const LiquidGlassTopMenuBar = ({ className, onMenuItemClick }: MenuBarProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      label: 'File',
      items: [
        { label: 'New Transaction', shortcut: '⌘N' },
        { label: 'Import Data', shortcut: '⌘I' },
        { label: 'Export Report', shortcut: '⌘E' },
        { label: '', separator: true },
        { label: 'Settings', shortcut: '⌘,' }
      ]
    },
    {
      label: 'View', 
      items: [
        { label: 'Dashboard', shortcut: '⌘1' },
        { label: 'Transactions', shortcut: '⌘2' },
        { label: 'Reports', shortcut: '⌘3' },
        { label: 'Insights', shortcut: '⌘4' },
        { label: '', separator: true },
        { label: 'Full Screen', shortcut: '⌃⌘F' }
      ]
    },
    {
      label: 'Tools',
      items: [
        { label: 'Calculators' },
        { label: 'Budget Planner' },
        { label: 'Investment Tracker' },
        { label: 'Goal Setting' },
        { label: '', separator: true },
        { label: 'Data Analysis' }
      ]
    },
    {
      label: 'Help',
      items: [
        { label: 'Documentation' },
        { label: 'Keyboard Shortcuts', shortcut: '⌘/' },
        { label: 'Support Center' },
        { label: '', separator: true },
        { label: 'About Vueni' }
      ]
    }
  ];

  const handleMenuClick = (menuLabel: string) => {
    setActiveMenu(activeMenu === menuLabel ? null : menuLabel);
  };

  const handleItemClick = (item: string) => {
    // Built-in navigation for tool items
    switch (item) {
      case 'Calculators':
        navigate('/calculators');
        break;
      case 'Budget Planner':
        navigate('/budget-planner');
        break;
      case 'Goal Setting':
        navigate('/goal-setting');
        break;
      case 'Investment Tracker':
        navigate('/investment-tracker');
        break;
      default:
        onMenuItemClick?.(item);
    }
    setActiveMenu(null);
  };

  const handleBackdropClick = () => {
    setActiveMenu(null);
  };

  return (
    <>
      <LiquidGlassSVGFilters />
      
      {/* Backdrop for closing menu */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={handleBackdropClick}
        />
      )}
      
      {/* Top Menu Bar with Liquid Glass Effect */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 p-4",
        className
      )}>
        <div className="liquid-glass-nav rounded-2xl p-3 border-x-0 border-t-0 border-b border-white/10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            
            {/* Logo/Brand */}
            <div className="flex items-center space-x-6">
              <div className="liquid-glass-button p-3 rounded-xl">
                <span className="text-white font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Vueni
                </span>
              </div>

              {/* Menu Items (desktop) */}
              <nav className="hidden md:flex items-center space-x-1">
                {menuItems.map((menu) => (
                  <div key={menu.label} className="relative">
                    <button 
                      className={cn(
                        "liquid-glass-menu-item px-4 py-2 rounded-xl text-white/90 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 flex items-center space-x-1",
                        activeMenu === menu.label && "liquid-glass-menu-item active"
                      )}
                      onClick={() => handleMenuClick(menu.label)}
                    >
                      <span>{menu.label}</span>
                      <ChevronDown className={cn(
                        "w-3 h-3 transition-transform duration-200",
                        activeMenu === menu.label && "rotate-180"
                      )} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {activeMenu === menu.label && (
                      <div className={cn("z-50", "md:absolute md:top-full md:left-0 md:mt-2 fixed inset-x-4 top-20")}> 
                        <div className="liquid-glass-card p-2 rounded-2xl min-w-[200px] md:min-w-[200px] border-0 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
                          {menu.items.map((item, index) => (
                            <React.Fragment key={index}>
                              {item.separator ? (
                                <div className="my-1 h-px bg-white/10" />
                              ) : (
                                <button
                                  className="w-full text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center justify-between"
                                  onClick={() => handleItemClick(item.label)}
                                >
                                  <span>{item.label}</span>
                                  {item.shortcut && (
                                    <span className="text-white/40 text-xs font-mono">
                                      {item.shortcut}
                                    </span>
                                  )}
                                </button>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile Tools button */}
              <button
                className="md:hidden liquid-glass-menu-item px-3 py-2 rounded-xl text-white/90 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 flex items-center"
                onClick={() => handleMenuClick('Tools')}
              >
                <Settings className="w-4 h-4" />
                <span className="ml-1 text-sm">Tools</span>
              </button>
            </div>

            {/* Quick Action Items */}
            <div className="flex items-center space-x-2">
              {/* Quick Navigation Pills */}
              <div className="hidden lg:flex items-center space-x-1">
                <button className="liquid-glass-menu-item p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300 group">
                  <Home className="w-4 h-4" />
                </button>
                <button className="liquid-glass-menu-item p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300">
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button className="liquid-glass-menu-item p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300">
                  <Wallet className="w-4 h-4" />
                </button>
                <button className="liquid-glass-menu-item p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300">
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-6 bg-white/10" />

              {/* Action Buttons */}
              <button className="liquid-glass-menu-item p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300 relative">
                <Search className="w-5 h-5" />
              </button>
              
              <button className="liquid-glass-menu-item p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black/20"></span>
              </button>

              <ThemeToggle />

              <button className="liquid-glass-button p-2 rounded-xl text-white/90 hover:text-white transition-all duration-300">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiquidGlassTopMenuBar; 