import React from 'react';
import { cn } from '@/shared/lib/utils';

interface FullScreenSpinnerProps {
  message?: string;
  className?: string;
}

export const FullScreenSpinner: React.FC<FullScreenSpinnerProps> = ({ 
  message = "Loading...",
  className 
}) => (
  <div className={cn("min-h-screen flex items-center justify-center bg-black", className)}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-white/70">{message}</p>
    </div>
  </div>
);

export default FullScreenSpinner; 