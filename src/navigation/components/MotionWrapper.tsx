import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';

interface MotionWrapperProps {
  children: React.ReactNode;
  variant: 'bottom' | 'rail' | 'sidebar' | 'topbar';
  isVisible?: boolean;
  className?: string;
}

/**
 * MotionWrapper Component
 * Provides consistent motion animations for all navigation variants
 * Respects user's motion preferences (prefers-reduced-motion)
 */
const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  variant,
  isVisible = true,
  className,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants for different navigation types
  const getTransition = (duration: number) => ({
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    duration: shouldReduceMotion ? 0.1 : duration,
  });

  const variants = {
    bottom: {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 },
      transition: getTransition(0.6),
    },
    rail: {
      initial: { x: -80, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -80, opacity: 0 },
      transition: getTransition(0.5),
    },
    sidebar: {
      initial: { x: -288, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -288, opacity: 0 },
      transition: getTransition(0.5),
    },
    topbar: {
      initial: { y: -48, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -48, opacity: 0 },
      transition: getTransition(0.4),
    },
  };

  const currentVariant = variants[variant];

  // If motion is reduced, skip animations
  if (shouldReduceMotion) {
    return (
      <div className={cn('transition-opacity duration-150', className)}>
        {isVisible && children}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={variant}
          className={className}
          initial={currentVariant.initial}
          animate={currentVariant.animate}
          exit={currentVariant.exit}
          transition={currentVariant.transition}
          layout
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MotionWrapper;
