# Architecture Diagrams

This document contains system architecture diagrams for the Liquid Spark Finance application.

## Component Hierarchy Diagram

```mermaid
graph TD
    A[App.tsx] --> B[AppShell]
    A --> C[Router]
    
    B --> D[LiquidGlassTopMenuBar]
    B --> E[Navigation]
    B --> F[ThemeToggle]
    
    C --> G[Dashboard]
    C --> H[TransactionsPage]
    C --> I[BudgetPage]
    C --> J[InsightsPage]
    C --> K[CalculatorsPage]
    C --> L[InvestmentsPage]
    
    G --> M[BalanceCard]
    G --> N[QuickActions]
    G --> O[TransactionList]
    G --> P[AccountCard]
    
    H --> O
    H --> Q[TransactionStatus]
    H --> R[TransactionAmount]
    H --> S[ScoreCircles]
    
    I --> T[BudgetPlannerPage]
    T --> U[CategoryBudgets]
    T --> V[BudgetAlerts]
    T --> W[BudgetProgress]
    
    J --> X[InsightsComponents]
    X --> Y[CategoryTrendsChart]
    X --> Z[SpendingTrendsChart]
    X --> AA[MetricCard]
    X --> BB[EcoScore]
    X --> CC[HealthScore]
    
    K --> DD[CalculatorList]
    DD --> EE[CompoundInterestCalculator]
    DD --> FF[LoanCalculator]
    DD --> GG[MortgagePayoffCalculator]
    DD --> HH[FinancialFreedomCalculator]
    DD --> II[ROICalculator]
    DD --> JJ[HomeAffordabilityCalculator]
    DD --> KK[InflationCalculator]
    DD --> LL[Retirement401kCalculator]
    DD --> MM[ThreeFundPortfolioCalculator]
    DD --> NN[StockBacktestCalculator]
    DD --> OO[ExchangeRateCalculator]
    DD --> PP[InvestmentTrackerPage]
    
    L --> QQ[InvestmentTrackerPage]
    QQ --> RR[PortfolioOverview]
    QQ --> SS[PerformanceMetrics]
    QQ --> TT[GoalTracking]
    
    classDef pageClass fill:#e1f5fe
    classDef componentClass fill:#f3e5f5
    classDef calculatorClass fill:#e8f5e8
    classDef serviceClass fill:#fff3e0
    
    class G,H,I,J,K,L,T,QQ pageClass
    class M,N,O,P,Q,R,S,U,V,W,X,Y,Z,AA,BB,CC,RR,SS,TT componentClass
    class DD,EE,FF,GG,HH,II,JJ,KK,LL,MM,NN,OO,PP calculatorClass
```

## Data Flow Sequence Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant S as Service
    participant LS as LocalStorage
    participant API as Mock API
    
    U->>C: Loads Dashboard
    C->>S: Request account data
    S->>LS: Check cached data
    alt Cache exists
        LS-->>S: Return cached data
    else No cache
        S->>API: Fetch mock data
        API-->>S: Return account data
        S->>LS: Cache data
    end
    S-->>C: Account data
    C-->>U: Render dashboard
    
    U->>C: Add transaction
    C->>S: Process transaction
    S->>S: Calculate scores (health, eco, financial)
    S->>LS: Update transaction cache
    S-->>C: Updated transaction list
    C-->>U: Show updated transactions
    
    U->>C: Open calculator
    C->>C: Load calculator component
    U->>C: Input values
    C->>S: Calculate results
    S-->>C: Calculation results
    C-->>U: Display results
    
    U->>C: View insights
    C->>S: Request insights data
    S->>S: Aggregate transaction data
    S->>S: Calculate trends and scores
    S-->>C: Insights data
    C-->>U: Render charts and metrics
```

## Service Layer Architecture

```mermaid
graph TB
    subgraph "Frontend Components"
        A[Dashboard] --> B[TransactionList]
        A --> C[BudgetPlanner] 
        A --> D[InsightsPage]
        A --> E[Calculators]
    end
    
    subgraph "Service Layer"
        F[budgetService]
        G[creditScoreService] 
        H[ecoScoreService]
        I[healthKitService]
        J[investmentService]
        K[savingsGoalsService]
        L[scoringModel]
        M[mockAiService]
    end
    
    subgraph "Data Layer"
        N[mockData]
        O[mockHistoricalData]
        P[localStorage]
        Q[formatters]
        R[calculators]
    end
    
    B --> F
    B --> G
    B --> H
    B --> L
    
    C --> F
    C --> J
    C --> K
    
    D --> H
    D --> I
    D --> L
    D --> G
    
    E --> R
    
    F --> N
    F --> P
    G --> N
    G --> P
    H --> N
    H --> P
    I --> O
    I --> P
    J --> N
    J --> P
    K --> N
    K --> P
    L --> N
    M --> N
    
    R --> Q
    
    classDef frontend fill:#e3f2fd
    classDef service fill:#f1f8e9
    classDef data fill:#fce4ec
    
    class A,B,C,D,E frontend
    class F,G,H,I,J,K,L,M service
    class N,O,P,Q,R data
```

## State Management Flow

```mermaid
graph LR
    subgraph "Component State"
        A[useState]
        B[useEffect]
        C[Custom Hooks]
    end
    
    subgraph "Context Providers"
        D[ThemeProvider]
        E[QueryClient]
    end
    
    subgraph "External State"
        F[localStorage]
        G[sessionStorage]
        H[URL Params]
    end
    
    A --> D
    B --> E
    C --> F
    C --> G
    
    D --> I[Theme State]
    E --> J[Server State Cache]
    F --> K[User Preferences]
    G --> L[Session Data]
    H --> M[Route State]
    
    I --> N[Component Rendering]
    J --> N
    K --> N
    L --> N
    M --> N
    
    classDef stateClass fill:#e8eaf6
    classDef contextClass fill:#e0f2f1
    classDef storageClass fill:#fff8e1
    classDef renderClass fill:#fce4ec
    
    class A,B,C stateClass
    class D,E contextClass
    class F,G,H storageClass
    class N renderClass
```

## Security Architecture

```mermaid
graph TD
    A[User Input] --> B{Input Validation}
    B -->|Valid| C[Zod Schema Validation]
    B -->|Invalid| D[Error Handling]
    
    C --> E[Component Processing]
    E --> F{Sensitive Data?}
    
    F -->|Yes| G[Encryption Service]
    F -->|No| H[Direct Storage]
    
    G --> I[Encrypted localStorage]
    H --> J[Regular localStorage]
    
    I --> K[Data Retrieval]
    J --> K
    
    K --> L[Decryption Service]
    L --> M[Component Rendering]
    
    N[XSS Protection] --> E
    O[CSP Headers] --> E
    P[Input Sanitization] --> C
    
    classDef securityClass fill:#ffebee
    classDef validationClass fill:#e8f5e8
    classDef storageClass fill:#fff3e0
    classDef processClass fill:#e3f2fd
    
    class N,O,P,G,L securityClass
    class B,C,P validationClass
    class I,J,H storageClass
    class E,M,K processClass
```

## Performance Optimization Flow

```mermaid
graph TB
    A[Component Mount] --> B{Large Dataset?}
    B -->|Yes| C[Virtual Scrolling]
    B -->|No| D[Direct Render]
    
    C --> E[Windowed List]
    D --> F[Full List]
    
    E --> G[Visible Items Only]
    F --> H[All Items]
    
    G --> I{Heavy Calculations?}
    H --> I
    
    I -->|Yes| J[useMemo]
    I -->|No| K[Direct Calculation]
    
    J --> L[Memoized Results]
    K --> M[Fresh Calculation]
    
    L --> N{Component Re-render?}
    M --> N
    
    N -->|Yes| O[React.memo Check]
    N -->|No| P[Skip Re-render]
    
    O --> Q{Props Changed?}
    Q -->|Yes| R[Re-render Component]
    Q -->|No| P
    
    R --> S[Updated UI]
    P --> T[Cached UI]
    
    classDef optimizationClass fill:#e8f5e8
    classDef memoClass fill:#e1f5fe
    classDef renderClass fill:#fce4ec
    
    class C,E,J,O optimizationClass
    class L,P,T memoClass
    class R,S,D,F renderClass
```

## Refactoring Strategy Overview

```mermaid
graph TD
    subgraph "Current State (Problems)"
        A[6 TransactionList Components]
        B[7 InsightsPage Variations] 
        C[4 ScoreCircle Implementations]
        D[No Test Coverage]
        E[Security Vulnerabilities]
        F[Performance Issues]
    end
    
    subgraph "Phase 1: Foundation"
        G[Setup Testing Framework]
        H[Security Hardening]
        I[TypeScript Strict Mode]
    end
    
    subgraph "Phase 2: Consolidation"
        J[Unified TransactionList]
        K[Single InsightsPage]
        L[Shared ScoreCircle]
    end
    
    subgraph "Phase 3: Optimization"
        M[Performance Improvements]
        N[Code Splitting]
        O[Bundle Optimization]
    end
    
    subgraph "Future State (Goals)"
        P[Single Source Components]
        Q[80% Test Coverage]
        R[Secure Data Handling]
        S[Optimized Performance]
    end
    
    A --> J
    B --> K
    C --> L
    D --> G
    E --> H
    F --> M
    
    G --> Q
    H --> R
    I --> Q
    J --> P
    K --> P
    L --> P
    M --> S
    N --> S
    O --> S
    
    classDef problemClass fill:#ffebee
    classDef phaseClass fill:#e8f5e8
    classDef goalClass fill:#e3f2fd
    
    class A,B,C,D,E,F problemClass
    class G,H,I,J,K,L,M,N,O phaseClass
    class P,Q,R,S goalClass
```