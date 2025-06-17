
import React, { useState, useEffect, useRef } from 'react';
import { Home, FileText, DollarSign, TrendingUp, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const LiquidGlassNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'transactions', label: 'Transactions', icon: FileText, path: '/transactions' },
    { id: 'balance', label: 'Balance', icon: DollarSign, path: '/accounts' },
    { id: 'insights', label: 'Insights', icon: TrendingUp, path: '/insights' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  // Smooth entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Magical mouse tracking for subtle parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      {/* Magical liquid glass container */}
      <div
        ref={containerRef}
        className={cn(
          'liquid-glass-nav-container',
          'transition-all duration-700 ease-out',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        )}
        style={{
          transform: `translateX(-50%) translateY(${mousePosition.y * 0.3}px) translateX(${mousePosition.x * 0.2}px)`,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Navigation items */}
        <div className="flex items-center space-x-2 p-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  'nav-item-glass',
                  'group relative flex flex-col items-center justify-center',
                  'w-16 h-16 rounded-2xl',
                  'transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)',
                  'hover:scale-110 hover:bg-white/10',
                  'active:scale-95',
                  'focus:outline-none focus:ring-2 focus:ring-white/30',
                  active && 'bg-white/15 scale-105'
                )}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                aria-label={item.label}
              >
                {/* Magical glow effect */}
                <div 
                  className={cn(
                    'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100',
                    'bg-gradient-to-r from-blue-400/20 to-purple-400/20',
                    'blur-xl transition-opacity duration-500'
                  )}
                />
                
                {/* Icon container */}
                <div className="relative z-10 flex flex-col items-center space-y-1">
                  <Icon 
                    className={cn(
                      'w-6 h-6 transition-all duration-300',
                      active ? 'text-white' : 'text-white/70 group-hover:text-white',
                      'group-hover:drop-shadow-lg'
                    )} 
                  />
                  <span className={cn(
                    'text-[10px] font-medium transition-all duration-300',
                    active ? 'text-white' : 'text-white/60 group-hover:text-white/90',
                    'font-display'
                  )}>
                    {item.label}
                  </span>
                </div>

                {/* Active indicator dot */}
                {active && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Breathing animation overlay */}
        <div className="absolute inset-0 rounded-[42px] bg-gradient-to-r from-white/5 to-white/10 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>
    </div>
  );
};

export default LiquidGlassNavigation;
