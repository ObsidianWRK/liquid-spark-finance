# Analytics Tab UX Wireframes & Component Architecture

## Desktop Layout (1440px+)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                Analytics Dashboard                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ [⚡ Real-time] [📊 Overview] [🔗 Correlations] [⚙️ Settings] [📤 Export]          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│ │   Health Score  │ │  Wealth Score   │ │  Eco Score      │ │ Correlation     │   │
│ │      [85]       │ │     [72]        │ │     [91]        │ │    Index        │   │
│ │   🟢 Excellent  │ │  🟡 Good        │ │  🟢 Excellent   │ │     [76]        │   │
│ │   ↗️ +3 pts     │ │   ↘️ -2 pts     │ │   ↗️ +5 pts     │ │   🟡 Moderate   │   │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘   │
│                                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │                        🔗 Key Correlations                                      │ │
│ │ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐       │ │
│ │ │  💤 Sleep → 💰 Inv   │ │  😰 Stress → 🛒 Shop │ │  🏃 Activity → 📈 ROI │       │ │
│ │ │     -0.78 Strong    │ │     +0.65 Moderate  │ │     +0.52 Moderate   │       │ │
│ │ │  "Better sleep =    │ │  "High stress =     │ │  "More exercise =    │       │ │
│ │ │   better decisions" │ │   impulse buying"   │ │   better decisions"  │       │ │
│ │ └─────────────────────┘ └─────────────────────┘ └─────────────────────┘       │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─────────────────────────────────┐ ┌─────────────────────────────────────────────┐ │
│ │         📊 Health Trends        │ │              💰 Wealth Trends               │ │
│ │ ┌─────────────────────────────┐ │ │ ┌─────────────────────────────────────────┐ │ │
│ │ │        [Chart Area]         │ │ │ │            [Chart Area]                 │ │ │
│ │ │   Heart Rate Variability    │ │ │ │         Net Worth Growth                │ │ │
│ │ │   Sleep Quality             │ │ │ │         Portfolio Performance           │ │ │
│ │ │   Stress Levels             │ │ │ │         Savings Rate                    │ │ │
│ │ │   Activity Score            │ │ │ │         Debt-to-Income                  │ │ │
│ │ └─────────────────────────────┘ │ │ └─────────────────────────────────────────┘ │ │
│ │                                 │ │                                             │ │
│ │ • HRV: 45ms (↗️ +2)            │ │ • Net Worth: $127.5K (↗️ +$2.8K)          │ │
│ │ • Sleep: 7.5h (↗️ +0.3h)       │ │ • Portfolio ROI: 8.2% (↗️ +1.1%)          │ │
│ │ • Stress: 32/100 (↘️ -5)       │ │ • Savings Rate: 18% (↗️ +2%)               │ │
│ └─────────────────────────────────┘ └─────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │                           🛒 Transaction Intelligence                           │ │
│ │ ┌─────────────────────────────┐ ┌─────────────────────────────────────────────┐ │ │
│ │ │     Spending by Health      │ │              Smart Insights                 │ │ │
│ │ │ ┌─────────────────────────┐ │ │ • 🚨 High stress (75+) linked to 31%      │ │ │
│ │ │ │      [Pie Chart]        │ │ │   increase in impulse purchases            │ │ │
│ │ │ │   Health: $340 (23%)   │ │ │                                             │ │ │
│ │ │ │   Fitness: $85 (6%)    │ │ │ • 💡 Sleep quality <6h correlates with     │ │ │
│ │ │ │   Food: $120 (8%)      │ │ │   poor investment timing (-2.3% ROI)       │ │ │
│ │ │ │   Wellness: $75 (5%)   │ │ │                                             │ │ │
│ │ │ └─────────────────────────┘ │ │ • ✅ Active days (10K+ steps) show 15%     │ │ │
│ │ └─────────────────────────────┘ │ │   better financial decision accuracy       │ │ │
│ └─────────────────────────────────┘ └─────────────────────────────────────────────┘ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## Tablet Layout (768px - 1024px)

```
┌───────────────────────────────────────────────────────────┐
│                Analytics Dashboard                        │
├───────────────────────────────────────────────────────────┤
│ [Overview] [Correlations] [Settings] [Export]            │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ ┌─────────────────┐ ┌─────────────────┐                  │
│ │   Health [85]   │ │  Wealth [72]    │                  │
│ │   🟢 ↗️ +3      │ │   🟡 ↘️ -2      │                  │
│ └─────────────────┘ └─────────────────┘                  │
│ ┌─────────────────┐ ┌─────────────────┐                  │
│ │    Eco [91]     │ │  Correlation    │                  │
│ │   🟢 ↗️ +5      │ │    [76] 🟡      │                  │
│ └─────────────────┘ └─────────────────┘                  │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐   │
│ │              🔗 Top Correlations                    │   │
│ │ • Sleep Quality → Investment Returns (-0.78)       │   │
│ │ • Stress Level → Spending Velocity (+0.65)         │   │
│ │ • Activity Level → Decision Quality (+0.52)        │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐   │
│ │                📊 Health Trends                     │   │
│ │ [Stacked Area Chart - Responsive]                  │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐   │
│ │                💰 Wealth Trends                     │   │
│ │ [Line Chart - Net Worth & Portfolio Performance]   │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐   │
│ │            🛒 Transaction Intelligence              │   │
│ │ [Horizontal Bar Chart - Category Breakdown]        │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

## Mobile Layout (320px - 767px)

```
┌─────────────────────────────────┐
│        Analytics               │
├─────────────────────────────────┤
│ [🏠] [🔗] [⚙️] [📤]           │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │        Health Score         │ │
│ │          [85] 🟢            │ │
│ │       Excellent ↗️ +3       │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │        Wealth Score         │ │
│ │          [72] 🟡            │ │
│ │         Good ↘️ -2          │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │         Eco Score           │ │
│ │          [91] 🟢            │ │
│ │      Excellent ↗️ +5        │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │      Key Correlation        │ │
│ │  💤 Sleep → 💰 Investment   │ │
│ │       -0.78 Strong          │ │
│ │   [View All Correlations]   │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │      Health Trends          │ │
│ │    [Mobile Chart Area]      │ │
│ │  • HRV: 45ms (↗️ +2)       │ │
│ │  • Sleep: 7.5h (↗️ +0.3h)  │ │
│ │  • Stress: 32 (↘️ -5)      │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │      Wealth Trends          │ │
│ │    [Mobile Chart Area]      │ │
│ │  • Net Worth: $127.5K       │ │
│ │  • ROI: 8.2% (↗️ +1.1%)    │ │
│ │  • Savings: 18% (↗️ +2%)   │ │
│ │  • Savings: 18% (↗️ +2%)   │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │    Transaction Insights     │ │
│ │ • Health spending: $340     │ │
│ │ • Stress-spending link: +31%│ │
│ │ • Active days = better ROI  │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

## Component Architecture

### Primary Components

1. **AnalyticsDashboard** (Main Container)
2. **ScoreSummaryGrid** 
3. **CorrelationInsights**
4. **TrendCharts**
5. **SmartInsights**
6. **RealTimeStream**

### Responsive Breakpoints

```typescript
export const ANALYTICS_BREAKPOINTS = {
  mobile: '320px',
  tablet: '768px', 
  desktop: '1024px',
  ultrawide: '1440px'
} as const;
```

### Color Scheme & Design Tokens

```typescript
export const ANALYTICS_THEME = {
  health: {
    primary: '#10b981', // green-500
    secondary: '#065f46', // green-800
    gradient: 'from-green-400 to-emerald-600'
  },
  wealth: {
    primary: '#3b82f6', // blue-500
    secondary: '#1e40af', // blue-800  
    gradient: 'from-blue-400 to-indigo-600'
  },
  correlation: {
    primary: '#8b5cf6', // violet-500
    secondary: '#5b21b6', // violet-800
    gradient: 'from-violet-400 to-purple-600'
  },
  strength: {
    weak: '#6b7280', // gray-500
    moderate: '#f59e0b', // amber-500
    strong: '#ef4444' // red-500
  }
} as const;
```

### Interaction Patterns

1. **Drill-Down Navigation**
   - Score cards → Detailed metric views
   - Correlation cards → Historical correlation analysis
   - Chart elements → Transaction details

2. **Time Range Selection**
   - Global time selector (1D, 7D, 30D, 90D, 1Y, All)
   - Chart-specific zoom and pan
   - Real-time vs historical mode toggle

3. **Export & Sharing**
   - PDF report generation
   - Data export (CSV, JSON)
   - Shareable correlation insights

4. **Settings & Configuration**
   - Data source management
   - Correlation sensitivity settings
   - Privacy and retention controls

This architecture provides a comprehensive yet performant analytics experience that scales from mobile to ultrawide displays while maintaining the unified health-wealth-transaction insight focus. 