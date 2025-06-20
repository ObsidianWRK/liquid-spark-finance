import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * 🛡️ BULLETPROOF: Error Boundary for Financial Dashboard
 * Catches destructuring errors and provides graceful fallback
 */
export class FinancialDashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error details for debugging
    console.error('🚨 FinancialDashboard Error Boundary caught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    this.setState({ error, errorInfo });

    // Track destructuring-specific errors
    if (error.message.includes('destructur') || 
        error.message.includes('Cannot read property') ||
        error.message.includes('is not iterable')) {
      console.error('💥 DESTRUCTURING ERROR DETECTED:', error.message);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="bg-red-900/20 rounded-2xl border border-red-500/30 p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-red-400/70 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Dashboard Error</h3>
          <p className="text-white/60 mb-4">
            The financial dashboard encountered an error while loading data.
          </p>
          
          {/* Technical details for debugging */}
          {this.state.error && (
            <details className="mb-4 text-left">
              <summary className="text-white/80 cursor-pointer hover:text-white transition-colors">
                Technical Details
              </summary>
              <div className="mt-2 p-3 bg-black/30 rounded-lg text-sm text-white/70 font-mono">
                <div className="mb-2">
                  <strong>Error:</strong> {this.state.error.message}
                </div>
                {this.state.error.stack && (
                  <div className="text-xs opacity-60 max-h-32 overflow-auto">
                    {this.state.error.stack}
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={this.handleRetry}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Dashboard
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-white/10 hover:bg-white/20 text-white/80 hover:text-white px-6 py-2 rounded-xl transition-colors"
            >
              Reload Page
            </button>
          </div>

          {/* Safe fallback content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { title: 'Financial Metrics', description: 'Data temporarily unavailable' },
              { title: 'Spending Analysis', description: 'Data temporarily unavailable' },
              { title: 'Investment Overview', description: 'Data temporarily unavailable' },
              { title: 'Budget Summary', description: 'Data temporarily unavailable' }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-4"
              >
                <h4 className="font-semibold text-white/80">{item.title}</h4>
                <p className="text-white/50 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 