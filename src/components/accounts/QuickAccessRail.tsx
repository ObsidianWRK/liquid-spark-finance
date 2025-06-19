import React, { useEffect, useRef, useState, useCallback } from 'react';
import { QuickAccessCard } from './QuickAccessCard';
import { AccountCardDTO } from '@/types/accounts';
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuickAccessRailProps {
  accounts: AccountCardDTO[];
  title?: string;
  subtitle?: string;
  showBalance?: boolean;
  onToggleBalance?: () => void;
  onAccountSelect?: (accountId: string) => void;
  onViewAll?: () => void;
  maxVisibleDesktop?: number;
  className?: string;
}

export const QuickAccessRail = React.memo<QuickAccessRailProps>(({
  accounts,
  title = "Quick Access",
  subtitle,
  showBalance = true,
  onToggleBalance,
  onAccountSelect,
  onViewAll,
  maxVisibleDesktop = 8,
  className
}) => {
  const isMobile = useIsMobile();
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Check scroll capabilities on mobile/tablet
  const checkScrollability = useCallback(() => {
    if (!railRef.current || !isMobile) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = railRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
  }, [isMobile]);

  // Update scroll indicators when accounts change or on resize
  useEffect(() => {
    checkScrollability();
    
    const handleResize = () => {
      setTimeout(checkScrollability, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkScrollability, accounts]);

  // Scroll handlers for mobile navigation arrows
  const scrollLeft = useCallback(() => {
    if (!railRef.current) return;
    
    const cardWidth = 176; // 160px min-width + 16px gap
    const newScrollLeft = Math.max(0, railRef.current.scrollLeft - cardWidth);
    
    railRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  }, []);

  const scrollRight = useCallback(() => {
    if (!railRef.current) return;
    
    const cardWidth = 176;
    const maxScroll = railRef.current.scrollWidth - railRef.current.clientWidth;
    const newScrollLeft = Math.min(maxScroll, railRef.current.scrollLeft + cardWidth);
    
    railRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!document.activeElement?.closest('[data-quick-access-rail]')) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (isMobile) {
            scrollLeft();
          } else {
            setCurrentIndex(prev => Math.max(0, prev - 1));
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (isMobile) {
            scrollRight();
          } else {
            setCurrentIndex(prev => Math.min(accounts.length - 1, prev + 1));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [accounts.length, isMobile, scrollLeft, scrollRight]);

  const displayedAccounts = isMobile ? accounts : accounts.slice(0, maxVisibleDesktop);

  return (
    <div 
      className={cn('space-y-4', className)}
      data-quick-access-rail
      role="region"
      aria-label="Quick Access Accounts"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {subtitle && (
            <p className="text-white/60 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Balance Visibility Toggle */}
          {onToggleBalance && (
            <button
              onClick={onToggleBalance}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white/80 hover:bg-white/[0.08] hover:text-white transition-all duration-200"
              aria-label={showBalance ? "Hide balances" : "Show balances"}
            >
              {showBalance ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span className="text-sm">{showBalance ? 'Hide' : 'Show'}</span>
            </button>
          )}
          
          {/* View All Button (Desktop) */}
          {!isMobile && accounts.length > maxVisibleDesktop && onViewAll && (
            <button
              onClick={onViewAll}
              className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium"
            >
              View All ({accounts.length})
            </button>
          )}
        </div>
      </div>

      {/* Mobile/Tablet: Horizontal Scrolling Rail */}
      {isMobile ? (
        <div className="relative">
          {/* Navigation Arrows */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/80 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/80 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          
          {/* Scrollable Rail */}
          <div
            ref={railRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2 px-1"
            onScroll={checkScrollability}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayedAccounts.map((account, index) => (
              <QuickAccessCard
                key={account.id}
                account={account}
                variant="rail"
                showBalance={showBalance}
                onSelect={onAccountSelect}
                className={index === currentIndex ? 'ring-2 ring-blue-400' : ''}
              />
            ))}
          </div>
          
          {/* Scroll Indicators */}
          <div className="flex justify-center space-x-1 mt-3">
            {Array.from({ length: Math.ceil(accounts.length / 3) }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === Math.floor(currentIndex / 3) 
                    ? 'bg-blue-400' 
                    : 'bg-white/20'
                )}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Desktop: 2-Column Grid */
        <div className="grid grid-cols-2 gap-4">
          {displayedAccounts.map((account, index) => (
            <QuickAccessCard
              key={account.id}
              account={account}
              variant="grid"
              showBalance={showBalance}
              onSelect={onAccountSelect}
              className={index === currentIndex ? 'ring-2 ring-blue-400' : ''}
            />
          ))}
        </div>
      )}
      
      {/* Accessibility Helper */}
      <div className="sr-only">
        Press arrow keys to navigate between accounts. 
        {accounts.length} accounts available.
        {!showBalance && " Balances are currently hidden."}
      </div>
    </div>
  );
});

QuickAccessRail.displayName = 'QuickAccessRail'; 