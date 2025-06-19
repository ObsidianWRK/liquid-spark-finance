import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackHeaderProps {
  title: string;
  className?: string;
}

const BackHeader = ({ title, className = '' }: BackHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className={`flex items-center gap-4 mb-6 ${className}`}>
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors rounded-full py-2 px-3 bg-white/5 backdrop-blur-md border border-white/10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>
      <h1 className="text-xl font-semibold text-white flex-1 text-center mr-8">{title}</h1>
    </div>
  );
};

export default BackHeader; 