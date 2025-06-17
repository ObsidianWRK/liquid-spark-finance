import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, Shield, Sparkles, CreditCard, TrendingUp, Calculator, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  action?: string;
  nextLabel?: string;
}

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isVisible, setIsVisible] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Vueni',
      description: 'Your intelligent financial companion that makes money management effortless and insightful.',
      icon: <Sparkles className="w-8 h-8 text-blue-400" />,
      features: [
        'Track all your accounts in one place',
        'Get AI-powered financial insights',
        'Monitor your credit score',
        'Set and achieve savings goals'
      ],
      nextLabel: 'Get Started'
    },
    {
      id: 'accounts',
      title: 'Connect Your Accounts',
      description: 'Securely link your bank accounts, credit cards, and investments for a complete financial picture.',
      icon: <CreditCard className="w-8 h-8 text-green-400" />,
      features: [
        'Bank-level security with 256-bit encryption',
        'Read-only access - we never store credentials',
        'Automatic transaction categorization',
        'Real-time balance updates'
      ],
      action: 'Connect Account',
      nextLabel: 'Continue'
    },
    {
      id: 'insights',
      title: 'Smart Financial Insights',
      description: 'Discover personalized insights about your spending, savings, and financial health.',
      icon: <TrendingUp className="w-8 h-8 text-purple-400" />,
      features: [
        'Financial health score with improvement tips',
        'Spending pattern analysis',
        'Budget recommendations',
        'Goal tracking and progress'
      ],
      nextLabel: 'Explore Insights'
    },
    {
      id: 'tools',
      title: 'Powerful Financial Tools',
      description: 'Access professional-grade calculators and planning tools to optimize your finances.',
      icon: <Calculator className="w-8 h-8 text-orange-400" />,
      features: [
        'Retirement planning calculator',
        'Loan and mortgage analyzers',
        'Investment portfolio tracker',
        'ROI and compound interest tools'
      ],
      nextLabel: 'Try Tools'
    },
    {
      id: 'security',
      title: 'Your Data is Secure',
      description: 'We use industry-leading security measures to protect your financial information.',
      icon: <Shield className="w-8 h-8 text-red-400" />,
      features: [
        'End-to-end encryption',
        'Multi-factor authentication',
        'Regular security audits',
        'No data selling - ever'
      ],
      nextLabel: 'Complete Setup'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    } else {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  // Ensure we have a valid current step
  const currentStepData = steps[currentStep];
  if (!currentStepData) {
    return null; // Safety check
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className={cn(
        "w-full max-w-2xl max-h-[90vh] overflow-hidden transition-all duration-500",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        {/* Header with progress */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Getting Started</h1>
            <button
              onClick={onSkip}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Skip
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Step indicators */}
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  completedSteps.has(index) 
                    ? "bg-green-500 text-white" 
                    : index === currentStep 
                      ? "bg-blue-500 text-white" 
                      : index < currentStep 
                        ? "bg-white/20 text-white cursor-pointer hover:bg-white/30" 
                        : "bg-white/10 text-white/50 cursor-not-allowed"
                )}
                disabled={index > currentStep}
                aria-label={`Step ${index + 1}: ${step.title}`}
              >
                {completedSteps.has(index) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                {currentStepData.icon}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                {currentStepData.description}
              </p>
            </div>
          </div>

          {/* Features list */}
          <div className="space-y-3">
            {currentStepData.features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>

          {/* Action button (if applicable) */}
          {currentStepData.action && (
            <div className="text-center">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {currentStepData.action}
              </Button>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="p-6 border-t border-white/10 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="text-white/70 hover:text-white disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <span className="text-white/60 text-sm">
            {currentStep + 1} of {steps.length}
          </span>
          
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            {currentStepData.nextLabel || 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingFlow; 