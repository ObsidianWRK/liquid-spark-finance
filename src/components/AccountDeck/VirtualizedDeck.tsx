// CC: VirtualizedDeck component for Smart Accounts Deck with react-window (R2 requirement)
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { motion } from 'framer-motion';
import { AccountRow, AccountRowData } from './AccountRow';
import { cn } from '@/shared/lib/utils';

interface VirtualizedDeckProps {
  accounts: AccountRowData[];
  height?: number;
  className?: string;
  onAccountClick?: (account: AccountRowData) => void;
}

// CC: Row renderer for react-window virtual scrolling
const Row = ({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: {
    accounts: AccountRowData[];
    onAccountClick?: (account: AccountRowData) => void;
  };
}) => {
  const account = data.accounts[index];

  return (
    <div
      style={style}
      onClick={() => data.onAccountClick?.(account)}
      className="px-2"
    >
      <AccountRow account={account} index={index} />
    </div>
  );
};

export const VirtualizedDeck: React.FC<VirtualizedDeckProps> = ({
  accounts,
  height = 400,
  className,
  onAccountClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(height);

  // CC: Memoize data for react-window performance
  const itemData = useMemo(
    () => ({
      accounts,
      onAccountClick,
    }),
    [accounts, onAccountClick]
  );

  // CC: Calculate dynamic height based on container size
  useEffect(() => {
    const calculateHeight = () => {
      if (!containerRef.current || !headerRef.current || !footerRef.current) {
        setListHeight(height);
        return;
      }

      const containerHeight = containerRef.current.clientHeight;
      const headerHeight = headerRef.current.clientHeight;
      const footerHeight = footerRef.current.clientHeight;
      
      // Account for padding (p-2 = 8px top + 8px bottom)
      const availableHeight = containerHeight - headerHeight - footerHeight - 16;
      
      // Ensure minimum height
      const calculatedHeight = Math.max(200, availableHeight);
      setListHeight(calculatedHeight);
    };

    calculateHeight();

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(calculateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [height, accounts.length]);

  // CC: Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        // CC: R3 requirement - 12px radius, Liquid-Glass theme
        'rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md overflow-hidden flex flex-col',
        className
      )}
    >
      {/* CC: Header with account count */}
      <div ref={headerRef} className="px-4 py-3 border-b border-white/[0.08] flex-shrink-0">
        <h3 className="text-white font-semibold text-lg">Smart Accounts</h3>
        <p className="text-white/60 text-sm">
          {accounts.length} accounts • Scroll to view all
        </p>
      </div>

      {/* CC: Virtual scrolling list with react-window for performance (R2 requirement) */}
      <div className="p-2 flex-1 min-h-0">
        <List
          height={listHeight}
          width="100%"
          itemCount={accounts.length}
          itemSize={60} // CC: 56px row height + 4px spacing (R2 requirement)
          itemData={itemData}
          className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
        >
          {Row}
        </List>
      </div>

      {/* CC: Footer with "Add Account" CTA for success metrics */}
      <div ref={footerRef} className="px-4 py-3 border-t border-white/[0.08] flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'w-full py-2 px-4 rounded-lg text-sm font-medium',
            'bg-blue-500 hover:bg-blue-600 text-white',
            'transition-colors duration-200'
          )}
          onClick={() => {
            // CC: Track feature_cloud_seen event for success metrics
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'add_account_clicked', {
                event_category: 'smart_accounts_deck',
                event_label: 'cta_button',
              });
            }
          }}
        >
          + Add Account
        </motion.button>
      </div>
    </motion.div>
  );
};
