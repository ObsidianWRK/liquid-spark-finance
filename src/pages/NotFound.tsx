import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, HelpCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Suggest alternative routes based on the attempted path
  const getSuggestions = () => {
    const path = location.pathname.toLowerCase();
    const suggestions = [];

    if (path.includes('transaction')) {
      suggestions.push({ label: 'Transactions', path: '/transactions' });
    }
    if (path.includes('credit') || path.includes('score')) {
      suggestions.push({ label: 'Credit Score', path: '/credit-score' });
    }
    if (path.includes('saving') || path.includes('goal')) {
      suggestions.push({ label: 'Savings Goals', path: '/savings' });
    }
    if (path.includes('insight') || path.includes('report')) {
      suggestions.push({ label: 'Insights', path: '/insights' });
    }
    if (path.includes('calculator')) {
      suggestions.push({ label: 'Calculators', path: '/calculators' });
    }
    if (path.includes('profile') || path.includes('setting')) {
      suggestions.push({ label: 'Profile & Settings', path: '/profile' });
    }

    // Default suggestions if no specific matches
    if (suggestions.length === 0) {
      suggestions.push(
        { label: 'Dashboard', path: '/' },
        { label: 'Transactions', path: '/transactions' },
        { label: 'Insights', path: '/insights' }
      );
    }

    return suggestions;
  };

  const suggestions = getSuggestions();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Simple search routing based on keywords
      const query = searchQuery.toLowerCase();
      if (query.includes('transaction')) {
        navigate('/transactions');
      } else if (query.includes('credit') || query.includes('score')) {
        navigate('/credit-score');
      } else if (query.includes('saving') || query.includes('goal')) {
        navigate('/savings');
      } else if (query.includes('insight') || query.includes('report')) {
        navigate('/insights');
      } else if (query.includes('calculator')) {
        navigate('/calculators');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="space-y-4">
          <div className="text-8xl md:text-9xl font-bold text-blue-500/20 select-none">
            404
          </div>
          <div className="text-4xl">🔍</div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">Page Not Found</h1>
          <p className="text-white/70 text-base md:text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          {/* Show attempted path if it's meaningful */}
          {location.pathname !== '/' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">
                <strong>Attempted path:</strong> {location.pathname}
              </p>
            </div>
          )}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search for a page..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            Search
          </button>
        </form>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <p className="text-white/70 text-sm">Or try one of these popular pages:</p>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => navigate(suggestion.path)}
                  className="w-full text-left p-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <span className="text-white font-medium">{suggestion.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center space-x-2 py-3 px-4 text-white/70 hover:text-white hover:bg-white/[0.05] border border-white/[0.15] hover:border-white/[0.25] rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.15] hover:border-white/[0.25] rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
        </div>

        {/* Help Section */}
        <div className="pt-6 border-t border-white/[0.08]">
          <div className="flex items-center justify-center space-x-2 text-white/50 text-sm">
            <HelpCircle className="w-4 h-4" />
            <span>Still need help?</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 flex items-center justify-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black rounded"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh page</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
