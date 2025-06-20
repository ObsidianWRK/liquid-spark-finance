# Comprehensive File Map: Card Components & Mobile Layouts

## Overview
This document provides a complete mapping of all files related to card components, mobile layouts, and the requested patterns (Card, CardContainer, Insights*, Budget*, Planning*, Portfolio*) in the liquid-spark-finance project.

**Total Files Analyzed: 187**
**Total Lines of Code: ~65,000+**

---

## 🎯 Core Card Components

### Universal Card System
- **`src/shared/components/ui/UniversalCard.tsx`** (301 lines) - Main universal card component with full feature set
- **`src/shared/components/ui/UniversalCard.original.tsx`** (301 lines) - Original backup version
- **`src/shared/components/ui/UnifiedCard.tsx`** (247 lines) - Unified card component for consistent styling
- **`src/shared/ui/UniversalCard.tsx`** (303 lines) - Duplicate universal card (shared/ui location)
- **`src/shared/ui/UniversalCard.original.tsx`** (301 lines) - Backup version in shared/ui
- **`src/shared/ui/UnifiedCard.tsx`** (247 lines) - Duplicate unified card

### Glass Card System
- **`src/shared/components/ui/EnhancedGlassCard.tsx`** (143 lines) - Enhanced glass card with premium styling
- **`src/shared/ui/EnhancedGlassCard.tsx`** (143 lines) - Duplicate enhanced glass card
- **`src/shared/components/ui/SimpleGlassCard.tsx`** (43 lines) - Simple glass card variant
- **`src/shared/ui/SimpleGlassCard.tsx`** (43 lines) - Duplicate simple glass card
- **`src/components/GlassCard.tsx`** (39 lines) - Basic glass card component

### Card Foundation Components
- **`src/shared/components/ui/card.tsx`** (79 lines) - Base card component with variants
- **`src/shared/ui/card.tsx`** (79 lines) - Duplicate base card
- **`src/shared/components/ui/CardShell.tsx`** (77 lines) - Card shell wrapper component
- **`src/shared/ui/CardShell.tsx`** (77 lines) - Duplicate card shell
- **`src/shared/components/ui/hover-card.tsx`** (27 lines) - Hover card interaction component
- **`src/shared/ui/hover-card.tsx`** (27 lines) - Duplicate hover card

---

## 💰 Budget Feature Files

### Budget Components
- **`src/features/budget/components/BudgetTracker.tsx`** (572 lines) - Main budget tracking component with cards
- **`src/features/budget/components/SpendingBreakdownChart.tsx`** (373 lines) - Spending breakdown with card layout
- **`src/features/budget/components/BudgetReportsPage.tsx`** (195 lines) - Budget reports page with card grid
- **`src/features/budget/components/BudgetPlannerPage.tsx`** (165 lines) - Budget planning interface

### Budget Services & Types
- **`src/features/budget/api/budgetService.ts`** (385 lines) - Budget API service
- **`src/shared/types/budget.ts`** (14 lines) - Budget type definitions
- **`src/shared/types/budgets.ts`** (310 lines) - Extended budget types

### Shared Budget Features
- **`src/features/shared-budgets/components/SharedBudgetsPanel.tsx`** (21 lines) - Shared budgets panel
- **`src/features/shared-budgets/components/HouseholdsList.tsx`** (40 lines) - Households list with cards
- **`src/features/shared-budgets/components/CreateHouseholdForm.tsx`** (26 lines) - Create household form
- **`src/features/shared-budgets/api/familyService.ts`** (322 lines) - Family service for shared budgets

---

## 📊 Insights Feature Files

### Main Insights Pages
- **`src/features/insights/components/ConfigurableInsightsPage.tsx`** (731 lines) - Configurable insights with card layout
- **`src/features/insights/components/OptimizedRefinedInsightsPage.tsx`** (437 lines) - Optimized refined insights
- **`src/features/insights/components/BaseInsightsPage.tsx`** (435 lines) - Base insights page template
- **`src/features/insights/components/RefinedInsightsPage.tsx`** (417 lines) - Refined insights implementation
- **`src/features/insights/components/EnhancedInsightsPage.tsx`** (384 lines) - Enhanced insights with cards
- **`src/features/insights/components/ConsolidatedInsightsPage.tsx`** (359 lines) - Consolidated insights view
- **`src/features/insights/components/UnifiedInsightsPage.tsx`** (316 lines) - Unified insights page
- **`src/features/insights/components/NewInsightsPage.tsx`** (278 lines) - New insights implementation
- **`src/features/insights/components/InsightsPage.tsx`** (217 lines) - Standard insights page
- **`src/features/insights/components/SimpleInsightsPage.tsx`** (165 lines) - Simple insights view

### Insights Card Components
- **`src/features/insights/components/components/ComprehensiveEcoCard.tsx`** (554 lines) - Comprehensive eco card
- **`src/features/insights/components/components/ComprehensiveWellnessCard.tsx`** (529 lines) - Comprehensive wellness card
- **`src/features/insights/components/UniversalMetricCard.tsx`** (256 lines) - Universal metric card
- **`src/features/insights/components/components/RefinedMetricCard.tsx`** (245 lines) - Refined metric card
- **`src/features/insights/components/UniversalScoreCard.tsx`** (231 lines) - Universal score card
- **`src/features/insights/components/FinancialCard.tsx`** (196 lines) - Financial card component
- **`src/features/insights/components/components/RefinedScoreCard.tsx`** (188 lines) - Refined score card
- **`src/features/insights/components/components/OptimizedScoreCard.tsx`** (171 lines) - Optimized score card
- **`src/features/insights/components/components/EnhancedScoreCard.tsx`** (163 lines) - Enhanced score card
- **`src/features/insights/components/components/EnhancedMetricCard.tsx`** (135 lines) - Enhanced metric card
- **`src/features/insights/components/components/RefinedTrendCard.tsx`** (121 lines) - Refined trend card

### Insights Supporting Components
- **`src/features/insights/components/EcoScore.tsx`** (202 lines) - Eco score component
- **`src/features/insights/components/HealthScore.tsx`** (185 lines) - Health score component
- **`src/features/insights/components/components/CategoryBreakdown.tsx`** (85 lines) - Category breakdown
- **`src/features/insights/components/components/TrendChart.tsx`** (43 lines) - Trend chart component
- **`src/features/insights/components/MetricCard.tsx`** (26 lines) - Basic metric card
- **`src/features/insights/components/EcoCard.tsx`** (3 lines) - Eco card stub
- **`src/features/insights/components/WellnessCard.tsx`** (3 lines) - Wellness card stub

---

## 📈 Planning Feature Files

### Planning Components
- **`src/features/planning/components/FinancialPlanningPage.tsx`** (537 lines) - Main financial planning page
- **`src/features/planning/components/RetirementPlanner.tsx`** (513 lines) - Retirement planning with cards
- **`src/features/planning/components/GoalTracker.tsx`** (454 lines) - Goal tracking with card layout

### Planning Services & Types
- **`src/features/planning/api/financialPlanningService.ts`** (565 lines) - Financial planning API
- **`src/shared/types/financialPlanning.ts`** (214 lines) - Financial planning types

---

## 💼 Portfolio Feature Files

### Portfolio Components
- **`src/features/investments/components/InvestmentPortfolio.tsx`** (553 lines) - Main investment portfolio with cards
- **`src/features/investments/components/PortfolioAllocationChart.tsx`** (468 lines) - Portfolio allocation chart
- **`src/features/investments/components/InvestmentTrackerPage.tsx`** (201 lines) - Investment tracker page

### Portfolio Services & Types
- **`src/features/investments/api/investmentService.ts`** (645 lines) - Investment API service
- **`src/shared/types/investments.ts`** (116 lines) - Investment types

---

## 🏦 Account Card Components

### Account Cards
- **`src/features/accounts/components/CompactAccountCard.tsx`** (225 lines) - Compact account card
- **`src/features/accounts/components/CleanAccountCard.tsx`** (163 lines) - Clean account card design
- **`src/features/accounts/components/AccountCard.tsx`** (158 lines) - Standard account card
- **`src/features/accounts/components/QuickAccessCard.tsx`** (148 lines) - Quick access card
- **`src/components/AccountCard.tsx`** (90 lines) - Basic account card
- **`src/components/BalanceCard.tsx`** (91 lines) - Balance display card

### Quick Access System
- **`src/features/accounts/components/QuickAccessRail.tsx`** (243 lines) - Quick access rail with cards

---

## 🎨 Styling & Theme Files

### Card-Specific Styles
- **`src/app/styles/responsive-enhancements.css`** (1,234 lines) - Responsive card layouts
- **`src/app/styles/liquid-backgrounds.css`** (577 lines) - Liquid background styles for cards
- **`src/app/styles/liquid-glass-wwdc.css`** (458 lines) - WWDC-style glass card effects
- **`src/app/styles/glass.css`** (349 lines) - Glass card styling
- **`src/app/styles/refined-animations.css`** (344 lines) - Card animations
- **`src/app/styles/card-alignment.css`** (310 lines) - Card alignment and spacing
- **`src/app/styles/performance-optimized.css`** (297 lines) - Performance-optimized card styles
- **`src/app/styles/scroll-fix.css`** (106 lines) - Scroll fixes for card layouts
- **`src/app/styles/quick-access-performance.css`** (101 lines) - Quick access card performance
- **`src/app/styles/calculator-overrides.css`** (23 lines) - Calculator card overrides
- **`src/app/styles/account-card.css`** (10 lines) - Account card specific styles

### Theme Tokens
- **`src/theme/unified-card-tokens.ts`** (107 lines) - Unified card design tokens
- **`src/theme/index.ts`** (175 lines) - Main theme configuration
- **`src/theme/tokens.ts`** (105 lines) - Design tokens
- **`src/theme/colors.ts`** (39 lines) - Color tokens

---

## 🧩 Specialized Card Components

### Dashboard Cards
- **`src/features/dashboard/components/LinkedAccountsCard.tsx`** (411 lines) - Linked accounts card
- **`src/features/dashboard/components/NetWorthSummary.tsx`** (368 lines) - Net worth summary card
- **`src/features/dashboard/components/health/WellnessScoreCard.tsx`** (139 lines) - Wellness score card
- **`src/features/dashboard/components/health/CardSkeleton.tsx`** (174 lines) - Card skeleton loader

### Credit Cards
- **`src/features/credit/components/CleanCreditScoreCard.tsx`** (243 lines) - Clean credit score card
- **`src/features/credit/components/CreditScoreCard.tsx`** (142 lines) - Standard credit score card

### Savings Cards
- **`src/features/savings/components/GoalCard.tsx`** (182 lines) - Savings goal card

### Biometric Cards
- **`src/features/biometric-intervention/components/BiometricMonitorCard.tsx`** (59 lines) - Biometric monitor card
- **`src/features/dashboard/components/health/BiometricMonitorCard.tsx`** (9 lines) - Health biometric card

### Utility Cards
- **`src/features/age-of-money/components/AgeOfMoneyCard.tsx`** (42 lines) - Age of money card
- **`src/features/safe-to-spend/components/SafeToSpendCard.tsx`** (38 lines) - Safe to spend card

---

## 📱 Mobile Layout Files

### Main Pages with Mobile Support
- **`src/pages/Index.tsx`** (469 lines) - Main index page with responsive cards
- **`src/pages/OptimizedProfile.tsx`** (574 lines) - Optimized profile with mobile layout
- **`src/pages/CleanDashboard.tsx`** (340 lines) - Clean dashboard with card grid
- **`src/pages/TransactionDemo.tsx`** (263 lines) - Transaction demo page
- **`src/pages/CalculatorsHub.tsx`** (124 lines) - Calculators hub page
- **`src/pages/InsightsPage.tsx`** (13 lines) - Insights page entry point

### Mobile-Optimized Components
- **`src/components/LiquidGlassTopMenuBar.tsx`** (392 lines) - Mobile-responsive menu bar
- **`src/components/Navigation.tsx`** (209 lines) - Mobile navigation
- **`src/components/layout/AppShell.tsx`** (197 lines) - App shell with mobile support

---

## 🔧 Shared Components & Utilities

### Shared Insights Components
- **`src/components/shared/VueniUnifiedInsightsPage.tsx`** (733 lines) - Vueni unified insights
- **`src/components/shared/ConfigurableInsightsPage.tsx`** (563 lines) - Configurable insights
- **`src/components/shared/VueniUnifiedTransactionList.tsx`** (525 lines) - Unified transaction list

### UI Utilities
- **`src/shared/components/ui/LiquidGlassSVGFilters.tsx`** (498 lines) - SVG filters for glass effects
- **`src/shared/ui/LiquidGlassSVGFilters.tsx`** (498 lines) - Duplicate SVG filters
- **`src/shared/components/ui/AccountTypeBadge.tsx`** (64 lines) - Account type badge
- **`src/shared/ui/AccountTypeBadge.tsx`** (64 lines) - Duplicate account type badge

---

## 📊 Test Files

### Component Tests
- **`src/test/components.test.tsx`** (543 lines) - Component tests including cards
- **`src/test/regression.test.tsx`** (629 lines) - Regression tests
- **`src/test/data-integrity.test.ts`** (614 lines) - Data integrity tests
- **`src/test/performance.bench.ts`** (476 lines) - Performance benchmarks
- **`src/test/calculators.test.ts`** (437 lines) - Calculator tests
- **`src/shared/ui/charts/StackedBarChart.demo.tsx`** (544 lines) - Chart demo
- **`src/shared/ui/charts/StackedBarChart.integration.test.tsx`** (510 lines) - Chart integration tests

### E2E Tests
- **`e2e/comprehensive-responsive-navigation.spec.ts`** (670 lines) - Responsive navigation tests
- **`e2e/unified-card-visual-regression.spec.ts`** (486 lines) - Card visual regression tests
- **`e2e/user-journeys.spec.ts`** (469 lines) - User journey tests

---

## 🏗️ Services & APIs

### Core Services
- **`src/features/dashboard/api/visualizationService.ts`** (827 lines) - Dashboard visualization service
- **`src/features/investments/api/investmentService.ts`** (645 lines) - Investment service
- **`src/features/transactions/api/transactionService.ts`** (630 lines) - Transaction service
- **`src/features/planning/api/financialPlanningService.ts`** (565 lines) - Financial planning service
- **`src/features/advisor-chat/api/aiFinancialService.ts`** (458 lines) - AI financial service

---

## 🗂️ Backup Files

### Component Backups
- **`backups/20250617_181014/VueniUnifiedInsightsPage.tsx`** (711 lines) - Vueni insights backup
- **`backups/20250617_181014/ConfigurableInsightsPage.tsx`** (552 lines) - Configurable insights backup
- **`backups/20250617_181014/NewInsightsPage.tsx`** (340 lines) - New insights backup

---

## 📋 Configuration Files

### Type Definitions
- **`src/shared/types/accounts.ts`** (366 lines) - Account type definitions
- **`src/shared/types/budgets.ts`** (310 lines) - Budget type definitions
- **`src/shared/types/transactions.ts`** (252 lines) - Transaction type definitions
- **`src/shared/types/financialPlanning.ts`** (214 lines) - Financial planning types
- **`src/shared/types/shared.ts`** (192 lines) - Shared type definitions

### Mock Data
- **`src/services/mockData.ts`** (935 lines) - Mock data for development
- **`src/mocks/accounts-fixture.json`** (142 lines) - Account fixtures

---

## 🎯 Key Findings Summary

### Card Component Architecture
1. **Universal Card System**: Centralized card components with variants
2. **Glass Card Effects**: Sophisticated glass morphism styling
3. **Feature-Specific Cards**: Specialized cards for each feature area
4. **Mobile-First Design**: Responsive layouts throughout

### Mobile Layout Strategy
1. **Responsive Grid System**: Card-based layouts that adapt to screen size
2. **Touch-Friendly Components**: Large touch targets and swipe gestures
3. **Performance Optimization**: Lazy loading and efficient rendering

### Code Organization
1. **Feature-Based Structure**: Cards organized by feature domain
2. **Shared Components**: Reusable card components in shared directories
3. **Consistent Styling**: Unified design tokens and theming

### File Duplication Patterns
- Several components exist in both `src/shared/components/ui/` and `src/shared/ui/`
- Backup files maintained for major components
- Test files provide comprehensive coverage

This comprehensive map provides a complete picture of the card component ecosystem and mobile layout architecture in the liquid-spark-finance project.