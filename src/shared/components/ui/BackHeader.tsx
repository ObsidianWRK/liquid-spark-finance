import { BackButton } from '@/shared/components/ui/BackButton';

interface BackHeaderProps {
  title: string;
  className?: string;
  /** Fallback path when no history is available */
  fallbackPath?: string;
}

const BackHeader = ({
  title,
  className = '',
  fallbackPath = '/',
}: BackHeaderProps) => {
  return (
    <div className={`flex items-center gap-4 mb-6 ${className}`}>
      <BackButton
        fallbackPath={fallbackPath}
        variant="ghost"
        className="bg-white/5 backdrop-blur-md border border-white/10 hover:text-blue-400"
      />
      <h1 className="text-xl font-semibold text-white flex-1 text-center mr-8">
        {title}
      </h1>
    </div>
  );
};

export default BackHeader;
