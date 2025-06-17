import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, ChevronRight, ChevronLeft, Target, Lightbulb, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

interface HelpTooltip {
  id: string;
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface GuidedTourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ContextualHelpProps {
  page: string;
  showTour?: boolean;
  onTourComplete?: () => void;
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({ page, showTour = false, onTourComplete }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tourActive, setTourActive] = useState(showTour);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const pageHelpData: Record<string, { tooltips: HelpTooltip[]; tour: GuidedTourStep[] }> = {
    dashboard: {
      tooltips: [
        {
          id: 'balance-card',
          target: '[data-help="balance-card"]',
          title: 'Account Balance',
          content: 'Your total available balance across all connected accounts. Click to see details.',
          position: 'bottom'
        },
        {
          id: 'net-worth',
          target: '[data-help="net-worth"]',
          title: 'Net Worth',
          content: 'Your total assets minus liabilities. This gives you a complete picture of your financial position.',
          position: 'top'
        }
      ],
      tour: [
        {
          id: 'welcome',
          target: '[data-help="dashboard-header"]',
          title: 'Welcome to Your Dashboard',
          content: 'This is your financial command center. Here you can see all your accounts, recent transactions, and key metrics at a glance.',
          position: 'bottom'
        },
        {
          id: 'accounts',
          target: '[data-help="accounts-section"]',
          title: 'Your Accounts',
          content: 'All your connected bank accounts, credit cards, and investments are displayed here with real-time balances.',
          position: 'top'
        },
        {
          id: 'transactions',
          target: '[data-help="transactions-section"]',
          title: 'Recent Transactions',
          content: 'Your latest financial activity is shown here. Click any transaction for more details or to categorize it.',
          position: 'top'
        }
      ]
    },
    insights: {
      tooltips: [
        {
          id: 'financial-score',
          target: '[data-help="financial-score"]',
          title: 'Financial Health Score',
          content: 'This score is calculated based on your spending habits, savings rate, debt-to-income ratio, and other financial factors.',
          position: 'bottom'
        },
        {
          id: 'spending-trends',
          target: '[data-help="spending-trends"]',
          title: 'Spending Trends',
          content: 'See how your spending patterns change over time and identify areas where you can optimize.',
          position: 'left'
        }
      ],
      tour: [
        {
          id: 'scores',
          target: '[data-help="insight-scores"]',
          title: 'Your Financial Scores',
          content: 'These scores give you a quick overview of your financial health across different areas.',
          position: 'bottom'
        },
        {
          id: 'recommendations',
          target: '[data-help="recommendations"]',
          title: 'Personalized Recommendations',
          content: 'Based on your data, we provide actionable insights to help improve your financial health.',
          position: 'top'
        }
      ]
    },
    calculators: {
      tooltips: [
        {
          id: 'calculator-list',
          target: '[data-help="calculator-list"]',
          title: 'Financial Calculators',
          content: 'Access professional-grade tools to plan your retirement, analyze loans, and optimize investments.',
          position: 'right'
        }
      ],
      tour: [
        {
          id: 'tools-overview',
          target: '[data-help="calculators-header"]',
          title: 'Financial Planning Tools',
          content: 'These calculators help you make informed financial decisions with accurate projections.',
          position: 'bottom'
        }
      ]
    }
  };

  const currentPageData = pageHelpData[page] || { tooltips: [], tour: [] };
  const currentTourData = currentPageData.tour[currentTourStep];

  useEffect(() => {
    if (tourActive && currentPageData.tour.length > 0) {
      const targetElement = document.querySelector(currentTourData?.target || '');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [tourActive, currentTourStep, currentTourData, currentPageData.tour.length]);

  const handleNextTourStep = () => {
    if (currentTourStep < currentPageData.tour.length - 1) {
      setCurrentTourStep(currentTourStep + 1);
    } else {
      setTourActive(false);
      setCurrentTourStep(0);
      onTourComplete?.();
    }
  };

  const handlePrevTourStep = () => {
    if (currentTourStep > 0) {
      setCurrentTourStep(currentTourStep - 1);
    }
  };

  const handleSkipTour = () => {
    setTourActive(false);
    setCurrentTourStep(0);
    onTourComplete?.();
  };

  const helpCenterContent = {
    'Getting Started': [
      'How to connect your first account',
      'Understanding your financial health score',
      'Setting up savings goals',
      'Navigating the dashboard'
    ],
    'Account Management': [
      'Adding and removing accounts',
      'Updating account information',
      'Troubleshooting connection issues',
      'Security and privacy settings'
    ],
    'Financial Tools': [
      'Using the retirement calculator',
      'Analyzing loan options',
      'Investment tracking basics',
      'Budget planning features'
    ]
  };

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setShowHelpCenter(true)}
        className="fixed bottom-24 right-6 z-40 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
        aria-label="Help and Support"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Guided Tour Overlay */}
      {tourActive && currentTourData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Card className="max-w-md p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-white/70">
                      Step {currentTourStep + 1} of {currentPageData.tour.length}
                    </span>
                  </div>
                  <button
                    onClick={handleSkipTour}
                    className="text-white/50 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {currentTourData.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {currentTourData.content}
                  </p>
                </div>

                {currentTourData.action && (
                  <div className="text-center">
                    <Button
                      onClick={currentTourData.action.onClick}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      {currentTourData.action.label}
                    </Button>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <Button
                    variant="ghost"
                    onClick={handlePrevTourStep}
                    disabled={currentTourStep === 0}
                    className="text-white/70 hover:text-white disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <Button
                    onClick={handleNextTourStep}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {currentTourStep === currentPageData.tour.length - 1 ? 'Finish' : 'Next'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Help Center Modal */}
      {showHelpCenter && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Help Center</h2>
                </div>
                <button
                  onClick={() => setShowHelpCenter(false)}
                  className="text-white/50 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(helpCenterContent).map(([category, items]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <button
                          key={index}
                          className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 border border-white/10"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h4 className="text-white font-semibold mb-2">Need More Help?</h4>
                <p className="text-white/70 text-sm mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Contact Support
                  </Button>
                  <Button
                    onClick={() => setTourActive(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Take a Tour
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default ContextualHelp; 