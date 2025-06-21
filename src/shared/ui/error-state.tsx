import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

interface ErrorStateProps {
  error?: Error | string;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  className?: string;
  retryText?: string;
  backText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  title = 'Something went wrong',
  message,
  onRetry,
  onBack,
  className,
  retryText = 'Try Again',
  backText = 'Go Back',
}) => {
  const errorMessage =
    message ||
    (error instanceof Error
      ? error.message
      : String(error || 'An unexpected error occurred'));

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center bg-black',
        className
      )}
    >
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 rounded-vueni-pill bg-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-red-400 mb-4">{title}</h2>
        <p className="text-white/70 mb-6">{errorMessage}</p>
        <div className="flex gap-3 justify-center">
          {onBack && (
            <Button onClick={onBack} variant="outline">
              {backText}
            </Button>
          )}
          {onRetry && (
            <Button onClick={onRetry} variant="default">
              {retryText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
