
import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import { Trophy, TrendingUp, Star, Share, Award, Sparkles } from 'lucide-react';
import { mockReportService, WrappedData } from '@/features/mockReportService';

const WrappedPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const wrappedData = mockReportService.getWrappedData(2024);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const slides = [
    {
      title: "Your 2024 Financial Journey",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome to Your</h2>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Financial Wrapped 2024
          </h1>
          <p className="text-white/70 text-lg">Let's look back at your amazing financial year!</p>
        </div>
      )
    },
    {
      title: "Total Spending",
      content: (
        <div className="text-center space-y-6">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">You spent a total of</h2>
          <div className="text-5xl font-bold text-white mb-2">
            ${wrappedData.totalSpent.toLocaleString()}
          </div>
          <p className="text-white/70">across {wrappedData.topMerchants.reduce((acc, m) => acc + m.visits, 0)} transactions</p>
          <div className="mt-8 p-4 bg-green-500/20 rounded-lg border border-green-500/30">
            <p className="text-green-400 font-medium">
              💰 You saved ${wrappedData.totalSaved.toLocaleString()} this year!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Top Merchants",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Your Favorite Places</h2>
            <p className="text-white/70">Where you spent the most in 2024</p>
          </div>
          
          <div className="space-y-4">
            {wrappedData.topMerchants.slice(0, 5).map((merchant, index) => (
              <GlassCard key={merchant.name} className="p-4 glass-secondary">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-white">{merchant.name}</p>
                      <p className="text-white/70 text-sm">{merchant.visits} visits</p>
                    </div>
                  </div>
                  <p className="font-bold text-white">${merchant.amount.toLocaleString()}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Biggest Purchase",
      content: (
        <div className="text-center space-y-6">
          <Award className="w-16 h-16 text-purple-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Your Biggest Splurge</h2>
          
          <GlassCard className="p-6 glass-primary max-w-sm mx-auto">
            <div className="space-y-4">
              <div className="text-3xl font-bold text-white">
                ${wrappedData.biggestPurchase.amount.toLocaleString()}
              </div>
              <div>
                <p className="text-lg font-medium text-white">{wrappedData.biggestPurchase.merchant}</p>
                <p className="text-white/70">
                  {new Date(wrappedData.biggestPurchase.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </GlassCard>
          
          <p className="text-white/70">Hope it was worth it! 🎉</p>
        </div>
      )
    },
    {
      title: "Categories Improved",
      content: (
        <div className="text-center space-y-6">
          <TrendingUp className="w-16 h-16 text-green-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">You Crushed It! 🎯</h2>
          <p className="text-white/70 text-lg">Categories where you spent less than last year</p>
          
          <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
            {wrappedData.categoriesImproved.map((category) => (
              <GlassCard key={category} className="p-4 glass-green">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">✅</span>
                  <span className="font-medium text-white">{category}</span>
                </div>
              </GlassCard>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-green-500/20 rounded-lg border border-green-500/30">
            <p className="text-green-400 font-medium">
              You saved an extra ${wrappedData.savingsVsPreviousYear.toLocaleString()} compared to 2023!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Financial Score",
      content: (
        <div className="text-center space-y-6">
          <div className="relative w-32 h-32 mx-auto">
            <div className="w-32 h-32 rounded-full border-8 border-white/20 flex items-center justify-center">
              <div className="text-4xl font-bold text-white">
                {wrappedData.financialScore}/10
              </div>
            </div>
            <div 
              className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-green-400 border-t-transparent border-r-transparent transition-all duration-1000"
              style={{ 
                transform: `rotate(${(wrappedData.financialScore / 10) * 360}deg)`,
                transformOrigin: 'center'
              }}
            />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Financial Health Score</h2>
            <p className="text-white/70 text-lg">
              {wrappedData.financialScore >= 8 ? "Excellent! 🌟" :
               wrappedData.financialScore >= 6 ? "Good progress! 👍" :
               "Keep improving! 💪"}
            </p>
          </div>
          
          <GlassCard className="p-4 glass-blue max-w-sm mx-auto">
            <p className="text-white text-sm">
              Based on your saving habits, spending control, and budget adherence throughout 2024.
            </p>
          </GlassCard>
        </div>
      )
    },
    {
      title: "Share Your Story",
      content: (
        <div className="text-center space-y-6">
          <Share className="w-16 h-16 text-blue-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Share Your Success!</h2>
          <p className="text-white/70">Let your friends see how well you managed your finances in 2024</p>
          
          <div className="space-y-4">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Share on Social Media
            </button>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg transition-colors border border-white/20">
              Download as Image
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
            <p className="text-blue-400 font-medium text-sm">
              🎉 Here's to an even better 2025!
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div>
      {/* WHY: Removed min-h-screen and flex to prevent double scroll */}
      {/* Progress Bar */}
      <div className="w-full bg-white/10 h-1 mb-6">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-8rem)]">
        <GlassCard 
          className={`w-full max-w-md p-8 glass-primary transition-all duration-500 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
        >
          <div className="min-h-[400px] flex flex-col justify-center">
            {slides[currentSlide].content}
          </div>
        </GlassCard>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-6">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 text-white rounded-lg transition-colors"
        >
          Previous
        </button>
        
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-blue-400' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-white/5 disabled:text-white/30 text-white rounded-lg transition-colors"
        >
          {currentSlide === slides.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default WrappedPage;
