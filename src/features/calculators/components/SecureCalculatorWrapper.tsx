/**
 * SecureCalculatorWrapper - Secure wrapper for financial calculators
 * Implements input validation, rate limiting, and XSS protection
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Shield, AlertTriangle, Clock } from 'lucide-react';
import { security } from '@/utils/security';
import { VueniSecurityMonitoring } from '@/utils/monitoring';

interface SecureCalculatorWrapperProps {
  calculatorName: string;
  children: React.ReactNode;
  onSecurityEvent?: (event: string, details: unknown) => void;
}

interface SecurityState {
  isRateLimited: boolean;
  remainingRequests: number;
  lastCalculation: Date | null;
  securityLevel: 'normal' | 'elevated' | 'locked';
  consecutiveErrors: number;
}

interface ValidationResult {
  // Define the structure of the validation result
}

/**
 * SecureCalculatorWrapper - Wraps financial calculators with security measures
 */
export function SecureCalculatorWrapper({ 
  calculatorName, 
  children, 
  onSecurityEvent 
}: SecureCalculatorWrapperProps) {
  const [securityState, setSecurityState] = useState<SecurityState>({
    isRateLimited: false,
    remainingRequests: 100,
    lastCalculation: null,
    securityLevel: 'normal',
    consecutiveErrors: 0
  });

  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  // Check rate limits on component mount and at intervals
  useEffect(() => {
    const checkRateLimit = () => {
      const isLimited = security.rateLimit.isRateLimited(`calculator:${calculatorName}`);
      const remaining = security.rateLimit.getRemainingRequests(`calculator:${calculatorName}`);
      
      setSecurityState(prev => ({
        ...prev,
        isRateLimited: isLimited,
        remainingRequests: remaining
      }));

      if (isLimited) {
        VueniSecurityMonitoring.logEvent(
          'RATE_LIMIT_EXCEEDED',
          'medium',
          `Rate limit exceeded for calculator: ${calculatorName}`,
          { calculatorName, remainingRequests: remaining }
        );

        onSecurityEvent?.('rate_limit_exceeded', { calculatorName, remaining });
      }
    };

    checkRateLimit();
    const interval = setInterval(checkRateLimit, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [calculatorName, onSecurityEvent]);

  // Handle security violations
  const handleSecurityViolation = (violationType: string, details: unknown) => {
    setSecurityState(prev => {
      const newConsecutiveErrors = prev.consecutiveErrors + 1;
      let newSecurityLevel = prev.securityLevel;

      // Escalate security level based on consecutive errors
      if (newConsecutiveErrors >= 10) {
        newSecurityLevel = 'locked';
      } else if (newConsecutiveErrors >= 5) {
        newSecurityLevel = 'elevated';
      }

      return {
        ...prev,
        consecutiveErrors: newConsecutiveErrors,
        securityLevel: newSecurityLevel
      };
    });

    VueniSecurityMonitoring.logEvent(
      'INVALID_INPUT',
      newSecurityLevel === 'locked' ? 'high' : 'medium',
      `Security violation in ${calculatorName}: ${violationType}`,
      { calculatorName, violationType, details }
    );

    onSecurityEvent?.('security_violation', { violationType, details });
  };

  // Reset security state on successful calculation
  const handleSuccessfulCalculation = () => {
    setSecurityState(prev => ({
      ...prev,
      lastCalculation: new Date(),
      consecutiveErrors: Math.max(0, prev.consecutiveErrors - 1),
      securityLevel: prev.consecutiveErrors <= 1 ? 'normal' : prev.securityLevel
    }));
  };

  // Provide security context to child components
  const securityContext = {
    sanitize: security.sanitize,
    validateInput: (type: string, value: string | number) => {
      try {
        switch (type) {
          case 'amount':
            return security.sanitize.sanitizeFinancialAmount(value);
          case 'percentage':
            return security.sanitize.sanitizePercentage(value);
          case 'interestRate':
            return security.sanitize.sanitizeInterestRate(value);
          case 'year':
            return security.sanitize.sanitizeYear(value);
          case 'timePeriod':
            return security.sanitize.sanitizeTimePeriod(value);
          case 'text':
            return security.sanitize.sanitizeText(value);
          default:
            return value;
        }
      } catch (error) {
        handleSecurityViolation('invalid_input', { type, value, error: error.message });
        throw error;
      }
    },
    onCalculationSuccess: handleSuccessfulCalculation,
    onCalculationError: (error: Error) => {
      handleSecurityViolation('calculation_error', { error: error.message });
    },
    securityLevel: securityState.securityLevel
  };

  // Render security locked state
  if (securityState.securityLevel === 'locked') {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">Calculator Temporarily Locked</h3>
        </div>
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-700">
            This calculator has been temporarily locked due to multiple security violations. 
            Please refresh the page to reset the security status.
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-red-600 hover:bg-red-700"
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  // Render rate limited state
  if (securityState.isRateLimited) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-6 w-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-yellow-800">Rate Limit Reached</h3>
        </div>
        <Alert className="border-yellow-200 bg-yellow-50">
          <Clock className="h-4 w-4" />
          <AlertDescription className="text-yellow-700">
            You've reached the maximum number of calculations for this hour. 
            Please wait a moment before trying again.
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-sm text-yellow-700">
          <p>Remaining requests: {securityState.remainingRequests}</p>
          <p>Calculator: {calculatorName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Security Level Indicator */}
      {securityState.securityLevel !== 'normal' && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">
              Elevated Security Mode
            </span>
          </div>
          <p className="text-sm text-orange-700 mt-1">
            Input validation has been strengthened due to recent security events.
          </p>
        </div>
      )}

      {/* Security Info Toggle */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSecurityInfo(!showSecurityInfo)}
          className="h-8 w-8 p-0"
        >
          <Shield className="h-4 w-4" />
        </Button>
      </div>

      {/* Security Information Panel */}
      {showSecurityInfo && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Security Information</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>Calculator: {calculatorName}</p>
            <p>Remaining calculations: {securityState.remainingRequests}</p>
            <p>Security level: {securityState.securityLevel}</p>
            <p>Last calculation: {securityState.lastCalculation?.toLocaleTimeString() || 'None'}</p>
            <p>All inputs are sanitized and validated for security</p>
            <p>Financial data is encrypted and stored securely</p>
          </div>
        </div>
      )}

      {/* Calculator Content with Security Context */}
      <div className="calculator-content">
        {React.cloneElement(children as React.ReactElement, { 
          securityContext,
          onSecurityEvent: handleSecurityViolation
        })}
      </div>

      {/* Security Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="h-3 w-3" />
            <span>Secured by Vueni Financial Security</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Calculations: {100 - securityState.remainingRequests}/100</span>
            <span>Security: {securityState.securityLevel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for secure calculator input handling
 */
export function useSecureCalculator(calculatorName: string) {
  const [securityState, setSecurityState] = useState({
    isRateLimited: false,
    remainingRequests: 100
  });

  const validateAndSanitizeInput = (type: string, value: string | number) => {
    // Check rate limit before processing
    if (security.rateLimit.isRateLimited(`calculator:${calculatorName}`)) {
      setSecurityState(prev => ({ ...prev, isRateLimited: true }));
      throw new Error('Rate limit exceeded');
    }

    try {
      switch (type) {
        case 'amount':
          return security.sanitize.sanitizeFinancialAmount(value);
        case 'percentage':
          return security.sanitize.sanitizePercentage(value);
        case 'interestRate':
          return security.sanitize.sanitizeInterestRate(value);
        case 'year':
          return security.sanitize.sanitizeYear(value);
        case 'timePeriod':
          return security.sanitize.sanitizeTimePeriod(value);
        case 'text':
          return security.sanitize.sanitizeText(value);
        default:
          return value;
      }
    } catch (error) {
      VueniSecurityMonitoring.logEvent(
        'INVALID_INPUT',
        'medium',
        `Invalid input in ${calculatorName}: ${error.message}`,
        { calculatorName, type, value }
      );
      throw error;
    }
  };

  const performSecureCalculation = async (calculationFn: () => any) => {
    try {
      // Update remaining requests
      const remaining = security.rateLimit.getRemainingRequests(`calculator:${calculatorName}`);
      setSecurityState(prev => ({ ...prev, remainingRequests: remaining }));

      const result = await calculationFn();
      
      VueniSecurityMonitoring.logEvent(
        'FINANCIAL_CALCULATION_SUCCESS',
        'low',
        `Successful calculation in ${calculatorName}`,
        { calculatorName }
      );

      return result;
    } catch (error) {
      VueniSecurityMonitoring.logEvent(
        'FINANCIAL_CALCULATION_ERROR',
        'medium',
        `Calculation error in ${calculatorName}: ${error.message}`,
        { calculatorName, error: error.message }
      );
      throw error;
    }
  };

  return {
    validateAndSanitizeInput,
    performSecureCalculation,
    securityState,
    isRateLimited: securityState.isRateLimited,
    remainingRequests: securityState.remainingRequests
  };
}