// CC: Feature Cloud hero component with configurable keywords and emoji icons
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FeatureCloudProps {
  className?: string;
  keywords?: Array<{
    text: string;
    emoji: string;
    size?: 'sm' | 'md' | 'lg';
    delay?: number;
  }>;
}

// CC: Default feature keywords with financial focus
const defaultKeywords = [
  { text: 'Smart Banking', emoji: '🏦', size: 'lg' as const, delay: 0 },
  { text: 'AI Insights', emoji: '🤖', size: 'md' as const, delay: 0.1 },
  { text: 'Investment', emoji: '📈', size: 'md' as const, delay: 0.2 },
  { text: 'Budgeting', emoji: '💰', size: 'sm' as const, delay: 0.3 },
  { text: 'Goals', emoji: '🎯', size: 'sm' as const, delay: 0.4 },
  { text: 'Analytics', emoji: '📊', size: 'md' as const, delay: 0.5 },
  { text: 'Security', emoji: '🔒', size: 'sm' as const, delay: 0.6 },
  { text: 'Planning', emoji: '📋', size: 'lg' as const, delay: 0.7 },
  { text: 'Savings', emoji: '🐷', size: 'md' as const, delay: 0.8 },
  { text: 'Credit', emoji: '💳', size: 'sm' as const, delay: 0.9 }
];

// CC: Framer Motion stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10
    }
  }
};

const FeatureCloud: React.FC<FeatureCloudProps> = ({ 
  className,
  keywords = defaultKeywords 
}) => {
  // CC: Responsive sizing classes for keywords
  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'text-sm sm:text-base px-3 py-1.5';
      case 'md':
        return 'text-base sm:text-lg px-4 py-2';
      case 'lg':
        return 'text-lg sm:text-xl px-5 py-2.5';
      default:
        return 'text-base sm:text-lg px-4 py-2';
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* CC: Main hero headline with responsive typography */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-8 sm:mb-12"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
          Intelligence you can{' '}
          <span className="italic bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            bank
          </span>{' '}
          on
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/70 mt-4 max-w-3xl mx-auto px-4">
          Experience the power of intelligent financial management
        </p>
      </motion.div>

      {/* CC: Feature cloud with staggered animations */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 max-w-4xl mx-auto px-4"
      >
        {keywords.map((keyword, index) => (
          <motion.div
            key={`${keyword.text}-${index}`}
            variants={itemVariants}
            custom={keyword.delay}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              // CC: Liquid glass theme with 12px radius and surface.borderLight
              "rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md",
              "flex items-center gap-2 cursor-pointer transition-all duration-300",
              "hover:bg-white/[0.05] hover:border-white/[0.12]",
              "active:scale-95 select-none",
              getSizeClasses(keyword.size || 'md')
            )}
            style={{
              // CC: Ensure no text overflow on 320-1440px viewports
              minWidth: 'fit-content',
              maxWidth: '200px'
            }}
          >
            <span 
              className="text-xl sm:text-2xl flex-shrink-0"
              role="img" 
              aria-label={keyword.text}
            >
              {keyword.emoji}
            </span>
            <span 
              className="text-white font-medium truncate"
              title={keyword.text}
            >
              {keyword.text}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* CC: Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/2 w-24 h-24 bg-green-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default FeatureCloud;