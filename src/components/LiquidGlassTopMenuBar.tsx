import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Search,
  Bell,
  Home,
  BarChart3,
  Wallet,
  TrendingUp,
  Menu,
} from 'lucide-react';
import LiquidGlassSVGFilters from '@/shared/ui/LiquidGlassSVGFilters';
import { cn } from '@/shared/lib/utils';
import { useNavigate } from 'react-router-dom';
import { VueniLogo } from '@/shared/ui/VueniLogo';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from '@/shared/ui/menubar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';
import {
  MENU_BAR_HEIGHT,
  LIQUID_BG_DARK,
} from '@/shared/tokens/menuBar.tokens';
import { useMenuBarReveal } from '@/hooks/useMenuBarReveal';

interface MenuBarProps {
  className?: string;
  onMenuItemClick?: (item: string) => void;
}

interface MenuItem {
  label: string;
  items: { label: string; shortcut?: string; separator?: boolean }[];
}

const LiquidGlassTopMenuBar = ({
  className,
  onMenuItemClick,
}: MenuBarProps) => {
  const menubarRef = useRef<HTMLElement | null>(null);
  const { orientation, translateY } = useMenuBarReveal();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleItemSelect = (item?: string) => {
    if (!item) return;

    switch (item) {
      // Tools Menu Navigation
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
      case 'Data Analysis':
        navigate('/?tab=insights');
        break;

      // View Menu Navigation
      case 'Dashboard':
        navigate('/');
        break;
      case 'Transactions':
        navigate('/transactions');
        break;
      case 'Reports':
        navigate('/reports');
        break;
      case 'Insights':
        navigate('/?tab=insights');
        break;
      case 'Full Screen':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
        break;

      // File Menu Actions
      case 'New Transaction':
        navigate('/transactions?new=true');
        break;
      case 'Settings':
        navigate('/profile');
        break;

      // Help Menu Actions
      case 'Documentation':
        window.open('https://github.com/your-org/vueni-finance/wiki', '_blank');
        break;
      case 'Support Center':
        window.open('https://support.vueni.com', '_blank');
        break;
      case 'About Vueni':
        navigate('/profile');
        break;

      // Default fallback
      default:
        onMenuItemClick?.(item);
    }
    // Close mobile menu after selection
    setIsMobileMenuOpen(false);
  };

  // Accessibility: Ctrl+F2 focuses the menubar just like macOS.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'F2') {
        e.preventDefault();
        menubarRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <LiquidGlassSVGFilters />

      {/* Dark-only Liquid Glass Menu Bar */}
      <nav
        role="menubar"
        aria-keyshortcuts="Control+F2"
        ref={menubarRef}
        tabIndex={0}
        className={cn(
          'fixed inset-x-0 top-[env(safe-area-inset-top)] h-[--menu-bar-height] flex items-center z-50 backdrop-blur-md saturate-[180%] border-t border-white/20 transition-transform duration-200 dark:[&]:bg-[rgba(0,0,0,0.42)]',
          className
        )}
        style={
          {
            '--menu-bar-height': `${MENU_BAR_HEIGHT[orientation]}px`,
            transform: `translateY(${translateY})`,
            background: LIQUID_BG_DARK,
          } as React.CSSProperties
        }
      >
        {/* Inner content wrapper for spacing (reuses existing layout) */}
        <div className="w-full px-2 sm:px-4">
          <div className="liquid-glass-nav rounded-2xl p-2 sm:p-3 border-x-0 border-t-0 border-b border-white/10">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              {/* Logo/Brand */}
              <div className="flex items-center space-x-2 sm:space-x-6 flex-shrink-0">
                <VueniLogo
                  size="lg"
                  variant="text-only"
                  onClick={() => navigate('/')}
                  className="liquid-glass-button p-2 sm:p-3 rounded-xl"
                  onDownloadComplete={() => {
                    /* Download completed */
                  }}
                />

                {/* Desktop Menu Items using Radix Menubar */}
                <div className="hidden lg:block">
                  <Menubar>
                    {/* File */}
                    <MenubarMenu>
                      <MenubarTrigger>File</MenubarTrigger>
                      <MenubarContent>
                        {fileMenu.map((item, idx) =>
                          item.separator ? (
                            <MenubarSeparator key={idx} />
                          ) : (
                            <MenubarItem
                              key={idx}
                              onSelect={() => handleItemSelect(item.label)}
                            >
                              {item.label}
                              {item.shortcut && (
                                <MenubarShortcut>
                                  {item.shortcut}
                                </MenubarShortcut>
                              )}
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
                            <MenubarItem
                              key={idx}
                              onSelect={() => handleItemSelect(item.label)}
                            >
                              {item.label}
                              {item.shortcut && (
                                <MenubarShortcut>
                                  {item.shortcut}
                                </MenubarShortcut>
                              )}
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
                            <MenubarItem
                              key={idx}
                              onSelect={() => handleItemSelect(item.label)}
                            >
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
                            <MenubarItem
                              key={idx}
                              onSelect={() => handleItemSelect(item.label)}
                            >
                              {item.label}
                              {item.shortcut && (
                                <MenubarShortcut>
                                  {item.shortcut}
                                </MenubarShortcut>
                              )}
                            </MenubarItem>
                          )
                        )}
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </div>

                {/* Mobile Menu Button - Tablet and smaller */}
                <Sheet
                  open={isMobileMenuOpen}
                  onOpenChange={setIsMobileMenuOpen}
                >
                  <SheetTrigger asChild>
                    <button
                      className="lg:hidden liquid-glass-menu-item p-2 rounded-xl text-white/90 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 flex items-center"
                      aria-label="Open menu"
                    >
                      <Menu className="w-4 h-4" />
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="liquid-glass-card border-0 backdrop-blur-xl w-80 sm:w-96"
                  >
                    <SheetHeader className="mb-6">
                      <SheetTitle className="text-white text-left">
                        Menu
                      </SheetTitle>
                    </SheetHeader>
                    <div className="space-y-6">
                      {/* File Menu */}
                      <div>
                        <h3 className="text-white/80 font-medium mb-3">File</h3>
                        <div className="space-y-1">
                          {fileMenu.map((item, idx) =>
                            item.separator ? (
                              <div
                                key={idx}
                                className="my-3 h-px bg-white/10"
                              />
                            ) : (
                              <button
                                key={idx}
                                onClick={() => handleItemSelect(item.label)}
                                className="w-full text-left px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all flex items-center justify-between"
                              >
                                <span>{item.label}</span>
                                {item.shortcut && (
                                  <span className="text-xs text-white/40">
                                    {item.shortcut}
                                  </span>
                                )}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* View Menu */}
                      <div>
                        <h3 className="text-white/80 font-medium mb-3">View</h3>
                        <div className="space-y-1">
                          {viewMenu.map((item, idx) =>
                            item.separator ? (
                              <div
                                key={idx}
                                className="my-3 h-px bg-white/10"
                              />
                            ) : (
                              <button
                                key={idx}
                                onClick={() => handleItemSelect(item.label)}
                                className="w-full text-left px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all flex items-center justify-between"
                              >
                                <span>{item.label}</span>
                                {item.shortcut && (
                                  <span className="text-xs text-white/40">
                                    {item.shortcut}
                                  </span>
                                )}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Tools Menu */}
                      <div>
                        <h3 className="text-white/80 font-medium mb-3">
                          Tools
                        </h3>
                        <div className="space-y-1">
                          {toolsMenu.map((item, idx) =>
                            item.separator ? (
                              <div
                                key={idx}
                                className="my-3 h-px bg-white/10"
                              />
                            ) : (
                              <button
                                key={idx}
                                onClick={() => handleItemSelect(item.label)}
                                className="w-full text-left px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all"
                              >
                                {item.label}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Right Side Actions - Responsive */}
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                {/* Quick Navigation Pills - Large screens only */}
                <div className="hidden xl:flex items-center space-x-1">
                  <button
                    onClick={() => navigate('/')}
                    className="liquid-glass-menu-item p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300 group"
                    aria-label="Dashboard"
                  >
                    <Home className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/?tab=insights')}
                    className="liquid-glass-menu-item p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300"
                    aria-label="Insights"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/transactions')}
                    className="liquid-glass-menu-item p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300"
                    aria-label="Transactions"
                  >
                    <Wallet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/reports')}
                    className="liquid-glass-menu-item p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300"
                    aria-label="Reports"
                  >
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>

                {/* Divider - Large screens only */}
                <div className="hidden xl:block w-px h-6 bg-white/10" />

                {/* Essential Action Buttons - Always visible */}
                <button
                  onClick={() => alert('Search functionality coming soon!')}
                  className="hidden sm:flex liquid-glass-menu-item p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300 relative"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  onClick={() => alert('Notifications coming soon!')}
                  className="liquid-glass-menu-item p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300 relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full border border-black/20"></span>
                </button>

                <button
                  onClick={() => navigate('/profile')}
                  className="liquid-glass-button p-2 rounded-xl text-white/90 hover:text-white transition-all duration-300"
                  aria-label="Profile"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default LiquidGlassTopMenuBar;
