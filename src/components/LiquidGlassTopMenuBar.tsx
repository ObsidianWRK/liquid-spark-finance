import React from 'react';
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
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from '@/components/ui/menubar';

interface MenuBarProps {
  className?: string;
  onMenuItemClick?: (item: string) => void;
}

interface MenuItem {
  label: string;
  items: { label: string; shortcut?: string; separator?: boolean }[];
}

const LiquidGlassTopMenuBar = ({ className, onMenuItemClick }: MenuBarProps) => {
  const navigate = useNavigate();

  const fileMenu = [
    { label: 'New Transaction', shortcut: '⌘N' },
    { label: 'Import Data', shortcut: '⌘I' },
    { label: 'Export Report', shortcut: '⌘E' },
    { separator: true },
    { label: 'Settings', shortcut: '⌘,' },
  ];

  const viewMenu = [
    { label: 'Dashboard', shortcut: '⌘1' },
    { label: 'Transactions', shortcut: '⌘2' },
    { label: 'Reports', shortcut: '⌘3' },
    { label: 'Insights', shortcut: '⌘4' },
    { separator: true },
    { label: 'Full Screen', shortcut: '⌃⌘F' },
  ];

  const toolsMenu = [
    { label: 'Calculators' },
    { label: 'Budget Planner' },
    { label: 'Investment Tracker' },
    { label: 'Goal Setting' },
    { separator: true },
    { label: 'Data Analysis' },
  ];

  const helpMenu = [
    { label: 'Documentation' },
    { label: 'Keyboard Shortcuts', shortcut: '⌘/' },
    { label: 'Support Center' },
    { separator: true },
    { label: 'About Vueni' },
  ];

  const handleItemSelect = (item: string) => {
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
  };

  return (
    <>
      <LiquidGlassSVGFilters />
      
      {/* Top Menu Bar with Liquid Glass Effect */}
      <div className={cn("fixed top-0 left-0 right-0 z-50 p-4", className)}>
        <div className="liquid-glass-nav rounded-2xl p-3 border-x-0 border-t-0 border-b border-white/10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            
            {/* Logo/Brand */}
            <div className="flex items-center space-x-6">
              <div className="liquid-glass-button p-3 rounded-xl">
                <span className="text-white font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Vueni
                </span>
              </div>

              {/* Menu Items using Radix Menubar (desktop) */}
              <div className="hidden md:block">
                <Menubar>
                  {/* File */}
                  <MenubarMenu>
                    <MenubarTrigger>File</MenubarTrigger>
                    <MenubarContent>
                      {fileMenu.map((item, idx) =>
                        item.separator ? (
                          <MenubarSeparator key={idx} />
                        ) : (
                          <MenubarItem key={idx} onSelect={() => handleItemSelect(item.label)}>
                            {item.label}
                            {item.shortcut && <MenubarShortcut>{item.shortcut}</MenubarShortcut>}
                          </MenubarItem>
                        )
                      )}
                    </MenubarContent>
                  </MenubarMenu>

                  {/* View */}
                  <MenubarMenu>
                    <MenubarTrigger>View</MenubarTrigger>
                    <MenubarContent>
                      {viewMenu.map((item, idx) =>
                        item.separator ? (
                          <MenubarSeparator key={idx} />
                        ) : (
                          <MenubarItem key={idx} onSelect={() => handleItemSelect(item.label)}>
                            {item.label}
                            {item.shortcut && <MenubarShortcut>{item.shortcut}</MenubarShortcut>}
                          </MenubarItem>
                        )
                      )}
                    </MenubarContent>
                  </MenubarMenu>

                  {/* Tools */}
                  <MenubarMenu>
                    <MenubarTrigger>Tools</MenubarTrigger>
                    <MenubarContent>
                      {toolsMenu.map((item, idx) =>
                        item.separator ? (
                          <MenubarSeparator key={idx} />
                        ) : (
                          <MenubarItem key={idx} onSelect={() => handleItemSelect(item.label)}>
                            {item.label}
                          </MenubarItem>
                        )
                      )}
                    </MenubarContent>
                  </MenubarMenu>

                  {/* Help */}
                  <MenubarMenu>
                    <MenubarTrigger>Help</MenubarTrigger>
                    <MenubarContent>
                      {helpMenu.map((item, idx) =>
                        item.separator ? (
                          <MenubarSeparator key={idx} />
                        ) : (
                          <MenubarItem key={idx} onSelect={() => handleItemSelect(item.label)}>
                            {item.label}
                            {item.shortcut && <MenubarShortcut>{item.shortcut}</MenubarShortcut>}
                          </MenubarItem>
                        )
                      )}
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>

              {/* Mobile Tools button */}
              <button
                className="md:hidden liquid-glass-menu-item px-3 py-2 rounded-xl text-white/90 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 flex items-center"
                onClick={() => handleItemSelect('Tools')}
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