# 💰 Vueni

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.11-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

A comprehensive personal finance management application built with React, TypeScript, and TailwindCSS. Features advanced analytics, budgeting tools, investment tracking, and 12 specialized financial calculators.

## ✨ Features

- **📊 Financial Dashboard** - Real-time overview of accounts, transactions, and financial health
- **💳 Transaction Management** - Smart categorization with health, eco, and financial scoring
- **📈 Budget Planning** - Category-based budgets with alerts and historical tracking
- **💼 Investment Tracking** - Portfolio overview with performance metrics and goal tracking
- **🧮 Financial Calculators** - 12 specialized calculators including compound interest, loan payments, and retirement planning
- **📱 Responsive Design** - Mobile-first approach with liquid glass UI components
- **🌙 Dark Mode** - Full dark/light theme support
- **🔐 Secure Storage** - Client-side encryption for sensitive financial data

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0.0 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/vueni.git
   cd vueni
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build with development optimizations
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🏗️ Architecture

### Tech Stack

| Technology   | Version | Purpose                              |
| ------------ | ------- | ------------------------------------ |
| React        | 18.3.1  | Frontend framework                   |
| TypeScript   | 5.5.3   | Type safety and developer experience |
| Vite         | 5.4.1   | Build tool and development server    |
| TailwindCSS  | 3.4.11  | Utility-first CSS framework          |
| Radix UI     | Various | Accessible UI primitives             |
| React Query  | 5.56.2  | Server state management              |
| React Router | 6.26.2  | Client-side routing                  |
| Recharts     | 2.15.3  | Data visualization                   |

### Project Structure

```
src/
├── components/          # UI components organized by feature
│   ├── ai/             # AI chat integration
│   ├── budget/         # Budget planning components
│   ├── calculators/    # Financial calculators (12 types)
│   ├── credit/         # Credit score management
│   ├── insights/       # Analytics and insights
│   ├── transactions/   # Transaction management
│   └── ui/             # Reusable base components
├── hooks/              # Custom React hooks
├── pages/              # Route components
├── services/           # Business logic and API calls
├── styles/             # CSS modules and themes
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and helpers
```

## 📊 Financial Calculators

The application includes 12 specialized financial calculators:

1. **Compound Interest** - Calculate investment growth over time
2. **Loan Payment** - Monthly payment calculations for loans
3. **Mortgage Payoff** - Early payoff scenarios and savings
4. **ROI Calculator** - Return on investment analysis
5. **Retirement 401k** - Retirement savings projections
6. **Financial Freedom** - Calculate years until financial independence
7. **Home Affordability** - Maximum home price based on income
8. **Inflation Calculator** - Future value adjusted for inflation
9. **Three-Fund Portfolio** - Bogleheads investment strategy returns
10. **Stock Backtest** - Historical portfolio performance
11. **Exchange Rate** - Currency conversion utilities
12. **Investment Tracker** - Portfolio performance monitoring

## 🔧 Development

### Code Quality

The project uses strict TypeScript configuration and ESLint for code quality:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Performance Optimizations

- **Code Splitting** - Dynamic imports for calculator components
- **Memoization** - React.memo and useMemo for expensive calculations
- **Virtual Scrolling** - Efficient rendering of large transaction lists
- **Bundle Optimization** - Tree shaking and dynamic imports

### Security Features

- **Input Validation** - Zod schemas for all form inputs
- **XSS Protection** - DOMPurify for sanitizing user content
- **Secure Storage** - Encrypted localStorage for sensitive data
- **CSP Headers** - Content Security Policy implementation

## 🧪 Testing

The project uses modern testing tools:

- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing

```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

## 📱 Mobile Support

The application is fully responsive with:

- **Mobile-first design** - Optimized for small screens
- **Touch-friendly interactions** - Gesture support for navigation
- **Progressive Web App** - Offline capability and app-like experience
- **Performance optimization** - Reduced bundle size for mobile networks

## 🌐 Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment Options

- **Vercel** - Recommended for React applications
- **Netlify** - Alternative static hosting
- **AWS S3 + CloudFront** - Enterprise-grade hosting
- **Docker** - Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://vueni.vercel.app](https://vueni.vercel.app)
- **Documentation**: [docs/README.md](docs/README.md)
- **API Reference**: [docs/API.md](docs/API.md)
- **Component Library**: [docs/COMPONENTS.md](docs/COMPONENTS.md)
