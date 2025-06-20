// CC: AccountRow component for Smart Accounts Deck (R2 requirement)
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/utils/formatters';

export interface AccountRowData {
  id: string;
  name: string;
  institution: {
    name: string;
    logo?: string;
    color: string;
  };
  balance: number;
  currency: string;
  sparklineData: number[];
  deltaPercentage: number;
  accountType: string;
  last4: string;
}

interface AccountRowProps {
  account: AccountRowData;
  index: number;
  style?: React.CSSProperties;
}

// CC: SVG Sparkline component with proper WCAG contrast
const Sparkline: React.FC<{ data: number[]; trend: 'up' | 'down' }> = ({ data, trend }) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  // CC: Generate SVG path for sparkline
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 48; // 48px width
    const y = 16 - ((value - min) / range) * 16; // 16px height, inverted y-axis
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg 
      width="48" 
      height="16" 
      className="flex-shrink-0"
      role="img"
      aria-label={`Trend sparkline showing ${trend} movement`}
    >
      <polyline
        points={points}
        fill="none"
        stroke={trend === 'up' ? '#10B981' : '#EF4444'} // WCAG AA contrast colors
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const AccountRow: React.FC<AccountRowProps> = ({ account, index, style }) => {
  // CC: Calculate trend direction for sparkline and delta color
  const trend = account.deltaPercentage >= 0 ? 'up' : 'down';
  const deltaColor = trend === 'up' ? 'text-green-500' : 'text-red-500';
  const deltaIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const DeltaIcon = deltaIcon;

  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className={cn(
        // CC: R2 requirement - 56px height row
        "h-14 px-4 flex items-center gap-3",
        // CC: R3 requirement - 12px radius, 1px surface.borderLight, Liquid-Glass theme
        "rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md",
        "card-hover",
        "cursor-pointer group"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* CC: Left logo */}
      <div className="flex-shrink-0">
        {account.institution.logo ? (
          <img 
            src={account.institution.logo} 
            alt={account.institution.name}
            className="w-8 h-8 rounded object-cover"
            onError={(e) => {
              // CC: Fallback to colored circle if logo fails to load
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
          style={{ 
            backgroundColor: account.institution.color,
            display: account.institution.logo ? 'none' : 'flex'
          }}
        >
          {account.institution.name.charAt(0)}
        </div>
      </div>

      {/* CC: Account name and type */}
      <div className="flex-1 min-w-0">
        <div className="text-white font-medium text-sm truncate">
          {account.name}
        </div>
        <div className="text-white/60 text-xs truncate">
          {account.accountType} ••{account.last4}
        </div>
      </div>

      {/* CC: SVG Sparkline */}
      <div className="flex-shrink-0">
        <Sparkline data={account.sparklineData} trend={trend} />
      </div>

      {/* CC: Balance */}
      <div className="flex-shrink-0 text-right min-w-[80px]">
        <div className="text-white font-semibold text-sm">
          {formatCurrency(account.balance, { currency: account.currency })}
        </div>
      </div>

      {/* CC: Percentage delta with green ↑/red ↓ indicators (R2 requirement) */}
      <div className="flex-shrink-0 flex items-center gap-1 min-w-[60px] justify-end">
        <DeltaIcon className={cn("w-3 h-3", deltaColor)} />
        <span 
          className={cn("text-xs font-medium", deltaColor)}
          aria-label={`${trend === 'up' ? 'up' : 'down'} ${Math.abs(account.deltaPercentage).toFixed(1)} percent`}
        >
          {Math.abs(account.deltaPercentage).toFixed(1)}%
        </span>
      </div>
    </motion.div>
  );
}; 